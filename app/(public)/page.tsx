import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "BidJobs — Where Elite Talent Meets Opportunity",
  description:
    "A premium job marketplace connecting employers with world-class freelancers. Post jobs, submit bids, and build your professional reputation in the new economy.",
  openGraph: {
    title: "BidJobs — Where Elite Talent Meets Opportunity",
    description:
      "A premium job marketplace connecting employers with world-class freelancers.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BidJobs — Where Elite Talent Meets Opportunity",
    description:
      "A premium job marketplace connecting employers with world-class freelancers.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function LandingPage() {
  const supabase = await createClient();

  // 1. Fetch Real Stats
  const { count: jobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open');

  const { count: companiesCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'employer');

  const { count: seekersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'jobseeker');

  // 2. Fetch Featured Jobs
  const { data: featuredJobs } = await supabase
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
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(3);

  async function handleSearch(formData: FormData) {
    'use server'
    const query = formData.get('query');
    const location = formData.get('location');
    redirect(`/jobs/browse?q=${query || ''}&l=${location || ''}`);
  }

  // Calculate placement rate from contracts vs total bids
  const { count: contractsCount } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { label: "Active Jobs", val: `${(jobsCount || 0).toLocaleString()}+` },
    { label: "Partner Companies", val: `${(companiesCount || 0).toLocaleString()}+` },
    { label: "Job Seekers", val: `${(seekersCount || 0).toLocaleString()}+` },
    { label: "Successful Hires", val: `${(contractsCount || 0).toLocaleString()}+` }
  ];

  return (
    <>
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#eab3fa]/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-10 animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
              EMPOWERING SAUDI VISION 2030
            </span>
            
            <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 bg-gradient-to-br from-[#faf1f5] to-[#b0a9ad] bg-clip-text text-transparent">
              BUILD YOUR FUTURE.<br />
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">
                SHAPE THE WORLD.
              </span>
            </h1>
            
            <p className="text-xl text-[#b0a9ad] max-w-xl leading-relaxed font-light">
              Connect with Saudi Arabia's most prestigious organizations. From NEOM's architectural marvels to STC's digital frontiers, your elite career starts here.
            </p>

            <form action={handleSearch} className="p-2.5 rounded-2xl bg-[#1c181c]/50 backdrop-blur-xl border border-[#4b474a]/20 shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl group hover:border-[#caa2f7]/20 transition-all duration-300">
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">work</span>
                <input 
                  name="query"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium" 
                  placeholder="Job title, skills, or company" 
                  type="text" 
                />
              </div>
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">location_on</span>
                <input 
                  name="location"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium" 
                  placeholder="Riyadh, NEOM, Jeddah" 
                  type="text" 
                />
              </div>
              <button 
                type="submit"
                className="bg-[#caa2f7] hover:bg-[#bc95e9] text-[#431f6b] font-black px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(202,162,247,0.3)] hover:scale-[0.98] transition-all duration-200"
              >
                SEARCH
              </button>
            </form>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#caa2f7]/10 rounded-full blur-[80px] group-hover:bg-[#caa2f7]/20 transition-colors duration-700"></div>
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group-hover:rotate-0 transition-transform duration-700 hover:scale-[1.02] cursor-pointer">
              <img 
                alt="Elite Workspace" 
                className="w-full h-[650px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
              />
              
              <div className="absolute bottom-12 -left-12 z-20 p-8 bg-[#100d10]/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-[#caa2f7]/20 max-w-[280px] group-hover:translate-x-4 transition-transform duration-500">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#613471] flex items-center justify-center shadow-[0_0_15px_rgba(202,162,247,0.2)]">
                    <span className="material-symbols-outlined text-[#caa2f7] text-3xl">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#b0a9ad] uppercase tracking-widest font-bold">Active Projects</p>
                    <p className="font-headline font-bold text-[#faf1f5] text-lg">NEOM High-Speed Link</p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#100d10] bg-[#292428] overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#100d10] bg-[#caa2f7] text-[10px] font-black text-[#431f6b]">12k+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <h3 className="font-headline text-5xl font-black text-[#caa2f7] mb-3 group-hover:scale-110 transition-transform">
                  {stat.val}
                </h3>
                <p className="text-[#b0a9ad] font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-bold tracking-tight">Browse by Industry</h2>
              <p className="text-[#b0a9ad] text-lg font-light max-w-xl">Curated opportunities across the Kingdom's booming sectors.</p>
            </div>
            <Link href="/jobs/browse" className="text-[#caa2f7] font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:gap-6 transition-all group">
              View All Categories 
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_right_alt</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Design", desc: "Product, UX/UI, Creative", icon: "brush", query: "Design" },
              { name: "Dev", desc: "Full-stack, Mobile, Web", icon: "terminal", query: "Developer" },
              { name: "AI & Data", desc: "ML, Strategic Analysts", icon: "memory", query: "AI" },
              { name: "Sales", desc: "Enterprise, Strategic Growth", icon: "campaign", query: "Sales" },
              { name: "Finance", desc: "Investment, FinTech", icon: "payments", query: "Finance" },
              { name: "Engineering", desc: "Civil, Mechanical, Aero", icon: "architecture", query: "Engineering" },
              { name: "Healthcare", desc: "Digital Health, Medicine", icon: "monitor_heart", query: "Healthcare" },
              { name: "Vision 2030", desc: "NEOM, Red Sea, Qiddiya", icon: "rocket_launch", featured: true, query: "Vision" }
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs/browse?c=${cat.query}`}
                className={`p-10 rounded-[2rem] border transition-all duration-500 cursor-pointer group ${
                  cat.featured 
                    ? "bg-[#613471] border-[#caa2f7]/30 shadow-[0_20px_40px_rgba(97,52,113,0.3)]" 
                    : "bg-[#1c181c] border-[#292428] hover:bg-[#221e22] hover:border-[#caa2f7]/20 hover:-translate-y-2"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ${
                  cat.featured ? "bg-white/10" : "bg-[#100d10]"
                }`}>
                  <span className={`material-symbols-outlined text-4xl ${cat.featured ? "text-white" : "text-[#caa2f7]"}`}>{cat.icon}</span>
                </div>
                <h4 className={`text-2xl font-bold mb-3 ${cat.featured ? "text-white" : "text-[#faf1f5]"}`}>{cat.name}</h4>
                <p className={`text-sm leading-relaxed ${cat.featured ? "text-white/70" : "text-[#b0a9ad]"}`}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">Featured Elite Roles</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">High-impact opportunities at world-leading organizations currently hiring through BidJobs.</p>
          </div>

          <div className="space-y-6">
            {featuredJobs && featuredJobs.length > 0 ? (
              featuredJobs.map((job, i) => (
                <Link 
                  href={`/jobs/${job.id}`}
                  key={i} 
                  className="group flex flex-col md:flex-row items-center justify-between p-10 bg-[#1c181c] border border-[#292428] rounded-[2.5rem] hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#caa2f7]/50"
                >
                  <div className="flex items-center gap-8 mb-8 md:mb-0">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-[#100d10] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                      {job.employer?.avatar_url ? (
                        <img src={job.employer.avatar_url} alt={job.employer?.company_name || job.employer?.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#caa2f7] text-4xl">corporate_fare</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-[#caa2f7] transition-colors">{job.title}</h3>
                      <p className="text-[#b0a9ad] text-sm flex items-center gap-3">
                        <span className="font-bold text-[#faf1f5]/80">{job.employer?.company_name || job.employer?.full_name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4b474a]"></span>
                        {job.employer?.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                    <div className="hidden sm:flex flex-col gap-2 items-end">
                      <span className="px-4 py-1.5 rounded-full bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black tracking-widest whitespace-nowrap">
                        {job.budget_min && job.budget_max ? `$${(job.budget_min as number).toLocaleString()} - $${(job.budget_max as number).toLocaleString()}` : "Elite Salary"}
                      </span>
                      <span className="text-[10px] text-[#b0a9ad] uppercase tracking-[0.2em] font-bold capitalize">{job.budget_type === 'hourly' ? 'Contract' : 'Full-time'}</span>
                    </div>
                    <div className="bg-[#faf1f5] hover:bg-[#caa2f7] text-[#100d10] font-black px-12 py-4 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(202,162,247,0.1)] group-hover:shadow-[0_10px_30px_rgba(202,162,247,0.3)] whitespace-nowrap text-center">
                      APPLY ROLE
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-20 bg-[#1c181c] rounded-[2.5rem] border border-dashed border-[#292428] text-center">
                <p className="text-[#b0a9ad] text-lg">No featured missions available at the moment. Check back soon.</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/jobs/browse" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              EXPLORE ALL OPPORTUNITIES
            </Link>
          </div>
        </div>
      </section>

      <section className="py-40">
        <div className="max-w-5xl mx-auto px-8">
          <div className="relative p-24 bg-gradient-to-br from-[#1c181c] to-[#292428] rounded-[4rem] text-center overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] group">
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#613471]/20 rounded-full blur-[100px] group-hover:bg-[#613471]/30 transition-colors duration-1000"></div>
            
            <div className="relative z-10 space-y-10">
              <h2 className="font-headline text-6xl font-black tracking-tighter leading-none italic uppercase">
                Ready to Build <br /> 
                <span className="text-[#caa2f7] non-italic">Tomorrow's World?</span>
              </h2>
              <p className="text-[#b0a9ad] text-xl font-light max-w-xl mx-auto leading-relaxed">
                Join the Kingdom's most exclusive talent network and take the first step towards your career peak.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link href="/join" className="bg-[#caa2f7] text-[#431f6b] font-black px-12 py-5 rounded-[1.25rem] shadow-[0_15px_40px_rgba(202,162,247,0.3)] hover:scale-[1.05] transition-all duration-300 btn-gradient">
                  CREATE PROFILE
                </Link>
                <Link href="/jobs/browse" className="bg-[#100d10] border border-[#4b474a] text-[#faf1f5] font-black px-12 py-5 rounded-[1.25rem] hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all duration-300">
                  EXPLORE ROLES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
