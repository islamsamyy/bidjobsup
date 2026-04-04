# Implementation Plan: Fixing Application and Data Access Inconsistencies

## Problem Statement
The current application/bidding logic is failing due to major architectural mismatches between the frontend code, server actions, and the underlying PostgreSQL schema in Supabase. Specifically:
- **Table Naming**: The code frequently references a `profiles` table which does not exist in the database (it is called `users`).
- **Identity Mismatch**: Server actions are attempting to use the Supabase Auth UUID (`session.user.id`) as a primary key in public tables, but the database uses a separate internal UUID for records, linking to Auth via an `auth_id` column.
- **Role Inconsistency**: The code checks for a `role` column while the database uses `user_type`.

## Proposed Solution
We will systematically refactor the backend actions and data-fetching logic to align with the source of truth (the Supabase DB schema).

---

## Technical Audit & Fixes

### 1. Data Access Refactoring
- **Global Change**: Replace all `.from('profiles')` calls with `.from('users')`.
- **Identity Linking**: Update filters from `.eq('id', session.user.id)` to `.eq('auth_id', session.user.id)` when referencing authenticated users.
- **Attribute Mapping**: Map `role` checks in code to `user_type` in the database.

### 2. Job Application (`submitBid`) Logic
- **Pre-flight Check**: Before submitting a bid, fetch the public `users.id` based on the `session.user.auth_id`.
- **Submission**: Insert the returned internal ID into `bids.seeker_id` (not the auth ID).
- **Validation**: Ensure only `user_type = 'jobseeker'` or `'both'` can initiate a bid.

### 3. Profile Updates
- Correct the `updateProfile` action to target the `users` table.
- Split data between `users` (identity) and `user_profiles` (skills/rates) if necessary.

---

## Action Plan

### Phase 1: Polish & Real-time (High Priority)
- [x] Update `lib/actions/bids.ts` to use `users` table and fix ID mapping.
- [x] Update `app/dashboard/page.tsx` redirect logic to use `user_type` and `auth_id`.
- [x] Audit and fix `dashboard/employer/page.tsx` and `dashboard/seeker/page.tsx`.
- [x] Hook up `createNotification` to `updateBidStatus` to alert seekers.
- [x] Hook up `createNotification` to `submitBid` to alert employers.
- [x] Finalize Message Stream: Hook up real-time event listener in `ChatStream.tsx` for production-grade instant messaging.
- [x] Added `inviteToJob` action and `InviteButton` for employer-led recruitment.
- [x] Verify `JobSearchClient.tsx` successfully transmits to updated `submitBid`.
- [x] Fix `ApplicantReviewClient.tsx` to handle correct relation names (ensuring `users` join works).
- [x] Added loading state and toast feedback replacing native `alert()` calls for a premium feel.

### Phase 3: Profile System Repair
- [x] Refactor `seeker/profile/actions.ts` to correctly target the `users` table.
- [x] Verify profile updates propagate to the dashboard.

## Verification Checklist
- [ ] Seeker can browse jobs and see "Missions Grid".
- [ ] Seeker can submit a proposal (bid) without SQL errors.
- [ ] Employer can see new candidates for their posted jobs.
- [ ] Employer can Accept/Reject a candidate and have it reflected in the DB.
