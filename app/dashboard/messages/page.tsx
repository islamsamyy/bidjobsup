import { getAuthUser } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { initializeConversation } from './actions'
import Link from 'next/link'

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

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
        <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
          Communication <span className="text-primary italic">Stream</span>
        </h2>
        <p className="text-on-surface-variant text-sm mt-2 font-body italic opacity-80">
          {conversationsWithPreview.length} active conversation{conversationsWithPreview.length !== 1 ? 's' : ''}
        </p>
      </header>

      {conversationsWithPreview.length > 0 ? (
        <div className="space-y-3">
          {conversationsWithPreview.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/messages/${conv.id}`}
              className="flex items-center gap-5 p-6 bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-high transition-all group"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-outline-variant/20 overflow-hidden shrink-0 shadow-lg">
                {conv.other.avatar_url ? (
                  <img src={conv.other.avatar_url} alt={conv.other.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/20 text-primary font-bold text-lg">
                    {conv.other.initials}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-headline font-bold text-on-surface text-lg group-hover:text-primary transition-colors truncate">
                    {conv.other.name}
                  </h3>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest shrink-0 ml-4">
                    {formatTime(conv.previewTime)}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant truncate font-body">
                  {conv.isOwnLastMessage && <span className="text-stone-500">You: </span>}
                  {conv.preview}
                </p>
              </div>

              {/* Arrow */}
              <span className="material-symbols-outlined text-stone-600 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/20">
          <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-stone-600">forum</span>
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">No Active Streams</h3>
          <p className="text-on-surface-variant max-w-sm text-center text-sm">
            Your secure communications pipeline is currently empty. Start a conversation by messaging a talent or employer from their profile?.
          </p>
        </div>
      )}
    </main>
  )
}

function formatTime(dateStr: string | null) {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
