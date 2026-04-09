'use client'

import { useState } from 'react'
import { createDispute } from '@/lib/actions/disputes'

interface CreateDisputeFormProps {
  jobId?: number
  jobTitle?: string
  againstUserId?: number
  againstUserName?: string
  onSuccess?: (disputeId: number) => void
  onCancel?: () => void
}

const REASON_OPTIONS = [
  { value: 'quality_issue', label: 'Quality Issue - Work does not meet specified standards' },
  { value: 'missed_deadline', label: 'Missed Deadline - Work was not completed on time' },
  { value: 'non_payment', label: 'Non-Payment - Payment was not received' },
  { value: 'scope_change', label: 'Scope Change - Work scope changed without agreement' },
  { value: 'communication', label: 'Communication - Issues with communication or availability' },
  { value: 'other', label: 'Other - Please describe in the details' },
]

export default function CreateDisputeForm({
  jobId,
  jobTitle,
  againstUserId,
  againstUserName,
  onSuccess,
  onCancel,
}: CreateDisputeFormProps) {
  const [title, setTitle] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !reason || !description.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters')
      return
    }

    if (!jobId || !againstUserId) {
      setError('Missing job or user information')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createDispute({
        jobId,
        againstUserId,
        title,
        reason,
        description,
      })

      if (result.success && result.id) {
        setSuccess(true)
        setTitle('')
        setReason('')
        setDescription('')
        if (onSuccess) {
          setTimeout(() => onSuccess(result.id!), 1500)
        }
      } else {
        setError(result.error || 'Failed to create dispute')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create dispute')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-emerald-500 mb-4 block">
          check_circle
        </span>
        <h3 className="text-xl font-bold text-emerald-400 mb-2">Dispute Created</h3>
        <p className="text-on-surface-variant">
          Your dispute has been submitted. The other party will be notified.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {jobTitle && (
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-white/5">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Job</p>
          <p className="text-on-surface font-bold mt-2">{jobTitle}</p>
        </div>
      )}

      {againstUserName && (
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-white/5">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Dispute Against</p>
          <p className="text-on-surface font-bold mt-2">{againstUserName}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Dispute Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 255))}
          placeholder="Brief summary of the dispute..."
          maxLength={255}
          required
          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-sm"
        />
        <p className="text-[10px] text-on-surface-variant mt-1">{title.length}/255</p>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Reason for Dispute *
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-sm"
        >
          <option value="">Select a reason...</option>
          {REASON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Detailed Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
          placeholder="Provide detailed information about the dispute. Include dates, specifics, and any relevant context."
          rows={6}
          minLength={20}
          maxLength={5000}
          required
          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-sm resize-none"
        />
        <p className="text-[10px] text-on-surface-variant mt-1">
          {description.length}/5000 (minimum 20 characters)
        </p>
      </div>

      <div className="flex gap-3 pt-6 border-t border-white/5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 text-on-surface hover:border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !reason || !description.trim()}
          className="flex-1 px-4 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Dispute'}
        </button>
      </div>
    </form>
  )
}
