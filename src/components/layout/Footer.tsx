import Link from 'next/link'

import {formatAddress, getNavigation, getSettings} from '@/lib/site'

import {Mail, Phone, Pin} from '../icons'
import {BrandLine} from '../ui'
import {Wordmark} from './Wordmark'

export async function Footer() {
  const [nav, s] = await Promise.all([getNavigation(), getSettings()])
  const address = formatAddress(s.address)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-white text-muted">
      <div className="container-site pb-28 pt-10 md:pb-8 md:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Wordmark name={s.practiceName} tone="light" />
            <BrandLine text={s.brandLine} tone="light" className="mt-6" />
            <address className="mt-8 space-y-3 not-italic">
              {address && (
                <a
                  href={s.mapUrl || '#'}
                  className="flex gap-3 text-[0.95rem] leading-relaxed hover:text-teal-700"
                  {...(s.mapUrl ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                >
                  <Pin className="mt-1 size-4 shrink-0 text-gold-700" aria-hidden />
                  <span>
                    {address.line1}
                    <br />
                    {address.line2}
                    {s.mapUrl && <span className="sr-only"> (directions, opens in a new tab)</span>}
                  </span>
                </a>
              )}
              <a
                href={`tel:${s.phoneE164}`}
                data-track="footer"
                className="flex items-center gap-3 text-[0.95rem] hover:text-teal-700"
              >
                <Phone className="size-4 shrink-0 text-gold-700" aria-hidden />
                {s.phone}
              </a>
              <a
                href={`mailto:${s.email}`}
                data-track="footer"
                className="flex items-center gap-3 text-[0.95rem] hover:text-teal-700"
              >
                <Mail className="size-4 shrink-0 text-gold-700" aria-hidden />
                {s.email}
              </a>
            </address>
            {!!s.hours?.length && (
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                {s.hours.map((h) => (
                  <div key={h._key} className="contents">
                    <dt className="text-muted">{h.days}</dt>
                    <dd>{h.hours}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
            {nav.footerGroups?.map((g) => (
              <div key={g._key}>
                <h2 className="eyebrow text-gold-700">{g.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {g.links?.map((l) => (
                    <li key={l._key ?? l.href}>
                      <Link
                        href={l.href}
                        className="text-[0.95rem] text-navy-900 transition-colors hover:text-teal-700"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {s.clinicalDisclaimer && (
          <p className="mt-8 max-w-3xl border-t border-line pt-5 text-sm leading-relaxed text-muted">
            {s.clinicalDisclaimer}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {s.practiceName}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="hover:text-teal-700">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-teal-700">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-teal-700">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-teal-700">
                Disclaimer
              </Link>
            </li>
            {s.socials?.map((so) => (
              <li key={so._key}>
                <a href={so.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-700">
                  {so.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
