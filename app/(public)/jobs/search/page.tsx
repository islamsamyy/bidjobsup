import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return 'TBD'
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff <= 0) return 'Just now'
  if (diff === 1) return 'Yesterday'
  return `${diff}d ago`
}

const CATEGORIES = ['All', 'Engineering', 'Design', 'Marketing', 'Product', 'Finance', 'Operations', 'Legal', 'Other']

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = (params.q as string || '').trim()
  const category = params.category as string || ''
  const location = params.location as string || ''
  const salaryMin = parseInt(params.salary_min as string) || 0

  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select(`*, employer:employer_id(full_name, company_name, avatar_url, location)`)
    .eq('status', 'open')

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  if (category && category !== 'All') query = query.eq('category', category)
  if (location) query = query.ilike('location', `%${location}%`)
  if (salaryMin > 0) query = query.gte('budget_max', salaryMin)

  const { data: jobs } = await query.order('created_at', { ascending: false }).limit(30)

  return (
    <div className="max-w-[1440px] mx-auto flex min-h-[calc(100vh-80px)]">
      {/* Filter Sidebar */}
      <aside className="hidden md:block w-80 p-8 border-r border-[#292428]/20 bg-[#151215] h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
        <form method="get" action="/jobs/search" className="space-y-8">
          {/* Search query */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad] mb-3 block">
              Keywords
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4b474a] text-lg">search</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Title, skill, keyword…"
                className="w-full bg-[#1c181c] border border-[#292428] rounded-xl pl-10 pr-4 py-3 text-sm text-[#faf1f5] placeholder:text-[#4b474a] focus:outline-none focus:border-[#caa2f7]/50"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad] mb-3 block">
              Category
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c181c] cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat === 'All' ? '' : cat}
                    defaultChecked={category === (cat === 'All' ? '' : cat) || (cat === 'All' && !category)}
                    className="accent-[#caa2f7]"
                  />
                  <span className="text-sm text-[#b0a9ad] group-hover:text-[#faf1f5] transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad] mb-3 block">
              Location
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4b474a] text-lg">location_on</span>
              <input
                name="location"
                defaultValue={location}
                placeholder="City or Remote…"
                className="w-full bg-[#1c181c] border border-[#292428] rounded-xl pl-10 pr-4 py-3 text-sm text-[#faf1f5] placeholder:text-[#4b474a] focus:outline-none focus:border-[#caa2f7]/50"
              />
            </div>
          </div>

          {/* Min salary */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad] mb-3 block">
              Min Budget ($)
            </label>
            <input
              name="salary_min"
              type="number"
              defaultValue={salaryMin || ''}
              placeholder="e.g. 5000"
              min="0"
              className="w-full bg-[#1c181c] border border-[#292428] rounded-xl px-4 py-3 text-sm text-[#faf1f5] placeholder:text-[#4b474a] focus:outline-none focus:border-[#caa2f7]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all"
          >
            Apply Filters
          </button>

          {(q || category || location || salaryMin > 0) && (
            <Link
              href="/jobs/search"
              className="block text-center text-[10px] font-bold uppercase tracking-widest text-[#4b474a] hover:text-[#b0a9ad] transition-colors"
            >
              Clear All
            </Link>
          )}
        </form>

        {/* Upsell */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#1c181c] to-[#292428] border border-[#caa2f7]/10">
          <h3 className="font-headline text-base font-bold mb-2 text-[#faf1f5]">Elevate Your Bid</h3>
          <p className="text-xs text-[#b0a9ad] mb-4 leading-relaxed">Get priority listings and direct employer access.</p>
          <Link href="/pricing" className="text-xs font-bold text-[#caa2f7] underline underline-offset-4 hover:text-[#f1bfff] transition-colors">
            Upgrade to Elite
          </Link>
        </div>
      </aside>

      {/* Results */}
      <section className="flex-1 p-8 lg:p-12">
        <header className="mb-12">
          <h1 className="font-headline text-5xl font-black tracking-tight text-[#faf1f5] mb-3">
            {q ? `Results for "${q}"` : 'Search Roles'}
          </h1>
          <p className="text-[#b0a9ad] text-lg font-light">
            {jobs && jobs.length > 0
              ? `${jobs.length} mission${jobs.length !== 1 ? 's' : ''} found${category ? ` in ${category}` : ''}${location ? ` near ${location}` : ''}`
              : 'No results — try adjusting your filters'}
          </p>
        </header>

        {/* Mobile search bar */}
        <form method="get" action="/jobs/search" className="md:hidden mb-8 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4b474a]">search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search roles…"
              className="w-full bg-[#1c181c] border border-[#292428] rounded-xl pl-10 pr-4 py-3 text-sm text-[#faf1f5] placeholder:text-[#4b474a] focus:outline-none focus:border-[#caa2f7]/50"
            />
          </div>
          <button type="submit" className="bg-[#caa2f7] text-[#431f6b] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
            Go
          </button>
        </form>

        <div className="space-y-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="group bg-[#1c181c] border border-[#292428] rounded-2xl p-8 hover:bg-[#221e22] hover:border-[#caa2f7]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-16 h-16 rounded-xl bg-[#100d10] flex items-center justify-center border border-[#292428] flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                    {job.employer?.avatar_url ? (
                      <img src={job.employer.avatar_url} alt={job.employer.company_name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#caa2f7]">work</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h3 className="font-headline text-2xl font-bold group-hover:text-[#caa2f7] transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.category && (
                          <span className="px-3 py-1 rounded-full bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black uppercase tracking-widest border border-[#f1bfff]/10">
                            {job.category}
                          </span>
                        )}
                        {job.budget_max && job.budget_max >= 2000 && (
                          <span className="px-3 py-1 rounded-full bg-[#caa2f7]/10 text-[#caa2f7] text-[10px] font-black uppercase tracking-widest border border-[#caa2f7]/10">
                            High Ticket
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Company</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{job.employer?.company_name || job.employer?.full_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Location</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{job.location || 'Remote'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Budget</span>
                        <span className="text-sm font-black text-[#caa2f7] font-headline">
                          {job.budget_min && job.budget_max
                            ? `$${Number(job.budget_min).toLocaleString()} – $${Number(job.budget_max).toLocaleString()}`
                            : job.budget_max
                              ? `Up to $${Number(job.budget_max).toLocaleString()}`
                              : job.budget_min
                                ? `$${Number(job.budget_min).toLocaleString()}+`
                                : 'TBD'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Posted</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{timeAgo(job.created_at)}</span>
                      </div>
                    </div>
                    {job.description && (
                      <p className="text-[#b0a9ad] text-sm leading-relaxed max-w-2xl line-clamp-2 italic">{job.description}</p>
                    )}
                  </div>
                  <div className="flex lg:flex-col justify-end items-end gap-3 flex-shrink-0 min-w-[140px]">
                    <Link href={`/jobs/${job.id}`} className="w-full text-center px-6 py-3 rounded-xl border border-[#4b474a] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#292428] transition-all text-[#faf1f5]">
                      Details
                    </Link>
                    <Link href={`/jobs/${job.id}`} className="w-full text-center px-6 py-3 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#caa2f7]/10 hover:brightness-110 active:scale-95 transition-all">
                      Place Bid
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center bg-[#1c181c] rounded-[2rem] border border-dashed border-[#292428]">
              <span className="material-symbols-outlined text-6xl text-[#4b474a] mb-6 block">search_off</span>
              <h3 className="text-2xl font-bold mb-2">No missions match your protocol</h3>
              <p className="text-[#b0a9ad] mb-8">Try broadening your filters or clearing the search cache.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/jobs/search" className="px-6 py-3 rounded-xl border border-[#4b474a] text-[10px] font-black uppercase tracking-widest text-[#faf1f5] hover:bg-[#292428] transition-all">
                  Clear Filters
                </Link>
                <Link href="/jobs/browse" className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                  Browse All Roles
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
