import {stegaClean} from 'next-sanity'

import type {Accent} from '@/sanity/types'

/** Pathway accent colours (CMS value → utility classes). */
export const accentStyles: Record<Accent, {bar: string; text: string; dot: string; soft: string}> = {
  teal: {bar: 'bg-teal-500', text: 'text-teal-700', dot: 'bg-teal-500', soft: 'bg-teal-100'},
  gold: {bar: 'bg-gold-400', text: 'text-gold-700', dot: 'bg-gold-400', soft: 'bg-gold-100'},
  sky: {bar: 'bg-sky-300', text: 'text-navy-700', dot: 'bg-sky-300', soft: 'bg-sky-100'},
  navy: {bar: 'bg-navy-900', text: 'text-navy-900', dot: 'bg-navy-900', soft: 'bg-navy-100'},
}
export const accentOf = (a?: string) => accentStyles[(stegaClean(a) as Accent) || 'teal'] ?? accentStyles.teal
