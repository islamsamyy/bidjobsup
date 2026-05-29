'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import AnalyticsCharts from '@/components/features/analytics/AnalyticsCharts'

interface EmployerDashboardClientProps {
  greeting: string
  firstName: string
  activeJobsCount: number
  applicantsCount: number
  hiredCount: number
  totalJobsPosted: number
  isProfileComplete: boolean
  analyticsData: any
}

export function EmployerDashboardClient({
  greeting,
  firstName,
  activeJobsCount,
  applicantsCount,
  hiredCount,
  totalJobsPosted,
  isProfileComplete,
  analyticsData,
}: EmployerDashboardClientProps) {
  const { t } = useLanguage()

  return (
    <>
      {/* Welcome Hero */}
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div>
            <h2 className="font-headline text-5xl font-bold tracking-tight mb-2">
              {greeting}, <span className="text-secondary neon-glow drop-shadow-[0_0_8px_rgba(234,179,250,0.4)]">{firstName}</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-xl">
              {applicantsCount > 0
                ? (
                  <>
                    {t('dashboardPages.employerDashboard.youHave')} <span className="text-secondary font-bold">{applicantsCount}</span> {t('dashboardPages.employerDashboard.candidateAwait')}
                  </>
                )
                : t('dashboardPages.employerDashboard.postFirstRole')}
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-surface-container-low p-6 rounded-2xl w-full md:w-80 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                {t('dashboardPages.employerDashboard.enterpriseProfile')}
              </span>
              <span className="text-secondary font-bold">
                {isProfileComplete ? '100%' : '75%'}
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-secondary-fixed-dim to-secondary h-full rounded-full transition-all duration-1000"
                style={{ width: isProfileComplete ? '100%' : '75%' }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {!isProfileComplete ? (
                <>
                  {t('dashboardPages.employerDashboard.addCompany')}{' '}
                  <Link
                    href="/dashboard/employer/profile"
                    className="text-on-surface font-semibold underline decoration-secondary/50"
                  >
                    {t('dashboardPages.employerDashboard.profileDetails')}
                  </Link>{' '}
                  {t('dashboardPages.employerDashboard.toAttractTop')}
                </>
              ) : (
                <>{t('dashboardPages.employerDashboard.profileFullyVerified')}</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 - Active Listings */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
              work
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{activeJobsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant text-right">
            {t('dashboardPages.employerDashboard.activeListings')}
          </div>
        </div>

        {/* Stat 2 - Total Applicants */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">
              groups
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{applicantsCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant text-right">
            {t('dashboardPages.employerDashboard.totalApplicants')}
          </div>
        </div>

        {/* Stat 3 - Talent Hired */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group border-l-2 border-secondary/30">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              handshake
            </span>
            {hiredCount > 0 && (
              <span className="bg-secondary-container/20 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                {t('common.active')}
              </span>
            )}
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{hiredCount || 0}</div>
          <div className="text-sm font-body text-on-surface-variant text-right">
            {t('dashboardPages.employerDashboard.talentHired')}
          </div>
        </div>

        {/* Stat 4 - Total Jobs Posted */}
        <div className="bg-surface-container p-8 rounded-xl hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-stone-400 group-hover:scale-110 transition-transform">
              description
            </span>
          </div>
          <div className="font-headline text-4xl font-bold mb-1">{totalJobsPosted || 0}</div>
          <div className="text-sm font-body text-on-surface-variant text-right">
            {t('dashboardPages.employerDashboard.totalRoles')}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {analyticsData && (
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-8 text-right">
            {t('dashboardPages.seekerDashboard.analyticsInsights')}
          </h2>
          <AnalyticsCharts
            applicationsOverTime={analyticsData.applicationsOverTime}
            jobsByCategory={analyticsData.jobsByCategory}
            applicationStatus={analyticsData.applicationStatus}
          />
        </div>
      )}

      {/* Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold text-right">
              {t('dashboardPages.employerDashboard.priorityAlerts')}
            </h3>
          </div>
          <div className="space-y-4">
            {/* Notifications would go here */}
          </div>
        </div>

        {/* Action required section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-2xl font-semibold text-right">
              {t('dashboardPages.employerDashboard.accelerateHiring')}
            </h3>
          </div>
          <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5">
            <div className="h-32 w-32 shrink-0 bg-secondary-container/10 rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                precision_manufacturing
              </span>
            </div>
            <div className="grow">
              <h3 className="font-headline text-2xl font-bold mb-2">
                {activeJobsCount === 0
                  ? t('dashboardPages.employerDashboard.postFirstRole')
                  : t('dashboardPages.employerDashboard.deployMatching')}
              </h3>
              <p className="text-on-surface-variant mb-6 max-w-2xl">
                {activeJobsCount === 0
                  ? t('dashboardPages.employerDashboard.createDetailedRole')
                  : t('dashboardPages.employerDashboard.createSophisticated')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard/employer/post-job"
                  className="bg-secondary text-on-primary-container font-bold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center"
                >
                  {t('dashboardPages.employerDashboard.postNewRole')}
                </Link>
                <Link
                  href="/dashboard/employer/talent"
                  className="text-on-surface font-bold px-6 py-3 text-sm hover:text-secondary transition-colors"
                >
                  {t('dashboardPages.employerDashboard.browseTalent')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
