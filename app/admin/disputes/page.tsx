'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllDisputes, updateDisputeStatus } from '@/lib/actions/admin'

interface Dispute {
  id: number
  reason: string
  description: string
  status: string
  created_at: string
  contract?: {
    id: number
    title: string
  }
  initiator?: {
    full_name: string
    avatar_url: string | null
  }
}

export default function ManageDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('open')

  useEffect(() => {
    const loadDisputes = async () => {
      const result = await getAllDisputes(filterStatus === 'all' ? undefined : filterStatus)
      setDisputes(result.disputes || [])
      setLoading(false)
    }
    loadDisputes()
  }, [filterStatus])

  const handleStatusChange = async (disputeId: number, newStatus: string) => {
    const result = await updateDisputeStatus(disputeId, newStatus)
    if (result.success) {
      setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: newStatus } : d))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Manage Disputes</h1>
          <p className="text-on-surface-variant">Mediate and resolve job conflicts</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Back to Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'investigating', 'mediation', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === status
                ? 'bg-primary text-on-primary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Disputes List */}
      {disputes.length > 0 ? (
        <div className="space-y-4">
          {disputes.map(dispute => (
            <div
              key={dispute.id}
              className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-on-surface">
                      Contract: {dispute.contract?.title || `#${dispute.id}`}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                        dispute.status === 'open'
                          ? 'bg-red-500/20 text-red-600 border-red-500/30'
                          : dispute.status === 'investigating'
                          ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
                          : dispute.status === 'mediation'
                          ? 'bg-orange-500/20 text-orange-600 border-orange-500/30'
                          : 'bg-green-500/20 text-green-600 border-green-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {dispute.status === 'open'
                          ? 'error'
                          : dispute.status === 'investigating'
                          ? 'assignment'
                          : dispute.status === 'mediation'
                          ? 'handshake'
                          : 'check_circle'}
                      </span>
                      {dispute.status}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-2"><strong>Reason:</strong> {dispute.reason}</p>

                  {dispute.description && (
                    <p className="text-sm text-on-surface mb-3 p-3 bg-surface-container-lowest rounded-lg border border-white/5">
                      {dispute.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-on-surface-variant mb-1">Initiated By</p>
                      <p className="font-bold text-on-surface">{dispute.initiator?.full_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Contract ID</p>
                      <p className="font-bold text-on-surface">{dispute.contract?.id}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Dispute ID</p>
                      <p className="font-bold text-on-surface">{dispute.id}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Date Created</p>
                      <p className="font-bold text-on-surface">{formatDate(dispute.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5 flex-wrap">
                {dispute.status === 'open' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(dispute.id, 'investigating')}
                      className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Investigate
                    </button>
                    <button
                      onClick={() => handleStatusChange(dispute.id, 'mediation')}
                      className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Mediate
                    </button>
                  </>
                )}
                {(dispute.status === 'investigating' || dispute.status === 'mediation') && (
                  <>
                    <button
                      onClick={() => handleStatusChange(dispute.id, 'resolved')}
                      className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleStatusChange(dispute.id, 'open')}
                      className="px-4 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:bg-gray-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Reopen
                    </button>
                  </>
                )}
                <Link
                  href={`/dashboard/disputes/${dispute.id}`}
                  className="px-4 py-2 bg-surface-container-high border border-white/5 text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all ml-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            gavel
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Disputes Found</h3>
          <p className="text-on-surface-variant">No active disputes to resolve at this time.</p>
        </div>
      )}

      {/* Stats */}
      {disputes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Total Disputes</div>
            <div className="text-2xl font-bold text-on-surface">{disputes.length}</div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Open</div>
            <div className="text-2xl font-bold text-red-400">{disputes.filter(d => d.status === 'open').length}</div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">In Progress</div>
            <div className="text-2xl font-bold text-yellow-400">
              {disputes.filter(d => d.status === 'investigating' || d.status === 'mediation').length}
            </div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Resolved</div>
            <div className="text-2xl font-bold text-green-400">{disputes.filter(d => d.status === 'resolved').length}</div>
          </div>
        </div>
      )}
    </div>
  )
}
