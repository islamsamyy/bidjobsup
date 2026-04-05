'use client'

import { useState } from 'react'
import { sendContactEmail } from './actions'

const CONTACT_INFO = [
  { icon: 'location_on', title: 'Riyadh HQ', details: 'Kingdom Centre Tower, Floor 42\nAl Olaya, Riyadh, Saudi Arabia' },
  { icon: 'mail', title: 'Direct Inquiries', details: 'concierge@bidjobs.io\ntalent@bidjobs.io' },
  { icon: 'schedule', title: 'Hours of Operation', details: '24/7 Digital Hub Access\nLive Support: 9:00 AM – 6:00 PM AST' },
  { icon: 'diversity_3', title: 'Media Relations', details: 'press@bidjobs.io\npartners@bidjobs.io' },
]

export default function ContactPage() {
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await sendContactEmail(formData)
    setPending(false)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <main className="pt-32 pb-40 px-8 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
        {/* Left — Contact Info */}
        <div className="space-y-20">
          <header className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase">
              Support Concierge
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-[#faf1f5] tracking-tighter leading-[0.9] uppercase">
              Connect with <br />
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">Concierge</span>
            </h1>
            <p className="text-xl text-[#b0a9ad] max-w-lg leading-relaxed font-light">
              Our elite support team is here to assist with your studio inquiries, talent sourcing, and high-stakes bidding.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {CONTACT_INFO.map((c) => (
              <div key={c.title} className="group space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1c181c] border border-[#292428] flex items-center justify-center text-[#caa2f7] group-hover:bg-[#caa2f7] group-hover:text-[#431f6b] transition-all duration-500 shadow-xl">
                  <span className="material-symbols-outlined text-3xl">{c.icon}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-xl font-black text-[#faf1f5] uppercase tracking-tight">{c.title}</h3>
                  <p className="text-[#b0a9ad] font-light text-sm leading-relaxed whitespace-pre-line">{c.details}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-[#292428] space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0a9ad]/50">Follow the Vision</p>
            <div className="flex gap-12">
              {['LinkedIn', 'Instagram', 'X (Twitter)'].map((social) => (
                <a key={social} href="#" className="group text-[#faf1f5] font-black text-xs tracking-widest uppercase flex items-center gap-2 hover:text-[#caa2f7] transition-colors">
                  {social}
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_outward</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#caa2f7]/5 rounded-[3rem] blur-3xl group-hover:bg-[#caa2f7]/10 transition duration-700" />
          <div className="relative bg-[#1c181c] p-12 md:p-16 rounded-[3rem] border border-[#292428] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            {success ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-4xl text-[#22c55e]">check_circle</span>
                </div>
                <h2 className="font-headline text-3xl font-black text-[#faf1f5]">Message Dispatched</h2>
                <p className="text-[#b0a9ad] font-light max-w-sm mx-auto">
                  Your message has been delivered to our concierge team. Expect a response within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#4b474a] hover:text-[#b0a9ad] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/50 ml-1" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Elias Vance"
                      className="w-full bg-[#151215] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#4b474a] focus:ring-1 focus:ring-[#caa2f7]/50 focus:border-[#caa2f7]/30 transition-all font-medium text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/50 ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="elias@studio.co"
                      className="w-full bg-[#151215] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#4b474a] focus:ring-1 focus:ring-[#caa2f7]/50 focus:border-[#caa2f7]/30 transition-all font-medium text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/50 ml-1" htmlFor="subject">
                    Subject of Inquiry
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    defaultValue="Studio Partnerships"
                    className="w-full bg-[#151215] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] focus:ring-1 focus:ring-[#caa2f7]/50 focus:border-[#caa2f7]/30 appearance-none transition-all font-medium text-sm cursor-pointer outline-none"
                  >
                    <option>Studio Partnerships</option>
                    <option>Talent Verification</option>
                    <option>Brief Management</option>
                    <option>Technical Support</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#b0a9ad]/50 ml-1" htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="How can we elevate your experience?"
                    rows={6}
                    className="w-full bg-[#151215] border border-[#292428] rounded-2xl py-5 px-6 text-[#faf1f5] placeholder:text-[#4b474a] focus:ring-1 focus:ring-[#caa2f7]/50 focus:border-[#caa2f7]/30 transition-all font-medium text-sm resize-none outline-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#ff6e84]/10 border border-[#ff6e84]/20 text-[#ff6e84] text-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-gradient-to-r from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-headline font-black text-xl py-6 rounded-2xl shadow-[0_20px_40px_rgba(202,162,247,0.3)] hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-tighter"
                  >
                    {pending ? 'Dispatching…' : 'Dispatch Message'}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3 text-[#b0a9ad]/40">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">AES-256 Encryption Secured</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
