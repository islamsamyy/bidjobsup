"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { generateUpdatedCV, generateRecommendationSummary } from "@/lib/actions/cv-export";
import { suggestMissingKeywordsWithAI } from "@/lib/actions/ai-suggestions";
import { saveAnalysisToHistory } from "@/lib/actions/analysis-history";

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
  const [cvText, setCvText] = useState<string>("")
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState<string>("")
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem("atsResults")
    const storedCV = sessionStorage.getItem("cvText")
    const storedJob = sessionStorage.getItem("jobDescription")
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults)
        setResults(parsedResults)

        // Save to analysis history (fire and forget)
        if (storedJob && storedCV) {
          saveAnalysisToHistory({
            analysisDate: new Date().toISOString(),
            jobTitle: "Job Analysis",
            matchScore: parsedResults.matchScore,
            atsScore: parsedResults.atsScore,
            keywordMatchPercentage: parsedResults.keywordMatchPercentage,
            missingKeywords: parsedResults.missingKeywords || [],
            presentKeywords: parsedResults.presentKeywords || [],
            recommendations: parsedResults.recommendations || [],
            cvVersion: "1.0"
          }).catch(err => console.error("Failed to save analysis history:", err))
        }
      } catch (err) {
        console.error("Failed to parse results:", err)
      }
    }
    if (storedCV) {
      setCvText(storedCV)
    }
    if (storedJob) {
      setJobDescription(storedJob)
    }
    setLoading(false)
  }, [])

  // Load AI suggestions when user clicks the button
  const handleLoadAISuggestions = async () => {
    if (!cvText || !jobDescription || !results) {
      console.error("Missing data for AI suggestions")
      return
    }

    setLoadingAI(true)
    try {
      const suggestions = await suggestMissingKeywordsWithAI(
        cvText,
        jobDescription,
        "Job Title" // Could extract from jobDescription if available
      )
      setAiSuggestions(suggestions)
      setShowAISuggestions(true)
    } catch (err) {
      console.error("Failed to load AI suggestions:", err)
    } finally {
      setLoadingAI(false)
    }
  }

  // Download updated CV with recommendations
  const handleDownloadUpdatedCV = async () => {
    if (!results || !cvText) {
      setDownloadError("Missing CV or analysis data");
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const updatedContent = await generateUpdatedCV({
        originalCV: cvText,
        missingKeywords: results.missingKeywords,
        recommendations: results.recommendations,
        matchScore: results.matchScore,
        atsScore: results.atsScore,
        keywordMatchPercentage: results.keywordMatchPercentage
      });

      // Create blob and download
      const blob = new Blob([updatedContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_Optimized_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setDownloadError(err.message || "Failed to generate CV");
    } finally {
      setDownloading(false);
    }
  };

  // Download recommendation summary
  const handleDownloadSummary = async () => {
    if (!results) {
      setDownloadError("Missing analysis data");
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const summary = await generateRecommendationSummary({
        originalCV: cvText,
        missingKeywords: results.missingKeywords,
        recommendations: results.recommendations,
        matchScore: results.matchScore,
        atsScore: results.atsScore,
        keywordMatchPercentage: results.keywordMatchPercentage
      });

      const blob = new Blob([summary], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ATS_Recommendations_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setDownloadError(err.message || "Failed to generate summary");
    } finally {
      setDownloading(false);
    }
  };

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

        {/* AI Suggestions Section */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 mb-12">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              AI-Powered Suggestions
            </h2>
            {!showAISuggestions && (
              <button
                onClick={handleLoadAISuggestions}
                disabled={loadingAI}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined">
                  {loadingAI ? "hourglass_top" : "spark"}
                </span>
                {loadingAI ? "Generating..." : "Get AI Suggestions"}
              </button>
            )}
          </div>

          {showAISuggestions && aiSuggestions ? (
            <div className="space-y-6">
              {/* Explanation */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-on-surface">{aiSuggestions.explanation}</p>
              </div>

              {/* Priority Keywords */}
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-400">
                    priority_high
                  </span>
                  Top Priority Keywords
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {aiSuggestions.priorityKeywords.map((keyword: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-on-surface"
                    >
                      <div className="text-sm font-bold text-yellow-300 mb-1">
                        #{idx + 1}
                      </div>
                      <div className="font-semibold text-on-surface">{keyword}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incorporation Tips */}
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">
                    lightbulb
                  </span>
                  How to Add These Keywords
                </h3>
                <div className="space-y-3">
                  {aiSuggestions.incorporationTips.map((tip: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 flex gap-3"
                    >
                      <div className="text-emerald-300 font-bold flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20">
                        {idx + 1}
                      </div>
                      <p className="text-on-surface-variant text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              {aiSuggestions.skillGaps && aiSuggestions.skillGaps.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">
                      school
                    </span>
                    Skill Gaps to Address
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.skillGaps.map((gap: any, idx: number) => (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 ${
                          gap.importance === 'critical'
                            ? 'bg-red-500/10 border-red-500/30'
                            : gap.importance === 'important'
                              ? 'bg-yellow-500/10 border-yellow-500/30'
                              : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-bold text-on-surface">
                              {gap.skill}
                            </h4>
                            <div
                              className={`text-xs font-semibold uppercase tracking-wide mt-1 ${
                                gap.importance === 'critical'
                                  ? 'text-red-300'
                                  : gap.importance === 'important'
                                    ? 'text-yellow-300'
                                    : 'text-blue-300'
                              }`}
                            >
                              {gap.importance} PRIORITY
                            </div>
                          </div>
                          <div className="text-xs text-on-surface-variant whitespace-nowrap bg-surface-container-lowest px-3 py-1 rounded-full">
                            {gap.learningTime}
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                          {gap.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Suggested Keywords */}
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    tag
                  </span>
                  All Suggested Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.suggestedKeywords.map((keyword: string, idx: number) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg text-sm font-medium"
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  setShowAISuggestions(false)
                  setAiSuggestions(null)
                }}
                className="w-full bg-surface-container-high/60 border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Hide AI Suggestions
              </button>
            </div>
          ) : !showAISuggestions ? (
            <p className="text-on-surface-variant">
              Click "Get AI Suggestions" to receive AI-powered keyword recommendations tailored to this specific job, including priority ranking and learning time estimates for skill gaps.
            </p>
          ) : null}
        </div>

        {/* Download Section */}
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              download
            </span>
            Download Your Updates
          </h2>
          <p className="text-on-surface-variant mb-6">
            Download your optimized CV with recommendations or a summary of improvements to make.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download Recommendation Summary */}
            <button
              onClick={handleDownloadSummary}
              disabled={downloading}
              className="bg-secondary/20 border border-secondary/30 text-secondary hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">
                {downloading ? "hourglass_top" : "description"}
              </span>
              {downloading ? "Generating..." : "Download Summary"}
            </button>

            {/* Download Updated CV */}
            <button
              onClick={handleDownloadUpdatedCV}
              disabled={downloading}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">
                {downloading ? "hourglass_top" : "file_download"}
              </span>
              {downloading ? "Generating..." : "Download Updated CV"}
            </button>
          </div>

          {/* Error Message */}
          {downloadError && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 flex items-start gap-2">
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5">
                error
              </span>
              <p className="text-sm">{downloadError}</p>
            </div>
          )}

          <p className="text-xs text-on-surface-variant mt-6">
            💡 <strong>Tip:</strong> Download the updated CV with recommendations integrated. Use the summary to track improvements you need to make.
          </p>
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
            href="/dashboard/ats-history"
            className="flex-1 bg-secondary/20 border border-secondary/30 text-secondary font-bold py-4 px-6 rounded-xl hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">history</span>
            View History
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
