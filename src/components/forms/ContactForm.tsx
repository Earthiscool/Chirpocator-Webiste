'use client'

import Link from 'next/link'
import {useActionState, useEffect, useRef} from 'react'

import {track} from '@/lib/analytics'
import {submitContact} from '@/lib/forms/actions'
import {contactTopics, type FormState} from '@/lib/forms/schema'

import {AntiSpam, Consent, Field, Radios, Select, SubmitButton, TextArea} from './fields'

const initial: FormState = {status: 'idle'}

/** General inquiry form — deliberately NOT a clinical intake form. */
export function ContactForm({intro}: {intro?: string}) {
  const [state, action] = useActionState(submitContact, initial)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === 'idle') return
    track('contact_submit', {form: 'general', status: state.status})
    statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-teal-500/40 bg-teal-100 p-7 outline-none">
        <p className="display-sm text-navy-900">Message sent</p>
        <p className="mt-2 text-navy-900">{state.message}</p>
      </div>
    )
  }

  const v = state.values ?? {}
  const e = state.errors ?? {}
  return (
    <form action={action} noValidate className="relative space-y-6" aria-describedby="contact-privacy">
      {intro && <p className="text-muted">{intro}</p>}
      {state.status === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-orange-700/30 bg-white px-4 py-3 text-[0.95rem] font-medium text-orange-700 outline-none">
          {state.message}
        </div>
      )}
      <div key={JSON.stringify(v)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" defaultValue={v.name} error={e.name} maxLength={100} />
          <Field label="Email" name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={v.email} error={e.email} maxLength={200} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={v.phone} error={e.phone} maxLength={30} />
          <Select label="What is this about?" name="topic" options={contactTopics} defaultValue={v.topic} error={e.topic} />
        </div>
        <Radios
          legend="How should we reply?"
          name="preferred"
          defaultValue="email"
          options={[
            {value: 'email', label: 'Email'},
            {value: 'phone', label: 'Phone'},
          ]}
        />
        <TextArea
          label="Message"
          name="message"
          required
          maxLength={1000}
          error={e.message}
          defaultValue={v.message}
          hint="A sentence or two is plenty. Please don't include medical details, insurance numbers, or your date of birth."
        />
      </div>
      <Consent error={e.consent}>
        I understand this form is for general questions only — not for medical emergencies or personal health information — and I agree to be contacted about my
        inquiry. See our{' '}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </Consent>
      <AntiSpam />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton variant="primary">Send message</SubmitButton>
        <p id="contact-privacy" className="text-sm text-muted">
          In an emergency, call 911.
        </p>
      </div>
    </form>
  )
}
