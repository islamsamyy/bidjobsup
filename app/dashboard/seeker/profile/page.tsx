import { getAuthUserAs } from '@/lib/auth-utils'
import { ProfileClient } from './ProfileClient'

export default async function SeekerProfilePage() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { count: totalBids } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)

  const { count: acceptedBids } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .eq('status', 'accepted')

  const { data: reviews } = await supabase!
    .from('reviews')
    .select('rating')
    .eq('reviewed_user_id', profile?.id)

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  const successRate = (totalBids || 0) > 0
    ? Math.round(((acceptedBids || 0) / (totalBids || 1)) * 100) + '%'
    : '—'

  return (
    <ProfileClient
      profile={profile}
      avgRating={avgRating}
      successRate={successRate}
      totalBids={totalBids || 0}
      acceptedBids={acceptedBids || 0}
    />

      {/* Footer Branding Context */}
      <footer className="mt-20 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 px-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">shield</span>
          </div>
          <div>
            <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Profile Security</p>
            <p className="text-xs font-bold text-on-surface">BidJobs Secure ID</p>
          </div>
        </div>
        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest text-center md:text-right max-w-xs">
          Your identity and profile data are encrypted and securely managed.
        </p>
      </footer>
    </main>
  )
}