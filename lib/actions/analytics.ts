'use server'

import { createClient } from '@/lib/supabase/server'
import { toActionError } from '@/lib/errors'

export interface AnalyticsData {
  activeJobs: number
  totalApplications: number
  hiredCount: number
  totalJobsPosted: number
  averageRating: number | null
  successRate: number
  earnings: number
  applicationsOverTime: Array<{ date: string; count: number }>
  topSkills: Array<{ skill: string; count: number }>
  jobsByCategory: Array<{ category: string; count: number }>
  applicationStatus: {
    accepted: number
    rejected: number
    pending: number
  }
}

/**
 * Get analytics data for employer dashboard
 */
export async function getEmployerAnalytics(): Promise<{
  data: AnalyticsData | null
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { data: null, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (profile.user_type !== 'employer' && profile.user_type !== 'both')) {
      return { data: null, error: 'Not an employer' }
    }

    // Get active jobs
    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('employer_id', profile.id)
      .eq('status', 'open')

    // Get total applications
    const { count: totalApplications } = await supabase
      .from('bids')
      .select('*, jobs!inner()', { count: 'exact', head: true })
      .eq('jobs.employer_id', profile.id)

    // Get hired count
    const { count: hiredCount } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('employer_id', profile.id)
      .eq('status', 'active')

    // Get total jobs posted
    const { count: totalJobsPosted } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('employer_id', profile.id)

    // Get jobs by category
    const { data: jobsByCategory } = await supabase
      .from('jobs')
      .select('category')
      .eq('employer_id', profile.id)

    const categoryCount: Record<string, number> = {}
    jobsByCategory?.forEach((job: any) => {
      const cat = job.category || 'Other'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const jobsByCategoryFormatted = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get application status breakdown
    const { data: allBids } = await supabase
      .from('bids')
      .select('status, jobs!inner(id)')
      .eq('jobs.employer_id', profile.id)

    const applicationStatus = {
      accepted: allBids?.filter((b: any) => b.status === 'accepted').length || 0,
      rejected: allBids?.filter((b: any) => b.status === 'rejected').length || 0,
      pending: allBids?.filter((b: any) => b.status === 'pending').length || 0,
    }

    // Get applications over time (last 7 days)
    const last7Days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last7Days[dateStr] = 0
    }

    const { data: recentBids } = await supabase
      .from('bids')
      .select('created_at, jobs!inner(id)')
      .eq('jobs.employer_id', profile.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    recentBids?.forEach((bid: any) => {
      const dateStr = bid.created_at.split('T')[0]
      if (dateStr in last7Days) {
        last7Days[dateStr]++
      }
    })

    const applicationsOverTime = Object.entries(last7Days)
      .map(([date, count]) => ({ date, count }))

    return {
      data: {
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0,
        hiredCount: hiredCount || 0,
        totalJobsPosted: totalJobsPosted || 0,
        averageRating: null,
        successRate: totalApplications ? Math.round(((applicationStatus.accepted / totalApplications) * 100)) : 0,
        earnings: 0,
        applicationsOverTime,
        topSkills: [],
        jobsByCategory: jobsByCategoryFormatted,
        applicationStatus,
      },
    }
  } catch (err) {
    console.error('Error in getEmployerAnalytics:', err)
    return toActionError(err) as any
  }
}

/**
 * Get analytics data for freelancer/seeker dashboard
 */
export async function getSeekerAnalytics(): Promise<{
  data: AnalyticsData | null
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { data: null, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id, hourly_rate')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { data: null, error: 'Profile not found' }
    }

    // Get total applications submitted
    const { count: totalApplications } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('bidder_id', profile.id)

    // Get accepted applications
    const { count: acceptedCount } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('bidder_id', profile.id)
      .eq('status', 'accepted')

    // Get average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', profile.id)

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : null

    // Get active contracts
    const { count: activeContracts } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('freelancer_id', profile.id)
      .eq('status', 'active')

    // Get applications by category
    const { data: applicationsData } = await supabase
      .from('bids')
      .select('jobs!inner(category)')
      .eq('bidder_id', profile.id)

    const categoryCount: Record<string, number> = {}
    applicationsData?.forEach((bid: any) => {
      const cat = bid.jobs?.category || 'Other'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const jobsByCategory = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get bid status breakdown
    const { data: allBids } = await supabase
      .from('bids')
      .select('status')
      .eq('bidder_id', profile.id)

    const applicationStatus = {
      accepted: allBids?.filter((b: any) => b.status === 'accepted').length || 0,
      rejected: allBids?.filter((b: any) => b.status === 'rejected').length || 0,
      pending: allBids?.filter((b: any) => b.status === 'pending').length || 0,
    }

    // Get applications over time (last 7 days)
    const last7Days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last7Days[dateStr] = 0
    }

    const { data: recentBids } = await supabase
      .from('bids')
      .select('created_at')
      .eq('bidder_id', profile.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    recentBids?.forEach((bid: any) => {
      const dateStr = bid.created_at.split('T')[0]
      if (dateStr in last7Days) {
        last7Days[dateStr]++
      }
    })

    const applicationsOverTime = Object.entries(last7Days)
      .map(([date, count]) => ({ date, count }))

    return {
      data: {
        activeJobs: activeContracts || 0,
        totalApplications: totalApplications || 0,
        hiredCount: acceptedCount || 0,
        totalJobsPosted: 0,
        averageRating,
        successRate: totalApplications ? Math.round(((acceptedCount || 0) / totalApplications) * 100) : 0,
        earnings: 0,
        applicationsOverTime,
        topSkills: [],
        jobsByCategory,
        applicationStatus,
      },
    }
  } catch (err: any) {
    console.error('Error in getSeekerAnalytics:', err)
    return { data: null, error: err.message }
  }
}
