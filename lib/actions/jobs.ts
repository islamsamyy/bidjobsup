'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser, getAuthUserAs } from '@/lib/supabase/get-user'
import { createNotification } from '@/lib/actions/notifications'
import { toActionError } from '@/lib/errors'

export async function inviteToJob(jobId: number | string, seekerId: number) {
  try {
    const auth = await getAuthUserAs('employer')
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const [jobRes, seekerRes] = await Promise.all([
      supabase.from('jobs').select('title, employer_id').eq('id', Number(jobId)).single(),
      supabase.from('users').select('id, auth_id, full_name').eq('id', seekerId).single(),
    ])

    if (jobRes.error || !jobRes.data) return { error: 'Job not found.' }
    if (seekerRes.error || !seekerRes.data) return { error: 'Seeker not found.' }
    if (jobRes.data.employer_id !== user?.id) return { error: 'You do not own this job.' }

    const { error } = await createNotification({
      userId: seekerRes.data.id,
      userAuthId: seekerRes.data.auth_id,
      type: 'invitation',
      title: 'Job Invitation',
      content: `${user?.full_name || 'An employer'} invited you to apply for "${jobRes.data.title}"`,
      link: `/dashboard/seeker/search?jobId=${jobId}`,
    })

    if (error) return { error: 'Failed to send invitation.' }
    return { success: true }
  } catch (err) {
    return toActionError(err)
  }
}

export async function editJob(jobId: string | number, updates: Record<string, unknown>) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { data, error } = await supabase!
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .eq('employer_id', user?.id)
      .select()
      .single()

    if (error) return { error: error.message }

    revalidatePath('/dashboard/employer')
    revalidatePath(`/dashboard/employer/listings/${jobId}`)
    revalidatePath(`/jobs/${jobId}`)

    return { success: true, job: data }
  } catch (err) {
    return toActionError(err)
  }
}

export const closeJob = async (jobId: string) => editJob(jobId, { status: 'closed' })

export async function deleteJob(jobId: string | number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('employer_id', user?.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/employer')
    revalidatePath('/dashboard/employer/listings')
    revalidatePath(`/jobs/${jobId}`)

    return { success: true }
  } catch (err) {
    return toActionError(err)
  }
}
