# Integrations

External services and APIs integrated into the BidJobs ecosystem.

## Primary Integrations

### Supabase (Auth & DB)
- **Role**: Backend-as-a-Service for authentication, PostgreSQL database, and potentially storage/functions.
- **Handling**: Integrated via `@/lib/supabase` using both client and server packages.

### Anthropic SDK
- **Role**: AI-powered features, specifically identified in `package.json`.
- **Use Case**: Likely powering the ATS Optimizer and Talent Finder suggestions.

### Stripe
- **Role**: Payment processing.
- **Implementation**: `stripe` package integrated, likely for subscription plans and talent hiring transactions.

### Resend
- **Role**: Transactional email service.
- **Implementation**: Used via the `resend` package for notifications and auth emails.

## Secondary Integrations

### Vercel Analytics
- **Role**: User tracking and performance metrics.
- **Integration**: Integrated via `@vercel/analytics`.

### Next-Intl
- **Role**: Internationalization and localization.
- **Scope**: Support for Arabic (`home-ar`) and dual-language UI in `PublicHeader.tsx`.

### Lucide React / Material Symbols
- **Role**: Iconography.
- **Implementation**: Combination of component-based Lucide icons and class-based Material Symbols.
