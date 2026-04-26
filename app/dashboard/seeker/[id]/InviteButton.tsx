'use client'

import { useState } from 'react'
import { inviteToJob } from '@/lib/actions/jobs'

interface InviteButtonProps {
  seekerId: number
  jobs: { id: number; title: string }[]
}

export default function InviteButton({ seekerId, jobs }: InviteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleInvite = async () => {
    if (!selectedJobId) return

    setStatus('loading')
    const result = await inviteToJob(selectedJobId, seekerId)

    if ('success' in result && result.success) {
      setStatus('success')
      setMessage('Invitation dispatched.')
      setTimeout(() => setIsOpen(false), 2000)
    } else {
      setStatus('error')
      setMessage(('error' in result && result.error) ? result.error : 'Failed to transmit invite.')
    }
  }

  if (jobs.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface-container-highest text-on-surface py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/10 shadow-lg"
      >
        <span className="material-symbols-outlined text-sm">rocket_launch</span>
        Invite to Mission
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-surface-container-high border border-primary/20 rounded-[2rem] shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-sm font-headline font-black italic text-on-surface mb-4 uppercase tracking-widest">Select Mission</h4>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full bg-stone-900 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors mb-4 appearance-none"
          >
            <option value="">Choose a protocol...</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>

          {status === 'success' ? (
            <p className="text-secondary text-[10px] font-black uppercase tracking-widest text-center py-2 animate-bounce">
               {message}
            </p>
          ) : (
            <button
              onClick={handleInvite}
              disabled={!selectedJobId || status === 'loading'}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {status === 'loading' ? 'Encrypting...' : 'Confirm Invite'}
            </button>
          )}
          
          {status === 'error' && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-3">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
