import {imageUrl} from '@/sanity/image'
import type {SanityImage} from '@/sanity/types'
import {ResponsiveImage} from './ResponsiveImage'

/** CMS crop and hotspot stay authoritative. Missing assets produce no empty panel. */
export function SanityImg({
  image,
  aspect = 4 / 5,
  sizes,
  priority,
  className = '',
}: {
  image?: SanityImage | null
  aspect?: number
  sizes: string
  priority?: boolean
  className?: string
  slotLabel?: string
  tone?: 'light' | 'navy'
}) {
  if (!image?.asset?._id) return null
  const width = 1200
  return (
    <ResponsiveImage
      src={imageUrl(image, width, Math.round(width / aspect))}
      alt={image.decorative ? '' : (image.alt ?? '')}
      aspect={aspect}
      sizes={sizes}
      preload={priority}
      lqip={image.asset.metadata?.lqip}
      className={className}
    />
  )
}
