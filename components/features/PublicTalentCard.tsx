'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import InviteToJobModal from './employer/InviteToJobModal'

interface TalentCardProps {
  talent: {
    id: number
    full_name: string
    username: string | null
    bio: string | null
    avatar_url: string | null
    location: string | null
    hourly_rate: number | null
    experience_level: string | null
    industry: string | null
    skills: string | null
    role: string
    avgRating?: number | null
    reviewCount?: number
  }
}

export default function PublicTalentCard({ talent }: TalentCardProps) {
  const [isEmployer, setIsEmployer] = useState(false)
  const [employerJobs, setEmployerJobs] = useState<{ id: number; title: string }[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const checkEmployerAndFetchJobs = async () => {
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data: profile } = await supabase
          .from('users')
          .select('id, user_type')
          .eq('auth_id', user.id)
          .single()

        if (!profile) return

        setCurrentUserId(profile.id)
        const isEmp = profile.user_type === 'employer' || profile.user_type === 'both'
        setIsEmployer(isEmp)

        if (isEmp) {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('employer_id', profile.id)
            .eq('status', 'open')
            .limit(20)

          setEmployerJobs(jobs || [])
        }
      } catch (err) {
        console.error('Error checking employer status:', err)
      }
    }

    checkEmployerAndFetchJobs()
  }, [])

  const skillsArray = talent.skills
    ? talent.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)
    : []

  const rateDisplay = talent.hourly_rate
    ? `$${talent.hourly_rate}/hr`
    : 'Rate on Request'

  return (
    <div className="group flex flex-col h-full snap-start bg-[#1c181c] rounded-[2rem] p-8 hover:bg-[#221e22] hover:border-[#caa2f7]/30 border border-[#292428] transition-all duration-500 shadow-2xl relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#caa2f7]/50">
      <div className="flex justify-between items-start mb-8 relative z-10 w-full">
        <div className="w-16 h-16 rounded-2xl bg-[#100d10] flex items-center justify-center border border-[#292428] overflow-hidden group-hover:border-[#caa2f7]/30 transition-colors shrink-0">
          {talent.avatar_url ? (
            <img
              src={talent.avatar_url}
              alt={talent.full_name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <span className="material-symbols-outlined text-[#caa2f7] text-4xl">person</span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black px-4 py-1.5 rounded-full whitespace-nowrap mb-2 tracking-widest uppercase">
            {rateDisplay}
          </span>
          <span className="text-[10px] text-[#4b474a] font-bold uppercase tracking-widest">
            {talent.experience_level || 'Specialist'}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-grow mb-8 w-full">
        <h4 className="font-headline text-2xl font-bold mb-1 group-hover:text-[#caa2f7] transition-colors line-clamp-1">
          {talent.full_name}
        </h4>
        <p className="text-[#caa2f7]/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          {talent.industry || 'Digital Architecture'}
        </p>
        <p className="text-[#b0a9ad] text-sm leading-relaxed line-clamp-3 font-light mb-6">
          {talent.bio || 'This elite professional is redefining their industry through exceptional execution and visionary leadership.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skillsArray.length > 0 ? (
            skillsArray.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-[#100d10] border border-[#292428] text-[9px] font-bold text-[#caa2f7] uppercase tracking-widest">
                {skill}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 rounded-lg bg-[#100d10] border border-[#292428] text-[9px] font-bold text-[#b0a9ad] uppercase tracking-widest">
              Verified Skills
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-[#292428] pt-6 relative z-10 w-full mt-auto flex-wrap">
        <div className="flex flex-col gap-1 flex-1">
          {talent.avgRating ? (
            <>
              <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-black">Rating</span>
              <span className="text-xs font-black text-[#f1bfff] flex items-center gap-1.5">
                <span className="text-[#caa2f7]">★</span>
                {talent.avgRating.toFixed(1)} ({talent.reviewCount || 0})
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-black">Location</span>
              <span className="text-xs font-black text-[#faf1f5] flex items-center gap-1.5 uppercase truncate">
                <span className="material-symbols-outlined text-[14px] text-[#caa2f7]">location_on</span>
                {talent.location || 'Remote'}
              </span>
            </>
          )}
        </div>

        {isEmployer && employerJobs.length > 0 && (
          <InviteToJobModal
            talentId={talent.id}
            talentName={talent.full_name || 'Talent'}
            jobs={employerJobs}
            onSuccess={() => {
              // Success feedback handled by modal
            }}
          />
        )}

        <Link href={`/talent/${talent.id}`}>
          <div className="flex items-center gap-2 text-[#f1bfff] text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
            View Profile
            <div className="w-8 h-8 rounded-lg bg-[#100d10] border border-[#292428] flex items-center justify-center hover:bg-[#caa2f7] hover:text-[#431f6b] transition-all">
              <span className="material-symbols-outlined font-black text-sm">arrow_forward</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#caa2f7]/5 rounded-full blur-3xl group-hover:bg-[#caa2f7]/10 transition-colors duration-1000 z-0"></div>
    </div>
  )
}
