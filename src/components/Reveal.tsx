'use client'

import {useEffect, useRef, type ElementType, type ReactNode} from 'react'

/** Fades content in once as it scrolls into view. Disabled by reduced-motion CSS. */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.dataset.visible = 'true'
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.visible = 'true'
            io.unobserve(e.target)
          }
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.08},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{'--reveal-delay': `${delay}ms`} as React.CSSProperties}>
      {children}
    </Tag>
  )
}
