import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {FaqList} from '@/components/Faqs'
import {ArrowRight} from '@/components/icons'
import {DecisionOptions, EditorialSection, PracticalDetails, RecognitionRows} from '@/components/Editorial'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {CtaBand, PageHero, SectionShell, Testimonials} from '@/components/sections'
import {BreadcrumbJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, CtaButton} from '@/components/ui'
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
  return buildMetadata({
    seo: p.seo,
    title: `${p.title} | IWC Wayne, PA`,
    description: p.cardSummary,
    path: `/how-we-help/${slug}`,
  })
}

export default async function PathwayPage({params}: Props) {
  const {slug} = await params
  const p = await getPathway(slug)
  if (!p) notFound()
  const h = p.pageHeadings ?? {}
  const isPain = slug === 'pain-recovery'
  const isFunctional = slug === 'functional-health'
  const family = isFunctional
    ? 'functional'
    : slug.startsWith('prevention')
      ? 'prevention'
      : isPain
        ? 'pain'
        : 'performance'
  const bookingCta = p.primaryCta?.href ? p.primaryCta : {label: 'Arrange a visit', href: '/book'}
  const linkedServices = new Set(p.tools?.map((t) => t.service?.slug).filter(Boolean))
  const extraServices = p.services?.filter((s) => !linkedServices.has(s.slug))
  const photo = p.heroImage?.asset ? (
    <SanityImg
      image={p.heroImage}
      aspect={5 / 4}
      sizes="(min-width: 1024px) 38vw, 100vw"
      priority
      className="rounded-lg"
    />
  ) : undefined
  return (
    <div className={`pathway-${family}`}>
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          {name: 'How We Help', path: '/how-we-help'},
          {name: stegaClean(p.title), path: `/how-we-help/${slug}`},
        ]}
      />
      <PageHero
        eyebrow={p.title}
        title={p.heroHeadline}
        intro={p.heroIntro}
        accent={stegaClean(p.accent)}
        aside={
          photo ??
          (isPain ? (
            <div>
              <h2 className="font-semibold text-navy-900">{h.recognition ?? `Is ${p.title} right for you?`}</h2>
              <RecognitionRows items={p.recognition} />
            </div>
          ) : undefined)
        }
      >
        <CtaButton cta={bookingCta} variant="primary" track="pathway-hero" />
        <ButtonLink href="/start-here" variant="link" arrow>
          Help me choose
        </ButtonLink>
      </PageHero>
      {isFunctional && (
        <SectionShell tone="paper" className="compact-section">
          <DecisionOptions items={p.nextSteps} />
        </SectionShell>
      )}
      {!!p.movementPrinciples?.length && (
        <SectionShell tone="white" className="compact-section">
          <ul className="grid gap-6 md:grid-cols-3">
            {p.movementPrinciples.map((m) => (
              <li key={m._key} className="border-t border-teal-500 pt-4">
                <h2 className="display-sm text-navy-900">{m.title}</h2>
                <p className="mt-2 text-muted">{m.body}</p>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}
      {(!isPain || photo) && !!p.recognition?.length && (
        <SectionShell tone="white">
          <EditorialSection title={h.recognition ?? `Is ${p.title} right for you?`}>
            <RecognitionRows items={p.recognition} />
          </EditorialSection>
        </SectionShell>
      )}
      {!!p.approach?.length && (
        <SectionShell tone="paper">
          <EditorialSection
            title={p.approachHeading ?? p.title}
            aside={
              p.approachImage?.asset && (
                <SanityImg
                  image={p.approachImage}
                  aspect={4 / 3}
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="mt-6 rounded-lg"
                />
              )
            }
          >
            <RichText value={p.approach} />
            {!!p.outcomes?.length && (
              <div className="mt-7 border-t border-line pt-5">
                <h3 className="font-semibold text-navy-900">What we work toward</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                  {p.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted">Goals, not guarantees. Your response guides reassessment.</p>
              </div>
            )}
          </EditorialSection>
        </SectionShell>
      )}
      {!!p.whatToExpect?.length && (
        <SectionShell tone="white">
          <h2 className="display-md mb-6 text-navy-900">{h.expect ?? `Your ${p.title} visit`}</h2>
          <PracticalDetails items={p.whatToExpect} />
          <ButtonLink href="/faq" variant="link" className="mt-5" arrow>
            First-visit FAQ
          </ButtonLink>
        </SectionShell>
      )}
      {!!p.tools?.length && (
        <SectionShell tone="paper">
          <EditorialSection title={h.tools ?? `Care options for ${p.title}`}>
            <ul className="divide-y divide-line">
              {p.tools.map((t) => (
                <li key={t._key} className="py-4 first:pt-0">
                  <h3 className="font-semibold text-navy-900">{t.name}</h3>
                  {t.description && <p className="mt-1 text-muted">{t.description}</p>}
                  {t.service?.slug && (
                    <Link
                      href={`/services/${t.service.slug}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-700"
                    >
                      Explore {t.service.title}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            {!!extraServices?.length && (
              <ul className="mt-3 border-t border-line">
                {extraServices.map((s) => (
                  <li key={s._id}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 text-teal-700"
                    >
                      {s.title}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </EditorialSection>
        </SectionShell>
      )}
      {!!p.testimonials?.length && (
        <SectionShell tone="white">
          <Testimonials items={p.testimonials} />
        </SectionShell>
      )}
      {!!p.faqs?.length && (
        <SectionShell tone="white">
          <EditorialSection title={h.faqs ?? `Questions about ${p.title}`}>
            <FaqList faqs={p.faqs} />
          </EditorialSection>
        </SectionShell>
      )}
      <CtaBand
        title={h.final ?? `Explore your next step in ${p.title}`}
        primary={bookingCta}
        secondary={{label: 'Start Here', href: '/start-here'}}
        track="pathway-final"
      />
    </div>
  )
}
