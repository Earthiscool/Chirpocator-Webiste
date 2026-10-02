import 'server-only'

/**
 * Email delivery via Resend's REST API (https://resend.com).
 * Required: RESEND_API_KEY, CONTACT_FROM_EMAIL (a verified sender on your
 * domain) and CONTACT_TO_EMAIL. Optional: PROVIDER_TO_EMAIL for referrals,
 * RESEND_AUDIENCE_ID for newsletter sign-ups.
 *
 * Returns {ok:false, reason:'unconfigured'} instead of pretending to send.
 */
type Result = {ok: true} | {ok: false; reason: 'unconfigured' | 'failed'}

const base = () => (process.env.RESEND_API_BASE || 'https://api.resend.com').replace(/\/$/, '')

export function deliveryConfigured(kind: 'contact' | 'provider' | 'newsletter' = 'contact') {
  const k = process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL
  if (kind === 'provider') return Boolean(k && (process.env.PROVIDER_TO_EMAIL || process.env.CONTACT_TO_EMAIL))
  if (kind === 'newsletter') return Boolean(process.env.RESEND_API_KEY && (process.env.RESEND_AUDIENCE_ID || (k && process.env.CONTACT_TO_EMAIL)))
  return Boolean(k && process.env.CONTACT_TO_EMAIL)
}

export async function sendEmail({to, subject, text, replyTo}: {to: string; subject: string; text: string; replyTo?: string}): Promise<Result> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  if (!key || !from || !to) return {ok: false, reason: 'unconfigured'}
  try {
    const res = await fetch(`${base()}/emails`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from, to: to.split(',').map((s) => s.trim()), subject, text, ...(replyTo ? {reply_to: replyTo} : {})}),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      console.error('[forms] email provider rejected request', res.status)
      return {ok: false, reason: 'failed'}
    }
    return {ok: true}
  } catch (e) {
    console.error('[forms] email delivery failed', (e as Error).name)
    return {ok: false, reason: 'failed'}
  }
}

export async function addNewsletterContact(email: string): Promise<Result> {
  const key = process.env.RESEND_API_KEY
  const audience = process.env.RESEND_AUDIENCE_ID
  if (!key) return {ok: false, reason: 'unconfigured'}
  if (!audience) {
    // Fall back to notifying the practice so they can add the address manually.
    return sendEmail({to: process.env.CONTACT_TO_EMAIL ?? '', subject: 'Website: newsletter sign-up', text: `New newsletter sign-up: ${email}`})
  }
  try {
    const res = await fetch(`${base()}/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({email, unsubscribed: false}),
      signal: AbortSignal.timeout(10_000),
    })
    return res.ok ? {ok: true} : {ok: false, reason: 'failed'}
  } catch {
    return {ok: false, reason: 'failed'}
  }
}
