'use client'

import Link from 'next/link'
import { AnalysisHistoryChart } from '@/components/features/AnalysisHistoryChart'
import { useLanguage } from '@/app/providers/LanguageProvider'

export default function ATSHistoryClient() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {t('atsHistory.backToDashboard')}
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
              {t('atsHistory.title')}
            </h1>
            <p className="text-on-surface-variant">
              {t('atsHistory.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/ats-optimize"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              {t('atsHistory.runNewAnalysis')}
            </Link>
            <Link
              href="/dashboard"
              className="bg-surface-container/60 border border-outline-variant/10 text-on-surface font-bold py-4 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">dashboard</span>
              {t('atsHistory.backToDashboard')}
            </Link>
          </div>
        </div>

        {/* History Component */}
        <AnalysisHistoryChart />

        {/* Tips Section */}
        <div className="mt-12 bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-outline-variant/10 p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">lightbulb</span>
            {t('atsHistory.tipsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">📊</div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">{t('atsHistory.tipTrackTitle')}</h3>
                <p className="text-sm text-on-surface-variant">{t('atsHistory.tipTrackDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">{t('atsHistory.tipKeywordsTitle')}</h3>
                <p className="text-sm text-on-surface-variant">{t('atsHistory.tipKeywordsDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">✨</div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">{t('atsHistory.tipAITitle')}</h3>
                <p className="text-sm text-on-surface-variant">{t('atsHistory.tipAIDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">💾</div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">{t('atsHistory.tipDownloadTitle')}</h3>
                <p className="text-sm text-on-surface-variant">{t('atsHistory.tipDownloadDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
