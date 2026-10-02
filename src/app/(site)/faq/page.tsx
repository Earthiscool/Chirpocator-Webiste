import type {Metadata} from 'next'
import {stegaClean} from 'next-sanity'

import {FaqList} from '@/components/Faqs'
import {CtaBand, ItemGrid, PageHero, SectionShell} from '@/components/sections'
import {Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {sanityFetch} from '@/sanity/fetch'
import {faqPageQuery, faqsQuery} from '@/sanity/queries'
import type {FaqItem, FaqPage} from '@/sanity/types'

const categories: {value: string; title: string}[] = [
  {value: 'first-visit', title: 'Your first visit'},
  {value: 'approach', title: 'How care works'},
  {value: 'scheduling', title: 'Scheduling & logistics'},
  {value: 'payment', title: 'Payment & insurance'},
  {value: 'functional-health', title: 'Functional health'},
  {value: 'performance', title: 'Performance & golf'},
  {value: 'providers', title: 'For providers'},
]

const getData = () =>
  Promise.all([sanityFetch<FaqPage>({query: faqPageQuery, tags: ['faqPage']}), sanityFetch<FaqItem[]>({query: faqsQuery, tags: ['faq']})])

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await getData()
  return buildMetadata({seo: page?.seo, title: 'FAQ & What to Expect | IWC Wayne, PA', description: page?.intro, path: '/faq'})
}

export default async function FaqPageRoute() {
  const [page, faqs] = await getData()
  const groups = categories
    .map((c) => ({...c, items: (faqs ?? []).filter((f) => stegaClean(f.category) === c.value)}))
    .filter((g) => g.items.length)

  return (
    <>
      <PageHero eyebrow={page?.eyebrow || 'FAQ'} title={page?.headline || 'What to expect'} intro={page?.intro} />

      {!!page?.expectations?.length && (
        <SectionShell tone="navy">
          <Eyebrow tone="on-navy" className="mb-8">
            What you can count on
          </Eyebrow>
          <ol className="grid gap-x-12 md:grid-cols-2">
            {page.expectations.map((e, i) => (
              <li key={e} className="flex gap-5 border-t border-white/15 py-5">
                <span className="font-display text-xl text-gold-400" aria-hidden>
                  {i + 1}
                </span>
                <p className="text-[1.05rem] text-white">{e}</p>
              </li>
            ))}
          </ol>
        </SectionShell>
      )}

      {!!page?.firstVisitSteps?.length && (
        <SectionShell tone="white">
          <Eyebrow className="mb-4">Your first visit</Eyebrow>
          <h2 className="display-md mb-12 text-navy-900">Before, during, and after</h2>
          <ItemGrid items={page.firstVisitSteps} columns={3} />
        </SectionShell>
      )}

      <SectionShell tone="paper">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="FAQ topics" className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <Eyebrow className="mb-4">Topics</Eyebrow>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {groups.map((g) => (
                  <li key={g.value}>
                    <a href={`#${g.value}`} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm text-navy-900 hover:border-navy-900/40 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:hover:underline">
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="space-y-16 lg:col-span-9">
            {groups.map((g) => (
              <section key={g.value} id={g.value} className="scroll-mt-28" aria-labelledby={`${g.value}-h`}>
                <h2 id={`${g.value}-h`} className="display-sm mb-5 text-navy-900">
                  {g.title}
                </h2>
                <FaqList faqs={g.items} />
              </section>
            ))}
            {!groups.length && <p className="text-muted">Questions and answers are being updated. Please call the office.</p>}
          </div>
        </div>
      </SectionShell>

      <CtaBand
        title="Still have a question?"
        body="Call or send a short note — or use the guided Start Here page to find the right first visit."
        primary={{label: 'Book a Visit', href: '/book'}}
        secondary={{label: 'Start Here', href: '/start-here'}}
        track="faq-final"
      />
    </>
  )
}
