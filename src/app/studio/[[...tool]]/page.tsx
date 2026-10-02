/**
 * Sanity Studio, the CMS for IWC staff, at /studio.
 * Access requires a Sanity account invited to the project (sanity.io/manage).
 */
import {NextStudio} from 'next-sanity/studio'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
