'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'

export async function saveJob(jobId: number) {
  const auth = await getAuthUser()
  if (!auth.ok) return { error: auth.error }
  const { user, supabase } = auth

  const { error } = await supabase!
    .from('saved_items')
    .insert([{ user_id: user?.id, job_id: jobId }])

  if (error) {
    if (error.code === '23505') return { success: true } // already saved
    return { error: error.message }
  }

  revalidatePath('/dashboard/seeker')
  revalidatePath(`/jobs/${jobId}`)
  return { success: true }
}

export async function unsaveJob(jobId: number) {
  const auth = await getAuthUser()
  if (!auth.ok) return { error: auth.error }
  const { user, supabase } = auth

  const { error } = await supabase!
    .from('saved_items')
    .delete()
    .eq('user_id', user?.id)
    .eq('job_id', jobId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/seeker')
  revalidatePath(`/jobs/${jobId}`)
  return { success: true }
}
