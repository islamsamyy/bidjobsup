import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import InviteButton from './InviteButton'

export default async function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  // In Next.js 15+, params is a Promise
  const { id } = await params;

  // 1. Fetch Candidate Profile with extended data
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // 2. Resolve Current User role to see if they are an employer
  const { data: currentUser } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  const isEmployer = currentUser?.user_type === 'employer' || currentUser?.user_type === 'both'
  
  // 3. If employer, fetch their active jobs to enable invitation
  let employerJobs: { id: number; title: string }[] = []
  if (isEmployer) {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('employer_id', currentUser.id)
      .eq('status', 'open')
    
    employerJobs = jobs || []
  }

  // Handle skills as comma-separated string if needed
  const skillsArray = typeof profile.skills === 'string' 
    ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(profile.skills) ? profile.skills : [];
  
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      {/* Back Button */}
      <Link href="/dashboard/employer/talent" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-12 group">
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to Pipeline
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="aspect-square rounded-[3rem] bg-surface-container-highest border-4 border-surface shadow-2xl relative overflow-hidden group">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[80px]">person</span>
              </div>
            )}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/10 space-y-6 shadow-xl">
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest leading-none">Expected Rate</p>
              <p className="text-3xl font-headline font-black italic text-secondary">${profile.hourly_rate || '—'}<span className="text-sm not-italic opacity-50 ml-1">/hr</span></p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest leading-none">Experience</p>
              <p className="text-xl font-headline font-bold text-on-surface italic">{profile.experience_level || 'Elite Class'}</p>
            </div>

            <div className="pt-6 border-t border-outline-variant/10 space-y-4">
              <Link 
                href={`/dashboard/messages?recipient=${profile.id}`}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-sm">forum</span>
                Initialize Handshake
              </Link>
              
              {isEmployer && employerJobs.length > 0 && (
                <InviteButton seekerId={profile.id} jobs={employerJobs} />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillsArray.length > 0 ? (
              skillsArray.map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-stone-900 border border-outline-variant/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400">
                  {skill}
                </span>
              ))
            ) : (
                <span className="text-xs italic text-stone-600">No modular skills listed in dossier.</span>
            )}
          </div>
        </div>

        {/* Right Column: Bio & Experience */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Candidate Dossier</span>
               {profile.verified && (
                 <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-secondary/20">Verified Protocol</span>
               )}
            </div>
            <h1 className="text-6xl md:text-7xl font-headline font-black italic text-on-background leading-none">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-on-surface-variant font-bold text-lg tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              {profile.location || 'Remote Node (Global)'}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="serif-display text-2xl italic flex items-center gap-4">
              <span className="w-12 h-px bg-primary/40"></span>
              Strategic Narrative
            </h3>
            <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/5 shadow-inner">
              <p className="text-on-surface-variant font-body leading-relaxed whitespace-pre-wrap">
                {profile.bio || 'This candidate has not yet filed their strategic narrative. Intelligence suggests they specialize in high-impact execution and system architecture.'}
              </p>
            </div>
          </div>

          {profile.portfolio_url && (
            <div className="space-y-6">
              <h3 className="serif-display text-2xl italic flex items-center gap-4">
                <span className="w-12 h-px bg-secondary/40"></span>
                External Artifacts
              </h3>
              <a 
                href={profile.portfolio_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 px-8 py-5 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-900 border border-outline-variant/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Portfolio Cluster</p>
                  <p className="text-sm font-bold text-on-surface">{profile.portfolio_url.replace(/^https?:\/\//, '')}</p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
