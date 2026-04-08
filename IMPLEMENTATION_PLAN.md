# BidJobs Next.js UI Integration Implementation Plan

## Overview
This document outlines the step-by-step strategy for converting the 35 raw Google Stitch HTML static screens into production-ready, fully functional Next.js React components. The result will align the application with the platform's high-end "Neon Nocturne" design aesthetic and securely wire up data to the unified Supabase `users` schema.

---

## Phase 1: Preparation & Design System Foundation
**Goal:** Consolidate the "Glass & Gradient" design tokens so all new components use shared Tailwind configuration.
1. **Analyze Design System Tokens:** 
   - Extract primary visual motifs from the raw HTML files (e.g., custom gradients, blur backdrops, typographic settings).
   - Update `tailwind.config.ts` (or `app/globals.css`) with standard values bridging the Next.js environment with Stitch parameters.
2. **Setup Global UI Components:**
   - Create resusable Atomic components in `components/ui/` natively (Buttons, Input Fields, Glass Cards, Badges).
   - Replace standard HTML components with robust React functional components mapping directly to the "No-Line" rule.

---

## Phase 2: Core User & Authentication Routes
**Goal:** Translate the public-facing and identity pages to ensure users can enter the ecosystem seamlessly.
1. **Sign-In & Onboarding (`bidjobs-sign-in`, `bidjobs-create-profile`)**
   - Translate the static HTML into interactive forms using React Hook Form and Zod.
   - Refactor out `dangerouslySetInnerHTML` block.
   - Integrate with Supabase Auth (`getUser()`) and the unified `users` table.
2. **Public Homepage & Landing (`bidjobs-homepage-v2-html`)**
   - Separate the Hero, Feature, and Testimonial sections into `components/sections/`.
   - Map routing definitions in Next.js to direct traffic correctly.

---

## Phase 3: Employer & Seeker Dashboard Workflows
**Goal:** Migrate the core dashboards with Server-Side Rendering (SSR) data loading.
1. **Employer Dashboard (`bidjobs-employer-dashboard-overview`)**
   - Implement the layout shell (`components/layout/EmployerSidebar.tsx`).
   - Wire backend logic to fetch active listings and candidate counts from Supabase.
   - Inject the extracted designs from Stitch.
2. **Seeker Dashboard (`bidjobs-seeker-dashboard-overview`)**
   - Build out the applicant view (saved roles, current application status).
   - Sync metrics dynamically via server actions.

---

## Phase 4: Job Directory & Enhanced Search
**Goal:** Reconstruct the heavy-lifting marketplace features (Listing and Discovery).
1. **Job Listing pages (`bidjobs-browse-jobs`, `bidjobs-job-list`, `bidjobs-job-details`)**
   - Modularize the `JobCard` component for high-fidelity rendering.
   - Implement dynamic routing (e.g., `/jobs/[id]`) rendering details pulled directly from the Supabase `public.contracts` / `public.jobs` tables.
   - Connect dynamic filtering logic mapped to the design system's dropdowns and sliders.

---

## Phase 5: Payment & Milestone Infrastructure
**Goal:** Build out the missing `public.payments` backend to match the Stripe integration designed in Stitch.
1. **Pricing and Billing (`bidjobs-pricing-plans`, `bidjobs-employer-billing-plans`)**
   - Replicate the Stripe intent models natively within Next.js API Routes (`app/api/checkout/route.ts`).
   - Create and connect webhooks to automatically adjust employer credits or track escrow milestones.

---

## Phase 6: QA, Localization & Refinement
**Goal:** Fix layout shifts, ensure responsivity, and run RTL localization checks.
1. **Component Scrubbing:**
   - Eliminate all remaining `dangerouslySetInnerHTML` functions across the 35 generated pages.
   - Tidy up stray CSS classes and transition states (e.g., hover effects matching the high-end design specifications).
2. **RTL Arabic Check (`bidjobs-homepage-arabic`)**
   - Implement RTL structural logic (`dir="rtl"`) correctly via Next.js localization routing (`[lang]`).

---
**Next Step Recommendation:** Let's execute Phase 1 and 2, beginning with upgrading the `bidjobs-sign-in` page to a fully working server-action powered form.
