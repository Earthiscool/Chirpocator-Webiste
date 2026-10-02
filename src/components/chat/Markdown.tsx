import Link from 'next/link'
import type {ReactNode} from 'react'

/**
 * Minimal, safe Markdown for assistant replies: paragraphs, bullet lists,
 * **bold** and [links]. Renders React elements only (no HTML injection).
 * Links are restricted to site paths, tel: and mailto:, anything else is
 * shown as plain text, so the model can never send visitors off-site.
 */
const SAFE_HREF = /^(\/(?!\/)[\w\-/#?=&%.]*|tel:\+?[\d-]+|mailto:[^\s]+)$/

function inline(text: string, onLink?: (href: string) => void, keyBase = ''): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      const href = m[2]
      if (SAFE_HREF.test(href)) {
        out.push(
          href.startsWith('/') ? (
            <Link key={`${keyBase}l${i++}`} href={href} onClick={() => onLink?.(href)} className="font-semibold text-teal-700 underline underline-offset-4">
              {m[1]}
            </Link>
          ) : (
            <a key={`${keyBase}l${i++}`} href={href} onClick={() => onLink?.(href)} className="font-semibold text-teal-700 underline underline-offset-4">
              {m[1]}
            </a>
          ),
        )
      } else {
        out.push(m[1])
      }
    } else {
      out.push(
        <strong key={`${keyBase}b${i++}`} className="font-semibold">
          {m[3]}
        </strong>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({text, onLink}: {text: string; onLink?: (href: string) => void}) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/)
  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim())
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={bi} className="space-y-1.5">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-[0.7em] h-px w-2.5 shrink-0 bg-gold-700" aria-hidden />
                  <span>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''), onLink, `${bi}-${li}`)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''), onLink, `${bi}-${li}`)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
