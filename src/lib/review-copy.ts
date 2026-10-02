import 'server-only'

import reviewCopy from '../../content/redesign-review.json'

/** Local/preview review copy. Never used by chat retrieval or production deployments.
 * Existing published data remains the default. Native Sanity drafts are reviewed
 * through Presentation; scripts/rebuild-drafts.mjs prepares those patches.
 */
export const isRedesignReview = () =>
  process.env.IWC_REDESIGN_REVIEW === 'true' && process.env.VERCEL_ENV !== 'production'

const copy = reviewCopy as Record<string, Record<string, unknown>>

function merge(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const result = {...base}
  for (const [key, value] of Object.entries(patch)) {
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? merge((base[key] as Record<string, unknown>) ?? {}, value as Record<string, unknown>)
        : value
  }
  return result
}

export function applyReviewCopy<T>(data: T): T {
  if (!isRedesignReview() || !data) return data
  function walk(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(walk)
    if (!value || typeof value !== 'object') return value
    const object = value as Record<string, unknown>
    const id = typeof object._id === 'string' ? object._id.replace(/^drafts\./, '') : ''
    const next = copy[id] ? merge(object, copy[id]) : object
    return Object.fromEntries(Object.entries(next).map(([key, item]) => [key, walk(item)]))
  }
  return walk(data) as T
}
