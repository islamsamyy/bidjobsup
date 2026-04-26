import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export type UserProfile = {
  id: string
  auth_id: string
  full_name: string | null
  avatar_url: string | null
  user_type: 'employer' | 'jobseeker' | 'both'
  role: 'user' | 'admin'
  notification_prefs: any
  privacy_settings: any
  [key: string]: any
}

/**
 * @deprecated Use getAuthUser() from '@/lib/supabase/get-user' in server actions.
 * Use requireAuth() from '@/lib/supabase/require-auth' for future refactors.
 *
 * Core authentication logic that returns a result object instead of redirecting.
 * Useful for server actions or logic that needs to handle unauthorized states gracefully.
 */
export async function tryGetAuth() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return { ok: false, error: 'Unauthorized' as const }
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single()

  if (profileError || !profile) {
    return { ok: false, error: 'User profile not found' as const, authUser, supabase }
  }

  return { 
    ok: true as const, 
    user: authUser, 
    profile: profile as UserProfile, 
    supabase 
  }
}

/**
 * Server-side utility to get the authenticated user and their profile?.
 * Redirects to sign-in if not authenticated, or to join if no profile exists.
 * Recommended for use in Server Components (Pages/Layouts).
 */
export async function getAuthUser() {
  const result = await tryGetAuth()
  
  if (!result.ok) {
    if (result.error === 'Unauthorized') {
      redirect('/sign-in')
    } else {
      // Profile not found - they signed up but didn't finish onboarding
      redirect('/join')
    }
  }

  return {
    user: result.user,       // Supabase auth user
    profile: result.profile, // Database profile row
    supabase: result.supabase,
  }
}

/**
 * Server-side utility to get the current authenticated user and their profile,
 * ensuring they match a specific user type.
 * Redirects to /sign-in if not authenticated.
 * Redirects to /dashboard if type doesn't match.
 */
export async function getAuthUserAs(requiredType: 'employer' | 'jobseeker') {
  const result = await getAuthUser()
  const { profile } = result

  const isAllowed = 
    profile?.user_type === requiredType || 
    profile?.user_type === 'both'

  if (!isAllowed) {
    redirect('/dashboard')
  }

  return result
}
