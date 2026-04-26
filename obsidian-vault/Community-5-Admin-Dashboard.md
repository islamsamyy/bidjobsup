# Community 5: Admin Dashboard & Moderation

**Cohesion**: 0.15 | **Nodes**: 17 | **Category**: Admin Tools

## Overview
Complete admin panel for platform moderation, user management, and analytics.

## Core Functions
- `adminAuth()` - Admin verification (GOD NODE)
- `flagJob()` - Mark job as problematic
- `getAdminMetrics()` - Dashboard analytics
- `getAllDisputes()` - List active disputes
- `getAllJobsForModeration()` - Jobs needing review
- `getAllReports()` - User/content reports
- `getAllUsers()` - User management
- `updateDisputeStatus()` - Resolve disputes

## Admin Sections

### 1. Dashboard
- **getAdminMetrics()** - Stats and KPIs
- Total users, jobs, contracts
- Revenue metrics
- Dispute trends
- Platform health

### 2. Job Moderation
- **getAllJobsForModeration()** - Flagged jobs
- **flagJob()** - Mark for review
- Preview job details
- Approve/reject/request changes
- Ban job poster if needed

### 3. User Management
- **getAllUsers()** - Browse users
- Suspend/ban users
- View user history
- Check compliance status

### 4. Dispute Management
- **getAllDisputes()** - Active disputes
- **updateDisputeStatus()** - Resolve
- View evidence
- Make rulings
- Release payments/refunds

### 5. Reports
- **getAllReports()** - Content reports
- Review reported content
- Take action
- Track reporter accuracy

## Access Control

```
User Requests Page
  ↓
adminAuth() [GOD NODE]
  ↓
Is Admin?
  ├─ Yes → Load data & render
  └─ No → Redirect to dashboard
```

## Related Pages
- `/dashboard/admin`
- `/dashboard/admin/jobs`
- `/dashboard/admin/users`
- `/dashboard/admin/disputes`
- `/dashboard/admin/reports`
- `/dashboard/admin/analytics`

## Key Metrics Tracked

### User Analytics
- Active users (daily, weekly, monthly)
- Signup trends
- Retention rates
- User by role (seeker, employer, both)

### Job Analytics
- Jobs posted vs completed
- Time-to-fill
- Category distribution
- Quality metrics

### Financial
- Total revenue
- Transaction volume
- Dispute rate
- Refund %

### Platform Health
- Error rates
- Response times
- Data integrity checks

## Permissions

### Admin Only
- View all disputes
- Modify contract status
- Ban users
- View all reports

### Moderator (subset)
- Review job flags
- Suggest actions
- Cannot make final decisions

## Related Systems
- Community 9 (Dispute Resolution) - Escalations
- Community 3 (Contracts) - Payment overrides
- Community 15 (Analytics) - Data visualization

## Implementation Notes
- All admin actions logged for audit
- Changes require admin verification
- Rate limited to prevent abuse
- Two-factor auth recommended for admins

---

*Power user feature. Strong access controls and audit logging essential.*
