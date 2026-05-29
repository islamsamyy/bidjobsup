import { getAuthUser } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { initializeConversation } from './actions'
import { MessagesClient } from './MessagesClient'

export const dynamic = 'force-dynamic'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ recipient?: string }>
}) {
  const { recipient } = await searchParams
  const { profile: internalUser, supabase } = await getAuthUser()

  // If we have a recipient, attempt to initialize/find a conversation
  if (recipient) {
    const result = await initializeConversation(recipient)
    if (result.success && result.conversationId) {
      redirect(`/dashboard/messages/${result.conversationId}`)
    }
  }

  // Fetch all conversations for this user
  const { data: conversations } = await supabase!
    .from('conversations')
    .select(`
      id,
      last_message_at,
      participant_1:users!participant_1_id ( id, full_name, username, avatar_url ),
      participant_2:users!participant_2_id ( id, full_name, username, avatar_url )
    `)
    .or(`participant_1_id.eq.${internalUser?.id},participant_2_id.eq.${internalUser?.id}`)
    .order('last_message_at', { ascending: false })

  // For each conversation, get the last message preview
  const conversationsWithPreview = await Promise.all(
    (conversations || []).map(async (conv) => {
      const { data: lastMsg } = await supabase!
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Identify the other participant
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p1 = conv.participant_1 as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p2 = conv.participant_2 as any
      const other = p1?.id === internalUser?.id ? p2 : p1

      return {
        id: conv.id,
        lastMessageAt: conv.last_message_at,
        other: {
          name: other?.full_name || other?.username || 'Unknown',
          avatar_url: other?.avatar_url,
          initials: (other?.full_name || other?.username || 'U')
            .split(' ')
            .map((w: string) => w[0])
            .join(''),
        },
        preview: lastMsg?.content || 'No messages yet',
        previewTime: lastMsg?.created_at || conv.last_message_at,
        isOwnLastMessage: lastMsg?.sender_id === internalUser?.id,
      }
    })
  )

  return <MessagesClient conversations={conversationsWithPreview} />
}
