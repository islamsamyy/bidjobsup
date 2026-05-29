'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/actions/notifications'

interface Notification {
  id: number
  title: string
  content: string
  type: string
  read_at: string | null
  created_at: string
}

interface NotificationsClientProps {
  notifications: Notification[] | null
  profileId: string
}

export function NotificationsClient({ notifications, profileId }: NotificationsClientProps) {
  const { t } = useLanguage()

  const unreadCount = notifications?.filter(n => !n.read_at).length || 0

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
            {t('dashboardPages.notifications.title')}
          </h2>
          <p className="text-on-surface-variant mt-2 text-lg">
            {t('dashboardPages.notifications.subtitle')}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <input type="hidden" name="userId" value={profileId} />
            <button
              type="submit"
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              {t('dashboardPages.notifications.markAllAsRead')} ({unreadCount})
            </button>
          </form>
        )}
      </header>

      {!notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/20">
          <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-stone-600">notifications_active</span>
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">
            {t('dashboardPages.notifications.noNotifications')}
          </h3>
          <p className="text-on-surface-variant max-w-sm text-center text-sm">
            Your notifications are all caught up. Any updates will be routed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <form
              key={notif.id}
              action={markNotificationAsRead}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                notif.read_at
                  ? 'bg-surface-container border-outline-variant/10'
                  : 'bg-primary/5 border-primary/30 hover:border-primary/50'
              }`}
            >
              <input type="hidden" name="notificationId" value={notif.id} />
              <div className="flex gap-4 items-start">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.read_at ? 'bg-stone-900 text-stone-600' : 'bg-primary/20 text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {notif.type === 'message' ? 'forum' : 'notifications'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-headline font-black italic text-on-surface">{notif.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 whitespace-nowrap">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{notif.content}</p>
                </div>
                {!notif.read_at && (
                  <button
                    type="submit"
                    className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors whitespace-nowrap"
                  >
                    {t('dashboardPages.notifications.markAsRead')}
                  </button>
                )}
              </div>
            </form>
          ))}
        </div>
      )}
    </main>
  )
}
