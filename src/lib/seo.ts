import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import {imageUrl} from '@/sanity/image'
import type {Seo} from '@/sanity/types'

import {getSettings, siteUrl} from './site'

/** Build page metadata from CMS SEO fields, with canonical + Open Graph. */
export async function buildMetadata({
  seo,
  title,
  description,
  path,
  type = 'website',
}: {
  seo?: Seo | null
  title: string
  description?: string
  path: string
  type?: 'website' | 'article'
}): Promise<Metadata> {
  const settings = await getSettings()
  const finalTitle = stegaClean(seo?.title || title)
  const finalDescription = stegaClean(seo?.description || description || settings.defaultSeo?.description || '')
  const img = seo?.image?.asset ? seo.image : settings.defaultSeo?.image
  const ogImage = img?.asset ? [{url: imageUrl(img, 1200, 630), width: 1200, height: 630, alt: img.alt || ''}] : undefined
  const canonical = siteUrl(path)

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {canonical},
    robots: seo?.noIndex ? {index: false, follow: true} : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      type,
      siteName: settings.practiceName,
      ...(ogImage ? {images: ogImage} : {}),
    },
    twitter: {card: 'summary_large_image', title: finalTitle, description: finalDescription},
  }
}
