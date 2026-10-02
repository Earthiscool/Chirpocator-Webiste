/** Review copy -> new Sanity drafts only. Default: read-only plan. Never publishes. */
import {createClient} from '@sanity/client'
import {readFile, writeFile, mkdir} from 'node:fs/promises'

const args = process.argv.slice(2)
const applying = args.includes('--apply-drafts')
const rollbackFile = args.find((x) => x.startsWith('--rollback='))?.slice('--rollback='.length)
const token = process.env.SANITY_API_WRITE_TOKEN
if ((applying || rollbackFile) && !token) throw new Error('A Sanity editor token is required. No changes made.')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-01',
  useCdn: false,
  perspective: 'raw',
  ...(token ? {token} : {}),
})

if (rollbackFile) {
  const backup = JSON.parse(await readFile(rollbackFile, 'utf8'))
  const current = await client.getDocuments(backup.created.map((d) => d._id))
  for (let i = 0; i < current.length; i++)
    if (!current[i] || current[i]._rev !== backup.created[i]._rev)
      throw new Error('A review draft changed since creation. Refusing to delete client edits.')
  let tx = client.transaction()
  for (const doc of backup.created)
    tx = tx.delete({query: `*[_id == ${JSON.stringify(doc._id)} && _rev == ${JSON.stringify(doc._rev)}]`})
  await tx.commit({visibility: 'sync'})
  const remaining = (await client.getDocuments(backup.created.map((d) => d._id))).filter(Boolean)
  if (remaining.length)
    throw new Error('A draft changed during rollback and was preserved. Review remaining drafts manually.')
  console.log(`Removed ${backup.created.length} unchanged review drafts. Published records untouched.`)
  process.exit(0)
}

const copy = JSON.parse(await readFile(new URL('../content/redesign-review.json', import.meta.url), 'utf8'))
const ids = Object.keys(copy)
const published = await client.fetch('*[_id in $ids]', {ids})
if (published.length !== ids.length) throw new Error('A source document is missing. No changes made.')
console.log(
  JSON.stringify(
    {
      mode: applying ? 'draft creation' : 'read-only plan',
      documents: ids.map((id) => ({
        id,
        fields: Object.keys(copy[id]),
        sourceRevision: published.find((d) => d._id === id)._rev,
      })),
    },
    null,
    2,
  ),
)
if (!applying) process.exit(0)
const draftIds = ids.map((id) => 'drafts.' + id)
const existing = await client.getDocuments(draftIds)
if (existing.some(Boolean))
  throw new Error('At least one client draft already exists. Refusing to overwrite any draft. No changes made.')

function merge(base, patch) {
  if (Array.isArray(patch)) return patch
  if (patch && typeof patch === 'object')
    return Object.fromEntries(
      [...new Set([...Object.keys(base ?? {}), ...Object.keys(patch)])].map((k) => [
        k,
        k in patch ? merge(base?.[k], patch[k]) : base[k],
      ]),
    )
  return patch
}
let tx = client.transaction()
for (const source of published) {
  const doc = merge(source, copy[source._id])
  for (const key of ['_rev', '_createdAt', '_updatedAt']) delete doc[key]
  doc._id = 'drafts.' + source._id
  doc.editorialReview = {
    _type: 'editorialReview',
    status: 'working',
    notes: 'IWC visual rebuild copy. Client and clinical review required before publication.',
  }
  if (doc.pageHeadings) doc.pageHeadings._type = 'pageHeadings'
  if (doc.nextSteps)
    doc.nextSteps = doc.nextSteps.map((s) => ({
      ...s,
      _type: doc._type === 'pathway' ? 'nextStep' : 'serviceNextStep',
      cta: {...s.cta, _type: 'cta'},
    }))
  if (doc.movementPrinciples) doc.movementPrinciples = doc.movementPrinciples.map((s) => ({...s, _type: 'titledItem'}))
  if (doc.toolGroups)
    doc.toolGroups = doc.toolGroups.map((s) => ({
      ...s,
      _type: 'toolGroup',
      ...(s.cta ? {cta: {...s.cta, _type: 'cta'}} : {}),
    }))
  // create fails atomically if a draft appeared after our read. Never createOrReplace.
  tx = tx.create(doc)
}
await mkdir('tmp/rebuild-backups', {recursive: true})
const path = `tmp/rebuild-backups/drafts-${Date.now()}.json`
await writeFile(path, JSON.stringify({published, created: draftIds.map((_id) => ({_id})), pending: true}, null, 2))
// Record the revisions returned by this transaction. A follow-up read could
// capture an editor's intervening change and wrongly treat it as our draft.
const created = await tx.commit({visibility: 'sync', returnDocuments: true, returnFirst: false})
await writeFile(
  path,
  JSON.stringify({published, created: created.map((d) => ({_id: d._id, _rev: d._rev})), pending: false}, null, 2),
)
console.log(`Created ${created.length} drafts. Backup: ${path}. No published document changed.`)
