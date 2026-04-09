import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAdminMetrics } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const metrics = await getAdminMetrics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">Admin Dashboard</h1>
        <p className="text-on-surface-variant">Platform management and moderation tools</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">group</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">{metrics.totalUsers}</div>
        </div>

        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-secondary text-2xl">work</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Total Jobs</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">{metrics.totalJobs}</div>
        </div>

        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-tertiary text-2xl">warning</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Flagged Jobs</span>
          </div>
          <div className="text-3xl font-bold text-orange-500">{metrics.flaggedJobs}</div>
        </div>

        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-red-500 text-2xl">report</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Open Reports</span>
          </div>
          <div className="text-3xl font-bold text-red-500">{metrics.pendingReports}</div>
        </div>

        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-yellow-500 text-2xl">gavel</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Active Disputes</span>
          </div>
          <div className="text-3xl font-bold text-yellow-500">{metrics.totalDisputes}</div>
        </div>

        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-blue-500 text-2xl">report_problem</span>
            <span className="text-xs font-bold uppercase text-on-surface-variant">Total Reports</span>
          </div>
          <div className="text-3xl font-bold text-blue-500">{metrics.totalReports}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/reports"
          className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/30 transition-all group"
        >
          <span className="material-symbols-outlined text-primary text-3xl mb-4 block group-hover:scale-110 transition-transform">report</span>
          <h3 className="text-sm font-bold text-on-surface mb-1">Manage Reports</h3>
          <p className="text-xs text-on-surface-variant">Review user reports and incidents</p>
        </Link>

        <Link
          href="/admin/jobs"
          className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-secondary/30 transition-all group"
        >
          <span className="material-symbols-outlined text-secondary text-3xl mb-4 block group-hover:scale-110 transition-transform">fact_check</span>
          <h3 className="text-sm font-bold text-on-surface mb-1">Moderate Jobs</h3>
          <p className="text-xs text-on-surface-variant">Approve/reject job listings</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-tertiary/30 transition-all group"
        >
          <span className="material-symbols-outlined text-tertiary text-3xl mb-4 block group-hover:scale-110 transition-transform">person_search</span>
          <h3 className="text-sm font-bold text-on-surface mb-1">Manage Users</h3>
          <p className="text-xs text-on-surface-variant">View and manage user accounts</p>
        </Link>

        <Link
          href="/admin/disputes"
          className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-yellow-500/30 transition-all group"
        >
          <span className="material-symbols-outlined text-yellow-500 text-3xl mb-4 block group-hover:scale-110 transition-transform">gavel</span>
          <h3 className="text-sm font-bold text-on-surface mb-1">Review Disputes</h3>
          <p className="text-xs text-on-surface-variant">Mediate job conflicts</p>
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
        <h3 className="text-xl font-bold text-on-surface mb-4">Platform Health</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">User Engagement</span>
            <div className="w-32 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Content Quality</span>
            <div className="w-32 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-blue-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Dispute Rate</span>
            <div className="w-32 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-yellow-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
