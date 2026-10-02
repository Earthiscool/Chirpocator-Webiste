'use client'

import {useEffect} from 'react'

/** Error boundary for site pages: never a blank screen; always a way to reach the practice. */
export default function SiteError({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error('[site] render error', error.digest)
  }, [error])
  return (
    <section className="container-site section-y">
      <p className="eyebrow text-gold-700">Something went wrong</p>
      <h1 className="display-lg mt-4 max-w-2xl text-navy-900">This page didn&apos;t load properly.</h1>
      <p className="lede mt-5 max-w-xl text-muted">Please try again. If it keeps happening, call the office at 610-298-5873.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-full bg-navy-900 px-6 font-semibold text-white">
          Try again
        </button>
        <a href="tel:+16102985873" className="inline-flex min-h-12 items-center rounded-full border border-navy-900/25 px-6 font-semibold text-navy-900">
          Call the office
        </a>
      </div>
    </section>
  )
}
