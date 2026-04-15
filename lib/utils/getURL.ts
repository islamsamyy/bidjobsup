/**
 * Get the absolute URL for the application.
 * Handles environment-specific redirect URLs for auth, OAuth, and external services.
 *
 * Priority:
 * 1. Request origin header (production/preview environments)
 * 2. NEXT_PUBLIC_SITE_URL environment variable
 * 3. Fallback to http://localhost:3000 for local development
 *
 * @param pathname - Optional pathname to append to the base URL
 * @param origin - Optional origin override (used in API routes where request headers are available)
 * @returns Absolute URL string
 */
export function getURL(pathname = '', origin?: string): string {
  const baseUrl =
    origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Ensure pathname starts with / if provided
  const path = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : ''

  return `${baseUrl}${path}`
}
