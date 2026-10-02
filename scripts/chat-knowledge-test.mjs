#!/usr/bin/env node
/**
 * Verifies the assistant's knowledge layer against the real CMS:
 *  1. a DRAFT FAQ is never sent to the model;
 *  2. once PUBLISHED (+ webhook), it is retrieved automatically — no prompt edits;
 *  3. once removed, it disappears again.
 *
 * Needs the mock API server and a site instance pointed at it:
 *   node tests/mocks/server.mjs &
 *   OPENAI_API_KEY=test OPENAI_BASE_URL=http://localhost:4010/v1 npx next start -p 3300 &
 *   node --env-file=.env.local scripts/chat-knowledge-test.mjs http://localhost:3300
 */
import {createClient} from '@sanity/client'
import {encodeSignatureHeader} from '@sanity/webhook'

const BASE = process.argv[2] || 'http://localhost:3300'
const MOCK = 'http://localhost:4010'
const env = process.env
const client = createClient({projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: env.SANITY_API_WRITE_TOKEN, apiVersion: '2026-09-01', useCdn: false})

const MARK = `KNOWLEDGE-${Date.now()}`
const ID = 'faq-knowledge-test'
const doc = {
  _id: ID,
  _type: 'faq',
  category: 'scheduling',
  order: 99,
  includeInChat: true,
  question: `Is there parking near the office? (${MARK})`,
  answer: [{_type: 'block', _key: 'a', style: 'normal', markDefs: [], children: [{_type: 'span', _key: 'b', text: `Test answer ${MARK}.`, marks: []}]}],
}

let failures = 0
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`)
  if (!ok) failures++
}
async function ask() {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: {'content-type': 'application/json', origin: BASE},
    body: JSON.stringify({messages: [{role: 'user', content: 'Is there parking near the office?'}]}),
  })
  await res.text()
  const last = await (await fetch(`${MOCK}/__last/openai`)).json()
  return last.body.body.instructions
}
async function webhook() {
  const body = JSON.stringify({_type: 'faq'})
  await fetch(`${BASE}/api/revalidate`, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'sanity-webhook-signature': await encodeSignatureHeader(body, Date.now(), env.SANITY_REVALIDATE_SECRET)},
    body,
  })
}

try {
  await client.createOrReplace({...doc, _id: `drafts.${ID}`})
  check(!(await ask()).includes(MARK), 'Draft FAQ is NOT included in the assistant context')

  await client.transaction().createOrReplace(doc).delete(`drafts.${ID}`).commit({visibility: 'sync'})
  await webhook()
  check((await ask()).includes(MARK), 'Published FAQ IS retrieved for a matching question (no prompt changes)')

  await client.delete(ID)
  await webhook()
  check(!(await ask()).includes(MARK), 'Removed FAQ is no longer used')
} finally {
  await client.transaction().delete(ID).delete(`drafts.${ID}`).commit().catch(() => {})
}
process.exit(failures ? 1 : 0)
