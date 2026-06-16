'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { handleUnsaveJob } from './actions'

interface SavedJob {
  id: number
  job?: {
    id: number
    title: string
    description: string
    budget_min: number
    budget_max: number
    employer_id: number
    location?: string
    job_type?: string
    employer?: {
      full_name: string
      avatar_url: string
    }
  }
}

export function SavedJobsClient({ savedJobs }: { savedJobs: SavedJob[] | null }) {
  const { t } = useLanguage()

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-16">
        <h2 className="font-headline text-6xl font-black italic text-on-surface leading-tight">
          {t('dashboardPages.savedJobs.title')}
        </h2>
        <p className="text-on-surface-variant font-body mt-4 max-w-md text-sm leading-relaxed italic opacity-80">
          {t('dashboardPages.savedJobs.subtitle')}
        </p>
      </header>

      <div className="space-y-6">
        {!savedJobs || savedJobs.length === 0 ? (
          <div className="p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-stone-900 mx-auto flex items-center justify-center text-stone-600">
              <span className="material-symbols-outlined text-3xl">bookmark</span>
            </div>
            <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">
              {t('dashboardPages.savedJobs.noSavedJobs')}
            </p>
            <Link
              href="/dashboard/seeker/search"
              className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all"
            >
              {t('dashboardPages.savedJobs.browseJobs')}
            </Link>
          </div>
        ) : (
          savedJobs.map((fav) => (
            <div
              key={fav.id}
              className="group bg-surface-container rounded-3xl p-8 border border-outline-variant/10 hover:bg-surface-container-high transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-stone-950 border border-outline-variant/20 flex items-center justify-center text-primary shadow-2xl">
                    {fav.job?.employer?.avatar_url ? (
                      <img src={fav.job.employer.avatar_url} alt={fav.job.employer.full_name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl">business</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-headline font-black italic text-on-surface group-hover:text-primary transition-colors">
                      {fav.job?.title}
                    </h4>
                    <p className="text-xs font-black uppercase tracking-widest text-stone-500 mt-1">
                      {fav.job?.employer?.full_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-headline font-black italic text-on-surface">
                    ${fav.job?.budget_max?.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mt-1">
                    {t('common.amount')}
                  </p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
                {fav.job?.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <div className="flex gap-2 flex-wrap">
                  {fav.job?.location && (
                    <span className="px-3 py-1 bg-stone-900 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 border border-outline-variant/5">
                      {fav.job.location}
                    </span>
                  )}
                  {fav.job?.job_type && (
                    <span className="px-3 py-1 bg-stone-900 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 border border-outline-variant/5">
                      {fav.job.job_type}
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/jobs/${fav.job?.id}`}
                    className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:border-primary/40 transition-all"
                  >
                    {t('common.viewDetails')}
                  </Link>
                  <form action={handleUnsaveJob.bind(null, fav.id)}>
                    <button
                      type="submit"
                      className="p-2 rounded-lg text-stone-600 hover:text-secondary hover:bg-secondary/5 transition-all"
                      title="Unsave"
                    >
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
