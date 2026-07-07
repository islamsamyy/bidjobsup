'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllContracts, updateContractStatus, forceCloseContract } from '@/lib/actions/admin'

interface Contract {
  id: number
  title?: string
  status: string
  total_amount?: number
  escrow_balance?: number
  created_at: string
  employer?: { full_name: string; avatar_url: string | null }
  seeker?: { full_name: string; avatar_url: string | null }
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  disputed: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [confirmClose, setConfirmClose] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    const result = await getAllContracts(filterStatus === 'all' ? undefined : filterStatus)
    setContracts(result.contracts || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filterStatus])

  const handleStatusChange = async (contractId: number, newStatus: string) => {
    const result = await updateContractStatus(contractId, newStatus)
    if (result.success) setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status: newStatus } : c))
  }

  const handleForceClose = async (contractId: number) => {
    const result = await forceCloseContract(contractId)
    if (result.success) {
      setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status: 'cancelled' } : c))
      setConfirmClose(null)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formatAmount = (n?: number) => n ? `SAR ${n.toLocaleString()}` : '—'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Contracts Oversight</h1>
          <p className="text-on-surface-variant">View and manage all platform contracts</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
          Back to Admin
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: contracts.length, color: 'text-on-surface' },
          { label: 'Active', count: contracts.filter(c => c.status === 'active').length, color: 'text-green-400' },
          { label: 'Disputed', count: contracts.filter(c => c.status === 'disputed').length, color: 'text-orange-400' },
          { label: 'Completed', count: contracts.filter(c => c.status === 'completed').length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-5">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">{s.label}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'pending', 'completed', 'disputed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === s ? 'bg-primary text-on-primary-container' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-primary text-4xl">hourglass_top</span></div>
      ) : contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map(contract => (
            <div key={contract.id} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold text-on-surface">{contract.title || `Contract #${contract.id}`}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${STATUS_STYLES[contract.status] || STATUS_STYLES.pending}`}>
                      {contract.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-on-surface-variant mb-1">Employer</p>
                      <p className="font-bold text-on-surface">{contract.employer?.full_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Seeker</p>
                      <p className="font-bold text-on-surface">{contract.seeker?.full_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Total Value</p>
                      <p className="font-bold text-green-400">{formatAmount(contract.total_amount)}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Escrow</p>
                      <p className="font-bold text-secondary">{formatAmount(contract.escrow_balance)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-2">Created: {formatDate(contract.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5 flex-wrap">
                {contract.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(contract.id, 'completed')}
                    className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Mark Complete
                  </button>
                )}
                {contract.status !== 'cancelled' && contract.status !== 'completed' && (
                  confirmClose === contract.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400 font-bold">Are you sure?</span>
                      <button onClick={() => handleForceClose(contract.id)} className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmClose(null)} className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold transition-all">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClose(contract.id)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ml-auto"
                    >
                      Force Close
                    </button>
                  )
                )}
                <Link
                  href={`/dashboard/contracts/${contract.id}`}
                  className="px-3 py-1.5 bg-surface-container-high border border-white/5 text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">handshake</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Contracts Found</h3>
          <p className="text-on-surface-variant">No contracts match the selected filter.</p>
        </div>
      )}
    </div>
  )
}
