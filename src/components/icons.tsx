import type {SVGProps} from 'react'

// One consistent line-icon family (1.5px stroke, 24px grid), per the blueprint.
type P = SVGProps<SVGSVGElement>
const base = {fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'} as const

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)
export const ArrowLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const Plus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const Menu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
export const Chevron = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)
export const Phone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.5l1.5 4.5-2 1.2a11 11 0 005.3 5.3l1.2-2 4.5 1.5V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" />
  </svg>
)
export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5L12 13l8.5-6.5" />
  </svg>
)
export const Pin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
export const Chat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v8a2.5 2.5 0 01-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 014 13.5z" />
    <path d="M8.5 9.5h7M8.5 12.5h4" />
  </svg>
)
export const Send = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12l16-8-6 16-2.5-6.5z" />
  </svg>
)
export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)
export const Clock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
