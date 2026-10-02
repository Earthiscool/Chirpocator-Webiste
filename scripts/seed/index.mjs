#!/usr/bin/env node
/**
 * Seed the Sanity dataset with IWC's initial (working-copy) content.
 *
 *   node --env-file=.env.local scripts/seed/index.mjs           # create missing docs only
 *   node --env-file=.env.local scripts/seed/index.mjs --force   # overwrite seeded docs (destroys edits!)
 *
 * Optional: SEED_ASSETS_DIR=/path/to/photos uploads team headshots
 * (dr-jenn-hartmann.jpg, dr-irene-londer.png, amie-hamel.jpg) to the CMS.
 * Photos are deliberately NOT stored in the git repository.
 */
import fs from 'node:fs'
import path from 'node:path'

import {createClient} from '@sanity/client'

import {bookingOptions, navigation, pathways, providers, services, siteSettings} from './content-core.mjs'
import {
  aboutPage,
  articles,
  bookingPage,
  chatKnowledge,
  faqPage,
  faqs,
  homePage,
  legalPages,
  providersPage,
  resourcesPage,
  startHerePage,
  teamPage,
} from './content-pages.mjs'

const {NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = 'production', SANITY_API_WRITE_TOKEN: token} =
  process.env

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. Run with --env-file=.env.local')
  process.exit(1)
}

const force = process.argv.includes('--force')
const client = createClient({projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false})

const headshots = {
  'provider-jenn-hartmann': {file: 'dr-jenn-hartmann.jpg', alt: 'Dr. Jenn Hartmann smiling, wearing glasses and a white polo shirt'},
  'provider-irene-londer': {file: 'dr-irene-londer.png', alt: 'Dr. Irene Londer smiling, wearing navy scrubs'},
  'provider-amie-hamel': {file: 'amie-hamel.jpg', alt: 'Amie Hamel, LMT, smiling, wearing glasses and a patterned scarf'},
}

async function attachHeadshots(docs) {
  const dir = process.env.SEED_ASSETS_DIR
  if (!dir) {
    console.log('· SEED_ASSETS_DIR not set, skipping headshot upload')
    return
  }
  for (const doc of docs) {
    const shot = headshots[doc._id]
    const file = shot && path.join(dir, shot.file)
    if (!file || !fs.existsSync(file)) continue
    const asset = await client.assets.upload('image', fs.createReadStream(file), {filename: shot.file})
    doc.photo = {
      _type: 'accessibleImage',
      asset: {_type: 'reference', _ref: asset._id},
      alt: shot.alt,
      credit: 'Interim photo from the current iwcmainline.com site, replace after the brand photo shoot.',
    }
    console.log(`· uploaded ${shot.file}`)
  }
}

async function main() {
  await attachHeadshots(providers)

  const docs = [
    siteSettings,
    navigation,
    ...bookingOptions,
    ...providers,
    ...pathways,
    ...services,
    ...faqs,
    ...articles,
    homePage,
    startHerePage,
    aboutPage,
    teamPage,
    resourcesPage,
    providersPage,
    bookingPage,
    faqPage,
    ...legalPages,
    ...chatKnowledge,
  ]

  // References must resolve, so write everything in one transaction.
  const tx = client.transaction()
  for (const doc of docs) {
    if (force) tx.createOrReplace(doc)
    else tx.createIfNotExists(doc)
  }
  const result = await tx.commit({visibility: 'sync'})
  console.log(`✓ ${force ? 'wrote' : 'ensured'} ${docs.length} documents (${result.results.length} mutations)`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
