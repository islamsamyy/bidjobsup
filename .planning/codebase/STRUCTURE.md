# Project Structure

Logical and physical organization of the codebase.

## Directory Mapping

### `/app` (Routes & Pages)
- **`(auth)`**: Sign-in, sign-up, and password recovery.
- **`(public)`**: Public-facing landing pages (Home, About, Pricing, etc.).
- **`admin`**: Administrative dashboard for platform management.
- **`dashboard`**: Main user experience for registered talent and hirers.
- **`api`**: Endpoint logic for internal and external requests.
- **`actions`**: Centralized Next.js Server Actions.
- **`community`**: Social and engagement features.

### `/components` (UI Elements)
- **`layout`**: Global components like `PublicHeader`, `PublicFooter`, and `Toast`.
- **`features`**: Domain-specific UI components (e.g., `LanguageSwitcher`, `NotificationBell`).
- **`jobs`**: Components specifically for job listings and search.

### `/lib` (Core Logic)
- **`supabase`**: Database and auth initialization.
- **`actions`**: Higher-level logic used across the server.
- **`validations`**: Shared Zod schemas for consistency.

### `/supabase` (Backend Config)
- **`migrations`**: SQL scripts defining the incremental database schema evolution.

### `/public` (Static Assets)
- Images, logos, and fonts served directly to the browser.

## Routing Groups Analysis
- **(public)** Layout: Shared header/footer for all non-authenticated pages.
- **(auth)** Layout: Minimalist design focused on conversion.
- **Dashboard/Admin**: Specialized layouts with navigation drawers and notification systems.
