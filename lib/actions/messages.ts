'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

export async function sendMessage(recipientId: number, content: string) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data, error } = await supabase!
      .from('messages')
      .insert({
        sender_id: user?.id,
        recipient_id: recipientId,
        content,
        read_at: null,
      })
      .select()
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/messages')
    return { success: true, data }
  } catch (err) {
    return toActionError(err) as any
  }
}
