import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from './env'

/**
 * Tokenless client: can only read *published* documents in the public
 * dataset. Drafts are never reachable through this client.
 *
 * useCdn is false on purpose: Next.js already caches every response and the
 * publish webhook revalidates by tag. Reading Sanity's live API avoids a race
 * where a page regenerates from a CDN copy that is a second out of date.
 */
export const client = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: {studioUrl},
})
