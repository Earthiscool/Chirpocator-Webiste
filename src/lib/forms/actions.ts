'use server'

import {headers} from 'next/headers'

import {redactSensitive} from '@/lib/chat/safety'
import {clientKey, limiters} from '@/lib/rate-limit'
import {getSettings} from '@/lib/site'

import {addNewsletterContact, sendEmail} from './delivery'
import {ContactSchema, fieldErrors, type FormState, NewsletterSchema, ProviderSchema} from './schema'
import {checkFormToken, hasFormSigningSecret, verifyTurnstile} from './security'

/**
 * Server actions for the contact, provider, and newsletter forms.
 * Next.js already rejects cross-origin action calls; on top of that we use a
 * honeypot, a signed timestamp, optional Turnstile, and rate limiting.
 * Form contents are never logged.
 */
async function guard(form: FormData): Promise<FormState | null> {
  const h = await headers()
  // Honeypot: real people never see or fill this field. Pretend success to bots.
  if (String(form.get('website') ?? '').length > 0) return {status: 'success', message: 'Thank you.'}
  if (!hasFormSigningSecret()) return {status: 'error', message: await unavailable()}
  if (!checkFormToken(String(form.get('_t') ?? ''))) {
    return {status: 'error', message: 'Please wait a moment and submit again — the form may have expired.'}
  }
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  if (!(await verifyTurnstile(String(form.get('cf-turnstile-response') ?? ''), ip))) {
    return {status: 'error', message: 'We could not verify the submission. Please try again.'}
  }
  const {success} = await limiters.forms.limit(clientKey(h))
  if (!success) return {status: 'error', message: 'Too many submissions. Please try again later or call the office.'}
  return null
}

const unavailable = async () => {
  const s = await getSettings()
  return `Our online form isn't connected yet. Please call ${s.phone} or email ${s.email} — we'd be glad to help.`
}
const failed = async () => {
  const s = await getSettings()
  return `Your message didn't go through. Please try again, or call ${s.phone}.`
}

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  const blocked = await guard(form)
  if (blocked) return blocked

  const parsed = ContactSchema.safeParse(Object.fromEntries(form))
  const values = {
    name: String(form.get('name') ?? ''),
    email: String(form.get('email') ?? ''),
    phone: String(form.get('phone') ?? ''),
    topic: String(form.get('topic') ?? ''),
    message: String(form.get('message') ?? '').slice(0, 1000),
  }
  if (!parsed.success)
    return {status: 'error', message: 'Please check the highlighted fields.', errors: fieldErrors(parsed.error), values}

  const d = parsed.data
  const message = redactSensitive(d.message)
  const result = await sendEmail({
    to: process.env.CONTACT_TO_EMAIL ?? '',
    replyTo: d.email,
    subject: `Website inquiry: ${d.topic}`,
    text: [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || '—'}`,
      `Prefers: ${d.preferred}`,
      `Topic: ${d.topic}`,
      '',
      message.text,
      '',
      message.redacted ? '(Some numbers or dates were removed automatically to protect privacy.)' : '',
      '— Sent from the website contact form. Do not reply with health information by email.',
    ].join('\n'),
  })
  if (!result.ok)
    return {status: 'error', message: result.reason === 'unconfigured' ? await unavailable() : await failed(), values}
  return {
    status: 'success',
    message: `Thank you, ${d.name.split(' ')[0]}. Your message has been sent — we'll be in touch by ${d.preferred}.`,
  }
}

export async function submitProvider(_prev: FormState, form: FormData): Promise<FormState> {
  const blocked = await guard(form)
  if (blocked) return blocked

  const parsed = ProviderSchema.safeParse(Object.fromEntries(form))
  const values = {
    name: String(form.get('name') ?? ''),
    role: String(form.get('role') ?? ''),
    organization: String(form.get('organization') ?? ''),
    email: String(form.get('email') ?? ''),
    phone: String(form.get('phone') ?? ''),
    note: String(form.get('note') ?? '').slice(0, 600),
  }
  if (!parsed.success)
    return {status: 'error', message: 'Please check the highlighted fields.', errors: fieldErrors(parsed.error), values}

  const d = parsed.data
  const note = redactSensitive(d.note)
  const result = await sendEmail({
    to: process.env.PROVIDER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || '',
    replyTo: d.email,
    subject: `Provider contact: ${d.reason} — ${d.name}`,
    text: [
      `Name: ${d.name}`,
      `Role / credentials: ${d.role}`,
      `Organization: ${d.organization || '—'}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || '—'}`,
      `Prefers: ${d.preferred}`,
      `Reason: ${d.reason}`,
      '',
      note.text || '(no note)',
      '',
      'The sender confirmed this message contains no patient health information.',
      'Arrange a secure method before exchanging any patient details.',
    ].join('\n'),
  })
  if (!result.ok)
    return {status: 'error', message: result.reason === 'unconfigured' ? await unavailable() : await failed(), values}
  return {
    status: 'success',
    message:
      "Thank you. We've received your note and will contact you to arrange next steps, including a secure way to share patient information.",
  }
}

export async function subscribeNewsletter(_prev: FormState, form: FormData): Promise<FormState> {
  const blocked = await guard(form)
  if (blocked) return blocked
  const parsed = NewsletterSchema.safeParse({email: form.get('email')})
  if (!parsed.success)
    return {status: 'error', message: 'Please enter a valid email address.', errors: fieldErrors(parsed.error)}
  const result = await addNewsletterContact(parsed.data.email)
  if (!result.ok)
    return {
      status: 'error',
      message:
        result.reason === 'unconfigured'
          ? 'Sign-up opens soon. In the meantime, follow along on Substack.'
          : await failed(),
    }
  return {status: 'success', message: "You're on the list. Thank you."}
}
