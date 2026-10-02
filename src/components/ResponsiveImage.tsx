'use client'
import Image from 'next/image'
import {useState} from 'react'

export function ResponsiveImage({
  src,
  alt,
  aspect,
  sizes,
  preload,
  lqip,
  className,
}: {
  src: string
  alt: string
  aspect: number
  sizes: string
  preload?: boolean
  lqip?: string
  className?: string
}) {
  const [failed, setFailed] = useState<string | null>(null)
  if (failed === src) return alt ? <p className="py-3 text-sm text-muted">{alt}</p> : null
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{aspectRatio: aspect}}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        className="object-cover"
        onError={() => setFailed(src)}
      />
    </div>
  )
}
