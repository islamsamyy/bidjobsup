'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function adminAuth() {
  const auth = await getAuthUser()
  if (!auth.ok) return auth
  if (auth.user?.role !== 'admin') return { ok: false, error: 'Unauthorized' } as const
  return auth
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Get admin dashboard metrics
 */
export async function getAdminMetrics() {
  const auth = await adminAuth()
  if (!auth.ok) return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, error: auth.error }

  const { supabase } = auth

  try {
    const [
      { count: totalUsers },
      { count: totalJobs },
      { count: totalDisputes },
      { count: totalReports },
      { count: flaggedJobs },
      { count: pendingReports },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('disputes').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('flagged', true),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ])

    return {
      totalUsers: totalUsers || 0,
      totalJobs: totalJobs || 0,
      totalDisputes: totalDisputes || 0,
      totalReports: totalReports || 0,
      flaggedJobs: flaggedJobs || 0,
      pendingReports: pendingReports || 0,
    }
  } catch (err: any) {
    return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, error: err.message }
  }
}

/**
 * Get all reports
 */
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

/**
 * Update report status
 */
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

/**
 * Flag or unflag a job
 */
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

/**
 * Update job moderation status
 */
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

/**
 * Get all jobs for moderation
 */
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

/**
 * Get all users for management
 */
export async function getAllUsers(role?: string) {
  const auth = await adminAuth()
  if (!auth.ok) return { users: [], error: auth.error }

  let query = auth.supabase
    .from('users')
    .select('id, full_name, email, role, avatar_url, is_verified, created_at, updated_at')

  if (role) query = query.eq('role', role)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
  return { users: data || [], error: error?.message }
}

/**
 * Update user role
 */
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

/**
 * Get all disputes for management
 */
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

/**
 * Update dispute status
 */
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
