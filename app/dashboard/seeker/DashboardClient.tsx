'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import AnalyticsCharts from '@/components/features/analytics/AnalyticsCharts'

interface DashboardClientProps {
  greeting: string
  firstName: string
  activeAppsCount: number
  totalBids: number
  successRate: string
  profileCompleteness: number
  avgRating: string | null
  reviewsCount: number
  savedJobsCount: number
  analyticsData: any
}

export function DashboardClient({
  greeting,
  firstName,
  activeAppsCount,
  totalBids,
  successRate,
  profileCompleteness,
  avgRating,
  reviewsCount,
  savedJobsCount,
  analyticsData,
}: DashboardClientProps) {
  const { t } = useLanguage()

  return (
    <>
      {/* Welcome Hero */}
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div>
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-2">
              {greeting}, <span className="text-primary neon-glow">{firstName}</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-xl">
              {totalBids > 0
                ? `${t('dashboardPages.seekerDashboard.youHave')} ${totalBids} ${t('dashboardPages.seekerDashboard.activeApplication')}${totalBids !== 1 ? 's' : ''} ${t('dashboardPages.seekerDashboard.inProgress')}.`
                : t('dashboardPages.seekerDashboard.startBySearching')}
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-surface-container-low p-6 rounded-2xl w-full md:w-80 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                {t('dashboardPages.seekerDashboard.profileIntegrity')}
              </span>
              <span className="text-primary font-bold">{profileCompleteness}%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000"
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {profileCompleteness < 100 ? (
                <>
                  {t('dashboardPages.seekerDashboard.completeYour')}{' '}
                  <Link
                    href="/dashboard/seeker/profile"
                    className="text-on-surface font-semibold underline decoration-primary/50"
                  >
                    {t('dashboardPages.seekerDashboard.profile')}
                  </Link>{' '}
                  {t('dashboardPages.seekerDashboard.toReach100')}
                </>
              ) : (
                <>{t('dashboardPages.seekerDashboard.profileIsComplete')}</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              send
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{activeAppsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">
            {t('dashboardPages.seekerDashboard.activeApplications')}
          </div>
        </div>

        {/* Stat 2 - Review Rating */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
              star
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{avgRating || '—'}</div>
          <div className="text-sm font-body text-on-surface-variant">
            {t('dashboardPages.seekerDashboard.averageRating')} {reviewsCount > 0 ? `(${reviewsCount})` : ''}
          </div>
        </div>

        {/* Stat 3 - Success Rate */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group border-l-2 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">
              analytics
            </span>
            {successRate !== '—' && activeAppsCount > 0 && (
              <span className="bg-primary-container/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                {parseInt(successRate) >= 80
                  ? t('dashboardPages.seekerDashboard.excellent')
                  : parseInt(successRate) >= 50
                    ? t('dashboardPages.seekerDashboard.good')
                    : t('dashboardPages.seekerDashboard.building')}
              </span>
            )}
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{successRate}</div>
          <div className="text-sm font-body text-on-surface-variant">
            {t('dashboardPages.seekerDashboard.bidSuccessRate')}
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-stone-400 group-hover:scale-110 transition-transform">
              bookmark
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{savedJobsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant">
            {t('dashboardPages.seekerDashboard.savedJobs')}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {analyticsData && (
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-8">
            {t('dashboardPages.seekerDashboard.analyticsInsights')}
          </h2>
          <AnalyticsCharts
            applicationsOverTime={analyticsData.applicationsOverTime}
            jobsByCategory={analyticsData.jobsByCategory}
            applicationStatus={analyticsData.applicationStatus}
          />
        </div>
      )}
    </>
  )
}
