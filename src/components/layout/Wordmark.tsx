import Image from 'next/image'
import Link from 'next/link'

import {imageUrl} from '@/sanity/image'
import type {SanityImage} from '@/sanity/types'

/**
 * Typographic wordmark. The brand brief describes a "three-point gold crown"
 * logo, while the current site uses a wave mark — until official logo files
 * are supplied, we use type only. Uploading a logo in Site settings replaces it.
 */
export function Wordmark({logo, name, tone = 'light'}: {logo?: SanityImage; name: string; tone?: 'light' | 'navy'}) {
  if (logo?.asset?._id) {
    return (
      <Link href="/" className="flex items-center" aria-label={`${name} — home`}>
        <Image src={imageUrl(logo, 400)} alt="" width={180} height={48} className="h-10 w-auto" preload />
      </Link>
    )
  }
  const navy = tone === 'navy'
  return (
    <Link href="/" className="group flex flex-col leading-none" aria-label={`${name} — home`}>
      <span
        className={`whitespace-nowrap font-display text-[1.3rem] tracking-[-0.01em] md:text-[1.5rem] ${navy ? 'text-white' : 'text-navy-900'}`}
        style={{fontVariationSettings: "'opsz' 36", fontWeight: 460}}
      >
        Integrative Wellbeing
      </span>
      <span
        className={`mt-1 text-[0.62rem] font-semibold tracking-[0.3em] ${navy ? 'text-gold-400' : 'text-gold-700'}`}
      >
        &amp; CHIROPRACTIC
      </span>
    </Link>
  )
}
