'use client'

import { useState } from 'react'
import PlaceBidModal from './PlaceBidModal'

interface BidButtonProps {
  jobId: string
  jobTitle: string
  budgetMin?: number
  budgetMax?: number
}

export default function BidButton({ jobId, jobTitle, budgetMin, budgetMax }: BidButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-secondary-container text-on-secondary-container py-5 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
      >
        Submit Proposal
        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">bolt</span>
      </button>

      {isOpen && (
        <PlaceBidModal 
          jobId={jobId}
          jobTitle={jobTitle}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
