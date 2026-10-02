import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import {ContactForm} from '@/components/forms/ContactForm'
import {ArrowRight, Clock, Mail, Phone, Pin} from '@/components/icons'
import {SanityImg} from '@/components/SanityImg'
import {RichText} from '@/components/RichText'
import {PageHero, SectionShell} from '@/components/sections'
import {ButtonLink, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {formatAddress, getSettings} from '@/lib/site'
import {sanityFetch} from '@/sanity/fetch'
import {bookingOptionsQuery, bookingPageQuery, providersQuery} from '@/sanity/queries'
import type {BookingOption, BookingPage, ProviderCard} from '@/sanity/types'

const getData = () =>
  Promise.all([
    sanityFetch<BookingPage>({query: bookingPageQuery, tags: ['bookingPage']}),
    sanityFetch<BookingOption[]>({query: bookingOptionsQuery, tags: ['bookingOption']}),
    getSettings(),
  ])

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await getData()
  return buildMetadata({seo: page?.seo, title: 'Book a Visit | IWC Wayne, PA', description: page?.intro, path: '/book'})
}

export default async function BookPage({searchParams}: {searchParams: Promise<{provider?: string}>}) {
  const [[page, options, s], params, providers] = await Promise.all([
    getData(),
    searchParams,
    sanityFetch<ProviderCard[]>({query: providersQuery, tags: ['provider']}),
  ])
  const requested = providers?.find((p) => stegaClean(p.slug) === params.provider)
  const address = formatAddress(s.address)
  const newOptions = options?.filter((o) => stegaClean(o.audience) !== 'existing') ?? []
  const existing = options?.filter((o) => stegaClean(o.audience) === 'existing') ?? []

  return (
    <>
      <PageHero eyebrow={page?.eyebrow || 'Book a Visit'} title={page?.headline || 'Book a visit'} intro={page?.intro}>
        <ButtonLink href={`tel:${s.phoneE164}`} variant="primary" track="book-hero">
          <Phone className="size-4" aria-hidden /> Call {s.phone}
        </ButtonLink>
        <ButtonLink href="/start-here" variant="link" arrow>
          Not sure? Start Here
        </ButtonLink>
      </PageHero>

      <SectionShell tone="white" id="booking-options">
        {requested && (
          <p className="mb-6 border-l-2 border-teal-500 pl-4 text-navy-900">
            Your provider request: <strong>{requested.name}</strong>. Please confirm the appropriate visit with the
            office.
          </p>
        )}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-3">New to IWC</Eyebrow>
            <h2 className="display-md text-navy-900">I am here for…</h2>
          </div>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {newOptions.map((o) => (
            <BookingCard
              key={o._id}
              o={o}
              phone={s.phone}
              phoneE164={s.phoneE164}
              email={s.email}
              requested={requested}
            />
          ))}
        </ul>
        {!!existing.length && (
          <div className="mt-12 border-t border-line pt-10">
            <Eyebrow className="mb-5">Already an IWC patient</Eyebrow>
            <ul className="divide-y divide-line border-y border-line">
              {existing.map((o) => (
                <BookingCard
                  key={o._id}
                  o={o}
                  phone={s.phone}
                  phoneE164={s.phoneE164}
                  email={s.email}
                  requested={requested}
                />
              ))}
            </ul>
          </div>
        )}
        <p className="mt-8 max-w-3xl text-sm text-muted">
          Please contact the office for current payment and insurance information.
        </p>
      </SectionShell>

      <SectionShell tone="paper">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-4">Your first visit</Eyebrow>
            <h2 className="display-md text-navy-900">What to know before you come in</h2>
            <RichText value={page?.firstVisitNote} className="mt-6" />
            <ButtonLink href="/faq" variant="link" arrow className="mt-6">
              Read the FAQ
            </ButtonLink>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border-t-2 border-teal-500 pt-6 text-navy-900">
              {s.clinicImage?.asset && (
                <SanityImg
                  image={s.clinicImage}
                  aspect={5 / 3}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="mb-5 rounded-lg"
                />
              )}
              <Eyebrow tone="gold" className="mb-5">
                Visiting
              </Eyebrow>
              <ul className="space-y-5">
                {address && (
                  <li className="flex gap-4">
                    <Pin className="mt-1 size-5 shrink-0 text-gold-700" aria-hidden />
                    <div>
                      <p className="text-lg font-semibold">{address.line1}</p>
                      <p className="text-muted">{address.line2}</p>
                      {s.mapUrl && (
                        <a
                          href={s.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 underline underline-offset-4"
                        >
                          Directions <ArrowRight className="size-4" aria-hidden />
                          <span className="sr-only">(opens Google Maps in a new tab)</span>
                        </a>
                      )}
                    </div>
                  </li>
                )}
                <li className="flex gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-gold-700" aria-hidden />
                  <a
                    href={`tel:${s.phoneE164}`}
                    data-track="book-visiting"
                    className="text-lg font-semibold hover:underline"
                  >
                    {s.phone}
                  </a>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-1 size-5 shrink-0 text-gold-700" aria-hidden />
                  <a href={`mailto:${s.email}`} data-track="book-visiting" className="text-lg hover:underline">
                    {s.email}
                  </a>
                </li>
                {!!s.hours?.length && (
                  <li className="flex gap-4">
                    <Clock className="mt-1 size-5 shrink-0 text-gold-700" aria-hidden />
                    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                      {s.hours.map((h) => (
                        <div key={h._key} className="contents">
                          <dt className="text-muted">{h.days}</dt>
                          <dd>{h.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                )}
              </ul>
              {s.parking && <p className="mt-6 border-t border-line pt-5 text-muted">{s.parking}</p>}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="white" id="contact">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">Ask a question</Eyebrow>
            <h2 className="display-md text-navy-900">Prefer to send a note?</h2>
            <p className="mt-4 text-muted">
              Send a scheduling or general practice question. Please keep detailed clinical information out of this
              form.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm intro={page?.formIntro} />
          </div>
        </div>
      </SectionShell>
    </>
  )
}

function BookingCard({
  o,
  phone,
  phoneE164,
  email,
  requested,
}: {
  o: BookingOption
  phone: string
  phoneE164: string
  email: string
  requested?: ProviderCard
}) {
  const id = stegaClean(o._id)
  const url = stegaClean(o.bookingUrl ?? '')
  const subject = encodeURIComponent(
    `Booking request: ${stegaClean(o.label)}${requested ? `; provider request: ${stegaClean(requested.name)}` : ''}`,
  )
  return (
    <li
      id={id}
      className="group grid scroll-mt-28 gap-x-10 gap-y-3 py-6 transition-colors target:bg-teal-100 lg:grid-cols-[1fr_1fr_auto]"
    >
      <div>
        <p className="text-sm text-muted">{o.situation}</p>
        <h3 className="display-sm mt-2 text-navy-900">{o.label}</h3>
        {!!o.providers?.length && (
          <p className="mt-2 text-sm text-teal-700">{o.providers.map((p) => p.name).join(' / ')}</p>
        )}
      </div>
      <div>
        {o.description && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{o.description}</p>}
        {(o.duration || o.priceNote) && (
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-900">
            {o.duration && <span>{o.duration}</span>}
            {o.priceNote && <span className="font-semibold">{o.priceNote}</span>}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-start lg:justify-center">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            data-booking-link={id}
            data-track="booking-card"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-orange-600 px-5 font-semibold text-white hover:bg-orange-700"
          >
            Book online <ArrowRight className="size-4" aria-hidden />
            <span className="sr-only">(opens the scheduling site in a new tab)</span>
          </a>
        ) : (
          <a
            href={`tel:${phoneE164}`}
            data-track={`booking-card:${id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-orange-600 px-5 text-[0.95rem] font-semibold text-white hover:bg-orange-700"
          >
            <Phone className="size-4" aria-hidden /> Call to book
            <span className="sr-only"> {phone}</span>
          </a>
        )}
        <a
          href={`mailto:${email}?subject=${subject}`}
          data-track={`booking-card:${id}`}
          className="text-sm font-semibold text-navy-900 underline underline-offset-4"
        >
          Request by email
        </a>
      </div>
    </li>
  )
}
