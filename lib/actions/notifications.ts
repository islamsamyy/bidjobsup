'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

// ─── Form actions (used directly in <form action={...}>) ──────────────────────

export async function markNotificationAsRead(formData: FormData): Promise<void> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return

    const notificationId = formData.get('notificationId')
    if (!notificationId) return

    await auth.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', Number(notificationId))
      .eq('user_id', auth.user?.id)

    revalidatePath('/dashboard', 'layout')
  } catch (err) {
    console.error('[markNotificationAsRead]', err)
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return

    await auth.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', auth.user?.id)
      .is('read_at', null)

    revalidatePath('/dashboard', 'layout')
  } catch (err) {
    console.error('[markAllNotificationsAsRead]', err)
  }
}

// ─── Programmatic helper (called from other actions) ─────────────────────────

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
  try {
    const supabase = await createClient()

    const { error } = await supabase!.from('notifications').insert({
      user_id: userId,
      user_auth_id: userAuthId,
      type,
      title,
      content,
      link: link ?? null,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}
