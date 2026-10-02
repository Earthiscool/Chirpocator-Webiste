import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

/**
 * Sanity publish webhook → refresh cached pages immediately.
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL: https://<site>/api/revalidate   Trigger: create, update, delete
 *   Projection: {_type}   Secret: SANITY_REVALIDATE_SECRET
 * Without the webhook, published changes still appear within ~5 minutes.
 */
export async function POST(req: NextRequest) {
  if (!req.headers.get('sanity-webhook-signature'))
    return NextResponse.json({message: 'Invalid signature'}, {status: 401})
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({message: 'Revalidation is not configured'}, {status: 503})
  try {
    const {isValidSignature, body} = await parseBody<{_type?: string}>(req, secret, true)
    if (!isValidSignature) return NextResponse.json({message: 'Invalid signature'}, {status: 401})
    if (!body?._type) return NextResponse.json({message: 'Missing _type'}, {status: 400})
    // expire: 0 → the next visitor gets fresh content (editors expect to see
    // their change straight after publishing), not one stale view first.
    revalidateTag(body._type, {expire: 0})
    return NextResponse.json({revalidated: true, tag: body._type, now: Date.now()})
  } catch (e) {
    console.error('[revalidate]', (e as Error).message)
    return NextResponse.json({message: 'Error revalidating'}, {status: 500})
  }
}
