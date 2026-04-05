'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/actions/notifications'
import { sendNewMessageEmail } from '@/lib/email'

export async function sendMessage(
  conversationId: string,
  content: string,
  attachment?: { url: string; name: string; type: string }
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be signed in to contribute to a stream.' }
  }

  const { data: internalUser } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser) {
    return { error: 'Node identity not found in network.' }
  }

  // 0. Fetch conversation to find the recipient
  const { data: conv } = await supabase
    .from('conversations')
    .select('participant_1_id, participant_2_id, p1:users!participant_1_id(id, auth_id), p2:users!participant_2_id(id, auth_id)')
    .eq('id', conversationId)
    .single()

  if (!conv) return { error: 'Conversation protocol not found.' }

  const recipient = conv.participant_1_id === internalUser.id ? conv.p2 : conv.p1

  // 1. Send the message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: internalUser.id,
      content,
      ...(attachment && {
        attachment_url: attachment.url,
        attachment_name: attachment.name,
        attachment_type: attachment.type,
      }),
    })
    .select()
    .single()

  if (messageError) {
    console.error('Message Protocol Error:', messageError)
    return { error: 'Failed to deploy message to the stream.' }
  }

  // 2. Update conversation activity heartbeat
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  // 3. Notify recipient (in-app + email)
  if (recipient) {
    await createNotification({
      userId: (recipient as any).id,
      userAuthId: (recipient as any).auth_id,
      type: 'new_message',
      title: 'Incoming Encrypted Transmission',
      content: `${internalUser.full_name || 'An agent'} sent you a message.`,
      link: `/dashboard/messages/${conversationId}`
    })

    const { data: recipientAuth } = await supabase.auth.admin.getUserById((recipient as any).auth_id)
    if (recipientAuth?.user?.email) {
      await sendNewMessageEmail({
        to: recipientAuth.user.email,
        recipientName: (recipient as any).full_name || 'Agent',
        senderName: internalUser.full_name || 'An agent',
        preview: content,
        conversationId,
      }).catch(() => {})
    }
  }

  revalidatePath(`/dashboard/messages/${conversationId}`)
  return { success: true, message }
}

export async function initializeConversation(recipientId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Authentication required for link initialization.' }
  }

  const { data: internalUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser) {
    return { error: 'Origin node identity not found in network.' }
  }

  // 0. Resolve Recipient Internal ID if UUID was passed
  let resolvedRecipientId = parseInt(recipientId)
  if (isNaN(resolvedRecipientId)) {
    // Looks like a UUID or other string, try to resolve by auth_id
    const { data: recp } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', recipientId)
      .single()
    if (!recp) {
      return { error: 'Recipient node identity not found.' }
    }
    resolvedRecipientId = recp.id
  }

  // 1. Check if conversation already exists (either P1-P2 or P2-P1)
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant_1_id.eq.${internalUser.id},participant_2_id.eq.${resolvedRecipientId}),and(participant_1_id.eq.${resolvedRecipientId},participant_2_id.eq.${internalUser.id})`)
    .single()

  if (existing) {
    return { success: true, conversationId: existing.id }
  }

  // 2. Initialize new mission thread
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({
      participant_1_id: internalUser.id,
      participant_2_id: resolvedRecipientId,
      last_message_at: new Date().toISOString()
    })
    .select()
    .single()

  if (convError) {
    console.error('Link Initialization Error:', convError)
    return { error: 'Failed to establish stable link between nodes.' }
  }

  return { success: true, conversationId: conversation.id }
}
