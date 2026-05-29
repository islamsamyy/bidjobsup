import { getAuthUser } from '@/lib/auth-utils'
import { ContractsClient } from './ContractsClient'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const { profile: currentUser, supabase } = await getAuthUser()

  const { data: contracts } = await supabase!
    .from('contracts')
    .select(`
      *,
      job:job_id(id, title, description, budget_min, budget_max),
      freelancer:freelancer_id(id, full_name, avatar_url),
      employer:employer_id(id, full_name, company_name, avatar_url)
    `)
    .or(`freelancer_id.eq.${currentUser?.id},employer_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  return (
    <ContractsClient
      contracts={contracts}
      currentUserId={currentUser?.id || ''}
      userType={currentUser?.user_type || 'jobseeker'}
    />
  )
}
