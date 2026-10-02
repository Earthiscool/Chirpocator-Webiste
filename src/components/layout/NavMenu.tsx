'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useCallback, useEffect, useId, useRef, useState} from 'react'

import type {NavItem} from '@/sanity/types'

import {ArrowRight, Chevron, Close, Menu, Phone} from '../icons'

interface Props {
  items: NavItem[]
  bookLabel: string
  phone: string
  phoneE164: string
}

export function NavMenu({items, bookLabel, phone, phoneE164}: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Close menus on navigation (state adjusted during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(null)
    setDrawer(false)
  }

  // Escape and outside-click close the desktop dropdown.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const onClick = (e: MouseEvent) => !navRef.current?.contains(e.target as Node) && setOpen(null)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <nav ref={navRef} aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.label} className="relative">
              {item.children?.length ? (
                <DesktopDropdown
                  item={item}
                  open={open === item.label}
                  setOpen={setOpen}
                  active={isActive(item.href)}
                />
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="relative rounded-md px-3.5 py-2 text-[0.94rem] font-medium text-navy-900 transition-colors hover:bg-white aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3.5 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-px aria-[current=page]:after:bg-gold-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href={`tel:${phoneE164}`}
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-[0.94rem] font-medium text-navy-900 hover:bg-white xl:inline-flex"
          data-track="header"
        >
          <Phone className="size-4 text-teal-700" aria-hidden />
          {phone}
        </a>
        <Link
          href="/book"
          data-track="header"
          className="hidden min-h-11 items-center whitespace-nowrap rounded-md bg-orange-600 px-5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-orange-700 sm:inline-flex"
        >
          {bookLabel}
        </Link>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex size-11 items-center justify-center rounded-md text-navy-900 hover:bg-white lg:hidden"
          aria-label="Open menu"
          aria-expanded={drawer}
          aria-controls="mobile-menu"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </div>

      {drawer && (
        <MobileDrawer
          items={items}
          bookLabel={bookLabel}
          phone={phone}
          phoneE164={phoneE164}
          onClose={() => setDrawer(false)}
          isActive={isActive}
        />
      )}
    </>
  )
}

function DesktopDropdown({
  item,
  open,
  setOpen,
  active,
}: {
  item: NavItem
  open: boolean
  setOpen: (v: string | null) => void
  active: boolean
}) {
  const id = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enter = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(item.label)
  }
  const leave = () => {
    timer.current = setTimeout(() => setOpen(null), 160)
  }
  const wide = (item.children?.length ?? 0) > 3
  return (
    <div onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(open ? null : item.label)}
        className={`relative flex items-center gap-1 rounded-md px-3.5 py-2 text-[0.94rem] font-medium text-navy-900 transition-colors hover:bg-white ${active ? 'after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:bg-gold-400' : ''}`}
      >
        {item.label}
        <Chevron className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <div
        id={id}
        hidden={!open}
        className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${wide ? 'w-[40rem]' : 'w-[22rem]'}`}
      >
        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_24px_60px_-20px_rgba(11,31,74,0.25)]">
          <ul className={`grid gap-px bg-line/60 ${wide ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {item.children?.map((c) => (
              <li key={c.href + c.label} className="bg-white">
                <Link href={c.href} className="group block h-full px-5 py-4 transition-colors hover:bg-paper">
                  <span className="flex items-center justify-between gap-3 font-semibold text-navy-900">
                    {c.label}
                    <ArrowRight
                      className="size-4 -translate-x-1 text-gold-700 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                  {c.description && <span className="mt-1 block text-sm leading-snug text-muted">{c.description}</span>}
                </Link>
              </li>
            ))}
          </ul>
          {item.href && item.href !== item.children?.[0]?.href && (
            <Link
              href={item.href}
              className="flex items-center justify-between border-t border-line bg-paper px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-paper-deep"
            >
              {item.label === 'How We Help' ? 'Not sure? Compare all four pathways' : `All of ${item.label}`}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileDrawer({
  items,
  bookLabel,
  phone,
  phoneE164,
  onClose,
  isActive,
}: Props & {onClose: () => void; isActive: (h: string) => boolean}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const trap = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = panelRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', trap)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', trap)
      prev?.focus()
    }
  }, [trap])

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu" id="mobile-menu">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="on-navy absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-navy-900 text-white shadow-2xl motion-safe:animate-[drawer_0.35s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-5">
          <span className="eyebrow text-gold-400">Menu</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-md hover:bg-white/10"
            aria-label="Close menu"
          >
            <Close className="size-6" aria-hidden />
          </button>
        </div>
        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item) => (
              <li key={item.label}>
                {item.children?.length ? (
                  <details className="accordion group" open={isActive(item.href)}>
                    <summary className="flex cursor-pointer items-center justify-between py-4 font-semibold text-xl">
                      {item.label}
                      <Chevron
                        className="size-5 text-gold-400 transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <ul className="pb-4">
                      {item.children.map((c) => (
                        <li key={c.href + c.label}>
                          <Link
                            href={c.href}
                            aria-current={isActive(c.href) ? 'page' : undefined}
                            className="flex min-h-11 items-center gap-3 py-2 pl-1 text-[1.05rem] text-white/85 hover:text-white aria-[current=page]:text-gold-400"
                          >
                            <span className="h-px w-4 bg-gold-400/60" aria-hidden />
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="block py-4 font-semibold text-xl aria-[current=page]:text-gold-400"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid shrink-0 gap-3 border-t border-white/10 bg-navy-900 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Link
            href="/book"
            data-track="mobile-menu"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-orange-600 font-semibold text-white"
          >
            {bookLabel}
          </Link>
          <a
            href={`tel:${phoneE164}`}
            data-track="mobile-menu"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 font-semibold"
          >
            <Phone className="size-4" aria-hidden /> Call {phone}
          </a>
        </div>
      </div>
    </div>
  )
}
