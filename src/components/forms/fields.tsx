'use client'

import Script from 'next/script'
import {useEffect, useId, useState, type ReactNode} from 'react'
import {useFormStatus} from 'react-dom'

/** Shared accessible field wrappers for the site's forms. */
const inputCls =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-[1rem] text-navy-900 placeholder:text-muted/70 transition-colors focus:border-navy-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 aria-[invalid=true]:border-orange-700'

export function Field({
  label,
  name,
  type = 'text',
  required,
  error,
  hint,
  defaultValue,
  autoComplete,
  maxLength,
  inputMode,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  hint?: string
  defaultValue?: string
  autoComplete?: string
  maxLength?: number
  inputMode?: 'tel' | 'email' | 'text'
}) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy-900">
        {label} {!required && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${inputCls} ${error ? 'border-orange-700' : 'border-line'}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-orange-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextArea({
  label,
  name,
  error,
  hint,
  required,
  maxLength = 1000,
  rows = 5,
  defaultValue,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  maxLength?: number
  rows?: number
  defaultValue?: string
}) {
  const id = useId()
  const [count, setCount] = useState(0)
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy-900">
        {label} {!required && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        name={name}
        required={required}
        maxLength={maxLength}
        rows={rows}
        defaultValue={defaultValue}
        onChange={(e) => setCount(e.target.value.length)}
        aria-invalid={Boolean(error)}
        aria-describedby={[hint && `${id}-hint`, error && `${id}-error`, `${id}-count`].filter(Boolean).join(' ')}
        className={`${inputCls} resize-y ${error ? 'border-orange-700' : 'border-line'}`}
      />
      <div className="mt-1.5 flex justify-between gap-4 text-sm">
        <span id={`${id}-error`} className="font-medium text-orange-700">
          {error}
        </span>
        <span id={`${id}-count`} className="shrink-0 text-muted" aria-live="polite">
          {count > maxLength * 0.8 ? `${maxLength - count} characters left` : ''}
        </span>
      </div>
    </div>
  )
}

export function Select({
  label,
  name,
  options,
  error,
  defaultValue,
  required = true,
}: {
  label: string
  name: string
  options: readonly string[]
  error?: string
  defaultValue?: string
  required?: boolean
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy-900">
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ''}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230b1f4a' stroke-width='1.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10 ${error ? 'border-orange-700' : 'border-line'}`}
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-orange-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function Radios({
  legend,
  name,
  options,
  defaultValue,
}: {
  legend: string
  name: string
  options: {value: string; label: string}[]
  defaultValue: string
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-navy-900">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-white px-4 has-[:checked]:border-navy-900 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-orange-600"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={o.value === defaultValue}
              className="size-4 accent-navy-900"
            />
            <span className="text-[0.95rem] text-navy-900">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Consent({name = 'consent', error, children}: {name?: string; error?: string; children: ReactNode}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy-900">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          className="mt-1 size-4 shrink-0 accent-navy-900"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-orange-700">
          {error}
        </p>
      )}
    </div>
  )
}

/** Hidden anti-spam fields: honeypot, fresh signed timestamp, optional Turnstile. */
export function AntiSpam() {
  const [token, setToken] = useState('')
  useEffect(() => {
    fetch('/api/form-token', {cache: 'no-store'})
      .then((r) => r.json())
      .then((d: {token?: string}) => setToken(d.token ?? ''))
      .catch(() => {})
  }, [])
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="_t" value={token} />
      {siteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" data-size="flexible" />
        </>
      )}
    </>
  )
}

export function SubmitButton({children}: {children: ReactNode; variant?: 'book' | 'primary'}) {
  const {pending} = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold text-white transition-colors disabled:opacity-60 bg-orange-600 hover:bg-orange-700`}
    >
      {pending ? 'Sending…' : children}
    </button>
  )
}
