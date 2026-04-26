import { getAuthUserAs } from '@/lib/auth-utils'
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/actions/notifications'

export const metadata = {
  title: 'Notifications | BidJobs',
  description: 'Your intel and alerts',
}

export default async function NotificationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })

  const unreadCount = notifications?.filter(n => !n.read_at).length || 0

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
            Tactical <span className="text-primary-neon italic">Intel</span>
          </h2>
          <p className="text-on-surface-variant mt-2 text-lg">Your mission-critical alerts and updates.</p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <input type="hidden" name="userId" value={profile?.id} />
            <button
              type="submit"
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark All Read ({unreadCount})
            </button>
          </form>
        )}
      </header>
      
      {!notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/20">
          <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-stone-600">notifications_active</span>
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">No Active Alerts</h3>
          <p className="text-on-surface-variant max-w-sm text-center text-sm">
            Your intel perimeter is quiet. Any updates regarding your applications or security clearance will be routed here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`group relative rounded-2xl p-6 border transition-all duration-300 ${
                notif.read_at
                  ? 'bg-surface-container border-outline-variant/10'
                  : 'bg-surface-container-high border-primary/20 shadow-lg shadow-primary/5'
              }`}
            >
              {!notif.read_at && (
                <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
              <div className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'bid_accepted' ? 'bg-green-500/10 text-green-400' :
                  notif.type === 'bid_rejected' ? 'bg-red-500/10 text-red-400' :
                  notif.type === 'new_message' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {notif.type === 'bid_accepted' ? 'check_circle' :
                     notif.type === 'bid_rejected' ? 'cancel' :
                     notif.type === 'new_message' ? 'chat' :
                     'notifications'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h4 className="font-bold text-sm text-on-surface">{notif.title}</h4>
                    <span className="text-[10px] text-stone-500 shrink-0">
                      {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{notif.content}</p>
                  {notif.link && (
                    <a href={notif.link} className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2 inline-block hover:underline">
                      View →
                    </a>
                  )}
                </div>
                {!notif.read_at && (
                  <form action={markNotificationAsRead}>
                    <input type="hidden" name="notificationId" value={notif.id} />
                    <button type="submit" className="text-stone-600 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
