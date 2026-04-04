'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be signed in to update your profile.' }
  }

  // 1. Get internal user ID
  const { data: userRecord, error: userRecordError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (userRecordError || !userRecord) {
    return { error: 'Failed to resolve identity protocol.' }
  }

  // 2. Update Comprehensive User Info
  const { error: userError } = await supabase
    .from('users')
    .update({
      full_name: data.full_name,
      username: data.username,
      bio: data.bio,
      avatar_url: data.avatar_url,
      location: data.location,
      portfolio_url: data.portfolio_url,
      hourly_rate: data.hourly_rate,
      experience_level: data.experience_level,
      company_name: data.company_name,
      industry: data.industry,
      skills: data.skills,
      updated_at: new Date().toISOString()
    })
    .eq('id', userRecord.id)

  if (userError) {
    console.error('Update Users error:', userError)
    return { error: 'Failed to protocol core identity.' }
  }

  revalidatePath('/dashboard/seeker/profile')
  revalidatePath('/dashboard/employer/profile')
  revalidatePath('/dashboard/seeker')
  revalidatePath('/dashboard/employer')
  
  return { success: true }
}
