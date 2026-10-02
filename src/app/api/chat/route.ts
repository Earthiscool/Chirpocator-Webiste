import OpenAI from 'openai'
import {z} from 'zod'

import {assistantConfigured} from '@/lib/chat/availability'
import {loadKnowledge, selectContext} from '@/lib/chat/knowledge'
import {buildInstructions} from '@/lib/chat/prompt'
import {emergencyReply, isEmergency, redactSensitive} from '@/lib/chat/safety'
import {clientKey, isSameOrigin, limiters} from '@/lib/rate-limit'
import {getPublishedSettings} from '@/lib/site'

export const maxDuration = 60

const MAX_BODY_BYTES = 24_000

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(12)
    .refine((m) => m[m.length - 1].role === 'user', 'Last message must be from the user')
    .refine((m) => m.filter((x) => x.role === 'user').every((x) => x.content.length <= 800), 'Message too long'),
})

const json = (status: number, code: string, message: string, extra: Record<string, string> = {}) =>
  Response.json({error: code, message}, {status, headers: {'Cache-Control': 'no-store', ...extra}})

/** Lets the widget show an "unavailable" state without sending a message. */
export async function GET() {
  const settings = await getPublishedSettings()
  return Response.json(
    {available: assistantConfigured(settings.assistantEnabled !== false)},
    {headers: {'Cache-Control': 'no-store'}},
  )
}

export async function POST(req: Request) {
  const started = Date.now()

  // 1. Cheap checks first.
  if (!isSameOrigin(req.headers)) return json(403, 'forbidden', 'Requests must come from this website.')
  const length = Number(req.headers.get('content-length') ?? 0)
  if (length > MAX_BODY_BYTES) return json(413, 'too_large', 'That message is too long.')

  const key = clientKey(req.headers)
  let burst, daily
  try {
    ;[burst, daily] = await Promise.all([limiters.chatBurst.limit(key), limiters.chatDaily.limit(key)])
  } catch {
    return json(503, 'unavailable', 'The assistant is temporarily unavailable. Please contact the office.')
  }
  if (!burst.success || !daily.success) {
    return json(
      429,
      'rate_limited',
      'You have sent a lot of messages. Please wait a few minutes, or call the office.',
      {
        'Retry-After': String(
          Math.max(1, Math.ceil(((burst.success ? daily.reset : burst.reset) - Date.now()) / 1000)),
        ),
      },
    )
  }

  // 2. Validate.
  let body: z.infer<typeof Body>
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) return json(413, 'too_large', 'That message is too long.')
    body = Body.parse(JSON.parse(raw))
  } catch {
    return json(400, 'invalid', 'Please send a shorter question in plain text.')
  }

  const settings = await getPublishedSettings()
  const latest = body.messages[body.messages.length - 1].content

  // 3. Emergency screen, answer directly, never send to the model.
  if (isEmergency(latest)) {
    log({outcome: 'emergency', ms: Date.now() - started})
    return new Response(emergencyReply(settings.phone), {
      headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-IWC-Safety': 'emergency'},
    })
  }

  // 4. Without an API key, report unavailability honestly, no fake replies.
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || !assistantConfigured(settings.assistantEnabled !== false)) {
    log({outcome: 'unconfigured', ms: Date.now() - started})
    return json(
      503,
      'unavailable',
      `The assistant isn't available right now. Please call ${settings.phone} or email ${settings.email}.`,
    )
  }

  // 5. Redact identifiers from every user turn before it leaves our server.
  let redacted = false
  const input = body.messages.map((m) => {
    if (m.role !== 'user') return {role: m.role, content: m.content}
    const r = redactSensitive(m.content)
    if (r.redacted && m === body.messages[body.messages.length - 1]) redacted = true
    return {role: m.role, content: r.text}
  })

  // 6. Ground in published CMS content.
  const chunks = await loadKnowledge()
  if (!chunks.length)
    return json(503, 'unavailable', `Practice information is temporarily unavailable. Please call ${settings.phone}.`)
  const recentUserText = body.messages
    .filter((m) => m.role === 'user')
    .slice(-2)
    .map((m) => m.content)
    .join(' ')
  const context = selectContext(chunks, recentUserText)
  const instructions = buildInstructions(context, {redacted})

  const openai = new OpenAI({apiKey})
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini'
  const effort = (process.env.OPENAI_REASONING_EFFORT || 'low') as 'minimal' | 'low' | 'medium'

  let stream: Awaited<ReturnType<typeof openai.responses.create>> & AsyncIterable<OpenAI.Responses.ResponseStreamEvent>
  try {
    stream = (await openai.responses.create(
      {
        model,
        instructions,
        input,
        stream: true,
        store: false, // do not retain conversations at OpenAI for later retrieval
        max_output_tokens: Math.max(100, Math.min(1200, Number(process.env.OPENAI_MAX_OUTPUT_TOKENS) || 900)),
        ...(model.startsWith('gpt-5') || model.startsWith('o') ? {reasoning: {effort}} : {}),
        safety_identifier: key, // hashed, non-identifying; helps OpenAI detect abuse
      },
      {timeout: 30_000, maxRetries: 0, signal: AbortSignal.any([req.signal, AbortSignal.timeout(30_000)])},
    )) as typeof stream
  } catch (e) {
    const status = (e as {status?: number}).status
    log({outcome: 'upstream_error', status, ms: Date.now() - started})
    return json(
      502,
      'upstream',
      `The assistant is having trouble right now. Please call ${settings.phone} or email ${settings.email}.`,
    )
  }

  // 7. Stream plain text to the browser.
  const encoder = new TextEncoder()
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let chars = 0
      try {
        for await (const event of stream) {
          if (event.type === 'response.output_text.delta') {
            const delta = event.delta.slice(0, Math.max(0, 6000 - chars))
            chars += delta.length
            controller.enqueue(encoder.encode(delta))
            if (chars >= 6000) {
              ;(stream as unknown as {controller?: AbortController}).controller?.abort()
              break
            }
          } else if (event.type === 'response.completed') {
            const u = event.response.usage
            log({
              outcome: 'ok',
              model,
              ms: Date.now() - started,
              in: u?.input_tokens,
              out: u?.output_tokens,
              ctx: context.length,
            })
          } else if (event.type === 'error' || event.type === 'response.failed') {
            throw new Error('stream_failed')
          }
        }
        if (chars === 0)
          controller.enqueue(encoder.encode(`I'm not able to answer that right now. Please call ${settings.phone}.`))
      } catch {
        log({outcome: 'stream_error', ms: Date.now() - started})
        controller.enqueue(
          encoder.encode(`\n\nSorry, the connection dropped. Please try again, or call ${settings.phone}.`),
        )
      } finally {
        controller.close()
      }
    },
    cancel() {
      ;(stream as unknown as {controller?: AbortController}).controller?.abort()
    },
  })

  return new Response(body$, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

/** Operational logging only, never message content. */
function log(fields: Record<string, unknown>) {
  console.info('[chat]', JSON.stringify(fields))
}
