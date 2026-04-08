'use client'

import { useState, useEffect } from 'react'
import { getUserAnalysisHistory, getAnalysisTrends, deleteAnalysisRecord, getCommonMissingKeywords } from '@/lib/actions/analysis-history'

interface AnalysisRecord {
  id?: string
  jobTitle: string
  company?: string
  matchScore: number
  atsScore: number
  keywordMatchPercentage: number
  analysisDate: string
  missingKeywords: string[]
}

export function AnalysisHistoryChart() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [trends, setTrends] = useState<any>(null)
  const [commonKeywords, setCommonKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [historyResult, trendsResult, keywordsResult] = await Promise.all([
          getUserAnalysisHistory(),
          getAnalysisTrends(),
          getCommonMissingKeywords()
        ])

        if (historyResult.error) {
          throw new Error(historyResult.error)
        }

        setAnalyses(historyResult.analyses || [])
        setTrends(trendsResult)
        setCommonKeywords(keywordsResult.keywords || [])
      } catch (err: any) {
        console.error('Error loading analysis history:', err)
        setError(err.message || 'Failed to load analysis history')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDelete = async (id: string | undefined) => {
    if (!id) return
    if (!confirm('Delete this analysis record?')) return

    try {
      const result = await deleteAnalysisRecord(id)
      if (result.success) {
        setAnalyses(analyses.filter(a => a.id !== id))
      } else {
        alert('Failed to delete analysis')
      }
    } catch (err) {
      console.error('Error deleting analysis:', err)
    }
  }

  const sortedAnalyses = [...analyses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime()
    } else {
      return b.matchScore - a.matchScore
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">
          hourglass_top
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-red-300">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined flex-shrink-0 mt-0.5">
            error
          </span>
          <div>
            <p className="font-bold">Error loading history</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
          history
        </span>
        <p className="text-on-surface-variant">No analysis history yet</p>
        <p className="text-sm text-on-surface-variant mt-1">
          Run your first CV analysis to see history and trends
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Trends Summary */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Analyses */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <div className="text-sm text-on-surface-variant mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                assessment
              </span>
              Total Analyses
            </div>
            <div className="text-3xl font-bold text-on-surface">
              {trends.totalAnalyses}
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <div className="text-sm text-on-surface-variant mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                show_chart
              </span>
              Average Score
            </div>
            <div className="text-3xl font-bold text-primary">
              {trends.averageScore}%
            </div>
          </div>

          {/* Best Score */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <div className="text-sm text-on-surface-variant mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-emerald-400">
                trending_up
              </span>
              Best Score
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {trends.bestScore}%
            </div>
          </div>

          {/* Improvement */}
          {trends.scoreImprovement !== null && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="text-sm text-on-surface-variant mb-2 flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${trends.scoreImprovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trends.scoreImprovement >= 0 ? 'arrow_upward' : 'arrow_downward'}
                </span>
                Improvement
              </div>
              <div className={`text-3xl font-bold ${trends.scoreImprovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {trends.scoreImprovement >= 0 ? '+' : ''}{trends.scoreImprovement}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Common Missing Keywords */}
      {commonKeywords.length > 0 && (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
          <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400">
              priority_high
            </span>
            Most Common Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {commonKeywords.slice(0, 15).map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-300 text-sm font-medium"
                title={`Appears in ${item.frequency} analyses`}
              >
                {item.keyword}
                <span className="text-xs text-orange-400 ml-2">({item.frequency})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis History List */}
      <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined">
              history
            </span>
            Analysis History
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'date'
                  ? 'bg-primary text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'score'
                  ? 'bg-primary text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Best Score
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedAnalyses.map((analysis) => {
            const date = new Date(analysis.analysisDate)
            const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000

            return (
              <div
                key={analysis.id}
                className="bg-surface-container-high/60 border border-outline-variant/10 rounded-xl p-4 hover:bg-surface-container-high transition-all flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface truncate">
                        {analysis.jobTitle}
                      </h4>
                      {analysis.company && (
                        <p className="text-sm text-on-surface-variant truncate">
                          @ {analysis.company}
                        </p>
                      )}
                    </div>
                    {isRecent && (
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold whitespace-nowrap">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      Match: {analysis.matchScore}%
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      ATS: {analysis.atsScore}%
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      Keywords: {analysis.keywordMatchPercentage}%
                    </div>
                    <span className="text-on-surface-variant text-xs">
                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {analysis.missingKeywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {analysis.missingKeywords.slice(0, 3).map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                      {analysis.missingKeywords.length > 3 && (
                        <span className="px-2 py-1 text-orange-300 text-xs">
                          +{analysis.missingKeywords.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(analysis.id)}
                  className="text-on-surface-variant hover:text-red-400 transition-colors flex-shrink-0 p-2 hover:bg-red-500/10 rounded-lg"
                  title="Delete analysis"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
