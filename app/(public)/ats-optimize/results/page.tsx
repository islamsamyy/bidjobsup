"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ATSAnalysisResult {
  matchScore: number
  atsScore: number
  keywordMatchPercentage: number
  presentKeywords: string[]
  missingKeywords: string[]
  sections: Array<{
    name: string
    score: number
    status: 'excellent' | 'good' | 'fair' | 'poor'
  }>
  recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    icon: string
  }>
}

export default function ATSResultsPage() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null)
  const [results, setResults] = useState<ATSAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem("atsResults")
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (err) {
        console.error("Failed to parse results:", err)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4 block">
            hourglass_top
          </span>
          <p className="text-on-surface-variant">Loading results...</p>
        </div>
      </main>
    )
  }

  if (!results) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
        <div className="max-w-5xl mx-auto text-center py-12">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">
            error
          </span>
          <h1 className="text-3xl font-bold text-on-surface mb-4">No Analysis Results</h1>
          <p className="text-on-surface-variant mb-8">
            Please go back and complete the ATS analysis first.
          </p>
          <Link
            href="/ats-optimize"
            className="inline-block bg-primary text-on-primary-container font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
          >
            Back to Analyzer
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/ats-optimize"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>

          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
                Your ATS Analysis
              </h1>
              <p className="text-on-surface-variant">
                Complete breakdown of your CV's ATS compatibility
              </p>
            </div>
          </div>
        </div>

        {/* Main Score Card */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl rounded-2xl border border-primary/30 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(results.matchScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#caa2f7" />
                      <stop offset="100%" stopColor="#b690e3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-primary">
                    {results.matchScore}%
                  </div>
                  <div className="text-xs text-on-surface-variant">Match</div>
                </div>
              </div>
              <h3 className="font-bold text-on-surface">Overall Match</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                Your CV matches the job description
              </p>
            </div>

            {/* ATS Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient2)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(results.atsScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#84d664" />
                      <stop offset="100%" stopColor="#6cc658" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-emerald-400">
                    {results.atsScore}%
                  </div>
                  <div className="text-xs text-on-surface-variant">ATS Score</div>
                </div>
              </div>
              <h3 className="font-bold text-on-surface">ATS Readability</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                Your CV's ATS compatibility
              </p>
            </div>

            {/* Keyword Match */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient3)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(results.keywordMatchPercentage / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffc107" />
                      <stop offset="100%" stopColor="#ff9800" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.keywordMatchPercentage}%
                  </div>
                  <div className="text-xs text-on-surface-variant">Keywords</div>
                </div>
              </div>
              <h3 className="font-bold text-on-surface">Keyword Match</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                Job description match
              </p>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-6">
            Section Breakdown
          </h2>
          <div className="space-y-4">
            {results.sections.map((section) => (
              <div key={section.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-on-surface">
                      {section.name}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        section.status === 'excellent'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : section.status === 'good'
                            ? 'bg-primary/20 text-primary'
                            : section.status === 'fair'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {section.score}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        section.status === 'excellent'
                          ? 'bg-emerald-500'
                          : section.status === 'good'
                            ? 'bg-primary'
                            : section.status === 'fair'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Present Keywords */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">
                check_circle
              </span>
              Keywords Found ({results.presentKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {results.presentKeywords.map((keyword: string) => (
                <div
                  key={keyword}
                  className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium"
                >
                  {keyword}
                </div>
              ))}
            </div>
            {results.presentKeywords.length === 0 && (
              <p className="text-on-surface-variant">No matching keywords found</p>
            )}
          </div>

          {/* Missing Keywords */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-400">
                warning
              </span>
              Missing Keywords ({results.missingKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {results.missingKeywords.map((keyword: string) => (
                <div
                  key={keyword}
                  className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-lg text-sm font-medium"
                >
                  {keyword}
                </div>
              ))}
            </div>
            {results.missingKeywords.length === 0 && (
              <p className="text-on-surface-variant">All keywords matched!</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-8">
            Recommendations
          </h2>
          <div className="space-y-3">
            {results.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="border border-outline-variant/10 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedTip(expandedTip === idx ? null : idx)
                  }
                  className={`w-full p-6 flex items-start gap-4 hover:bg-surface-container-high transition-colors ${
                    expandedTip === idx ? 'bg-surface-container-high' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      rec.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : rec.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {rec.icon}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-on-surface">{rec.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wide">
                      {rec.priority} PRIORITY
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined transition-transform ${
                      expandedTip === idx ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {expandedTip === idx && (
                  <div className="px-6 pb-6 border-t border-outline-variant/10 text-on-surface-variant">
                    {rec.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/ats-optimize"
            className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-4 px-6 rounded-xl hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Run New Analysis
          </Link>
          <Link
            href="/jobs/browse"
            className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">work</span>
            Apply to Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
