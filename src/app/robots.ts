import type {MetadataRoute} from 'next'

import {siteUrl} from '@/lib/site'

/**
 * Indexing is OPT-IN: search engines are blocked everywhere (local, previews,
 * and Vercel production) until SITE_INDEXABLE=true is set for the approved,
 * launched site. This keeps unapproved working copy out of search results.
 */
export default function robots(): MetadataRoute.Robots {
  if (
    process.env.SITE_INDEXABLE !== 'true' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.IWC_REDESIGN_REVIEW === 'true'
  )
    return {rules: [{userAgent: '*', disallow: '/'}]}
  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/studio', '/api/']}],
    sitemap: siteUrl('/sitemap.xml'),
  }
}
