import type {Metadata} from 'next'
import {Reveal} from '@/components/Reveal'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {ArticleCards, CtaBand, PathwayCards, ProcessTimeline, SectionShell, Testimonials} from '@/components/sections'
import {BrandLine, ButtonLink, CtaButton, Eyebrow, SectionHeader} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {homeQuery} from '@/sanity/queries'
import type {HomePage} from '@/sanity/types'

const getHome = () =>
  sanityFetch<HomePage>({query: homeQuery, tags: ['homePage', 'pathway', 'testimonial', 'article', 'provider']})
export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome()
  return buildMetadata({
    seo: home?.seo,
    title: 'Integrative Chiropractic & Performance Care in Wayne, PA | IWC',
    path: '/',
  })
}

export default async function Home() {
  const home = await getHome()
  if (!home)
    return (
      <section className="container-site section-y">
        <h1 className="display-xl">Integrative Wellbeing &amp; Chiropractic</h1>
        <p className="my-6">Please contact the practice to arrange care.</p>
        <ButtonLink href="/book">Arrange a visit</ButtonLink>
      </section>
    )
  const portrait = home.drJennImage?.asset ? home.drJennImage : home.drJennProvider?.photo
  const heroImage = home.heroImage?.asset ? home.heroImage : portrait
  const articles = home.educationArticles?.length ? home.educationArticles : home.latestArticles
  return (
    <>
      <section id="hero" className="hero-home bg-paper" data-track="hero">
        <div className="container-site grid items-center gap-7 md:grid-cols-2 md:gap-12">
          <div>
            <BrandLine text={home.heroEyebrow} />
            <h1 className="display-xl mt-5 max-w-[12ch] text-navy-900">{home.heroHeadline}</h1>
            {home.heroSubhead && <p className="lede mt-5 max-w-[48ch] text-muted">{home.heroSubhead}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <CtaButton cta={home.heroPrimaryCta} variant="primary" track="hero" arrow />
              <CtaButton cta={home.heroSecondaryCta} variant="link" track="hero" />
            </div>
          </div>
          {heroImage?.asset && (
            <figure className="hero-photo w-full">
              <SanityImg
                image={heroImage}
                aspect={1}
                sizes="(min-width: 1280px) 480px, (min-width: 768px) 45vw, 100vw"
                priority
                className="rounded-lg"
              />
              {!home.heroImage?.asset && (
                <figcaption className="mt-3 flex justify-between gap-3 text-sm text-muted">
                  <span>Dr. Jenn Hartmann</span>
                  <span>Wayne, Pennsylvania</span>
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>
      <section id="trust" aria-label="About the practice" className="border-y border-line bg-white">
        <ul className="container-site grid md:grid-cols-3">
          {home.trustItems?.map((t) => (
            <li
              key={t._key ?? t.title}
              className="border-b border-line py-4 last:border-0 md:border-b-0 md:py-5 md:pr-8"
            >
              <p className="font-semibold text-navy-900">{t.title}</p>
              {t.body && <p className="mt-1 text-sm text-muted">{t.body}</p>}
            </li>
          ))}
        </ul>
      </section>
      <SectionShell id="recognition" tone="paper">
        <div className="grid gap-7 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeader eyebrow="Sound familiar?" title={home.recognitionHeading} />
          <ul className="editorial-rows">
            {home.recognitionCards?.map((c) => (
              <Reveal as="li" key={c} className="flex gap-5 text-lg text-navy-900">
                <span className="mt-3 h-px w-5 shrink-0 bg-teal-700" aria-hidden />
                {c}
              </Reveal>
            ))}
          </ul>
        </div>
        {home.recognitionCoda && <p className="mt-6 text-teal-700">{home.recognitionCoda}</p>}
      </SectionShell>
      <SectionShell id="difference" tone="white">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeader eyebrow="The IWC approach" title={home.reframeHeading} />
          <div>
            <RichText value={home.reframeBody} />
            {home.reframeImage?.asset && (
              <SanityImg
                image={home.reframeImage}
                aspect={5 / 3}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="mt-6 rounded-lg"
              />
            )}
          </div>
        </div>
      </SectionShell>
      <SectionShell id="pathways">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <SectionHeader eyebrow="How we help" title={home.pathwaysHeading} intro={home.pathwaysIntro} />
          <ButtonLink href="/start-here" variant="link" arrow>
            Help me choose
          </ButtonLink>
        </div>
        {home.pathways && <PathwayCards pathways={home.pathways} />}
      </SectionShell>
      <SectionShell id="how-it-works" tone="white">
        <SectionHeader eyebrow="Your care, step by step" title={home.processHeading} className="mb-8" />
        {home.processSteps && <ProcessTimeline steps={home.processSteps} tone="light" />}
        {home.processNote && <p className="mt-6 text-muted">{home.processNote}</p>}
      </SectionShell>
      <SectionShell id="dr-jenn" tone="paper">
        <div className="grid items-center gap-8 md:grid-cols-[.8fr_1.2fr] lg:gap-16">
          {portrait?.asset && (
            <SanityImg
              image={portrait}
              aspect={4 / 5}
              sizes="(min-width: 1280px) 430px, (min-width: 768px) 38vw, 100vw"
              className="max-w-md rounded-lg"
            />
          )}
          <div>
            <Eyebrow className="mb-3">Clinical judgment. Personal connection.</Eyebrow>
            <h2 className="display-lg text-navy-900">{home.drJennHeading}</h2>
            <RichText value={home.drJennBody} className="mt-5" />
            {!!home.drJennHighlights?.length && (
              <ul className="mt-5 space-y-2">
                {home.drJennHighlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <CtaButton cta={home.drJennCta} variant="link" arrow track="dr-jenn" />
            </div>
          </div>
        </div>
      </SectionShell>
      <SectionShell id="proof" tone="white" className="compact-section">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeader title={home.proofHeading} />
          <div>
            <Testimonials items={home.testimonials} />
            {home.proofPoints?.map((p) => (
              <div key={p._key ?? p.title}>
                <p className="font-semibold">{p.title}</p>
                {p.body && <p className="mt-2 text-muted">{p.body}</p>}
              </div>
            ))}
            <ButtonLink href="/team" variant="link" className="mt-4" arrow>
              Meet the team
            </ButtonLink>
          </div>
        </div>
      </SectionShell>
      <SectionShell id="toolbox" tone="paper">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <SectionHeader eyebrow="Tools in context" title={home.toolsHeading} intro={home.toolsIntro} />
          <CtaButton cta={home.toolsCta} variant="link" arrow />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.toolGroups?.map((g) => (
            <li key={g._key} className="border-t border-line pt-4">
              <h3 className="font-semibold text-navy-900">{g.title}</h3>
              {g.body && <p className="mt-2 text-[.97rem] text-muted">{g.body}</p>}
              {g.cta && (
                <div className="mt-3">
                  <CtaButton cta={g.cta} variant="link" arrow />
                </div>
              )}
              {!!g.items?.length && (
                <details className="mt-3">
                  <summary className="cursor-pointer py-2 text-sm text-teal-700">Examples of care</summary>
                  <ul className="mt-2 space-y-2 text-sm">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      </SectionShell>
      <SectionShell id="what-to-expect" tone="white">
        <div className="grid gap-7 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow="Your first visit" title={home.expectHeading} />
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <ButtonLink href="/book" variant="primary">
                Arrange a visit
              </ButtonLink>
              <CtaButton cta={home.expectCta} variant="link" arrow />
            </div>
          </div>
          <ul>
            {home.expectItems?.map((it) => (
              <li key={it._key ?? it.title} className="border-t border-line py-4">
                <h3 className="font-semibold text-navy-900">{it.title}</h3>
                <p className="mt-1 text-muted">{it.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>
      {!!articles?.length && (
        <SectionShell id="education">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-5">
            <SectionHeader eyebrow="From IWC" title={home.educationHeading} />
            <ButtonLink href="/resources" variant="link" arrow>
              All resources
            </ButtonLink>
          </div>
          <ArticleCards articles={articles} />
        </SectionShell>
      )}
      <CtaBand
        title={home.finalHeading}
        body={home.finalBody}
        primary={home.finalPrimaryCta}
        secondary={home.finalSecondaryCta}
      />
    </>
  )
}
