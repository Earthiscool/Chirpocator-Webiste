import type {MetadataRoute} from 'next'

import {siteUrl} from '@/lib/site'
import {sanityFetchStatic} from '@/sanity/fetch'
import {sitemapQuery} from '@/sanity/queries'

type Row = {slug: string; _updatedAt: string}
type Data = {pathways: Row[]; services: Row[]; articles: Row[]; providers: Row[]; legal: Row[]}

export const revalidate = 3600

/** XML sitemap of published, indexable pages only (no drafts, studio, or API). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetchStatic<Data>(sitemapQuery)
  const fixed = ['/', '/start-here', '/how-we-help', '/about', '/team', '/resources', '/faq', '/for-providers', '/book']
  const rows = (prefix: string, list?: Row[], priority = 0.7) =>
    (list ?? []).map((r) => ({url: siteUrl(`${prefix}${r.slug}`), lastModified: new Date(r._updatedAt), priority}))
  return [
    ...fixed.map((p) => ({url: siteUrl(p), priority: p === '/' ? 1 : 0.8})),
    ...rows('/how-we-help/', data?.pathways, 0.9),
    ...rows('/services/', data?.services, 0.8),
    ...rows('/team/', data?.providers, 0.6),
    ...rows('/resources/', data?.articles, 0.6),
    ...rows('/', data?.legal, 0.2),
  ]
}
