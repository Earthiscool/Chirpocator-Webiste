'use client'

import {useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent} from 'react'

import {track} from '@/lib/analytics'

import {Close, Phone, Send} from '../icons'
import type {ChatConfig} from './ChatLauncher'
import {Markdown} from './Markdown'

type Msg = {role: 'user' | 'assistant'; content: string}
type Status = 'idle' | 'checking' | 'streaming' | 'unavailable' | 'error'

const MAX_CHARS = 800
const DEFAULT_WELCOME =
  'Welcome to IWC. I can help you explore our approach, find information about services, or choose a starting point. What would you like to know?'
const DEFAULT_NOTICE =
  "I share general information and can't give medical advice. Please don't enter personal health details."

export function ChatPanel({
  open,
  onClose,
  welcome,
  suggestions,
  notice,
  phone,
  phoneE164,
}: ChatConfig & {open: boolean; onClose: () => void}) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<Status>('checking')
  const [errorText, setErrorText] = useState('')
  const [announce, setAnnounce] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const titleId = useId()
  const noticeId = useId()

  // Check availability once (no message is sent).
  useEffect(() => {
    fetch('/api/chat', {method: 'GET'})
      .then((r) => r.json())
      .then((d: {available?: boolean}) => setStatus(d.available ? 'idle' : 'unavailable'))
      .catch(() => setStatus('unavailable'))
  }, [])

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: 'smooth'})
  }, [messages])

  // Escape closes; stop any in-flight reply when the panel unmounts.
  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  useEffect(() => () => abortRef.current?.abort(), [])

  const send = useCallback(
    async (text: string, suggested = false) => {
      const content = text.trim().slice(0, MAX_CHARS)
      if (!content || status === 'streaming' || status === 'unavailable') return
      const history: Msg[] = [...messages, {role: 'user', content}]
      setMessages([...history, {role: 'assistant', content: ''}])
      setDraft('')
      setStatus('streaming')
      setErrorText('')
      setAnnounce('IWC assistant is replying…')
      track('chat_message', {turn: history.filter((m) => m.role === 'user').length, suggested})

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({messages: history.slice(-12)}),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as {error?: string; message?: string}
          setMessages(history)
          setStatus(data.error === 'unavailable' ? 'unavailable' : 'error')
          setErrorText(data.message || `Something went wrong. Please call ${phone}.`)
          setAnnounce(data.message || 'The assistant could not reply.')
          return
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let reply = ''
        for (;;) {
          const {done, value} = await reader.read()
          if (done) break
          reply += decoder.decode(value, {stream: true})
          setMessages([...history, {role: 'assistant', content: reply}])
        }
        setStatus('idle')
        setAnnounce(reply.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, ''))
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        setMessages(history)
        setStatus('error')
        setErrorText(`The connection dropped. Please try again, or call ${phone}.`)
      } finally {
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    },
    [messages, status, phone],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(draft)
    }
  }

  const showSuggestions = messages.length === 0 && status !== 'unavailable' && !!suggestions?.length
  const remaining = MAX_CHARS - draft.length

  return (
    <div
      id="iwc-assistant"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={noticeId}
      hidden={!open}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[min(88dvh,44rem)] flex-col overflow-hidden rounded-t-[1.5rem] border border-line bg-paper shadow-[0_30px_80px_-20px_rgba(11,31,74,0.45)] motion-safe:animate-[chat-in_0.35s_cubic-bezier(0.22,1,0.36,1)] md:inset-x-auto md:bottom-6 md:right-6 md:h-[min(80dvh,40rem)] md:w-[25rem] md:rounded-[1.5rem]"
    >
      {/* Header */}
      <div className="on-navy flex items-start justify-between gap-4 bg-navy-900 px-5 pb-4 pt-5 text-white">
        <div>
          <p className="eyebrow text-gold-400">IWC website assistant</p>
          <h2 id={titleId} className="mt-1 font-display text-xl">
            How can we help?
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Close assistant"
        >
          <Close className="size-5" aria-hidden />
        </button>
      </div>
      <p
        id={noticeId}
        className="border-b border-line bg-gold-100 px-5 py-2.5 text-[0.8rem] leading-snug text-navy-900"
      >
        {notice || DEFAULT_NOTICE} In an emergency, call 911.
      </p>

      {/* Conversation */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-label="Conversation">
        <Bubble role="assistant">
          <p>{welcome || DEFAULT_WELCOME}</p>
        </Bubble>

        {status === 'unavailable' && messages.length === 0 && (
          <div className="rounded-2xl border border-line bg-white p-4 text-[0.93rem] text-navy-900">
            <p>The assistant isn&apos;t available right now. Our team is happy to help directly:</p>
            <a
              href={`tel:${phoneE164}`}
              data-track="chat"
              className="mt-3 inline-flex items-center gap-2 font-semibold text-teal-700 underline underline-offset-4"
            >
              <Phone className="size-4" aria-hidden /> Call {phone}
            </a>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'assistant' && !m.content ? (
            <Typing key={i} />
          ) : (
            <Bubble key={i} role={m.role}>
              {m.role === 'assistant' ? (
                <Markdown text={m.content} onLink={(href) => track('chat_link_click', {destination: href})} />
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </Bubble>
          ),
        )}

        {status === 'error' && errorText && (
          <p role="alert" className="rounded-xl bg-white px-4 py-3 text-sm text-orange-700">
            {errorText}
          </p>
        )}

        {showSuggestions && (
          <div className="pt-1">
            <p className="eyebrow mb-3 text-muted">Try asking</p>
            <ul className="flex flex-wrap gap-2">
              {suggestions!.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s, true)}
                    disabled={status !== 'idle'}
                    className="rounded-full border border-navy-900/15 bg-white px-3.5 py-2 text-left text-[0.88rem] text-navy-900 transition-colors hover:border-navy-900/40 disabled:opacity-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="border-t border-line bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3"
      >
        <label htmlFor="iwc-chat-input" className="sr-only">
          Your question
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="iwc-chat-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={MAX_CHARS}
            disabled={status === 'unavailable'}
            placeholder={status === 'unavailable' ? 'Assistant unavailable' : 'Ask about services, visits, or booking'}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-2.5 text-[0.95rem] text-navy-900 placeholder:text-muted/80 focus:border-navy-900/40 disabled:opacity-60"
            aria-describedby={`${noticeId} iwc-chat-count`}
          />
          <button
            type="submit"
            disabled={!draft.trim() || status === 'streaming' || status === 'unavailable'}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white transition-opacity disabled:opacity-35"
            aria-label="Send question"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </div>
        <p
          id="iwc-chat-count"
          className={`mt-1.5 text-right text-[0.72rem] ${remaining < 80 ? 'text-orange-700' : 'text-muted'}`}
        >
          {remaining < 200 ? `${remaining} characters left` : 'Please avoid sensitive information.'}
        </p>
      </form>
    </div>
  )
}

function Bubble({role, children}: {role: 'user' | 'assistant'; children: React.ReactNode}) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed ${
          mine ? 'rounded-br-md bg-navy-900 text-white' : 'rounded-bl-md border border-line bg-white text-navy-900'
        }`}
      >
        <span className="sr-only">{mine ? 'You said: ' : 'IWC assistant: '}</span>
        {children}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex justify-start" aria-hidden>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-navy-900/50 motion-safe:animate-[typing_1.2s_ease-in-out_infinite]"
            style={{animationDelay: `${i * 160}ms`}}
          />
        ))}
      </div>
    </div>
  )
}
