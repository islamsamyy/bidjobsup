import Link from 'next/link'
import { AnalysisHistoryChart } from '@/components/features/AnalysisHistoryChart'

export const metadata = {
  title: 'ATS Analysis History — BidJobs'
}

export default function ATSHistoryPage() {

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
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
              Analysis History
            </h1>
            <p className="text-on-surface-variant">
              Track your ATS optimization progress over time
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/ats-optimize"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">
                auto_awesome
              </span>
              Run New Analysis
            </Link>
            <Link
              href="/dashboard"
              className="bg-surface-container/60 border border-white/5 text-on-surface font-bold py-4 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* History Component */}
        <AnalysisHistoryChart />

        {/* Tips Section */}
        <div className="mt-12 bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              lightbulb
            </span>
            Tips for Better Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">
                📊
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">
                  Track Your Progress
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Run analysis regularly to see how your CV improvements affect your ATS score over time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">
                🎯
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">
                  Focus on Missing Keywords
                </h3>
                <p className="text-sm text-on-surface-variant">
                  The keywords that appear most frequently across your analyses are likely critical for your target roles.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">
                ✨
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">
                  Use AI Suggestions
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Click "Get AI Suggestions" on the results page to receive smart, context-aware recommendations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary text-2xl flex-shrink-0">
                💾
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-2">
                  Download Your Updates
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Download the recommendation summary and updated CV to reference while making improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
