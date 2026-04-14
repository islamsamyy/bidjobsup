'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface Contract {
  id: number
  amount: number
  currency: string
  paid_amount: number
  status: string
  freelancer?: { id: number; full_name: string; avatar_url?: string; email?: string }
  job?: { id: number; title: string }
}

interface Escrow {
  id: number
  amount: number
  currency: string
  status: string
  release_date?: string
  released_at?: string
}

interface Milestone {
  id: number
  title: string
  amount: number
  status: string
  due_date?: string
  completed_date?: string
  submission_notes?: string
}

interface Payment {
  id: number
  amount: number
  status: string
  payment_method: string
  created_at: string
  completed_at?: string
}

interface PaymentReleaseClientProps {
  contract: Contract
  escrow?: Escrow | null
  milestones: Milestone[]
  payments: Payment[]
  currentUserId: number
}

export default function PaymentReleaseClient({
  contract,
  escrow,
  milestones,
  payments,
  currentUserId,
}: PaymentReleaseClientProps) {
  const { t, dir } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'payment-history' | 'release'>('overview')
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [releaseAmount, setReleaseAmount] = useState('')

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'paid':
      case 'released':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      case 'pending':
      case 'open':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
      case 'in_progress':
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
      case 'failed':
      case 'declined':
        return 'bg-red-500/10 text-red-300 border-red-500/30'
      case 'refunded':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      default:
        return 'bg-outline-variant/10 text-on-surface border-outline-variant/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'released':
        return 'check_circle'
      case 'pending':
      case 'open':
        return 'schedule'
      case 'in_progress':
      case 'processing':
        return 'hourglass_bottom'
      case 'failed':
      case 'declined':
        return 'cancel'
      case 'refunded':
        return 'undo'
      default:
        return 'info'
    }
  }

  const remainingAmount = contract.amount - contract.paid_amount
  const progressPercentage = (contract.paid_amount / contract.amount) * 100

  return (
    <div dir={dir} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/20 overflow-x-auto">
        {[
          { value: 'overview', label: 'Overview' },
          { value: 'milestones', label: 'Milestones' },
          { value: 'payment-history', label: 'Payment History' },
          { value: 'release', label: 'Release Payment' },
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Payment Progress */}
          <div className="glass border border-outline-variant/15 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-on-surface mb-6">Payment Progress</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-on-surface-variant text-sm">Total Amount</p>
                  <p className="text-on-surface font-semibold">${contract.amount.toFixed(2)}</p>
                </div>
                <div className="w-full h-3 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">Paid</p>
                  <p className="text-2xl font-bold text-emerald-400">${contract.paid_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">Remaining</p>
                  <p className="text-2xl font-bold text-yellow-400">${remainingAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Status */}
          {escrow && (
            <div className="glass border border-outline-variant/15 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-on-surface mb-6">Escrow Status</h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-on-surface-variant text-sm mb-2">Locked Amount</p>
                    <p className="text-3xl font-bold text-on-surface">${escrow.amount.toFixed(2)}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(escrow.status)}`}>
                    {escrow.status.toUpperCase()}
                  </span>
                </div>

                {escrow.release_date && (
                  <div className="border-t border-outline-variant/10 pt-4">
                    <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
                      Scheduled Release
                    </p>
                    <p className="text-on-surface font-semibold">{formatDate(escrow.release_date)}</p>
                  </div>
                )}

                {escrow.status === 'locked' && remainingAmount > 0 && (
                  <button
                    onClick={() => setShowReleaseModal(true)}
                    className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity mt-4"
                  >
                    Release Payment
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Freelancer Info */}
          <div className="glass border border-outline-variant/15 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-on-surface mb-6">Freelancer Information</h3>

            <div className="flex items-start gap-6">
              {contract.freelancer?.avatar_url ? (
                <img
                  src={contract.freelancer.avatar_url}
                  alt={contract.freelancer.full_name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-2xl">
                    {contract.freelancer?.full_name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <p className="text-xl font-semibold text-on-surface mb-1">{contract.freelancer?.full_name}</p>
                <p className="text-on-surface-variant text-sm mb-4">{contract.freelancer?.email}</p>
                <a
                  href={`/talent/${contract.freelancer?.id}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-semibold uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
              <p className="text-on-surface-variant">No milestones defined for this contract.</p>
            </div>
          ) : (
            milestones.map(milestone => (
              <div key={milestone.id} className="glass border border-outline-variant/15 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-on-surface mb-2">{milestone.title}</h4>
                    <p className="text-on-surface-variant text-sm">{milestone.submission_notes}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(milestone.status)}`}>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/10">
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
                      Amount
                    </p>
                    <p className="text-on-surface font-bold">${milestone.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
                      Due Date
                    </p>
                    <p className="text-on-surface font-semibold">{formatDate(milestone.due_date)}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
                      Completed
                    </p>
                    <p className="text-on-surface font-semibold">{formatDate(milestone.completed_date)}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
                      Action
                    </p>
                    {milestone.status === 'submitted' && (
                      <button className="bg-primary text-on-primary px-3 py-2 rounded text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'payment-history' && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
              <p className="text-on-surface-variant">No payments recorded yet.</p>
            </div>
          ) : (
            payments.map(payment => (
              <div key={payment.id} className="glass border border-outline-variant/15 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(payment.status)}`}>
                      <span className="material-symbols-outlined">{getStatusIcon(payment.status)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">${payment.amount.toFixed(2)}</p>
                      <p className="text-on-surface-variant text-sm">{payment.payment_method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-sm">{formatDate(payment.created_at)}</p>
                    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold border mt-2 ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Release Payment Tab */}
      {activeTab === 'release' && (
        <div className="space-y-6">
          {remainingAmount > 0 ? (
            <div className="glass border border-outline-variant/15 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-on-surface mb-6">Release Payment to Freelancer</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-4">
                    Available to Release
                  </p>
                  <p className="text-4xl font-bold text-primary mb-4">${remainingAmount.toFixed(2)}</p>

                  <button
                    onClick={() => setShowReleaseModal(true)}
                    className="bg-primary text-on-primary px-8 py-4 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined inline-block mr-2 align-middle">
                      send
                    </span>
                    Release Full Payment
                  </button>
                </div>

                <div className="border-t border-outline-variant/10 pt-6">
                  <h4 className="font-semibold text-on-surface mb-4">Or Release by Milestone</h4>
                  <div className="space-y-3">
                    {milestones
                      .filter(m => m.status !== 'paid')
                      .map(milestone => (
                        <div key={milestone.id} className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                          <div>
                            <p className="font-semibold text-on-surface">{milestone.title}</p>
                            <p className="text-on-surface-variant text-sm">${milestone.amount.toFixed(2)}</p>
                          </div>
                          <button className="bg-secondary text-on-secondary px-4 py-2 rounded font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
                            Release
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-emerald-400 block mb-4">
                check_circle
              </span>
              <p className="text-on-surface text-lg font-semibold mb-2">All Payments Released</p>
              <p className="text-on-surface-variant">
                The full contract amount has been paid to the freelancer.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass border border-outline-variant/15 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-on-surface mb-6">Release Payment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                  Amount to Release
                </label>
                <input
                  type="number"
                  value={releaseAmount}
                  onChange={e => setReleaseAmount(e.target.value)}
                  placeholder={remainingAmount.toFixed(2)}
                  max={remainingAmount}
                  className="input-inset w-full"
                />
                <p className="text-on-surface-variant text-xs mt-2">
                  Maximum: ${remainingAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-on-surface-variant text-sm mb-2">Release to:</p>
                <p className="text-on-surface font-semibold">{contract.freelancer?.full_name}</p>
                <p className="text-on-surface-variant text-sm">{contract.freelancer?.email}</p>
              </div>

              <div className="border-t border-outline-variant/10 pt-4 space-y-3">
                <button className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
                  Confirm Release
                </button>
                <button
                  onClick={() => setShowReleaseModal(false)}
                  className="w-full bg-surface-container hover:bg-surface-bright text-on-surface px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
