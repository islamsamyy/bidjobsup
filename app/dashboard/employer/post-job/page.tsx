'use client'

import { useState } from 'react'
import { createJob } from './actions'
import { useRouter } from 'next/navigation'

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      await createJob(formData)
      // NOTE: the server action will redirect to /dashboard/employer/listings on success
    } catch (err: any) {
      // Server actions that redirect will throw NEXT_REDIRECT
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return // Let the redirect happen
      }
      console.error('Post job error:', err)
      setError(err.message || 'Failed to post job')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress Stepper - Visual Only */}
      <div className="w-full max-w-3xl mb-16 hidden md:block">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/20 -z-10"></div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-primary font-bold shadow-[0_0_20px_rgba(234,179,250,0.4)]">1</div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-secondary">Role</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant font-bold">2</div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-500">Details</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant font-bold">3</div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-500">Requirements</span>
          </div>
        </div>
      </div>

      <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Instructional Text */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h1 className="font-headline italic text-4xl lg:text-5xl leading-tight text-on-background">
            Define the <span className="text-secondary">Vision.</span>
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed text-sm">
            Begin your journey to acquire world-class talent. Specify the core attributes of the role to help our matching engine find the elite candidates suited for your initiatives.
          </p>
          <div className="mt-8 p-6 rounded-xl bg-surface-container-low border-l-2 border-secondary/40">
            <span className="material-symbols-outlined text-secondary mb-3">lightbulb</span>
            <p className="text-[12px] font-body text-stone-400 italic">
              Include specific skills and clear budget ranges to increase engagement from premium talent tiers by up to 40%.
            </p>
          </div>
        </div>

        {/* Right: The Form */}
        <div className="lg:col-span-8 bg-surface-container relative rounded-xl p-8 lg:p-12 shadow-2xl">
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          
          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/20 border border-error text-error px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Job Title */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Job Title</label>
              <input 
                name="title"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body" 
                placeholder="e.g. Lead Sustainability Architect" 
                type="text"
              />
            </div>

            {/* Department & Employment Type & Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Category / Department</label>
                <select name="category" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Financial Strategy">Financial Strategy</option>
                  <option value="Urban Development">Urban Development</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Employment Type</label>
                <select name="employmentType" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contractor</option>
                  <option value="part-time">Part-time Advisory</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Job Type</label>
                <select name="job_type" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="project">Project-based</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Location Strategy</label>
                <select name="location" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="Riyadh">Riyadh — HQ & Core</option>
                  <option value="Jeddah">Jeddah — Regional</option>
                  <option value="NEOM">NEOM — The Line</option>
                  <option value="Remote">Remote — Borderless</option>
                </select>
            </div>

            {/* Budget & Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Budget Model</label>
                <select name="budget_type" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Min (USD)</label>
                <input 
                  name="budgetMin"
                  required
                  type="number"
                  placeholder="e.g. 120000"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body" 
                />
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Max (USD)</label>
                <input 
                  name="budgetMax"
                  required
                  type="number"
                  placeholder="e.g. 180000"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body" 
                />
              </div>
            </div>

            {/* Experience & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Experience Level</label>
                <select name="experience_level" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="entry">Entry (1-3 yrs)</option>
                  <option value="intermediate">Intermediate (4-7 yrs)</option>
                  <option value="expert">Expert (8+ yrs)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Estimated Duration</label>
                <select name="duration" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer">
                  <option value="less_than_1_week">Less than 1 week</option>
                  <option value="1_week_to_1_month">1 week to 1 month</option>
                  <option value="1_to_3_months">1 to 3 months</option>
                  <option value="3_to_6_months">3 to 6 months</option>
                  <option value="more_than_6_months">More than 6 months</option>
                </select>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Required Skills (Comma separated)</label>
              <input 
                name="skills"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body" 
                placeholder="e.g. React, Next.js, UI/UX, Design Systems" 
                type="text"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Role Description</label>
              <textarea 
                name="description"
                required
                rows={6}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body resize-y" 
                placeholder="Describe the elite opportunity in detail. Why should a top-tier candidate join this mission?" 
              />
            </div>

            {/* Actions */}
            <div className="pt-8 flex items-center justify-between border-t border-outline-variant/10">
              <button 
                type="button"
                onClick={() => router.push('/dashboard/employer')}
                className="text-stone-500 hover:text-on-surface font-medium text-sm transition-all flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">close</span>
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-gradient-to-br from-secondary/80 to-secondary text-on-primary-container px-10 py-4 rounded-md font-bold text-sm shadow-[0_10px_30px_rgba(234,179,250,0.3)] hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Publish to Talent Pool'}
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}