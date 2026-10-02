'use client'

import {useEffect} from 'react'

import {track} from '@/lib/analytics'

/** Fires one resource_view per article page view (slug + topic only). */
export function ResourceTracker({slug, topic}: {slug: string; topic: string}) {
  useEffect(() => {
    track('resource_view', {slug, topic})
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a')
      if (a?.closest('[data-track="article-next-step"]')) track('resource_next_step', {slug, destination: a.getAttribute('href') ?? ''})
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [slug, topic])
  return null
}
