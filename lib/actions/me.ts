'use server'

import { getAuthUser } from '@/lib/supabase/get-user'

export async function getCurrentUser(): Promise<{ id: number; user_type: string; role: string } | null> {
  const auth = await getAuthUser()
  if (!auth.ok) return null
  const { user } = auth
  return { id: user.id, user_type: user.user_type, role: user.role }
}
