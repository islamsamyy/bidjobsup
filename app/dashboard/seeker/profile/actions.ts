'use server'

import { tryGetAuth } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const auth = await tryGetAuth()
  if (!auth.ok) return { error: auth.error }
  const { profile, supabase } = auth

  // Update Comprehensive User Info
  const { error: userError } = await supabase!
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
    .eq('id', profile?.id)

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

