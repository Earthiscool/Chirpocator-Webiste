import type {Metadata} from 'next'
import Link from 'next/link'

import {WholePictureMap} from '@/components/home/WholePictureMap'
import {ArrowRight} from '@/components/icons'
import {RichText} from '@/components/RichText'
import {Reveal} from '@/components/Reveal'
import {SanityImg} from '@/components/SanityImg'
import {ArticleCards, CtaBand, ItemGrid, PathwayCards, ProcessTimeline, SectionShell, Testimonials} from '@/components/sections'
import {BrandLine, ButtonLink, CtaButton, Emphasis, Eyebrow, SectionHeader} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {homeQuery} from '@/sanity/queries'
import type {HomePage} from '@/sanity/types'

const TAGS = ['homePage', 'pathway', 'testimonial', 'article', 'provider']

async function getHome() {
  return sanityFetch<HomePage>({query: homeQuery, tags: TAGS})
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome()
  return buildMetadata({
    seo: home?.seo,
    title: 'Integrative Chiropractic & Performance Care in Wayne, PA | IWC',
    path: '/',
  })
}

export default async function HomePage() {
  const home = await getHome()
  if (!home) return <CmsUnavailable />

  const factors = home.mapFactors?.length ? home.mapFactors : ['Pain', 'Movement', 'Tissue', 'Recovery', 'Training load', 'Sleep', 'Nutrition', 'Past injury']
  const highlighted = home.mapHighlighted ?? []
  const hasHeroPhoto = Boolean(home.heroImage?.asset)
  const map = <WholePictureMap factors={factors} highlighted={highlighted} />
  const articles = home.educationArticles?.length ? home.educationArticles : home.latestArticles
  const drJennImage = home.drJennImage?.asset ? home.drJennImage : home.drJennProvider?.photo

  return (
    <>
      {/* 1 · HERO — recognition + promise + one clear action */}
      <section id="hero" data-track="hero" className="relative overflow-hidden bg-paper">
        <div className="container-site grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7">
            <BrandLine text={home.heroEyebrow} />
            <h1 className="display-xl mt-6 text-navy-900">
              <Emphasis text={home.heroHeadline} />
            </h1>
            {home.heroSubhead && <p className="lede mt-7 max-w-[38rem] text-muted">{home.heroSubhead}</p>}
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <CtaButton cta={home.heroPrimaryCta} variant="primary" track="hero" arrow />
              <CtaButton cta={home.heroSecondaryCta} variant="secondary" track="hero" />
            </div>
          </div>
          <div className="lg:col-span-5">
            {hasHeroPhoto ? (
              <SanityImg image={home.heroImage} aspect={4 / 5} sizes="(min-width: 1024px) 40vw, 100vw" priority className="rounded-[1.75rem]" />
            ) : (
              <div className="on-navy relative overflow-hidden rounded-[1.75rem] bg-navy-900 px-5 pb-6 pt-8 shadow-[0_40px_80px_-40px_rgba(11,31,74,0.6)] sm:px-8">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(168,212,248,0.16),transparent_60%)]"
                  aria-hidden
                />
                <p className="eyebrow relative mb-2 text-gold-400">The whole picture</p>
                <div className="relative">{map}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2 · TRUST STRIP — credibility without a credential wall */}
      {!!home.trustItems?.length && (
        <section aria-label="Why patients trust IWC" className="border-y border-line bg-white">
          <ul className="container-site grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {home.trustItems.map((t) => (
              <li key={t._key ?? t.title} className="py-6 md:px-8 md:py-8 md:first:pl-0 md:last:pr-0">
                <p className="display-sm text-navy-900">{t.title}</p>
                {t.body && <p className="mt-1.5 text-[0.95rem] leading-snug text-muted">{t.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3 · RECOGNITION — make the visitor feel seen */}
      <SectionShell id="recognition" tone="paper">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-4">Sound familiar?</Eyebrow>
            <h2 className="display-lg text-navy-900">
              <Emphasis text={home.recognitionHeading} />
            </h2>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {home.recognitionCards?.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 90} className="bg-white p-6 md:p-8">
                <span className="mb-5 block h-px w-8 bg-teal-500" aria-hidden />
                <p className="display-sm text-navy-900">{c}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        {home.recognitionCoda && (
          <p className="mt-12 font-display text-xl italic text-teal-700 md:text-2xl">{home.recognitionCoda}</p>
        )}
      </SectionShell>

      {/* 4 · REFRAME — the IWC difference */}
      <SectionShell id="difference" tone="navy">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow tone="on-navy" className="mb-4">The IWC difference</Eyebrow>
            <h2 className="display-lg text-white">
              <Emphasis text={home.reframeHeading} />
            </h2>
            <RichText value={home.reframeBody} className="on-navy mt-8 text-[1.05rem]" />
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            {hasHeroPhoto ? (
              map
            ) : (
              home.reframePull && (
                <Reveal>
                  <blockquote className="border-l border-gold-400 pl-6 md:pl-8">
                    <p className="font-display text-[clamp(1.9rem,1.4rem+1.8vw,3rem)] italic leading-[1.1] text-white">
                      {home.reframePull}
                    </p>
                  </blockquote>
                </Reveal>
              )
            )}
          </div>
        </div>
      </SectionShell>

      {/* 5 · PATHWAYS — self-select by goal */}
      <SectionShell id="pathways" tone="paper">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="How we help" title={home.pathwaysHeading} intro={home.pathwaysIntro} />
          <ButtonLink href="/start-here" variant="link" arrow track="pathways">
            Not sure? Start Here
          </ButtonLink>
        </div>
        {home.pathways && <PathwayCards pathways={home.pathways} />}
      </SectionShell>

      {/* 6 · HOW CARE WORKS — reduce uncertainty */}
      <SectionShell id="how-it-works" tone="navy">
        <SectionHeader eyebrow="The process" title={home.processHeading} tone="navy" className="mb-14" />
        {home.processSteps && <ProcessTimeline steps={home.processSteps} />}
        {home.processNote && <p className="mt-14 max-w-2xl border-t border-white/15 pt-8 text-navy-100">{home.processNote}</p>}
      </SectionShell>

      {/* 7 · MEET DR. JENN — practitioner connection */}
      <SectionShell id="dr-jenn" tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-[1.75rem] border border-gold-400/70" aria-hidden />
            <SanityImg
              image={drJennImage}
              aspect={4 / 5}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="relative rounded-[1.75rem]"
              slotLabel="Dr. Jenn — portrait"
            />
          </div>
          <div className="lg:col-span-7">
            <Eyebrow className="mb-4">Meet Dr. Jenn</Eyebrow>
            <h2 className="display-lg text-navy-900">
              <Emphasis text={home.drJennHeading} />
            </h2>
            <RichText value={home.drJennBody} className="mt-7 text-[1.05rem]" />
            {!!home.drJennHighlights?.length && (
              <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-line pt-7 sm:grid-cols-2">
                {home.drJennHighlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[0.97rem] text-navy-900">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-gold-700" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10">
              <CtaButton cta={home.drJennCta} variant="secondary" arrow track="dr-jenn" />
            </div>
          </div>
        </div>
      </SectionShell>

      {/* 8 · PROOF — let others validate (only verified, permitted entries) */}
      <SectionShell id="proof" tone="deep">
        <SectionHeader eyebrow="Trust" title={home.proofHeading} className="mb-12" />
        {home.testimonials?.length ? (
          <div className="mb-16">
            <Testimonials items={home.testimonials} />
          </div>
        ) : null}
        <ItemGrid items={home.proofPoints} columns={3} />
      </SectionShell>

      {/* 9 · SERVICES IN CONTEXT — breadth without a catalog */}
      <SectionShell id="toolbox" tone="white">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Services in context" title={home.toolsHeading} intro={home.toolsIntro} />
          <CtaButton cta={home.toolsCta} variant="link" arrow track="toolbox" />
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {home.toolGroups?.map((g, i) => (
            <Reveal key={g._key} delay={i * 80} className="bg-paper p-6 md:p-8">
              <h3 className="display-sm text-navy-900">{g.title}</h3>
              {g.body && <p className="mt-2 text-sm text-muted">{g.body}</p>}
              <ul className="mt-6 space-y-2.5">
                {g.items?.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[0.95rem] text-navy-900">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* 10 · WHAT TO EXPECT — remove booking friction */}
      <SectionShell id="what-to-expect" tone="paper">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">Your first visit</Eyebrow>
            <h2 className="display-lg text-navy-900">
              <Emphasis text={home.expectHeading} />
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/book" variant="book" track="what-to-expect">
                Book a Visit
              </ButtonLink>
              <CtaButton cta={home.expectCta} variant="link" arrow track="what-to-expect" />
            </div>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {home.expectItems?.map((it, i) => (
              <Reveal as="li" key={it._key ?? it.title} delay={i * 60} className="grid gap-2 border-t border-line py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                <h3 className="font-semibold text-navy-900">{it.title}</h3>
                <p className="text-muted">{it.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </SectionShell>

      {/* 11 · EDUCATION — show the thinking */}
      {!!articles?.length && (
        <SectionShell id="education" tone="white">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader eyebrow="Resources" title={home.educationHeading} />
            <Link href="/resources" className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:underline">
              All resources <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ArticleCards articles={articles} />
        </SectionShell>
      )}

      {/* 12 · FINAL CTA — close with confidence */}
      <CtaBand
        title={home.finalHeading}
        body={home.finalBody}
        primary={home.finalPrimaryCta}
        secondary={home.finalSecondaryCta}
        track="final-cta"
      />
    </>
  )
}

function CmsUnavailable() {
  return (
    <section className="container-site section-y">
      <h1 className="display-lg text-navy-900">Integrative Wellbeing &amp; Chiropractic</h1>
      <p className="lede mt-6 max-w-xl text-muted">
        We&apos;re updating this page. In the meantime, please call the office or visit our booking page.
      </p>
      <div className="mt-8 flex gap-4">
        <ButtonLink href="/book" variant="book">
          Book a Visit
        </ButtonLink>
        <ButtonLink href="tel:+16102985873" variant="secondary">
          Call 610-298-5873
        </ButtonLink>
      </div>
    </section>
  )
}
