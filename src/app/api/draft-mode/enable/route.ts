import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/sanity/client'

/** Studio-issued secrets remain mandatory. Missing setup never enables previews. */
export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) return new Response('Preview unavailable', {status: 401, headers: {'Cache-Control': 'no-store'}})
  try {
    const {GET: enable} = defineEnableDraftMode({client: client.withConfig({token})})
    return await enable(request)
  } catch {
    return new Response('Preview unavailable', {status: 503, headers: {'Cache-Control': 'no-store'}})
  }
}
