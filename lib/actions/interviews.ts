'use server'

import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  job?: { title: string }
  freelancer?: { full_name: string; avatar_url: string | null }
  employer?: { full_name: string; avatar_url: string | null }
}

export interface InterviewNote {
  id: number
  interview_id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
  user?: { full_name: string }
}

// ─── Internal helper ──────────────────────────────────────────────────────────

const INTERVIEW_SELECT = `
  *,
  job:job_id(title),
  freelancer:freelancer_id(full_name, avatar_url),
  employer:employer_id(full_name, avatar_url)
` as const

function isInterviewParticipant(
  interview: Pick<Interview, 'freelancer_id' | 'employer_id'>,
  userId: number
) {
  return interview.freelancer_id === userId || interview.employer_id === userId
}

/** Generic update for the current authenticated participant. */
async function updateInterview(
  interviewId: number,
  updates: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: interview } = await supabase!
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview) return { success: false, error: 'Interview not found' }
    if (!isInterviewParticipant(interview, user?.id)) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase!
      .from('interviews')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', interviewId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getUserInterviews(filterStatus?: string): Promise<{
  interviews: Interview[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { interviews: [], error: auth.error }
    const { user, supabase } = auth

    let query = supabase
      .from('interviews')
      .select(INTERVIEW_SELECT)
      .or(`freelancer_id.eq.${user?.id},employer_id.eq.${user?.id}`)

    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, error } = await query.order('scheduled_time', { ascending: true })

    if (error) return { interviews: [], error: error.message }
    return { interviews: (data as Interview[]) || [] }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function getInterviewDetails(interviewId: number): Promise<{
  interview: Interview | null
  notes: InterviewNote[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { interview: null, notes: [], error: auth.error }
    const { user, supabase } = auth

    const { data: interview, error: interviewError } = await supabase!
      .from('interviews')
      .select(INTERVIEW_SELECT)
      .eq('id', interviewId)
      .single()

    if (interviewError || !interview) return { interview: null, notes: [], error: 'Interview not found' }
    if (!isInterviewParticipant(interview, user?.id)) return { interview: null, notes: [], error: 'Unauthorized' }

    const { data: notes } = await supabase!
      .from('interview_notes')
      .select('*, user:users(full_name)')
      .eq('interview_id', interviewId)
      .order('created_at', { ascending: true })

    return { interview: interview as Interview, notes: (notes as InterviewNote[]) || [] }
  } catch (err) {
    return toActionError(err) as any
  }
}

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
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: job } = await supabase!.from('jobs').select('employer_id').eq('id', jobId).single()
    if (!job) return { success: false, error: 'Job not found' }

    const isEmployer = user?.user_type === 'employer' || user?.user_type === 'both'
    const employerId = isEmployer ? user?.id : job.employer_id
    let freelancerId: number | null = isEmployer ? null : user?.id

    // When an employer schedules, resolve the freelancer from the contract
    if (isEmployer && contractId) {
      const { data: contract } = await supabase!
        .from('contracts')
        .select('freelancer_id')
        .eq('id', contractId)
        .single()
      freelancerId = contract?.freelancer_id ?? null
    }
    if (isEmployer && !freelancerId) {
      return { success: false, error: 'Cannot schedule interview: no freelancer identified for this job.' }
    }

    const { data, error } = await supabase!
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
        meeting_platform: meetingPlatform ?? null,
        meeting_url: meetingUrl ?? null,
      })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, id: data.id }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function updateInterviewStatus(interviewId: number, status: string) {
  return updateInterview(interviewId, { status })
}

export async function updateInterviewMeeting(
  interviewId: number,
  meetingUrl: string,
  meetingPlatform: string
) {
  return updateInterview(interviewId, { meeting_url: meetingUrl, meeting_platform: meetingPlatform })
}

export async function rescheduleInterview(interviewId: number, newScheduledTime: string) {
  return updateInterview(interviewId, { scheduled_time: newScheduledTime, status: 'rescheduled' })
}

export async function addInterviewNote(
  interviewId: number,
  content: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: interview } = await supabase!
      .from('interviews')
      .select('freelancer_id, employer_id')
      .eq('id', interviewId)
      .single()

    if (!interview || !isInterviewParticipant(interview, user?.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase!
      .from('interview_notes')
      .insert({ interview_id: interviewId, user_id: user?.id, content })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, id: data.id }
  } catch (err) {
    return toActionError(err) as any
  }
}
