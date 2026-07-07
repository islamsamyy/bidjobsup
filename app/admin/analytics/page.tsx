'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAdminAnalytics, getAdminMetrics } from '@/lib/actions/admin'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminAnalytics(), getAdminMetrics()]).then(([a, m]) => {
      setAnalytics(a)
      setMetrics(m)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">hourglass_top</span>
      </div>
    )
  }

  const maxUserCount = Math.max(...(analytics?.usersByMonth?.map((d: any) => d.count) || [1]), 1)
  const maxJobCount = Math.max(...(analytics?.jobsByMonth?.map((d: any) => d.count) || [1]), 1)

  const userTypeTotal = (analytics?.userTypeBreakdown?.employer || 0) + (analytics?.userTypeBreakdown?.jobseeker || 0) + (analytics?.userTypeBreakdown?.both || 0)
  const disputeTotal = (analytics?.disputeBreakdown?.open || 0) + (analytics?.disputeBreakdown?.investigating || 0) + (analytics?.disputeBreakdown?.resolved || 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Platform Analytics</h1>
          <p className="text-on-surface-variant">Real-time data across all platform activity</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
          Back to Admin
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: metrics?.totalUsers ?? 0, icon: 'group', color: 'text-primary' },
          { label: 'Total Jobs', value: metrics?.totalJobs ?? 0, icon: 'work', color: 'text-secondary' },
          { label: 'Total Contracts', value: metrics?.totalContracts ?? 0, icon: 'handshake', color: 'text-green-400' },
          { label: 'Open Disputes', value: analytics?.disputeBreakdown?.open ?? 0, icon: 'gavel', color: 'text-yellow-400' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`material-symbols-outlined ${kpi.color} text-2xl`}>{kpi.icon}</span>
              <span className="text-xs font-bold uppercase text-on-surface-variant">{kpi.label}</span>
            </div>
            <div className="text-3xl font-black text-on-surface">{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Growth Chart */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-6 tracking-widest">User Growth (6 Months)</h3>
          {analytics?.usersByMonth?.length > 0 ? (
            <div className="flex items-end gap-2 h-32">
              {analytics.usersByMonth.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold">{d.count}</span>
                  <div
                    className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                    style={{ height: `${Math.max((d.count / maxUserCount) * 100, 4)}%` }}
                    title={`${d.month}: ${d.count} users`}
                  />
                  <span className="text-[9px] text-on-surface-variant">{d.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-on-surface-variant text-sm">No data yet</div>
          )}
        </div>

        {/* Job Growth Chart */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-6 tracking-widest">Job Postings (6 Months)</h3>
          {analytics?.jobsByMonth?.length > 0 ? (
            <div className="flex items-end gap-2 h-32">
              {analytics.jobsByMonth.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold">{d.count}</span>
                  <div
                    className="w-full bg-secondary/80 rounded-t-sm transition-all hover:bg-secondary"
                    style={{ height: `${Math.max((d.count / maxJobCount) * 100, 4)}%` }}
                    title={`${d.month}: ${d.count} jobs`}
                  />
                  <span className="text-[9px] text-on-surface-variant">{d.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-on-surface-variant text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* User Type Breakdown */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-5 tracking-widest">User Types</h3>
          <div className="space-y-3">
            {[
              { label: 'Job Seekers', count: analytics?.userTypeBreakdown?.jobseeker || 0, color: 'bg-green-500' },
              { label: 'Employers', count: analytics?.userTypeBreakdown?.employer || 0, color: 'bg-blue-500' },
              { label: 'Both', count: analytics?.userTypeBreakdown?.both || 0, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className="font-bold text-on-surface">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${userTypeTotal > 0 ? (item.count / userTypeTotal) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Breakdown */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-5 tracking-widest">Dispute Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Open', count: analytics?.disputeBreakdown?.open || 0, color: 'bg-red-500' },
              { label: 'Investigating', count: analytics?.disputeBreakdown?.investigating || 0, color: 'bg-yellow-500' },
              { label: 'Resolved', count: analytics?.disputeBreakdown?.resolved || 0, color: 'bg-green-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className="font-bold text-on-surface">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${disputeTotal > 0 ? (item.count / disputeTotal) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Job Categories */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-5 tracking-widest">Top Job Categories</h3>
          <div className="space-y-2">
            {analytics?.topCategories?.length > 0 ? (
              analytics.topCategories.map((cat: any, i: number) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-on-surface-variant w-4">{i + 1}</span>
                    <span className="text-sm text-on-surface truncate max-w-[120px]">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-secondary">{cat.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">No category data</p>
            )}
          </div>
        </div>
      </div>

      {/* Platform Health Summary */}
      <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
        <h3 className="text-sm font-bold uppercase text-on-surface-variant mb-5 tracking-widest">Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-black text-green-400 mb-1">{metrics?.totalUsers ?? 0}</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-widest">Registered Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary mb-1">{metrics?.totalJobs ?? 0}</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-widest">Total Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-yellow-400 mb-1">{metrics?.flaggedJobs ?? 0}</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-widest">Flagged Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-red-400 mb-1">{metrics?.pendingReports ?? 0}</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-widest">Open Reports</div>
          </div>
        </div>
      </div>
    </div>
  )
}
