import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {FaqList} from '@/components/Faqs'
import {ArrowRight} from '@/components/icons'
import {Reveal} from '@/components/Reveal'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {accentOf, CheckList, CtaBand, ItemGrid, PageHero, SectionShell, Testimonials} from '@/components/sections'
import {BreadcrumbJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, CtaButton, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch, sanityFetchStatic} from '@/sanity/fetch'
import {pathwayQuery, pathwaySlugsQuery} from '@/sanity/queries'
import type {Pathway} from '@/sanity/types'

type Props = {params: Promise<{slug: string}>}

const getPathway = (slug: string) =>
  sanityFetch<Pathway>({query: pathwayQuery, params: {slug}, tags: ['pathway', 'service', 'faq', 'testimonial']})

export async function generateStaticParams() {
  const slugs = (await sanityFetchStatic<string[]>(pathwaySlugsQuery)) ?? []
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const p = await getPathway(slug)
  if (!p) return {}
  return buildMetadata({seo: p.seo, title: `${p.title} | IWC Wayne, PA`, description: p.cardSummary, path: `/how-we-help/${slug}`})
}

export default async function PathwayPage({params}: Props) {
  const {slug} = await params
  const p = await getPathway(slug)
  if (!p) notFound()
  const a = accentOf(p.accent)
  const bookingCta = p.primaryCta?.href ? p.primaryCta : {label: 'Book a Visit', href: '/book'}

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          {name: 'How We Help', path: '/how-we-help'},
          {name: stegaClean(p.title), path: `/how-we-help/${slug}`},
        ]}
      />
      <PageHero
        eyebrow={p.title}
        accent={stegaClean(p.accent)}
        title={p.heroHeadline}
        intro={p.heroIntro}
        aside={
          p.heroImage?.asset ? (
            <SanityImg image={p.heroImage} aspect={4 / 5} sizes="(min-width: 1024px) 38vw, 100vw" priority className="rounded-[1.75rem]" />
          ) : (
            <figure className="on-navy relative overflow-hidden rounded-[1.75rem] bg-navy-900 p-8 text-white md:p-10">
              <span className={`absolute inset-y-0 left-0 w-1 ${a.bar}`} aria-hidden />
              <p className="eyebrow text-gold-400">In your words</p>
              <blockquote className="mt-5 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] italic leading-[1.15]">
                &ldquo;{p.patientVoice}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm leading-relaxed text-navy-100">{p.cardSummary}</figcaption>
            </figure>
          )
        }
      >
        <CtaButton cta={bookingCta} variant="book" track="pathway-hero" />
        <ButtonLink href="/start-here" variant="link" arrow track="pathway-hero">
          Not sure? Start Here
        </ButtonLink>
      </PageHero>

      {!!p.recognition?.length && (
        <SectionShell tone="white">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Is this for me?</Eyebrow>
              <h2 className="display-md text-navy-900">Sound familiar?</h2>
            </div>
            <div className="lg:col-span-8">
              <CheckList items={p.recognition} columns={2} />
            </div>
          </div>
        </SectionShell>
      )}

      {(p.approach?.length || p.outcomes?.length) && (
        <SectionShell tone="paper">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-4">How we think about it</Eyebrow>
              {p.approachHeading && <h2 className="display-lg text-navy-900">{p.approachHeading}</h2>}
              <RichText value={p.approach} className="mt-8 text-[1.05rem]" />
            </div>
            {!!p.outcomes?.length && (
              <aside className="lg:col-span-5">
                <div className="rounded-2xl border border-line bg-white p-7 md:p-8">
                  <h2 className="eyebrow text-navy-900">What we work toward</h2>
                  <ul className="mt-5 space-y-4">
                    {p.outcomes.map((o) => (
                      <li key={o} className="flex gap-4 text-navy-900">
                        <span className={`mt-2.5 size-1.5 shrink-0 rounded-full ${a.dot}`} aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-line pt-5 text-sm text-muted">Goals, not guarantees. Every plan is reassessed as you progress.</p>
                </div>
              </aside>
            )}
          </div>
        </SectionShell>
      )}

      {!!p.tools?.length && (
        <SectionShell tone="white">
          <div className="mb-12 max-w-2xl">
            <Eyebrow className="mb-4">What we may use</Eyebrow>
            <h2 className="display-md text-navy-900">Tools shown in context — used only when they fit.</h2>
          </div>
          <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {p.tools.map((t, i) => (
              <Reveal as="li" key={t._key} delay={(i % 3) * 60} className="flex flex-col border-b border-r border-line bg-paper p-6">
                <h3 className="font-semibold text-navy-900">{t.name}</h3>
                {t.description && <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{t.description}</p>}
                {t.service?.slug && (
                  <Link href={`/services/${t.service.slug}`} className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${a.text}`}>
                    About {t.service.title} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                )}
              </Reveal>
            ))}
          </ul>
        </SectionShell>
      )}

      {!!p.whatToExpect?.length && (
        <SectionShell tone="paper">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow className="mb-4">What happens next</Eyebrow>
              <h2 className="display-md text-navy-900">What to expect</h2>
            </div>
            <ButtonLink href="/faq" variant="link" arrow>
              First-visit FAQ
            </ButtonLink>
          </div>
          <ItemGrid items={p.whatToExpect} columns={3} />
        </SectionShell>
      )}

      {!!p.services?.length && (
        <SectionShell tone="white">
          <Eyebrow className="mb-4">Related services &amp; programs</Eyebrow>
          <h2 className="display-md mb-10 text-navy-900">Go deeper</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {p.services.map((s) => (
              <li key={s._id}>
                <Link href={`/services/${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-colors hover:border-navy-900/30">
                  <span className="eyebrow text-muted">{stegaClean(s.kind) === 'program' ? 'Program' : 'Service'}</span>
                  <span className="display-sm mt-3 text-navy-900">{s.title}</span>
                  <span className="mt-2 flex-1 text-[0.95rem] text-muted">{s.summary}</span>
                  <ArrowRight className="mt-5 size-5 text-navy-900 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      {!!p.testimonials?.length && (
        <SectionShell tone="deep">
          <Eyebrow className="mb-8">In patients&apos; words</Eyebrow>
          <Testimonials items={p.testimonials} />
        </SectionShell>
      )}

      {!!p.faqs?.length && (
        <SectionShell tone="paper">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Questions</Eyebrow>
              <h2 className="display-md text-navy-900">What people ask before booking</h2>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={p.faqs} />
            </div>
          </div>
        </SectionShell>
      )}

      <CtaBand
        title="You don't need to know the perfect service. You just need the right starting point."
        primary={bookingCta}
        secondary={{label: 'Start Here', href: '/start-here'}}
        track="pathway-final"
      />
    </>
  )
}
