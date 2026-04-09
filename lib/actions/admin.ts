'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Get admin dashboard metrics
 */
export async function getAdminMetrics(): Promise<{
  totalUsers: number
  totalJobs: number
  totalDisputes: number
  totalReports: number
  flaggedJobs: number
  pendingReports: number
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, error: 'Unauthorized' }
    }

    // Get metrics
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: totalJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true })
    const { count: totalDisputes } = await supabase.from('disputes').select('*', { count: 'exact', head: true })
    const { count: totalReports } = await supabase.from('reports').select('*', { count: 'exact', head: true })
    const { count: flaggedJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('flagged', true)
    const { count: pendingReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open')

    return {
      totalUsers: totalUsers || 0,
      totalJobs: totalJobs || 0,
      totalDisputes: totalDisputes || 0,
      totalReports: totalReports || 0,
      flaggedJobs: flaggedJobs || 0,
      pendingReports: pendingReports || 0,
    }
  } catch (err: any) {
    console.error('Error in getAdminMetrics:', err)
    return { totalUsers: 0, totalJobs: 0, totalDisputes: 0, totalReports: 0, flaggedJobs: 0, pendingReports: 0, error: err.message }
  }
}

/**
 * Get all reports
 */
export async function getAllReports(status?: string): Promise<{
  reports: any[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { reports: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { reports: [], error: 'Unauthorized' }
    }

    let query = supabase.from('reports').select('*, reported_by_user:reported_by(full_name, avatar_url)')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(100)

    if (error) {
      console.error('Error fetching reports:', error)
      return { reports: [], error: error.message }
    }

    return { reports: data || [] }
  } catch (err: any) {
    console.error('Error in getAllReports:', err)
    return { reports: [], error: err.message }
  }
}

/**
 * Update report status
 */
export async function updateReportStatus(reportId: number, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reportId)

    if (error) {
      console.error('Error updating report:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/reports')
    return { success: true }
  } catch (err: any) {
    console.error('Error in updateReportStatus:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Flag or unflag a job
 */
export async function flagJob(jobId: number, flagged: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('jobs')
      .update({ flagged, updated_at: new Date().toISOString() })
      .eq('id', jobId)

    if (error) {
      console.error('Error flagging job:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/jobs')
    return { success: true }
  } catch (err: any) {
    console.error('Error in flagJob:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update job moderation status
 */
export async function updateJobModeration(jobId: number, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('jobs')
      .update({ moderation_status: status, updated_at: new Date().toISOString() })
      .eq('id', jobId)

    if (error) {
      console.error('Error updating job moderation:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/jobs')
    return { success: true }
  } catch (err: any) {
    console.error('Error in updateJobModeration:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Get all jobs for moderation
 */
export async function getAllJobsForModeration(status?: string): Promise<{
  jobs: any[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { jobs: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { jobs: [], error: 'Unauthorized' }
    }

    let query = supabase.from('jobs').select('*, employer:employer_id(full_name, avatar_url)')

    if (status) {
      query = query.eq('moderation_status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(100)

    if (error) {
      console.error('Error fetching jobs:', error)
      return { jobs: [], error: error.message }
    }

    return { jobs: data || [] }
  } catch (err: any) {
    console.error('Error in getAllJobsForModeration:', err)
    return { jobs: [], error: err.message }
  }
}
