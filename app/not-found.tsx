import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden px-8">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl text-center space-y-12">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
            Error Code 404
          </span>
          <h1 className="font-headline text-7xl md:text-9xl font-black italic tracking-tighter leading-none bg-gradient-to-br from-on-surface to-on-surface-variant bg-clip-text text-transparent">
            LOST IN <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">THE VOID</span>
          </h1>
        </div>

        <p className="text-xl text-on-surface-variant font-body font-light leading-relaxed max-w-lg mx-auto">
          The destination you&apos;re seeking has drifted beyond our perimeter. In the expansive nocturne of digital opportunities, even the best talent occasionally finds themselves in uncharted space.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link 
            href="/" 
            className="bg-primary text-on-primary font-black px-10 py-5 rounded-2xl shadow-[0_15px_40px_rgba(202,162,247,0.3)] hover:scale-105 transition-all duration-300 uppercase text-xs tracking-widest"
          >
            Return to Home
          </Link>
          <Link 
            href="/jobs/browse" 
            className="bg-surface-container border border-outline/20 text-on-surface font-black px-10 py-5 rounded-2xl hover:bg-surface-bright transition-all duration-300 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            Search Jobs
          </Link>
        </div>
      </div>
      
      {/* Decorative lines - common in the Neon Nocturne design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-outline/20"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent to-outline/20"></div>
    </div>
  )
}
