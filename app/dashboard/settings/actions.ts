'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ── Change Password ───────────────────────────────────────────────────────────
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { success: true }
}

// ── Change Email ──────────────────────────────────────────────────────────────
export async function changeEmail(newEmail: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  if (!newEmail || !newEmail.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) return { error: error.message }

  return { success: true, message: 'Verification email sent to your new address.' }
}

// ── Update Notification Preferences ──────────────────────────────────────────
export async function updateNotificationPrefs(prefs: {
  email_new_bid: boolean
  email_bid_status: boolean
  email_new_message: boolean
  email_weekly_digest: boolean
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('users')
    .update({ notification_prefs: prefs })
    .eq('auth_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ── Update Privacy Settings ───────────────────────────────────────────────────
export async function updatePrivacySettings(settings: {
  profile_visible: boolean
  show_hourly_rate: boolean
  show_location: boolean
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('users')
    .update({ privacy_settings: settings })
    .eq('auth_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ── Delete Account ────────────────────────────────────────────────────────────
export async function deleteAccount(confirmText: string) {
  if (confirmText !== 'DELETE') {
    return { error: 'Please type DELETE to confirm.' }
  }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  // Delete user record from users table
  await supabase.from('users').delete().eq('auth_id', user.id)

  // Sign out
  await supabase.auth.signOut()

  redirect('/')
}
