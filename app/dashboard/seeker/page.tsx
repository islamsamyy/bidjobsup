import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUserAs } from '@/lib/auth-utils'
import { markAllNotificationsAsRead } from '@/lib/actions/notifications'
import AnalyticsCharts from '@/components/features/analytics/AnalyticsCharts'
import { getSeekerAnalytics } from '@/lib/actions/analytics'

export const dynamic = 'force-dynamic'

export default async function SeekerDashboardPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  // 2. Get active applications count
  const { count: activeAppsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .neq('status', 'rejected')
    
  // 3. Get saved jobs count from saved_items table
  const { count: savedJobsCount } = await supabase!
    .from('saved_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  // 4. Get average review rating for this user
  const { data: reviews } = await supabase!
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', profile?.id)

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  // 5. Get latest notifications for activity feed
  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // 6. Calculate real profile completeness
  const profileFields = [
    profile?.full_name,
    profile?.bio,
    profile?.avatar_url,
    profile?.location,
    profile?.portfolio_url,
    profile?.skills && profile?.skills.length > 0,
    profile?.hourly_rate,
  ]
  const filledFields = profileFields.filter(Boolean).length
  const profileCompleteness = Math.round((filledFields / profileFields.length) * 100)

  // 7. Get accepted bids count (success metric)
  const { count: acceptedBidsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .eq('status', 'accepted')

  // 8. Fetch analytics data
  const analyticsResult = await getSeekerAnalytics()

  const totalBids = activeAppsCount || 0
  const successRate = totalBids > 0
    ? Math.round(((acceptedBidsCount || 0) / totalBids) * 100) + '%'
    : '—'

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Talent'

  // Determine time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <>
      {/* Welcome Hero */}
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div>
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-2">
              {greeting}, <span className="text-primary neon-glow">{firstName}</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-xl">
              {totalBids > 0 
                ? `You have ${totalBids} active application${totalBids !== 1 ? 's' : ''} in progress. Keep pushing forward.`
                : 'Start by searching for elite opportunities or completing your profile?.'
              }
            </p>
          </div>
          
          {/* Progress Widget */}
          <div className="bg-surface-container-low p-6 rounded-2xl w-full md:w-80 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Profile Integrity</span>
              <span className="text-primary font-bold">
                {profileCompleteness}%
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000" 
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {profileCompleteness < 100 ? (
                <>Complete your <Link href="/dashboard/seeker/profile" className="text-on-surface font-semibold underline decoration-primary/50">Profile</Link> to reach 100% and unlock VIP listings.</>
              ) : (
                <>Your profile is complete. You are ready for elite matches.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">send</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{activeAppsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Active Applications</div>
        </div>
        
        {/* Stat 2 - Review Rating */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">star</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{avgRating || '—'}</div>
          <div className="text-sm font-body text-on-surface-variant">
            Average Rating {reviews && reviews.length > 0 ? `(${reviews.length} review${reviews.length !== 1 ? 's' : ''})` : ''}
          </div>
        </div>
        
        {/* Stat 3 - Success Rate */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group border-l-2 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">analytics</span>
            {successRate !== '—' && (acceptedBidsCount || 0) > 0 && (
              <span className="bg-primary-container/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                {parseInt(successRate) >= 80 ? 'EXCELLENT' : parseInt(successRate) >= 50 ? 'GOOD' : 'BUILDING'}
              </span>
            )}
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{successRate}</div>
          <div className="text-sm font-body text-on-surface-variant">Bid Success Rate</div>
        </div>
        
        {/* Stat 4 */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-stone-400 group-hover:scale-110 transition-transform">bookmark</span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{savedJobsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">Saved Jobs</div>
        </div>
      </div>

      {/* Analytics Charts */}
      {analyticsResult.data && (
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-8">Analytics & Insights</h2>
          <AnalyticsCharts
            applicationsOverTime={analyticsResult.data.applicationsOverTime}
            jobsByCategory={analyticsResult.data.jobsByCategory}
            applicationStatus={analyticsResult.data.applicationStatus}
          />
        </div>
      )}

      {/* Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold">Live Updates</h3>
          </div>
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`bg-surface-container-low p-5 rounded-xl border-l-4 ${notif.read_at ? 'border-stone-700' : 'border-primary'}`}>
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
              <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-primary">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">System</span>
                  <span className="text-[10px] text-stone-500">Just Now</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Welcome to BidJobs!</h4>
                <p className="text-xs text-on-surface-variant mb-3 italic">
                  Start by searching for elite opportunities or completing your profile?.
                </p>
              </div>
            )}
            
            {/* Clear Notifications Form */}
            {notifications && notifications.length > 0 && (
              <form action={markAllNotificationsAsRead}>
                <button type="submit" className="w-full mt-4 py-3 bg-surface-container border border-outline-variant/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#4b474a] hover:text-primary hover:border-primary/20 transition-all">
                   Clear Notifications
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Action required section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold">Recommended Actions</h3>
          </div>
          <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5">
            <div className="h-32 w-32 shrink-0 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-6xl">auto_fix_high</span>
            </div>
            <div className="grow">
              <h3 className="font-headline text-2xl font-bold mb-2">
                {profileCompleteness < 100 
                  ? 'Complete Your Profile' 
                  : 'Find Your Next Mission'
                }
              </h3>
              <p className="text-on-surface-variant mb-6 max-w-2xl">
                {profileCompleteness < 100
                  ? `Your profile is ${profileCompleteness}% complete. Add more details to increase your visibility to employers and unlock premium features.`
                  : 'Your profile is ready. Browse open positions and submit bids to start landing contracts with top employers.'
                }
              </p>
              <div className="flex flex-wrap gap-4">
                {profileCompleteness < 100 ? (
                  <Link href="/dashboard/seeker/profile" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center">
                    Complete Profile
                  </Link>
                ) : (
                  <Link href="/dashboard/seeker/search" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center">
                    Browse Open Positions
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}