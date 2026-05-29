"use client";

import JobCard from '@/components/features/JobCard'
import JobFilterPanel from '@/components/features/JobFilterPanel'
import Link from 'next/link'
import { handleSearch } from './actions'
import { useLanguage } from '@/app/providers/LanguageProvider'

export default function JobsBrowseClient({
  query,
  location,
  category,
  budgetMin,
  budgetMax,
  jobType,
  experienceLevel,
  sort,
  industries,
  jobs
}: {
  query: string
  location: string
  category: string
  budgetMin: number | null
  budgetMax: number | null
  jobType: string
  experienceLevel: string
  sort: string
  industries: any[]
  jobs: any[] | null
}) {
  const { t, dir } = useLanguage();

  return (
    <main className={`max-w-screen-2xl mx-auto px-8 pt-12 pb-32 ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
      {/* Hero & Search Section */}
      <section className="mb-24 relative overflow-hidden py-16">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-[#caa2f7]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#eab3fa]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="mb-12 relative z-10 animate-fade-in">
          <h1 className="font-headline text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tighter">
            {t('jobsBrowsePage.secureMission1')} <br/>
            <span className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] bg-clip-text text-transparent italic font-light">{t('jobsBrowsePage.secureMission2')}</span>
          </h1>
          <p className="text-[#b0a9ad] text-xl max-w-2xl font-light leading-relaxed">
            {t('jobsBrowsePage.subtitle')}
          </p>
        </div>

        {/* Search Module */}
        <div className="bg-[#1c181c]/50 backdrop-blur-xl p-2.5 rounded-3xl border border-[#292428] shadow-2xl relative z-10 group hover:border-[#caa2f7]/20 transition-all duration-300">
          <form action={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#100d10] p-4 rounded-2xl flex items-center gap-4 border border-[#292428] focus-within:border-[#caa2f7]/50 transition-all">
              <span className="material-symbols-outlined text-[#caa2f7]">work</span>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">{t('jobsBrowsePage.role')}</span>
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
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">{t('jobsBrowsePage.location')}</span>
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
                <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-bold mb-0.5">{t('jobsBrowsePage.industry')}</span>
                <select 
                  name="category"
                  defaultValue={category}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[#faf1f5] font-medium text-sm appearance-none cursor-pointer w-full"
                >
                  <option value="">{t('jobsBrowsePage.allIndustries')}</option>
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
              {t('jobsBrowsePage.searchBids')}
            </button>
          </form>
        </div>
      </section>

      {/* Featured Industries */}
      <section className="mb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#caa2f7] font-black tracking-[0.2em] uppercase text-[10px] mb-3 block">{t('jobsBrowsePage.curatedSectors')}</span>
            <h2 className="font-headline text-4xl font-bold tracking-tight">{t('jobsBrowsePage.eliteClusters')}</h2>
          </div>
          <Link href="/jobs" className="text-[#caa2f7] hover:text-[#faf1f5] transition-colors flex items-center gap-3 text-xs font-black uppercase tracking-widest group">
            {t('jobsBrowsePage.allSectors')} 
            <span className={`material-symbols-outlined text-sm transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>{dir === 'rtl' ? 'arrow_back' : 'arrow_forward'}</span>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4b474a]">{ind.count} {t('jobsBrowsePage.activeRoles')}</span>
                  <span className={`material-symbols-outlined text-[#caa2f7] opacity-0 group-hover:opacity-100 transition-all ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>north_east</span>
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
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">{t('jobsBrowsePage.availableMissions')}</h2>
            <p className="text-[#b0a9ad] font-light">
              {query || location || category || budgetMin || budgetMax || jobType || experienceLevel ? t('jobsBrowsePage.filteredResults') : t('jobsBrowsePage.hottestOpp')}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-5 py-2 rounded-xl bg-[#613471] text-[#f1bfff] text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(97,52,113,0.3)]">{t('jobsBrowsePage.recommended')}</button>
            <button className="px-5 py-2 rounded-xl bg-[#1c181c] text-[#b0a9ad] text-[10px] font-black uppercase tracking-widest border border-[#292428] hover:border-[#caa2f7]/20 transition-all">{t('jobsBrowsePage.recent')}</button>
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
            <h3 className="text-2xl font-bold mb-4 italic">{t('jobsBrowsePage.noMissions')}</h3>
            <p className="text-[#b0a9ad] text-lg font-light mb-12 max-w-md mx-auto">{t('jobsBrowsePage.noMissionsDesc')}</p>
            <Link href="/jobs/browse" className="bg-[#caa2f7] text-[#431f6b] font-black px-12 py-4 rounded-xl shadow-[0_10px_30px_rgba(202,162,247,0.2)] hover:scale-[0.98] transition-all">
              {t('jobsBrowsePage.resetSearch')}
            </Link>
          </div>
        )}
      </section>

      {/* Global Context */}
      <section className="bg-gradient-to-br from-[#1c181c] to-[#100d10] rounded-[3rem] p-20 relative overflow-hidden border border-[#292428] shadow-2xl">
        <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-1/2 h-full opacity-[0.03] pointer-events-none transform ${dir === 'rtl' ? '-translate-x-32' : 'translate-x-32'} group`}>
          <span className="material-symbols-outlined text-[35rem] text-[#caa2f7]">apartment</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10 text-center md:text-left">
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#caa2f7] tracking-tighter drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">1.2k+</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">{t('jobsBrowsePage.liveMissionClusters')}</span>
          </div>
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#eab3fa] tracking-tighter drop-shadow-[0_0_20px_rgba(234,179,250,0.3)]">$42M</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">{t('jobsBrowsePage.capitalInflow')}</span>
          </div>
          <div className="space-y-4">
            <span className="font-headline text-8xl font-black italic text-[#faf1f5] tracking-tighter shadow-white/10">98.4%</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#4b474a] block">{t('jobsBrowsePage.clientAlignment')}</span>
          </div>
        </div>
      </section>
    </main>
  )
}
