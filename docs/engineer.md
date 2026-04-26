You are a senior full-stack software architect and product engineer conducting a comprehensive technical and product review of BidJobs — a freelance and job bidding marketplace platform.

Project context:
- Platform type: Freelance / job bidding marketplace
- Target market: Egypt and Saudi Arabia (Arabic-speaking users, supports Saudi Vision 2030 positioning)
- Tech stack: React (frontend), shadcn/ui component library, TypeScript, Tailwind CSS, PostgreSQL (9-table schema), REST API
- Design system: Dark theme — deep navy backgrounds, purple/indigo primaries, glassmorphism effects
- Currency: EGP (Egyptian Pound) for Egypt variant
- Development phase: Pre-launch / handoff-ready

Please perform a full application review across ALL of the following dimensions:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] UI & DESIGN SYSTEM REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Evaluate consistency of the design system (colors, typography, spacing, component patterns)
- Check dark theme implementation — contrast ratios, readability, WCAG AA compliance
- Review glassmorphism usage — does it degrade on lower-end devices or cause visual noise?
- Audit the shadcn/ui component library integration — are components customized correctly?
- Identify any UI inconsistencies, broken layouts, or visual regressions
- Check RTL (right-to-left) readiness for Arabic language support
- Review responsive behavior across mobile, tablet, and desktop breakpoints
- Flag any hardcoded colors, font sizes, or spacing values that bypass the design token system

[2] CODE QUALITY & ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Review TypeScript usage — check for type safety violations, use of 'any', missing interfaces
- Audit React component structure — proper separation of concerns, reusability, prop drilling issues
- Check state management approach — local vs global, consistency across the app
- Review custom hooks — are they properly abstracted, memoized where needed?
- Identify dead code, unused imports, or commented-out blocks
- Evaluate error handling patterns — API errors, loading states, empty states
- Check for performance anti-patterns (unnecessary re-renders, missing keys in lists, large bundle imports)
- Verify environment variables are correctly abstracted and not hardcoded in the codebase
- Review code comments and documentation quality

[3] DATABASE & SCHEMA REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Audit all 9 tables in the PostgreSQL schema for:
  * Naming conventions (snake_case consistency)
  * Correct data types for all columns
  * Primary keys and foreign key relationships
  * Missing or redundant indexes
  * Nullable vs NOT NULL correctness
- Review relationships between: users, jobs, bids, contracts, payments, reviews, categories, notifications, profiles
- Identify any N+1 query risks from the API layer
- Check for missing cascade rules on foreign keys (what happens when a user or job is deleted?)
- Evaluate whether the schema supports the bidding workflow correctly (bid → accept → contract → payment → review)
- Flag any missing audit fields (created_at, updated_at, deleted_at for soft deletes)
- Check if currency and monetary fields use DECIMAL/NUMERIC (not FLOAT) to avoid rounding errors

[4] FEATURES & USER FLOWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Review the completeness and correctness of the following core user flows:

Freelancer flow:
- Registration & profile setup
- Browse and search jobs
- Submit a bid (amount, proposal, delivery time)
- Bid status tracking (pending / accepted / rejected)
- Contract management
- Payment receipt

Employer flow:
- Post a job (title, description, budget, category, deadline)
- Review incoming bids
- Accept a bid and initiate contract
- Milestone or full payment release
- Leave a review after project completion

Platform flows:
- Authentication (login, signup, password reset, email verification)
- Notification system (in-app + email triggers)
- Search and filter (jobs by category, budget, delivery time)
- Review and rating system (bidirectional: employer rates freelancer, freelancer rates employer)
- Admin panel (if implemented): user management, job moderation, dispute handling

Identify any flows that are incomplete, blocked, or missing critical validation steps.

[5] UX & ACCESSIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Evaluate overall user experience for both freelancers and employers
- Check form validation UX — are errors shown inline and clearly labeled?
- Review loading and skeleton states — does the app feel fast and responsive?
- Check empty states — what happens when there are no jobs, no bids, no notifications?
- Evaluate onboarding flow — is the first-time user experience intuitive?
- Audit keyboard navigation and focus management
- Check color contrast on dark backgrounds for interactive elements
- Review Arabic locale readiness: font rendering, text direction, number formatting (is EGP displayed correctly?)

[6] PERFORMANCE & SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Performance:
- Check for unnecessary API calls on page load
- Evaluate pagination implementation on job listings and bid lists
- Review image optimization (lazy loading, correct formats, compression)
- Check for large bundle sizes or unoptimized third-party libraries
- Evaluate caching strategy (API responses, static assets)

Security:
- Verify authorization checks: can a freelancer access another freelancer's bids? Can an employer modify another employer's jobs?
- Check for exposed sensitive data in API responses (passwords, tokens, internal IDs)
- Review input sanitization and validation on all form fields
- Verify CORS configuration is restrictive (not set to *)
- Check that payment-related endpoints are protected and logged

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT FORMAT:
Please structure your review as follows:

1. Executive Summary — 3–5 sentences on overall application health
2. Critical Issues (P0) — must fix before launch
3. High Priority Issues (P1) — fix in first sprint post-launch
4. Medium Priority Issues (P2) — fix within 30 days
5. Low Priority / Enhancements (P3) — nice to have improvements
6. Positive Findings — what is working well and should be preserved
7. Recommended Next Steps — top 5 actionable priorities in order

Use clear section headers. For each issue, include:
- Issue description
- Affected area (component / table / endpoint / flow)
- Recommended fix or approach
- Estimated effort (Low / Medium / High)