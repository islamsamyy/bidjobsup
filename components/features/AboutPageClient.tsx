'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'

export function AboutPageClient() {
  const { t, dir } = useLanguage()

  const team = [
    { nameKey: 'aboutPage.founderName', roleKey: 'aboutPage.founderRole', bioKey: 'aboutPage.founderBio', initials: 'KF' },
    { nameKey: 'aboutPage.cooName', roleKey: 'aboutPage.cooRole', bioKey: 'aboutPage.cooBio', initials: 'SB' },
    { nameKey: 'aboutPage.ctoName', roleKey: 'aboutPage.ctoRole', bioKey: 'aboutPage.ctoBio', initials: 'MS' },
  ]

  return (
    <div dir={dir} className="bg-[#100d10] text-[#faf1f5] font-body min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="pt-48 pb-32 px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
            BidJobs
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none">
            {t('aboutPage.heroTitle')}{' '}
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_40px_rgba(202,162,247,0.3)]">
              {t('aboutPage.heroAccent')}
            </span>
          </h1>
          <p className="text-[#b0a9ad] text-xl font-light max-w-2xl mx-auto leading-relaxed">
            {t('aboutPage.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Vision Alignment */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
              {t('aboutPage.visionBadge')}
            </span>
            <h2 className="font-headline text-5xl font-bold tracking-tight leading-tight">
              {t('aboutPage.visionTitle')}
            </h2>
            <p className="text-[#b0a9ad] text-lg font-light leading-relaxed">
              {t('aboutPage.visionDesc')}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-[#1c181c] border border-[#292428] rounded-2xl">
                <p className="font-headline text-4xl font-black text-[#caa2f7] mb-2">2030</p>
                <p className="text-[10px] uppercase tracking-widest text-[#585457] font-bold">{t('aboutPage.visionGoal')}</p>
              </div>
              <div className="p-6 bg-[#1c181c] border border-[#292428] rounded-2xl">
                <p className="font-headline text-4xl font-black text-[#caa2f7] mb-2">70%</p>
                <p className="text-[10px] uppercase tracking-widest text-[#585457] font-bold">{t('aboutPage.visionLocalContent')}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#caa2f7]/10 rounded-full blur-[100px]" />
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-[#caa2f7]/20">
              <img
                src="https://images.unsplash.com/photo-1610642372651-fe6e4d7d5b5c?auto=format&fit=crop&q=80&w=1200"
                alt="Saudi Vision 2030"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 px-8 bg-[#1c181c]/30 border-y border-[#292428]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-center mb-20">
            {t('aboutPage.impactTitle')}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { val: '50K+', label: t('aboutPage.professionalsLabel') },
              { val: '97%', label: t('aboutPage.completionRateLabel') },
              { val: '24', label: t('aboutPage.sectorsLabel') },
              { val: '12K+', label: t('aboutPage.contractsLabel') },
            ].map(({ val, label }) => (
              <div key={val} className="text-center group">
                <p className="font-headline text-5xl font-black text-[#caa2f7] mb-3 group-hover:scale-110 transition-transform duration-300">
                  {val}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#585457] font-bold leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-headline text-3xl md:text-5xl font-light italic text-[#caa2f7] leading-relaxed">
            "{t('aboutPage.quote')}"
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-8 bg-[#1c181c]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">
              {t('aboutPage.teamTitle')}{' '}
              <span className="text-[#caa2f7] italic font-light">{t('aboutPage.teamTitleAccent')}</span>
            </h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">
              {t('aboutPage.teamSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member) => (
              <div key={member.nameKey} className="p-10 bg-[#1c181c] border border-[#292428] rounded-[2rem] hover:border-[#caa2f7]/20 transition-all duration-300 group text-center">
                <div className="w-20 h-20 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#613471]/50 transition-colors">
                  <span className="font-headline text-2xl font-bold text-[#caa2f7]">{member.initials}</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-[#faf1f5] mb-1">{t(member.nameKey)}</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#caa2f7] font-bold mb-6">{t(member.roleKey)}</p>
                <p className="text-[#b0a9ad] text-sm font-light leading-relaxed">{t(member.bioKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/join" className="px-12 py-5 rounded-2xl border border-[#caa2f7]/30 text-[#caa2f7] font-black text-xs uppercase tracking-widest hover:bg-[#caa2f7]/10 transition-all">
              {t('aboutPage.joinBoard')} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
