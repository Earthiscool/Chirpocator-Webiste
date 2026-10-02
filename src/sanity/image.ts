import {createImageUrlBuilder} from '@sanity/image-url'

import {dataset, projectId} from './env'
import type {SanityImage} from './types'

const builder = createImageUrlBuilder({projectId: projectId || 'unconfigured', dataset})

/** Build a CDN URL that respects the editor's hotspot/crop. */
export function imageUrl(image: SanityImage, width: number, height?: number) {
  let b = builder.image(image).width(width).fit('crop').auto('format').quality(80)
  if (height) b = b.height(height)
  return b.url()
}
