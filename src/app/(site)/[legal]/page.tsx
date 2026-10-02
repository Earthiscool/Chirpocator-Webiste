import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {RichText} from '@/components/RichText'
import {Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {legalPageQuery} from '@/sanity/queries'
import type {LegalPage} from '@/sanity/types'

type Props = {params: Promise<{legal: string}>}

const getPage = (slug: string) => sanityFetch<LegalPage>({query: legalPageQuery, params: {slug}, tags: ['legalPage']})

export function generateStaticParams() {
  return ['privacy', 'terms', 'accessibility', 'disclaimer'].map((legal) => ({legal}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {legal} = await params
  const page = await getPage(legal)
  if (!page) return {}
  return buildMetadata({seo: page.seo, title: page.title, description: page.intro, path: `/${legal}`})
}

/** Privacy, terms, accessibility, disclaimer — all edited in the CMS. */
export default async function LegalPageRoute({params}: Props) {
  const {legal} = await params
  const page = await getPage(legal)
  if (!page) notFound()
  return (
    <article className="container-site max-w-4xl py-14 md:py-20">
      <Eyebrow className="mb-4">
        Last updated{' '}
        {new Date(page.lastUpdated).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </Eyebrow>
      <h1 className="article-title text-navy-900">{page.title}</h1>
      {page.intro && <p className="lede mt-5 text-muted">{page.intro}</p>}
      <RichText value={page.body} className="mt-10" />
    </article>
  )
}
