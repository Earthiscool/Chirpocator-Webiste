import {stegaClean} from 'next-sanity'

import {siteUrl} from '@/lib/site'
import type {SiteSettings} from '@/sanity/types'

/** Serialize JSON-LD safely (escapes "<" so content can't break out of the script tag). */
function JsonLdScript({data}: {data: object}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(stegaClean(data)).replace(/</g, '\\u003c')}}
    />
  )
}

/**
 * LocalBusiness (Chiropractor) data. Only published when an editor has ticked
 * "Publish business details to search engines" in Site settings, confirming
 * the name/address/phone match the Google Business Profile.
 */
export function OrganizationJsonLd({settings: s}: {settings: SiteSettings}) {
  if (!s.publishStructuredData || !s.address?.street) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Chiropractor',
    '@id': siteUrl('/#practice'),
    name: s.practiceName,
    url: siteUrl('/'),
    telephone: s.phoneE164,
    email: s.email,
    slogan: s.brandLine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [s.address.street, s.address.suite].filter(Boolean).join(', '),
      addressLocality: s.address.city,
      addressRegion: s.address.region,
      postalCode: s.address.postalCode,
      addressCountry: 'US',
    },
    areaServed: [
      {'@type': 'City', name: 'Wayne, PA'},
      {'@type': 'Place', name: 'Philadelphia Main Line'},
    ],
    sameAs: s.socials?.map((x) => x.url) ?? [],
  }
  return <JsonLdScript data={data} />
}

export function BreadcrumbJsonLd({items}: {items: {name: string; path: string}[]}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({'@type': 'ListItem', position: i + 1, name: it.name, item: siteUrl(it.path)})),
  }
  return <JsonLdScript data={data} />
}

export function ArticleJsonLd({
  title,
  description,
  path,
  publishedAt,
  author,
  image,
  publisher,
}: {
  title: string
  description: string
  path: string
  publishedAt: string
  author?: string
  image?: string
  publisher: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: siteUrl(path),
    datePublished: publishedAt,
    author: author ? {'@type': 'Person', name: author} : {'@type': 'Organization', name: publisher},
    publisher: {'@type': 'Organization', name: publisher},
    ...(image ? {image} : {}),
  }
  return <JsonLdScript data={data} />
}

export function PersonJsonLd({name, jobTitle, path, image, practice}: {name: string; jobTitle: string; path: string; image?: string; practice: string}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url: siteUrl(path),
    worksFor: {'@type': 'Organization', name: practice, '@id': siteUrl('/#practice')},
    ...(image ? {image} : {}),
  }
  return <JsonLdScript data={data} />
}
