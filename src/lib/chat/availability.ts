import 'server-only'
import {hasDurableRateLimit} from '@/lib/rate-limit'

/** Production requires explicit approval and shared limits. Local API mocks are opt-in. */
export function assistantConfigured(enabled: boolean) {
  if (!enabled || !process.env.OPENAI_API_KEY) return false
  const localTest = process.env.IWC_LOCAL_INTEGRATION_TEST === 'true' && !process.env.VERCEL
  if (process.env.NODE_ENV === 'production' && !localTest) {
    return process.env.IWC_ASSISTANT_APPROVED === 'true' && hasDurableRateLimit
  }
  return true
}
