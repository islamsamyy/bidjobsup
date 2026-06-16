'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface JobFilterPanelProps {
  defaultValues?: {
    budget_min?: number
    budget_max?: number
    job_type?: string
    experience_level?: string
    sort?: string
  }
  totalCount?: number
  searchQuery?: string
}

const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'project': 'Project',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  'entry': 'Entry Level',
  'mid': 'Mid Level',
  'senior': 'Senior',
}

export default function JobFilterPanel({ defaultValues = {}, totalCount, searchQuery }: JobFilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)
  const [budgetMin, setBudgetMin] = useState(defaultValues.budget_min || 0)
  const [budgetMax, setBudgetMax] = useState(defaultValues.budget_max || 100000)
  const [jobType, setJobType] = useState(defaultValues.job_type || '')
  const [experienceLevel, setExperienceLevel] = useState(defaultValues.experience_level || '')
  const [sort, setSort] = useState(defaultValues.sort || 'newest')

  const applyFilters = (overrides?: Partial<typeof defaultValues & { sort: string }>) => {
    const merged = {
      budget_min: budgetMin,
      budget_max: budgetMax,
      job_type: jobType,
      experience_level: experienceLevel,
      sort,
      ...overrides,
    }
    const params = new URLSearchParams(searchParams.toString())
    if (merged.budget_min && merged.budget_min > 0) params.set('budget_min', String(merged.budget_min)); else params.delete('budget_min')
    if (merged.budget_max && merged.budget_max < 100000) params.set('budget_max', String(merged.budget_max)); else params.delete('budget_max')
    if (merged.job_type) params.set('job_type', merged.job_type); else params.delete('job_type')
    if (merged.experience_level) params.set('experience_level', merged.experience_level); else params.delete('experience_level')
    if (merged.sort && merged.sort !== 'newest') params.set('sort', merged.sort); else params.delete('sort')
    startTransition(() => { router.push(`/jobs/browse?${params.toString()}`) })
  }

  const handleApplyFilters = () => applyFilters()

  const handleClearAll = () => {
    setBudgetMin(0)
    setBudgetMax(100000)
    setJobType('')
    setExperienceLevel('')
    setSort('newest')
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('budget_min')
      params.delete('budget_max')
      params.delete('job_type')
      params.delete('experience_level')
      params.delete('sort')
      router.push(`/jobs/browse?${params.toString()}`)
    })
  }

  const removeFilter = (key: string) => {
    if (key === 'budget') { setBudgetMin(0); setBudgetMax(100000) }
    if (key === 'job_type') setJobType('')
    if (key === 'experience_level') setExperienceLevel('')
    if (key === 'sort') setSort('newest')
    applyFilters({ [key === 'budget' ? 'budget_min' : key]: undefined })
  }

  // Build active chip list from defaultValues (applied URL params)
  const activeChips: { key: string; label: string }[] = []
  if (defaultValues.budget_min && defaultValues.budget_min > 0) {
    activeChips.push({ key: 'budget', label: `Budget: $${defaultValues.budget_min}–${defaultValues.budget_max || '∞'}` })
  } else if (defaultValues.budget_max && defaultValues.budget_max < 100000) {
    activeChips.push({ key: 'budget', label: `Budget: up to $${defaultValues.budget_max}` })
  }
  if (defaultValues.job_type) activeChips.push({ key: 'job_type', label: JOB_TYPE_LABELS[defaultValues.job_type] || defaultValues.job_type })
  if (defaultValues.experience_level) activeChips.push({ key: 'experience_level', label: EXPERIENCE_LABELS[defaultValues.experience_level] || defaultValues.experience_level })
  if (defaultValues.sort && defaultValues.sort !== 'newest') activeChips.push({ key: 'sort', label: `Sort: ${defaultValues.sort.replace('_', ' ')}` })

  return (
    <div className="space-y-3">
      {/* Results summary + filter toggle row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-all text-sm font-black uppercase tracking-widest text-on-surface"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Filters {activeChips.length > 0 && (
            <span className="bg-primary text-on-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {activeChips.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Result count */}
        {totalCount !== undefined && (
          <p className="text-sm text-on-surface-variant">
            <span className="font-bold text-on-surface">{totalCount}</span> result{totalCount !== 1 ? 's' : ''}
            {searchQuery ? <> for <span className="text-primary font-semibold">"{searchQuery}"</span></> : ''}
          </p>
        )}

        {/* Active filter chips */}
        {activeChips.map(chip => (
          <button
            key={chip.key}
            onClick={() => removeFilter(chip.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            {chip.label}
            <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>close</span>
          </button>
        ))}

        {/* Clear all */}
        {activeChips.length > 1 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors underline decoration-outline-variant/40"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Budget Range */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Budget Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={budgetMin || ''}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:border-primary/50 transition-all outline-none"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={budgetMax === 100000 ? '' : budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value) || 100000)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:border-primary/50 transition-all outline-none"
                  min="0"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Job Type</h3>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:border-primary/50 transition-all outline-none"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Experience</h3>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:border-primary/50 transition-all outline-none"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:border-primary/50 transition-all outline-none"
              >
                <option value="newest">Newest</option>
                <option value="salary_low">Budget: Low to High</option>
                <option value="salary_high">Budget: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-outline-variant/10">
            <button
              onClick={handleApplyFilters}
              disabled={isPending}
              className="flex-1 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Applying...' : 'Apply Filters'}
            </button>
            {activeChips.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isPending}
                className="px-5 py-2.5 rounded-lg border border-outline-variant/20 text-on-surface-variant text-xs font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
