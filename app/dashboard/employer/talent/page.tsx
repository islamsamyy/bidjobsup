import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TalentCardWithInvite from '@/components/features/employer/TalentCardWithInvite'

export default async function EmployerTalentPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  // 1. Fetch Employer Profile to get internal ID
  const { data: profile } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (profile?.user_type !== 'employer' && profile?.user_type !== 'both') {
    redirect('/dashboard/seeker')
  }

  // 2. Fetch Jobs owned by this employer to get their IDs
  const { data: employerJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('employer_id', profile.id)
  
  const jobIds = employerJobs?.map(j => j.id) || []
  
  const { data: bids } = await supabase
    .from('bids')
    .select(`
      *,
      seeker:bidder_id (
        id,
        full_name,
        username,
        avatar_url,
        bio
      ),
      job:job_id (
        id,
        title
      )
    `)
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <h2 className="font-headline text-6xl font-black italic text-on-surface leading-tight">
                Candidate <span className="text-primary">Pipeline</span>
             </h2>
             <p className="text-on-surface-variant font-body max-w-md text-sm leading-relaxed">
                Curating elite talent for your active missions. Review, analyze, and initialize secure handshakes with global architects.
             </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 shadow-xl text-center min-w-[140px]">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">Incoming Flow</p>
              <p className="text-3xl font-headline font-black italic text-primary">{bids?.length || 0}</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 shadow-xl text-center min-w-[140px]">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">Integrity Score</p>
              <p className="text-3xl font-headline font-black italic text-on-surface">98%</p>
            </div>
          </div>
        </div>
      </header>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {!bids || bids.length === 0 ? (
          <div className="col-span-full p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-stone-600">person_search</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-on-surface italic">Pipeline Empty</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto text-sm">No tactical propositions have been detected for your active roles yet.</p>
            </div>
            <Link href="/dashboard/employer/listings" className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all">Verify Open Roles</Link>
          </div>
        ) : (
          bids.map((bid) => (
            <TalentCardWithInvite
              key={bid.id}
              bid={bid}
              employerJobs={employerJobs || []}
            />
          ))
        )}
      </div>
    </main>
  )
}