import { getAuthUser } from '@/lib/auth-utils'
import Link from 'next/link'
import OffersClient from './client'
import { PageHeader } from '../components/PageHeader'
import { TranslatedText } from '../components/TranslatedText'

export const dynamic = 'force-dynamic'

export default async function OffersPage() {
  const { user: currentUser, supabase } = await getAuthUser()

  // Fetch invitations
  const { data: invitationsData } = await supabase!
    .from('invitations')
    .select(`
      id,
      job_id,
      sender_id,
      recipient_id,
      title,
      message,
      proposed_budget,
      proposed_deadline,
      status,
      created_at,
      expires_at,
      sender:sender_id(id, full_name, avatar_url, company_name),
      recipient:recipient_id(id, full_name, avatar_url, email),
      job:job_id(id, title, description)
    `)
    .or(`sender_id.eq.${currentUser?.id},recipient_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const invitations = invitationsData?.map(inv => ({
    ...inv,
    sender: inv.sender && Array.isArray(inv.sender) ? inv.sender[0] : inv.sender,
    recipient: inv.recipient && Array.isArray(inv.recipient) ? inv.recipient[0] : inv.recipient,
    job: inv.job && Array.isArray(inv.job) ? inv.job[0] : inv.job,
  }))

  // Fetch offers
  const { data: offersData } = await supabase!
    .from('offers')
    .select(`
      id,
      job_id,
      from_user_id,
      to_user_id,
      type,
      amount,
      deadline,
      description,
      status,
      created_at,
      expires_at,
      from_user:from_user_id(id, full_name, avatar_url, email),
      to_user:to_user_id(id, full_name, avatar_url, email),
      job:job_id(id, title)
    `)
    .or(`from_user_id.eq.${currentUser?.id},to_user_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const offers = offersData?.map(offer => ({
    ...offer,
    from_user: offer.from_user && Array.isArray(offer.from_user) ? offer.from_user[0] : offer.from_user,
    to_user: offer.to_user && Array.isArray(offer.to_user) ? offer.to_user[0] : offer.to_user,
    job: offer.job && Array.isArray(offer.job) ? offer.job[0] : offer.job,
  }))

  // Count pending
  const pendingInvitations = (invitations || []).filter(i => i.status === 'pending' && i.recipient_id === currentUser?.id)
  const pendingOffers = (offers || []).filter(o => o.status === 'open' && o.to_user_id === currentUser?.id)

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
        <PageHeader titleKey="offersPage.title" subtitleKey="offersPage.subtitle" className="" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Pending Invitations */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Pending Invitations</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {pendingInvitations.length}
          </div>
          <p className="text-on-surface-variant text-xs">
            Awaiting your response
          </p>
        </div>

        {/* Pending Offers */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Open Offers</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {pendingOffers.length}
          </div>
          <p className="text-on-surface-variant text-xs">
            Waiting for response
          </p>
        </div>

        {/* Total Invitations & Offers */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Total Activity</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {(invitations?.length || 0) + (offers?.length || 0)}
          </div>
          <p className="text-on-surface-variant text-xs">
            Invitations and offers
          </p>
        </div>
      </div>

      {/* Content */}
      {!invitations || !offers || (invitations.length === 0 && offers.length === 0) ? (
        <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
            mail
          </span>
          <p className="text-on-surface-variant text-lg mb-4">
            No invitations or offers yet
          </p>
          <p className="text-on-surface-variant text-sm">
            When you receive job invitations or offers, they will appear here.
          </p>
        </div>
      ) : (
        <OffersClient
          invitations={invitations || []}
          offers={offers || []}
          currentUserId={Number(currentUser?.id)}
        />
      )}
    </main>
  )
}
