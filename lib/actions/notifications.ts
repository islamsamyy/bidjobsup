'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Internal helpers
async function getUserInternalId(supabase: Awaited<ReturnType<typeof createClient>>, authId: string) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single()
  return data?.id ?? null
}

// Form action — used in <form action={markNotificationAsRead}>
export async function markNotificationAsRead(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const notificationId = formData.get('notificationId')
  if (!notificationId) return

  const userId = await getUserInternalId(supabase, user.id)
  if (!userId) return

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', Number(notificationId))
    .eq('user_id', userId)

  revalidatePath('/dashboard', 'layout')
}

// Form action — used in <form action={markAllNotificationsAsRead}>
export async function markAllNotificationsAsRead(): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const userId = await getUserInternalId(supabase, user.id)
  if (!userId) return

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)

  revalidatePath('/dashboard', 'layout')
}

// Programmatic helper (for use in server components / other actions)
export async function createNotification({
  userId,
  userAuthId,
  type,
  title,
  content,
  link,
}: {
  userId: number
  userAuthId: string
  type: string
  title: string
  content: string
  link?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      user_auth_id: userAuthId,
      type,
      title,
      content,
      link: link ?? null,
    })

  if (error) {
    console.error('Error creating notification:', error)
    return { error: error.message }
  }

  return { success: true }
}
