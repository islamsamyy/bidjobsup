'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Job List Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-surface flex flex-col items-center justify-center relative overflow-hidden px-8 py-20">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl text-center space-y-12">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            System Protocol Failure
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter leading-none bg-gradient-to-br from-on-surface to-on-surface-variant bg-clip-text text-transparent uppercase">
            CONNECTION <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">INTERRUPTED</span>
          </h1>
          {error.digest && (
             <p className="text-[10px] font-mono text-on-surface-variant/40 mt-4">
               CORE_HASH: {error.digest}
             </p>
          )}
        </div>

        <p className="text-lg text-on-surface-variant font-body font-light leading-relaxed max-w-lg mx-auto">
          Our specialized data streams encountered an unexpected anomaly. This occasionally happens when the digital nodes are recalibrating.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <button
            onClick={() => unstable_retry()}
            className="group relative bg-primary text-on-primary font-black px-10 py-5 rounded-2xl shadow-[0_15px_40px_rgba(202,162,247,0.3)] hover:scale-105 transition-all duration-300 uppercase text-xs tracking-widest overflow-hidden"
          >
            <span className="relative z-10">Re-initialize Segment</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          <Link 
            href="/" 
            className="bg-surface-container border border-outline/20 text-on-surface font-black px-10 py-5 rounded-2xl hover:bg-surface-bright transition-all duration-300 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            Terminal Home
          </Link>
        </div>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-outline/20"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent to-outline/20"></div>
    </div>
  );
}
