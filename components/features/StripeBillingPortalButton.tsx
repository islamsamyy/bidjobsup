'use client'

import { useState } from 'react'

interface Props {
  label?: string
  className?: string
}

export default function StripeBillingPortalButton({ label = 'Modify Protocol', className }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePortal = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to open billing portal')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error — please retry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={handlePortal} disabled={isLoading} className={className}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Connecting...
          </span>
        ) : label}
      </button>
      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-error text-center">
          {error}
        </p>
      )}
    </div>
  )
}
