'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Employer dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">Error Loading Dashboard</h1>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-surface-container border border-outline-variant/20 text-on-surface font-bold rounded-lg hover:border-primary/50 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
