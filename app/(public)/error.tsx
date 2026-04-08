'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-error text-3xl">warning</span>
      </div>
      <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">
        Something went wrong
      </h2>
      <p className="text-on-surface-variant text-sm max-w-md mb-8 leading-relaxed">
        We encountered an unexpected issue. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary text-on-primary font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:brightness-110 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-surface-container border border-outline-variant/20 text-on-surface font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-surface-bright transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
