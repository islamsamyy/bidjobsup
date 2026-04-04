import React from 'react';
import Link from 'next/link'
import { forgotPassword } from '../actions'

export default function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = React.use(searchParams);
  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-['Outfit'] min-h-screen flex flex-col relative selection:bg-[#caa2f7]/30 selection:text-[#faf1f5]">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#100d10]/70 backdrop-blur-xl border-b border-[#292428]/30">
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="BidJobs Logo" className="h-10 w-auto group-hover:opacity-90 transition-opacity duration-300" />
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <span className="text-[#b0a9ad] text-[10px] font-black uppercase tracking-[0.2em]">Support</span>
          </div>
        </div>
      </header>

      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-[#caa2f7]/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#613471]/5 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[480px] px-6">
          {/* Neon Nocturne Auth Card */}
          <div className="bg-[#1c181c]/40 backdrop-blur-2xl border border-[#4b474a]/20 rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            <div className="mb-12 text-center md:text-left">
              <span className="font-['Outfit'] text-[#caa2f7] text-[10px] uppercase tracking-[0.3em] font-black mb-4 block">Security & Access</span>
              <h1 className="font-headline text-4xl font-black text-[#faf1f5] mb-4 tracking-tighter uppercase">
                Recover <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_15px_rgba(202,162,247,0.3)]">Access</span>
              </h1>
              <p className="text-[#b0a9ad] text-sm font-light leading-relaxed">
                Enter your credentials below. We will send a secure architectural link to reset your workspace access.
              </p>
            </div>
            
            {message && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest text-center">
                {message}
              </div>
            )}

            <form className="space-y-8" action={forgotPassword}>
              {/* Email Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#100d10] border border-[#292428] rounded-2xl px-6 py-5 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none group-hover:border-[#4b474a]" 
                    id="email" 
                    name="email" 
                    placeholder="architect@vision2030.sa" 
                    type="email" 
                    required 
                  />
                </div>
              </div>
              
              {/* Primary Action */}
              <button 
                className="w-full bg-gradient-to-br from-[#caa2f7] to-[#613471] text-white font-black py-5 rounded-[1.5rem] shadow-[0_20px_40px_rgba(202,162,247,0.2)] hover:shadow-[0_25px_50px_rgba(202,162,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3" 
                type="submit"
              >
                Send Recovery Link
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>

              <div className="flex justify-center pt-4">
                <Link className="inline-flex items-center gap-2 text-[#b0a9ad] text-[10px] font-black uppercase tracking-widest hover:text-[#caa2f7] transition-all duration-300 group" href="/sign-in">
                  <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform font-bold">keyboard_backspace</span>
                  Back to Sign In
                </Link>
              </div>
            </form>
            
            {/* Help Context */}
            <div className="mt-16 pt-8 border-t border-[#4b474a]/10 flex items-start gap-4">
              <div className="p-2.5 bg-[#1c181c] rounded-xl border border-[#4b474a]/20">
                <span className="material-symbols-outlined text-[#caa2f7] text-sm font-bold">info</span>
              </div>
              <p className="text-[10px] text-[#b0a9ad]/60 leading-relaxed font-light uppercase tracking-wider">
                If you no longer have access to this email, please contact our <span className="text-[#caa2f7] font-black hover:underline cursor-pointer">Vision 2030 Concierge</span> for manual identity verification.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#100d10] border-t border-[#292428]/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/40">© 2026 BidJobs. Vision 2030 Certified.</p>
        <div className="flex gap-8">
          <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/40 hover:text-[#caa2f7] transition-colors">Legal Framework</Link>
        </div>
      </footer>
    </div>
  )
}