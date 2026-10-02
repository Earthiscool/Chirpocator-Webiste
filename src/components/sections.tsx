import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import type {ReactNode} from 'react'

import type {Accent, ArticleCard, Cta, PathwayCard, ProviderCard, Testimonial, TitledItem} from '@/sanity/types'

import {ArrowRight, Check} from './icons'
import {accentOf} from '@/lib/accent'

import {Reveal} from './Reveal'
import {SanityImg} from './SanityImg'
import {CtaButton, Emphasis, Eyebrow} from './ui'

export {accentOf}

/* ----------------------------------------------------------- Page hero */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  aside,
  accent,
}: {
  eyebrow?: string
  title: string
  intro?: string
  children?: ReactNode
  aside?: ReactNode
  accent?: Accent
}) {
  const a = accent ? accentOf(accent) : null
  return (
    <section className="page-hero relative border-b border-line bg-paper">
      <div className="container-site grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className={aside ? 'lg:col-span-7' : 'lg:col-span-10'}>
          {eyebrow && (
            <p className={`eyebrow mb-5 flex items-center gap-3 ${a ? a.text : 'text-gold-700'}`}>
              {a && <span className={`h-px w-8 ${a.bar}`} aria-hidden />}
              {eyebrow}
            </p>
          )}
          <h1 className="display-xl text-navy-900">
            <Emphasis text={title} />
          </h1>
          {intro && <p className="lede mt-6 max-w-2xl text-muted">{intro}</p>}
          {children && <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  )
}

/* ------------------------------------------------------- Pathway cards */
export function PathwayCards({pathways, headingLevel = 'h3'}: {pathways: PathwayCard[]; headingLevel?: 'h2' | 'h3'}) {
  const H = headingLevel
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pathways.map((p, i) => {
        const a = accentOf(p.accent)
        return (
          <Reveal as="li" key={p._id} delay={i * 80} className="h-full">
            <Link
              href={`/how-we-help/${p.slug}`}
              className="decision-card group relative flex h-full flex-col transition-colors duration-200"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.18] transition-transform duration-500 group-hover:scale-x-100 ${a.bar}`}
                aria-hidden
              />
              <H className="display-sm text-navy-900">{p.title}</H>
              <p className="mt-4 flex-1 text-[0.97rem] leading-relaxed text-muted">{p.cardSummary}</p>
              <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${a.text}`}>
                Explore this pathway
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        )
      })}
    </ul>
  )
}

/* ----------------------------------------------------- Process timeline */
export function ProcessTimeline({steps, tone = 'light'}: {steps: TitledItem[]; tone?: 'navy' | 'light'}) {
  const navy = tone === 'navy'
  return (
    <ol className="relative grid gap-0 md:grid-cols-5 md:gap-6">
      {/* the connecting line */}
      <span
        className={`absolute left-[0.6875rem] top-3 h-[calc(100%-1.5rem)] w-px md:left-0 md:top-[0.6875rem] md:h-px md:w-full ${navy ? 'bg-white/25' : 'bg-line'}`}
        aria-hidden
      />
      {steps.map((s, i) => (
        <Reveal as="li" key={s._key ?? s.title} delay={i * 110} className="relative pb-9 pl-11 md:pb-0 md:pl-0 md:pt-9">
          <span
            className={`absolute left-0 top-0 flex size-[1.4rem] items-center justify-center rounded-full border text-[0.68rem] font-semibold md:top-0 ${
              navy ? 'border-gold-400 bg-navy-900 text-gold-400' : 'border-gold-700 bg-paper text-gold-700'
            }`}
            aria-hidden
          >
            {i + 1}
          </span>
          <h3 className={`display-sm ${navy ? 'text-white' : 'text-navy-900'}`}>
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          {s.body && (
            <p className={`mt-2 text-[0.97rem] leading-relaxed ${navy ? 'text-navy-100' : 'text-muted'}`}>{s.body}</p>
          )}
        </Reveal>
      ))}
    </ol>
  )
}

/* --------------------------------------------------------- Testimonials */
export function Testimonials({items}: {items?: Testimonial[] | null}) {
  if (!items?.length) return null
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <Reveal as="li" key={t._id} delay={i * 80}>
          <figure className="flex h-full flex-col border-t border-gold-400 pt-6">
            <blockquote className="display-sm flex-1 text-navy-900">
              <p>&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="eyebrow mt-6 text-muted">{t.attribution}</figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------- Article cards */
const topicLabel: Record<string, string> = {
  'persistent-pain': 'Persistent pain',
  'sports-recovery': 'Sports + recovery',
  golf: 'Golf',
  'active-aging': 'Active aging',
  'functional-health': 'Functional health',
  gut: 'Gut / Holobiome',
  'recovery-technology': 'Recovery technology',
  'post-surgical': 'Post-surgical / scar',
}
export const topicName = (t: string) => topicLabel[stegaClean(t)] ?? t

export function ArticleCards({
  articles,
  headingLevel = 'h3',
}: {
  articles?: ArticleCard[] | null
  headingLevel?: 'h2' | 'h3'
}) {
  if (!articles?.length) return null
  const H = headingLevel
  return (
    <ul className="divide-y divide-line">
      {articles.map((a, i) => (
        <Reveal as="li" key={a._id} delay={i * 90}>
          <Link href={`/resources/${a.slug}`} className="group grid gap-4 py-6 md:grid-cols-[10rem_1fr] md:gap-8">
            <p className="eyebrow text-teal-700">
              {topicName(a.topic)}
              <span className="mt-2 block font-normal tracking-normal normal-case text-muted">
                {a.publishedAt
                  ? new Intl.DateTimeFormat('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'}).format(
                      new Date(a.publishedAt),
                    )
                  : ''}
              </span>
            </p>
            <div>
              {a.mainImage?.asset && (
                <SanityImg
                  image={a.mainImage}
                  aspect={5 / 2}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="mb-4 rounded-md"
                />
              )}
              <H className="display-sm mt-3 text-navy-900 decoration-gold-400 decoration-1 underline-offset-4 group-hover:underline">
                {a.title}
              </H>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{a.excerpt}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                {a.author ? `By ${a.author.name} · ` : 'IWC · '}Read
                {a.readingMinutes ? ` · ${Math.max(1, a.readingMinutes)} min` : ''}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------ Simple lists */
export function CheckList({
  items,
  tone = 'light',
  columns = 1,
}: {
  items?: string[] | null
  tone?: 'light' | 'navy'
  columns?: 1 | 2
}) {
  if (!items?.length) return null
  const navy = tone === 'navy'
  return (
    <ul className={`grid gap-x-10 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
      {items.map((it) => (
        <li
          key={it}
          className={`flex gap-4 border-b py-4 ${navy ? 'border-white/12 text-white' : 'border-line text-navy-900'}`}
        >
          <Check className={`mt-1 size-4 shrink-0 ${navy ? 'text-gold-400' : 'text-teal-700'}`} aria-hidden />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function ItemGrid({items, columns = 3}: {items?: TitledItem[] | null; columns?: 2 | 3 | 4}) {
  if (!items?.length) return null
  const cols = {2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4'}[columns]
  return (
    <ul className={`grid gap-x-8 gap-y-10 ${cols}`}>
      {items.map((it, i) => (
        <Reveal as="li" key={it._key ?? it.title} delay={i * 70} className="border-t border-navy-900/15 pt-5">
          <h3 className="font-semibold text-navy-900">{it.title}</h3>
          {it.body && <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{it.body}</p>}
        </Reveal>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------- CTA band */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  track = 'cta-band',
}: {
  title?: string
  body?: string
  primary?: Cta | null
  secondary?: Cta | null
  track?: string
}) {
  if (!title) return null
  return (
    <section id="final-cta" className="border-t border-line bg-teal-100" data-track={track}>
      <div className="container-site py-10 md:flex md:items-center md:justify-between md:gap-12 md:py-14">
        <div className="max-w-2xl">
          <h2 className="display-lg text-navy-900">
            <Emphasis text={title} />
          </h2>
          {body && <p className="mt-3 text-muted">{body}</p>}
        </div>
        <div className="mt-6 flex shrink-0 flex-wrap items-center gap-5 md:mt-0">
          <CtaButton cta={primary} variant="primary" track={track} arrow />
          <CtaButton cta={secondary} variant="link" track={track} />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ Provider card */
export function ProviderTile({p}: {p: ProviderCard}) {
  return (
    <Link href={`/team/${p.slug}`} className="group block">
      <SanityImg
        image={p.photo}
        aspect={4 / 5}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        className="rounded-lg"
      />
      <h3 className="display-sm mt-5 text-navy-900 decoration-gold-400 decoration-1 underline-offset-4 group-hover:underline">
        {p.name}
        {p.credentials && <span className="text-muted">, {p.credentials}</span>}
      </h3>
      <p className="eyebrow mt-2 text-teal-700">{p.role}</p>
      {p.headline && <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{p.headline}</p>}
    </Link>
  )
}

export function SectionShell({
  id,
  children,
  tone = 'paper',
  className = '',
}: {
  id?: string
  children: ReactNode
  tone?: 'paper' | 'white' | 'navy' | 'deep'
  className?: string
}) {
  const bg = {paper: 'bg-paper', white: 'bg-white', navy: 'on-navy bg-navy-900 text-white', deep: 'bg-paper-deep'}[tone]
  return (
    <section id={id} className={`${bg} section-y ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  )
}

export {Eyebrow}
