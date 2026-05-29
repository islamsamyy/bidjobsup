"use client";

import PublicTalentCard from '@/components/features/PublicTalentCard'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'

export default function TalentPageClient({
  query,
  industry,
  talentsWithRatings,
  error,
  INDUSTRIES
}: {
  query: string
  industry: string
  talentsWithRatings: any[] | null
  error: any
  INDUSTRIES: string[]
}) {
  const { t, isRtl } = useLanguage();

  return (
    <div className={`bg-[#100d10] text-[#faf1f5] font-body min-h-screen flex flex-col selection:bg-[#caa2f7] selection:text-[#431f6b] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <section className="pt-40 pb-20 px-8 relative overflow-hidden border-b border-[#292428]/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#caa2f7]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase mb-8">
            {t('talentPage.specialistNetwork')}
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            {t('talentPage.findYour')} <br />
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">
              {t('talentPage.edge')}
            </span>
          </h1>
          
          {/* Search Bar */}
          <form action="/talent" method="GET" className="max-w-3xl mx-auto bg-[#1c181c] p-2 rounded-2xl border border-[#292428] shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative">
              <span className={`material-symbols-outlined absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-[#4b474a]`}>search</span>
              <input
                type="text"
                name="query"
                placeholder={t('talentPage.searchPlaceholder')}
                defaultValue={query}
                className={`w-full bg-transparent border-none focus:ring-0 text-sm font-light ${isRtl ? 'pr-12' : 'pl-12'} h-14 placeholder:text-[#4b474a]`}
              />
            </div>
            <div className="h-14 w-px bg-[#292428] hidden md:block" />
            <select name="industry" defaultValue={industry} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[#faf1f5] h-14 px-6 uppercase tracking-widest cursor-pointer">
              <option value="">{t('talentPage.allIndustries')}</option>
              {INDUSTRIES.map(i => (
                <option key={i} value={i} className="bg-[#1c181c]">{i}</option>
              ))}
            </select>
            <button type="submit" className="px-8 h-14 rounded-xl bg-[#caa2f7] text-[#431f6b] font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
              {t('talentPage.filterTalent')}
            </button>
          </form>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-20">
        {error ? (
          <div className="text-center py-20 bg-[#1c181c] rounded-3xl border border-[#ff6e84]/20">
            <span className="material-symbols-outlined text-[#ff6e84] text-5xl mb-4">error</span>
            <p className="text-[#ff6e84] font-black uppercase tracking-widest">{t('talentPage.protocolError')}</p>
          </div>
        ) : !talentsWithRatings || talentsWithRatings.length === 0 ? (
          <div className="text-center py-40">
            <span className="material-symbols-outlined text-[#4b474a] text-6xl mb-6">person_search</span>
            <h3 className="text-3xl font-headline font-bold text-[#faf1f5] mb-2">{t('talentPage.noTalentFound')}</h3>
            <p className="text-[#b0a9ad] font-light">{t('talentPage.noTalentFoundDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {talentsWithRatings.map((talent: any) => (
              <PublicTalentCard
                key={talent.id}
                talent={{
                  id: talent.id,
                  full_name: talent.full_name,
                  username: talent.username,
                  bio: talent.bio,
                  avatar_url: talent.avatar_url,
                  location: talent.location,
                  hourly_rate: talent.hourly_rate,
                  experience_level: talent.experience_level,
                  industry: talent.industry,
                  skills: talent.skills,
                  role: talent.role || 'user',
                  avgRating: talent.avgRating,
                  reviewCount: talent.reviewCount,
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Support */}
      <section className="bg-[#1c181c] border-t border-[#292428] py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h2 className="text-4xl font-headline font-bold text-[#faf1f5] mb-4">{t('talentPage.readyToStart')}</h2>
            <p className="text-[#b0a9ad] font-light max-w-md">{t('talentPage.connectDirectly')}</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/join" 
              className="px-10 py-5 rounded-xl bg-transparent border border-[#caa2f7] text-[#caa2f7] font-black text-xs uppercase tracking-widest hover:bg-[#caa2f7] hover:text-[#431f6b] transition-all"
            >
              {t('talentPage.postMandate')}
            </Link>
            <Link 
              href="/sign-in" 
              className="px-10 py-5 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#caa2f7]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              {t('talentPage.joinNetwork')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
