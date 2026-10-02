import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {FaqList} from '@/components/Faqs'
import {ArrowRight, Clock} from '@/components/icons'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {accentOf, CheckList, CtaBand, ItemGrid, PageHero, SectionShell, Testimonials} from '@/components/sections'
import {BreadcrumbJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, CtaButton, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch, sanityFetchStatic} from '@/sanity/fetch'
import {serviceQuery, serviceSlugsQuery} from '@/sanity/queries'
import type {Service} from '@/sanity/types'

type Props = {params: Promise<{slug: string}>}

const getService = (slug: string) =>
  sanityFetch<Service>({query: serviceQuery, params: {slug}, tags: ['service', 'pathway', 'provider', 'faq', 'bookingOption', 'testimonial']})

export async function generateStaticParams() {
  const slugs = (await sanityFetchStatic<string[]>(serviceSlugsQuery)) ?? []
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const s = await getService(slug)
  if (!s) return {}
  return buildMetadata({seo: s.seo, title: `${s.title} | IWC Wayne, PA`, description: s.summary, path: `/services/${slug}`})
}

export default async function ServicePage({params}: Props) {
  const {slug} = await params
  const s = await getService(slug)
  if (!s) notFound()

  const primaryPathway = s.pathways?.[0]
  const a = accentOf(primaryPathway?.accent)
  const cta = s.primaryCta?.href ? s.primaryCta : {label: 'Book a Visit', href: '/book'}

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          ...(primaryPathway ? [{name: stegaClean(primaryPathway.title), path: `/how-we-help/${stegaClean(primaryPathway.slug)}`}] : []),
          {name: stegaClean(s.title), path: `/services/${slug}`},
        ]}
      />
      <PageHero
        eyebrow={`${stegaClean(s.kind) === 'program' ? 'Program' : 'Service'} · ${s.title}`}
        accent={stegaClean(primaryPathway?.accent)}
        title={s.heroHeadline}
        intro={s.heroIntro}
        aside={
          s.heroImage?.asset ? (
            <SanityImg image={s.heroImage} aspect={4 / 5} sizes="(min-width: 1024px) 38vw, 100vw" priority className="rounded-[1.75rem]" />
          ) : (
            <Logistics s={s} />
          )
        }
      >
        <CtaButton cta={cta} variant="book" track="service-hero" />
        {primaryPathway && (
          <ButtonLink href={`/how-we-help/${primaryPathway.slug}`} variant="link" arrow>
            Part of {primaryPathway.title}
          </ButtonLink>
        )}
      </PageHero>

      {!!s.recognition?.length && (
        <SectionShell tone="white">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Why am I here?</Eyebrow>
              <h2 className="display-md text-navy-900">People often come to us with…</h2>
            </div>
            <div className="lg:col-span-8">
              <CheckList items={s.recognition} columns={2} />
            </div>
          </div>
        </SectionShell>
      )}

      <SectionShell tone="paper">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {!!s.whatItIs?.length && (
            <div>
              <Eyebrow className="mb-4">What it is</Eyebrow>
              <h2 className="display-md text-navy-900">What we are actually talking about</h2>
              <RichText value={s.whatItIs} className="mt-6" />
            </div>
          )}
          {!!s.howWeUseIt?.length && (
            <div>
              <Eyebrow className="mb-4">How IWC uses it</Eyebrow>
              <h2 className="display-md text-navy-900">One tool inside a larger plan</h2>
              <RichText value={s.howWeUseIt} className="mt-6" />
            </div>
          )}
        </div>
      </SectionShell>

      {(!!s.mayFit?.length || !!s.boundaries?.length) && (
        <SectionShell tone="white">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {!!s.mayFit?.length && (
              <div>
                <Eyebrow className="mb-4">Who it may fit</Eyebrow>
                <h2 className="display-md mb-6 text-navy-900">Could this be useful for me?</h2>
                <CheckList items={s.mayFit} />
              </div>
            )}
            {!!s.boundaries?.length && (
              <div className="rounded-2xl bg-paper p-7 md:p-9">
                <Eyebrow tone="teal" className="mb-4">Boundaries</Eyebrow>
                <h2 className="display-sm mb-5 text-navy-900">When it may not be the right next step</h2>
                <ul className="space-y-4">
                  {s.boundaries.map((b) => (
                    <li key={b} className="flex gap-4 text-[0.97rem] leading-relaxed text-navy-900">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-teal-700" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {!!s.whatToExpect?.length && (
        <SectionShell tone="paper">
          <Eyebrow className="mb-4">What happens</Eyebrow>
          <h2 className="display-md mb-12 text-navy-900">What to expect</h2>
          <ItemGrid items={s.whatToExpect} columns={3} />
          {s.heroImage?.asset && (
            <div className="mt-14 max-w-md">
              <Logistics s={s} />
            </div>
          )}
        </SectionShell>
      )}

      {!!s.rationale?.length && (
        <SectionShell tone="white">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Evidence-informed</Eyebrow>
              <h2 className="display-md text-navy-900">Why this might make sense</h2>
            </div>
            <RichText value={s.rationale} className="lg:col-span-8 text-[1.05rem]" />
          </div>
        </SectionShell>
      )}

      {!!s.testimonials?.length && (
        <SectionShell tone="deep">
          <Eyebrow className="mb-8">In patients&apos; words</Eyebrow>
          <Testimonials items={s.testimonials} />
        </SectionShell>
      )}

      {!!s.faqs?.length && (
        <SectionShell tone="paper">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Questions</Eyebrow>
              <h2 className="display-md text-navy-900">What am I still unsure about?</h2>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={s.faqs} />
            </div>
          </div>
        </SectionShell>
      )}

      {!!s.related?.length && (
        <SectionShell tone="white">
          <h2 className="eyebrow mb-6 text-navy-900">Often part of the same plan</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {s.related.map((r) => (
              <li key={r._id}>
                <Link href={`/services/${r.slug}`} className="group flex items-center justify-between gap-4 border-t border-line py-4 font-semibold text-navy-900">
                  {r.title}
                  <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${a.text}`} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      {s.disclaimer && (
        <div className="container-site pb-10">
          <p className="max-w-3xl text-xs leading-relaxed text-muted">{s.disclaimer}</p>
        </div>
      )}

      <CtaBand title="Ready to take the next step?" body="Book directly, or start with a short guided choice if you are not sure." primary={cta} secondary={{label: 'Start Here', href: '/start-here'}} track="service-final" />
    </>
  )
}

/** Practical details card: length, fee, who provides it, how to book. */
function Logistics({s}: {s: Service}) {
  return (
    <aside className="rounded-[1.75rem] border border-line bg-white p-7 md:p-8" aria-label="Visit details">
      <p className="eyebrow text-gold-700">Visit details</p>
      <dl className="mt-5 divide-y divide-line">
        {(s.bookingOption?.duration || s.visitLength) && (
          <div className="flex gap-4 py-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
            <div>
              <dt className="sr-only">Length</dt>
              <dd className="text-navy-900">{s.visitLength || s.bookingOption?.duration}</dd>
            </div>
          </div>
        )}
        {s.pricingNote && (
          <div className="py-3">
            <dt className="text-sm text-muted">Fees</dt>
            <dd className="mt-0.5 text-navy-900">{s.pricingNote}</dd>
          </div>
        )}
        {!!s.providers?.length && (
          <div className="py-3">
            <dt className="text-sm text-muted">With</dt>
            <dd className="mt-0.5 flex flex-wrap gap-x-2 text-navy-900">
              {s.providers.map((p, i) => (
                <span key={p._id}>
                  <Link href={`/team/${p.slug}`} className="underline decoration-gold-400 underline-offset-4 hover:text-teal-700">
                    {p.name}
                  </Link>
                  {i < s.providers!.length - 1 ? ',' : ''}
                </span>
              ))}
            </dd>
          </div>
        )}
        {s.bookingOption && (
          <div className="py-3">
            <dt className="text-sm text-muted">Book as</dt>
            <dd className="mt-0.5 text-navy-900">{s.bookingOption.label}</dd>
          </div>
        )}
      </dl>
    </aside>
  )
}
