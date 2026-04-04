'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/actions/notifications'

export async function inviteToJob(jobId: number | string, seekerId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  // 1. Get employer internal ID
  const { data: employer } = await supabase
    .from('users')
    .select('id, full_name, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!employer || (employer.user_type !== 'employer' && employer.user_type !== 'both')) {
    return { error: 'Only employers can initiate invitations.' }
  }

  // 2. Fetch the job and the seeker information
  const [jobRes, seekerRes] = await Promise.all([
    supabase.from('jobs').select('title, employer_id').eq('id', Number(jobId)).single(),
    supabase.from('users').select('id, auth_id, full_name').eq('id', seekerId).single()
  ])

  if (jobRes.error || !jobRes.data) return { error: 'Job not found.' }
  if (seekerRes.error || !seekerRes.data) return { error: 'Seeker not found.' }

  if (jobRes.data.employer_id !== employer.id) {
    return { error: 'You are not the owner of this project.' }
  }

  // 3. Create notification for seeker
  const { error: notifError } = await createNotification({
    userId: seekerRes.data.id,
    userAuthId: seekerRes.data.auth_id,
    type: 'invitation',
    title: 'High-Level Recruitment Invite',
    content: `${employer.full_name || 'An employer'} has invited you to apply for "${jobRes.data.title}"`,
    link: `/dashboard/seeker/search?jobId=${jobId}` // Link to the job
  })

  if (notifError) return { error: 'Failed to transmit invitation.' }

  return { success: true }
}

export async function editJob(jobId: string | number, updates: any) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  const { data: userRecord } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!userRecord) return { error: 'User profile not found' }

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .eq('employer_id', userRecord.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/employer')
  revalidatePath(`/dashboard/employer/listings/${jobId}`)
  revalidatePath(`/jobs/${jobId}`)

  return { success: true, job: data }
}

export async function closeJob(jobId: string) {
  return editJob(jobId, { status: 'closed' })
}

export async function deleteJob(jobId: string | number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  const { data: userRecord } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!userRecord) return { error: 'User profile not found' }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('employer_id', userRecord.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/employer')
  revalidatePath('/dashboard/employer/listings')
  revalidatePath(`/jobs/${jobId}`)

  return { success: true }
}
