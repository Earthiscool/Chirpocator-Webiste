import 'server-only'

import {createHmac, timingSafeEqual} from 'node:crypto'

const secret = () => process.env.FORM_SECRET || process.env.SANITY_REVALIDATE_SECRET || ''

/** Signed render timestamp: rejects bots that submit instantly or replay old forms. */
export function issueFormToken(now = Date.now()) {
  const sig = createHmac('sha256', secret()).update(String(now)).digest('base64url').slice(0, 24)
  return `${now}.${sig}`
}

export function checkFormToken(token: string | null | undefined, now = Date.now()) {
  if (!token || !secret()) return false
  const [ts, sig] = token.split('.')
  const expected = createHmac('sha256', secret()).update(ts).digest('base64url').slice(0, 24)
  if (!sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  const age = now - Number(ts)
  return age >= 2500 && age <= 24 * 3_600_000 // at least 2.5s on the page, at most a day
}

/** Optional Cloudflare Turnstile verification (only when configured). */
export async function verifyTurnstile(token: string | null | undefined, ip?: string | null) {
  const key = process.env.TURNSTILE_SECRET_KEY
  if (!key) return true
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({secret: key, response: token, ...(ip ? {remoteip: ip} : {})}),
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as {success?: boolean}
    return Boolean(data.success)
  } catch {
    return false
  }
}
