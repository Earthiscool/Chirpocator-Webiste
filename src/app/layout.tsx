import type {Metadata, Viewport} from 'next'
import {Hanken_Grotesk, Newsreader} from 'next/font/google'

import {siteUrl} from '@/lib/site'

import './globals.css'

// Editorial display face (with optical sizes) + highly readable grotesk body.
// Provisional pending the client's font decision (handwritten note: "Fonts").
const newsreader = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})
const hanken = Hanken_Grotesk({subsets: ['latin'], variable: '--font-hanken', display: 'swap'})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
}

export const viewport: Viewport = {
  themeColor: '#f4f6f7',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en-US" className={`${newsreader.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  )
}
