# God Nodes - Core System Abstractions

These are the most connected nodes in the codebase. They form the backbone of the system.

## getAuthUser()
**Connections**: 55 edges | **Type**: Core Auth Function
**Location**: `lib/supabase/get-user.ts`

### What it does
Central authentication check - retrieves the current user from Supabase session.

### Connected Communities
- Community 0 (Jobs & Contacts)
- Community 1 (Auth System)
- Community 2 (User Interactions)
- Community 3 (Contracts & Escrow)
- Community 5 (Admin Dashboard)
- Community 8 (Interview Management)
- Community 9 (Dispute Resolution)
- Community 10 (AI Features)
- Community 12 (ATS History)
- Community 13 (Reviews)
- Community 15 (Analytics)

### Functions that call getAuthUser()
- `saveAnalysisToHistory()`
- `scheduleInterview()`
- `deleteJob()`
- `markNotificationAsRead()`
- All action-based operations requiring auth

### Why it's critical
**Betweenness Centrality**: 0.190 - Highest cross-community bridge
Every protected operation flows through this function.

---

## Error()
**Connections**: 34 edges | **Type**: Error Handler
**Location**: `app/dashboard/employer/post-job/error.tsx`

### What it does
Global error boundary component - catches and displays errors across the app.

### Connected Communities
- Community 0 (Jobs)
- Community 1 (Auth)
- Community 2 (User Interactions)
- Community 8 (Interviews)
- Community 9 (Disputes)
- Community 10 (AI)
- Community 12 (ATS)
- Community 13 (Reviews)

### Functions that call Error()
- `fetchReviews()`
- `handleLoadAISuggestions()`
- Various error pages

### Why it's critical
**Betweenness Centrality**: 0.080
Centralized error handling across all communities.

---

## createClient()
**Connections**: 23 edges | **Type**: Supabase Client Factory
**Location**: `lib/supabase/client.ts`

### What it does
Creates authenticated Supabase client instances for database operations.

### Connected Communities
- Community 1 (Auth System)
- Community 0 (Jobs)
- Community 2 (User Interactions)
- Community 3 (Contracts)

### Functions that use createClient()
- `login()`
- `signup()`
- All database operations

### Why it's critical
**Betweenness Centrality**: 0.099
Gateway to all database access.

---

## tryGetAuth()
**Connections**: 15 edges | **Type**: Fallback Auth Check
**Location**: `lib/supabase/try-get-auth.ts`

### What it does
Safe version of getAuthUser() - returns null instead of throwing on auth failure.

### Used by
- Job creation
- Message sending
- Optional auth contexts

---

## adminAuth()
**Connections**: 12 edges | **Type**: Admin Authorization
**Location**: (Admin community)

### What it does
Verifies admin privileges before allowing admin operations.

### Used by
- Admin Dashboard operations
- Moderation functions
- Reporting tools

---

## useLanguage()
**Connections**: 9 edges | **Type**: i18n Hook
**Location**: Community 6

### What it does
Provides current language context for translations.

### Used by
- All UI components needing translations
- Language switcher
- Localized content

---

## Summary

| Node | Edges | Betweenness | Role |
|------|-------|-------------|------|
| getAuthUser() | 55 | 0.190 | Auth gateway |
| Error() | 34 | 0.080 | Error handler |
| createClient() | 23 | 0.099 | DB gateway |
| tryGetAuth() | 15 | - | Fallback auth |
| adminAuth() | 12 | - | Admin gate |
| useLanguage() | 9 | - | i18n provider |

---

**Pro tip**: When refactoring, be careful with these nodes - they have high blast radius.
