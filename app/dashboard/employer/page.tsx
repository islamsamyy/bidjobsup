import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // 1. Fetch employer profile from 'users' + extended data
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()
    
  if (!profile) {
    redirect('/sign-in')
  }

  // 2. Get active jobs count
  const { count: activeJobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile.id)
    .eq('status', 'open')
    
  // 3. Get total applicants across all employer's jobs
  const { count: applicantsCount } = await supabase
    .from('bids')
    .select('*, jobs!inner()', { count: 'exact', head: true })
    .eq('jobs.employer_id', profile.id)

  // 4. Get hired count from contracts table
  const { count: hiredCount } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile.id)

  // 5. Get total jobs posted (all statuses) for listing views proxy
  const { count: totalJobsPosted } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile.id)

  // 6. Get latest notifications for activity feed
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // 7. Calculate profile completeness
  const isProfileComplete = !!(profile.full_name && profile.bio && profile.company_name)
  
  const firstName = profile.full_name?.split(' ')[0] || profile.username || 'Partner'

  // Determine time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <>
      {/* Welcome Hero */}
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div>
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-2">
              {greeting}, <span className="text-secondary neon-glow drop-shadow-[0_0_8px_rgba(234,179,250,0.4)]">{firstName}</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-xl">
              {(applicantsCount || 0) > 0 
                ? <>You have <span className="text-secondary font-bold">{applicantsCount}</span> candidate{applicantsCount !== 1 ? 's' : ''} awaiting review across your open positions.</>
                : 'Post your first role to start attracting world-class talent.'
              }
            </p>
          </div>
          
          {/* Progress Widget */}
          <div className="bg-surface-container-low p-6 rounded-2xl w-full md:w-80 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Enterprise Profile</span>
              <span className="text-secondary font-bold">
                {isProfileComplete ? '100%' : '75%'}
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-secondary-fixed-dim to-secondary h-full rounded-full transition-all duration-1000" 
                style={{ width: isProfileComplete ? '100%' : '75%' }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {!isProfileComplete ? (
                <>Add your <Link href="/dashboard/employer/profile" className="text-on-surface font-semibold underline decoration-secondary/50">Company Profile details</Link> to attract top 1% talent.</>
              ) : (
                <>Your enterprise profile is fully verified and optimized.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 - Active Listings */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">work</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{activeJobsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Active Listings</div>
        </div>
        
        {/* Stat 2 - Total Applicants */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">groups</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{applicantsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Total Applicants</div>
        </div>
        
        {/* Stat 3 - Talent Hired (from contracts) */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group border-l-2 border-secondary/30">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">handshake</span>
            {(hiredCount || 0) > 0 && (
              <span className="bg-secondary-container/20 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
            )}
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{hiredCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Talent Hired</div>
        </div>
        
        {/* Stat 4 - Total Jobs Posted */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-stone-400 group-hover:scale-110 transition-transform">description</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{totalJobsPosted || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Total Roles Posted</div>
        </div>
      </div>

      {/* Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold">Priority Alerts</h3>
          </div>
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`bg-surface-container-low p-5 rounded-xl border-l-4 ${notif.read_at ? 'border-stone-700' : 'border-secondary'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{notif.type || 'System'}</span>
                    <span className="text-[10px] text-stone-500">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{notif.title}</h4>
                  <p className="text-xs text-on-surface-variant mb-3 italic">
                    {notif.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-secondary">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">System</span>
                  <span className="text-[10px] text-stone-500">Just Now</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Welcome to BidJobs!</h4>
                <p className="text-xs text-on-surface-variant mb-3 italic">
                  Get started by posting your first role to attract world-class talent.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action required section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold">Accelerate Hiring</h3>
          </div>
          <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5">
            <div className="h-32 w-32 shrink-0 bg-secondary-container/10 rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>precision_manufacturing</span>
            </div>
            <div className="grow">
              <h3 className="font-headline text-2xl font-bold mb-2">
                {(activeJobsCount || 0) === 0 ? 'Post Your First Role' : 'Deploy Precision Matching'}
              </h3>
              <p className="text-on-surface-variant mb-6 max-w-2xl">
                {(activeJobsCount || 0) === 0 
                  ? 'Create a detailed role description and our platform will help you find the perfect match from our global talent pool.'
                  : 'Create highly sophisticated role requirements, and our AI will passively source the top 1% of talent matching your specific needs.'
                }
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard/employer/post-job" className="bg-secondary text-on-primary-container font-bold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center">
                  Post New Role
                </Link>
                <Link href="/dashboard/employer/talent" className="text-on-surface font-bold px-6 py-3 text-sm hover:text-secondary transition-colors">
                  Browse Talent Pool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}