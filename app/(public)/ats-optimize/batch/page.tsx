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

interface JobEntry { id: string; title: string; description: string }
interface CvEntry { id: string; name: string; text: string }

function AddJobForm({ onAdd }: { onAdd: (job: JobEntry) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAdd({ id: Date.now().toString(), title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-secondary/20 border border-secondary/30 text-secondary font-bold py-3 px-4 rounded-lg hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        Add Job to Analyze
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-high/60 border border-secondary/20 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Job Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Senior React Developer"
          required
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Job Description *</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          required
          rows={5}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 text-sm font-mono"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!title.trim() || !description.trim()}
          className="flex-1 bg-secondary text-on-secondary-container font-bold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
        >
          Add Job
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTitle(''); setDescription(''); }}
          className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddCvForm({ onAdd }: { onAdd: (cv: CvEntry) => void }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setFileError(null);
    if (!file.type.includes('text') && !file.name.endsWith('.txt')) {
      setFileError('Only .txt files supported');
      return;
    }
    const content = await file.text();
    setName(file.name.replace(/\.[^.]+$/, ''));
    setText(content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onAdd({ id: Date.now().toString(), name: name.trim(), text: text.trim() });
    setName('');
    setText('');
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => setOpen(true)}
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
          Upload .txt File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-high/60 border border-primary/20 rounded-xl p-6 space-y-4">
      {fileError && <p className="text-red-400 text-sm">{fileError}</p>}
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">CV Label *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., John_Smith_CV"
          required
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">CV Text *</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste the full CV content here..."
          required
          rows={6}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm font-mono"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!name.trim() || !text.trim()}
          className="flex-1 bg-primary text-on-primary font-bold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
        >
          Add CV
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setName(''); setText(''); }}
          className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function BatchAnalyzerPage() {
  const [mode, setMode] = useState<"cvs" | "jobs">("jobs");
  const [cvText, setCvText] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState<JobEntry[]>([]);
  const [cvs, setCvs] = useState<CvEntry[]>([]);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For "cvs" mode single job description
  const [singleJobTitle, setSingleJobTitle] = useState('');
  const [singleJobDesc, setSingleJobDesc] = useState('');

  const addJob = (job: JobEntry) => setJobDescriptions(prev => [...prev, job]);
  const removeJob = (id: string) => setJobDescriptions(prev => prev.filter(j => j.id !== id));
  const addCV = (cv: CvEntry) => setCvs(prev => [...prev, cv]);
  const removeCV = (id: string) => setCvs(prev => prev.filter(c => c.id !== id));

  const runBatchAnalysis = async () => {
    setError(null);

    if (mode === "jobs") {
      if (!cvText.trim()) { setError("Please enter your CV"); return; }
      if (jobDescriptions.length === 0) { setError("Please add at least one job to analyze against"); return; }
      setAnalyzing(true);
      const batchResults: BatchResult[] = [];
      try {
        for (const job of jobDescriptions) {
          const result = await analyzeCV(cvText, job.description);
          batchResults.push({
            id: job.id, cvName: "Your CV", jobTitle: job.title,
            matchScore: result.matchScore, atsScore: result.atsScore,
            keywordMatchPercentage: result.keywordMatchPercentage,
            missingKeywords: result.missingKeywords, presentKeywords: result.presentKeywords,
          });
        }
        setResults(batchResults);
      } catch (err: any) {
        setError(err.message || "Analysis failed");
      } finally {
        setAnalyzing(false);
      }
    } else {
      if (!singleJobDesc.trim()) { setError("Please enter a job description"); return; }
      if (cvs.length === 0) { setError("Please add at least one CV to analyze"); return; }
      setAnalyzing(true);
      const batchResults: BatchResult[] = [];
      try {
        for (const cv of cvs) {
          const result = await analyzeCV(cv.text, singleJobDesc);
          batchResults.push({
            id: cv.id, cvName: cv.name,
            jobTitle: singleJobTitle || "Target Job",
            matchScore: result.matchScore, atsScore: result.atsScore,
            keywordMatchPercentage: result.keywordMatchPercentage,
            missingKeywords: result.missingKeywords, presentKeywords: result.presentKeywords,
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

  const downloadResults = () => {
    if (results.length === 0) return;
    const headers = ["CV Name", "Job Title", "Match Score", "ATS Score", "Keyword Match", "Missing Keywords"];
    const rows = results.map(r => [r.cvName, r.jobTitle, r.matchScore, r.atsScore, r.keywordMatchPercentage, r.missingKeywords.join("; ")]);
    const csvContent = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
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

  const sortedResults = [...results].sort((a, b) => b.matchScore - a.matchScore);
  const canRun = mode === "jobs"
    ? cvText.trim().length > 0 && jobDescriptions.length > 0
    : singleJobDesc.trim().length > 0 && cvs.length > 0;

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/ats-optimize" className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">Batch CV Analysis</h1>
            <p className="text-on-surface-variant">Analyze multiple CVs against one job, or test one CV against multiple jobs</p>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => { setMode("jobs"); setResults([]); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "jobs" ? "bg-primary text-on-primary-container" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"}`}
            >
              <span className="material-symbols-outlined">person</span>
              1 CV vs Multiple Jobs
            </button>
            <button
              onClick={() => { setMode("cvs"); setResults([]); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "cvs" ? "bg-primary text-on-primary-container" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"}`}
            >
              <span className="material-symbols-outlined">people</span>
              Multiple CVs vs 1 Job
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            {mode === "jobs" ? (
              <>
                {/* CV Input */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Your CV
                  </h2>
                  <textarea
                    value={cvText}
                    onChange={e => setCvText(e.target.value)}
                    placeholder="Paste your CV here..."
                    className="w-full h-64 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">{cvText.length} characters</p>
                </div>

                {/* Jobs List */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">work</span>
                    Target Jobs ({jobDescriptions.length})
                  </h2>
                  <div className="space-y-3 mb-6">
                    {jobDescriptions.map(job => (
                      <div key={job.id} className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface truncate">{job.title}</h3>
                          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{job.description.substring(0, 120)}…</p>
                        </div>
                        <button onClick={() => removeJob(job.id)} className="text-on-surface-variant hover:text-red-400 transition-colors flex-shrink-0">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <AddJobForm onAdd={addJob} />
                </div>
              </>
            ) : (
              <>
                {/* Single Job Input */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">work</span>
                    Target Job Description
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Job Title (optional)</label>
                      <input
                        type="text"
                        value={singleJobTitle}
                        onChange={e => setSingleJobTitle(e.target.value)}
                        placeholder="e.g., Senior React Developer"
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Job Description *</label>
                      <textarea
                        value={singleJobDesc}
                        onChange={e => setSingleJobDesc(e.target.value)}
                        placeholder="Paste the full job description here..."
                        rows={8}
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface placeholder-on-surface-variant resize-none focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 text-sm font-mono"
                      />
                      <p className="text-xs text-on-surface-variant mt-2">{singleJobDesc.length} characters</p>
                    </div>
                  </div>
                </div>

                {/* CVs List */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Candidate CVs ({cvs.length})
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cvs.map(cv => (
                      <div key={cv.id} className="bg-surface-container-high/60 border border-outline-variant/10 rounded-lg p-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface truncate">{cv.name}</h3>
                          <p className="text-xs text-on-surface-variant mt-1">{cv.text.length} characters</p>
                        </div>
                        <button onClick={() => removeCV(cv.id)} className="text-on-surface-variant hover:text-red-400 transition-colors flex-shrink-0">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <AddCvForm onAdd={addCV} />
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
                  <p className="text-xs text-on-surface-variant uppercase font-bold">CV Status</p>
                  <p className={`text-lg font-bold mt-1 ${cvText.trim() ? "text-emerald-400" : "text-orange-400"}`}>
                    {cvText.trim() ? "✓ Loaded" : "✗ Missing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Jobs to Analyze</p>
                  <p className="text-lg font-bold text-primary mt-1">{jobDescriptions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Total Comparisons</p>
                  <p className="text-lg font-bold text-secondary mt-1">{canRun ? jobDescriptions.length : 0}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Job Description</p>
                  <p className={`text-lg font-bold mt-1 ${singleJobDesc.trim() ? "text-emerald-400" : "text-orange-400"}`}>
                    {singleJobDesc.trim() ? "✓ Loaded" : "✗ Missing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">CVs to Analyze</p>
                  <p className="text-lg font-bold text-primary mt-1">{cvs.length}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Total Comparisons</p>
                  <p className="text-lg font-bold text-secondary mt-1">{canRun ? cvs.length : 0}</p>
                </div>
              </div>
            )}
            <button
              onClick={runBatchAnalysis}
              disabled={analyzing || !canRun}
              className="w-full mt-8 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">{analyzing ? "hourglass_top" : "analytics"}</span>
              {analyzing ? "Analyzing…" : "Run Batch Analysis"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-12 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 flex items-start gap-3">
            <span className="material-symbols-outlined flex-shrink-0 mt-0.5">error</span>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {sortedResults.length > 0 && (
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">assessment</span>
                Analysis Results
              </h2>
              <button
                onClick={downloadResults}
                className="bg-secondary/20 border border-secondary/30 text-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondary/30 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left py-3 px-4 font-bold text-on-surface">{mode === "jobs" ? "Job Title" : "CV Name"}</th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">Match Score</th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">ATS Score</th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">Keywords</th>
                    <th className="text-center py-3 px-4 font-bold text-on-surface">Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map(result => (
                    <tr key={result.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors">
                      <td className="py-4 px-4 text-on-surface font-medium">{mode === "jobs" ? result.jobTitle : result.cvName}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">{result.matchScore}%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">{result.atsScore}%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-bold">{result.keywordMatchPercentage}%</span>
                      </td>
                      <td className="py-4 px-4 text-center text-orange-300">{result.missingKeywords.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
              <h3 className="font-bold text-on-surface mb-2">🏆 {mode === "jobs" ? "Best Match Job" : "Best Matching CV"}</h3>
              <p className="text-sm text-on-surface-variant">
                {mode === "jobs" ? sortedResults[0].jobTitle : sortedResults[0].cvName} — {sortedResults[0].matchScore}% match
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/ats-optimize" className="flex-1 bg-primary/20 border border-primary/30 text-primary font-bold py-4 px-6 rounded-xl hover:bg-primary/30 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Analyzer
          </Link>
          <Link href="/dashboard/ats-history" className="flex-1 bg-secondary/20 border border-secondary/30 text-secondary font-bold py-4 px-6 rounded-xl hover:bg-secondary/30 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">history</span>
            View History
          </Link>
        </div>
      </div>
    </main>
  );
}
