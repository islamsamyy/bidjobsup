'use client'

import { useState } from 'react'
import { placeBid } from './actions'
import { useRouter } from 'next/navigation'

interface PlaceBidModalProps {
  jobId: string
  jobTitle: string
  budgetMin?: number
  budgetMax?: number
  onClose: () => void
}

export default function PlaceBidModal({ jobId, jobTitle, budgetMin, budgetMax, onClose }: PlaceBidModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('jobId', jobId)

    const result = await placeBid(formData)

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result?.success) {
      setSuccess(true)
      setIsSubmitting(false)
      setTimeout(() => {
        onClose()
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-surface-container border border-outline-variant/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-outline-variant/10 bg-surface-container-high/50 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-headline font-black italic text-secondary">Place Bid</h3>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest leading-none">Job Ref: {jobTitle.substring(0, 20)}...</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in slide-in-from-top-4 duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 ring-4 ring-primary/10">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">check_circle</span>
              </div>
              <h4 className="text-2xl font-headline font-black italic text-on-surface">Bid Protocols Initiated</h4>
              <p className="text-stone-500 mt-2 text-sm">Your proposal has been successfully broadcast to the employer.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-error-container/20 border border-error-container/30 rounded-xl flex items-center gap-3 text-error-container animate-in slide-in-from-top-2 duration-300">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-1">Bid Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                    <input 
                      name="amount"
                      type="number" 
                      required 
                      defaultValue={budgetMin}
                      min={1}
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl py-3 pl-8 pr-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold"
                      placeholder="Amount"
                    />
                  </div>
                  <p className="text-[9px] text-stone-600 px-1 italic">Range: ${budgetMin?.toLocaleString()} - ${budgetMax?.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-1">Delivery Time</label>
                  <div className="relative">
                    <input 
                      name="deliveryDays"
                      type="number" 
                      required 
                      min={1}
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl py-3 pl-4 pr-12 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold"
                      placeholder="Days"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 text-[10px] font-black uppercase">Days</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-1">Mission Proposal</label>
                <textarea 
                  name="proposal"
                  required
                  rows={4}
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-body text-sm resize-none"
                  placeholder="Explain your strategic approach to this objective. Highlight your unique tactical advantages..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all mt-4 group"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                    Initializing...
                  </>
                ) : (
                  <>
                    Deploy Portfolio
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
