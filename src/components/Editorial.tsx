import type {ReactNode} from 'react'
import {CtaButton} from './ui'
import type {PathwayCard, TitledItem} from '@/sanity/types'

export function RecognitionRows({items}: {items?: string[]}) {
  if (!items?.length) return null
  return (
    <ul className="editorial-rows">
      {items.map((item) => (
        <li key={item} className="text-navy-900">
          {item}
        </li>
      ))}
    </ul>
  )
}
export function PracticalDetails({items}: {items?: TitledItem[]}) {
  if (!items?.length) return null
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <li key={item._key ?? item.title} className="grid gap-2 py-5 sm:grid-cols-[2rem_13rem_1fr] sm:gap-5">
          <span className="text-sm text-gold-700" aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-semibold text-navy-900">{item.title}</h3>
          {item.body && <p className="text-muted">{item.body}</p>}
        </li>
      ))}
    </ol>
  )
}
export function DecisionOptions({items}: {items?: PathwayCard['nextSteps']}) {
  if (!items?.length) return null
  return (
    <ul className={`grid gap-4 ${items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
      {items.map((item) => (
        <li key={item._key} className="decision-card flex flex-col">
          <h3 className="display-sm text-navy-900">{item.title}</h3>
          {item.body && <p className="mt-3 flex-1 text-muted">{item.body}</p>}
          <div className="mt-5">
            <CtaButton cta={item.cta} variant="link" arrow />
          </div>
        </li>
      ))}
    </ul>
  )
}
export function EditorialSection({title, children, aside}: {title: string; children: ReactNode; aside?: ReactNode}) {
  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div>
        <h2 className="display-md text-navy-900">{title}</h2>
        {aside}
      </div>
      <div>{children}</div>
    </div>
  )
}
