#!/usr/bin/env node
/**
 * End-to-end CMS publishing workflow check, against a running site:
 *
 *   npm run build && npx next start -p 3200 &
 *   node --env-file=.env.local scripts/cms-workflow-test.mjs http://localhost:3200
 *
 * For an FAQ, an article, a team profile, and a homepage section it verifies:
 *   draft saved → NOT visible publicly → visible in Preview (draft mode)
 *   → publish → visible publicly → revise + publish → updated publicly
 *   → unpublish → gone publicly → original content restored.
 *
 * It performs the same document operations the Studio performs (drafts.* ids,
 * publish = replace published + remove draft, unpublish = remove published,
 * keep draft), using the editor-role token. Preview uses a real Studio-style
 * preview secret; cache refresh uses a correctly signed Sanity webhook.
 */
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'
import {encodeSignatureHeader} from '@sanity/webhook'

const BASE = process.argv[2] || 'http://localhost:3200'
const {NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = 'production', SANITY_API_WRITE_TOKEN: token, SANITY_REVALIDATE_SECRET: hookSecret} =
  process.env
if (!projectId || !token || !hookSecret) throw new Error('Run with --env-file=.env.local')

const client = createClient({projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false})
const results = []
const log = (ok, step, detail = '') => {
  results.push({ok, step})
  console.log(`${ok ? '✓' : '✗'} ${step}${detail ? `  (${detail})` : ''}`)
}

/* ---------------------------------------------------------------- helpers */
async function page(path, cookie) {
  const res = await fetch(BASE + path, {headers: cookie ? {cookie} : {}, cache: 'no-store'})
  return {status: res.status, html: await res.text()}
}

/** Poll until the condition holds (Sanity's API CDN propagates within seconds). */
async function waitFor(fn, label, timeoutMs = 45_000) {
  const start = Date.now()
  for (;;) {
    if (await fn()) return log(true, label, `${((Date.now() - start) / 1000).toFixed(1)}s`)
    if (Date.now() - start > timeoutMs) return log(false, label, 'timed out')
    await new Promise((r) => setTimeout(r, 1500))
  }
}

async function webhook(type) {
  const body = JSON.stringify({_type: type})
  const signature = await encodeSignatureHeader(body, Date.now(), hookSecret)
  const res = await fetch(`${BASE}/api/revalidate`, {method: 'POST', headers: {'content-type': 'application/json', 'sanity-webhook-signature': signature}, body})
  if (!res.ok) throw new Error(`webhook failed ${res.status}`)
}

let previewCookie = ''
async function enablePreview(pathname) {
  const {secret} = await createPreviewSecret(client, 'cms-workflow-test', '/studio')
  const res = await fetch(`${BASE}/api/draft-mode/enable?sanity-preview-secret=${secret}&sanity-preview-pathname=${encodeURIComponent(pathname)}`, {redirect: 'manual'})
  const cookies = res.headers.getSetCookie().map((c) => c.split(';')[0])
  previewCookie = cookies.join('; ')
  log(res.status >= 300 && res.status < 400 && previewCookie.includes('__prerender_bypass'), 'Preview mode enabled with a Studio-issued secret', `HTTP ${res.status}`)
}

const saveDraft = (doc) => client.createOrReplace({...doc, _id: `drafts.${doc._id}`})
async function publish(id, type) {
  const draft = await client.getDocument(`drafts.${id}`)
  await client.transaction().createOrReplace({...strip(draft), _id: id}).delete(`drafts.${id}`).commit({visibility: 'sync'})
  await webhook(type)
}
async function unpublish(id, type) {
  const pub = await client.getDocument(id)
  await client.transaction().createIfNotExists({...strip(pub), _id: `drafts.${id}`}).delete(id).commit({visibility: 'sync'})
  await webhook(type)
}

/* --------------------------------------------------------------- scenario */
async function cycle({name, type, original, edit, revise, path, listPath, marker1, marker2, canUnpublish = true, isNew = false}) {
  console.log(`\n— ${name} —`)
  const id = edit._id

  await saveDraft(edit)
  log(true, `Editor saved a draft (${id})`)
  const pub1 = await page(path)
  log(!pub1.html.includes(marker1), 'Draft is NOT visible on the public site')

  await enablePreview(path)
  const pre = await page(path, previewCookie)
  log(pre.status === 200 && pre.html.includes(marker1), 'Draft IS visible in Preview', `HTTP ${pre.status}`)
  log(pre.html.includes('Preview mode:'), 'Preview banner shown to the editor')

  await publish(id, type)
  log(true, 'Editor published')
  await waitFor(async () => (await page(path)).html.includes(marker1), `Published change visible at ${path}`)
  if (listPath) await waitFor(async () => (await page(listPath)).html.includes(marker1), `Also listed at ${listPath}`)

  await saveDraft(revise)
  await publish(id, type)
  await waitFor(async () => {
    const h = (await page(path)).html
    return h.includes(marker2) && !h.includes(marker1)
  }, 'Revision published and visible (old text gone)')

  if (canUnpublish) {
    await unpublish(id, type)
    await waitFor(async () => {
      const r = await page(path)
      return isNew ? r.status === 404 : !r.html.includes(marker2)
    }, `Unpublished: no longer on the public site${isNew ? ' (404)' : ''}`)
  }

  // Restore the original state.
  if (isNew) {
    await client.transaction().delete(id).delete(`drafts.${id}`).commit({visibility: 'sync'})
  } else {
    await client.transaction().createOrReplace(original).delete(`drafts.${id}`).commit({visibility: 'sync'})
  }
  await webhook(type)
  if (!isNew) await waitFor(async () => !(await page(path)).html.includes(marker2), 'Original content restored')
}

async function main() {
  // 1) FAQ — update an existing entry.
  const faq = await client.getDocument('faq-what-to-bring')
  const faqEdit = (q) => ({...strip(faq), question: q})
  await cycle({
    name: 'FAQ',
    type: 'faq',
    original: strip(faq),
    edit: faqEdit('What should I bring? [WORKFLOW-TEST-1]'),
    revise: faqEdit('What should I bring? [WORKFLOW-TEST-2]'),
    path: '/faq',
    marker1: 'WORKFLOW-TEST-1',
    marker2: 'WORKFLOW-TEST-2',
  })

  // 2) Article — a brand-new entry.
  const art = (title) => ({
    _id: 'article-workflow-test',
    _type: 'article',
    title,
    slug: {_type: 'slug', current: 'workflow-test-article'},
    excerpt: 'Temporary article used to verify the publishing workflow.',
    topic: 'active-aging',
    publishedAt: new Date().toISOString(),
    body: [{_type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{_type: 'span', _key: 's1', text: 'Test body.', marks: []}]}],
  })
  await cycle({
    name: 'Article',
    type: 'article',
    edit: art('Workflow test ARTICLE-MARK-1'),
    revise: art('Workflow test ARTICLE-MARK-2'),
    path: '/resources/workflow-test-article',
    listPath: '/resources',
    marker1: 'ARTICLE-MARK-1',
    marker2: 'ARTICLE-MARK-2',
    isNew: true,
  })

  // 3) Team profile — edit an existing provider's headline (referenced by services, so not unpublished).
  const amie = await client.getDocument('provider-amie-hamel')
  await cycle({
    name: 'Team profile',
    type: 'provider',
    original: strip(amie),
    edit: {...strip(amie), headline: 'PROFILE-MARK-1 — finds where tension is coming from.'},
    revise: {...strip(amie), headline: 'PROFILE-MARK-2 — finds where tension is coming from.'},
    path: '/team/amie-hamel',
    listPath: '/team',
    marker1: 'PROFILE-MARK-1',
    marker2: 'PROFILE-MARK-2',
    canUnpublish: false,
  })

  // 4) Homepage section — the recognition closing line.
  const home = await client.getDocument('homePage')
  await cycle({
    name: 'Homepage section',
    type: 'homePage',
    original: strip(home),
    edit: {...strip(home), recognitionCoda: 'HOME-MARK-1 Start understanding why.'},
    revise: {...strip(home), recognitionCoda: 'HOME-MARK-2 Start understanding why.'},
    path: '/',
    marker1: 'HOME-MARK-1',
    marker2: 'HOME-MARK-2',
    canUnpublish: false,
  })

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  process.exit(failed.length ? 1 : 0)
}

/** Remove system fields so a document can be written back. */
function strip(doc) {
  const rest = {...doc}
  for (const k of ['_rev', '_updatedAt', '_createdAt']) delete rest[k]
  return rest
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
