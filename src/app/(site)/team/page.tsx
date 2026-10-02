import type {Metadata} from 'next'

import {Reveal} from '@/components/Reveal'
import {CtaBand, PageHero, ProviderTile, SectionShell} from '@/components/sections'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {providersQuery, teamPageQuery} from '@/sanity/queries'
import type {ProviderCard, TeamPage} from '@/sanity/types'

const getData = () =>
  Promise.all([
    sanityFetch<TeamPage>({query: teamPageQuery, tags: ['teamPage']}),
    sanityFetch<ProviderCard[]>({query: providersQuery, tags: ['provider']}),
  ])

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await getData()
  return buildMetadata({seo: page?.seo, title: 'Our Team | IWC Wayne, PA', description: page?.intro, path: '/team'})
}

export default async function TeamPageRoute() {
  const [page, providers] = await getData()
  return (
    <>
      <PageHero eyebrow={page?.eyebrow || 'Team'} title={page?.headline || 'Our team'} intro={page?.intro} />
      <SectionShell tone="paper">
        {providers?.length ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p, i) => (
              <Reveal as="li" key={p._id} delay={i * 90}>
                <ProviderTile p={p} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Team profiles are being updated.</p>
        )}
        {page?.collectiveNote && <p className="mt-16 max-w-2xl border-t border-line pt-8 text-lg text-navy-900">{page.collectiveNote}</p>}
      </SectionShell>
      <CtaBand
        title="Not sure who to see? Start with what you are trying to solve."
        primary={{label: 'Start Here', href: '/start-here'}}
        secondary={{label: 'Book a Visit', href: '/book'}}
        track="team-final"
      />
    </>
  )
}
