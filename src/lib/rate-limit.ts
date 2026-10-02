import 'server-only'

import {createHash} from 'node:crypto'

import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'

/**
 * Rate limiting.
 * - Production: Upstash Redis (shared across all serverless instances).
 *   Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Vercel Marketplace → Upstash).
 * - Fallback: in-memory per instance, fine for local development, weak in
 *   production. A warning is logged once if production runs without Redis.
 */
type Limiter = {limit: (key: string) => Promise<{success: boolean; reset: number}>}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN})
    : null

let warned = false
function memoryLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>()
  return {
    async limit(key) {
      if (!warned && process.env.NODE_ENV === 'production') {
        warned = true
        console.warn('[rate-limit] Upstash Redis not configured, using per-instance memory limits.')
      }
      const now = Date.now()
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
      recent.push(now)
      hits.set(key, recent)
      if (hits.size > 5000) hits.delete(hits.keys().next().value as string)
      return {success: recent.length <= max, reset: (recent[0] ?? now) + windowMs}
    },
  }
}

function make(prefix: string, max: number, window: `${number} m` | `${number} h`, windowMs: number): Limiter {
  if (!redis) return memoryLimiter(max, windowMs)
  return new Ratelimit({redis, prefix: `iwc:${prefix}`, limiter: Ratelimit.slidingWindow(max, window), analytics: false})
}

export const limiters = {
  chatBurst: make('chat-burst', 10, '5 m', 5 * 60_000),
  chatDaily: make('chat-day', 60, '24 h', 24 * 3_600_000),
  forms: make('forms', 5, '10 m', 10 * 60_000),
}

/** Hash the client IP so raw IP addresses are never stored in Redis. */
export function clientKey(headers: Headers) {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
  const salt = process.env.RATE_LIMIT_SALT || process.env.SANITY_REVALIDATE_SECRET || 'iwc'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** Reject cross-site POSTs (browsers always send Origin on POST). */
export function isSameOrigin(headers: Headers) {
  const origin = headers.get('origin')
  const host = headers.get('x-forwarded-host') || headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
