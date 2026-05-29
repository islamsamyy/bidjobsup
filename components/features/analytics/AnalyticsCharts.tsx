'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'

interface ApplicationsOverTimeData {
  date: string
  count: number
}

interface CategoryData {
  category: string
  count: number
}

interface ApplicationStatusData {
  accepted: number
  rejected: number
  pending: number
}

interface AnalyticsChartsProps {
  applicationsOverTime: ApplicationsOverTimeData[]
  jobsByCategory: CategoryData[]
  applicationStatus: ApplicationStatusData
}

export default function AnalyticsCharts({
  applicationsOverTime,
  jobsByCategory,
  applicationStatus,
}: AnalyticsChartsProps) {
  const { t } = useLanguage()
  const maxApplications = Math.max(...applicationsOverTime.map(d => d.count), 1)
  const totalStatus = applicationStatus.accepted + applicationStatus.rejected + applicationStatus.pending

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="space-y-8">
      {/* Applications Over Time */}
      <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
        <h3 className="text-xl font-bold text-on-surface mb-6 text-right">
          {t('dashboardPages.seekerDashboard.applicationsOverTime')}
        </h3>

        <div className="space-y-4">
          {applicationsOverTime.map((data) => {
            const percentage = (data.count / maxApplications) * 100
            return (
              <div key={data.date} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant font-medium">
                    {formatDate(data.date)}
                  </span>
                  <span className="text-sm font-bold text-on-surface">{data.count} {t('dashboardPages.seekerDashboard.applications')}</span>
                </div>
                <div className="h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs by Category */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
          <h3 className="text-xl font-bold text-on-surface mb-6 text-right">
            {t('dashboardPages.seekerDashboard.jobsByCategory')}
          </h3>

          <div className="space-y-4">
            {jobsByCategory.length > 0 ? (
              jobsByCategory.map((data) => {
                const maxCount = Math.max(...jobsByCategory.map(d => d.count), 1)
                const percentage = (data.count / maxCount) * 100
                return (
                  <div key={data.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant font-medium">{data.category}</span>
                      <span className="text-sm font-bold text-on-surface">{data.count}</span>
                    </div>
                    <div className="h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tertiary to-primary transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-on-surface-variant text-sm text-right">{t('common.noData')}</p>
            )}
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
          <h3 className="text-xl font-bold text-on-surface mb-6 text-right">
            {t('dashboardPages.seekerDashboard.applicationStatus')}
          </h3>

          <div className="space-y-6">
            {/* Donut-style pie chart using CSS */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-surface-container-lowest"
                  />

                  {/* Accepted segment */}
                  {totalStatus > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="8"
                      strokeDasharray={`${(applicationStatus.accepted / totalStatus) * 282.6} 282.6`}
                      className="transition-all"
                    />
                  )}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-on-surface">{totalStatus}</div>
                  <div className="text-xs text-on-surface-variant">{t('common.total')}</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 text-right">
              <div className="flex items-center gap-3 justify-end">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-on-surface-variant">{t('common.accepted')}: <span className="font-bold text-on-surface">{applicationStatus.accepted}</span></span>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-on-surface-variant">{t('common.pending')}: <span className="font-bold text-on-surface">{applicationStatus.pending}</span></span>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-on-surface-variant">{t('common.rejected')}: <span className="font-bold text-on-surface">{applicationStatus.rejected}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
