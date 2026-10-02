import type {FaqItem} from '@/sanity/types'

import {Plus} from './icons'
import {RichText} from './RichText'

/** Accessible accordion built on native <details> — works without JavaScript. */
export function FaqList({faqs, tone = 'light'}: {faqs?: FaqItem[] | null; tone?: 'light' | 'navy'}) {
  const list = faqs?.filter(Boolean) ?? []
  if (!list.length) return null
  const navy = tone === 'navy'
  return (
    <div className={`border-t ${navy ? 'border-white/15' : 'border-line'}`}>
      {list.map((f) => (
        <details key={f._id} className={`accordion group border-b ${navy ? 'border-white/15' : 'border-line'}`}>
          <summary
            className={`flex cursor-pointer items-start justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold leading-snug md:py-6 md:text-lg ${navy ? 'text-white' : 'text-navy-900'}`}
          >
            <span>{f.question}</span>
            <span
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border ${navy ? 'border-white/25' : 'border-navy-900/15'}`}
            >
              <Plus className="accordion-icon size-4" aria-hidden />
            </span>
          </summary>
          <div className="pb-6 pr-12">
            <RichText value={f.answer} className={navy ? 'on-navy' : ''} />
          </div>
        </details>
      ))}
    </div>
  )
}
