import type {MetadataRoute} from 'next'

import {siteUrl} from '@/lib/site'

/**
 * Production: allow crawling except CMS/API.
 * Any non-production deployment (previews, staging) is fully disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.SITE_INDEXABLE === 'true'
  if (!isProd) return {rules: [{userAgent: '*', disallow: '/'}]}
  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/studio', '/api/']}],
    sitemap: siteUrl('/sitemap.xml'),
  }
}
