'use client'

import Link from 'next/link'
import { useState } from 'react'
import InviteToJobModal from './InviteToJobModal'

interface Job {
  id: number
  title?: string
}

interface Bid {
  id: number
  amount: number
  seeker: {
    id: number
    full_name: string
    username: string | null
    avatar_url: string | null
    bio: string | null
  }
  job: {
    id: number
    title: string
  }
}

interface TalentCardWithInviteProps {
  bid: Bid
  employerJobs: any[]
}

export default function TalentCardWithInvite({ bid, employerJobs }: TalentCardWithInviteProps) {
  const [inviteCount, setInviteCount] = useState(0)

  return (
    <div className="group bg-surface-container hover:bg-surface-container-high transition-all duration-500 rounded-3xl p-8 border border-outline-variant/5 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-start mb-8">
        <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-outline-variant/20 group-hover:border-primary/40 transition-colors overflow-hidden">
          {bid.seeker?.avatar_url ? (
            <img src={bid.seeker.avatar_url} alt="Seeker" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary/40">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
          )}
        </div>
        <div className="bg-primary/10 text-primary font-headline px-4 py-2 rounded-xl text-lg font-black italic border border-primary/20">
          ${bid.amount?.toLocaleString()}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500">{bid.job?.title}</p>
        <h3 className="text-2xl font-headline font-black italic text-on-surface group-hover:text-primary transition-colors">
          {bid.seeker?.full_name || bid.seeker?.username || 'Classified Candidate'}
        </h3>
        <p className="text-sm text-on-surface-variant line-clamp-2 font-body opacity-80 italic">
          {bid.seeker?.bio || 'Elite seeker with deep protocol experience in creative execution and system architecture.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['Creative', 'Strategic', 'Execution'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-500 rounded-full border border-outline-variant/10">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-6 border-t border-outline-variant/10">
        <Link
          href={`/dashboard/messages?recipient=${bid.seeker?.id}`}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">forum</span>
          Message
        </Link>

        {employerJobs?.length > 0 && (
          <InviteToJobModal
            talentId={bid.seeker.id}
            talentName={bid.seeker.full_name || bid.seeker.username || 'Talent'}
            jobs={employerJobs.map((j: any) => ({ id: j.id, title: j.title || 'Job' }))}
          />
        )}

        <Link
          href={`/talent/${bid.seeker?.id}`}
          className="ml-auto bg-stone-950 text-stone-300 border border-outline-variant/10 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 transition-all"
        >
          View
        </Link>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
    </div>
  )
}
