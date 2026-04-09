'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Post job page error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-error mb-4">Error</h1>
        <p className="text-on-surface-variant mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
