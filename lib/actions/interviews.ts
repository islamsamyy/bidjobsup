'use server'

import { createClient } from '@/lib/supabase/server'

export interface Interview {
  id: number
  job_id: number
  contract_id: number | null
  freelancer_id: number
  employer_id: number
  title: string
  description: string | null
  scheduled_time: string
  duration_minutes: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled'
  meeting_url: string | null
  meeting_platform: string | null
  notes: string | null
  feedback: string | null
  created_at: string
  updated_at: string
  job?: {
    title: string
  }
  freelancer?: {
    full_name: string
    avatar_url: string | null
  }
  employer?: {
    full_name: string
    avatar_url: string | null
  }
}

export interface InterviewNote {
  id: number
  interview_id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
  }
}

/**
 * Get all interviews for the current user
 */
export async function getUserInterviews(
  filterStatus?: string
): Promise<{
  interviews: Interview[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { interviews: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { interviews: [], error: 'Profile not found' }
    }

    let query = supabase
      .from('interviews')
      .select(
        `*,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)`
      )
      .or(`freelancer_id.eq.${profile.id},employer_id.eq.${profile.id}`)

    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query
      .order('scheduled_time', { ascending: true })

    if (error) {
      console.error('Error fetching interviews:', error)
      return { interviews: [], error: error.message }
    }

    return { interviews: data || [] }
  } catch (err: any) {
    console.error('Error in getUserInterviews:', err)
    return { interviews: [], error: err.message }
  }
}

/**
 * Get interview details with notes
 */
export async function getInterviewDetails(
  interviewId: number
): Promise<{
  interview: Interview | null
  notes: InterviewNote[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { interview: null, notes: [], error: 'Not authenticated' }
    }

    // Fetch interview
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select(
        `*,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)`
      )
      .eq('id', interviewId)
      .single()

    if (interviewError || !interview) {
      return { interview: null, notes: [], error: 'Interview not found' }
    }

    // Verify user has access to this interview
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (interview.freelancer_id !== profile.id && interview.employer_id !== profile.id)) {
      return { interview: null, notes: [], error: 'Unauthorized' }
    }

    // Fetch notes
    const { data: notes, error: notesError } = await supabase
      .from('interview_notes')
      .select(`*, user:users(full_name)`)
      .eq('interview_id', interviewId)
      .order('created_at', { ascending: true })

    if (notesError) {
      console.error('Error fetching notes:', notesError)
      return { interview, notes: [], error: notesError.message }
    }

    return { interview, notes: notes || [] }
  } catch (err: any) {
    console.error('Error in getInterviewDetails:', err)
    return { interview: null, notes: [], error: err.message }
  }
}

/**
 * Schedule a new interview
 */
export async function scheduleInterview(
  jobId: number,
  contractId: number | null,
  title: string,
  description: string | null,
  scheduledTime: string,
  durationMinutes: number,
  meetingPlatform?: string,
  meetingUrl?: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Get job to find employer
    const { data: job } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', jobId)
      .single()

    if (!job) {
      return { success: false, error: 'Job not found' }
    }

    // Determine freelancer and employer IDs
    const isEmployer = profile.user_type === 'employer' || profile.user_type === 'both'
    const freelancerId = isEmployer ? null : profile.id
    const employerId = isEmployer ? profile.id : job.employer_id

    const { data, error } = await supabase
      .from('interviews')
      .insert({
        job_id: jobId,
        contract_id: contractId,
        freelancer_id: freelancerId,
        employer_id: employerId,
        title,
        description,
        scheduled_time: scheduledTime,
        duration_minutes: durationMinutes,
        meeting_platform: meetingPlatform || null,
        meeting_url: meetingUrl || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error scheduling interview:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('Error in scheduleInterview:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update interview status
 */
export async function updateInterviewStatus(
  interviewId: number,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: interview } = await supabase
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview) {
      return { success: false, error: 'Interview not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (interview.freelancer_id !== profile.id && interview.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('interviews')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interviewId)

    if (error) {
      console.error('Error updating interview:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateInterviewStatus:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Add note to interview
 */
export async function addInterviewNote(
  interviewId: number,
  content: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Verify access to interview
    const { data: interview } = await supabase
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview || (interview.freelancer_id !== profile.id && interview.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('interview_notes')
      .insert({
        interview_id: interviewId,
        user_id: profile.id,
        content,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error adding note:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('Error in addInterviewNote:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update interview with meeting details
 */
export async function updateInterviewMeeting(
  interviewId: number,
  meetingUrl: string,
  meetingPlatform: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: interview } = await supabase
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview) {
      return { success: false, error: 'Interview not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (interview.freelancer_id !== profile.id && interview.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('interviews')
      .update({
        meeting_url: meetingUrl,
        meeting_platform: meetingPlatform,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interviewId)

    if (error) {
      console.error('Error updating meeting details:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateInterviewMeeting:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Cancel or reschedule interview
 */
export async function rescheduleInterview(
  interviewId: number,
  newScheduledTime: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: interview } = await supabase
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview) {
      return { success: false, error: 'Interview not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (interview.freelancer_id !== profile.id && interview.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('interviews')
      .update({
        scheduled_time: newScheduledTime,
        status: 'rescheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', interviewId)

    if (error) {
      console.error('Error rescheduling interview:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in rescheduleInterview:', err)
    return { success: false, error: err.message }
  }
}
