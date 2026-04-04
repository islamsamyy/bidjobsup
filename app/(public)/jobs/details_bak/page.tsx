import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import BidButton from './BidButton'

export default async function JobDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) notFound()

  const supabase = await createClient()

  // 1. Check if user is signed in and their role
  const { data: { session } } = await supabase.auth.getSession()
  let userRole = null
  if (session) {
    const { data: profile } = await supabase
      .from('users')
      .select('user_type')
      .eq('auth_id', session.user.id)
      .single()
    userRole = profile?.user_type
  }

  // 2. Fetch Job with Employer Info
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      employer:employer_id (
        id,
        full_name,
        username,
        avatar_url,
        bio
      )
    `)
    .eq('id', id)
    .single()

  if (error || !job) {
    notFound()
  }

  const budgetDisplay = job.budget_min && job.budget_max 
    ? `$${job.budget_min.toLocaleString()} - $${job.budget_max.toLocaleString()}`
    : job.budget_max 
      ? `Up to $${job.budget_max.toLocaleString()}` 
      : 'Budget TBD'

  return (
    <main className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Job Core Info */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Header */}
          <div className="space-y-8 animate-fade-in">
            <Link href="/jobs/browse" className="text-[#b0a9ad] hover:text-[#caa2f7] transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] group">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Fleet
            </Link>
            
            <h1 className="text-6xl md:text-8xl font-headline font-black italic text-[#faf1f5] leading-[0.9] tracking-tighter uppercase">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center pt-4">
              <span className="bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black px-5 py-2 rounded-full border border-[#caa2f7]/20 uppercase tracking-[0.2em]">
                {job.category || 'General Sector'}
              </span>
              <span className="bg-[#1c181c] text-[#faf1f5] text-[10px] font-black px-5 py-2 rounded-full border border-[#292428] uppercase tracking-[0.2em]">
                {job.duration || 'Contract'}
              </span>
              <span className="text-[#b0a9ad] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-auto">
                <span className="material-symbols-outlined text-sm text-[#caa2f7]">schedule</span>
                Broadcasted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Budget & Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10 rounded-[2.5rem] bg-[#1c181c] border border-[#292428] shadow-2xl relative overflow-hidden group hover:border-[#caa2f7]/20 transition-all duration-500">
            <div className="space-y-3 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b0a9ad]/50 font-black block">Allocation</span>
              <span className="text-2xl font-headline font-black text-[#caa2f7] italic">{budgetDisplay}</span>
            </div>
            <div className="space-y-3 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b0a9ad]/50 font-black block">Engagement</span>
              <span className="text-2xl font-headline font-black text-[#faf1f5] italic">{job.bids_count || 0} Bids</span>
            </div>
            <div className="space-y-3 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b0a9ad]/50 font-black block">Level</span>
              <span className="text-2xl font-headline font-black text-[#faf1f5] italic capitalize">{job.experience_level || 'expert'}</span>
            </div>
            <div className="space-y-3 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b0a9ad]/50 font-black block">Status</span>
              <span className="text-2xl font-headline font-black text-[#f1bfff] italic animate-pulse">Active</span>
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-[#caa2f7]/5 blur-[80px] pointer-events-none group-hover:bg-[#caa2f7]/10 transition-colors"></div>
          </div>

          {/* Content Sections */}
          <div className="space-y-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-headline font-black italic uppercase tracking-tight">Mission Objective</h2>
              <div className="text-[#b0a9ad] text-xl font-light leading-loose max-w-4xl whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {job.required_skills && job.required_skills.length > 0 && (
              <div className="space-y-10">
                <h2 className="text-4xl font-headline font-black italic uppercase tracking-tight border-b border-[#292428] pb-6">Specialized Mastery</h2>
                <div className="flex flex-wrap gap-4">
                  {job.required_skills.map((skill: string) => (
                    <span key={skill} className="bg-[#1c181c] text-[#faf1f5] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-[#292428] hover:border-[#caa2f7]/40 transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Employer Info & CTA */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Bid CTA */}
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#caa2f7] to-[#b690e3] shadow-[0_40px_100px_rgba(202,162,247,0.2)] space-y-8 sticky top-32 group">
            <div className="space-y-4">
              <h3 className="text-4xl font-headline font-black text-[#431f6b] uppercase leading-none">Initialize<br/>Bid Protocol</h3>
              <p className="text-[#431f6b]/70 text-sm font-medium leading-relaxed">Secure your position in the Kingdom's most exclusive collaborative network.</p>
            </div>
            
            {userRole === 'jobseeker' || userRole === 'both' ? (
              <BidButton 
                jobId={job.id} 
                jobTitle={job.title}
                budgetMin={job.budget_min}
                budgetMax={job.budget_max}
              />
            ) : !session ? (
              <Link 
                href="/sign-in"
                className="w-full bg-[#431f6b] text-[#faf1f5] py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[0.98] active:scale-[0.95] transition-all flex items-center justify-center gap-4 group/btn"
              >
                Sign In to Bid
                <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">login</span>
              </Link>
            ) : (
              <div className="p-5 bg-white/10 rounded-2xl text-[#431f6b] text-[10px] font-black uppercase tracking-[0.2em] text-center border border-white/20">
                Seeker Account Required
              </div>
            )}
            
            <button className="w-full bg-transparent border-2 border-[#431f6b]/20 text-[#431f6b] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-4">
              Save Dossier
              <span className="material-symbols-outlined text-lg">bookmark</span>
            </button>
          </div>

          {/* Employer Card */}
          <div className="p-10 rounded-[2.5rem] bg-[#1c181c] border border-[#292428] space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#b0a9ad]/50 font-black border-b border-[#292428] pb-6">Entity Profile</h3>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#100d10] border border-[#292428] flex items-center justify-center overflow-hidden shadow-inner">
                {job.employer?.avatar_url ? (
                  <img src={job.employer.avatar_url} alt={job.employer.full_name || 'Employer'} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-[#caa2f7]">business</span>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-headline text-2xl font-black text-[#faf1f5] uppercase tracking-tight">{job.employer?.full_name || 'Confidential'}</h4>
                <p className="text-[10px] text-[#caa2f7] font-black uppercase tracking-[0.2em]">Verified Partner</p>
              </div>
            </div>

            <p className="text-sm text-[#b0a9ad] font-light leading-relaxed italic">
              "{job.employer?.bio || 'No public metadata available for this entity. All exchanges are secure under BidJobs Protocol.'}"
            </p>

            <div className="pt-6 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <span className="text-[#b0a9ad]/50 text-[10px] font-black uppercase tracking-[0.2em]">Engagements</span>
                <span className="text-[#faf1f5] font-black text-xs">24 Contracts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#b0a9ad]/50 text-[10px] font-black uppercase tracking-[0.2em]">Flow</span>
                <span className="text-[10px] font-black text-[#caa2f7] bg-[#613471]/30 px-3 py-1 rounded-full uppercase tracking-widest">$4.8M TOTAL</span>
              </div>
            </div>

            <Link href={`/dashboard/employer/profile?id=${job.employer?.id}`} className="block text-center text-[#caa2f7] font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#faf1f5] pt-6 transition-all border-t border-[#292428]">View Full Intelligence</Link>
          </div>

        </div>

      </div>
    </main>
  )
}