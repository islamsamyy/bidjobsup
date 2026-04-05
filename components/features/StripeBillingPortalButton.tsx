'use client'

import { useState } from 'react'

interface Props {
  label?: string
  className?: string
}

export default function StripeBillingPortalButton({ label = 'Modify Protocol', className }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePortal = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // silently fail — user remains on page
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handlePortal} disabled={isLoading} className={className}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Connecting...
        </span>
      ) : label}
    </button>
  )
}
