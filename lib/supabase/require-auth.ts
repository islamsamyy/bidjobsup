import { getAuthUser, getAuthUserAs, type UserProfile } from '@/lib/supabase/get-user'
import { AuthError, ForbiddenError } from '@/lib/errors'

export async function requireAuth(): Promise<UserProfile & { _supabase: any }> {
  const result = await getAuthUser()
  if (!result.ok) throw new AuthError(result.error)
  return { ...result.user, _supabase: result.supabase }
}

export async function requireAuthAs(type: 'employer' | 'jobseeker'): Promise<UserProfile & { _supabase: any }> {
  const result = await getAuthUserAs(type)
  if (!result.ok) throw new ForbiddenError(result.error)
  return { ...result.user, _supabase: result.supabase }
}
