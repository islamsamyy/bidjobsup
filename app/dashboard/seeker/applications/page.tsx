import { getAuthUserAs } from '@/lib/auth-utils'
import { ApplicationsClient } from './ApplicationsClient'

export default async function SeekerApplicationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { data: bids } = await supabase!
    .from('bids')
    .select(`
      *,
      job:jobs!job_id (
        id,
        title,
        budget_min,
        budget_max,
        employer_id,
        employer:employer_id (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('bidder_id', profile?.id)
    .order('created_at', { ascending: false })

  return <ApplicationsClient bids={bids} />
}