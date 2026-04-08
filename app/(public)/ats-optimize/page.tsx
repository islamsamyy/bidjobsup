"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyzeCV } from "@/lib/actions/ats";

export default function ATSOptimizePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("paste");
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file upload - supports PDF and text files
  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploadProgress(0);

    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit");
      return;
    }

    try {
      setUploadProgress(30);

      // Handle PDF files
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // Convert PDF to text using a simple approach
        const buffer = await file.arrayBuffer();
        const text = extractTextFromPDF(buffer);
        setCvText(text);
        setUploadProgress(100);
        return;
      }

      // Handle text files
      if (
        file.type === "text/plain" ||
        file.type === "text/csv" ||
        file.name.endsWith(".txt")
      ) {
        const text = await file.text();
        setCvText(text);
        setUploadProgress(100);
        return;
      }

      setError(
        "Unsupported file type. Please upload a PDF or text file."
      );
    } catch (err: any) {
      setError(err.message || "Failed to process file");
    } finally {
      setUploadProgress(0);
    }
  };

  // Simple PDF text extraction (handles basic PDFs)
  const extractTextFromPDF = (buffer: ArrayBuffer): string => {
    // Convert PDF binary to string and extract text patterns
    const view = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    let text = "";

    try {
      // Look for text streams in PDF
      let i = 0;
      while (i < view.length) {
        // BT = Begin Text, ET = End Text
        if (view[i] === 66 && view[i + 1] === 84 && view[i + 2] === 10) {
          // Found BT marker
          let j = i + 3;
          let textSection = "";

          while (j < view.length - 2) {
            // Look for text content between ( and )
            if (view[j] === 40) {
              // Found (
              let k = j + 1;
              while (k < view.length && view[k] !== 41) {
                // Not )
                if (view[k] >= 32 && view[k] <= 126) {
                  // Printable ASCII
                  textSection += String.fromCharCode(view[k]);
                }
                k++;
              }
              if (k < view.length && view[k] === 41) {
                // Found closing )
                textSection += " ";
              }
              j = k;
            }

            // Check for ET (End Text)
            if (view[j] === 69 && view[j + 1] === 84) {
              text += textSection + "\n";
              i = j + 2;
              break;
            }
            j++;
          }
        }
        i++;
      }

      // If no text found with pattern matching, try raw extraction
      if (!text) {
        text = decoder.decode(buffer);
        // Remove binary data, keep only printable characters
        text = text
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s+/g, " ");
      }

      return text.trim() || "No text found in PDF. Please paste the content manually.";
    } catch (err) {
      return "Error reading PDF. Please paste the content manually.";
    }
  };

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

      // Store results and CV text in sessionStorage for results page
      sessionStorage.setItem("atsResults", JSON.stringify(results));
      sessionStorage.setItem("cvText", cvText);
      sessionStorage.setItem("jobDescription", jobDescription);

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
              <div
                className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("bg-primary/20");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("bg-primary/20");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("bg-primary/20");
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
              >
                <span className="material-symbols-outlined text-4xl text-primary/60 mx-auto block mb-4">
                  cloud_upload
                </span>
                <p className="text-on-surface font-semibold mb-1">
                  Drag and drop your PDF or text file
                </p>
                <p className="text-on-surface-variant text-sm">
                  or click to browse (max 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      Processing... {uploadProgress}%
                    </p>
                  </div>
                )}
                {cvText && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/20">
                    <p className="text-xs text-emerald-300 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      File loaded successfully ({cvText.length} characters)
                    </p>
                  </div>
                )}
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
              href="/ats-optimize/editor"
              className="flex-1 bg-secondary/20 border border-secondary/30 text-secondary font-bold py-4 px-6 rounded-xl hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">edit</span>
              Use CV Editor
            </Link>
            <Link
              href="/"
              className="flex-1 bg-surface-container border border-outline-variant/20 text-on-surface font-bold py-4 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
          </div>
        </form>

        {/* Additional Features */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-6">More Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/ats-optimize/editor"
              className="bg-surface-container/60 border border-white/5 hover:border-primary/30 rounded-xl p-6 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary">edit</span>
              </div>
              <h3 className="font-bold text-on-surface mb-1">CV Editor</h3>
              <p className="text-xs text-on-surface-variant">
                Edit your CV and see live ATS score updates
              </p>
            </Link>

            <Link
              href="/ats-optimize/batch"
              className="bg-surface-container/60 border border-white/5 hover:border-secondary/30 rounded-xl p-6 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                <span className="material-symbols-outlined text-secondary">
                  batch_prediction
                </span>
              </div>
              <h3 className="font-bold text-on-surface mb-1">Batch Analyzer</h3>
              <p className="text-xs text-on-surface-variant">
                Compare one CV against multiple jobs or vice versa
              </p>
            </Link>

            <Link
              href="/dashboard/ats-history"
              className="bg-surface-container/60 border border-white/5 hover:border-primary/30 rounded-xl p-6 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
              </div>
              <h3 className="font-bold text-on-surface mb-1">View History</h3>
              <p className="text-xs text-on-surface-variant">
                Track your ATS improvement over time with analytics
              </p>
            </Link>
          </div>
        </div>

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
