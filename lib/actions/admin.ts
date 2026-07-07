'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'

// ─── Auth Guard ───────────────────────────────────────────────────────────────

async function adminAuth() {
  const auth = await getAuthUser()
  if (!auth.ok) return auth
  if (auth.user?.role !== 'admin') return { ok: false, error: 'Unauthorized' } as const
  return auth
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export async function getAdminMetrics() {
  const auth = await adminAuth()
  if (!auth.ok) return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, totalContracts: 0, totalRevenue: 0, error: auth.error }

  const { supabase } = auth

  try {
    const [
      { count: totalUsers },
      { count: totalJobs },
      { count: totalDisputes },
      { count: totalReports },
      { count: flaggedJobs },
      { count: pendingReports },
      { count: totalContracts },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('disputes').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('flagged', true),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('contracts').select('*', { count: 'exact', head: true }),
    ])

    return {
      totalUsers: totalUsers || 0,
      totalJobs: totalJobs || 0,
      totalDisputes: totalDisputes || 0,
      totalReports: totalReports || 0,
      flaggedJobs: flaggedJobs || 0,
      pendingReports: pendingReports || 0,
      totalContracts: totalContracts || 0,
    }
  } catch (err: any) {
    return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, totalContracts: 0, error: err.message }
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAdminAnalytics() {
  const auth = await adminAuth()
  if (!auth.ok) return { error: auth.error }

  const { supabase } = auth

  try {
    // User growth: last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [
      { data: recentUsers },
      { data: recentJobs },
      { data: recentContracts },
      { data: usersByType },
      { data: disputeStats },
      { data: jobsByCategory },
    ] = await Promise.all([
      supabase.from('users').select('created_at').gte('created_at', sixMonthsAgo.toISOString()).order('created_at'),
      supabase.from('jobs').select('created_at, status').gte('created_at', sixMonthsAgo.toISOString()).order('created_at'),
      supabase.from('contracts').select('created_at, status, total_amount').gte('created_at', sixMonthsAgo.toISOString()).order('created_at'),
      supabase.from('users').select('user_type'),
      supabase.from('disputes').select('status'),
      supabase.from('jobs').select('category'),
    ])

    // Aggregate users by month
    const usersByMonth: Record<string, number> = {}
    recentUsers?.forEach(u => {
      const month = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      usersByMonth[month] = (usersByMonth[month] || 0) + 1
    })

    // Aggregate jobs by month
    const jobsByMonth: Record<string, number> = {}
    recentJobs?.forEach(j => {
      const month = new Date(j.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      jobsByMonth[month] = (jobsByMonth[month] || 0) + 1
    })

    // User type breakdown
    const typeCount = { employer: 0, jobseeker: 0, both: 0 }
    usersByType?.forEach(u => {
      if (u.user_type === 'employer') typeCount.employer++
      else if (u.user_type === 'jobseeker') typeCount.jobseeker++
      else if (u.user_type === 'both') typeCount.both++
    })

    // Dispute status breakdown
    const disputeCount = { open: 0, investigating: 0, resolved: 0 }
    disputeStats?.forEach(d => {
      if (d.status === 'open') disputeCount.open++
      else if (d.status === 'investigating' || d.status === 'mediation') disputeCount.investigating++
      else if (d.status === 'resolved') disputeCount.resolved++
    })

    // Jobs by category
    const categoryCount: Record<string, number> = {}
    jobsByCategory?.forEach(j => {
      if (j.category) categoryCount[j.category] = (categoryCount[j.category] || 0) + 1
    })
    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    // Revenue from contracts
    const totalRevenue = recentContracts?.reduce((sum, c) => sum + (c.total_amount || 0), 0) || 0
    const activeContracts = recentContracts?.filter(c => c.status === 'active').length || 0

    return {
      usersByMonth: Object.entries(usersByMonth).map(([month, count]) => ({ month, count })),
      jobsByMonth: Object.entries(jobsByMonth).map(([month, count]) => ({ month, count })),
      userTypeBreakdown: typeCount,
      disputeBreakdown: disputeCount,
      topCategories,
      totalRevenue,
      activeContracts,
    }
  } catch (err: any) {
    return { error: err.message }
  }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getAllReports(status?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { reports: [], error: auth.error }

  let query = auth.supabase
    .from('reports')
    .select('*, reported_by_user:reported_by(full_name, avatar_url)')

  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
  return { reports: data || [], error: error?.message }
}

export async function updateReportStatus(reportId: number, status: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('reports')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reportId)

  if (!error) revalidatePath('/admin/reports')
  return { success: !error, error: error?.message }
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function flagJob(jobId: number, flagged: boolean) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('jobs')
    .update({ flagged, updated_at: new Date().toISOString() })
    .eq('id', jobId)

  if (!error) revalidatePath('/admin/jobs')
  return { success: !error, error: error?.message }
}

export async function updateJobModeration(jobId: number, status: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('jobs')
    .update({ moderation_status: status, updated_at: new Date().toISOString() })
    .eq('id', jobId)

  if (!error) revalidatePath('/admin/jobs')
  return { success: !error, error: error?.message }
}

export async function deleteJob(jobId: number) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (!error) revalidatePath('/admin/jobs')
  return { success: !error, error: error?.message }
}

export async function getAllJobsForModeration(status?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { jobs: [], error: auth.error }

  let query = auth.supabase
    .from('jobs')
    .select('*, employer:employer_id(full_name, avatar_url)')

  if (status) query = query.eq('moderation_status', status)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
  return { jobs: data || [], error: error?.message }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers(filter?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { users: [], error: auth.error }

  let query = auth.supabase
    .from('users')
    .select('id, auth_id, full_name, email, role, user_type, avatar_url, is_verified, is_suspended, created_at, updated_at')

  if (filter === 'admin') query = query.eq('role', 'admin')
  else if (filter === 'employer') query = query.eq('user_type', 'employer')
  else if (filter === 'seeker') query = query.eq('user_type', 'jobseeker')
  else if (filter === 'suspended') query = query.eq('is_suspended', true)
  else if (filter === 'verified') query = query.eq('is_verified', true)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(200)
  return { users: data || [], error: error?.message }
}

export async function updateUserRole(userId: number, newRole: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('users')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (!error) revalidatePath('/admin/users')
  return { success: !error, error: error?.message }
}

export async function suspendUser(userId: number, suspended: boolean) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('users')
    .update({ is_suspended: suspended, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (!error) revalidatePath('/admin/users')
  return { success: !error, error: error?.message }
}

export async function verifyUser(userId: number, verified: boolean) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('users')
    .update({ is_verified: verified, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (!error) revalidatePath('/admin/users')
  return { success: !error, error: error?.message }
}

export async function deleteUser(userId: number) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (!error) revalidatePath('/admin/users')
  return { success: !error, error: error?.message }
}

// ─── Disputes ─────────────────────────────────────────────────────────────────

export async function getAllDisputes(status?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { disputes: [], error: auth.error }

  let query = auth.supabase
    .from('disputes')
    .select('*, contract:contract_id(id, title), initiator:initiator_id(full_name, avatar_url)')

  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
  return { disputes: data || [], error: error?.message }
}

export async function updateDisputeStatus(disputeId: number, status: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('disputes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', disputeId)

  if (!error) revalidatePath('/admin/disputes')
  return { success: !error, error: error?.message }
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export async function getAllContracts(status?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { contracts: [], error: auth.error }

  let query = auth.supabase
    .from('contracts')
    .select('*, employer:employer_id(full_name, avatar_url), seeker:seeker_id(full_name, avatar_url)')

  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
  return { contracts: data || [], error: error?.message }
}

export async function forceCloseContract(contractId: number) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('contracts')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', contractId)

  if (!error) revalidatePath('/admin/contracts')
  return { success: !error, error: error?.message }
}

export async function updateContractStatus(contractId: number, status: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('contracts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', contractId)

  if (!error) revalidatePath('/admin/contracts')
  return { success: !error, error: error?.message }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getAllReviews() {
  const auth = await adminAuth()
  if (!auth.ok) return { reviews: [], error: auth.error }

  const { data, error } = await auth.supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url), reviewee:reviewee_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return { reviews: data || [], error: error?.message }
}

export async function deleteReview(reviewId: number) {
  const auth = await adminAuth()
  if (!auth.ok) return { success: false, error: auth.error }

  const { error } = await auth.supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (!error) revalidatePath('/admin/reviews')
  return { success: !error, error: error?.message }
}
