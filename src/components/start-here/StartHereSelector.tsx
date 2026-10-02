'use client'

import Link from 'next/link'
import {useRouter, useSearchParams} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {useEffect, useRef} from 'react'

import {track} from '@/lib/analytics'
import type {PathwayCard} from '@/sanity/types'

import {ArrowLeft, ArrowRight} from '../icons'
import {accentOf} from '@/lib/accent'

/**
 * Guided first step. Not a diagnostic quiz: one choice, a short explanation,
 * and two or three real next steps. Selection lives in the URL (?goal=…) so
 * the browser Back button and shared links work as expected.
 */
export function StartHereSelector({pathways, prompt}: {pathways: PathwayCard[]; prompt?: string}) {
  const router = useRouter()
  const params = useSearchParams()
  const goal = params.get('goal')
  const selected = pathways.find((p) => stegaClean(p.slug) === goal) ?? null
  const resultRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (selected) resultRef.current?.focus()
  }, [selected])

  const choose = (p: PathwayCard) => {
    const slug = stegaClean(p.slug)
    track('start_here_select', {pathway: slug})
    router.push(`/start-here?goal=${slug}#your-starting-point`, {scroll: false})
    requestAnimationFrame(() => document.getElementById('your-starting-point')?.scrollIntoView({behavior: 'smooth', block: 'start'}))
  }

  return (
    <div>
      <fieldset>
        <legend className="eyebrow mb-6 text-gold-700">{prompt || 'Which sounds most like you?'}</legend>
        <ul className="grid gap-4 md:grid-cols-2">
          {pathways.map((p) => {
            const a = accentOf(p.accent)
            const on = selected?._id === p._id
            return (
              <li key={p._id}>
                <button
                  type="button"
                  onClick={() => choose(p)}
                  aria-pressed={on}
                  aria-controls="your-starting-point"
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-6 text-left transition-[border-color,box-shadow,background-color] duration-300 md:p-8 ${
                    on
                      ? 'border-navy-900 bg-white shadow-[0_24px_50px_-28px_rgba(11,31,74,0.45)]'
                      : 'border-line bg-white hover:border-navy-900/30'
                  }`}
                >
                  <span className={`absolute inset-x-0 top-0 h-1 origin-left transition-transform duration-500 ${a.bar} ${on ? 'scale-x-100' : 'scale-x-[0.15] group-hover:scale-x-50'}`} aria-hidden />
                  <span className="flex items-center justify-between gap-4">
                    <span className="eyebrow text-navy-900">{p.title}</span>
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? 'border-navy-900 bg-navy-900' : 'border-navy-900/25'}`}
                      aria-hidden
                    >
                      {on && <span className="size-2 rounded-full bg-gold-400" />}
                    </span>
                  </span>
                  <span className="display-sm mt-5 block italic text-navy-900">&ldquo;{p.patientVoice}&rdquo;</span>
                  <span className="mt-3 block text-[0.97rem] leading-relaxed text-muted">{p.cardSummary}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <div id="your-starting-point" className="scroll-mt-28" aria-live="polite">
        {selected && (
          <section className="mt-12 overflow-hidden rounded-[1.75rem] bg-navy-900 text-white on-navy motion-safe:animate-[chat-in_0.4s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:p-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-gold-400">Your starting point</p>
                <h2 ref={resultRef} tabIndex={-1} className="display-md mt-3 outline-none">
                  {selected.title}
                </h2>
                {selected.startHereExplanation && <p className="mt-5 leading-relaxed text-navy-100">{selected.startHereExplanation}</p>}
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  <Link href={`/how-we-help/${stegaClean(selected.slug)}`} className="inline-flex items-center gap-2 font-semibold text-white underline decoration-gold-400 underline-offset-[6px]">
                    How we approach {selected.title} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <button type="button" onClick={() => router.push('/start-here', {scroll: false})} className="inline-flex items-center gap-2 text-sm text-navy-100 hover:text-white">
                    <ArrowLeft className="size-4" aria-hidden /> Choose a different path
                  </button>
                </div>
              </div>
              <ol className="grid gap-3 lg:col-span-7">
                {selected.nextSteps?.slice(0, 3).map((s, i) => {
                  const href = stegaClean(s.cta?.href ?? '/book')
                  const isBook = href.startsWith('/book')
                  return (
                    <li key={s._key}>
                      <Link
                        href={href}
                        onClick={() => track('start_here_next_step', {pathway: stegaClean(selected.slug), destination: href})}
                        {...(isBook ? {'data-track': 'start-here'} : {})}
                        className="group flex items-center gap-5 rounded-2xl border border-white/12 bg-white/[0.04] p-5 transition-colors hover:border-gold-400/60 hover:bg-white/[0.07] md:p-6"
                      >
                        <span className="font-display text-2xl text-gold-400" aria-hidden>
                          {i + 1}
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold text-white">{s.title}</span>
                          {s.body && <span className="mt-1 block text-[0.95rem] leading-snug text-navy-100">{s.body}</span>}
                          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                            {s.cta?.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
