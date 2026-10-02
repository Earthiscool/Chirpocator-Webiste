'use client'

import {useActionState, useEffect, useRef} from 'react'

import {track} from '@/lib/analytics'
import {submitProvider} from '@/lib/forms/actions'
import {type FormState, providerReasons} from '@/lib/forms/schema'

import {AntiSpam, Consent, Field, Radios, Select, SubmitButton, TextArea} from './fields'

const initial: FormState = {status: 'idle'}

/**
 * Professional contact route. It collects the CLINICIAN's details only —
 * never patient information. Patient details are exchanged afterwards through
 * a secure, practice-approved method.
 */
export function ProviderForm({notice}: {notice?: string}) {
  const [state, action] = useActionState(submitProvider, initial)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === 'idle') return
    track('contact_submit', {form: 'provider', status: state.status})
    statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-teal-500/40 bg-teal-100 p-7 outline-none">
        <p className="display-sm text-navy-900">Thank you</p>
        <p className="mt-2 text-navy-900">{state.message}</p>
      </div>
    )
  }

  const v = state.values ?? {}
  const e = state.errors ?? {}
  return (
    <form action={action} noValidate className="relative space-y-6">
      {notice && (
        <p className="rounded-xl border-l-2 border-gold-400 bg-gold-100 px-4 py-3 text-[0.95rem] text-navy-900">
          <strong className="font-semibold">No patient information here.</strong> {notice}
        </p>
      )}
      {state.status === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-orange-700/30 bg-white px-4 py-3 text-[0.95rem] font-medium text-orange-700 outline-none">
          {state.message}
        </div>
      )}
      <div key={JSON.stringify(v)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" name="name" required autoComplete="name" defaultValue={v.name} error={e.name} />
          <Field label="Role / credentials" name="role" required defaultValue={v.role} error={e.role} hint="e.g. Orthopedic surgeon, PT, athletic trainer" />
        </div>
        <Field label="Practice or organization" name="organization" autoComplete="organization" defaultValue={v.organization} error={e.organization} />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Professional email" name="email" type="email" required autoComplete="email" defaultValue={v.email} error={e.email} />
          <Field label="Direct phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} error={e.phone} />
        </div>
        <Select label="Reason" name="reason" options={providerReasons} error={e.reason} />
        <Radios
          legend="Best way to reach you"
          name="preferred"
          defaultValue="phone"
          options={[
            {value: 'phone', label: 'Phone'},
            {value: 'email', label: 'Email'},
          ]}
        />
        <TextArea label="Note" name="note" maxLength={600} rows={4} error={e.note} defaultValue={v.note} hint="Best times to reach you, or the general nature of the collaboration. No patient names or clinical details." />
      </div>
      <Consent error={e.consent}>I confirm this message contains no patient names, dates of birth, or other patient health information.</Consent>
      <AntiSpam />
      <SubmitButton variant="primary">Request a call</SubmitButton>
    </form>
  )
}
