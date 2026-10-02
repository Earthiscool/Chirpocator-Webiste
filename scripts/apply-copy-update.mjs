#!/usr/bin/env node
/**
 * Publish rewritten seed copy to the CMS without clobbering anyone's edits.
 *
 *   node --env-file=.env.local scripts/apply-copy-update.mjs <old-seed-dir>          # dry run
 *   node --env-file=.env.local scripts/apply-copy-update.mjs <old-seed-dir> --apply  # publish
 *
 * <old-seed-dir> holds the PREVIOUS content-core.mjs / content-pages.mjs / pt.mjs.
 * A field is updated only when the published value still equals the previous
 * seed value (ignoring Portable Text _key ids). Fields edited in the Studio,
 * images, and anything not in the seed are left untouched.
 */
import path from 'node:path'
import {pathToFileURL} from 'node:url'

import {createClient} from '@sanity/client'

const [oldDir, flag] = process.argv.slice(2)
if (!oldDir) throw new Error('Usage: apply-copy-update.mjs <old-seed-dir> [--apply]')
const apply = flag === '--apply'

const load = async (dir) => {
  const core = await import(pathToFileURL(path.resolve(dir, 'content-core.mjs')).href)
  const pages = await import(pathToFileURL(path.resolve(dir, 'content-pages.mjs')).href)
  const docs = [
    core.siteSettings, core.navigation, ...core.bookingOptions, ...core.providers, ...core.pathways, ...core.services,
    ...pages.faqs, ...pages.articles, pages.homePage, pages.startHerePage, pages.aboutPage, pages.teamPage,
    pages.resourcesPage, pages.providersPage, pages.bookingPage, pages.faqPage, ...pages.legalPages, ...pages.chatKnowledge,
  ]
  return new Map(docs.map((d) => [d._id, d]))
}

/**
 * Compare values while ignoring generated ids: drop _key, drop link-mark
 * references (random per seed run), and sort object keys.
 */
const canon = (v) => {
  if (Array.isArray(v)) return v.map(canon)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v).sort()) {
      if (k === '_key') continue
      out[k] = k === 'marks' && Array.isArray(v[k]) ? v[k].filter((m) => m === 'strong' || m === 'em') : canon(v[k])
    }
    return out
  }
  return v
}
const norm = (v) => JSON.stringify(canon(v))

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-09-01',
  useCdn: false,
})

const oldSeed = await load(oldDir)
const newSeed = await load('scripts/seed')
const published = new Map((await client.fetch('*[_id in $ids]', {ids: [...newSeed.keys()]})).map((d) => [d._id, d]))

let tx = client.transaction()
let changes = 0
const skipped = []
for (const [id, next] of newSeed) {
  const prev = oldSeed.get(id)
  const live = published.get(id)
  if (!prev || !live) continue
  const set = {}
  for (const key of Object.keys(next)) {
    if (key.startsWith('_') || !(key in prev)) continue
    if (norm(prev[key]) === norm(next[key])) continue // copy didn't change
    if (norm(live[key]) !== norm(prev[key])) {
      skipped.push(`${id}.${key}`) // edited since seeding — leave it
      continue
    }
    set[key] = next[key]
  }
  if (Object.keys(set).length) {
    changes += Object.keys(set).length
    tx = tx.patch(id, (p) => p.set(set))
    console.log(`${id}: ${Object.keys(set).join(', ')}`)
  }
}
console.log(`\n${changes} field(s) to update${skipped.length ? `; kept ${skipped.length} edited field(s): ${skipped.join(', ')}` : ''}`)
if (apply && changes) {
  await tx.commit({visibility: 'sync'})
  console.log('Published.')
} else if (!apply) console.log('Dry run. Add --apply to publish.')
