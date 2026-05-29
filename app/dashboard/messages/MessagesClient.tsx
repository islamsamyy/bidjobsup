'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface Conversation {
  id: number
  lastMessageAt: string
  other: {
    name: string
    avatar_url?: string
    initials: string
  }
  preview: string
  previewTime: string
  isOwnLastMessage: boolean
}

interface MessagesClientProps {
  conversations: Conversation[]
}

export function MessagesClient({ conversations }: MessagesClientProps) {
  const { t } = useLanguage()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return date.toLocaleDateString()
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
        <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
          {t('dashboardPages.messages.title')} <span className="text-primary italic">Stream</span>
        </h2>
        <p className="text-on-surface-variant text-sm mt-2 font-body italic opacity-80">
          {conversations.length} {t('dashboardPages.messages.activeConversations')} {conversations.length !== 1 ? 's' : ''}
        </p>
      </header>

      {conversations.length === 0 ? (
        <div className="p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-stone-600">forum</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-headline font-bold text-on-surface italic">
              {t('dashboardPages.messages.noMessages')}
            </h3>
            <p className="text-on-surface-variant max-w-xs mx-auto text-sm">
              {t('dashboardPages.messages.startConversation')}
            </p>
          </div>
          <Link
            href="/dashboard/seeker/search"
            className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all"
          >
            {t('dashboardPages.messages.browseJobs')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/messages/${conv.id}`}
              className="group block p-6 bg-surface-container hover:bg-surface-container-high transition-all rounded-2xl border border-outline-variant/10 hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20 flex-shrink-0">
                  {conv.other.avatar_url ? (
                    <img
                      src={conv.other.avatar_url}
                      alt={conv.other.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-primary">{conv.other.initials}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-headline font-black italic text-on-surface group-hover:text-primary transition-colors truncate">
                      {conv.other.name}
                    </h3>
                    <span className="text-xs text-stone-600 flex-shrink-0">
                      {formatTime(conv.previewTime)}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2">
                    {conv.isOwnLastMessage ? 'You: ' : ''}{conv.preview}
                  </p>
                </div>

                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
