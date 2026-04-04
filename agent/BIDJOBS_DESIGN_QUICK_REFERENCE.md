# BidJobs Design Prompt - Quick Reference Guide

## 📋 Summary

This is a comprehensive design system prompt for Antigravity to create the complete BidJobs UI/UX. The platform is a modern job marketplace connecting employers with freelancers.

---

## 🎨 Design System Essentials

### Colors
- **Primary:** Indigo (`#6366F1`) - Trust, CTAs
- **Secondary:** Emerald Green (`#10B981`) - Success, earnings
- **Accent:** Amber (`#F59E0B`) - Featured, important
- **Neutral:** White/Gray palette for backgrounds and text

### Typography
- **Font:** Inter (sans-serif)
- **Scale:** H1 (48px) → Body (16px) → Caption (12px)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- 12-column grid
- Desktop max-width: 1200px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40...

### Components
- Buttons (Primary, Secondary, Outline, Ghost, Danger)
- Inputs, Cards, Badges, Avatars, Rating Stars
- Navigation (Top bar, Sidebar)
- Modals, Dropdowns, Tabs

---

## 📱 Pages to Design (7 Main Sections)

### 1. **Authentication** (3 pages)
   - Sign In
   - Sign Up
   - Forgot/Reset Password

### 2. **Job Browsing** (3 pages)
   - Browse Jobs (grid with filters)
   - Job Details (full view with employer info)
   - Create Job (form with live preview)
   - Job Search (advanced filters)

### 3. **Bidding System** (2 pages)
   - Place Bid (modal/page)
   - Manage Bids (list view with status)

### 4. **User Profiles** (3 pages)
   - My Profile (editable, 4 tabs)
   - Browse Talent (seeker cards grid)
   - Seeker Profile View (read-only)

### 5. **Messaging** (2 pages)
   - Messages List (conversations sidebar + chat)
   - Chat Conversation (thread with input)

### 6. **Community** (2 pages)
   - Community Feed (social media style)
   - Create Post (form with preview)
   - Post Details (full view with comments)

### 7. **Dashboard** (2 variants)
   - Employer Dashboard (stats, recent activity, charts)
   - Jobseeker Dashboard (earnings, bids, recommendations)

**Total: 22+ pages to design**

---

## 🎬 Interactive Elements

### Animations
- Button hover: Scale 1.02, shadow increase (200ms)
- Card hover: Shadow increase (300ms)
- Input focus: Border color change to indigo (200ms)
- Toast: Slide-in from top/bottom (300ms)
- Modal: Fade + scale entrance (300ms)
- Skeleton: Pulse animation (2s loop)

### States
- Hover, Focus, Active, Disabled
- Loading (spinners, skeletons)
- Error (red border, message)
- Success (green checkmark)
- Empty (illustration + CTA)

---

## 📱 Responsive Breakpoints

- **Mobile:** 320-640px (hamburger menu, bottom tab bar)
- **Tablet:** 640-1024px (2-column layouts)
- **Desktop:** 1024px+ (full layouts)
- **Large Desktop:** 1440px+

### Key Changes
- Single-column on mobile
- Sidebar to hamburger icon
- 44px+ touch targets
- Full-screen modals on mobile

---

## 🌓 Dark Mode

- Background: `#0F172A`
- Surface: `#1E293B`
- Text: `#F1F5F9`
- Darker accents, reduced shadows
- CSS variables / Tailwind dark: class

---

## 📊 Design Deliverables Structure

### Figma File Organization:
```
BidJobs Design System
├── Design System (colors, typography, components)
├── Pages (all 22+ pages organized by section)
├── Interactions (hover, focus, loading, error states)
├── Responsive Variants (mobile, tablet, desktop)
└── Dark Mode (all pages in dark theme)
```

---

## ✨ Key Design Notes

### Imagery
- Avatars: Initials on gradient if no image
- Icons: Lucide React (24px default)
- Illustrations: Minimalist, modern
- Empty States: Friendly with clear CTAs

### Form Validation
- Real-time validation (email, password strength)
- Error messages below inputs (red, 14px)
- Success checkmarks
- Helpful hints under labels

### Accessibility
- Min 44px touch targets
- Color contrast ratios (WCAG AA)
- Semantic HTML structure
- Focus indicators visible

### Performance
- Lazy load images
- Use skeletons for loading states
- Optimize animations (60fps)

---

## 🔄 Handoff to Development

**Developer-friendly deliverables:**
1. ✅ Figma components with variants
2. ✅ Color tokens exported (CSS variables)
3. ✅ Typography scale documented
4. ✅ Spacing system defined
5. ✅ Icon library linked (Lucide React)
6. ✅ Animation specs noted
7. ✅ Responsive grid documented
8. ✅ Component interaction flows

---

## 🎯 Implementation Phases

**Phase 1 (Week 1):** Design system, auth pages, foundation components  
**Phase 2 (Week 2):** Job browsing, job details, search  
**Phase 3 (Week 3):** Bidding, profiles, talent browse  
**Phase 4 (Week 4):** Messaging, community, dashboard  
**Phase 5 (Week 5):** Dark mode, responsive variants, polish  

---

## 📞 Questions for Antigravity

Before starting design:

1. **Figma or other tool?** (Recommend Figma for component library)
2. **Include animations in prototypes?** (Yes recommended)
3. **Need component code exports?** (Yes, for shadcn/ui)
4. **Timeline preference?** (Iterative delivery vs all at once?)
5. **Any reference designs to reference?** (Upwork, Fiverr, Dribbble?)
6. **RTL support needed?** (For Arabic users?)

---

## 📦 Included Files

✅ **BIDJOBS_PROJECT_DOCUMENTATION.md**
   - Complete tech stack
   - Database schema
   - API routes
   - File structure

✅ **BIDJOBS_DESIGN_PROMPT.md**
   - This comprehensive design system
   - All page specifications
   - Component designs
   - Interaction details

---

## 🚀 Next Steps

1. ✅ Share prompt with Antigravity
2. ⏳ Antigravity creates Figma file with design system
3. ⏳ Antigravity designs all pages using system
4. ⏳ Export components & design tokens
5. ⏳ Developers build using shadcn/ui + Supabase
6. ⏳ QA and refinements
7. ⏳ Launch!

---

**Design Prompt Version:** 1.0  
**Last Updated:** March 31, 2026  
**Status:** Ready for Designer

---

## 💡 Pro Tips for Antigravity

- **Reuse components:** Build design system first, then pages
- **Variants are key:** Document all component states
- **Mobile-first:** Design mobile, then adapt up
- **Keep it flexible:** Use spacing tokens, not fixed values
- **Iterate fast:** Use components for quick updates
- **Test accessibility:** Check contrast, focus indicators
- **Export clean:** Name layers properly for developer handoff

---

**Good luck! 🎨**
