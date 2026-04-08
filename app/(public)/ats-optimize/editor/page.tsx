"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { analyzeCV } from "@/lib/actions/ats";

interface ATSAnalysisResult {
  matchScore: number;
  atsScore: number;
  keywordMatchPercentage: number;
  presentKeywords: string[];
  missingKeywords: string[];
  sections: Array<{
    name: string;
    score: number;
    status: "excellent" | "good" | "fair" | "poor";
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    icon: string;
  }>;
}

export default function CVEditorPage() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<ATSAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<number | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  // Auto-analyze when CV text changes (debounced)
  useEffect(() => {
    if (!autoAnalyze || !cvText.trim() || !jobDescription.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setAnalyzing(true);
      try {
        const result = await analyzeCV(cvText, jobDescription);
        setResults(result);
        setLastAnalyzedTime(Date.now());
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setAnalyzing(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [cvText, jobDescription, autoAnalyze]);

  const handleDownload = () => {
    if (!cvText) return;

    const element = document.createElement("a");
    const file = new Blob([cvText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `CV_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadFromStorage = () => {
    const storedCV = sessionStorage.getItem("cvText");
    if (storedCV) {
      setCvText(storedCV);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ats-optimize"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
                ATS CV Editor
              </h1>
              <p className="text-on-surface-variant">
                Edit your CV in real-time and see ATS score updates instantly
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLoadFromStorage}
                className="px-4 py-2 bg-secondary/20 border border-secondary/30 text-secondary rounded-lg hover:bg-secondary/30 transition-all text-sm font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  download
                </span>
                Load Previous CV
              </button>
              <button
                onClick={handleDownload}
                disabled={!cvText}
                className="px-4 py-2 bg-primary text-on-primary-container rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  save
                </span>
                Save CV
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description Input */}
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <label className="block text-sm font-bold text-on-surface mb-3">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to compare against..."
                className="w-full h-40 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* CV Editor */}
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-on-surface">
                  Your CV
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface-variant">
                    <input
                      type="checkbox"
                      checked={autoAnalyze}
                      onChange={(e) => setAutoAnalyze(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Auto-analyze
                  </label>
                </div>
              </div>

              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV text here..."
                className="w-full h-96 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-mono text-sm"
              />

              <p className="text-xs text-on-surface-variant mt-2">
                Character count: {cvText.length.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "preview"
                    ? "bg-primary text-on-primary-container"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                Live Results
              </button>
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "editor"
                    ? "bg-primary text-on-primary-container"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                Tips
              </button>
            </div>

            {activeTab === "preview" ? (
              <>
                {/* Analysis Status */}
                {analyzing && (
                  <div className="bg-primary/20 border border-primary/30 rounded-xl p-4 mb-4 flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined animate-spin">
                      hourglass_top
                    </span>
                    <span className="text-primary">Analyzing...</span>
                  </div>
                )}

                {!cvText || !jobDescription ? (
                  <div className="bg-surface-container-high/60 rounded-2xl border border-white/5 p-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-3 block">
                      info
                    </span>
                    <p className="text-on-surface-variant text-sm">
                      Add your CV and job description to see live analysis
                    </p>
                  </div>
                ) : results ? (
                  <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    {/* Score Cards */}
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {results.matchScore}%
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Match Score
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-high/60 rounded-xl border border-white/5 p-3">
                        <div className="text-xl font-bold text-emerald-400">
                          {results.atsScore}%
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          ATS Score
                        </p>
                      </div>
                      <div className="bg-surface-container-high/60 rounded-xl border border-white/5 p-3">
                        <div className="text-xl font-bold text-yellow-400">
                          {results.keywordMatchPercentage}%
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Keywords
                        </p>
                      </div>
                    </div>

                    {/* Present Keywords */}
                    {results.presentKeywords.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                          Found ({results.presentKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {results.presentKeywords.slice(0, 8).map((kw) => (
                            <div
                              key={kw}
                              className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300 text-xs font-medium"
                            >
                              {kw}
                            </div>
                          ))}
                          {results.presentKeywords.length > 8 && (
                            <div className="text-xs text-on-surface-variant py-1">
                              +{results.presentKeywords.length - 8}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {results.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-orange-300 mb-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            warning
                          </span>
                          Missing ({results.missingKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {results.missingKeywords.slice(0, 8).map((kw) => (
                            <div
                              key={kw}
                              className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-300 text-xs font-medium"
                            >
                              {kw}
                            </div>
                          ))}
                          {results.missingKeywords.length > 8 && (
                            <div className="text-xs text-on-surface-variant py-1">
                              +{results.missingKeywords.length - 8}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    {lastAnalyzedTime && (
                      <p className="text-xs text-on-surface-variant text-center">
                        Last analyzed: {new Date(lastAnalyzedTime).toLocaleTimeString()}
                      </p>
                    )}

                    <Link
                      href="/ats-optimize/results"
                      className="block w-full bg-primary text-on-primary-container font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all text-center text-sm"
                    >
                      View Full Analysis
                    </Link>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="bg-surface-container-high/60 rounded-2xl border border-white/5 p-6 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div>
                  <p className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                    Editing Tips
                  </p>
                  <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
                    <li>Use simple formatting (no tables, graphics)</li>
                    <li>Include relevant keywords naturally</li>
                    <li>Use bullet points for achievements</li>
                    <li>Add metrics and quantifiable results</li>
                    <li>Keep it to 1-2 pages</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      lightbulb
                    </span>
                    Best Practices
                  </p>
                  <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
                    <li>Mirror keywords from job description</li>
                    <li>Start with strong action verbs</li>
                    <li>Highlight relevant experience</li>
                    <li>Update for each application</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      check_circle
                    </span>
                    Format Checklist
                  </p>
                  <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
                    <li>Plain text or simple formatting</li>
                    <li>No unusual fonts or symbols</li>
                    <li>Standard section headers</li>
                    <li>Clear contact information</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-12 bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row gap-4">
          <Link
            href="/ats-optimize"
            className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-3 px-6 rounded-xl hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Upload
          </Link>
          <Link
            href="/dashboard/ats-history"
            className="flex-1 bg-secondary/20 border border-secondary/30 text-secondary font-bold py-3 px-6 rounded-xl hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">history</span>
            View History
          </Link>
          <button
            onClick={handleDownload}
            disabled={!cvText}
            className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-3 px-6 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Download CV
          </button>
        </div>
      </div>
    </main>
  );
}
