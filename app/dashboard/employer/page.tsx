import { getAuthUserAs } from '@/lib/auth-utils'
import { getEmployerAnalytics } from '@/lib/actions/analytics'
import { EmployerDashboardClient } from './EmployerDashboardClient'

export const dynamic = 'force-dynamic'

export default async function EmployerDashboardPage() {
  const { profile, supabase } = await getAuthUserAs('employer')

  const { count: activeJobsCount } = await supabase!
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)
    .eq('status', 'open')

  const { count: applicantsCount } = await supabase!
    .from('bids')
    .select('*, jobs!inner()', { count: 'exact', head: true })
    .eq('jobs.employer_id', profile?.id)

  const { count: hiredCount } = await supabase!
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)

  const { count: totalJobsPosted } = await supabase!
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)

  const analyticsResult = await getEmployerAnalytics()

  const isProfileComplete = !!(profile?.full_name && profile?.bio && profile?.company_name)

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Partner'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <EmployerDashboardClient
      greeting={greeting}
      firstName={firstName}
      activeJobsCount={activeJobsCount || 0}
      applicantsCount={applicantsCount || 0}
      hiredCount={hiredCount || 0}
      totalJobsPosted={totalJobsPosted || 0}
      isProfileComplete={isProfileComplete}
      analyticsData={analyticsResult.data}
    />
  )
}