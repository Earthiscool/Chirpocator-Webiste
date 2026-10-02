#!/usr/bin/env node
/**
 * Local stand-in for third-party APIs during automated tests:
 *   - OpenAI Responses API (streaming SSE)   POST /v1/responses
 *   - Resend email + audiences               POST /emails, /audiences/:id/contacts
 * Every request body is recorded so tests can assert exactly what the
 * application sent (e.g. that drafts and personal data never leave the server).
 * GET /__last/:kind returns the most recent body for openai | email | audience.
 */
import http from 'node:http'

const port = Number(process.env.MOCK_PORT || 4010)
const last = {openai: null, email: null, audience: null}
const counts = {openai: 0, email: 0, audience: 0}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => resolve(data))
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`)

  if (req.method === 'GET' && url.pathname.startsWith('/__last/')) {
    const kind = url.pathname.split('/').pop()
    res.writeHead(200, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify({body: last[kind] ?? null, count: counts[kind] ?? 0}))
  }

  const raw = await readBody(req)
  let body = null
  try {
    body = raw ? JSON.parse(raw) : null
  } catch {
    body = raw
  }

  if (req.method === 'POST' && url.pathname === '/v1/responses') {
    last.openai = {body, auth: req.headers.authorization}
    counts.openai++
    const reply =
      'IWC has four pathways. If something keeps coming back, [Pain + Recovery](/how-we-help/pain-recovery) is a good place to start, or try [Start Here](/start-here). You can also call the office.'
    res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive'})
    const send = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({type, ...data})}\n\n`)
    send('response.created', {response: {id: 'resp_test', status: 'in_progress'}, sequence_number: 0})
    const parts = reply.match(/.{1,24}/g) ?? []
    let seq = 1
    for (const delta of parts) {
      send('response.output_text.delta', {delta, item_id: 'msg_test', output_index: 0, content_index: 0, sequence_number: seq++})
      await new Promise((r) => setTimeout(r, 5))
    }
    send('response.completed', {
      response: {id: 'resp_test', status: 'completed', usage: {input_tokens: 1200, output_tokens: 60, total_tokens: 1260}},
      sequence_number: seq,
    })
    return res.end()
  }

  if (req.method === 'POST' && url.pathname === '/emails') {
    last.email = {body, auth: req.headers.authorization}
    counts.email++
    res.writeHead(200, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify({id: `email_${counts.email}`}))
  }

  if (req.method === 'POST' && /^\/audiences\/[^/]+\/contacts$/.test(url.pathname)) {
    last.audience = {body, path: url.pathname}
    counts.audience++
    res.writeHead(200, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify({id: 'contact_test'}))
  }

  res.writeHead(404)
  res.end()
})

server.listen(port, () => console.log(`[mock] listening on ${port}`))
