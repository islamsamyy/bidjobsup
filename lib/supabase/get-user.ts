import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: number
  auth_id: string
  full_name: string | null
  avatar_url: string | null
  user_type: 'employer' | 'jobseeker' | 'both'
  role: 'user' | 'admin'
}

// Discriminated union — TypeScript narrows correctly after `if (auth.error)` guard
export type AuthResult =
  | { 
      ok: true; 
      user: UserProfile; 
      authUser: User; 
      supabase: Awaited<ReturnType<typeof createClient>> 
    }
  | { ok: false; error: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Single call to get both the authenticated Supabase session and the
 * internal `users` row. Replaces the 3-step boilerplate in every action.
 *
 * Usage:
 *   const auth = await getAuthUser()
 *   if (!auth.ok) return { error: auth.error }
 *   const { user, supabase } = auth
 */
export async function getAuthUser(): Promise<AuthResult> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return { ok: false, error: 'Unauthorized' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, auth_id, full_name, avatar_url, user_type, role, notification_prefs, privacy_settings')
    .eq('auth_id', authUser.id)
    .single()

  if (profileError || !profile) {
    return { ok: false, error: 'User profile not found' }
  }

  return { ok: true, user: profile as UserProfile, authUser, supabase }
}

/**
 * Same as getAuthUser but enforces a required user_type.
 */
export async function getAuthUserAs(
  requiredType: 'employer' | 'jobseeker'
): Promise<AuthResult> {
  const result = await getAuthUser()
  if (!result.ok) return result

  const { user } = result
  const allowed = user?.user_type === requiredType || user?.user_type === 'both'

  if (!allowed) {
    return { ok: false, error: `Access denied. Required role: ${requiredType}` }
  }

  return result
}
