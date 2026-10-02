import {getNavigation, getSettings} from '@/lib/site'

import {NavMenu} from './NavMenu'
import {Wordmark} from './Wordmark'

export async function Header() {
  const [nav, settings] = await Promise.all([getNavigation(), getSettings()])
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Wordmark logo={settings.logo} name={settings.practiceName} />
        <NavMenu
          items={nav.main ?? []}
          bookLabel={nav.bookLabel || 'Book a Visit'}
          phone={settings.phone}
          phoneE164={settings.phoneE164}
        />
      </div>
    </header>
  )
}
