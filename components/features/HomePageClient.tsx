'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'
import { StatCard, JobCard } from '@/components/features/InteractiveHomePage'

interface HomePageClientProps {
  jobsCount: number
  companiesCount: number
  seekersCount: number
  contractsCount: number
  featuredJobs: any[] | null
  featuredTalent: any[] | null
  communityPosts: any[] | null
}

export function HomePageClient({
  jobsCount,
  companiesCount,
  seekersCount,
  contractsCount,
  featuredJobs,
  featuredTalent,
  communityPosts,
}: HomePageClientProps) {
  const { t, dir } = useLanguage()

  const stats = [
    { label: t('homePage.stats.activeJobs'), val: `${(jobsCount || 0).toLocaleString()}+` },
    { label: t('homePage.stats.partnerCompanies'), val: `${(companiesCount || 0).toLocaleString()}+` },
    { label: t('homePage.stats.jobSeekers'), val: `${(seekersCount || 0).toLocaleString()}+` },
    { label: t('homePage.stats.successfulHires'), val: `${(contractsCount || 0).toLocaleString()}+` },
  ]

  const categories = [
    { nameKey: 'home.design', descKey: 'home.designDesc', icon: 'brush', query: 'Design' },
    { nameKey: 'home.dev', descKey: 'home.devDesc', icon: 'terminal', query: 'Developer' },
    { nameKey: 'home.aiData', descKey: 'home.aiDataDesc', icon: 'memory', query: 'AI' },
    { nameKey: 'home.sales', descKey: 'home.salesDesc', icon: 'campaign', query: 'Sales' },
    { nameKey: 'home.finance', descKey: 'home.financeDesc', icon: 'payments', query: 'Finance' },
    { nameKey: 'home.engineering', descKey: 'home.engineeringDesc', icon: 'architecture', query: 'Engineering' },
    { nameKey: 'home.healthcare', descKey: 'home.healthcareDesc', icon: 'monitor_heart', query: 'Healthcare' },
    { nameKey: 'home.vision2030', descKey: 'home.vision2030Desc', icon: 'rocket_launch', featured: true, query: 'Vision' },
  ]

  return (
    <div dir={dir}>
      {/* Stats Section */}
      <section className="py-20 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.val} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Industry */}
      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-bold tracking-tight">{t('homePage.browseByIndustry')}</h2>
              <p className="text-[#b0a9ad] text-lg font-light max-w-xl">{t('homePage.browseByIndustryDesc')}</p>
            </div>
            <Link href="/jobs/browse" className="text-[#caa2f7] font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:gap-6 transition-all group">
              {t('homePage.viewAllCategories')}
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_right_alt</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.query}
                href={`/jobs/browse?c=${cat.query}`}
                className={`p-10 rounded-[2rem] border transition-all duration-500 cursor-pointer group ${
                  cat.featured
                    ? 'bg-[#613471] border-[#caa2f7]/30 shadow-[0_20px_40px_rgba(97,52,113,0.3)]'
                    : 'bg-[#1c181c] border-[#292428] hover:bg-[#221e22] hover:border-[#caa2f7]/20 hover:-translate-y-2'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ${
                  cat.featured ? 'bg-white/10' : 'bg-[#100d10]'
                }`}>
                  <span className={`material-symbols-outlined text-4xl ${cat.featured ? 'text-white' : 'text-[#caa2f7]'}`}>{cat.icon}</span>
                </div>
                <h4 className={`text-2xl font-bold mb-3 ${cat.featured ? 'text-white' : 'text-[#faf1f5]'}`}>{t(cat.nameKey)}</h4>
                <p className={`text-sm leading-relaxed ${cat.featured ? 'text-white/70' : 'text-[#b0a9ad]'}`}>{t(cat.descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Elite Roles */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">{t('homePage.featuredEliteRoles')}</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">{t('homePage.featuredEliteRolesDesc')}</p>
          </div>

          <div className="space-y-6">
            {featuredJobs && featuredJobs.length > 0 ? (
              featuredJobs.map((job, i) => (
                <Link href={`/jobs/${job.id}`} key={i}>
                  <JobCard job={job} index={i} />
                </Link>
              ))
            ) : (
              <div className="p-20 bg-[#1c181c] rounded-[2.5rem] border border-dashed border-[#292428] text-center">
                <p className="text-[#b0a9ad] text-lg">{t('homePage.noFeaturedJobs')}</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/jobs/browse" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              {t('homePage.exploreAllOpportunities')}
            </Link>
          </div>
        </div>
      </section>

      {/* Top Talent Network */}
      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">{t('homePage.topTalentNetwork')}</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">{t('homePage.topTalentNetworkDesc')}</p>
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
                    {talent.skills && typeof talent.skills === 'string' && talent.skills.split(',').slice(0, 2).map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 text-[9px] font-bold rounded-full bg-[#613471]/30 text-[#f1bfff] uppercase tracking-widest">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-[#b0a9ad]">
                <p>{t('homePage.noTopTalent')}</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/talent" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              {t('homePage.viewAllTalent')}
            </Link>
          </div>
        </div>
      </section>

      {/* Community Insights */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">{t('homePage.communityInsights')}</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">{t('homePage.communityInsightsDesc')}</p>
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
                <p>{t('homePage.noCommunityPosts')}</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/community" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all">
              {t('homePage.joinCommunity')}
            </Link>
          </div>
        </div>
      </section>

      {/* ATS Optimizer */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('homePage.smartTools')}
                </span>
                <h2 className="font-headline text-5xl font-bold tracking-tight">
                  {t('homePage.optimizeProfileATS')}
                </h2>
              </div>
              <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">
                {t('homePage.atsOptimizerDesc')}
              </p>
              <ul className="space-y-4">
                {(['atsFeature1', 'atsFeature2', 'atsFeature3', 'atsFeature4'] as const).map((key) => (
                  <li key={key} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#caa2f7] text-2xl">check_circle</span>
                    <span className="text-[#faf1f5]">{t(`homePage.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Link
                  href="/ats-optimize"
                  className="inline-block px-10 py-4 rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(202,162,247,0.2)] hover:scale-[1.05] transition-all"
                >
                  {t('homePage.tryATSFree')}
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
                      <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">{t('homePage.yourATSScore')}</p>
                      <p className="font-headline text-3xl font-bold text-[#caa2f7]">92/100</p>
                    </div>
                  </div>
                  {[
                    { key: 'homePage.keywordOptimization', pct: '88%', w: 'w-[88%]' },
                    { key: 'homePage.formatting', pct: '95%', w: 'w-[95%]' },
                    { key: 'homePage.contentQuality', pct: '92%', w: 'w-[92%]' },
                  ].map(({ key, pct, w }) => (
                    <div key={key} className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[#b0a9ad]">{t(key)}</span>
                        <span className="text-xs font-bold text-[#caa2f7]">{pct}</span>
                      </div>
                      <div className="w-full h-2 bg-[#292428] rounded-full overflow-hidden">
                        <div className={`${w} h-full bg-[#caa2f7] rounded-full`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2030 / Our Mission */}
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
                  {t('homePage.ourMission')}
                </span>
                <h2 className="font-headline text-5xl font-bold tracking-tight">
                  {t('homePage.buildingFuture')}
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">{t('homePage.missionDesc1')}</p>
                <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">{t('homePage.missionDesc2')}</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">2030</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">{t('homePage.visionTarget')}</p>
                </div>
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">{t('homePage.saudiFocused')}</p>
                </div>
                <div className="text-center">
                  <p className="font-headline text-3xl font-bold text-[#caa2f7] mb-2">500K+</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold">{t('homePage.opportunities')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('homePage.successStories')}
            </span>
            <h2 className="font-headline text-5xl font-bold tracking-tight">{t('homePage.whatTalentSay')}</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">{t('homePage.testimonialDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Al-Rashid', role: 'UX Architect', company: 'NEOM', content: 'BidJobs connected me with NEOM when I was ready to impact Vision 2030. The platform\'s vetting process gave me confidence in the opportunities.', avatar: 'https://i.pravatar.cc/150?u=sarah1' },
              { name: 'Mohammed Al-Khaldi', role: 'Tech Lead', company: 'STC Digital', content: 'Finding specialized talent used to be impossible. BidJobs gave us access to Saudi Arabia\'s best engineers in just days.', avatar: 'https://i.pravatar.cc/150?u=mohammed1' },
              { name: 'Fatima Al-Saud', role: 'Innovation Director', company: 'Red Sea Global', content: 'The quality of talent on BidJobs is exceptional. We\'ve built our entire digital team through this platform.', avatar: 'https://i.pravatar.cc/150?u=fatima1' },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-[#1c181c] rounded-[2rem] border border-[#292428] hover:border-[#caa2f7]/20 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#caa2f7]/20" />
                  <div>
                    <h4 className="font-bold text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors">{testimonial.name}</h4>
                    <p className="text-[10px] text-[#4b474a] uppercase tracking-widest font-bold">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#b0a9ad] leading-relaxed mb-6 italic">"{testimonial.content}"</p>
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
                {t('homePage.ctaHeadline')} <br />
                <span className="text-[#caa2f7] non-italic">{t('homePage.ctaHeadlineSecond')}</span>
              </h2>
              <p className="text-[#b0a9ad] text-xl font-light max-w-xl mx-auto leading-relaxed">
                {t('homePage.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link href="/join" className="bg-[#caa2f7] text-[#431f6b] font-black px-12 py-5 rounded-[1.25rem] shadow-[0_15px_40px_rgba(202,162,247,0.3)] hover:scale-[1.05] transition-all duration-300 btn-gradient">
                  {t('homePage.createProfile')}
                </Link>
                <Link href="/jobs/browse" className="bg-[#100d10] border border-[#4b474a] text-[#faf1f5] font-black px-12 py-5 rounded-[1.25rem] hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all duration-300">
                  {t('homePage.exploreRoles')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
