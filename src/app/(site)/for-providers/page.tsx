import type {Metadata} from 'next'

import {ProviderForm} from '@/components/forms/ProviderForm'
import {Phone} from '@/components/icons'
import {RichText} from '@/components/RichText'
import {CheckList, ItemGrid, PageHero, SectionShell} from '@/components/sections'
import {ButtonLink, Eyebrow} from '@/components/ui'
import {buildMetadata} from '@/lib/seo'
import {getSettings} from '@/lib/site'
import {sanityFetch} from '@/sanity/fetch'
import {providersPageQuery} from '@/sanity/queries'
import type {ProvidersPage} from '@/sanity/types'

const getPage = () => sanityFetch<ProvidersPage>({query: providersPageQuery, tags: ['providersPage']})

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  return buildMetadata({seo: page?.seo, title: 'Refer a Patient | Integrative Wellbeing & Chiropractic', description: page?.intro, path: '/for-providers'})
}

export default async function ForProvidersPage() {
  const [page, s] = await Promise.all([getPage(), getSettings()])
  const email = s.providerEmail || s.email
  return (
    <>
      <PageHero eyebrow={page?.eyebrow || 'For Providers'} title={page?.headline || 'For providers'} intro={page?.intro}>
        <ButtonLink href="#refer" variant="primary" track="providers-hero">
          Refer a patient
        </ButtonLink>
        <ButtonLink href={`tel:${s.phoneE164}`} variant="link" track="providers-hero">
          <Phone className="size-4" aria-hidden /> {s.phone}
        </ButtonLink>
      </PageHero>

      <SectionShell tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {!!page?.audience?.length && (
            <div>
              <Eyebrow className="mb-4">Who we collaborate with</Eyebrow>
              <CheckList items={page.audience} />
            </div>
          )}
          {!!page?.clinicalFit?.length && (
            <div>
              <Eyebrow className="mb-4">Clinical fit</Eyebrow>
              <CheckList items={page.clinicalFit} />
            </div>
          )}
        </div>
        {page?.promise && <p className="lede mt-16 max-w-3xl border-l border-gold-400 pl-6 font-display text-[1.5rem] leading-snug text-navy-900">{page.promise}</p>}
      </SectionShell>

      {!!page?.whatWeDo?.length && (
        <SectionShell tone="paper">
          <Eyebrow className="mb-4">What we do</Eyebrow>
          <h2 className="display-md mb-12 text-navy-900">Assessment, selective tools, education, and a functional plan</h2>
          <ItemGrid items={page.whatWeDo} columns={4} />
        </SectionShell>
      )}

      <SectionShell tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {!!page?.whatWeDoNot?.length && (
            <div className="rounded-2xl bg-paper p-7 md:p-9">
              <Eyebrow tone="teal" className="mb-4">
                Scope
              </Eyebrow>
              <h2 className="display-sm mb-5 text-navy-900">What we do not do</h2>
              <ul className="space-y-4">
                {page.whatWeDoNot.map((b) => (
                  <li key={b} className="flex gap-4 text-navy-900">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-teal-700" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!page?.communication?.length && (
            <div>
              <Eyebrow className="mb-4">Communication</Eyebrow>
              <h2 className="display-sm mb-5 text-navy-900">How referral updates are handled</h2>
              <RichText value={page.communication} />
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell tone="paper" id="refer">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">Refer a patient</Eyebrow>
            <h2 className="display-md text-navy-900">Start with a conversation</h2>
            <p className="mt-4 text-muted">Introduce yourself and we will call you back to discuss the patient and arrange a secure way to share records.</p>
            <dl className="mt-8 space-y-3 text-navy-900">
              <div>
                <dt className="text-sm text-muted">Direct line</dt>
                <dd>
                  <a href={`tel:${s.phoneE164}`} data-track="providers-direct" className="font-display text-xl hover:underline">
                    {s.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Professional email (no patient information)</dt>
                <dd>
                  <a href={`mailto:${email}?subject=${encodeURIComponent('Provider inquiry')}`} data-track="providers-direct" className="underline underline-offset-4">
                    {email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ProviderForm notice={page?.referralNotice} />
          </div>
        </div>
      </SectionShell>
    </>
  )
}
