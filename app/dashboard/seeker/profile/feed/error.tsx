'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ProfileFeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Profile Feed Error:', error)
  }, [error])

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">
          Profile Feed
        </h1>
        <p className="text-on-surface-variant text-lg">
          Share your achievements, projects, and insights
        </p>
      </div>

      <div className="glass border border-error/30 rounded-xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="material-symbols-outlined text-5xl text-error">
            error_outline
          </span>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-error mb-2">
              Something went wrong
            </h2>
            <p className="text-on-surface-variant mb-4">
              We encountered an error while loading your profile feed. Please try again.
            </p>
            {error.message && (
              <p className="text-sm text-on-surface-variant bg-error/5 rounded px-3 py-2 mb-4 border border-error/20">
                {error.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">refresh</span>
            Try Again
          </button>
          <Link
            href="/dashboard/seeker"
            className="inline-flex items-center gap-2 bg-surface-container text-on-surface px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            Back to Profile
          </Link>
        </div>
      </div>
    </main>
  )
}
