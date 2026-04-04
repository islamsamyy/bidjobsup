import React from 'react';
import Link from 'next/link'
import { resetPassword } from '../actions'

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
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
        
        <div className="relative z-10 w-full max-w-[520px] px-6">
          <div className="mb-12 text-center md:text-left">
            <h1 className="font-headline text-4xl md:text-5xl font-black text-[#faf1f5] mb-6 tracking-tighter uppercase leading-tight">
              Secure your <br/><span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_15px_rgba(202,162,247,0.3)] tracking-widest">professional</span> future.
            </h1>
            <p className="text-[#b0a9ad] text-sm font-light max-w-sm">
              Choose a strong, unique password to protect your talent profile and active bids.
            </p>
          </div>

          {/* Neon Nocturne Auth Card */}
          <div className="bg-[#1c181c]/40 backdrop-blur-2xl border border-[#4b474a]/20 rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            
            {message && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest text-center">
                {message}
              </div>
            )}

            <form className="space-y-8" action={resetPassword}>
              {/* New Password Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2" htmlFor="new_password">New Password</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#100d10] border border-[#292428] rounded-2xl px-6 py-5 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none group-hover:border-[#4b474a]" 
                    id="new_password" 
                    name="new_password" 
                    placeholder="••••••••••••" 
                    type="password" 
                    required 
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-[#b0a9ad]/40">
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#caa2f7] transition-colors font-bold text-lg">visibility</span>
                  </div>
                </div>
                {/* Strength Indicator */}
                <div className="px-2 pt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#b0a9ad]/50 font-black">Security Grade</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#caa2f7] font-black">Strong</span>
                  </div>
                  <div className="flex gap-2 h-1">
                    <div className="flex-1 rounded-full bg-[#caa2f7] shadow-[0_0_8px_rgba(202,162,247,0.4)]"></div>
                    <div className="flex-1 rounded-full bg-[#caa2f7] shadow-[0_0_8px_rgba(202,162,247,0.4)]"></div>
                    <div className="flex-1 rounded-full bg-[#caa2f7] shadow-[0_0_8px_rgba(202,162,247,0.4)]"></div>
                    <div className="flex-1 rounded-full bg-[#292428]"></div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2" htmlFor="confirm_password">Confirm New Password</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#100d10] border border-[#292428] rounded-2xl px-6 py-5 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none group-hover:border-[#4b474a]" 
                    id="confirm_password" 
                    name="confirm_password" 
                    placeholder="••••••••••••" 
                    type="password" 
                    required 
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#b0a9ad]/40">
                    <span className="material-symbols-outlined font-bold text-lg">lock</span>
                  </div>
                </div>
              </div>
              
              {/* Primary Action */}
              <button 
                className="w-full bg-gradient-to-br from-[#caa2f7] to-[#613471] text-white font-black py-5 rounded-[1.5rem] shadow-[0_20px_40px_rgba(202,162,247,0.2)] hover:shadow-[0_25px_50px_rgba(202,162,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3" 
                type="submit"
              >
                Reset Password
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </form>
            
            {/* Security Info */}
            <div className="mt-12 pt-8 border-t border-[#4b474a]/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#1c181c] rounded-xl border border-[#4b474a]/20">
                  <span className="material-symbols-outlined text-[#caa2f7] text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <div>
                  <h4 className="text-[#faf1f5] text-[10px] font-black uppercase tracking-widest mb-1.5">Advanced Protection</h4>
                  <p className="text-[#b0a9ad]/60 text-[10px] leading-relaxed font-light uppercase tracking-wider">
                    Our security protocols ensure your session is encrypted. After resetting, you will be logged out of all other devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Link */}
          <div className="mt-10 text-center">
            <Link className="text-[#b0a9ad] text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#caa2f7] transition-all duration-300 flex items-center justify-center gap-2 group" href="/sign-in">
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform font-bold">chevron_left</span>
              Return to login
            </Link>
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