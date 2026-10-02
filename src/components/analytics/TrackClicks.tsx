'use client'

import {useEffect} from 'react'

import {track} from '@/lib/analytics'

/**
 * One delegated listener instead of a client component per button.
 * Classifies clicks on booking links, phone and email links, and tags them
 * with the `data-track` location (e.g. "hero", "header", "final-cta").
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      const location = a.closest<HTMLElement>('[data-track]')?.dataset.track ?? a.closest('section')?.id ?? 'page'
      if (href.startsWith('tel:')) track('phone_click', {location})
      else if (href.startsWith('mailto:')) track('email_click', {location})
      else if (href === '/book' || href.startsWith('/book#') || a.dataset.bookingLink !== undefined)
        track('book_click', {location, destination: a.dataset.bookingLink || href})
    }
    document.addEventListener('click', onClick, {capture: true})
    return () => document.removeEventListener('click', onClick, {capture: true})
  }, [])
  return null
}
