"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyzeCV } from "@/lib/actions/ats";

export default function ATSOptimizePage() {
  const router = useRouter();
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cvText.trim() || !jobDescription.trim()) {
      setError("Please provide both CV and job description");
      return;
    }

    setLoading(true);
    try {
      const results = await analyzeCV(cvText, jobDescription);

      // Store results in sessionStorage for results page
      sessionStorage.setItem("atsResults", JSON.stringify(results));

      router.push("/ats-optimize/results");
    } catch (err: any) {
      setError(err.message || "Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-10 lg:px-14">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">
              verified_user
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface">
              ATS Optimizer
            </h1>
          </div>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Optimize your CV for Applicant Tracking Systems. Get a detailed
            analysis and recommendations to improve your chances of passing ATS
            filters and getting noticed by employers.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleAnalyze} className="space-y-8">
          {/* CV Input Section */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                description
              </span>
              Your CV/Resume
            </h2>

            {/* Tab Switcher */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "upload"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  upload_file
                </span>
                Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paste")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "paste"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  content_paste
                </span>
                Paste Text
              </button>
            </div>

            {/* Upload Area or Textarea */}
            {activeTab === "upload" ? (
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-primary/60 mx-auto block mb-4">
                  cloud_upload
                </span>
                <p className="text-on-surface font-semibold mb-1">
                  Drag and drop your PDF
                </p>
                <p className="text-on-surface-variant text-sm">
                  or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setCvText(event.target?.result as string);
                      };
                      reader.readAsText(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV/Resume text here..."
                className="w-full h-64 p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none resize-none"
              />
            )}
            <p className="text-xs text-on-surface-variant mt-3">
              {cvText.length} characters
            </p>
          </div>

          {/* Job Description Section */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">
                work
              </span>
              Target Job Description
            </h2>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're applying for..."
              className="w-full h-48 p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-secondary/50 focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-on-surface-variant mt-3">
              {jobDescription.length} characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 flex items-start gap-3">
              <span className="material-symbols-outlined flex-shrink-0">
                error
              </span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || !cvText.trim() || !jobDescription.trim()}
              className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-4 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    hourglass_top
                  </span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    analytics
                  </span>
                  Analyze CV for ATS
                </>
              )}
            </button>
            <Link
              href="/"
              className="flex-1 bg-surface-container border border-outline-variant/20 text-on-surface font-bold py-4 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>
              </div>
              <h3 className="font-bold text-on-surface">Quick Analysis</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Get instant feedback on your CV compatibility with the job
              description in seconds.
            </p>
          </div>

          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">
                  trending_up
                </span>
              </div>
              <h3 className="font-bold text-on-surface">Detailed Score</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              See your match percentage and get specific insights on missing
              keywords and skills.
            </p>
          </div>

          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">
                  lightbulb
                </span>
              </div>
              <h3 className="font-bold text-on-surface">Smart Tips</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Get actionable recommendations to optimize your CV and improve
              your chances.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
