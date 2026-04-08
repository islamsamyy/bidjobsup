'use client'

import { useState } from 'react'
import { submitContactForm } from '@/lib/actions/contact'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('sending')
    setErrorMsg('')
    const result = await submitContactForm(formData)
    if (result.error) {
      setStatus('error')
      setErrorMsg(result.error)
    } else {
      setStatus('success')
    }
  }

  return (
    <div className="min-h-screen pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left Side: Contact Information */}
        <div className="space-y-12">
          <header className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-background tracking-tight leading-tight">
              Connect with <span className="text-primary italic">Concierge</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed font-light">
              Our elite support team is here to assist with your studio inquiries,
              talent sourcing, and high-stakes bidding. Experience the Neon Nocturne
              with seamless assistance.
            </p>
          </header>

          <div className="space-y-8">
            {/* Location Card */}
            <div className="flex items-start space-x-6 p-1 group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline text-xl text-on-surface mb-1">Riyadh HQ</h3>
                <p className="text-on-surface-variant font-light">
                  Kingdom Centre Tower, Floor 42
                  <br />
                  Al Olaya, Riyadh, Saudi Arabia
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="flex items-start space-x-6 p-1 group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline text-xl text-on-surface mb-1">Direct Inquiries</h3>
                <p className="text-on-surface-variant font-light">concierge@bidjobs.vision</p>
                <p className="text-on-surface-variant font-light">talent@bidjobs.vision</p>
              </div>
            </div>

            {/* Availability Card */}
            <div className="flex items-start space-x-6 p-1 group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline text-xl text-on-surface mb-1">Hours of Operation</h3>
                <p className="text-on-surface-variant font-light">24/7 Digital Concierge Access</p>
                <p className="text-on-surface-variant font-light">Live Support: 9:00 AM - 6:00 PM AST</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-white/5 max-w-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-semibold">
              Follow the Vision
            </p>
            <div className="flex space-x-8">
              <span className="text-neutral-500 hover:text-primary transition-colors duration-300 cursor-default">
                LinkedIn
              </span>
              <span className="text-neutral-500 hover:text-primary transition-colors duration-300 cursor-default">
                Instagram
              </span>
              <span className="text-neutral-500 hover:text-primary transition-colors duration-300 cursor-default">
                X (Twitter)
              </span>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden group">
            <div className="w-full h-full bg-gradient-to-br from-surface-container-low via-surface-container to-primary/10 opacity-40 group-hover:opacity-60 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span className="text-sm font-body text-on-surface">View on Map</span>
            </div>
          </div>
        </div>

        {/* Right Side: Support Form */}
        <div className="bg-surface-container/60 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Message Dispatched</h3>
              <p className="text-on-surface-variant">Our concierge team will respond within 24 hours.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 px-8 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-all font-bold text-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
          <form action={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="bg-error-container/20 border border-error/30 text-error px-5 py-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 px-5 text-on-surface placeholder:text-neutral-700 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                  id="name"
                  name="name"
                  placeholder="Elias Vance"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 px-5 text-on-surface placeholder:text-neutral-700 focus:ring-1 focus:ring-primary/50 transition-all font-body"
                  id="email"
                  name="email"
                  placeholder="elias@studio.co"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
                htmlFor="subject"
              >
                Subject of Inquiry
              </label>
              <select
                className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 px-5 text-on-surface focus:ring-1 focus:ring-primary/50 appearance-none transition-all font-body"
                id="subject"
                name="subject"
              >
                <option>Studio Partnerships</option>
                <option>Talent Verification</option>
                <option>Brief Management</option>
                <option>Technical Support</option>
                <option>Press &amp; Media</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
                htmlFor="message"
              >
                Your Message
              </label>
              <textarea
                className="w-full bg-surface-container-lowest border-0 rounded-lg py-4 px-5 text-on-surface placeholder:text-neutral-700 focus:ring-1 focus:ring-primary/50 transition-all font-body resize-none"
                id="message"
                name="message"
                placeholder="How can we elevate your experience?"
                rows={6}
                required
              />
            </div>

            <div className="pt-4">
              <button
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold text-xl py-5 rounded-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Dispatching...' : 'Dispatch Message'}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-3 text-on-surface-variant/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <p className="text-xs font-body">Your data is secured with AES-256 encryption.</p>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
