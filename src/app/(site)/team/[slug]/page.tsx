import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {ProviderDetails} from '@/components/ProviderDetails'
import {SanityImg} from '@/components/SanityImg'
import {CtaBand, SectionShell} from '@/components/sections'
import {BreadcrumbJsonLd, PersonJsonLd} from '@/components/seo/JsonLd'
import {ButtonLink, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {getSettings} from '@/lib/site'
import {sanityFetch, sanityFetchStatic} from '@/sanity/fetch'
import {imageUrl} from '@/sanity/image'
import {providerQuery, providerSlugsQuery} from '@/sanity/queries'
import type {Provider} from '@/sanity/types'

type Props = {params: Promise<{slug: string}>}

const getProvider = (slug: string) =>
  sanityFetch<Provider>({query: providerQuery, params: {slug}, tags: ['provider', 'service', 'bookingOption']})

export async function generateStaticParams() {
  const slugs = (await sanityFetchStatic<string[]>(providerSlugsQuery)) ?? []
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const p = await getProvider(slug)
  if (!p) return {}
  return buildMetadata({seo: p.seo, title: `${p.name} | IWC Wayne, PA`, description: p.headline, path: `/team/${slug}`})
}

export default async function ProviderPage({params}: Props) {
  const {slug} = await params
  const [p, settings] = await Promise.all([getProvider(slug), getSettings()])
  if (!p) notFound()
  // "Dr. Jenn Hartmann" → "Dr. Jenn"; "Amie Hamel" → "Amie"
  const name = stegaClean(p.name)
  const first = name
    .split(' ')
    .slice(0, name.startsWith('Dr.') ? 2 : 1)
    .join(' ')
  const bookHref = p.bookingOption ? `/book?provider=${stegaClean(p.slug)}#${stegaClean(p.bookingOption._id)}` : '/book'

  return (
    <>
      <PersonJsonLd
        name={stegaClean(p.name)}
        jobTitle={stegaClean(p.role)}
        path={`/team/${slug}`}
        practice={settings.practiceName}
        image={p.photo?.asset ? imageUrl(p.photo, 800, 800) : undefined}
      />
      <BreadcrumbJsonLd
        items={[
          {name: 'Home', path: '/'},
          {name: 'Team', path: '/team'},
          {name: stegaClean(p.name), path: `/team/${slug}`},
        ]}
      />
      <section className="border-b border-line bg-paper">
        <div className="container-site grid items-center gap-8 py-10 md:py-14 md:grid-cols-12">
          {p.photo?.asset && (
            <div className="md:col-span-4">
              <SanityImg
                image={p.photo}
                aspect={4 / 5}
                sizes="(min-width: 1024px) 32vw, 100vw"
                priority
                className="rounded-lg"
                slotLabel="Portrait"
              />
            </div>
          )}
          <div className={p.photo?.asset ? 'md:col-span-7 md:col-start-6' : 'md:col-span-10'}>
            <Eyebrow className="mb-4">{p.role}</Eyebrow>
            <h1 className="display-xl text-navy-900">{p.name}</h1>
            {p.credentials && <p className="mt-3 text-teal-700">{p.credentials}</p>}
            {p.headline && <p className="lede mt-6 max-w-2xl text-muted">{p.headline}</p>}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href={bookHref} variant="book" track="provider-hero">
                Arrange a visit with {first}
              </ButtonLink>
              <ButtonLink href="/start-here" variant="link" arrow>
                Not sure? Start Here
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <SectionShell tone="white">
        <ProviderDetails p={p} />
      </SectionShell>
      <SectionShell tone="paper" className="!py-12">
        <p className="max-w-3xl text-navy-900">
          IWC practitioners are independent and coordinate when your care involves more than one of us. If another IWC
          provider or an outside specialist is a better fit, we will say so.
        </p>
      </SectionShell>
      <CtaBand
        title={`Start a conversation with ${first}.`}
        primary={{label: `Book with ${first}`, href: bookHref}}
        secondary={{label: 'Start Here', href: '/start-here'}}
        track="provider-final"
      />
    </>
  )
}
