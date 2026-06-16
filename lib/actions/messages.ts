'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'
import { sendNewMessageEmail } from '@/lib/email'

export async function sendMessage(recipientId: number, content: string) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, authUser, supabase } = auth

    const { data: recipientCheck } = await supabase!
      .from('users')
      .select('id')
      .eq('id', recipientId)
      .single()

    if (!recipientCheck) return { success: false, error: 'Recipient not found.' }

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

    if (error) return { success: false, error: 'Failed to send message.' }

    // Fetch recipient email + name to send notification
    const { data: recipient } = await supabase!
      .from('users')
      .select('full_name, email, auth_id')
      .eq('id', recipientId)
      .single()

    if (recipient?.email) {
      const { data: senderProfile } = await supabase!
        .from('users')
        .select('full_name')
        .eq('id', user?.id)
        .single()
      const senderName = senderProfile?.full_name || authUser?.email || 'Someone'
      const conversationId = data?.id?.toString() || ''
      sendNewMessageEmail({
        to: recipient.email,
        recipientName: recipient.full_name || 'there',
        senderName,
        preview: content,
        conversationId,
      }).catch(() => {}) // fire-and-forget; don't fail the action if email fails
    }

    revalidatePath('/dashboard/messages')
    return { success: true, data }
  } catch (err) {
    return toActionError(err) as any
  }
}
