import { getAuthUserAs } from '@/lib/auth-utils'
import { SavedJobsClient } from './SavedJobsClient'

export default async function SavedJobsAndNotificationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { data: savedJobs } = await supabase!
    .from('saved_items')
    .select(`
      *,
      job:jobs!job_id (
        *,
        employer:employer_id (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', profile?.id)

  return <SavedJobsClient savedJobs={savedJobs} />
}