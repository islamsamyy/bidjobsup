'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveJob(jobId: number) {
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
    .from('saved_items')
    .insert([
      {
        user_id: userRecord.id,
        job_id: jobId
      }
    ])

  if (error) {
    if (error.code === '23505') { // unique violation
      return { success: true } // already saved
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/seeker')
  revalidatePath(`/jobs/${jobId}`)

  return { success: true }
}

export async function unsaveJob(jobId: number) {
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
    .from('saved_items')
    .delete()
    .eq('user_id', userRecord.id)
    .eq('job_id', jobId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/seeker')
  revalidatePath(`/jobs/${jobId}`)

  return { success: true }
}
