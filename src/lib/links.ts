import {stegaClean} from 'next-sanity'

/** Clean a CMS href (removes visual-editing markers) and classify it. */
export function resolveHref(href: string | null | undefined) {
  const clean = stegaClean(href ?? '')?.trim() ?? ''
  return {
    href: clean || '#',
    external: /^https?:\/\//.test(clean),
    isBook: clean === '/book' || clean.startsWith('/book#') || clean.startsWith('/book?'),
    isPhone: clean.startsWith('tel:'),
    isEmail: clean.startsWith('mailto:'),
  }
}

/** Split a string on *asterisks* so editors can italicize a phrase. */
export function emphasisParts(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part) =>
    part.startsWith('*') && part.endsWith('*') ? {em: true, text: part.slice(1, -1)} : {em: false, text: part},
  )
}
