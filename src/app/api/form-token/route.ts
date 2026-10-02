import {issueFormToken} from '@/lib/forms/security'

/** Fresh signed timestamp for anti-spam checks (pages themselves are cached). */
export async function GET() {
  return Response.json({token: issueFormToken()}, {headers: {'Cache-Control': 'no-store'}})
}
