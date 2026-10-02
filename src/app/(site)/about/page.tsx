import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import {ProviderDetails} from '@/components/ProviderDetails'
import {Reveal} from '@/components/Reveal'
import {RichText} from '@/components/RichText'
import {SanityImg} from '@/components/SanityImg'
import {CtaBand, SectionShell, Testimonials} from '@/components/sections'
import {PersonJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, Emphasis, Eyebrow} from '@/components/ui'
import {imageUrl} from '@/sanity/image'
import {buildMetadata} from '@/lib/seo'
import {getSettings} from '@/lib/site'
import {sanityFetch} from '@/sanity/fetch'
import {aboutPageQuery} from '@/sanity/queries'
import type {AboutPage} from '@/sanity/types'

const getPage = () =>
  sanityFetch<AboutPage>({query: aboutPageQuery, tags: ['aboutPage', 'provider', 'service', 'testimonial']})

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  return buildMetadata({
    seo: page?.seo,
    title: 'About Dr. Jenn Hartmann | IWC Wayne, PA',
    description: page?.intro,
    path: '/about',
  })
}

export default async function AboutPageRoute() {
  const [page, settings] = await Promise.all([getPage(), getSettings()])
  const p = page?.provider
  const portrait = page?.portrait?.asset ? page.portrait : p?.photo

  return (
    <>
      {p && (
        <PersonJsonLd
          name={stegaClean(p.name)}
          jobTitle={stegaClean(p.role)}
          path="/about"
          practice={settings.practiceName}
          image={p.photo?.asset ? imageUrl(p.photo, 800, 800) : undefined}
        />
      )}
      {/* Human opening */}
      <section className="border-b border-line bg-paper">
        <div className="container-site grid items-center gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-5">{page?.eyebrow || 'About Dr. Jenn'}</Eyebrow>
            <h1 className="display-xl text-navy-900">
              <Emphasis text={page?.headline || 'A clinician who connects the dots.'} />
            </h1>
            {page?.intro && <p className="lede mt-7 max-w-2xl text-muted">{page.intro}</p>}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink
                href={
                  p?.bookingOption ? `/book?provider=${stegaClean(p.slug)}#${stegaClean(p.bookingOption._id)}` : '/book'
                }
                variant="book"
                track="about-hero"
              >
                Book with Dr. Jenn
              </ButtonLink>
              <ButtonLink href="/start-here" variant="link" arrow>
                Start Here
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <SanityImg
                image={portrait}
                aspect={4 / 5}
                sizes="(min-width: 1024px) 38vw, 100vw"
                priority
                className="relative rounded-lg"
                slotLabel="Portrait"
              />
            </div>
            {p && (
              <p className="mt-4 text-sm text-muted">
                <span className="font-semibold text-navy-900">{p.name}</span>
                {p.credentials ? `, ${p.credentials}` : ''} · {p.role}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Story sections */}
      {page?.sections?.map((s, i) => (
        <SectionShell key={s._key} tone={i % 2 ? 'paper' : 'white'}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              {s.kicker && <Eyebrow className="mb-4">{s.kicker}</Eyebrow>}
              <h2 className="display-lg text-navy-900">
                <Emphasis text={s.heading} />
              </h2>
            </div>
            <RichText value={s.body} className="text-[1.05rem] lg:col-span-7 " />
          </div>
        </SectionShell>
      ))}

      {/* Clinical philosophy */}
      {!!page?.philosophy?.length && (
        <SectionShell tone="paper">
          <Eyebrow tone="gold" className="mb-6">
            Clinical philosophy
          </Eyebrow>
          <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {page.philosophy.map((ph, i) => (
              <Reveal as="li" key={ph._key ?? ph.title} delay={i * 100} className="border-t border-gold-400/60 pt-6">
                <p className="display-sm text-navy-900">{ph.title}</p>
                {ph.body && <p className="mt-3 text-muted">{ph.body}</p>}
              </Reveal>
            ))}
          </ul>
        </SectionShell>
      )}

      {/* Profile details: best fit, credentials grouped */}
      {p && (
        <SectionShell tone="white">
          <ProviderDetails p={p} />
        </SectionShell>
      )}

      {/* Benefits of choosing IWC */}
      {!!page?.benefits?.length && (
        <SectionShell tone="paper">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Why IWC</Eyebrow>
              <h2 className="display-lg text-navy-900">{page.benefitsHeading || 'The benefits of choosing IWC'}</h2>
            </div>
            <ol className="lg:col-span-8">
              {page.benefits.map((b, i) => (
                <Reveal as="li" key={b} delay={i * 60} className="flex gap-6 border-t border-line py-6">
                  <span className="font-display text-xl text-gold-700" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[1.05rem] text-navy-900">{b}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </SectionShell>
      )}

      {/* Trusted collaboration */}
      {!!page?.collaboration?.length && (
        <SectionShell tone="white">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Trusted collaboration</Eyebrow>
              <h2 className="display-md text-navy-900">When someone else is the better next step</h2>
            </div>
            <div className="lg:col-span-8">
              <RichText value={page.collaboration} className="text-[1.05rem]" />
              <ButtonLink href="/for-providers" variant="link" arrow className="mt-6">
                For referring providers
              </ButtonLink>
            </div>
          </div>
        </SectionShell>
      )}

      {!!page?.testimonials?.length && (
        <SectionShell tone="deep">
          <Eyebrow className="mb-8">What patients say</Eyebrow>
          <Testimonials items={page.testimonials} />
        </SectionShell>
      )}

      <CtaBand
        title={page?.closing || 'Start here.'}
        primary={{label: 'Start Here', href: '/start-here'}}
        secondary={{label: 'Book with Dr. Jenn', href: '/book'}}
        track="about-final"
      />
    </>
  )
}
