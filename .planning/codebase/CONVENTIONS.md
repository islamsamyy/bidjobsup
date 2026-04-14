# Conventions

Coding standards, styling patterns, and development guidelines.

## Code Standards
- **Component Model**: Functional components with TypeScript interfaces for props.
- **Client Components**: Explicitly marked with `"use client"` when using hooks or browser APIs.
- **Server Components**: Default for pages and data-fetching components.
- **File Naming**: PascalCase for components, kebab-case for directories and routes.

## Styling (Design System)
- **Primary Palette**: Vibrant purples (`#caa2f7`), deep blacks (`#100d10`), and sophisticated grays (`#292428`).
- **Aesthetic**: Futuristic glassmorphism (backdrop-blur, subtle borders, high-contrast typography).
- **Typography**: Heavily uppercase, tracked-out headings (`tracking-[0.18em]`) with black font weights.
- **Spacing**: Consistent padding (`px-5 md:px-10 xl:px-14 py-3.5`).

## Internationalization (i18n)
- **Handling**: Usage of `next-intl` patterns with translation keys (`t("key")`).
- **Support**: Right-to-Left (RTL) support for Arabic via the `dir` property derived from the language provider.

## Utility Usage
- **Supabase**: Direct use of `createClient()` from the library rather than custom wrappers.
- **Icons**: Preferred usage of `material-symbols-outlined` with specific CSS variation settings.
