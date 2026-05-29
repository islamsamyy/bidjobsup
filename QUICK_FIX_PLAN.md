# Quick Fix Plan - BidJobs Remaining Issues

**Time Estimate:** 45 minutes total  
**Priority:** Medium (90% of app working, last 10% polish)

---

## Issue 1: Navigation Dropdown Stays Open (UI Overlay Problem)

**File:** `components/layout/PublicHeader.tsx`  
**Lines:** 126-215

**Current Problem:**
- Dropdown menu doesn't close when clicking outside
- Dropdown doesn't close when pressing Escape
- Can block user access to content below

**Solution:** Add click-outside + Escape key detection

```typescript
// Add after line 82 (after closeTimer ref):
const dropdownRef = useRef<HTMLDivElement | null>(null)

// Add new effect before return statement (after line 124):
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

// Wrap desktop nav in the ref:
<div className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
  {/* existing nav code */}
</div>
```

**Test:**
```bash
# 1. Open dropdown
# 2. Click outside → should close
# 3. Open again
# 4. Press Escape → should close
# 5. No console errors
```

**Time:** ~10 minutes

---

## Issue 2: Filter Synchronization with Backend

**Files:**
- `app/api/jobs/route.ts` — Add filter parameter handling
- `components/features/seeker/JobSearchClient.tsx` — Wire UI to API

**Current Problem:**
- Filters (Experience Level, Sort Order) are not connected to backend
- Frontend filtering only works client-side
- Empty results when filters applied

**Solution A: Enhance Backend (5 min)**

```typescript
// app/api/jobs/route.ts - Add query param handling
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  
  const experienceLevel = searchParams.get('experience_level')
  const sortBy = searchParams.get('sort') || 'recent'
  const search = searchParams.get('search')
  
  // Filter jobs array based on params...
}
```

**Solution B: Update Frontend (15 min)**

```typescript
// components/features/seeker/JobSearchClient.tsx - Add filter state
const [experienceLevel, setExperienceLevel] = useState('')
const [sortOrder, setSortOrder] = useState('recent')

// Add useEffect to fetch from backend when filters change
useEffect(() => {
  const params = new URLSearchParams()
  if (searchTerm) params.append('search', searchTerm)
  if (experienceLevel) params.append('experience_level', experienceLevel)
  params.append('sort', sortOrder)
  
  const res = await fetch(`/api/jobs?${params.toString()}`)
  const data = await res.json()
  setFilteredJobs(data.data || [])
}, [searchTerm, experienceLevel, sortOrder])

// Add select elements for filters
<select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
  <option value="">All Experience Levels</option>
  <option value="junior">Junior</option>
  <option value="intermediate">Intermediate</option>
  <option value="senior">Senior</option>
</select>
```

**Test:**
```bash
curl "http://localhost:3000/api/jobs?experience_level=junior&sort=salary-high"
# Should return filtered results

# Then in browser:
# 1. Load jobs page
# 2. Select experience level
# 3. Results should update
# 4. Select sort order
# 5. Results should re-sort
```

**Time:** ~20 minutes

---

## Issue 3: Input Validation Enhancements

**Files:** `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`

**Current Status:** ✅ Already working
- Blank credentials rejected ✅
- Email format validated ✅
- Password length checked ✅

**Nice-to-Have Additions (Optional):**
- Max length constraints (email: 255, password: 128)
- Special character handling in full_name
- Duplicate email detection (if using real DB)

**Time:** Already implemented, skip

---

## Priority Order

1. **FIRST** (10 min): Fix dropdown click-outside + Escape
   - This blocks user navigation when dropdown stays open
   - Quick fix, high impact
   
2. **SECOND** (20 min): Wire backend filter API
   - Improves job search UX
   - Sets foundation for advanced filtering

3. **THIRD** (Optional): Response consistency audit
   - All endpoints already return valid JSON
   - Can skip if time is short

---

## Verification Checklist

After applying fixes:

- [ ] Dropdown closes when clicking outside
- [ ] Dropdown closes when pressing Escape
- [ ] No console errors on dropdown interaction
- [ ] Job filters pass data to backend
- [ ] Backend returns filtered results (status 200)
- [ ] Frontend shows filtered jobs
- [ ] Empty state message appears when no results
- [ ] Reset filters button clears all selections
- [ ] All pages still load without errors

---

## Commands to Run

```bash
# Start dev server
npm run dev

# In another terminal, test dropdown (opens DevTools and checks console)
# Then test filters with curl
curl "http://localhost:3000/api/jobs?experience_level=junior"

# Run TestSprite after fixes
node testsprite_tests/backend_api_tests.js
```

---

## Notes

- **Dropdown issue:** Main blocker for UX when menu is open
- **Filter issue:** Affects job search but fallback to client-side search works
- **Validation:** Already solid, focused on UX issues now
- **Estimate:** 45 min total to complete all fixes and test

**Ready to implement? Start with Issue 1 (dropdown fix) — it's the quickest win.**
