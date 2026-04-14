# Architecture

Architectural patterns and design decisions of the BidJobs platform.

## Framework Philosophy
- **Next.js App Router**: Modern file-based routing with support for Server Components and Client Components.
- **Route Groups**: Organized using `(auth)` and `(public)` groups to isolate layouts and middleware logic.
- **Server-First Design**: Heavy use of React Server Components (RSCs) for performance, with Server Actions for data mutations.

## Data Flow
1. **Frontend**: React 19 components with `react-hook-form` and `zod` for robust client-side validation.
2. **API layer**: Combination of Next.js Route Handlers (`app/api`) and Server Actions (`app/actions`).
3. **Database Interaction**: Centralized Supabase client in `lib/supabase` for consistent connectivity.

## State Management
- **Server State**: Managed via Next.js cache and Supabase queries.
- **Client State**: Local React hooks (`useState`, `useReducer`) used sparingly for UI state.
- **Context API**: Used for global concerns like Localization (`LanguageProvider`).

## Security Patterns
- **Supabase SSR Auth**: Secure session management with server-side cookies.
- **Zod Schema Validation**: Strict validation for all form inputs and API requests.
- **Role-Based Routing**: Implicit separation of `admin`, `dashboard`, and `public` routes.
