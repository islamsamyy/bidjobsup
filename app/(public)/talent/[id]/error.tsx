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
    console.error('Talent page error:', error)
  }, [error])

  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-body min-h-screen pt-40 pb-20 px-8 flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-[#b0a9ad] mb-6 leading-relaxed">
          {error.message || 'Unable to load this talent profile. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/talent"
            className="px-6 py-3 bg-surface-container border border-outline-variant/20 text-on-surface font-bold rounded-lg hover:border-primary/50 transition-all"
          >
            Back to Talent
          </Link>
        </div>
      </div>
    </div>
  )
}
