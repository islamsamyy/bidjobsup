import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PaymentReleaseClient from './client'

export const dynamic = 'force-dynamic'

export default async function PaymentReleasePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user }, error: authError } = await supabase!.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: currentUser } = await supabase!
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user?.id)
    .single()

  if (!currentUser) {
    redirect('/join')
  }

  // Fetch contract details
  const { data: contract, error } = await supabase!
    .from('contracts')
    .select(`
      *,
      job:job_id(id, title, description),
      freelancer:freelancer_id(id, full_name, avatar_url, email),
      employer:employer_id(id, full_name, company_name, avatar_url, email)
    `)
    .eq('id', id)
    .single()

  if (error || !contract) {
    notFound()
  }

  // Check access - only employer can manage payments
  const isEmployer = contract.employer_id === currentUser?.id
  if (!isEmployer) {
    notFound()
  }

  // Fetch escrow information
  const { data: escrow } = await supabase!
    .from('escrow')
    .select('*')
    .eq('contract_id', contract.id)
    .single()

  // Fetch milestones
  const { data: milestones } = await supabase!
    .from('milestones')
    .select('*')
    .eq('contract_id', contract.id)
    .order('order_index')

  // Fetch payments
  const { data: payments } = await supabase!
    .from('payments')
    .select('*')
    .eq('contract_id', contract.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          href={`/dashboard/contracts/${id}`}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Contract</span>
        </Link>

        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">Payment & Escrow Management</h1>
        <p className="text-on-surface-variant text-lg">
          Manage payments and release funds to {contract.freelancer?.full_name}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Contract Amount */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Contract Amount</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            ${contract.amount.toFixed(2)}
          </div>
          <p className="text-on-surface-variant text-xs">{contract.currency}</p>
        </div>

        {/* Paid Amount */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Amount Paid</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            ${contract.paid_amount.toFixed(2)}
          </div>
          <p className="text-on-surface-variant text-xs">
            {((contract.paid_amount / contract.amount) * 100).toFixed(0)}% Complete
          </p>
        </div>

        {/* Escrow Balance */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Escrow Balance</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            ${escrow ? escrow.amount.toFixed(2) : '0.00'}
          </div>
          <p className="text-on-surface-variant text-xs">
            {escrow?.status || 'No escrow active'}
          </p>
        </div>
      </div>

      {/* Payment Content */}
      <PaymentReleaseClient
        contract={contract}
        escrow={escrow}
        milestones={milestones || []}
        payments={payments || []}
        currentUserId={currentUser?.id}
      />
    </main>
  )
}
