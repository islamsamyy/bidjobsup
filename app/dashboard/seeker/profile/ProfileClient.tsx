'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import ProfileForm from './ProfileForm'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  experience_level?: string | null
  location?: string | null
  verified?: boolean
}

interface ProfileClientProps {
  profile: Profile
  avgRating: string | null
  successRate: string
  totalBids: number
  acceptedBids: number
}

export function ProfileClient({
  profile,
  avgRating,
  successRate,
  totalBids,
  acceptedBids,
}: ProfileClientProps) {
  const { t } = useLanguage()

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      {/* Header Profile Info Header */}
      <header className="mb-20 flex flex-col md:flex-row items-center md:items-end gap-12 text-center md:text-left relative overflow-hidden group">
        <div className="relative group/avatar">
          <div className="w-48 h-48 rounded-[2.5rem] bg-surface-container-highest border-4 border-surface shadow-[0_30px_70px_rgba(0,0,0,0.4)] relative z-10 overflow-hidden group-hover/avatar:scale-[1.02] transition-transform duration-500">
            {profile?.avatar_url ? (
              <img src={profile?.avatar_url as string} alt={profile?.full_name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[64px]">person</span>
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-50 group-hover/avatar:blur-3xl transition-all"></div>
        </div>

        <div className="flex-grow space-y-4 pb-4">
          <h2 className="text-6xl font-headline font-black italic text-on-background leading-tight neon-glow group-hover:text-primary transition-colors">
            {profile?.full_name || t('dashboardPages.seekerProfile.completeYourName')}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
            <span className="text-primary text-sm font-black tracking-widest uppercase">
              {profile?.experience_level
                ? `${profile?.experience_level.charAt(0).toUpperCase() + profile?.experience_level.slice(1)} ${t('common.level')}`
                : t('dashboardPages.seekerProfile.setExperienceLevel')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
            <span className="text-on-surface-variant font-bold text-sm tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {profile?.location || t('dashboardPages.seekerProfile.setLocation')}
            </span>
            {profile?.verified && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
                <span className="text-secondary font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                  {t('common.verified')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Real Stats Sidebar in Header */}
        <div className="hidden lg:flex flex-col gap-4 border-l border-outline-variant/10 pl-12 h-24 justify-center">
          <div className="space-y-1">
            <p className="text-[10px] text-stone-600 font-black uppercase tracking-widest leading-none">
              {t('dashboardPages.seekerProfile.avgRating')}
            </p>
            <p className="text-3xl font-headline font-black italic text-on-surface">{avgRating ? `${avgRating}★` : '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-stone-600 font-black uppercase tracking-widest leading-none">
              {t('dashboardPages.seekerProfile.successRate')}
            </p>
            <p className="text-3xl font-headline font-black italic text-primary">{successRate}</p>
          </div>
        </div>
      </header>

      {/* Main Forms Section */}
      <section className="bg-surface-container-low rounded-[3rem] p-12 md:p-20 border border-outline-variant/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none origin-top-right group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <ProfileForm initialData={profile as any} />
        </div>
      </section>
    </main>
  )
}
