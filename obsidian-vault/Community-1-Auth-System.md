# Community 1: Authentication System

**Cohesion**: 0.06 | **Nodes**: 20 | **Category**: Core System

## Overview
Complete authentication and session management - one of the foundational systems.

## Core Functions
- `forgotPassword()` - Password reset flow
- `login()` - User login
- `logout()` - User logout
- `resetPassword()` - Complete password reset
- `signup()` - User registration
- `runMigrations()` - Database setup
- `PublicLayout()` - Auth layout component
- `NotFound()` - 404 handling

## Key Operations

### Login Flow
```
login(email, password)
  → createClient() [GOD NODE]
  → Supabase Auth
  → Session stored
  → Redirect to dashboard
```

### Registration Flow
```
signup(email, password, profile)
  → createClient() [GOD NODE]
  → Create user
  → Create profile
  → Send welcome email
  → Redirect
```

### Password Reset
```
forgotPassword(email)
  → Send reset link
resetPassword(token, newPassword)
  → Validate token
  → Update password
```

## Connected to
- [[God Nodes#createClient|createClient()]] - All auth client creation
- Community 0 (Job creation after auth)
- Community 2 (User interactions after login)
- Community 3 (Contract access after auth)

## Security Considerations
- All passwords handled securely via Supabase Auth
- Sessions stored in secure cookies
- Password reset tokens are time-limited
- Email verification recommended

## Related Pages
- `/auth/login`
- `/auth/signup`
- `/auth/forgot-password`
- `/auth/reset-password`

---

*Entry point for all user sessions. Critical for system security.*
