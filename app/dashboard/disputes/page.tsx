'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserDisputes } from '@/lib/actions/disputes'

interface Dispute {
  id: number
  title: string
  reason: string
  status: string
  created_at: string
  initiated_by: number
  against_user: number
  initiator?: {
    full_name: string
    avatar_url: string | null
  }
  defendant?: {
    full_name: string
    avatar_url: string | null
  }
  job?: {
    title: string
  }
}

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: 'mail' },
  in_review: { label: 'In Review', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30', icon: 'assignment' },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: 'check_circle' },
  escalated: { label: 'Escalated', color: 'bg-red-500/20 text-red-600 border-red-500/30', icon: 'warning' },
  closed: { label: 'Closed', color: 'bg-gray-500/20 text-gray-600 border-gray-500/30', icon: 'done' },
}

const REASON_LABELS = {
  quality_issue: 'Quality Issue',
  missed_deadline: 'Missed Deadline',
  non_payment: 'Non-Payment',
  scope_change: 'Scope Change',
  communication: 'Communication',
  other: 'Other',
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const loadDisputes = async () => {
      try {
        const stored = localStorage.getItem('currentUser')
        if (stored) {
          const user = JSON.parse(stored)
          setCurrentUserId(user.id)

          const result = await getUserDisputes(
            filterStatus === 'all' ? undefined : filterStatus
          )
          if (!result.error) {
            setDisputes(result.disputes)
          }
        }
      } catch (err) {
        console.error('Error loading disputes:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDisputes()
  }, [filterStatus])

  const statusOptions = ['all', 'open', 'in_review', 'resolved', 'escalated', 'closed']

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          hourglass_top
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Dispute Resolution</h1>
        <p className="text-on-surface-variant">
          Manage disputes and conflicts related to your jobs and contracts
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === status
                ? 'bg-primary text-on-primary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {status === 'all' ? 'All Disputes' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
          </button>
        ))}
      </div>

      {/* Disputes List */}
      {disputes.length > 0 ? (
        <div className="space-y-4">
          {disputes.map((dispute) => {
            const otherParty = dispute.initiated_by === currentUserId ? dispute.defendant : dispute.initiator
            const isInitiator = dispute.initiated_by === currentUserId
            const statusConfig = STATUS_CONFIG[dispute.status as keyof typeof STATUS_CONFIG]
            const reasonLabel = REASON_LABELS[dispute.reason as keyof typeof REASON_LABELS] || dispute.reason

            return (
              <Link
                href={`/dashboard/disputes/${dispute.id}`}
                key={dispute.id}
                className="block bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-on-surface">{dispute.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                          statusConfig?.color
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {statusConfig?.icon}
                        </span>
                        {statusConfig?.label || dispute.status}
                      </span>
                    </div>

                    <p className="text-sm text-on-surface-variant mb-4">
                      Job: {dispute.job?.title || 'Unknown Job'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">Reason</p>
                        <p className="font-bold text-on-surface text-sm">{reasonLabel}</p>
                      </div>

                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">
                          {isInitiator ? 'Against' : 'From'}
                        </p>
                        <div className="flex items-center gap-2">
                          {otherParty?.avatar_url && (
                            <img
                              src={otherParty.avatar_url}
                              alt={otherParty.full_name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <p className="font-bold text-on-surface text-sm">
                            {otherParty?.full_name || 'Unknown User'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">Created</p>
                        <p className="font-bold text-on-surface text-sm">
                          {formatDate(dispute.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            peace
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Disputes</h3>
          <p className="text-on-surface-variant mb-6">
            {filterStatus === 'all'
              ? 'You have no active disputes. Great work keeping things smooth!'
              : 'No disputes found in this status'}
          </p>
          <Link
            href="/dashboard/contracts"
            className="inline-block px-6 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            View Contracts
          </Link>
        </div>
      )}
    </div>
  )
}
