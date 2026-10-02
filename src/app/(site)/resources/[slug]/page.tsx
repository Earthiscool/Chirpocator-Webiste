import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {ResourceTracker} from '@/components/analytics/ResourceTracker'
import {ArrowLeft, ArrowRight} from '@/components/icons'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {ArticleCards, SectionShell, topicName} from '@/components/sections'
import {ArticleJsonLd, BreadcrumbJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {getSettings} from '@/lib/site'
import {sanityFetch, sanityFetchStatic} from '@/sanity/fetch'
import {imageUrl} from '@/sanity/image'
import {articleQuery, articleSlugsQuery} from '@/sanity/queries'
import type {Article} from '@/sanity/types'

type Props = {params: Promise<{slug: string}>}

const getArticle = (slug: string) => sanityFetch<Article>({query: articleQuery, params: {slug}, tags: ['article', 'pathway', 'service', 'provider']})

export async function generateStaticParams() {
  const slugs = (await sanityFetchStatic<string[]>(articleSlugsQuery)) ?? []
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const a = await getArticle(slug)
  if (!a) return {}
  return buildMetadata({seo: a.seo, title: `${a.title} | IWC`, description: a.excerpt, path: `/resources/${slug}`, type: 'article'})
}

export default async function ArticlePage({params}: Props) {
  const {slug} = await params
  const [a, settings] = await Promise.all([getArticle(slug), getSettings()])
  if (!a) notFound()
  const date = new Date(a.publishedAt)

  return (
    <>
      <ResourceTracker slug={slug} topic={stegaClean(a.topic)} />
      <ArticleJsonLd
        title={stegaClean(a.title)}
        description={stegaClean(a.excerpt)}
        path={`/resources/${slug}`}
        publishedAt={a.publishedAt}
        author={a.author ? stegaClean(a.author.name) : undefined}
        image={a.mainImage?.asset ? imageUrl(a.mainImage, 1200, 630) : undefined}
        publisher={settings.practiceName}
      />
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          {name: 'Resources', path: '/resources'},
          {name: stegaClean(a.title), path: `/resources/${slug}`},
        ]}
      />
      <article>
        <header className="border-b border-line bg-paper">
          <div className="container-site max-w-4xl pb-14 pt-10 md:pt-16">
            <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:underline">
              <ArrowLeft className="size-4" aria-hidden /> Resources
            </Link>
            <Eyebrow tone="teal" className="mb-4 mt-10">
              {topicName(a.topic)}
            </Eyebrow>
            <h1 className="display-xl text-navy-900">{a.title}</h1>
            <p className="lede mt-6 text-muted">{a.excerpt}</p>
            <p className="mt-8 text-sm text-muted">
              {a.author ? (
                <>
                  By{' '}
                  <Link href={`/team/${a.author.slug}`} className="font-semibold text-navy-900 underline underline-offset-4">
                    {a.author.name}
                  </Link>{' '}
                  ·{' '}
                </>
              ) : (
                <>IWC · </>
              )}
              <time dateTime={a.publishedAt}>{date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</time>
              {a.readingMinutes ? ` · ${Math.max(1, a.readingMinutes)} min read` : ''}
            </p>
          </div>
        </header>
        {a.mainImage?.asset && (
          <div className="container-site max-w-5xl pt-10">
            <SanityImg image={a.mainImage} aspect={16 / 9} sizes="(min-width: 1024px) 1000px, 100vw" priority className="rounded-2xl" />
          </div>
        )}
        <div className="container-site max-w-4xl py-14 md:py-20">
          <RichText value={a.body} className="text-[1.0625rem] md:text-[1.125rem]" />
          <p className="mt-14 max-w-[68ch] border-t border-line pt-6 text-sm text-muted">
            This article is general education, not medical advice. Your situation may be different, and an individual evaluation is the right place to make decisions about your care.
          </p>
        </div>
      </article>

      {/* Soft next step: article → pathway → booking */}
      {a.pathway && (
        <section className="on-navy bg-navy-900 text-white" data-track="article-next-step">
          <div className="container-site grid gap-8 py-14 md:grid-cols-12 md:items-center md:py-16">
            <div className="md:col-span-7">
              <Eyebrow tone="on-navy" className="mb-3">
                Sound like you?
              </Eyebrow>
              <p className="font-display text-[1.75rem] italic leading-tight">&ldquo;{a.pathway.patientVoice}&rdquo;</p>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <ButtonLink href={`/how-we-help/${a.pathway.slug}`} variant="primary-on-navy" arrow>
                Explore {a.pathway.title}
              </ButtonLink>
              <ButtonLink href="/start-here" variant="secondary-on-navy">
                Start Here
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      {!!a.services?.length && (
        <SectionShell tone="paper" className="!py-14">
          <h2 className="eyebrow mb-5 text-navy-900">Related</h2>
          <ul className="grid gap-x-8 md:grid-cols-3">
            {a.services.map((s) => (
              <li key={s._id}>
                <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 border-t border-line py-4 font-semibold text-navy-900">
                  {s.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      {!!a.related?.length && (
        <SectionShell tone="white">
          <h2 className="display-sm mb-10 text-navy-900">Keep reading</h2>
          <ArticleCards articles={a.related} />
        </SectionShell>
      )}
    </>
  )
}
