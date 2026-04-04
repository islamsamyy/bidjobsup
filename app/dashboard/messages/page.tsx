import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { initializeConversation } from './actions'

export default async function MessagesLoadingPage({
  searchParams,
}: {
  searchParams: Promise<{ recipient?: string }>
}) {
  const { recipient } = await searchParams
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: internalUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser) {
    redirect('/join')
  }

  // If we have a recipient, attempt to initialize/find a conversation
  if (recipient) {
    const result = await initializeConversation(recipient)
    if (result.success && result.conversationId) {
      redirect(`/dashboard/messages/${result.conversationId}`)
    }
  }

  // Fallback: Fetch latest conversation
  const { data: latest } = await supabase
    .from('conversations')
    .select('id')
    .or(`participant_1_id.eq.${internalUser.id},participant_2_id.eq.${internalUser.id}`)
    .order('last_message_at', { ascending: false })
    .limit(1)
    .single()

  if (latest) {
    redirect(`/dashboard/messages/${latest.id}`)
  }

  // No conversations found
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
         <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
           Communication <span className="text-primary italic">Stream</span>
         </h2>
      </header>
      <div className="flex flex-col items-center justify-center p-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/20">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-stone-600">forum</span>
        </div>
        <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">No Active Streams</h3>
        <p className="text-on-surface-variant max-w-sm text-center text-sm">
          Your secure communications pipeline is currently empty. Incoming tactical handshakes will appear here.
        </p>
      </div>
    </main>
  )
}
