'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-error text-5xl">error</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-on-surface">Oops!</h1>
          <p className="text-on-surface-variant">
            Something went wrong with the community page.
          </p>
        </div>

        <div className="bg-surface-container/60 rounded-lg p-4 border border-error/20">
          <p className="text-sm text-error font-mono text-left break-words">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-surface-container text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-high transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
