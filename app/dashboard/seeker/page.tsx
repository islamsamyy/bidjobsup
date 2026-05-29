import { getAuthUserAs } from '@/lib/auth-utils'
import { markAllNotificationsAsRead } from '@/lib/actions/notifications'
import { getSeekerAnalytics } from '@/lib/actions/analytics'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function SeekerDashboardPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { count: activeAppsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .neq('status', 'rejected')

  const { count: savedJobsCount } = await supabase!
    .from('saved_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  const { data: reviews } = await supabase!
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', profile?.id)

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

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

  const { count: acceptedBidsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .eq('status', 'accepted')

  const analyticsResult = await getSeekerAnalytics()

  const totalBids = activeAppsCount || 0
  const successRate = totalBids > 0
    ? Math.round(((acceptedBidsCount || 0) / totalBids) * 100) + '%'
    : '—'

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Talent'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <DashboardClient
      greeting={greeting}
      firstName={firstName}
      activeAppsCount={activeAppsCount || 0}
      totalBids={totalBids}
      successRate={successRate}
      profileCompleteness={profileCompleteness}
      avgRating={avgRating}
      reviewsCount={reviews?.length || 0}
      savedJobsCount={savedJobsCount || 0}
      analyticsData={analyticsResult.data}
    />
  )
}