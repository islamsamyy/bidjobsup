import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/features/ReviewForm'
import ReviewsList from '@/components/features/ReviewsList'
import InviteToJobModal from '@/components/features/employer/InviteToJobModal'
import TalentPortfolioSection from '@/components/features/TalentPortfolioSection'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: user } = await supabase.from('users').select('full_name, industry').eq('id', id).single()

  if (!user) return { title: 'Specialist Profile | BidJobs' }

  return {
    title: `${user.full_name} | ${user.industry || 'Specialist'} | BidJobs Elite Network`,
    description: `Connect with ${user.full_name}, a vetted specialist in ${user.industry || 'the elite network'}.`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Get current user for showing interactive features
  const { data: { user: authUser } } = await supabase.auth.getUser()
  let currentUser: any = null
  let isEmployer = false
  let employerJobs: any[] = []

  if (authUser) {
    const { data: curUser } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('auth_id', authUser.id)
      .single()

    currentUser = curUser
    isEmployer = curUser?.user_type === 'employer' || curUser?.user_type === 'both'

    // If employer, fetch their active jobs for invites
    if (isEmployer) {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', currentUser.id)
        .eq('status', 'open')
        .limit(20)

      employerJobs = jobs || []
    }
  }

  const skills = profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : []

  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-body min-h-screen pt-40 pb-20 px-8 selection:bg-[#caa2f7] selection:text-[#431f6b]">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/talent"
          className="inline-flex items-center gap-2 text-[#b0a9ad] hover:text-[#caa2f7] transition-all mb-12 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Directory</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar: Profile Summary */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#caa2f7]/10 to-transparent rounded-bl-[100px]" />
              
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-2xl border-2 border-[#caa2f7]/30 p-1.5 overflow-hidden ring-8 ring-[#caa2f7]/5">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-[#292428] flex items-center justify-center rounded-xl">
                      <span className="text-4xl font-black text-[#caa2f7] uppercase">{profile.full_name?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#caa2f7] text-[#431f6b] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Vetted
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-headline font-bold mb-1">{profile.full_name}</h1>
                <p className="text-[#caa2f7] text-xs font-bold uppercase tracking-widest">{profile.industry || 'Market Specialist'}</p>
              </div>

              <div className="space-y-4 pt-8 border-t border-[#292428]">
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-[#585457]">Location</span>
                  <span className="text-[#faf1f5] font-bold">{profile.location || 'Global'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-[#585457]">Experience</span>
                  <span className="text-[#faf1f5] font-bold">{profile.experience_level || 'Elite'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-[#585457]">Hourly Base</span>
                  <span className="text-[#caa2f7] font-black">${profile.hourly_rate || '0'}/hr</span>
                </div>
              </div>

              {isEmployer && employerJobs.length > 0 && (
                <InviteToJobModal
                  talentId={parseInt(id)}
                  talentName={profile.full_name || 'Talent'}
                  jobs={employerJobs}
                  onSuccess={() => {
                    // Could refresh page or show toast notification
                  }}
                />
              )}

              <button className="w-full mt-10 py-5 rounded-2xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#caa2f7]/10 hover:brightness-110 active:scale-95 transition-all">
                Book Consultation
              </button>
            </div>

            {/* Social / Links */}
            <div className="bg-[#1c181c]/50 border border-[#292428] rounded-3xl p-6 flex justify-around">
               {['language', 'share', 'contact_support'].map(icon => (
                 <button key={icon} className="w-12 h-12 rounded-xl bg-white/5 border border-[#292428] flex items-center justify-center text-[#b0a9ad] hover:text-[#caa2f7] hover:border-[#caa2f7]/40 transition-all">
                   <span className="material-symbols-outlined text-xl">{icon}</span>
                 </button>
               ))}
            </div>
          </aside>

          {/* Main Content: Bio & Expertise */}
          <main className="lg:col-span-8 space-y-12">
            {/* Bio Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">Professional Narrative</h2>
                <span className="h-px w-12 bg-[#292428]" />
              </div>
              <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-10 shadow-xl">
                <p className="text-[#b0a9ad] leading-relaxed font-light text-lg italic quotes">
                  {profile.bio || "This specialist is currently refining their professional narrative. Reach out to discuss how their expertise can scale your operations."}
                </p>
              </div>
            </section>

            {/* Expertise Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">Specialist Expertise</h2>
                <span className="h-px w-12 bg-[#292428]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-8">
                   <h3 className="text-sm font-black uppercase tracking-widest text-[#faf1f5] mb-6 flex items-center gap-2">
                     <span className="material-symbols-outlined text-[#caa2f7]">verified</span>
                     Technical Stack
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {skills.length > 0 ? skills.map((skill: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-white/5 border border-[#292428] rounded-lg text-[9px] font-bold uppercase tracking-widest text-[#b0a9ad] hover:text-[#caa2f7] hover:border-[#caa2f7]/30 transition-all cursor-default">
                         {skill}
                       </span>
                     )) : <span className="text-[#4b474a] text-[10px] italic">No skills listed</span>}
                   </div>
                </div>
                <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-8">
                   <h3 className="text-sm font-black uppercase tracking-widest text-[#faf1f5] mb-6 flex items-center gap-2">
                     <span className="material-symbols-outlined text-[#caa2f7]">insights</span>
                     Strategic Focus
                   </h3>
                   <p className="text-xs text-[#b0a9ad] leading-relaxed font-light">
                     Specializing in {profile.industry || 'high-value operations'} with a focus on delivering excellence in {profile.location || 'global markets'}.
                   </p>
                </div>
              </div>
            </section>

            {/* Portfolio Section */}
            <TalentPortfolioSection
              userId={parseInt(id)}
              talentName={profile.full_name || 'Talent'}
            />

            {/* Reviews Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">Reviews & Feedback</h2>
                <span className="h-px w-12 bg-[#292428]" />
              </div>
              <ReviewsList
                talentId={parseInt(id)}
                currentUserId={currentUser?.id}
              />
            </section>

            {/* Leave Review Section */}
            {currentUser && currentUser.id !== parseInt(id) && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">Share Your Experience</h2>
                  <span className="h-px w-12 bg-[#292428]" />
                </div>
                <ReviewForm
                  revieweeId={parseInt(id)}
                  jobId={0}
                  onSuccess={() => {
                    // Reviews will auto-refresh on page revalidation
                  }}
                />
              </section>
            )}

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[#1c181c] to-[#141114] border border-[#caa2f7]/10 rounded-4xl p-12 text-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#caa2f710_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <h2 className="text-3xl font-headline font-bold mb-4 relative z-10">Start a conversation with {profile.full_name?.split(' ')[0]}</h2>
              <p className="text-[#b0a9ad] font-light mb-10 max-w-xl mx-auto relative z-10">Our secure platform handles contract negotiation and dynamic payouts, ensuring a seamless elite collaboration experience.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                 <button className="px-10 py-5 rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#caa2f7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                   Initiate Mandate
                 </button>
                 <button className="px-10 py-5 rounded-xl bg-transparent border border-[#b0a9ad]/30 text-[#faf1f5] font-black text-xs uppercase tracking-widest hover:border-[#caa2f7]/50 hover:text-[#caa2f7] transition-all">
                   Save to Shortlist
                 </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
