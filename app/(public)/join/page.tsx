import Link from 'next/link'

export const metadata = {
  title: 'Join BidJobs — Choose Your Path | Vision 2030 Talent Ecosystem',
  description: 'Select your entry point to the Vision 2030 talent ecosystem.',
}

export default function JoinPage() {
  return (
    <div className="px-6 pt-12 pb-20 overflow-hidden">
      <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#caa2f7]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#613471]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="text-center mb-20 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
            Gateway to Excellence
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-[#faf1f5] uppercase leading-[0.9]">
            Define your{' '}
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_15px_rgba(202,162,247,0.3)]">
              Trajectory
            </span>
          </h1>
          <p className="text-[#b0a9ad] max-w-xl mx-auto text-lg font-light leading-relaxed">
            Select your entry point to the Vision 2030 talent ecosystem. Elite opportunities meet exceptional leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <Link
            href="/sign-up?role=jobseeker"
            className="bg-[#1c181c]/40 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-[#292428] hover:border-[#caa2f7]/30 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col min-h-[400px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#613471]/30 border border-[#caa2f7]/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#caa2f7] text-3xl">work</span>
            </div>
            <h3 className="font-headline text-3xl font-black mb-6 text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors uppercase tracking-tight">
              I am a <br />Freelancer
            </h3>
            <p className="text-[#b0a9ad] leading-relaxed font-light mb-auto">
              Access exclusive high-stakes roles, architectural mandates, and senior leadership positions within firms redefining the Kingdom&apos;s future.
            </p>
            <div className="mt-10 flex items-center gap-3 text-[#caa2f7] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              Secure Opportunities <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          <Link
            href="/sign-up?role=employer"
            className="bg-[#1c181c]/40 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-[#292428] hover:border-[#caa2f7]/30 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col min-h-[400px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#caa2f7]/10 border border-[#caa2f7]/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#caa2f7] text-3xl">architecture</span>
            </div>
            <h3 className="font-headline text-3xl font-black mb-6 text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors uppercase tracking-tight">
              I am a <br />Company
            </h3>
            <p className="text-[#b0a9ad] leading-relaxed font-light mb-auto">
              Source world-class talent, manage elite bidding protocols, and build at the speed of vision with professionals who redefine industry.
            </p>
            <div className="mt-10 flex items-center gap-3 text-[#caa2f7] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              Recruit Excellence <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="text-[#b0a9ad] text-sm font-light tracking-wide">
            Already part of the collective?{' '}
            <Link className="text-[#caa2f7] font-black hover:text-white transition-colors ml-2 underline underline-offset-8 decoration-[#caa2f7]/30 uppercase tracking-widest" href="/sign-in">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}