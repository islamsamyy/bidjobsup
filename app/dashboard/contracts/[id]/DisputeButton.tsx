'use client'

import { useState } from 'react'
import { createDispute } from '@/lib/actions/disputes'
import { useRouter } from 'next/navigation'

interface DisputeButtonProps {
  contractId: number
  againstUserId: number
  jobId: number
}

export default function DisputeButton({ contractId, againstUserId, jobId }: DisputeButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [reason, setReason] = useState('non_delivery')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await createDispute({
      contractId,
      jobId,
      againstUserId,
      title,
      reason,
      description,
    })
    setLoading(false)
    if (!result?.success) {
      setError(result?.error || 'Failed to open dispute')
      return
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block text-center w-full px-4 py-3 bg-error/10 border border-error/20 text-error hover:bg-error/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
      >
        <span className="material-symbols-outlined text-sm mr-1 align-middle">gavel</span>
        Open Dispute
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-surface-container rounded-2xl border border-outline-variant/20 p-8 w-full max-w-lg shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Open a Dispute</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Describe the issue. An admin will review and mediate.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="input-inset w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                  Reason *
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="input-inset w-full"
                >
                  <option value="non_delivery">Non-delivery of work</option>
                  <option value="quality">Quality issues</option>
                  <option value="payment">Payment dispute</option>
                  <option value="scope_creep">Scope creep</option>
                  <option value="communication">Communication breakdown</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain what happened and what resolution you're seeking... (min. 20 characters)"
                  className="input-inset w-full resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !title.trim() || description.trim().length < 20}
                  className="bg-error text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Submit Dispute
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-surface-container-lowest border border-outline-variant/10 text-on-surface px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest hover:border-outline-variant/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
