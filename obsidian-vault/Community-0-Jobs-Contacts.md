# Community 0: Jobs & Contacts System

**Cohesion**: 0.05 | **Nodes**: 20 | **Category**: Job Management

## Overview
Handles job creation, posting, and initial contact flows.

## Core Functions
- `createJob()` - Create a new job listing
- `getResend()` - Email service integration
- `sendContactEmail()` - Send contact emails
- `updateProfile()` - Update user profile
- `handleFileChange()` - File upload handler
- `handleSend()` - Message sending
- `submitContactForm()` - Contact form processing
- `handleRequestConsultation()` - Consultation requests

## Data Flow
```
User Action
  ↓
submitForm() / handleSend()
  ↓
createJob() / sendContactEmail()
  ↓
getAuthUser() [GOD NODE]
  ↓
createClient() [GOD NODE]
  ↓
Supabase
```

## Connected to
- [[God Nodes#getAuthUser|getAuthUser()]] - All protected operations
- [[God Nodes#createClient|createClient()]] - Database operations
- Community 1 (Auth checks)
- Community 2 (User interactions)

## Key Features
1. Job creation and listing
2. Contact form handling
3. Email notifications
4. File uploads
5. Profile updates

## Related Pages
- Job posting dashboard
- Contact/support pages
- Profile management

---

*Low cohesion (0.05) suggests these might be better organized or need more internal connections.*
