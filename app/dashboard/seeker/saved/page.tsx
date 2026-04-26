import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { handleUnsaveJob } from './actions'
import { markAllNotificationsAsRead } from '@/lib/actions/notifications'

export default async function SavedJobsAndNotificationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  // 1. ✅ Fixed: Query 'saved_items' (not 'favorites') using internal user ID
  const { data: savedJobs } = await supabase!
    .from('saved_items')
    .select(`
      *,
      job:jobs!job_id (
        *,
        employer:employer_id (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', profile?.id)

  // 2. ✅ Fixed: Notifications use internal user ID
  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
      
      {/* Left Column: Saved Opportunities */}
      <div className="flex-grow space-y-12">
        <header>
          <h2 className="font-headline text-6xl font-black italic text-on-surface leading-tight">
            Saved <span className="text-secondary">Targets</span>
          </h2>
          <p className="text-on-surface-variant font-body mt-4 max-w-md text-sm leading-relaxed italic opacity-80">
            High-priority missions bookmarked for tactical execution. Maintain your focus on elite global growth.
          </p>
        </header>

        <div className="space-y-6">
          {!savedJobs || savedJobs.length === 0 ? (
            <div className="p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-stone-900 mx-auto flex items-center justify-center text-stone-600">
                <span className="material-symbols-outlined text-3xl">bookmark</span>
              </div>
              <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">No active bookmarks detected</p>
              <Link href="/dashboard/seeker/search" className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all">Explore Opportunities</Link>
            </div>
          ) : (
            savedJobs.map((fav) => (
              <div key={fav.id} className="group bg-surface-container rounded-3xl p-8 border border-outline-variant/10 hover:bg-surface-container-high transition-all duration-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-stone-950 border border-outline-variant/20 flex items-center justify-center text-primary shadow-2xl">
                        <span className="material-symbols-outlined text-3xl">architecture</span>
                     </div>
                     <div>
                       <h4 className="text-2xl font-headline font-black italic text-on-surface group-hover:text-primary transition-colors">{fav.job?.title}</h4>
                       <p className="text-xs font-black uppercase tracking-widest text-stone-500 mt-1">{fav.job?.employer?.full_name} • Protocol Elite</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-headline font-black italic text-on-surface">${fav.job?.budget_max?.toLocaleString()}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mt-1">Maximum Allocation</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                   <div className="flex gap-2">
                      <span className="px-3 py-1 bg-stone-900 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 border border-outline-variant/5">Remote</span>
                      <span className="px-3 py-1 bg-stone-900 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 border border-outline-variant/5">Full-Time</span>
                   </div>
                   <div className="flex gap-4">
                      {/* ✅ Fixed: Wire unsave button to server action */}
                       <form action={handleUnsaveJob.bind(null, fav.job_id)}>
                        <button type="submit" className="p-3 text-stone-600 hover:text-error transition-colors" title="Remove Bookmark">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </form>
                      <Link href={`/jobs/${fav.job_id}`} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all">Submit Bid</Link>
                   </div>
                </div>
                
                {/* Glow Decoration */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/5 blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-colors"></div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Activity Stream (Notifications) */}
      <aside className="w-full lg:w-[400px] space-y-8">
         <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-2xl sticky top-32">
            <header className="flex justify-between items-center mb-10 border-b border-outline-variant/10 pb-6">
               <h3 className="text-xl font-headline font-black italic text-on-surface">Activity <span className="text-primary">Stream</span></h3>
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            </header>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
               {!notifications || notifications.length === 0 ? (
                 <div className="text-center py-10 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Stream Silent</p>
                 </div>
               ) : (
                 notifications.map((notif) => (
                    <div key={notif.id} className="p-5 bg-stone-900/40 rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group relative">
                       <div className="flex gap-4">
                          {/* ✅ Fixed: Use read_at instead of read */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.read_at ? 'bg-stone-800 text-stone-500' : 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(202,162,247,0.2)]'}`}>
                             <span className="material-symbols-outlined text-lg">{notif.type === 'message' ? 'forum' : 'notifications'}</span>
                          </div>
                          <div className="space-y-1">
                             <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{notif.title}</p>
                             {/* ✅ Fixed: Use 'content' instead of 'message' */}
                             <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed italic">{notif.content}</p>
                             <p className="text-[9px] font-black uppercase tracking-widest text-stone-600 mt-2">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                       </div>
                       {!notif.read_at && <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(202,162,247,0.8)]"></div>}
                    </div>
                 ))
               )}
            </div>

            {/* ✅ Fixed: Wire "Clear" button to markAllNotificationsAsRead */}
            <form action={markAllNotificationsAsRead}>
              <button type="submit" className="w-full mt-10 py-4 bg-stone-950 text-stone-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-outline-variant/10 hover:border-stone-700 transition-all">
                 Mark All As Read
              </button>
            </form>
         </div>

         {/* Reputation Component */}
         <div className="p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">verified</span>
               Protocol Trust Index
            </h4>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-headline font-black italic text-on-surface">4.92</span>
               <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">/ 5.0 Global</span>
            </div>
            <div className="h-1 w-full bg-stone-900 rounded-full overflow-hidden">
               <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(234,179,250,0.8)]"></div>
            </div>
         </div>
      </aside>

    </main>
  )
}