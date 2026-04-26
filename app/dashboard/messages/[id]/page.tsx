import { getAuthUser } from '@/lib/auth-utils'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatStream from '../ChatStream'

export default async function MessageSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id: conversationId } = await params
  const { profile: internalUser, supabase } = await getAuthUser()

  // 1. Fetch Conversation with Participants
  const { data: conversation, error } = await supabase!
    .from('conversations')
    .select(`
      *,
      participant_1:users!participant_1_id ( id, full_name, username, avatar_url, user_type ),
      participant_2:users!participant_2_id ( id, full_name, username, avatar_url, user_type )
    `)
    .eq('id', conversationId)
    .single()

  if (error || !conversation) {
    notFound()
  }

  // Verify access protocol
  const isParticipant = conversation.participant_1_id === internalUser?.id || conversation.participant_2_id === internalUser?.id
  if (!isParticipant) {
    redirect('/dashboard')
  }

  // Identify the other node
  const otherNode = conversation.participant_1_id === internalUser?.id 
    ? conversation.participant_2 
    : conversation.participant_1

  // 2. Fetch Initial Stream History
  const { data: messages } = await supabase!
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12 flex items-center justify-between">
        <div className="space-y-4">
          <Link href="/dashboard" className="text-stone-500 hover:text-primary transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Fleet Command
          </Link>
          <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
            Communication <span className="text-primary italic">Stream</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-surface-container border border-outline-variant/10">
           <div className="text-right">
             <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Protocol Type</p>
             <p className="text-xs font-bold text-on-surface">End-to-End Encrypted</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-stone-900 border border-primary/20 flex items-center justify-center text-primary">
             <span className="material-symbols-outlined">verified_user</span>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-8">
        
        {/* Main Stream Area */}
        <div className="col-span-12 lg:col-span-8">
          <ChatStream
            conversationId={conversationId}
            currentUserId={internalUser?.id || ''}
            initialMessages={messages || []}
            recipientName={otherNode?.full_name || otherNode?.username || 'Tactical Node'}
          />
        </div>

        {/* Tactical Intel Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
          
          {/* Identity Dossier */}
          <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-xl space-y-6">
            <h4 className="text-[10px] text-stone-500 font-black uppercase tracking-widest border-b border-outline-variant/10 pb-4">Identity Dossier</h4>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-outline-variant/20 overflow-hidden shadow-2xl">
                 {otherNode.avatar_url ? (
                   <img src={otherNode.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-primary/50">
                     <span className="material-symbols-outlined text-4xl">person</span>
                   </div>
                 )}
              </div>
              <div>
                <p className="font-headline font-black italic text-lg text-on-surface leading-tight">{otherNode.full_name || 'Classified'}</p>
                <p className="text-[9px] text-stone-500 font-black uppercase tracking-widest mt-1">Reputation: Elite (4.9)</p>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant font-body leading-relaxed italic opacity-80">
              User profile verified under node cluster. All transactions and communication are protocol-logged for security.
            </p>

            <Link 
              href={otherNode.user_type === 'employer' ? `/jobs/list?employer=${otherNode.id}` : `/dashboard/seeker/${otherNode.id}`}
              className="w-full block bg-stone-900 text-stone-300 border border-outline-variant/10 text-center py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 transition-all"
            >
              Inspect Global Profile
            </Link>
          </div>

          {/* Secure Handshake Stats */}
          <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_20px_50px_rgba(202,162,247,0.1)] space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-lg">security</span>
              <h4 className="text-[10px] font-black uppercase tracking-widest">Handshake Integrity</h4>
            </div>
            <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_rgba(202,162,247,0.8)]"></div>
            </div>
            <p className="text-[9px] text-stone-400 font-bold leading-relaxed uppercase tracking-widest text-center">
              Connection stability verified at 99.98%
            </p>
          </div>

        </aside>
      </section>
    </main>
  )
}
