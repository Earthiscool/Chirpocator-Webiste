'use client'

import dynamic from 'next/dynamic'
import {useCallback, useEffect, useRef, useState} from 'react'

import {track} from '@/lib/analytics'

import {Chat} from '../icons'

// The panel (and its logic) only downloads when someone opens the assistant.
const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => m.ChatPanel), {ssr: false})

export interface ChatConfig {
  welcome?: string
  suggestions?: string[]
  notice?: string
  phone: string
  phoneE164: string
}

export function ChatLauncher(config: ChatConfig) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const openChat = useCallback((location: string) => {
    setLoaded(true)
    setOpen(true)
    track('chat_open', {location})
  }, [])

  useEffect(() => {
    const handler = (e: Event) => openChat((e as CustomEvent<{location?: string}>).detail?.location ?? 'event')
    window.addEventListener('iwc:open-chat', handler)
    return () => window.removeEventListener('iwc:open-chat', handler)
  }, [openChat])

  const close = useCallback(() => {
    setOpen(false)
    // Return focus to the launcher (desktop) for keyboard users.
    requestAnimationFrame(() => buttonRef.current?.focus())
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openChat('launcher'))}
        aria-expanded={open}
        aria-controls="iwc-assistant"
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-navy-900 py-3 pl-4 pr-5 text-[0.95rem] font-semibold text-white shadow-sm transition-[transform,opacity] duration-200 md:inline-flex ${open ? 'pointer-events-none translate-y-2 opacity-0' : ''}`}
      >
        <span className="relative flex size-8 items-center justify-center rounded-full bg-white/10">
          <Chat className="size-[1.1rem] text-gold-400" aria-hidden />
        </span>
        Questions? Ask IWC
      </button>
      {loaded && <ChatPanel open={open} onClose={close} {...config} />}
    </>
  )
}
