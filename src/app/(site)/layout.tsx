import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'

import {GoogleAnalytics} from '@/components/analytics/GoogleAnalytics'
import {TrackClicks} from '@/components/analytics/TrackClicks'
import {ChatLauncher} from '@/components/chat/ChatLauncher'
import {DraftModeBanner} from '@/components/layout/DraftModeBanner'
import {Footer} from '@/components/layout/Footer'
import {Header} from '@/components/layout/Header'
import {MobileActionBar} from '@/components/layout/MobileActionBar'
import {OrganizationJsonLd} from '@/components/seo/JsonLd'
import {getNavigation, getSettings} from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.defaultSeo?.title || s.practiceName
  return {
    title: {default: title, template: `%s`},
    description: s.defaultSeo?.description,
    applicationName: s.practiceName,
    openGraph: {type: 'website', siteName: s.practiceName, locale: 'en_US'},
    twitter: {card: 'summary_large_image'},
  }
}

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const [{isEnabled: isDraft}, settings, nav] = await Promise.all([draftMode(), getSettings(), getNavigation()])
  const assistant = settings.assistantEnabled !== false

  return (
    <>
      {isDraft && <DraftModeBanner />}
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileActionBar phoneE164={settings.phoneE164} bookLabel={nav.bookLabel || 'Book a Visit'} assistant={assistant} />
      {assistant && (
        <ChatLauncher
          welcome={settings.assistantWelcome}
          suggestions={settings.assistantSuggestions}
          notice={settings.assistantNotice}
          phone={settings.phone}
          phoneE164={settings.phoneE164}
        />
      )}
      <OrganizationJsonLd settings={settings} />
      <TrackClicks />
      <GoogleAnalytics />
      {isDraft && <VisualEditing />}
    </>
  )
}
