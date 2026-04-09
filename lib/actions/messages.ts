'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(recipientId: number, content: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get sender profile
    const { data: senderProfile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!senderProfile) {
      return { success: false, error: 'User profile not found' }
    }

    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderProfile.id,
        recipient_id: recipientId,
        content,
        read_at: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return { success: false, error: error.message || 'Failed to send message' }
    }

    revalidatePath(`/dashboard/messages`)
    return { success: true, data }
  } catch (err: any) {
    console.error('Error in sendMessage:', err)
    return { success: false, error: err.message || 'Failed to send message' }
  }
}
