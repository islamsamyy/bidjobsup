'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Briefcase, Filter, ArrowRight, DollarSign, Clock, MapPin, Send } from 'lucide-react'
import { submitBid } from '@/lib/actions/bids'
import { useLanguage } from '@/app/providers/LanguageProvider'

export default function JobSearchClient({ initialJobs }: { initialJobs: any[] }) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [experienceLevel, setExperienceLevel] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [isLoadingFilters, setIsLoadingFilters] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState(initialJobs)

  // Apply logic state
  const [proposal, setProposal] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [deliveryDays, setDeliveryDays] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set())

  // Fetch filtered jobs from backend
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      setIsLoadingFilters(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (experienceLevel) params.append('experience_level', experienceLevel)
        params.append('sort', sortOrder)

        const res = await fetch(`/api/jobs?${params.toString()}`)
        const data = await res.json()

        if (data.success && Array.isArray(data.data)) {
          setFilteredJobs(data.data)
        } else {
          setFilteredJobs([])
        }
      } catch (err) {
        console.error('Failed to fetch filtered jobs:', err)
        setFilteredJobs([])
      } finally {
        setIsLoadingFilters(false)
      }
    }

    // Debounce search (only call after 500ms of inactivity)
    const timeout = setTimeout(fetchFilteredJobs, 500)
    return () => clearTimeout(timeout)
  }, [searchTerm, experienceLevel, sortOrder])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return
    setIsSubmitting(true)
    setMessage(null)
    
    const res = await submitBid(selectedJob.id, amount, proposal, deliveryDays)
    setIsSubmitting(false)
    if (res.success) {
      setMessage({ type: 'success', text: "Mission Proposition Dispatched. Await Handshake Protocol." })
      setAppliedJobs(prev => new Set([...prev, selectedJob.id]))
      // Clear proposal but keep context for a bit
      setTimeout(() => setSelectedJob(null), 3000)
    } else {
      setMessage({ type: 'error', text: "Protocol Handshake Failure: " + res.error })
    }
  }

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-on-background mb-4 glow-text-subtle">
          {t('dashboardPages.search.title')} <span className="text-primary">Missions.</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl font-body text-sm md:text-base leading-relaxed">
          {t('dashboardPages.search.subtitle')}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex gap-4 relative z-10 flex-col lg:flex-row"
      >
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-stone-500 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={t('dashboardPages.search.discoverMissions')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high/50 border border-outline-variant/20 text-on-surface rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-body backdrop-blur-xl"
          />
        </div>
        <button className="bg-surface-container-high border border-outline-variant/30 text-on-surface px-8 rounded-2xl flex items-center gap-2 hover:bg-surface-container-highest transition-colors uppercase font-black text-xs tracking-widest shadow-lg">
          <Filter className="w-4 h-4" /> {t('dashboardPages.search.filters')}
        </button>
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex gap-4 flex-wrap z-10 items-center"
      >
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="bg-surface-container-high/50 border border-outline-variant/20 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm"
        >
          <option value="">All Experience Levels</option>
          <option value="junior">Junior</option>
          <option value="intermediate">Intermediate</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-surface-container-high/50 border border-outline-variant/20 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="salary-high">Highest Salary</option>
          <option value="salary-low">Lowest Salary</option>
        </select>

        {isLoadingFilters && (
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Loading...
          </div>
        )}

        {(searchTerm || experienceLevel || sortOrder !== 'recent') && (
          <button
            onClick={() => {
              setSearchTerm('')
              setExperienceLevel('')
              setSortOrder('recent')
            }}
            className="text-xs text-primary hover:text-primary/80 transition-colors font-bold uppercase tracking-widest"
          >
            Reset Filters
          </button>
        )}
      </motion.div>

      {/* Grid of Results */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <AnimatePresence>
          {filteredJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 border border-outline-variant/20 shadow-2xl">
                <Briefcase className="w-10 h-10 text-stone-600" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface italic">{t('dashboardPages.search.noMissionsFound')}</h3>
              <p className="text-on-surface-variant text-sm mt-2">
                {searchTerm ? 'Try adjusting your search parameters or clear the search to see all available missions.' : 'No missions available at this time.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative bg-surface-container/60 backdrop-blur-md rounded-3xl p-8 border border-outline-variant/10 overflow-hidden cursor-pointer shadow-xl hover:shadow-primary/5"
                onClick={() => setSelectedJob(job)}
              >
                {/* Background glow on hover */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                
                <div className="relative z-10 flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                      {job.category || 'General'}
                    </span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-outline-variant/10">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-headline font-black italic text-on-background group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-sm font-body text-on-surface-variant mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-4 pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-stone-400" />
                      </div>
                      <span className="text-sm font-bold text-on-surface tracking-tight">
                        ${job.budget_min} - ${job.budget_max}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow icon appearing on hover */}
                <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/25">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Slide-over Application Panel */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-surface-container-low border-l border-outline-variant/20 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="p-10 border-b border-outline-variant/10">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-stone-400 hover:text-on-surface transition-colors mb-8 hover:bg-surface-container-high"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">
                  {selectedJob.category || 'Mission Detail'}
                </span>
                <h2 className="text-4xl md:text-5xl font-headline font-black italic text-on-background leading-tight mb-6">
                  {selectedJob.title}
                </h2>
                <div className="flex gap-6 mb-8 flex-wrap">
                  <span className="flex items-center gap-2 text-sm font-bold text-on-surface">
                    <DollarSign className="w-4 h-4 text-stone-400" />
                    Budget: ${selectedJob.budget_min} - ${selectedJob.budget_max}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-on-surface">
                    <Clock className="w-4 h-4 text-stone-400" />
                    Posted: {new Date(selectedJob.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="prose prose-invert prose-p:text-on-surface-variant max-w-none">
                  <p>{selectedJob.description}</p>
                </div>
              </div>

              {/* Apply Form */}
              <div className="p-10 bg-surface-container-lowest flex-1 mt-auto">
                <h3 className="text-xl font-headline font-black text-on-background mb-6 uppercase tracking-widest flex items-center gap-3">
                  <Send className="w-5 h-5 text-primary" />
                  Initiate Engagement
                </h3>

                {appliedJobs.has(selectedJob.id) && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8 p-6 rounded-2xl border bg-amber-500/10 border-amber-500/20 text-amber-600 flex items-center gap-4"
                  >
                    <span className="material-symbols-outlined">info</span>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      You have already applied to this mission
                    </p>
                  </motion.div>
                )}

                {message && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-8 p-6 rounded-2xl border flex items-center gap-4 ${
                      message.type === 'success'
                        ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(202,162,247,0.1)]'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                  >
                    <span className="material-symbols-outlined">{message.type === 'success' ? 'verified_user' : 'report'}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      {message.text}
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleApply} className="space-y-6" style={{ opacity: appliedJobs.has(selectedJob.id) ? 0.5 : 1, pointerEvents: appliedJobs.has(selectedJob.id) ? 'none' : 'auto' }}>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-stone-400">Bid Amount ($)</label>
                    <input 
                      required
                      type="number"
                      min={selectedJob.budget_min || 0}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-surface-container rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/50 border border-outline-variant/10 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-stone-400">Proposal Protocol</label>
                    <textarea 
                      required
                      rows={5}
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      placeholder="Detail your approach and technical alignment..."
                      className="w-full bg-surface-container rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/50 border border-outline-variant/10 resize-none font-body text-sm"
                    ></textarea>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-on-primary py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'Transmitting Data...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
