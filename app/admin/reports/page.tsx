'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllReports, updateReportStatus } from '@/lib/actions/admin'

interface Report {
  id: number
  reported_by: number
  reported_type: string
  reported_id: number
  reason: string
  description: string
  status: string
  created_at: string
  reported_by_user?: {
    full_name: string
    avatar_url: string | null
  }
}

const REASON_LABELS: Record<string, string> = {
  'quality_issue': 'Quality Issue',
  'missed_deadline': 'Missed Deadline',
  'non_payment': 'Non-Payment',
  'scope_change': 'Scope Change',
  'communication': 'Communication',
  'harassment': 'Harassment',
  'illegal_content': 'Illegal Content',
  'spam': 'Spam',
  'other': 'Other',
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('open')

  useEffect(() => {
    const loadReports = async () => {
      const result = await getAllReports(filterStatus === 'all' ? undefined : filterStatus)
      setReports(result.reports || [])
      setLoading(false)
    }
    loadReports()
  }, [filterStatus])

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    const result = await updateReportStatus(reportId, newStatus)
    if (result.success) {
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
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
          <h1 className="text-3xl font-bold text-on-surface mb-2">Manage Reports</h1>
          <p className="text-on-surface-variant">Review and resolve user reports</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Back to Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'open', 'investigating', 'resolved', 'dismissed'].map(status => (
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

      {/* Reports List */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-on-surface">
                      {REASON_LABELS[report.reason] || report.reason}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                        report.status === 'open'
                          ? 'bg-red-500/20 text-red-600 border-red-500/30'
                          : report.status === 'investigating'
                          ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
                          : report.status === 'resolved'
                          ? 'bg-green-500/20 text-green-600 border-green-500/30'
                          : 'bg-gray-500/20 text-gray-600 border-gray-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {report.status === 'open'
                          ? 'mail'
                          : report.status === 'investigating'
                          ? 'assignment'
                          : report.status === 'resolved'
                          ? 'check_circle'
                          : 'done'}
                      </span>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-3">{report.reason}</p>

                  {report.description && (
                    <p className="text-sm text-on-surface mb-3 p-3 bg-surface-container-lowest rounded-lg border border-white/5">
                      {report.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-on-surface-variant mb-1">Reported By</p>
                      <p className="font-bold text-on-surface">{report.reported_by_user?.full_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Type</p>
                      <p className="font-bold text-on-surface capitalize">{report.reported_type}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Item ID</p>
                      <p className="font-bold text-on-surface">{report.reported_id}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Date</p>
                      <p className="font-bold text-on-surface">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {report.status === 'open' && (
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleStatusChange(report.id, 'investigating')}
                    className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'dismissed')}
                    className="px-4 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:bg-gray-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {report.status === 'investigating' && (
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleStatusChange(report.id, 'resolved')}
                    className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'open')}
                    className="px-4 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:bg-gray-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Reopen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            inbox_zero
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Reports Found</h3>
          <p className="text-on-surface-variant">Great! No pending reports to review.</p>
        </div>
      )}
    </div>
  )
}
