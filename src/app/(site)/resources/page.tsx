import type {Metadata} from 'next'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import {NewsletterForm} from '@/components/forms/NewsletterForm'
import {ArticleCards, PageHero, SectionShell, topicName} from '@/components/sections'
import {Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {articlesQuery, resourcesPageQuery} from '@/sanity/queries'
import type {ArticleCard, ResourcesPage} from '@/sanity/types'

type Props = {searchParams: Promise<{topic?: string}>}

const getData = () =>
  Promise.all([
    sanityFetch<ResourcesPage>({query: resourcesPageQuery, tags: ['resourcesPage']}),
    sanityFetch<ArticleCard[]>({query: articlesQuery, tags: ['article']}),
  ])

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await getData()
  return buildMetadata({
    seo: page?.seo,
    title: 'Resources & Articles | IWC Wayne, PA',
    description: page?.intro,
    path: '/resources',
  })
}

export default async function ResourcesPageRoute({searchParams}: Props) {
  const [[page, articles], {topic}] = await Promise.all([getData(), searchParams])
  const topics = [...new Set((articles ?? []).map((a) => stegaClean(a.topic)))]
  const shown = topic ? (articles ?? []).filter((a) => stegaClean(a.topic) === topic) : (articles ?? [])

  return (
    <>
      <PageHero eyebrow={page?.eyebrow || 'Resources'} title={page?.headline || 'Resources'} intro={page?.intro} />
      <SectionShell tone="white">
        {topics.length > 1 && (
          <nav aria-label="Filter by topic" className="mb-12">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/resources"
                  aria-current={!topic ? 'page' : undefined}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-navy-900 aria-[current=page]:border-navy-900 aria-[current=page]:bg-navy-900 aria-[current=page]:text-white"
                >
                  All
                </Link>
              </li>
              {topics.map((t) => (
                <li key={t}>
                  <Link
                    href={`/resources?topic=${t}`}
                    aria-current={topic === t ? 'page' : undefined}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-navy-900 aria-[current=page]:border-navy-900 aria-[current=page]:bg-navy-900 aria-[current=page]:text-white"
                  >
                    {topicName(t)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {shown.length ? (
          <ArticleCards articles={shown} headingLevel="h2" />
        ) : (
          <p className="text-muted">
            New articles are on the way. In the meantime, the FAQ answers the questions we hear most.
          </p>
        )}
      </SectionShell>
      <section className="border-t border-line bg-teal-100 text-navy-900">
        <div className="container-site section-y grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow tone="teal" className="mb-4">
              Clinical updates
            </Eyebrow>
            <h2 className="display-md">{page?.newsletterHeading || 'Practical insight, occasionally'}</h2>
            {page?.newsletterBody && <p className="mt-4 text-muted">{page.newsletterBody}</p>}
            {page?.substackUrl && (
              <a
                href={page.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-semibold text-teal-700 underline underline-offset-4"
              >
                Read on Substack <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
          <div className="self-end lg:col-span-5 lg:col-start-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
