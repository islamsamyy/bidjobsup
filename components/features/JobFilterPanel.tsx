'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface JobFilterPanelProps {
  onSearch: (filters: {
    budget_min?: number
    budget_max?: number
    job_type?: string
    experience_level?: string
    sort?: string
  }) => void
  defaultValues?: {
    budget_min?: number
    budget_max?: number
    job_type?: string
    experience_level?: string
    sort?: string
  }
}

export default function JobFilterPanel({ onSearch, defaultValues = {} }: JobFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [budgetMin, setBudgetMin] = useState(defaultValues.budget_min || 0)
  const [budgetMax, setBudgetMax] = useState(defaultValues.budget_max || 100000)
  const [jobType, setJobType] = useState(defaultValues.job_type || '')
  const [experienceLevel, setExperienceLevel] = useState(defaultValues.experience_level || '')
  const [sort, setSort] = useState(defaultValues.sort || 'newest')

  const handleApplyFilters = () => {
    const filters: any = {}
    if (budgetMin > 0) filters.budget_min = budgetMin
    if (budgetMax < 100000) filters.budget_max = budgetMax
    if (jobType) filters.job_type = jobType
    if (experienceLevel) filters.experience_level = experienceLevel
    if (sort) filters.sort = sort
    onSearch(filters)
  }

  const activeFilterCount = Object.entries(defaultValues).filter(([, v]) => v).length

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto flex items-center justify-between gap-3 px-6 py-3 bg-surface-container border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-all text-sm font-black uppercase tracking-widest text-on-surface"
      >
        <span>⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-8 space-y-6 shadow-xl">

          {/* Salary Range */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Budget Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mb-2">Min ($)</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none"
                  min="0"
                  max="100000"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mb-2">Max ($)</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none"
                  min="0"
                  max="100000"
                />
              </div>
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Job Type</h3>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="project">Project</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Experience Level</h3>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Sort By</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none"
            >
              <option value="newest">Newest</option>
              <option value="salary_low">Salary: Low to High</option>
              <option value="salary_high">Salary: High to Low</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyFilters}
            className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] transition-all"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}
