import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { handleWithdrawBid } from './actions'

export default async function SeekerApplicationsPage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  // 2. Fetch Bids for this seeker using internal ID
  const { data: bids, error } = await supabase!
    .from('bids')
    .select(`
      *,
      job:jobs!job_id (
        id,
        title,
        budget_min,
        budget_max,
        employer_id,
        employer:employer_id (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('bidder_id', profile?.id)
    .order('created_at', { ascending: false })

  const stats = {
    total: bids?.length || 0,
    accepted: bids?.filter(b => b.status === 'accepted').length || 0,
    pending: bids?.filter(b => b.status === 'pending').length || 0,
    interviews: bids?.filter(b => b.status === 'interview').length || 0
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <h2 className="font-headline text-6xl font-black italic text-on-surface leading-tight">
            My <span className="text-primary">Applications</span>
          </h2>
          <p className="text-on-surface-variant font-body max-w-md text-sm leading-relaxed">
            Track your active bids and career progression across elite global opportunities. Managed under BidJobs Protocol.
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-surface-container rounded-2xl p-8 flex flex-col justify-between border-l-4 border-primary shadow-xl">
          <span className="text-stone-500 text-[10px] uppercase tracking-widest font-black">Total Active Bids</span>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-headline text-6xl text-primary font-black italic">{stats.total}</span>
            <span className="text-stone-600 text-xs font-bold uppercase tracking-widest">Protocol Active</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-8 flex flex-col justify-between border-l-4 border-secondary shadow-xl">
          <span className="text-stone-500 text-[10px] uppercase tracking-widest font-black">Accepted Missions</span>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-headline text-6xl text-secondary font-black italic">{stats.accepted}</span>
            <span className="text-stone-600 text-xs font-bold uppercase tracking-widest">Confirmed</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-8 flex flex-col justify-between border-l-4 border-tertiary shadow-xl">
          <span className="text-stone-500 text-[10px] uppercase tracking-widest font-black">Active Interviews</span>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-headline text-6xl text-tertiary font-black italic">{stats.interviews}</span>
            <span className="text-stone-600 text-xs font-bold uppercase tracking-widest">In Progress</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-8 flex flex-col justify-between border-l-4 border-stone-700 shadow-xl relative overflow-hidden group">
          <span className="text-stone-500 text-[10px] uppercase tracking-widest font-black">Success Index</span>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-headline text-6xl text-on-surface font-black italic">
              {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[100px]">auto_awesome</span>
          </div>
        </div>
      </section>

      {/* Application List */}
      <div className="space-y-6">
        {!bids || bids.length === 0 ? (
          <div className="p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-stone-600">tactic</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-on-surface italic">No active engagements</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto text-sm">Your tactical portfolio is silent. Initialize a bid on a high-value mission to begin.</p>
            </div>
            <Link href="/jobs/browse" className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all">Explore Global Fleet</Link>
          </div>
        ) : (
          bids.map((bid: any) => (
            <div key={bid.id} className="group bg-surface-container hover:bg-surface-container-high transition-all duration-500 rounded-2xl p-8 flex flex-col lg:flex-row lg:items-center gap-10 border border-outline-variant/10 shadow-sm relative overflow-hidden">
              {/* Job Info */}
              <div className="flex items-center gap-6 lg:w-2/5">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20 group-hover:border-primary/30 transition-colors">
                  {bid.job?.employer?.avatar_url ? (
                    <img src={bid.job.employer.avatar_url} alt="Employer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-secondary">business</span>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline text-2xl font-black italic text-on-surface group-hover:text-primary transition-colors underline decoration-primary/0 group-hover:decoration-primary/40 underline-offset-4">
                    {bid.job?.title || 'Unknown Mission'}
                  </h4>
                  <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest">
                    <span>{bid.job?.employer?.full_name || 'Classified Entity'}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-700"></span>
                    <span>Applied {new Date(bid.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Bid Details */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 border-l border-outline-variant/10 pl-8 lg:pl-10">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest block">Proposed Allocation</span>
                  <span className="text-lg font-headline font-black text-on-surface italic">${bid.amount?.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest block">Cycle Time</span>
                  <span className="text-lg font-headline font-black text-on-surface italic">{bid.delivery_days} Days</span>
                </div>
                <div className="space-y-2 col-span-2 lg:col-span-1">
                  <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest block">Status</span>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    bid.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    bid.status === 'rejected' ? 'bg-red-500/10 text-error border-red-500/20' : 
                    bid.status === 'interview' ? 'bg-tertiary/10 text-tertiary border-tertiary/20 shadow-[0_0_15px_rgba(100,200,250,0.1)]' :
                    'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_15px_rgba(234,179,250,0.1)]'
                  }`}>
                    {bid.status || 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 lg:justify-end">
                <Link 
                  href={`/dashboard/messages?recipient=${bid.job?.employer_id}`}
                  className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 text-primary text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 group/msg shadow-lg shadow-primary/5"
                >
                  <span className="material-symbols-outlined text-[14px]">forum</span>
                  Message Entity
                </Link>

                <Link 
                  href={`/jobs/${bid.job_id}`}
                  className="px-6 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/20 hover:border-primary/40 text-on-surface text-xs font-black uppercase tracking-widest transition-all"
                >
                  View Intel
                </Link>
                <form action={handleWithdrawBid.bind(null, bid.id)}>
                  <button type="submit" className="p-3 rounded-xl text-stone-600 hover:text-error hover:bg-error/5 transition-all" title="Withdraw Bid">
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                </form>
              </div>

              {/* Glow Decoration */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}