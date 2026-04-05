'use client'

import { useState } from 'react'

interface StripeCheckoutButtonProps {
  planId: string
  label?: string
  className?: string
  disabled?: boolean
}

export default function StripeCheckoutButton({
  planId,
  label = 'Initialize Upgrade',
  className,
  disabled = false,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to initialize checkout')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Network error — retry protocol')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={isLoading || disabled}
        className={className}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Initializing...
          </span>
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-error text-center">
          {error}
        </p>
      )}
    </div>
  )
}
