import Link from 'next/link'

/** Visible reminder that the editor is looking at unpublished content. */
export function DraftModeBanner() {
  return (
    <div className="relative z-50 bg-gold-100 text-navy-900">
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
        <p>
          <strong className="font-semibold">Preview mode:</strong> you are viewing draft content that visitors cannot see.
        </p>
        <Link href="/api/draft-mode/disable" prefetch={false} className="font-semibold underline underline-offset-4">
          Exit preview
        </Link>
      </div>
    </div>
  )
}
