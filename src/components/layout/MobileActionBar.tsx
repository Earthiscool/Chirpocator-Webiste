'use client'

import Link from 'next/link'
import {Chat, Phone} from '../icons'

/**
 * Persistent thumb-reach actions on phones (the mobile "Book a Visit" CTA).
 * One loud action (Book) and two quiet ones, never three equals.
 * The assistant launches from here on mobile so it never covers page controls.
 */
export function MobileActionBar({phoneE164, bookLabel, assistant}: {phoneE164: string; bookLabel: string; assistant: boolean}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
      role="region"
      aria-label="Quick actions"
    >
      <div className="flex items-center gap-2">
        <a
          href={`tel:${phoneE164}`}
          data-track="mobile-bar"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-navy-900/15 text-navy-900"
          aria-label="Call the office"
        >
          <Phone className="size-5" aria-hidden />
        </a>
        {assistant && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('iwc:open-chat', {detail: {location: 'mobile-bar'}}))}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-navy-900/15 text-navy-900"
            aria-label="Ask the IWC website assistant"
          >
            <Chat className="size-5" aria-hidden />
          </button>
        )}
        <Link
          href="/book"
          data-track="mobile-bar"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-orange-600 font-semibold text-white"
        >
          {bookLabel}
        </Link>
      </div>
    </div>
  )
}
