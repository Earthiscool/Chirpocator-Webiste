import Link from 'next/link'
import {PortableText, stegaClean, type PortableTextComponents} from 'next-sanity'

import type {RichText as RichTextValue, SanityImage} from '@/sanity/types'

import {SanityImg} from './SanityImg'

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href = stegaClean((value as {href?: string})?.href ?? '')
      if (href.startsWith('/')) return <Link href={href}>{children}</Link>
      const external = href.startsWith('http')
      return (
        <a href={href} {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      )
    },
  },
  types: {
    accessibleImage: ({value}) => (
      <figure className="my-10">
        <SanityImg image={value as SanityImage} aspect={3 / 2} sizes="(min-width: 768px) 680px, 100vw" className="rounded-sm" />
        {(value as SanityImage).alt && !(value as SanityImage).decorative && (
          <figcaption className="mt-3 text-sm text-muted">{(value as SanityImage).alt}</figcaption>
        )}
      </figure>
    ),
    callout: ({value}) => {
      const v = value as {title?: string; body: string}
      return (
        <aside className="my-10 border-l-2 border-gold-400 bg-white px-6 py-5">
          {v.title && <p className="eyebrow mb-2 text-gold-700">{v.title}</p>}
          <p className="m-0 text-navy-900">{v.body}</p>
        </aside>
      )
    },
  },
}

export function RichText({value, className = ''}: {value?: RichTextValue | null; className?: string}) {
  if (!value?.length) return null
  return (
    <div className={`prose-iwc ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}
