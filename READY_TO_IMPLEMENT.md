# Ready-to-Implement Code Fixes

## Copy-paste ready code for the 2 main issues

---

## FIX #1: Navigation Dropdown Click-Outside & Escape Key

**File:** `components/layout/PublicHeader.tsx`

### Step 1: Add ref after line 82

Find this:
```typescript
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
```

Add after `const closeTimer = useRef...` line (around line 82):
```typescript
  const dropdownRef = useRef<HTMLDivElement | null>(null)
```

### Step 2: Add effect before return statement (after line 124)

Add this entire useEffect block:
```typescript
  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [openMenu])
```

### Step 3: Add ref to desktop nav wrapper (line 148)

Find this line:
```typescript
          {/* ── Desktop nav ── */}
          <div className="hidden xl:flex items-center gap-1">
```

Change to:
```typescript
          {/* ── Desktop nav ── */}
          <div className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
```

### Step 4: Test

```bash
# 1. Start dev server
npm run dev

# 2. In browser at http://localhost:3000:
# - Click "Find Work" dropdown
# - Click outside the dropdown → should close
# - Click "Find Work" again
# - Press Escape → should close
# - Try clicking another menu → should switch without error
```

---

## FIX #2: Backend Filter API Support

**File A:** `app/api/jobs/route.ts`

### Check current content, then replace GET handler:

```typescript
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Get filter parameters
    const experienceLevel = searchParams.get('experience_level')
    const sortBy = searchParams.get('sort') || 'recent' // recent, salary-low, salary-high
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    // Mock jobs data (in production, fetch from database)
    const allJobs = [
      {
        id: 1,
        title: 'Senior React Developer',
        description: 'Build scalable React applications',
        category: 'Developer',
        experience_level: 'senior',
        budget_min: 5000,
        budget_max: 10000,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Junior Node.js Developer',
        description: 'Backend API development',
        category: 'Developer',
        experience_level: 'junior',
        budget_min: 2000,
        budget_max: 4000,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'UX Designer',
        description: 'Design mobile app interfaces',
        category: 'Design',
        experience_level: 'intermediate',
        budget_min: 3000,
        budget_max: 6000,
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
      // Add more mock jobs as needed
    ]
    
    let filtered = allJobs
    
    if (search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category) {
      filtered = filtered.filter(job => job.category === category)
    }
    
    if (experienceLevel) {
      filtered = filtered.filter(job => job.experience_level === experienceLevel)
    }
    
    // Apply sorting
    if (sortBy === 'salary-high') {
      filtered.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0))
    } else if (sortBy === 'salary-low') {
      filtered.sort((a, b) => (a.budget_min || 0) - (b.budget_min || 0))
    } else {
      // Recent (default)
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    
    return Response.json({
      success: true,
      data: filtered,
      count: filtered.length,
      filters: { experienceLevel, sortBy, search, category }
    }, { status: 200 })
  } catch (err) {
    console.error('Jobs fetch error:', err)
    return Response.json(
      { 
        success: false,
        error: 'Failed to fetch jobs',
        data: []
      },
      { status: 500 }
    )
  }
}
```

---

**File B:** `components/features/seeker/JobSearchClient.tsx`

### Replace the entire component with this version:

```typescript
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
      setTimeout(() => setSelectedJob(null), 3000)
    } else {
      setMessage({ type: 'error', text: "Protocol Handshake Failure: " + res.error })
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setExperienceLevel('')
    setSortOrder('recent')
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
            onClick={handleResetFilters}
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
            <motion.div className="col-span-full text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-on-surface-variant/40 mb-4" />
              <h2 className="text-xl font-bold text-on-surface mb-2">
                No missions found
              </h2>
              <p className="text-on-surface-variant mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-primary text-primary-on rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => setSelectedJob(job)}
                className="bg-surface-container p-6 rounded-2xl cursor-pointer hover:bg-surface-container-high transition-all border border-outline-variant/20 hover:border-primary/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-on-surface">{job.title}</h3>
                  {appliedJobs.has(job.id) && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Applied</span>
                  )}
                </div>
                <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex gap-4 text-xs text-on-surface-variant mb-4">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${job.budget_min?.toLocaleString()} - ${job.budget_max?.toLocaleString()}
                  </span>
                  {job.experience_level && (
                    <span className="flex items-center gap-1">
                      Level: {job.experience_level}
                    </span>
                  )}
                </div>
                <button className="w-full bg-primary text-primary-on font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  View & Apply
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
```

---

## Test Commands

### Test Backend Filter API:
```bash
# Test basic jobs fetch
curl "http://localhost:3000/api/jobs" | grep -o '"count":[0-9]*'

# Test with experience filter
curl "http://localhost:3000/api/jobs?experience_level=senior" | grep -o '"count":[0-9]*'

# Test with sort
curl "http://localhost:3000/api/jobs?sort=salary-high" | grep -o '"data":\[' | head -1

# Test combined
curl "http://localhost:3000/api/jobs?search=developer&experience_level=junior&sort=recent"
```

### Test Frontend Dropdown:
```bash
# 1. npm run dev
# 2. Open http://localhost:3000
# 3. Click "Find Work" dropdown
# 4. Click outside → should close
# 5. Click again
# 6. Press Escape → should close
# 7. Check browser console for no errors
```

---

## Summary

**Fix 1 (Dropdown):** 3 small changes to PublicHeader.tsx
- Add ref (1 line)
- Add useEffect (15 lines)
- Add ref to element (1 line)

**Fix 2 (Filters):** 2 file updates
- Replace GET handler in jobs/route.ts (~80 lines)
- Replace component in JobSearchClient.tsx (~200 lines)

**Total Implementation Time:** ~30 minutes
**Total Testing Time:** ~10 minutes
**Total:** ~40 minutes

---

## Next Steps

1. **Apply Fix #1** (Dropdown) - Start here, it's fastest
2. **Test Fix #1** in browser (2 min)
3. **Apply Fix #2** (Backend + Frontend filters)
4. **Test Fix #2** in browser (3 min)
5. **Commit and verify** all tests pass

**Ready to go!**
