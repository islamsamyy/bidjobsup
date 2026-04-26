import { getAuthUser } from '@/lib/auth-utils'
import Link from 'next/link'
import PaymentHistoryClient from './client'
import { PageHeader } from '../components/PageHeader'
import { TranslatedText } from '../components/TranslatedText'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const { user: currentUser, supabase } = await getAuthUser()

  // Fetch all payments
  const { data: paymentsData } = await supabase!
    .from('payments')
    .select(`
      id,
      amount,
      currency,
      status,
      payment_method,
      description,
      created_at,
      completed_at,
      payer_id,
      payee_id,
      contract_id,
      payer:payer_id(id, full_name, avatar_url),
      payee:payee_id(id, full_name, avatar_url),
      contract:contract_id(id, title)
    `)
    .or(`payer_id.eq.${currentUser?.id},payee_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const payments = paymentsData?.map(p => ({
    ...p,
    payer: p.payer && Array.isArray(p.payer) ? p.payer[0] : p.payer,
    payee: p.payee && Array.isArray(p.payee) ? p.payee[0] : p.payee,
    contract: p.contract && Array.isArray(p.contract) ? p.contract[0] : p.contract,
  }))

  // Fetch invoices
  const { data: invoicesData } = await supabase!
    .from('invoices')
    .select(`
      id,
      invoice_number,
      amount,
      currency,
      status,
      issue_date,
      due_date,
      created_at,
      from_user_id,
      to_user_id,
      from_user:from_user_id(id, full_name, avatar_url),
      to_user:to_user_id(id, full_name, avatar_url)
    `)
    .or(`from_user_id.eq.${currentUser?.id},to_user_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const invoices = invoicesData?.map(i => ({
    ...i,
    from_user: i.from_user && Array.isArray(i.from_user) ? i.from_user[0] : i.from_user,
    to_user: i.to_user && Array.isArray(i.to_user) ? i.to_user[0] : i.to_user,
  }))

  // Calculate totals
  const sentPayments = payments?.filter(p => p.payer_id === currentUser?.id && p.status === 'completed') || []
  const receivedPayments = payments?.filter(p => p.payee_id === currentUser?.id && p.status === 'completed') || []

  const totalSent = sentPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalReceived = receivedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingAmount = (payments?.filter(p => p.status === 'pending') || []).reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <TranslatedText textKey="atsHistory.backToDashboard" className="text-xs font-bold uppercase tracking-widest" />
        </Link>
        <PageHeader titleKey="paymentsPage.title" subtitleKey="paymentsPage.subtitle" className="" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Received */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Total Received</p>
          <div className="text-2xl font-bold text-on-surface mb-1">
            ${totalReceived.toFixed(2)}
          </div>
          <p className="text-on-surface-variant text-xs">
            From {receivedPayments.length} completed payment{receivedPayments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Total Sent */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Total Sent</p>
          <div className="text-2xl font-bold text-on-surface mb-1">
            ${totalSent.toFixed(2)}
          </div>
          <p className="text-on-surface-variant text-xs">
            In {sentPayments.length} completed payment{sentPayments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Pending Payments */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Pending</p>
          <div className="text-2xl font-bold text-warning mb-1">
            ${pendingAmount.toFixed(2)}
          </div>
          <p className="text-on-surface-variant text-xs">
            Awaiting processing
          </p>
        </div>

        {/* Transaction Count */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Transactions</p>
          <div className="text-2xl font-bold text-on-surface mb-1">
            {(payments?.length || 0) + (invoices?.length || 0)}
          </div>
          <p className="text-on-surface-variant text-xs">
            Total activity
          </p>
        </div>
      </div>

      {/* Payments and Invoices Section */}
      <div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Transaction History</h2>
        {!payments || payments.length === 0 ? (
          <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
              account_balance_wallet
            </span>
            <p className="text-on-surface-variant text-lg mb-4">
              No payment history yet
            </p>
            <p className="text-on-surface-variant text-sm">
              Your payments and transactions will appear here.
            </p>
          </div>
        ) : (
          <PaymentHistoryClient
            payments={payments}
            invoices={invoices}
            currentUserId={Number(currentUser?.id)}
          />
        )}
      </div>
    </main>
  )
}
