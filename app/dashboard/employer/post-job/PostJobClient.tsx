'use client'

import { useState } from 'react'
import { createJob } from './actions'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'

export default function PostJobClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      await createJob(formData)
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return
      }
      console.error('Post job error:', err)
      setError(err.message || t('messages.error.somethingWrong'))
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
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-primary font-bold shadow-[0_0_20px_rgba(234,179,250,0.4)]">
              1
            </div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-secondary">
              {t('dashboardPages.employerPostJob.role')}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant font-bold">
              2
            </div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-500">
              {t('dashboardPages.employerPostJob.details')}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant font-bold">
              3
            </div>
            <span className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-500">
              {t('dashboardPages.employerPostJob.requirements')}
            </span>
          </div>
        </div>
      </div>

      <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Instructional Text */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h1 className="font-headline italic text-4xl lg:text-5xl leading-tight text-on-background text-right">
            {t('dashboardPages.employerPostJob.defineVision')}{' '}
            <span className="text-secondary">{t('dashboardPages.employerPostJob.vision')}</span>
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed text-sm text-right">
            {t('dashboardPages.employerPostJob.beginJourney')}
          </p>
          <div className="mt-8 p-6 rounded-xl bg-surface-container-low border-l-2 border-secondary/40">
            <span className="material-symbols-outlined text-secondary mb-3">lightbulb</span>
            <p className="text-[12px] font-body text-stone-400 italic">
              {t('dashboardPages.employerPostJob.includeTip')}
            </p>
          </div>
        </div>

        {/* Right: The Form */}
        <div className="lg:col-span-8 bg-surface-container relative rounded-xl p-8 lg:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>

          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/20 border border-error text-error px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Job Title */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                {t('dashboardPages.employerPostJob.jobTitle')}
              </label>
              <input
                name="title"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body"
                placeholder={t('dashboardPages.employerPostJob.jobTitlePlaceholder')}
                type="text"
              />
            </div>

            {/* Department & Employment Type & Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.category')}
                </label>
                <select
                  name="category"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Financial Strategy">Financial Strategy</option>
                  <option value="Urban Development">Urban Development</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.employmentType')}
                </label>
                <select
                  name="employmentType"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="full-time">{t('dashboardPages.employerPostJob.fullTime')}</option>
                  <option value="contract">{t('dashboardPages.employerPostJob.contractor')}</option>
                  <option value="part-time">{t('dashboardPages.employerPostJob.partTime')}</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.jobType')}
                </label>
                <select
                  name="job_type"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="full-time">{t('dashboardPages.employerPostJob.fullTime')}</option>
                  <option value="part-time">{t('dashboardPages.employerPostJob.partTime')}</option>
                  <option value="contract">{t('dashboardPages.employerPostJob.contract')}</option>
                  <option value="project">{t('dashboardPages.employerPostJob.projectBased')}</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                {t('dashboardPages.employerPostJob.location')}
              </label>
              <select
                name="location"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
              >
                <option value="Riyadh">Riyadh — HQ & Core</option>
                <option value="Jeddah">Jeddah — Regional</option>
                <option value="NEOM">NEOM — The Line</option>
                <option value="Remote">Remote — Borderless</option>
              </select>
            </div>

            {/* Budget & Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.budgetModel')}
                </label>
                <select
                  name="budget_type"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="fixed">{t('dashboardPages.employerPostJob.fixedPrice')}</option>
                  <option value="hourly">{t('dashboardPages.employerPostJob.hourlyRate')}</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.min')}
                </label>
                <input
                  name="budgetMin"
                  required
                  type="number"
                  placeholder="e.g. 120000"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body"
                />
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.max')}
                </label>
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
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.experienceLevel')}
                </label>
                <select
                  name="experience_level"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="entry">{t('dashboardPages.employerPostJob.entry')}</option>
                  <option value="intermediate">{t('dashboardPages.employerPostJob.intermediate')}</option>
                  <option value="expert">{t('dashboardPages.employerPostJob.expert')}</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                  {t('dashboardPages.employerPostJob.estimatedDuration')}
                </label>
                <select
                  name="duration"
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body appearance-none cursor-pointer"
                >
                  <option value="less_than_1_week">{t('dashboardPages.employerPostJob.lessThan1Week')}</option>
                  <option value="1_week_to_1_month">{t('dashboardPages.employerPostJob.week1Month')}</option>
                  <option value="1_to_3_months">{t('dashboardPages.employerPostJob.month1To3')}</option>
                  <option value="3_to_6_months">{t('dashboardPages.employerPostJob.month3To6')}</option>
                  <option value="more_than_6_months">{t('dashboardPages.employerPostJob.monthMoreThan6')}</option>
                </select>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                {t('dashboardPages.employerPostJob.requiredSkills')}
              </label>
              <input
                name="skills"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body"
                placeholder={t('dashboardPages.employerPostJob.skillsPlaceholder')}
                type="text"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">
                {t('dashboardPages.employerPostJob.roleDescription')}
              </label>
              <textarea
                name="description"
                required
                rows={6}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body resize-y"
                placeholder={t('dashboardPages.employerPostJob.descriptionPlaceholder')}
              />
            </div>

            {/* Actions */}
            <div className="pt-8 flex items-center justify-between border-t border-outline-variant/10">
              <button
                type="button"
                onClick={() => router.push('/dashboard/employer')}
                className="text-stone-500 hover:text-on-surface font-medium text-sm transition-all flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                  close
                </span>
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-br from-secondary/80 to-secondary text-on-primary-container px-10 py-4 rounded-md font-bold text-sm shadow-[0_10px_30px_rgba(234,179,250,0.3)] hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('dashboardPages.employerPostJob.processing') : t('dashboardPages.employerPostJob.publishButton')}
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
