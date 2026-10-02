import Link from 'next/link'
import type {ComponentProps, ReactNode} from 'react'

import {emphasisParts, resolveHref} from '@/lib/links'
import type {Cta} from '@/sanity/types'

import {ArrowRight} from './icons'

/* ------------------------------------------------------------------ Button */
type Variant = 'book' | 'primary' | 'primary-on-navy' | 'secondary' | 'secondary-on-navy' | 'link' | 'link-on-navy'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out select-none'
const sizes = 'min-h-12 px-5 text-[0.95rem] rounded-md'
const variants: Record<Variant, string> = {
  // The one loud button: "Book a Visit" (client: orange for CTA).
  book: `${base} ${sizes} bg-orange-600 text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] hover:bg-orange-700 active:translate-y-px`,
  primary: `${base} ${sizes} bg-orange-600 text-white hover:bg-orange-700 active:translate-y-px`,
  'primary-on-navy': `${base} ${sizes} bg-white text-navy-900 hover:bg-gold-100 active:translate-y-px`,
  secondary: `${base} ${sizes} border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-white`,
  'secondary-on-navy': `${base} ${sizes} border border-white/30 text-white hover:border-white hover:bg-white/5`,
  link: `${base} group text-navy-900 underline-offset-[6px] decoration-gold-400 decoration-1 hover:underline`,
  'link-on-navy': `${base} group text-white underline-offset-[6px] decoration-gold-400 decoration-1 hover:underline`,
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string | null | undefined
  variant?: Variant
  /** Where on the page this button lives, for analytics (e.g. "hero"). */
  track?: string
  arrow?: boolean
}

export function ButtonLink({
  href,
  variant = 'primary',
  track,
  arrow,
  children,
  className = '',
  ...rest
}: ButtonLinkProps) {
  const r = resolveHref(href)
  const trackAttrs = track ? {'data-track': track} : {}
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      )}
    </>
  )
  const cls = `${variants[variant]} ${className}`
  if (r.external || r.isPhone || r.isEmail) {
    return (
      <a
        href={r.href}
        className={cls}
        {...trackAttrs}
        {...(r.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      >
        {content}
        {r.external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  return (
    <Link href={r.href} className={cls} {...trackAttrs} {...rest}>
      {content}
    </Link>
  )
}

export function CtaButton({
  cta,
  variant,
  track,
  arrow,
}: {
  cta?: Cta | null
  variant?: Variant
  track?: string
  arrow?: boolean
}) {
  if (!cta?.label || !cta.href) return null
  return (
    <ButtonLink href={cta.href} variant={variant} track={track} arrow={arrow}>
      {cta.label}
    </ButtonLink>
  )
}

/* ----------------------------------------------------------- Typography */
/** Renders text where *phrases in asterisks* become italic display type. */
export function Emphasis({text}: {text?: string | null}) {
  if (!text) return null
  return (
    <>
      {emphasisParts(text).map((p, i) =>
        p.em ? (
          <em key={i} className="font-[inherit] italic">
            {p.text}
          </em>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  )
}

export function Eyebrow({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode
  tone?: 'gold' | 'teal' | 'navy' | 'on-navy'
  className?: string
}) {
  const color = {gold: 'text-gold-700', teal: 'text-teal-700', navy: 'text-navy-900', 'on-navy': 'text-gold-400'}[tone]
  return <p className={`eyebrow ${color} ${className}`}>{children}</p>
}

/** "Pain | Performance | Prevention" with refined dividers. */
export function BrandLine({
  text,
  tone = 'light',
  className = '',
}: {
  text?: string
  tone?: 'light' | 'navy'
  className?: string
}) {
  const parts = (text ?? 'Pain | Performance | Prevention').split('|').map((s) => s.trim())
  return (
    <p
      className={`eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 ${tone === 'navy' ? 'text-gold-400' : 'text-gold-700'} ${className}`}
    >
      {parts.map((p, i) => (
        <span key={p} className="flex items-center gap-3">
          {i > 0 && (
            <span aria-hidden className={`h-3 w-px ${tone === 'navy' ? 'bg-gold-400/60' : 'bg-gold-700/40'}`} />
          )}
          {p}
        </span>
      ))}
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  tone = 'light',
  align = 'left',
  as: Tag = 'h2',
  className = '',
}: {
  eyebrow?: string
  title?: string
  intro?: string
  tone?: 'light' | 'navy'
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}) {
  if (!title) return null
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <Eyebrow tone={tone === 'navy' ? 'on-navy' : 'gold'} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <Tag className={`display-lg ${tone === 'navy' ? 'text-white' : 'text-navy-900'}`}>
        <Emphasis text={title} />
      </Tag>
      {intro && <p className={`lede mt-5 ${tone === 'navy' ? 'text-navy-100' : 'text-muted'}`}>{intro}</p>}
    </div>
  )
}

/** Gold hairline used to separate ideas without boxes. */
export function Rule({className = ''}: {className?: string}) {
  return <hr className={`border-0 border-t border-line ${className}`} />
}
