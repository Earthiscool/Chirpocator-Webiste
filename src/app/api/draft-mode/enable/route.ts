import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/client'

/**
 * Called by the Studio's Preview tool. It validates a short-lived secret
 * created by the Studio before enabling draft mode, so visitors can't
 * switch it on themselves.
 */
export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token: process.env.SANITY_API_READ_TOKEN}),
})
