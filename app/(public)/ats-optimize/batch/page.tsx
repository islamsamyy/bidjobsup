"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { analyzeCV } from "@/lib/actions/ats";

interface BatchResult {
  id: string;
  cvName: string;
  jobTitle: string;
  matchScore: number;
  atsScore: number;
  keywordMatchPercentage: number;
  missingKeywords: string[];
  presentKeywords: string[];
}

export default function BatchAnalyzerPage() {
  const [mode, setMode] = useState<"cvs" | "jobs">("jobs"); // jobs = 1 CV vs many jobs, cvs = many CVs vs 1 job
  const [cvText, setCvText] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState<Array<{ id: string; title: string; description: string }>>([]);
  const [cvs, setCvs] = useState<Array<{ id: string; name: string; text: string }>>([]);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle adding a job to analyze against
  const addJob = () => {
    const promptTitle = prompt("Enter job title (e.g., 'Senior React Developer'):");
    if (!promptTitle) return;
    const jobTitle = promptTitle;

    const promptDesc = prompt("Paste the job description:");
    if (!promptDesc) return;
    const jobDesc = promptDesc;

    jobDescriptions.push({
      id: Date.now().toString(),
      title: jobTitle,
      description: jobDesc
    });

    setJobDescriptions([...jobDescriptions]);
  };

  // Handle removing a job
  const removeJob = (id: string) => {
    setJobDescriptions(jobDescriptions.filter(j => j.id !== id));
  };

  // Handle adding a CV
  const addCV = async (file?: File) => {
    let text = "";
    let name = "";

    if (file) {
      name = file.name;
      try {
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          text = await file.text();
        } else {
          alert("Only text files are supported for batch upload");
          return;
        }
      } catch (err) {
        alert("Failed to read file");
        return;
      }
    } else {
      const promptText = prompt("Paste CV text:");
      if (!promptText) return;
      text = promptText;
      const promptName = prompt("Give this CV a name (e.g., 'John_Smith_CV'):");
      if (!promptName) return;
      name = promptName;
    }

    cvs.push({
      id: Date.now().toString(),
      name,
      text
    });

    setCvs([...cvs]);
  };

  // Handle removing a CV
  const removeCV = (id: string) => {
    setCvs(cvs.filter(c => c.id !== id));
  };

  // Run batch analysis
  const runBatchAnalysis = async () => {
    setError(null);

    if (mode === "jobs") {
      // 1 CV vs multiple jobs
      if (!cvText.trim()) {
        setError("Please enter your CV");
        return;
      }
      if (jobDescriptions.length === 0) {
        setError("Please add at least one job to analyze against");
        return;
      }

      setAnalyzing(true);
      const batchResults: BatchResult[] = [];

      try {
        for (const job of jobDescriptions) {
          const result = await analyzeCV(cvText, job.description);
          batchResults.push({
            id: job.id,
            cvName: "Your CV",
            jobTitle: job.title,
            matchScore: result.matchScore,
            atsScore: result.atsScore,
            keywordMatchPercentage: result.keywordMatchPercentage,
            missingKeywords: result.missingKeywords,
            presentKeywords: result.presentKeywords
          });
        }

        setResults(batchResults);
      } catch (err: any) {
        setError(err.message || "Analysis failed");
      } finally {
        setAnalyzing(false);
      }
    } else {
      // Multiple CVs vs 1 job
      if (!jobDescriptions[0]?.description) {
        setError("Please enter a job description");
        return;
      }
      if (cvs.length === 0) {
        setError("Please add at least one CV to analyze");
        return;
      }

      setAnalyzing(true);
      const batchResults: BatchResult[] = [];

      try {
        for (const cv of cvs) {
          const result = await analyzeCV(cv.text, jobDescriptions[0].description);
          batchResults.push({
            id: cv.id,
            cvName: cv.name,
            jobTitle: jobDescriptions[0].title,
            matchScore: result.matchScore,
            atsScore: result.atsScore,
            keywordMatchPercentage: result.keywordMatchPercentage,
            missingKeywords: result.missingKeywords,
            presentKeywords: result.presentKeywords
          });
        }

        setResults(batchResults);
      } catch (err: any) {
        setError(err.message || "Analysis failed");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  // Download results as CSV
  const downloadResults = () => {
    if (results.length === 0) return;

    const headers = ["CV Name", "Job Title", "Match Score", "ATS Score", "Keyword Match", "Missing Keywords"];
    const rows = results.map(r => [
      r.cvName,
      r.jobTitle,
      r.matchScore,
      r.atsScore,
      r.keywordMatchPercentage,
      r.missingKeywords.join("; ")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(v => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/ats-optimize"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
              Batch CV Analysis
            </h1>
            <p className="text-on-surface-variant">
              Analyze multiple CVs against one job, or test one CV against multiple jobs
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setMode("jobs");
                setResults([]);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                mode === "jobs"
                  ? "bg-primary text-on-primary-container"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined">person</span>
              1 CV vs Multiple Jobs
            </button>
            <button
              onClick={() => {
                setMode("cvs");
                setResults([]);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                mode === "cvs"
                  ? "bg-primary text-on-primary-container"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined">people</span>
              Multiple CVs vs 1 Job
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            {mode === "jobs" ? (
              <>
                {/* CV Input */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    Your CV
                  </h2>

                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste your CV here..."
                    className="w-full h-64 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">
                    {cvText.length} characters
                  </p>
                </div>

                {/* Jobs List */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      work
                    </span>
                    Target Jobs ({jobDescriptions.length})
                  </h2>

                  <div className="space-y-3 mb-6">
                    {jobDescriptions.map((job) => (
                      <div
                        key={job.id}
                        className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface truncate">
                            {job.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                            {job.description.substring(0, 100)}...
                          </p>
                        </div>
                        <button
                          onClick={() => removeJob(job.id)}
                          className="text-on-surface-variant hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addJob}
                    className="w-full bg-secondary/20 border border-secondary/30 text-secondary font-bold py-3 px-4 rounded-lg hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Add Job to Analyze
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Job Input */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      work
                    </span>
                    Target Job Description
                  </h2>

                  {jobDescriptions[0] ? (
                    <div className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 mb-4">
                      <h3 className="font-bold text-on-surface mb-2">
                        {jobDescriptions[0].title}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3">
                        {jobDescriptions[0].description}
                      </p>
                      <button
                        onClick={() => removeJob(jobDescriptions[0].id)}
                        className="text-red-400 text-xs font-bold mt-2"
                      >
                        Change Job
                      </button>
                    </div>
                  ) : (
                    <>
                      <textarea
                        placeholder="Paste the job description here..."
                        className="w-full h-40 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20"
                        onChange={(e) => {
                          if (jobDescriptions.length > 0) {
                            const updated = [...jobDescriptions];
                            updated[0].description = e.target.value;
                            setJobDescriptions(updated);
                          }
                        }}
                      />
                    </>
                  )}
                  {jobDescriptions.length === 0 && (
                    <button
                      onClick={addJob}
                      className="w-full bg-secondary/20 border border-secondary/30 text-secondary font-bold py-3 px-4 rounded-lg hover:bg-secondary/30 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <span className="material-symbols-outlined">add</span>
                      Add Job Description
                    </button>
                  )}
                </div>

                {/* CVs List */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    Candidate CVs ({cvs.length})
                  </h2>

                  <div className="space-y-3 mb-6">
                    {cvs.map((cv) => (
                      <div
                        key={cv.id}
                        className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface truncate">
                            {cv.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-1">
                            {cv.text.length} characters
                          </p>
                        </div>
                        <button
                          onClick={() => removeCV(cv.id)}
                          className="text-on-surface-variant hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addCV()}
                      className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-3 px-4 rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">edit</span>
                      Paste CV Text
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-3 px-4 rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">upload_file</span>
                      Upload CV File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          addCV(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Summary */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 h-fit sticky top-32">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              Summary
            </h3>

            {mode === "jobs" ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    CV Status
                  </p>
                  <p className={`text-lg font-bold mt-1 ${cvText.trim() ? "text-emerald-400" : "text-orange-400"}`}>
                    {cvText.trim() ? "✓ Loaded" : "✗ Missing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    Jobs to Analyze
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {jobDescriptions.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    Total Comparisons
                  </p>
                  <p className="text-lg font-bold text-secondary mt-1">
                    {cvText.trim() && jobDescriptions.length > 0 ? jobDescriptions.length : 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    Job Description
                  </p>
                  <p className={`text-lg font-bold mt-1 ${jobDescriptions[0] ? "text-emerald-400" : "text-orange-400"}`}>
                    {jobDescriptions[0] ? "✓ Loaded" : "✗ Missing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    CVs to Analyze
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {cvs.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">
                    Total Comparisons
                  </p>
                  <p className="text-lg font-bold text-secondary mt-1">
                    {jobDescriptions[0] && cvs.length > 0 ? cvs.length : 0}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={runBatchAnalysis}
              disabled={
                analyzing ||
                (mode === "jobs" && (!cvText.trim() || jobDescriptions.length === 0)) ||
                (mode === "cvs" && (!jobDescriptions[0] || cvs.length === 0))
              }
              className="w-full mt-8 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">
                {analyzing ? "hourglass_top" : "analytics"}
              </span>
              {analyzing ? "Analyzing..." : "Run Batch Analysis"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 flex items-start gap-3">
            <span className="material-symbols-outlined flex-shrink-0 mt-0.5">
              error
            </span>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  assessment
                </span>
                Analysis Results
              </h2>
              <button
                onClick={downloadResults}
                className="bg-secondary/20 border border-secondary/30 text-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondary/30 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  download
                </span>
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left py-3 px-4 font-bold text-on-surface">
                      {mode === "jobs" ? "Job Title" : "CV Name"}
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">
                      Match Score
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">
                      ATS Score
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">
                      Keywords
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">
                      Missing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors"
                      >
                        <td className="py-4 px-4 text-on-surface font-medium">
                          {mode === "jobs" ? result.jobTitle : result.cvName}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">
                            {result.matchScore}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            {result.atsScore}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-bold">
                            {result.keywordMatchPercentage}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-orange-300">
                          {result.missingKeywords.length}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Best Match */}
            {results.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
                {mode === "jobs" ? (
                  <>
                    <h3 className="font-bold text-on-surface mb-2">
                      🏆 Best Match Job
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      {results[0].jobTitle} — {results[0].matchScore}% match
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-on-surface mb-2">
                      🏆 Best Matching CV
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      {results[0].cvName} — {results[0].matchScore}% match
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/ats-optimize"
            className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-4 px-6 rounded-xl hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>
          <Link
            href="/dashboard/ats-history"
            className="flex-1 bg-secondary/20 border border-secondary/30 text-secondary font-bold py-4 px-6 rounded-xl hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">history</span>
            View History
          </Link>
        </div>
      </div>
    </main>
  );
}
