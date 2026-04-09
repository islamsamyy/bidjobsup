import { createClient } from '@/lib/supabase/server'
import JobCard from '@/components/features/JobCard'
import JobFilterPanel from '@/components/features/JobFilterPanel'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { handleSearch } from './actions'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BrowseJobsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams;

  const query = params.q || '';
  const location = params.l || '';
  const category = params.c || '';
  const budgetMin = params.budget_min ? Number(params.budget_min) : null;
  const budgetMax = params.budget_max ? Number(params.budget_max) : null;
  const jobType = params.job_type || '';
  const experienceLevel = params.experience_level || '';
  const sort = params.sort || 'newest';

  // 1. Fetch Real Industry Counts
  const { data: categoryStats } = await supabase
    .from('jobs')
    .select('category')
    .eq('status', 'open')

  const counts: Record<string, number> = {}
  categoryStats?.forEach(j => {
    const cat = j.category || 'Other'
    counts[cat] = (counts[cat] || 0) + 1
  })

  // 2. Fetch Jobs with advanced filtering
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

  // Apply text filters
  if (query) {
    jobsQuery = jobsQuery.ilike('title', `%${query}%`);
  }
  if (location) {
    jobsQuery = jobsQuery.ilike('location', `%${location}%`);
  }
  if (category) {
    jobsQuery = jobsQuery.eq('category', category);
  }

  // Apply numeric filters for budget range
  if (budgetMin !== null) {
    jobsQuery = jobsQuery.gte('budget_max', budgetMin);
  }
  if (budgetMax !== null) {
    jobsQuery = jobsQuery.lte('budget_min', budgetMax);
  }

  // Apply job type filter
  if (jobType) {
    jobsQuery = jobsQuery.eq('job_type', jobType);
  }

  // Apply experience level filter
  if (experienceLevel) {
    jobsQuery = jobsQuery.eq('experience_level', experienceLevel);
  }

  // Apply sorting
  if (sort === 'salary_high') {
    jobsQuery = jobsQuery.order('budget_max', { ascending: false });
  } else if (sort === 'salary_low') {
    jobsQuery = jobsQuery.order('budget_min', { ascending: true });
  } else {
    jobsQuery = jobsQuery.order('created_at', { ascending: false });
  }

  const { data: jobs, error } = await jobsQuery.limit(50);

  if (error) {
    throw new Error(`Database Error: ${error.message} (Code: ${error.code})`);
  }

  const industries = [
    { 
      name: "Creative Architecture", 
      icon: "architecture", 
      count: counts['Creative Architecture'] || (counts['Design'] || 0), 
      img: "https://images.unsplash.com/photo-1487958444663-51ce619699d8?auto=format&fit=crop&q=80&w=2070" 
    },
    { 
      name: "AI Engineering", 
      icon: "psychology", 
      count: counts['AI Engineering'] || 0, 
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070" 
    },
    { 
      name: "XR Development", 
      icon: "vrpano", 
      count: counts['XR Development'] || 0, 
      img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=2070" 
    }
  ]

  // handleSearch logic moved to actions.ts

  return (
    <main className="max-w-screen-2xl mx-auto px-8 pt-12 pb-32">
      {/* Hero & Search Section */}
      <section className="mb-24 relative overflow-hidden py-16">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-[#caa2f7]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#eab3fa]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="mb-12 relative z-10 animate-fade-in">
          <h1 className="font-headline text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tighter">
            Secure your next <br/>
            <span className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] bg-clip-text text-transparent italic font-light">high-stakes mission.</span>
          </h1>
          <p className="text-[#b0a9ad] text-xl max-w-2xl font-light leading-relaxed">
            Connecting elite talent with avant-garde industries. Experience the next generation of professional acquisition.
          </p>
        </div>

        {/* Search Module */}
        <div className="bg-[#1c181c]/50 backdrop-blur-xl p-2.5 rounded-3xl border border-[#292428] shadow-2xl relative z-10 group hover:border-[#caa2f7]/20 transition-all duration-300">
          <form action={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#100d10] p-4 rounded-2xl flex items-center gap-4 border border-[#292428] focus-within:border-[#caa2f7]/50 transition-all">
              <span className="material-symbols-outlined text-[#caa2f7]">work</span>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">Role</span>
                <input 
                  name="query"
                  defaultValue={query}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[#faf1f5] placeholder:text-[#4b474a] font-medium text-sm w-full" 
                  placeholder="Creative Architect" 
                  type="text"
                />
              </div>
            </div>
            
            <div className="bg-[#100d10] p-4 rounded-2xl flex items-center gap-4 border border-[#292428] focus-within:border-[#caa2f7]/50 transition-all">
              <span className="material-symbols-outlined text-[#caa2f7]">location_on</span>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">Location</span>
                <input 
                  name="location"
                  defaultValue={location}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[#faf1f5] placeholder:text-[#4b474a] font-medium text-sm w-full" 
                  placeholder="NEOM / Remote" 
                  type="text"
                />
              </div>
            </div>

            <div className="bg-[#100d10] p-4 rounded-2xl flex items-center gap-4 border border-[#292428] focus-within:border-[#caa2f7]/50 transition-all">
              <span className="material-symbols-outlined text-[#caa2f7]">category</span>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">Industry</span>
                <select 
                  name="category"
                  defaultValue={category}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[#faf1f5] font-medium text-sm appearance-none cursor-pointer w-full"
                >
                  <option value="">All Industries</option>
                  <option value="AI Engineering">AI Engineering</option>
                  <option value="XR Development">XR Development</option>
                  <option value="Sustainable Architecture">Sustainable Arch</option>
                  <option value="Design">Design</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="bg-[#caa2f7] hover:bg-[#bc95e9] text-[#431f6b] font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(202,162,247,0.3)] hover:scale-[0.98] group"
            >
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">search</span>
              SEARCH BIDS
            </button>
          </form>
        </div>
      </section>

      {/* Featured Industries */}
      <section className="mb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#caa2f7] font-black tracking-[0.2em] uppercase text-[10px] mb-3 block">CURATED SECTORS</span>
            <h2 className="font-headline text-4xl font-bold tracking-tight">Elite Clusters</h2>
          </div>
          <Link href="/jobs" className="text-[#caa2f7] hover:text-[#faf1f5] transition-colors flex items-center gap-3 text-xs font-black uppercase tracking-widest group">
            All Sectors 
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {industries.map((ind) => (
            <Link 
              key={ind.name} 
              href={`/jobs/browse?c=${ind.name}`}
              className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] bg-[#1c181c] flex items-end p-10 transition-all hover:-translate-y-2 border border-[#292428] hover:border-[#caa2f7]/30 shadow-2xl cursor-pointer"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" 
                src={ind.img} 
                alt={ind.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100d10] via-transparent to-transparent"></div>
              <div className="relative z-10 w-full">
                <div className="w-14 h-14 rounded-2xl bg-[#613471]/30 backdrop-blur-xl flex items-center justify-center mb-6 group-hover:bg-[#caa2f7] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(202,162,247,0.4)]">
                  <span className="material-symbols-outlined text-[#caa2f7] group-hover:text-[#431f6b] text-3xl">{ind.icon}</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-3 tracking-tight">{ind.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4b474a]">{ind.count} Active Roles</span>
                  <span className="material-symbols-outlined text-[#caa2f7] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">north_east</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="mb-12">
        <JobFilterPanel
          defaultValues={{
            budget_min: budgetMin || undefined,
            budget_max: budgetMax || undefined,
            job_type: jobType || undefined,
            experience_level: experienceLevel || undefined,
            sort: sort || 'newest'
          }}
        />
      </section>

      {/* Missions Feed */}
      <section className="mb-32">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Available Missions</h2>
            <p className="text-[#b0a9ad] font-light">
              {query || location || category || budgetMin || budgetMax || jobType || experienceLevel ? `Filtered results for your selection` : `Hottest opportunities right now`}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-5 py-2 rounded-xl bg-[#613471] text-[#f1bfff] text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(97,52,113,0.3)]">Recommended</button>
            <button className="px-5 py-2 rounded-xl bg-[#1c181c] text-[#b0a9ad] text-[10px] font-black uppercase tracking-widest border border-[#292428] hover:border-[#caa2f7]/20 transition-all">Recent</button>
          </div>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-[#1c181c]/50 backdrop-blur-xl rounded-[2.5rem] p-24 text-center border border-dashed border-[#292428]">
            <div className="w-24 h-24 bg-[#100d10] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#292428]">
               <span className="material-symbols-outlined text-5xl text-[#4b474a]">search_off</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 italic">No Missions Detected</h3>
            <p className="text-[#b0a9ad] text-lg font-light mb-12 max-w-md mx-auto">None of the broadcasted roles match your current parameters. Reset search or broaden your filters.</p>
            <Link href="/jobs/browse" className="bg-[#caa2f7] text-[#431f6b] font-black px-12 py-4 rounded-xl shadow-[0_10px_30px_rgba(202,162,247,0.2)] hover:scale-[0.98] transition-all">
              RESET SEARCH
            </Link>
          </div>
        )}
      </section>

      {/* Global Context */}
      <section className="bg-gradient-to-br from-[#1c181c] to-[#100d10] rounded-[3rem] p-20 relative overflow-hidden border border-[#292428] shadow-2xl">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-[0.03] pointer-events-none transform translate-x-32 group">
          <span className="material-symbols-outlined text-[35rem] text-[#caa2f7]">apartment</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10 text-center md:text-left">
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#caa2f7] tracking-tighter drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">1.2k+</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">Live Mission Clusters</span>
          </div>
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#eab3fa] tracking-tighter drop-shadow-[0_0_20px_rgba(234,179,250,0.3)]">$42M</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">Capital Inflow</span>
          </div>
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#faf1f5] tracking-tighter shadow-white/10">98.4%</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">Client Alignment</span>
          </div>
        </div>
      </section>
    </main>
  )
}