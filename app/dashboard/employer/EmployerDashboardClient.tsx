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
  hasFirstJob?: boolean
  hasFirstHire?: boolean
  hasSubscription?: boolean
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
  hasFirstJob = false,
  hasFirstHire = false,
  hasSubscription = false,
}: EmployerDashboardClientProps) {
  const { t } = useLanguage()

  const onboardingSteps = [
    {
      done: isProfileComplete,
      icon: 'corporate_fare',
      label: 'Complete company profile',
      sub: 'Add bio, logo, and company details',
      href: '/dashboard/employer/profile',
    },
    {
      done: hasFirstJob,
      icon: 'work',
      label: 'Post your first role',
      sub: 'List a job and start receiving bids',
      href: '/dashboard/employer/post-job',
    },
    {
      done: hasFirstHire,
      icon: 'handshake',
      label: 'Hire your first talent',
      sub: 'Accept a bid and create a contract',
      href: '/dashboard/contracts',
    },
    {
      done: hasSubscription,
      icon: 'workspace_premium',
      label: 'Upgrade to Enterprise',
      sub: 'Unlock unlimited posts, analytics & priority support',
      href: '/dashboard/employer/billing',
    },
  ]

  const doneCount = onboardingSteps.filter(s => s.done).length
  const allDone = doneCount === onboardingSteps.length

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

      {/* Onboarding Checklist */}
      {!allDone && (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.25em] uppercase text-secondary mb-1">Getting Started</p>
              <h3 className="text-lg font-bold text-on-surface">Your launch checklist</h3>
            </div>
            <span className="text-sm font-bold text-on-surface-variant">{doneCount}/{onboardingSteps.length}</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all duration-700"
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
                    ? 'border-secondary/20 bg-secondary/5 cursor-default'
                    : 'border-outline-variant/20 hover:border-secondary/30 hover:bg-white/3'
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.done ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {step.done
                    ? <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                    : <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{step.icon}</span>
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

      {/* Talent Pool Discovery Banner */}
      {totalJobsPosted === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/10 via-surface-container to-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-2xl">groups</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black tracking-[0.25em] uppercase text-secondary mb-1">Ready to hire?</p>
            <h3 className="font-bold text-on-surface">500+ verified talents are waiting</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Post a role in 2 minutes and start receiving bids from top-tier candidates.
            </p>
          </div>
          <Link
            href="/dashboard/employer/post-job"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Post a Role
          </Link>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/5 rounded-full pointer-events-none" />
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
