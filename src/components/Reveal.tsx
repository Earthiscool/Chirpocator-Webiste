import type {ElementType, ReactNode} from 'react'

/** Essential content is visible in the server response. */
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  return (
    <Tag className={`reveal ${className}`} data-visible="true">
      {children}
    </Tag>
  )
}
