"use client";

import React, { Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { signup } from '../actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      className="w-full bg-gradient-to-br from-[#caa2f7] to-[#613471] text-white font-black py-5 rounded-[1.5rem] shadow-[0_20px_40px_rgba(202,162,247,0.2)] hover:shadow-[0_25px_50px_rgba(202,162,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" 
      type="submit"
      disabled={pending}
    >
      {pending ? 'Processing...' : 'Initiate Genesis'}
      <span className="material-symbols-outlined text-sm">{pending ? 'sync' : 'bolt'}</span>
    </button>
  )
}

function ErrorMessage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  if (!message) return null
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest text-center">
      {message}
    </div>
  )
}

function RoleSelector({ role, setRole }: { role: string, setRole: (r: string) => void }) {
  const searchParams = useSearchParams()
  // Only apply role from URl on first mount
  React.useEffect(() => {
    const defaultRole = searchParams.get('role')
    if (defaultRole === 'employer' || defaultRole === 'jobseeker') {
      setRole(defaultRole)
    }
  }, [searchParams, setRole])
  return null
}

export default function CreateProfilePage() {
  const [role, setRole] = React.useState('jobseeker');
  
  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-['Outfit'] selection:bg-[#caa2f7]/30 selection:text-[#faf1f5] min-h-screen flex flex-col relative">
      <Suspense fallback={null}>
        <RoleSelector role={role} setRole={setRole} />
      </Suspense>
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#100d10]/70 backdrop-blur-xl border-b border-[#292428]/30">
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="BidJobs Logo" className="h-10 w-auto group-hover:opacity-90 transition-opacity duration-300" />
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-[#b0a9ad] text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Identity Genesis</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-center justify-center pt-32 pb-20 px-6 md:px-12 gap-16 max-w-screen-2xl mx-auto w-full overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#caa2f7]/5 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#613471]/5 blur-[120px] rounded-full"></div>
        </div>

        {/* Left Section: Editorial Content */}
        <div className="w-full md:w-1/2 space-y-12 order-2 md:order-1 lg:pr-20">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
              Vision 2030 Career Portal
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter uppercase">
              Craft Your <br/>
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Digital Identity</span>
            </h1>
            <p className="text-[#b0a9ad] text-xl font-light leading-relaxed max-w-xl">
              Join an elite sanctuary of world-class talent and monumental ambitions. Your next architectural milestone begins here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#292428]/30">
            <div className="space-y-2">
              <div className="text-4xl font-headline font-black text-[#faf1f5]">12k+</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#caa2f7]">Placements</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-headline font-black text-[#faf1f5]">SAR 4M+</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#caa2f7]">Elite Payouts</p>
            </div>
          </div>
        </div>

        {/* Right Section: Registration Form Card */}
        <div className="w-full md:w-[520px] order-1 md:order-2">
          <div className="bg-[#1c181c]/60 backdrop-blur-3xl border border-[#4b474a]/20 p-10 md:p-14 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-black text-[#faf1f5] uppercase tracking-tight">Create <span className="text-[#caa2f7] italic font-light">Account</span></h2>
                <p className="text-[#b0a9ad] text-sm font-light uppercase tracking-widest">Select your trajectory.</p>
              </div>

              <Suspense fallback={null}>
                <ErrorMessage />
              </Suspense>

              <form className="space-y-8" action={signup}>
 {/* Form implementation will be handled by the serverAction wrapper if needed, logic preserved */}
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2 font-semibold">Full Identity</label>
                  <div className="relative group">
                    <input 
                      name="fullName" 
                      className="w-full bg-[#100d10] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none" 
                      placeholder="Khalid Al-Faisal" 
                      type="text" 
                      required 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2 font-semibold">Digital Domain</label>
                  <div className="relative group">
                    <input 
                      name="email" 
                      className="w-full bg-[#100d10] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none" 
                      placeholder="architect@neom.sa" 
                      type="email" 
                      required 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2 font-semibold">Security Credential</label>
                  <div className="relative group">
                    <input 
                      name="password" 
                      className="w-full bg-[#100d10] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#b0a9ad]/20 focus:border-[#caa2f7]/50 transition-all duration-300 outline-none" 
                      placeholder="••••••••" 
                      type="password" 
                      required 
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad] px-2">Account Destiny</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label 
                      onClick={() => setRole('jobseeker')}
                      className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all cursor-pointer group/opt ${role === 'jobseeker' ? 'bg-[#caa2f7]/10 border-[#caa2f7]/50 ring-1 ring-[#caa2f7]/20 shadow-[0_0_20px_rgba(202,162,247,0.1)]' : 'bg-[#100d10] border-[#292428] hover:border-[#4b474a]'}`}
                    >
                      <input type="radio" name="userType" value="jobseeker" className="hidden" checked={role === 'jobseeker'} readOnly />
                      <span className={`material-symbols-outlined text-2xl transition-colors ${role === 'jobseeker' ? 'text-[#caa2f7]' : 'text-[#b0a9ad]/40'}`}>person</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'jobseeker' ? 'text-[#faf1f5]' : 'text-[#b0a9ad]/40'}`}>Freelancer</span>
                    </label>
                    <label 
                      onClick={() => setRole('employer')}
                      className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all cursor-pointer group/opt ${role === 'employer' ? 'bg-[#caa2f7]/10 border-[#caa2f7]/50 ring-1 ring-[#caa2f7]/20 shadow-[0_0_20px_rgba(202,162,247,0.1)]' : 'bg-[#100d10] border-[#292428] hover:border-[#4b474a]'}`}
                    >
                      <input type="radio" name="userType" value="employer" className="hidden" checked={role === 'employer'} readOnly />
                      <span className={`material-symbols-outlined text-2xl transition-colors ${role === 'employer' ? 'text-[#caa2f7]' : 'text-[#b0a9ad]/40'}`}>corporate_fare</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'employer' ? 'text-[#faf1f5]' : 'text-[#b0a9ad]/40'}`}>Company</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <SubmitButton />
              </form>

              <p className="text-center text-xs text-[#b0a9ad] font-light tracking-wide mt-10">
                Already part of the collective? 
                <Link className="text-[#caa2f7] font-black hover:text-white transition-colors ml-2 underline underline-offset-8 decoration-[#caa2f7]/30 uppercase tracking-widest" href="/sign-in">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#100d10] border-t border-[#292428]/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/40">© 2026 BidJobs. Vision 2030 Corporate.</p>
        <div className="flex gap-8">
          <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/40 hover:text-[#caa2f7] transition-colors">Platform Ethics</Link>
        </div>
      </footer>
    </div>
  )
}