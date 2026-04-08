'use client'

import { useState } from 'react'
import { inviteToJob } from '@/lib/actions/jobs'
import { X } from 'lucide-react'

interface Job {
  id: number
  title: string
}

interface InviteToJobModalProps {
  talentId: number
  talentName: string
  jobs: Job[]
  onSuccess: () => void
}

export default function InviteToJobModal({
  talentId,
  talentName,
  jobs,
  onSuccess,
}: InviteToJobModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJobId) {
      setError('Please select a job')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await inviteToJob(selectedJobId, talentId)

      if (result.success) {
        setSelectedJobId(null)
        setMessage('')
        setIsOpen(false)
        onSuccess()
      } else {
        setError(result.error || 'Failed to send invite')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send invite')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 px-6 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">mail</span>
        Invite to Job
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-xl max-w-md w-full border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-headline text-xl text-on-surface">
            Invite {talentName}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-error/20 border border-error text-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Select Job
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value) || null)}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs"
            >
              <option value="">Choose a job...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Add a personal note about why they'd be great for this role..."
              rows={3}
              maxLength={500}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs resize-none"
            />
            <span className="text-[10px] text-on-surface-variant mt-1 block">
              {message.length}/500
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-surface-container-lowest border border-outline-variant/10 text-on-surface hover:border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedJobId}
              className="flex-1 px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
