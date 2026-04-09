import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InteractiveHomePage, StatCard, JobCard } from "@/components/features/InteractiveHomePage";

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

  // 3. Fetch Featured Talent (Top Rated)
  const { data: featuredTalent } = await supabase
    .from('users')
    .select(`
      id,
      full_name,
      avatar_url,
      bio,
      skills,
      location,
      experience_level,
      user_type
    `)
    .eq('user_type', 'jobseeker')
    .order('created_at', { ascending: false })
    .limit(6);

  // 4. Fetch Recent Community Posts for testimonials
  const { data: communityPosts } = await supabase
    .from('community_posts')
    .select(`
      *,
      author:user_id (
        full_name,
        avatar_url
      )
    `)
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
      <InteractiveHomePage />
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

          <div className="relative group perspective-1000 h-[650px] flex items-center justify-center">
            {/* Animated background orbs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#caa2f7]/15 rounded-full blur-[100px] group-hover:bg-[#caa2f7]/25 transition-colors duration-1000 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#613471]/15 rounded-full blur-[100px] group-hover:bg-[#613471]/25 transition-colors duration-1000 animate-pulse delay-500"></div>

            {/* BidJobs Logo SVG Container */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-12">
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotateZ(0deg); }
                  50% { transform: translateY(-20px) rotateZ(5deg); }
                }
                @keyframes glow {
                  0%, 100% { filter: drop-shadow(0 0 20px rgba(202, 162, 247, 0.3)); }
                  50% { filter: drop-shadow(0 0 40px rgba(202, 162, 247, 0.6)); }
                }
                .animate-float {
                  animation: float 6s ease-in-out infinite;
                }
                .animate-glow {
                  animation: glow 3s ease-in-out infinite;
                }
              `}</style>

              <svg
                className="animate-float animate-glow w-64 h-64"
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Palm Leaves */}
                <path d="M120 20 Q130 50 125 80" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
                <path d="M120 20 Q110 50 115 80" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
                <path d="M120 20 Q145 45 160 70" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
                <path d="M120 20 Q95 45 80 70" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
                <path d="M120 20 Q155 55 170 95" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
                <path d="M120 20 Q85 55 70 95" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
                <path d="M120 20 Q160 70 160 120" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>
                <path d="M120 20 Q80 70 80 120" stroke="#caa2f7" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>

                {/* Building */}
                <rect x="90" y="100" width="60" height="80" fill="#caa2f7" opacity="0.9"/>
                <rect x="95" y="105" width="50" height="70" fill="#100d10"/>

                {/* Windows */}
                {[0, 1, 2].map((row) => (
                  [0, 1, 2, 3].map((col) => (
                    <rect
                      key={`window-${row}-${col}`}
                      x={97 + col * 12}
                      y={107 + row * 18}
                      width="10"
                      height="10"
                      fill="#caa2f7"
                      opacity="0.6"
                    />
                  ))
                ))}
              </svg>

              <div className="text-center max-w-md">
                <h3 className="text-3xl font-headline font-bold text-[#caa2f7] mb-2">BidJobs Platform</h3>
                <p className="text-sm text-[#b0a9ad]">Where elite talent builds tomorrow's vision</p>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-12 -left-12 z-20 p-8 bg-[#100d10]/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-[#caa2f7]/20 max-w-[280px] group-hover:translate-x-4 transition-transform duration-500 hover:scale-105">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#caa2f7] to-[#613471] flex items-center justify-center shadow-[0_0_15px_rgba(202,162,247,0.3)] animate-pulse">
                  <span className="material-symbols-outlined text-white text-3xl">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] text-[#b0a9ad] uppercase tracking-widest font-bold">Active Projects</p>
                  <p className="font-headline font-bold text-[#faf1f5] text-lg">NEOM High-Speed Link</p>
                </div>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#100d10] bg-gradient-to-br from-[#caa2f7] to-[#613471] overflow-hidden hover:scale-110 transition-transform">
                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#100d10] bg-[#caa2f7] text-[10px] font-black text-[#431f6b] hover:scale-110 transition-transform">12k+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.val} label={stat.label} />
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
                >
                  <JobCard job={job} index={i} />
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

      {/* Featured Talent Showcase */}
      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">Top Talent Network</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">Connect with vetted specialists shaping Saudi Arabia's future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTalent && featuredTalent.length > 0 ? (
              featuredTalent.map((talent) => (
                <Link
                  key={talent.id}
                  href={`/talent/${talent.id}`}
                  className="group p-8 bg-[#1c181c] border border-[#292428] rounded-[2rem] hover:bg-[#221e22] hover:border-[#caa2f7]/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#100d10] border border-[#292428] overflow-hidden flex items-center justify-center">
                      {talent.avatar_url ? (
                        <img src={talent.avatar_url} alt={talent.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#caa2f7] text-2xl">person</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors">{talent.full_name}</h4>
                      <p className="text-xs text-[#b0a9ad] uppercase tracking-widest font-bold">{talent.experience_level || 'Professional'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#b0a9ad] mb-4 line-clamp-2">{talent.bio || 'Elite specialist talent'}</p>
                  {talent.location && (
                    <p className="text-xs text-[#4b474a] flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {talent.location}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#292428]">
                    {talent.skills && typeof talent.skills === 'string' && talent.skills.split(',').slice(0, 2).map((skill, i) => (
                      <span key={i} className="px-3 py-1 text-[9px] font-bold rounded-full bg-[#613471]/30 text-[#f1bfff] uppercase tracking-widest">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-[#b0a9ad]">
                <p>Top talent members will appear here</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/talent" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              VIEW ALL TALENT
            </Link>
          </div>
        </div>
      </section>

      {/* Community Testimonials/Recent Activity */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">Community Insights</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">Latest updates and discussions from our network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityPosts && communityPosts.length > 0 ? (
              communityPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/article?id=${post.id}`}
                  className="group p-8 bg-[#1c181c] border border-[#292428] rounded-[2rem] hover:bg-[#221e22] hover:border-[#caa2f7]/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#100d10] overflow-hidden flex items-center justify-center shrink-0">
                      {post.author?.avatar_url ? (
                        <img src={post.author.avatar_url} alt={post.author?.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#caa2f7]">person</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#faf1f5]">{post.author?.full_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-[#4b474a] uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h4 className="font-bold text-[#faf1f5] mb-3 group-hover:text-[#caa2f7] transition-colors line-clamp-2 text-lg">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[#b0a9ad] line-clamp-3 mb-6">{post.content}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-[#292428] text-[10px] text-[#4b474a] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      {post.likes_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">comment</span>
                      {post.comments_count || 0}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-[#b0a9ad]">
                <p>Community posts will appear here</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/community" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              JOIN THE COMMUNITY
            </Link>
          </div>
        </div>
      </section>

      {/* ATS Optimizer Service */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
                  SMART TOOLS
                </span>
                <h2 className="font-headline text-5xl font-bold tracking-tight">
                  Optimize Your Profile for ATS Systems
                </h2>
              </div>
              <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">
                Our AI-powered ATS Optimizer analyzes your resume and portfolio against the latest applicant tracking systems. Get real-time feedback on keywords, formatting, and content optimization to ensure your profile ranks at the top of employer searches.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#caa2f7] text-2xl">check_circle</span>
                  <span className="text-[#faf1f5]">AI-powered keyword analysis</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#caa2f7] text-2xl">check_circle</span>
                  <span className="text-[#faf1f5]">Real-time ATS compatibility scoring</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#caa2f7] text-2xl">check_circle</span>
                  <span className="text-[#faf1f5]">Actionable improvement recommendations</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#caa2f7] text-2xl">check_circle</span>
                  <span className="text-[#faf1f5]">Competitive performance benchmarking</span>
                </li>
              </ul>
              <div>
                <Link
                  href="/ats-optimize"
                  className="inline-block px-10 py-4 rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(202,162,247,0.2)] hover:scale-[1.05] transition-all"
                >
                  TRY ATS OPTIMIZER FREE
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#caa2f7]/10 rounded-full blur-[100px]"></div>
              <div className="relative z-10 p-12 rounded-[2rem] bg-[#100d10] border border-[#caa2f7]/20 backdrop-blur-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-[#292428]">
                    <span className="material-symbols-outlined text-[#caa2f7] text-3xl">assessment</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">Your ATS Score</p>
                      <p className="font-headline text-3xl font-bold text-[#caa2f7]">92/100</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#b0a9ad]">Keyword Optimization</span>
                      <span className="text-xs font-bold text-[#caa2f7]">88%</span>
                    </div>
                    <div className="w-full h-2 bg-[#292428] rounded-full overflow-hidden">
                      <div className="w-[88%] h-full bg-[#caa2f7] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#b0a9ad]">Formatting</span>
                      <span className="text-xs font-bold text-[#caa2f7]">95%</span>
                    </div>
                    <div className="w-full h-2 bg-[#292428] rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-[#caa2f7] rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#b0a9ad]">Content Quality</span>
                      <span className="text-xs font-bold text-[#caa2f7]">92%</span>
                    </div>
                    <div className="w-full h-2 bg-[#292428] rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-[#caa2f7] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2030 Section */}
      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-gradient-to-br from-[#caa2f7] to-[#eab3fa] opacity-10 rounded-full blur-[120px]"></div>
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-[#caa2f7]/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                  alt="Vision 2030"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
                  OUR MISSION
                </span>
                <h2 className="font-headline text-5xl font-bold tracking-tight">
                  Building Saudi Arabia's Digital Future
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">
                  BidJobs is committed to realizing Vision 2030 by empowering Saudi Arabia's most talented professionals and innovative organizations. We connect elite specialists with world-leading enterprises transforming the Kingdom's economy.
                </p>
                <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">
                  From NEOM's groundbreaking architecture to emerging tech startups, we're the trusted network enabling Saudi talent to shape the future of work, innovation, and economic growth.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">2030</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">Vision Target</p>
                </div>
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">Saudi-Focused</p>
                </div>
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">500K+</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">Opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
              SUCCESS STORIES
            </span>
            <h2 className="font-headline text-5xl font-bold tracking-tight">What Elite Talent Say</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">
              Hear from professionals and organizations transforming their careers and businesses through BidJobs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Al-Rashid",
                role: "UX Architect",
                company: "NEOM",
                content: "BidJobs connected me with NEOM when I was ready to impact Vision 2030. The platform's vetting process gave me confidence in the opportunities.",
                avatar: "https://i.pravatar.cc/150?u=sarah1"
              },
              {
                name: "Mohammed Al-Khaldi",
                role: "Tech Lead",
                company: "STC Digital",
                content: "Finding specialized talent used to be impossible. BidJobs gave us access to Saudi Arabia's best engineers in just days.",
                avatar: "https://i.pravatar.cc/150?u=mohammed1"
              },
              {
                name: "Fatima Al-Saud",
                role: "Innovation Director",
                company: "Red Sea Global",
                content: "The quality of talent on BidJobs is exceptional. We've built our entire digital team through this platform.",
                avatar: "https://i.pravatar.cc/150?u=fatima1"
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 bg-[#1c181c] rounded-[2rem] border border-[#292428] hover:border-[#caa2f7]/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#caa2f7]/20"
                  />
                  <div>
                    <h4 className="font-bold text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors">{testimonial.name}</h4>
                    <p className="text-[10px] text-[#4b474a] uppercase tracking-widest font-bold">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#b0a9ad] leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#caa2f7] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {testimonial.company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
