import 'server-only'

import {cache} from 'react'

import {sanityFetch, sanityFetchStatic} from '@/sanity/fetch'
import {navigationQuery, settingsQuery} from '@/sanity/queries'
import type {Navigation, SiteSettings} from '@/sanity/types'

/**
 * Minimal fallbacks so the header/footer still render (and visitors can still
 * call) if the CMS is temporarily unreachable. Values mirror the practice's
 * published contact details; the CMS is the source of truth.
 */
const fallbackSettings: SiteSettings = {
  practiceName: 'Integrative Wellbeing & Chiropractic',
  shortName: 'IWC',
  brandLine: 'Pain | Performance | Prevention',
  phone: '610-298-5873',
  phoneE164: '+16102985873',
  email: 'info@iwcmainline.com',
  assistantEnabled: true,
}

const fallbackNavigation: Navigation = {
  bookLabel: 'Book a Visit',
  main: [
    {label: 'Start Here', href: '/start-here'},
    {
      label: 'How We Help',
      href: '/how-we-help',
      children: [
        {label: 'Pain + Recovery', href: '/how-we-help/pain-recovery'},
        {label: 'Performance', href: '/how-we-help/performance'},
        {label: 'Prevention + Active Aging', href: '/how-we-help/prevention-active-aging'},
        {label: 'Functional Health', href: '/how-we-help/functional-health'},
      ],
    },
    {label: 'About', href: '/about'},
    {label: 'Resources', href: '/resources'},
    {label: 'For Providers', href: '/for-providers'},
  ],
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const data = await sanityFetch<SiteSettings>({query: settingsQuery, tags: ['siteSettings']})
  return data ? {...fallbackSettings, ...data} : fallbackSettings
})

/** APIs use published settings even when an editor has a preview cookie. */
export const getPublishedSettings = cache(async (): Promise<SiteSettings> => {
  const data = await sanityFetchStatic<SiteSettings>(settingsQuery)
  return data ? {...fallbackSettings, ...data} : fallbackSettings
})

export const getNavigation = cache(async (): Promise<Navigation> => {
  const data = await sanityFetch<Navigation>({query: navigationQuery, tags: ['navigation']})
  return data?.main?.length ? data : fallbackNavigation
})

export function siteUrl(path = '') {
  // Explicit site URL → Vercel's production domain (set automatically) → local dev.
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const preview =
    process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  const base = (
    preview ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelProd ? `https://${vercelProd}` : 'http://localhost:3000')
  ).replace(/\/$/, '')
  return `${base}${path}`
}

export function formatAddress(a: SiteSettings['address']) {
  if (!a?.street) return null
  return {
    line1: [a.street, a.suite].filter(Boolean).join(', '),
    line2: [a.city, [a.region, a.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', '),
  }
}
