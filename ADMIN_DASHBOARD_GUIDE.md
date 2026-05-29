# 🛡️ Admin Dashboard - Complete Guide

## How to Access Admin Dashboard

### Prerequisites
You need to have an account with **`role = 'admin'`** in the Supabase database.

### Access Steps
1. Sign in to the BidJobs platform at `http://localhost:3000/sign-in`
2. Navigate to `http://localhost:3000/admin`
3. The system will automatically check your role:
   - ✅ If `role = 'admin'` → You'll see the admin dashboard
   - ❌ If `role != 'admin'` → You'll be redirected to `/dashboard`

### Set Admin Role (Database)
To grant admin access, update the `users` table in Supabase:
```sql
UPDATE users 
SET role = 'admin' 
WHERE auth_id = '<your_auth_id>';
```

---

## Admin Dashboard Features

### 1. **Admin Home** (`/admin`)
**Overview & Metrics Dashboard**

Displays key platform statistics:
- 📊 **Total Users** - All registered users on the platform
- 💼 **Total Jobs** - All active job listings
- ⚠️ **Flagged Jobs** - Jobs marked for review/moderation
- 📋 **Open Reports** - User-submitted reports awaiting review
- ⚖️ **Active Disputes** - Active disputes between users
- 📑 **Total Reports** - All reports submitted (closed + open)

**Platform Health Metrics:**
- User Engagement Rate (%)
- Content Quality Score (%)
- Dispute Rate (%)

**Quick Actions (4 Main Modules):**
- Manage Reports
- Moderate Jobs
- Manage Users
- Review Disputes

---

### 2. **Reports Management** (`/admin/reports`)
**Review & Resolve User Reports**

**Features:**
- View all user-submitted reports
- Filter by status: Open, Resolved, Closed, All
- Report details include:
  - Reported item type (job, user, contract, etc.)
  - Report reason (Quality Issue, Non-Payment, Harassment, Spam, Illegal Content, etc.)
  - Reporter information with avatar
  - Detailed description
  - Submission date/time

**Actions:**
- ✅ Approve/Resolve reports
- ❌ Reject reports  
- 🔄 Change report status
- 📝 Add notes/comments
- 📧 Notify reporter

**Report Reasons:**
- Quality Issue
- Missed Deadline
- Non-Payment
- Scope Change
- Communication Problem
- Harassment
- Illegal Content
- Spam
- Other

---

### 3. **Job Moderation** (`/admin/jobs`)
**Approve/Reject Job Listings**

**Features:**
- View pending jobs awaiting moderation
- Filter by status: Pending, Approved, Rejected, Flagged, All
- Job details include:
  - Job title, description
  - Employer information
  - Creation date
  - Current moderation status

**Actions:**
- ✅ **Approve** - Job goes live on platform
- ❌ **Reject** - Job removed (reason sent to employer)
- 🚩 **Flag** - Mark for manual review/warning
- 👁️ **View Full Details** - See complete job posting
- 📧 Notify employer of decision

**Moderation Checklist (Implied):**
- Check for illegal content
- Verify job details are complete
- Check for spam/suspicious content
- Ensure appropriate language
- Verify payment terms reasonable
- No discrimination in job description

---

### 4. **User Management** (`/admin/users`)
**View & Manage User Accounts**

**Features:**
- Browse all platform users
- Filter by user type: Jobseekers, Employers, Both, All
- Filter by status: Active, Suspended, Inactive
- User details include:
  - Profile information
  - Avatar/Photo
  - User type (jobseeker, employer, both)
  - Account status
  - Join date
  - Activity metrics

**Actions:**
- 👁️ **View Profile** - See full user profile
- 🔒 **Suspend Account** - Temporarily disable account
- 🚫 **Ban User** - Permanently remove from platform
- ⚠️ **Issue Warning** - Warn user about TOS violation
- 📊 **View Activity** - See user's recent activity
- 💬 **Send Message** - Direct message to user
- ✏️ **Edit Profile** - Modify user information (if needed)

**User Status Options:**
- Active
- Suspended (temporary restriction)
- Banned (permanent removal)
- Inactive (no recent activity)

---

### 5. **Dispute Resolution** (`/admin/disputes`)
**Mediate Job Conflicts**

**Features:**
- View all disputes between users (employer vs jobseeker)
- Filter by status: Open, In Review, Resolved, Escalated, Closed
- Dispute details include:
  - Dispute initiator info
  - Other party info
  - Related job/contract
  - Dispute reason
  - Evidence/attachments
  - Discussion thread
  - Dispute timeline

**Actions:**
- 💬 **Add Messages** - Respond to dispute parties
- 📎 **Review Evidence** - Check submitted evidence
- ✅ **Resolve Dispute** - Mark as resolved with decision
- 🎯 **Make Decision** - Decide who is right (arbiter role)
- 💰 **Process Refund** - If payment refund is needed
- ⚖️ **Request More Info** - Ask for additional details
- 📧 Notify both parties of decision

**Dispute Reasons:**
- Quality/Deliverables not met
- Missed deadlines
- Payment issues
- Scope creep
- Communication breakdown
- Harassment/Abuse
- Fraud/Scam
- Other

---

## Admin Workflow Examples

### 📋 Typical Daily Tasks

**Morning Check (15 min):**
1. Go to `/admin` - Check metrics
2. Check "Open Reports" count
3. Check "Flagged Jobs" count
4. Review "Active Disputes" count
5. Address critical items first

**Processing Reports (30 min):**
1. Go to `/admin/reports`
2. Filter by "Open"
3. Review each report
4. Make decision (Approve/Reject)
5. Mark as Resolved

**Job Moderation (45 min):**
1. Go to `/admin/jobs`
2. Filter by "Pending"
3. Review job details
4. Check for policy violations
5. Approve ✅ or Reject ❌
6. Notify employer

**Dispute Resolution (30-60 min):**
1. Go to `/admin/disputes`
2. Filter by "Open" or "In Review"
3. Read dispute details & evidence
4. Add clarifying questions if needed
5. Make fair decision
6. Notify both parties with reasoning

---

## Platform Health Interpretation

### Green Zone ✅
- User Engagement: 70%+
- Content Quality: 80%+
- Dispute Rate: 5%- (low is good)

### Yellow Zone ⚠️
- User Engagement: 50-70%
- Content Quality: 60-80%
- Dispute Rate: 5-15%

### Red Zone 🔴
- User Engagement: <50%
- Content Quality: <60%
- Dispute Rate: >15%
→ May need intervention/investigation

---

## Security Notes

✅ **Only admins can access** - Role check on `/admin` route
✅ **All actions are logged** - For audit trail
✅ **Rate limiting** - On admin actions to prevent abuse
✅ **Two-factor authentication** - Recommended for admin accounts
⚠️ **Never delete user data** - Archive/suspend instead
⚠️ **Document decisions** - Always add notes for transparency

---

## Tips & Best Practices

1. **Daily Review** - Check admin home every morning
2. **Fast Decision-Making** - Respond to reports within 24 hours
3. **Fair & Consistent** - Document reasoning for all decisions
4. **Protect Users** - Err on the side of user safety
5. **Communicate** - Always notify users of admin decisions
6. **Escalate** - For complex cases, escalate to senior admin
7. **Monitor Trends** - Watch for patterns in reports
8. **Back Up Decisions** - Keep decision history for appeals

---

## Permission Matrix

| Action | Requirement | Impact |
|--------|-------------|--------|
| Approve Job | Job pending moderation | Job goes live |
| Reject Job | Job pending moderation | Employer notified |
| Flag Job | Any job | Job reviewed manually |
| Suspend User | Active user | Account disabled |
| Ban User | Any user | Permanent removal |
| Resolve Report | Open report | Closes report |
| Resolve Dispute | Open dispute | Binds both parties |
| Send Message | To any user | Notification sent |

---

## Keyboard Shortcuts (Coming Soon)
- `J` - Jump to Jobs
- `U` - Jump to Users
- `D` - Jump to Disputes
- `R` - Jump to Reports
- `ESC` - Back to Home

---

**Last Updated:** 2026-05-29
**Version:** 1.0 - Admin Dashboard Guide
