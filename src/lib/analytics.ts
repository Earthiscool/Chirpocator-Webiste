/**
 * Privacy-safe analytics events (GA4 via gtag).
 *
 * Event names follow the blueprint's measurement plan. Parameters describe
 * *where* and *what kind* of action happened, never form contents, chat
 * messages, or anything a visitor typed.
 */
export type AnalyticsEvent =
  | {name: 'start_here_select'; params: {pathway: string}}
  | {name: 'start_here_next_step'; params: {pathway: string; destination: string}}
  | {name: 'book_click'; params: {location: string; destination: string}}
  | {name: 'phone_click'; params: {location: string}}
  | {name: 'email_click'; params: {location: string}}
  | {name: 'contact_submit'; params: {form: 'general' | 'provider' | 'newsletter'; status: 'success' | 'error'}}
  | {name: 'resource_view'; params: {slug: string; topic: string}}
  | {name: 'resource_next_step'; params: {slug: string; destination: string}}
  | {name: 'chat_open'; params: {location: string}}
  | {name: 'chat_message'; params: {turn: number; suggested: boolean}}
  | {name: 'chat_link_click'; params: {destination: string}}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function track<E extends AnalyticsEvent>(event: E['name'], params: E['params']) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', event, params)
  if (process.env.NODE_ENV === 'development') console.debug('[analytics]', event, params)
}
