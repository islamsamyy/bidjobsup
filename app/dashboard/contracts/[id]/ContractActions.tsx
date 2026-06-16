'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateContractStatus } from '@/lib/actions/contracts'

export default function MarkCompleteButton({ contractId }: { contractId: number }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleComplete() {
    setSubmitting(true)
    setError(null)
    const result = await updateContractStatus(contractId, 'completed')
    if (!result.success) {
      setError(result.error || 'Failed to mark contract complete')
      setSubmitting(false)
      setConfirming(false)
      return
    }
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-on-surface-variant text-center">
          Mark this contract as complete? This notifies the employer to review and release payment.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleComplete}
            disabled={submitting}
            className="flex-1 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Confirm'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={submitting}
            className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 text-on-surface rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
    >
      Mark Complete
    </button>
  )
}
