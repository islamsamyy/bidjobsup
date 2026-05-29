# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BidJobs is a Next.js 16 full-stack platform for job matching and freelance bidding. It features:
- **Employer dashboard**: post jobs, manage bids, review candidates, process payments via Stripe
- **Jobseeker dashboard**: browse jobs, bid on projects, manage contracts, track interviews
- **Admin dashboard**: moderation, dispute resolution, analytics
- **Real-time features**: messaging, notifications, live profile feed
- **Internationalization**: full i18n support for English (LTR) and Arabic (RTL) with language switching

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint with ESLint
npm lint
```

## Project Structure & Architecture

### Core Layers

**Authentication & User Management** (`lib/supabase/`, `lib/auth-utils.ts`, `app/(auth)/`)
- Supabase SSR for server-side auth with cookie management
- `getAuthUser()` (god node, 55 edges) — primary auth utility; returns discriminated union with typed user profile
- `getAuthUserAs(role)` — enforces role-based access (employer/jobseeker)
- Middleware at `lib/supabase/middleware.ts` protects `/dashboard` routes and refreshes auth sessions
- User profile stored in `users` table with `user_type` (employer, jobseeker, both) and `role` (user, admin)

**Database Client** (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Server-side client uses Supabase SSR for cookie handling (critical for session persistence)
- Browser client for public queries; server client for authenticated operations

**Server Actions** (`lib/actions/`)
- Centralized business logic: `jobs.ts`, `contracts.ts`, `bids.ts`, `messages.ts`, `reviews.ts`, `disputes.ts`, `interviews.ts`, `posts.ts`, `analytics.ts`, etc.
- All actions validate auth via `getAuthUser()` before executing; return `{ ok, error }` on failure
- Heavy use of Supabase RLS (Row-Level Security) policies—most queries delegate authorization to the database

**API Routes** (`app/api/`)
- Stripe webhooks (`stripe/webhook/`), auth endpoints, file uploads
- Most business logic in server actions, not API routes (prefer edge function patterns)

**Components & UI** (`components/features/`, `components/ui/`)
- shadcn/ui for base components (Button, Input, Label, Card, Dialog, etc.)
- Feature components wrap business logic (ReviewForm, InviteToJobModal, etc.)
- Heavy use of React Hook Form + Zod for forms and validation
- Framer Motion for animations

**Internationalization** (`i18n.config.ts`, `app/providers/LanguageProvider.tsx`, `messages/`)
- next-intl for i18n routing (`/en/*`, `/ar/*`)
- Supports LTR (English) and RTL (Arabic) with automatic theme switching
- Language state in context; language switcher wired to all pages

### Community Clusters (from graphify)

The codebase has 126 detected communities; key ones:

- **Community 0** (20 nodes) — Contact & job creation (`createJob`, `sendContactEmail`, `updateProfile`)
- **Community 1** (20 nodes) — Auth flows (`login`, `logout`, `signup`, `resetPassword`)
- **Community 2** (28 nodes) — User settings, messages, notifications (`changeEmail`, `sendMessage`, `updateNotificationPrefs`)
- **Community 3** (25 nodes) — **Contracts & escrow** (`getContractDetails`, `getUserContracts`, `releaseMilestonePayment`, `getAuthUser`)
- **Community 4** (17 nodes) — UI utilities & formatting (`formatDate`, `getStatusColor`, `handleLike`, `handleComment`)
- **Community 5** (19 nodes) — **Admin** (`flagJob`, `getAdminMetrics`, `getAllDisputes`, `updateDisputeStatus`)
- **Community 6** (10 nodes) — **Theming & i18n** (`useLanguage`, `useTheme`, `ThemeSwitcher`, `TranslatedText`)
- **Community 7** (9 nodes) — **ATS/CV analysis** (`analyzeCV`, `extractTextFromPDF`, `extractKeywords`, `buildRecommendations`)
- **Community 8** (13 nodes) — **Interview scheduling** (`scheduleInterview`, `getInterviewDetails`, `updateInterview`)
- **Community 9** (10 nodes) — **Dispute resolution** (`createDispute`, `addDisputeMessage`, `addDisputeEvidence`, `updateDisputeStatus`)

### God Nodes (Most Connected)

These functions are critical hubs—changes ripple widely:

1. **`getAuthUser()`** (55 edges) — Fetches session + user profile; used in nearly every server action
2. **`Error()`** (34 edges) — Error component used throughout (be careful with error boundaries)
3. **`createClient()`** (23 edges) — Supabase client factory; called by most server-side code
4. **`tryGetAuth()`** (15 edges) — Lenient auth check (returns null on auth error, not an exception)
5. **`adminAuth()`** (12 edges) — Admin-only guard for moderation pages
6. **`useLanguage()`** (9 edges) — i18n hook for client components; scope of changes is UI-wide

## Key Patterns & Conventions

### Server Actions & Error Handling

All server actions follow this pattern:

```typescript
'use server'
import { getAuthUser } from '@/lib/supabase/get-user'

export async function updateJob(id: number, data: UpdateJobInput) {
  const auth = await getAuthUser()
  if (!auth.ok) return { error: auth.error }
  const { user, supabase } = auth

  const { error } = await supabase
    .from('jobs')
    .update(data)
    .eq('id', id)
    .eq('employer_id', user.id) // RLS enforces this too

  if (error) return { error: error.message }
  revalidatePath('/dashboard/employer')
  return { ok: true }
}
```

**Key practices:**
- Always call `getAuthUser()` first and check `!auth.ok` before proceeding
- Return `{ error: string }` or `{ ok: true, data?: T }` — never throw
- Use `revalidatePath()` after mutations to refresh cached pages
- Rely on Supabase RLS policies for row-level authorization (don't manually check ownership)

### Routing & Layouts

- **(public)** group (`app/(public)/`) — Public pages (landing, pricing, auth, job browse)
- **Dashboard** groups (`app/dashboard/employer/`, `app/dashboard/seeker/`) — Protected routes with different layouts
- Language prefix (`/en/...`, `/ar/...`) managed by next-intl middleware
- Error boundaries at layout level; each route group can have its own `error.tsx`

### Type Safety

- `tsconfig.json` uses strict mode; paths alias `@/*` to root
- Supabase types generated via `supabase gen types --local` (check docs if schema changes)
- Zod schemas in `lib/validations/` for form validation
- Discriminated unions for error handling (see `AuthResult` type in `get-user.ts`)

### Styling

- Tailwind CSS v4 with PostCSS v4; utilities in `tailwind.config.ts`
- shadcn/ui components pre-installed; add new ones with `npx shadcn-ui@latest add <component>`
- Dark mode via class strategy (`.dark` applied to `<html>`); RTL via `dir` attribute
- No custom CSS files in components; use Tailwind utility classes + `cn()` for dynamic classes

### Image Handling

- Next.js Image component with remote patterns configured (Supabase storage, GitHub avatars, Google profile pics)
- Supabase storage uses pattern: `https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}`

## Internationalization (i18n) Details

- **Locales:** English (en, LTR) and Arabic (ar, RTL) defined in `i18n.config.ts`
- **Next-intl routing:** Pages live in language-prefixed folders (`app/[locale]/...`)
- **Language context:** `LanguageProvider` wraps `<html>` and provides `useLanguage()` hook
- **Theme sync:** Dark/light mode syncs with language direction; RTL layout applied automatically
- **Translation keys:** Stored in `messages/` folder per locale; keys are nested objects (`common.button.submit`)
- **Key points:**
  - Always wrap UI text in `<TranslatedText>` or use `useTranslate()` hook
  - When adding pages, create both `en/` and `ar/` versions or use dynamic routing with `generateStaticParams()`
  - Metadata and SEO tags should be translated; use `useTranslate()` in layout `generateMetadata()`

## Database Schema Notes

Key tables (inferred from code):

- **users** — User profiles; `auth_id` (Supabase Auth ID), `user_type` (enum), `role` (user/admin)
- **jobs** — Job listings; `employer_id` (foreign key to users)
- **bids** — Bid submissions; `job_id`, `seeker_id` (applicant), `status`
- **contracts** — Active work; `job_id`, `employer_id`, `seeker_id`, `status`, `escrow_balance`
- **milestones** — Contract payment milestones; `contract_id`, `amount`, `status`
- **messages** — Direct messages; `sender_id`, `recipient_id`, `conversation_id`
- **posts** — Profile feed posts; `user_id`, `content`, etc.
- **interviews** — Scheduled interviews; `contract_id`, `scheduled_at`
- **disputes** — Dispute records; `contract_id`, `initiator_id`, `status`
- **reviews** — Post-job reviews; `contract_id`, `reviewer_id`, `rating`

All tables have RLS policies; Supabase Auth user ID is accessible via `auth.uid()` in policies.

## Graphify RAG System & Obsidian Vault

This project has a graphify knowledge graph at `graphify-out/` that serves as a retrieval-augmented generation (RAG) system for codebase data.

### Graphify Files
- `graphify-out/GRAPH_REPORT.md` - god nodes, communities, and architecture overview
- `graphify-out/wiki/index.md` - navigable wiki for codebase knowledge (if available)
- `graphify-out/cost.json` - metadata about graph construction and coverage

**When to use graphify:**
- Architecture questions: read `GRAPH_REPORT.md` for god nodes and community structure
- Codebase navigation: use for understanding how modules connect
- Component relationships: identify dependencies and communication patterns
- System design: reference for data flow and responsibilities

### Obsidian Vault (Recommended)
An interactive knowledge base has been created at `obsidian-vault/` for easier exploration:

**Key Documents:**
- `README.md` - Quick navigation hub
- `VAULT-GUIDE.md` - How to use the vault
- `God-Nodes.md` - The 6 most critical functions (55-9 edges each)
- `Communities-Index.md` - All 126 communities organized by strength
- `Analysis/System-Architecture.md` - Deep architecture analysis
- `Community-[0-5]-*.md` - Core feature documentation

**How to use:**
1. Open vault in Obsidian: `File → Open vault folder → e:\bidjob\obsidian-vault`
2. Start with `README.md` for quick orientation
3. Use Graph View (Ctrl+G) to visualize connections
4. Use Quick Switcher (Ctrl+O) to jump between documents
5. Check `VAULT-GUIDE.md` for detailed navigation tips

**Maintenance:**
- After modifying code files, run `graphify update .` to refresh `graphify-out/GRAPH_REPORT.md`
- Update vault documents manually with new insights
- Add tags to important notes for quick filtering
- The vault is a living document - keep it current

**Vault Structure:**
```
obsidian-vault/
├── README.md (start here)
├── VAULT-GUIDE.md (detailed how-to)
├── God-Nodes.md (critical functions)
├── Communities-Index.md (all 126 communities)
├── Community-[0-5]-*.md (main features)
├── Analysis/System-Architecture.md (deep dive)
├── Templates/ (for new documentation)
└── .obsidian/ (configuration)
```

## Important Notes

- **Next.js breaking changes**: Version 16.2.1 has changes from older versions. Check `node_modules/next/dist/docs/` if you encounter unexpected behavior.
- **Middleware timing**: The Supabase middleware comment in `lib/supabase/middleware.ts` is critical—do not add unrelated logic between `createServerClient()` and `getUser()` or you will cause mysterious logout bugs.
- **React 19 & React Compiler**: Compiler enabled in `next.config.ts`; be aware of its optimizations (memoization, hook inlining).
