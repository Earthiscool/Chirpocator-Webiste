import type {Metadata} from 'next'

import {ArticleCards, CtaBand, PageHero, PathwayCards, ProcessTimeline, SectionShell} from '@/components/sections'
import {ButtonLink, Eyebrow, SectionHeader} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {homeQuery} from '@/sanity/queries'
import type {HomePage} from '@/sanity/types'

const getData = () => sanityFetch<HomePage>({query: homeQuery, tags: ['homePage', 'pathway', 'article']})

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'How We Help | Pain, Performance, Prevention & Functional Health | IWC',
    description:
      'Four ways into care at IWC in Wayne, PA: Pain + Recovery, Performance, Prevention + Active Aging, and Functional Health. Choose by what you are trying to solve.',
    path: '/how-we-help',
  })
}

/** Overview hub: the four pathways, the process, and the toolbox in context. */
export default async function HowWeHelpPage() {
  const home = await getData()
  return (
    <>
      <PageHero
        eyebrow="How We Help"
        title="Choose by what you are trying to solve — not by the name of a treatment."
        intro="IWC is built around four connected pathways. Each one starts with listening and assessment, and uses only the tools that make sense for you."
      >
        <ButtonLink href="/start-here" variant="primary" arrow track="how-we-help-hero">
          Start Here
        </ButtonLink>
      </PageHero>
      <SectionShell tone="paper">{home?.pathways && <PathwayCards pathways={home.pathways} headingLevel="h2" />}</SectionShell>
      {home?.processSteps && (
        <SectionShell tone="navy">
          <SectionHeader eyebrow="Every pathway" title="The same thinking, whichever way you come in" tone="navy" className="mb-14" />
          <ProcessTimeline steps={home.processSteps} />
        </SectionShell>
      )}
      {!!home?.toolGroups?.length && (
        <SectionShell tone="white">
          <SectionHeader eyebrow="Services in context" title={home.toolsHeading} intro={home.toolsIntro} className="mb-12" />
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {home.toolGroups.map((g) => (
              <div key={g._key} className="border-t border-navy-900/15 pt-5">
                <h2 className="display-sm text-navy-900">{g.title}</h2>
                <ul className="mt-4 space-y-2 text-[0.95rem] text-muted">
                  {g.items?.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </SectionShell>
      )}
      {!!home?.latestArticles?.length && (
        <SectionShell tone="paper">
          <Eyebrow className="mb-4">Resources</Eyebrow>
          <h2 className="display-md mb-10 text-navy-900">Practitioner-led answers</h2>
          <ArticleCards articles={home.latestArticles} />
        </SectionShell>
      )}
      <CtaBand
        title={home?.finalHeading || 'You just need the right starting point.'}
        body={home?.finalBody}
        primary={{label: 'Start Here', href: '/start-here'}}
        secondary={{label: 'Book a Visit', href: '/book'}}
        track="how-we-help-final"
      />
    </>
  )
}
