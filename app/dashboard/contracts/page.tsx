import { getAuthUser } from '@/lib/auth-utils'
import Link from 'next/link'
import { PageHeader } from '../components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const { profile: currentUser, supabase } = await getAuthUser()

  // Fetch contracts where user is either employer or freelancer
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

  const isEmployer = currentUser?.user_type === 'employer' || currentUser?.user_type === 'both'

  // Helper to determine user role in contract
  const getUserRole = (contract: any) => {
    if (contract.freelancer_id === currentUser?.id) return 'freelancer'
    if (contract.employer_id === currentUser?.id) return 'employer'
    return null
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'disputed':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <PageHeader titleKey="contractsPage.title" subtitleKey="contractsPage.subtitle" className="mb-12" />
      {/* Hidden role flag for downstream logic */}
      <span hidden data-is-employer={isEmployer ? 'true' : 'false'} />

      {/* Contracts Grid */}
      {contracts && contracts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contracts.map((contract: any) => {
            const role = getUserRole(contract)
            const otherParty = role === 'employer' ? contract.freelancer : contract.employer
            const statusColor = getStatusColor(contract.status)

            return (
              <Link
                key={contract.id}
                href={`/dashboard/contracts/${contract.id}`}
                className="group bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Header with status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-headline text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {contract.job?.title || 'Contract'}
                    </h2>
                    <p className="text-on-surface-variant text-xs font-body">
                      With {otherParty?.full_name || otherParty?.company_name || 'Unknown'}
                    </p>
                  </div>

                  <div className={`px-4 py-2 rounded-lg border ${statusColor} text-xs font-bold uppercase tracking-widest whitespace-nowrap ml-4`}>
                    {contract.status}
                  </div>
                </div>

                {/* Contract details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
                  {contract.job?.budget_min && contract.job?.budget_max && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Budget</span>
                      <span className="text-on-surface font-bold">
                        ${Number(contract.job.budget_min).toLocaleString()} - ${Number(contract.job.budget_max).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Started</span>
                    <span className="text-on-surface font-bold text-sm">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {contract.deadline && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Due</span>
                      <span className="text-on-surface font-bold text-sm">
                        {new Date(contract.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Other party info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center overflow-hidden shrink-0">
                    {otherParty?.avatar_url ? (
                      <img src={otherParty.avatar_url} alt={otherParty.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                      {role === 'employer' ? 'Freelancer' : 'Employer'}
                    </p>
                    <p className="font-bold text-on-surface truncate">
                      {otherParty?.full_name || otherParty?.company_name || 'Unknown'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-16 text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-6 block">
            handshake
          </span>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
            No Active Contracts
          </h3>
          <p className="text-on-surface-variant font-body max-w-md mx-auto mb-8">
            {isEmployer
              ? 'Once you hire a freelancer, their contract will appear here. You can manage milestones and payments.'
              : 'Once you accept a job offer, the contract will appear here. Track your milestones and deliverables.'}
          </p>
          <Link
            href={isEmployer ? '/dashboard/employer/listings' : '/jobs/browse'}
            className="inline-block px-6 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            {isEmployer ? 'View Open Jobs' : 'Browse Jobs'}
          </Link>
        </div>
      )}
    </main>
  )
}
