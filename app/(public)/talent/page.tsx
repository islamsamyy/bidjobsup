import { createClient } from '@/lib/supabase/server'
import TalentCard from '@/components/features/TalentCard'
import Link from 'next/link'

export const metadata = {
  title: 'Find Talent | BidJobs — Vision 2030 Specialist Network',
  description: 'Connect with elite specialists, from luxury architects to high-stakes developers, defining Saudi Vision 2030.',
}

export default async function FindTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; industry?: string }>
}) {
  const params = await searchParams
  const query = params?.query || ''
  const industry = params?.industry || ''

  const supabase = await createClient()

  let q = supabase
    .from('users')
    .select('*')
    // We only want jobseekers or both
    .neq('user_type', 'employer')
    .order('created_at', { ascending: false })

  if (query) {
    q = q.or(`full_name.ilike.%${query}%,skills.ilike.%${query}%,bio.ilike.%${query}%`)
  }

  if (industry) {
    q = q.eq('industry', industry)
  }

  const { data: talents, error } = await q.limit(20)

  // Fetch review stats for each talent
  const talentsWithRatings = await Promise.all(
    (talents || []).map(async (talent) => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', talent.id)

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

      return {
        ...talent,
        avgRating,
        reviewCount: reviews?.length || 0,
      }
    })
  )

  // Fetch unique industries from job categories for filter
  const { data: industriesData } = await supabase
    .from('jobs')
    .select('category')
    .not('category', 'is', null)
  const INDUSTRIES = [...new Set(industriesData?.map(j => j.category).filter(Boolean) || [])]

  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-body min-h-screen flex flex-col selection:bg-[#caa2f7] selection:text-[#431f6b]">
      {/* Search Header */}
      <section className="pt-40 pb-20 px-8 relative overflow-hidden border-b border-[#292428]/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#caa2f7]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase mb-8">
            Specialist Network
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            Find Your <br />
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">
              Edge.
            </span>
          </h1>
          
          {/* Search Bar */}
          <form action="/talent" method="GET" className="max-w-3xl mx-auto bg-[#1c181c] p-2 rounded-2xl border border-[#292428] shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4b474a]">search</span>
              <input
                type="text"
                name="query"
                placeholder="Search by skill, name, or expertise..."
                defaultValue={query}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-light pl-12 h-14 placeholder:text-[#4b474a]"
              />
            </div>
            <div className="h-14 w-px bg-[#292428] hidden md:block" />
            <select name="industry" defaultValue={industry} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[#faf1f5] h-14 px-6 uppercase tracking-widest cursor-pointer">
              <option value="">All Industries</option>
              {INDUSTRIES.map(i => (
                <option key={i} value={i} className="bg-[#1c181c]">{i}</option>
              ))}
            </select>
            <button type="submit" className="px-8 h-14 rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
              Filter Talent
            </button>
          </form>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-20">
        {error ? (
          <div className="text-center py-20 bg-[#1c181c] rounded-3xl border border-[#ff6e84]/20">
            <span className="material-symbols-outlined text-[#ff6e84] text-5xl mb-4">error</span>
            <p className="text-[#ff6e84] font-black uppercase tracking-widest">Protocol error occurred while searching.</p>
          </div>
        ) : talents?.length === 0 ? (
          <div className="text-center py-40">
            <span className="material-symbols-outlined text-[#4b474a] text-6xl mb-6">person_search</span>
            <h3 className="text-3xl font-headline font-bold text-[#faf1f5] mb-2">No Talent Found</h3>
            <p className="text-[#b0a9ad] font-light">Try adjusting your search filters to find specialists.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {talentsWithRatings?.map((talent: any) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        )}
      </main>

      {/* Footer Support */}
      <section className="bg-[#1c181c] border-t border-[#292428] py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h2 className="text-4xl font-headline font-bold text-[#faf1f5] mb-4">Ready to start hiring?</h2>
            <p className="text-[#b0a9ad] font-light max-w-md">Connect directly with vetted specialists and negotiate contracts in our secure ecosystem.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/join" 
              className="px-10 py-5 rounded-xl bg-transparent border border-[#caa2f7] text-[#caa2f7] font-black text-xs uppercase tracking-widest hover:bg-[#caa2f7] hover:text-[#431f6b] transition-all"
            >
              Post a Mandate
            </Link>
            <Link 
              href="/sign-in" 
              className="px-10 py-5 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#caa2f7]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Join the Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
