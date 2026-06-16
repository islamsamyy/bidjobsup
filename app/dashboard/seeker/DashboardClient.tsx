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
  hasSubscription?: boolean
  hasCompletedProfile?: boolean
  hasFirstBid?: boolean
  hasContract?: boolean
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
  hasSubscription = false,
  hasCompletedProfile = false,
  hasFirstBid = false,
  hasContract = false,
}: DashboardClientProps) {
  const { t } = useLanguage()

  const onboardingSteps = [
    {
      done: hasCompletedProfile,
      icon: 'person',
      label: 'Complete your profile',
      sub: 'Add bio, skills, and portfolio to stand out',
      href: '/dashboard/seeker/profile',
    },
    {
      done: hasFirstBid,
      icon: 'send',
      label: 'Submit your first bid',
      sub: 'Browse jobs and apply to get started',
      href: '/jobs/browse',
    },
    {
      done: hasContract,
      icon: 'handshake',
      label: 'Land your first contract',
      sub: 'Win a bid and begin working',
      href: '/dashboard/contracts',
    },
    {
      done: hasSubscription,
      icon: 'workspace_premium',
      label: 'Upgrade to Elite',
      sub: 'Unlock ATS Optimizer, priority visibility & more',
      href: '/dashboard/seeker/subscription',
    },
  ]

  const doneCount = onboardingSteps.filter(s => s.done).length
  const allDone = doneCount === onboardingSteps.length

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
          <div className="text-sm font-body text-on-surface-variant text-right">
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
          <div className="text-sm font-body text-on-surface-variant text-right">
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
          <div className="text-sm font-body text-on-surface-variant text-right">
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
          <div className="text-sm font-body text-on-surface-variant text-right">
            {t('dashboardPages.seekerDashboard.savedJobs')}
          </div>
        </div>
      </div>

      {/* Onboarding Checklist — hide once all steps complete */}
      {!allDone && (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.25em] uppercase text-primary mb-1">Getting Started</p>
              <h3 className="text-lg font-bold text-on-surface">Your launch checklist</h3>
            </div>
            <span className="text-sm font-bold text-on-surface-variant">{doneCount}/{onboardingSteps.length}</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-700"
              style={{ width: `${(doneCount / onboardingSteps.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {onboardingSteps.map((step) => (
              <Link
                key={step.label}
                href={step.done ? '#' : step.href}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  step.done
                    ? 'border-primary/20 bg-primary/5 cursor-default'
                    : 'border-outline-variant/20 hover:border-primary/30 hover:bg-white/3'
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.done ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {step.done
                    ? <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>check</span>
                    : <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>{step.icon}</span>
                  }
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${step.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{step.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ATS Optimizer Discovery Banner — show only for non-subscribers */}
      {!hasSubscription && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface-container to-secondary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black tracking-[0.25em] uppercase text-primary mb-1">Elite Feature</p>
            <h3 className="font-bold text-on-surface">Not getting interview calls?</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Our AI ATS Optimizer scores your CV against job descriptions and tells you exactly what to fix.
            </p>
          </div>
          <Link
            href="/dashboard/seeker/subscription"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Unlock ATS Optimizer
          </Link>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full pointer-events-none" />
        </div>
      )}

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
    </>
  )
}
