import { getAuthUserAs } from '@/lib/auth-utils'
import { ListingsClient } from './ListingsClient'

export default async function EmployerListingsPage() {
  const { profile, supabase } = await getAuthUserAs('employer')

  const { data: jobs } = await supabase!
    .from('jobs')
    .select(`
      *,
      bids_count:bids(count)
    `)
    .eq('employer_id', profile?.id)
    .order('created_at', { ascending: false })

  return <ListingsClient jobs={jobs || []} />
}