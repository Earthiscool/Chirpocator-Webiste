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
import {serviceQuery, serviceSlugsQuery} from '@/sanity/queries'
import type {Service} from '@/sanity/types'

type Props = {params: Promise<{slug: string}>}

const getService = (slug: string) =>
  sanityFetch<Service>({
    query: serviceQuery,
    params: {slug},
    tags: ['service', 'pathway', 'provider', 'faq', 'bookingOption', 'testimonial'],
  })

export async function generateStaticParams() {
  const slugs = (await sanityFetchStatic<string[]>(serviceSlugsQuery)) ?? []
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const s = await getService(slug)
  if (!s) return {}
  return buildMetadata({
    seo: s.seo,
    title: `${s.title} | IWC Wayne, PA`,
    description: s.summary,
    path: `/services/${slug}`,
  })
}

export default async function ServicePage({params}: Props) {
  const {slug} = await params
  const s = await getService(slug)
  if (!s) notFound()
  const h = s.pageHeadings ?? {}
  const primaryPathway = s.pathways?.[0]
  const cta = s.primaryCta?.href ? s.primaryCta : {label: 'Arrange a visit', href: '/book'}
  const isMassage = slug === 'therapeutic-massage'
  const isGolf = slug === 'golf-performance'
  const image = s.heroImage?.asset ? s.heroImage : isMassage ? s.providers?.[0]?.photo : undefined
  return (
    <div className={isMassage ? 'service-massage' : isGolf ? 'service-golf' : 'service-clinical'}>
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          ...(primaryPathway
            ? [{name: stegaClean(primaryPathway.title), path: `/how-we-help/${stegaClean(primaryPathway.slug)}`}]
            : []),
          {name: stegaClean(s.title), path: `/services/${slug}`},
        ]}
      />
      <PageHero
        eyebrow={s.title}
        title={s.heroHeadline}
        intro={s.heroIntro}
        accent={stegaClean(primaryPathway?.accent)}
        aside={
          image?.asset && (
            <figure>
              <SanityImg
                image={image}
                aspect={isMassage ? 1 : 5 / 4}
                sizes="(min-width: 1024px) 38vw, 100vw"
                priority
                className="max-w-md rounded-lg"
              />
              {isMassage && !s.heroImage?.asset && (
                <figcaption className="mt-3 text-sm text-muted">
                  {s.providers?.[0]?.name} · {s.providers?.[0]?.role}
                </figcaption>
              )}
            </figure>
          )
        }
      >
        <CtaButton cta={cta} variant="primary" track="service-hero" />
        {primaryPathway && (
          <ButtonLink href={`/how-we-help/${primaryPathway.slug}`} variant="link" arrow>
            {primaryPathway.title}
          </ButtonLink>
        )}
      </PageHero>
      <section className="border-b border-line bg-white">
        <div className="container-site py-5">
          <Logistics s={s} />
        </div>
      </section>
      {!!s.nextSteps?.length && (
        <SectionShell className="compact-section">
          <DecisionOptions items={s.nextSteps} />
        </SectionShell>
      )}
      {isGolf && !!s.whatToExpect?.length && (
        <SectionShell tone="white">
          <h2 className="display-md mb-6 text-navy-900">{h.expect ?? `Your ${s.title} visit`}</h2>
          <PracticalDetails items={s.whatToExpect} />
        </SectionShell>
      )}
      {!!s.recognition?.length && (
        <SectionShell>
          <EditorialSection title={h.recognition ?? `When ${s.title} may fit`}>
            <RecognitionRows items={s.recognition} />
          </EditorialSection>
        </SectionShell>
      )}
      {!!s.whatItIs?.length && (
        <SectionShell tone="white">
          <EditorialSection
            title={h.definition ?? `Understanding ${s.title}`}
            aside={
              s.approachImage?.asset && (
                <SanityImg
                  image={s.approachImage}
                  aspect={4 / 3}
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="mt-6 rounded-lg"
                />
              )
            }
          >
            <RichText value={s.whatItIs} />
            {!!s.howWeUseIt?.length && (
              <div className="mt-7">
                <h2 className="display-sm mb-4 text-navy-900">{h.approach ?? `${s.title} in your care plan`}</h2>
                <RichText value={s.howWeUseIt} />
              </div>
            )}
          </EditorialSection>
        </SectionShell>
      )}
      {(!!s.mayFit?.length || !!s.boundaries?.length) && (
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="display-md mb-5 text-navy-900">{h.fit ?? `Choosing ${s.title}`}</h2>
              <RecognitionRows items={s.mayFit} />
            </div>
            <div className="border-l-2 border-teal-500 pl-6">
              <h2 className="display-sm mb-5 text-navy-900">Scope and boundaries</h2>
              <ul className="space-y-4 text-muted">
                {s.boundaries?.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionShell>
      )}
      {!isGolf && !!s.whatToExpect?.length && (
        <SectionShell tone="white">
          <h2 className="display-md mb-6 text-navy-900">{h.expect ?? `Your ${s.title} visit`}</h2>
          <PracticalDetails items={s.whatToExpect} />
        </SectionShell>
      )}
      {!!s.rationale?.length && (
        <SectionShell>
          <EditorialSection title={h.rationale ?? `The role of ${s.title}`}>
            <RichText value={s.rationale} />
          </EditorialSection>
        </SectionShell>
      )}
      {!!s.testimonials?.length && (
        <SectionShell tone="white">
          <Testimonials items={s.testimonials} />
        </SectionShell>
      )}
      {!!s.faqs?.length && (
        <SectionShell tone="white">
          <EditorialSection title={h.faqs ?? `Questions about ${s.title}`}>
            <FaqList faqs={s.faqs} />
          </EditorialSection>
        </SectionShell>
      )}
      {!!s.related?.length && (
        <SectionShell>
          <h2 className="display-md mb-5 text-navy-900">Related care</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {s.related
              .filter((r) => r.slug && r.reason)
              .map((r) => (
                <li key={r._id} className="border-t border-line pt-4">
                  <Link
                    href={`/services/${r.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal-700"
                  >
                    {r.title}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <p className="mt-2 text-muted">{r.reason}</p>
                </li>
              ))}
          </ul>
        </SectionShell>
      )}
      {s.disclaimer && (
        <div className="container-site pb-8">
          <p className="max-w-3xl text-sm text-muted">{s.disclaimer}</p>
        </div>
      )}
      <CtaBand
        title={h.final ?? `Discuss ${s.title} with the practice`}
        primary={cta}
        secondary={{label: 'Start Here', href: '/start-here'}}
        track="service-final"
      />
    </div>
  )
}

function Logistics({s}: {s: Service}) {
  return (
    <dl className="flex flex-wrap gap-x-12 gap-y-4 text-sm" aria-label="Visit details">
      {!!s.providers?.length && (
        <div>
          <dt className="text-muted">Provided by</dt>
          <dd className="mt-1 flex flex-wrap gap-x-3">
            {s.providers.map((p) => (
              <Link
                key={p._id}
                href={`/team/${p.slug}`}
                className="inline-flex min-h-8 items-center font-semibold text-navy-900 underline underline-offset-4"
              >
                {p.name}
              </Link>
            ))}
          </dd>
        </div>
      )}
      {(s.visitLength || s.bookingOption?.duration) && (
        <div>
          <dt className="text-muted">Visit length</dt>
          <dd className="mt-1 text-navy-900">{s.visitLength || s.bookingOption?.duration}</dd>
        </div>
      )}
      {s.pricingNote && (
        <div>
          <dt className="text-muted">Fees</dt>
          <dd className="mt-1 text-navy-900">{s.pricingNote}</dd>
        </div>
      )}
      {s.bookingOption && (
        <div>
          <dt className="text-muted">Request this visit</dt>
          <dd className="mt-1">
            <Link href={`/book#${s.bookingOption._id}`} className="text-navy-900 underline underline-offset-4">
              {s.bookingOption.label}
            </Link>
          </dd>
        </div>
      )}
    </dl>
  )
}
