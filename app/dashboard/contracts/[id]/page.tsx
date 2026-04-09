import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/features/ReviewForm'
import ReviewsList from '@/components/features/ReviewsList'

export const dynamic = 'force-dynamic'

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!currentUser) {
    redirect('/join')
  }

  // Fetch contract details
  const { data: contract, error } = await supabase
    .from('contracts')
    .select(`
      *,
      job:job_id(id, title, description, budget_min, budget_max, duration),
      freelancer:freelancer_id(id, full_name, avatar_url, email, bio),
      employer:employer_id(id, full_name, company_name, avatar_url, email)
    `)
    .eq('id', id)
    .single()

  if (error || !contract) {
    notFound()
  }

  // Check access
  const isAccessible = contract.freelancer_id === currentUser.id || contract.employer_id === currentUser.id
  if (!isAccessible) {
    notFound()
  }

  const isEmployer = contract.employer_id === currentUser.id
  const otherParty = isEmployer ? contract.freelancer : contract.employer

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      {/* Back Link */}
      <Link
        href="/dashboard/contracts"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="text-xs font-bold uppercase tracking-widest">Back to Contracts</span>
      </Link>

      {/* Contract Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">
              {contract.job?.title || 'Contract'}
            </h1>
            <p className="text-on-surface-variant text-lg">
              Contract #{contract.id} • {new Date(contract.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <div className={`px-6 py-3 rounded-xl border text-sm font-bold uppercase tracking-widest mb-4 inline-block ${
              contract.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              contract.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              contract.status === 'disputed' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            }`}>
              {contract.status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Details */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Job Details</h2>

            {contract.job?.description && (
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Description
                </h3>
                <p className="text-on-surface/90 leading-relaxed whitespace-pre-wrap text-sm">
                  {contract.job.description}
                </p>
              </div>
            )}

            {contract.job?.duration && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Duration
                </h3>
                <p className="text-on-surface font-bold text-sm">
                  {contract.job.duration}
                </p>
              </div>
            )}
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Budget</h3>
              <div className="flex items-baseline gap-2">
                {contract.job?.budget_min && contract.job?.budget_max ? (
                  <>
                    <span className="font-headline text-3xl font-bold text-primary">
                      ${Number(contract.job.budget_min).toLocaleString()}
                    </span>
                    <span className="text-on-surface-variant text-sm">
                      - ${Number(contract.job.budget_max).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-on-surface-variant">No budget specified</span>
                )}
              </div>
            </div>

            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                {isEmployer ? 'Freelancer' : 'Employer'}
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant/20">
                  {otherParty?.avatar_url ? (
                    <img src={otherParty.avatar_url} alt={otherParty.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-lowest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">person</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">
                    {otherParty?.full_name || otherParty?.company_name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{otherParty?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Timeline</h2>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Started
                </div>
                <p className="text-on-surface font-bold text-lg">
                  {new Date(contract.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {contract.deadline && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Deadline
                  </div>
                  <p className="text-on-surface font-bold text-lg">
                    {new Date(contract.deadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {contract.completed_at && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                    Completed
                  </div>
                  <p className="text-emerald-300 font-bold text-lg">
                    {new Date(contract.completed_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Feedback</h2>
            <ReviewsList
              talentId={otherParty?.id}
              currentUserId={currentUser.id}
            />
          </div>

          {/* Leave Review for Completed Contract */}
          {contract.status === 'completed' && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
                {isEmployer ? 'Review this freelancer' : 'Review this employer'}
              </h2>
              <ReviewForm
                revieweeId={otherParty?.id}
                jobId={contract.job_id}
                onSuccess={() => {
                  // Reviews list will auto-refresh on page revalidation
                }}
              />
            </div>
          )}

          {/* Communication */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Communication</h2>
            <p className="text-on-surface-variant mb-4">
              Message {isEmployer ? 'the freelancer' : 'the employer'} directly about this contract.
            </p>
            <Link
              href={`/dashboard/messages?recipient=${otherParty?.id}`}
              className="inline-block px-6 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
            >
              <span className="material-symbols-outlined text-sm mr-2 align-middle">mail</span>
              Send Message
            </Link>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Contract Summary */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 sticky top-20">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Contract Summary</h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</span>
                <p className="text-on-surface font-bold capitalize">{contract.status}</p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Created</span>
                <p className="text-on-surface font-bold text-sm">
                  {new Date(contract.created_at).toLocaleDateString()}
                </p>
              </div>

              {contract.deadline && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Deadline</span>
                  <p className="text-on-surface font-bold text-sm">
                    {new Date(contract.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contract ID</span>
                <p className="text-on-surface-variant font-mono text-xs mt-1">{contract.id}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {contract.status === 'active' && !isEmployer && (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed"
                >
                  Mark Complete
                </button>
              )}

              {contract.status === 'active' && isEmployer && (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed"
                >
                  Release Payment
                </button>
              )}

              <Link
                href={`/dashboard/messages?recipient=${otherParty?.id}`}
                className="block text-center px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 text-on-surface hover:border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              >
                Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
