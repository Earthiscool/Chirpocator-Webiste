import type {Metadata} from 'next'
import {Suspense} from 'react'

import {Phone} from '@/components/icons'
import {PageHero, PathwayCards, SectionShell} from '@/components/sections'
import {StartHereSelector} from '@/components/start-here/StartHereSelector'
import {ButtonLink} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {getSettings} from '@/lib/site'
import {sanityFetch} from '@/sanity/fetch'
import {pathwayCardsQuery, startHerePageQuery} from '@/sanity/queries'
import type {PathwayCard, StartHerePage} from '@/sanity/types'

const getData = () =>
  Promise.all([
    sanityFetch<StartHerePage>({query: startHerePageQuery, tags: ['startHerePage']}),
    sanityFetch<PathwayCard[]>({query: pathwayCardsQuery, tags: ['pathway']}),
  ])

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await getData()
  return buildMetadata({seo: page?.seo, title: 'Start Here | IWC Wayne, PA', path: '/start-here'})
}

export default async function StartHerePage() {
  const [[page, pathways], settings] = await Promise.all([getData(), getSettings()])
  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow || 'Start Here'}
        title={
          page?.headline || 'You do not need to know which service to book. Start with what you are trying to solve.'
        }
        intro={page?.intro}
      />
      <SectionShell tone="paper" className="!pt-7 md:!pt-8">
        {pathways?.length ? (
          <Suspense fallback={<PathwayCards pathways={pathways} />}>
            <StartHereSelector pathways={pathways} prompt={page?.selectorPrompt} />
          </Suspense>
        ) : (
          <p className="lede text-muted">Call the office and we&apos;ll help you choose the right first visit.</p>
        )}
        {page?.reassurance && <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">{page.reassurance}</p>}
      </SectionShell>
      <SectionShell tone="white">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="display-md text-navy-900">{page?.unsureHeading || 'Still not sure?'}</h2>
            {page?.unsureBody && <p className="mt-3 text-muted">{page.unsureBody}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`tel:${settings.phoneE164}`} variant="primary" track="start-here-unsure">
              <Phone className="size-4" aria-hidden /> Call {settings.phone}
            </ButtonLink>
            <ButtonLink href="/book#contact" variant="secondary" track="start-here-unsure">
              Send a short note
            </ButtonLink>
          </div>
        </div>
      </SectionShell>
    </>
  )
}
