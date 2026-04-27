'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'

interface HomePageContentProps {
  featuredJobs: any[] | null
  featuredTalent: any[] | null
  communityPosts: any[] | null
  stats: any[]
}

export function HomePageContent({
  featuredJobs,
  featuredTalent,
  communityPosts,
  stats,
}: HomePageContentProps) {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir}>
      {/* Hero Section - Browse by Industry */}
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
                <Link
                  href={`/jobs/${job.id}`}
                  key={i}
                >
                  {/* JobCard Component */}
                  <div className="p-8 bg-[#1c181c] border border-[#292428] rounded-[2rem] hover:border-[#caa2f7]/20 transition-all">
                    <h3 className="text-xl font-bold text-[#faf1f5] mb-2">{job.title}</h3>
                    <p className="text-[#b0a9ad] mb-4">{job.description?.slice(0, 100)}...</p>
                  </div>
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
