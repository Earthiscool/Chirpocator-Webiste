import Link from 'next/link'

import {Footer} from '@/components/layout/Footer'
import {Header} from '@/components/layout/Header'
import {ButtonLink} from '@/components/ui'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container-site section-y">
        <p className="eyebrow text-gold-700">Page not found</p>
        <h1 className="display-lg mt-4 max-w-2xl text-navy-900">We couldn&apos;t find that page. We can still help you find the right starting point.</h1>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/start-here" variant="primary" arrow>
            Start Here
          </ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Book a Visit
          </ButtonLink>
        </div>
        <p className="mt-10 text-muted">
          Or go to the <Link href="/" className="underline underline-offset-4">homepage</Link>.
        </p>
      </main>
      <Footer />
    </>
  )
}
