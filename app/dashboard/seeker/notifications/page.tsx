import { getAuthUserAs } from '@/lib/auth-utils'
import { NotificationsClient } from './NotificationsClient'

export const metadata = {
  title: 'Notifications | BidJobs',
  description: 'Your intel and alerts',
}

export default async function NotificationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })

  return <NotificationsClient notifications={notifications} profileId={profile?.id || ''} />
}
