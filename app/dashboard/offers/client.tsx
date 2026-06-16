'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'
import { acceptInvitation, declineInvitation, acceptOffer, declineOffer } from '@/lib/actions/offers'

interface Invitation {
  id: number
  job_id: number
  sender_id: number
  recipient_id: number
  title?: string
  message?: string
  proposed_budget?: number
  proposed_deadline?: string
  status: string
  created_at: string
  expires_at?: string
  sender?: { id: number; full_name: string; avatar_url?: string; company_name?: string; email?: string }
  recipient?: { id: number; full_name: string; avatar_url?: string; email?: string; company_name?: string }
  job?: { id: number; title: string; description?: string }
}

interface Offer {
  id: number
  job_id: number
  from_user_id: number
  to_user_id: number
  type: string
  amount: number
  deadline?: string
  description?: string
  status: string
  created_at: string
  expires_at?: string
  from_user?: { id: number; full_name: string; avatar_url?: string; email?: string }
  to_user?: { id: number; full_name: string; avatar_url?: string; email?: string }
  job?: { id: number; title: string }
}

interface OffersClientProps {
  invitations: Invitation[]
  offers: Offer[]
  currentUserId: number
}

export default function OffersClient({
  invitations: initialInvitations,
  offers: initialOffers,
  currentUserId,
}: OffersClientProps) {
  const { t, dir } = useLanguage()
  const [activeTab, setActiveTab] = useState<'all' | 'invitations' | 'offers' | 'sent'>('all')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'open':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      case 'declined':
      case 'rejected':
        return 'bg-red-500/10 text-red-300 border-red-500/30'
      case 'withdrawn':
      case 'expired':
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30'
      default:
        return 'bg-outline-variant/10 text-on-surface border-outline-variant/30'
    }
  }

  const handleInvitationAction = async (id: number, action: 'accept' | 'decline') => {
    setLoadingId(`inv-${id}-${action}`)
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: action === 'accept' ? 'accepted' : 'declined' } : i))
    const result = action === 'accept' ? await acceptInvitation(id) : await declineInvitation(id)
    if (!result.success) {
      // revert on error
      setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: 'pending' } : i))
    }
    setLoadingId(null)
  }

  const handleOfferAction = async (id: number, action: 'accept' | 'decline') => {
    setLoadingId(`offer-${id}-${action}`)
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: action === 'accept' ? 'accepted' : 'declined' } : o))
    const result = action === 'accept' ? await acceptOffer(id) : await declineOffer(id)
    if (!result.success) {
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'open' } : o))
    }
    setLoadingId(null)
  }

  // Filter items based on tab
  let filteredItems: (Invitation | Offer)[] = []

  if (activeTab === 'invitations') {
    filteredItems = invitations
  } else if (activeTab === 'offers') {
    filteredItems = offers
  } else if (activeTab === 'sent') {
    filteredItems = [
      ...invitations.filter(i => i.sender_id === currentUserId),
      ...offers.filter(o => o.from_user_id === currentUserId),
    ]
  } else {
    filteredItems = [...invitations, ...offers]
  }

  // Apply status filter
  if (filterStatus) {
    filteredItems = filteredItems.filter(item => item.status === filterStatus)
  }

  // Sort by date
  filteredItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })

  const isInvitation = (item: any): item is Invitation => {
    return 'sender_id' in item && 'recipient_id' in item && !('amount' in item)
  }

  return (
    <div dir={dir} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/20 overflow-x-auto">
        {[
          { value: 'all', label: 'All' },
          { value: 'invitations', label: 'Invitations Received' },
          { value: 'offers', label: 'Offers Received' },
          { value: 'sent', label: 'Sent' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`px-4 py-3 text-sm uppercase tracking-widest font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Filter</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
              filterStatus === null
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container hover:bg-surface-bright text-on-surface'
            }`}
          >
            All
          </button>
          {['pending', 'open', 'accepted', 'declined', 'withdrawn'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container hover:bg-surface-bright text-on-surface'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          if (isInvitation(item)) {
            const isReceived = item.recipient_id === currentUserId
            const otherParty = isReceived ? item.sender : item.recipient
            return (
              <div
                key={`invitation-${item.id}`}
                className="glass border border-outline-variant/15 rounded-xl p-6 hover:border-outline-variant/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and Info */}
                  <div className="flex gap-4 flex-1">
                    {otherParty?.avatar_url ? (
                      <img
                        src={otherParty.avatar_url}
                        alt={otherParty.full_name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xl">
                          {otherParty?.full_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold text-on-surface text-lg">
                            {isReceived ? 'Invitation from' : 'Invitation to'} {otherParty?.full_name}
                          </p>
                          {otherParty?.company_name && (
                            <p className="text-on-surface-variant text-sm">{otherParty.company_name}</p>
                          )}
                          <p className="text-on-surface-variant text-sm mt-1">
                            For job: {item.job?.title}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>

                      {item.message && (
                        <p className="text-on-surface text-sm mb-4 leading-relaxed">
                          {item.message}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {item.proposed_budget && (
                          <div>
                            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Budget</p>
                            <p className="text-on-surface font-semibold">${item.proposed_budget.toFixed(2)}</p>
                          </div>
                        )}
                        {item.proposed_deadline && (
                          <div>
                            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Deadline</p>
                            <p className="text-on-surface font-semibold">{formatDate(item.proposed_deadline)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Sent</p>
                          <p className="text-on-surface font-semibold">{formatDate(item.created_at)}</p>
                        </div>
                      </div>

                      {isReceived && item.status === 'pending' && (
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => handleInvitationAction(item.id, 'accept')}
                            disabled={!!loadingId}
                            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                          >
                            {loadingId === `inv-${item.id}-accept` && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Accept
                          </button>
                          <button
                            onClick={() => handleInvitationAction(item.id, 'decline')}
                            disabled={!!loadingId}
                            className="bg-surface-container hover:bg-error/10 text-on-surface hover:text-error px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {loadingId === `inv-${item.id}-decline` && <span className="w-3 h-3 border-2 border-error/30 border-t-error rounded-full animate-spin" />}
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          } else {
            const isReceived = item.to_user_id === currentUserId
            const otherParty = isReceived ? item.from_user : item.to_user
            return (
              <div
                key={`offer-${item.id}`}
                className="glass border border-outline-variant/15 rounded-xl p-6 hover:border-outline-variant/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and Info */}
                  <div className="flex gap-4 flex-1">
                    {otherParty?.avatar_url ? (
                      <img
                        src={otherParty.avatar_url}
                        alt={otherParty.full_name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xl">
                          {otherParty?.full_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold text-on-surface text-lg">
                            {isReceived ? 'Offer from' : 'Offer to'} {otherParty?.full_name}
                          </p>
                          <p className="text-on-surface-variant text-sm mt-1">
                            For job: {item.job?.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(item.status)}`}>
                            {item.status.toUpperCase()}
                          </span>
                          <p className="text-2xl font-bold text-on-surface mt-2">
                            ${item.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-on-surface text-sm mb-4 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {item.deadline && (
                          <div>
                            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Deadline</p>
                            <p className="text-on-surface font-semibold">{formatDate(item.deadline)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Sent</p>
                          <p className="text-on-surface font-semibold">{formatDate(item.created_at)}</p>
                        </div>
                      </div>

                      {isReceived && item.status === 'open' && (
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => handleOfferAction(item.id, 'accept')}
                            disabled={!!loadingId}
                            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                          >
                            {loadingId === `offer-${item.id}-accept` && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Accept
                          </button>
                          <button
                            onClick={() => handleOfferAction(item.id, 'decline')}
                            disabled={!!loadingId}
                            className="bg-surface-container hover:bg-error/10 text-on-surface hover:text-error px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {loadingId === `offer-${item.id}-decline` && <span className="w-3 h-3 border-2 border-error/30 border-t-error rounded-full animate-spin" />}
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
          <p className="text-on-surface-variant">
            {filterStatus ? 'No items found with the selected filter.' : 'No invitations or offers in this category.'}
          </p>
        </div>
      )}
    </div>
  )
}
