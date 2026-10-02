import Image from 'next/image'

import {imageUrl} from '@/sanity/image'
import type {SanityImage} from '@/sanity/types'

/**
 * Responsive CMS image that honours the editor's crop/hotspot.
 * When no image has been uploaded yet, renders an intentional, art-directed
 * "image slot" (never a stock photo of strangers presented as IWC).
 */
export function SanityImg({
  image,
  aspect = 4 / 5,
  sizes,
  priority,
  className = '',
  slotLabel,
  tone = 'light',
}: {
  image?: SanityImage | null
  aspect?: number
  sizes: string
  priority?: boolean
  className?: string
  slotLabel?: string
  tone?: 'light' | 'navy'
}) {
  if (!image?.asset?._id) return <ImageSlot aspect={aspect} className={className} label={slotLabel} tone={tone} />

  const w = 1600
  const h = Math.round(w / aspect)
  const alt = image.decorative ? '' : (image.alt ?? '')
  return (
    <div className={`relative overflow-hidden ${className}`} style={{aspectRatio: aspect}}>
      <Image
        src={imageUrl(image, w, h)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={image.asset.metadata?.lqip}
        className="object-cover"
      />
    </div>
  )
}

/** Quiet geometric placeholder built from the brand's line language. */
export function ImageSlot({aspect = 4 / 5, className = '', label, tone = 'light'}: {aspect?: number; className?: string; label?: string; tone?: 'light' | 'navy'}) {
  const navy = tone === 'navy'
  return (
    <div
      className={`relative overflow-hidden ${navy ? 'bg-navy-800' : 'bg-paper-deep'} ${className}`}
      style={{aspectRatio: aspect}}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="slot-g" cx="70%" cy="20%" r="80%">
            <stop offset="0" stopColor={navy ? '#233a70' : '#ffffff'} />
            <stop offset="1" stopColor={navy ? '#15295a' : '#e9eef1'} />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#slot-g)" />
        <g fill="none" stroke={navy ? '#a8d4f8' : '#0b1f4a'} strokeOpacity={navy ? 0.22 : 0.12} strokeWidth="1">
          <path d="M60 380 L170 250 L300 310 L250 140 L120 120 L170 250" />
          <path d="M300 310 L340 420 M120 120 L60 380 M250 140 L340 90" />
        </g>
        {[
          [60, 380],
          [170, 250],
          [300, 310],
          [250, 140],
          [120, 120],
          [340, 420],
          [340, 90],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 1 ? 5 : 3} fill={i === 1 ? '#c9a673' : navy ? '#a8d4f8' : '#0b1f4a'} fillOpacity={i === 1 ? 0.9 : 0.25} />
        ))}
      </svg>
      {label && (
        <span className={`eyebrow absolute bottom-4 left-4 ${navy ? 'text-white/40' : 'text-navy-900/35'}`}>{label}</span>
      )}
    </div>
  )
}
