import 'server-only'

import {draftMode} from 'next/headers'
import type {QueryParams} from 'next-sanity'

import {client} from './client'
import {isSanityConfigured} from './env'

/** Fallback revalidation if the publish webhook is not configured. */
const REVALIDATE_SECONDS = 300

/**
 * Fetch CMS content for server components.
 *
 * - Public visitors: published content only, cached and tagged by document
 *   type so the Sanity publish webhook (/api/revalidate) can refresh it.
 * - Draft mode (enabled from the Studio's Preview tool): drafts are read with
 *   a server-side viewer token, uncached, with click-to-edit markers.
 *
 * Returns `null` when the CMS is not configured or unreachable so pages can
 * render their empty states instead of crashing.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags: string[]
}): Promise<T | null> {
  if (!isSanityConfigured) return null

  const {isEnabled: isDraft} = await draftMode()

  try {
    if (isDraft) {
      const token = process.env.SANITY_API_READ_TOKEN
      if (!token) throw new Error('SANITY_API_READ_TOKEN is required for draft previews')
      return await client
        .withConfig({token, useCdn: false, perspective: 'drafts', stega: {enabled: true}})
        .fetch<T>(query, params, {cache: 'no-store'})
    }
    return await client.fetch<T>(query, params, {
      next: {revalidate: REVALIDATE_SECONDS, tags},
    })
  } catch (error) {
    console.error('[sanity] fetch failed', {tags, message: (error as Error).message})
    return null
  }
}

/** Static-generation helper: always published, never draft. */
export async function sanityFetchStatic<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  if (!isSanityConfigured) return null
  try {
    return await client.fetch<T>(query, params, {next: {revalidate: REVALIDATE_SECONDS}})
  } catch {
    return null
  }
}
