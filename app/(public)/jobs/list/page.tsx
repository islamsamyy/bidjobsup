import { createClient } from '@/lib/supabase/server'
import Link from "next/link";
import FilterSidebar from './FilterSidebar';
import SortSelect from './SortSelect';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobDirectoryPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const category = params.c as string || "";
  const remote = params.remote === "true";
  const minSalary = parseInt(params.minSalary as string) || 0;
  const sortBy = params.sort as string || "latest";

  // 1. Fetch Jobs with filtering
  let jobsQuery = supabase
    .from('jobs')
    .select(`
      *,
      employer:employer_id (
        full_name,
        company_name,
        avatar_url,
        location
      )
    `)
    .eq('status', 'open');

  if (category && category !== "All" && category !== "") {
    jobsQuery = jobsQuery.eq('category', category);
  }
  if (remote) {
    jobsQuery = jobsQuery.ilike('location', '%remote%');
  }
  if (minSalary > 0) {
    jobsQuery = jobsQuery.gte('budget_max', minSalary);
  }

  if (sortBy === "salary") {
    jobsQuery = jobsQuery.order('budget_max', { ascending: false });
  } else {
    jobsQuery = jobsQuery.order('created_at', { ascending: false });
  }

  const { data: jobs, error } = await jobsQuery.limit(20);

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    if (diffInDays === 0) return 'Just now'
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays} days ago`
  }

  return (
    <div className="max-w-[1440px] mx-auto flex min-h-[calc(100vh-80px)]">
      {/* Filters (Left Sidebar) */}
      <aside className="hidden md:block w-80 p-8 border-r border-[#292428]/20 bg-[#151215] h-[calc(100vh-80px)] sticky top-20 overflow-y-auto custom-scrollbar">
        <FilterSidebar initialCategory={category} initialRemote={remote} initialMinSalary={minSalary} />
        
        {/* Promotion Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1c181c] to-[#292428] border border-[#caa2f7]/10 relative overflow-hidden group mt-10">
          <div className="relative z-10">
            <h3 className="font-headline text-lg font-bold mb-3 text-[#faf1f5]">Elevate Your Bid</h3>
            <p className="text-xs text-[#b0a9ad] mb-6 leading-relaxed">Get priority listing and direct DM access to premium founders.</p>
            <Link href="/pricing" className="text-xs font-bold text-[#caa2f7] underline underline-offset-4 hover:text-[#f1bfff] transition-colors">
              Upgrade to Elite
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
        </div>
      </aside>

      {/* Content Area (Right Side) */}
      <section className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="font-headline text-5xl font-black tracking-tight text-[#faf1f5]">The Directory</h1>
            <p className="text-[#b0a9ad] font-light text-lg">Curated high-stakes opportunities for world-class talent.</p>
          </div>
          <div className="flex items-center gap-4 self-start md:self-auto bg-[#1c181c] rounded-full px-6 py-2.5 border border-[#292428]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad]">Sort By:</span>
            <SortSelect currentSort={sortBy} />
          </div>
        </header>


        {/* Job Cards Grid */}
        <div className="space-y-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="group relative bg-[#1c181c] border border-[#292428] rounded-2xl p-8 transition-all duration-500 hover:bg-[#221e22] hover:border-[#caa2f7]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-16 h-16 rounded-xl bg-[#100d10] flex items-center justify-center border border-[#292428] flex-shrink-0 text-2xl group-hover:scale-110 transition-transform overflow-hidden">
                    {job.employer?.avatar_url ? (
                      <img src={job.employer.avatar_url} alt={job.employer.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#caa2f7]">work</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h3 className="font-headline text-2xl font-bold group-hover:text-[#caa2f7] transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black uppercase tracking-widest border border-[#f1bfff]/10">
                          {job.category}
                        </span>
                        {job.budget_max >= 2000 && (
                          <span className="px-3 py-1 rounded-full bg-[#caa2f7]/10 text-[#caa2f7] text-[10px] font-black uppercase tracking-widest border border-[#caa2f7]/10">
                            High Ticket
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Company</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{job.employer?.company_name || job.employer?.full_name || 'Quantum Corp'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Location</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{job.location || 'Remote'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Compensation</span>
                        <span className="text-sm font-black text-[#caa2f7] font-headline">
                          {job.budget_min ? `$${job.budget_min.toLocaleString()} - ` : ''}${job.budget_max.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad] mb-1 block">Posted</span>
                        <span className="text-sm font-bold text-[#faf1f5]">{timeAgo(job.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-[#b0a9ad] text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2 italic">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex lg:flex-col justify-end items-end gap-3 flex-shrink-0 min-w-[140px]">
                    <Link href={`/jobs/${job.id}`} className="w-full text-center px-6 py-3 rounded-xl border border-[#4b474a] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#292428] transition-all text-[#faf1f5]">
                      Details
                    </Link>
                    <Link href={`/jobs/${job.id}`} className="w-full text-center px-6 py-3 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#caa2f7]/10 transition-all hover:brightness-110 active:scale-95">
                      Place Bid
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center bg-[#1c181c] rounded-[2rem] border border-dashed border-[#292428]">
               <span className="material-symbols-outlined text-6xl text-[#4b474a] mb-6">search_off</span>
               <h3 className="text-2xl font-bold mb-2">No missions match your protocol</h3>
               <p className="text-[#b0a9ad]">Try broadening your filters or clearing the search cache.</p>
            </div>
          )}
        </div>

        {/* Pagination (Static for now, but aligned) */}
        <footer className="mt-20 flex justify-center">
          <nav className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1c181c] border border-[#292428] text-[#b0a9ad] hover:text-[#caa2f7] transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-sm shadow-lg shadow-[#caa2f7]/20">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1c181c] border border-[#292428] text-[#b0a9ad] hover:text-[#caa2f7] transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </footer>
      </section>
    </div>
  );
}