import {hasFormSigningSecret, issueFormToken} from '@/lib/forms/security'

/** Fresh signed timestamp for anti-spam checks (pages themselves are cached). */
export async function GET() {
  return Response.json(hasFormSigningSecret() ? {token: issueFormToken()} : {available: false}, {
    headers: {'Cache-Control': 'no-store'},
  })
}
