'use client'

import {useActionState, useEffect, useId} from 'react'

import {track} from '@/lib/analytics'
import {subscribeNewsletter} from '@/lib/forms/actions'
import type {FormState} from '@/lib/forms/schema'

import {AntiSpam, SubmitButton} from './fields'

const initial: FormState = {status: 'idle'}

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeNewsletter, initial)
  const id = useId()
  useEffect(() => {
    if (state.status !== 'idle') track('contact_submit', {form: 'newsletter', status: state.status})
  }, [state])

  if (state.status === 'success') {
    return (
      <p role="status" className="font-semibold text-white">
        {state.message}
      </p>
    )
  }
  return (
    <form action={action} noValidate className="relative">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state.status === 'error'}
          aria-describedby={state.status === 'error' ? `${id}-msg` : undefined}
          className="min-h-12 flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-white placeholder:text-white/50 focus:border-white focus:outline-none"
        />
        <SubmitButton variant="book">Subscribe</SubmitButton>
      </div>
      <AntiSpam />
      {state.status === 'error' && (
        <p id={`${id}-msg`} role="alert" className="mt-3 text-sm text-gold-100">
          {state.message}
        </p>
      )}
    </form>
  )
}
