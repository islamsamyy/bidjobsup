# Community 3: Contracts & Escrow System

**Cohesion**: 0.09 | **Nodes**: 25 | **Category**: Payment & Contracts

## Overview
Manages contract lifecycle and escrow payment handling - critical for trust and payments.

## Core Functions
- `getContractDetails()` - Fetch contract info
- `getUserContracts()` - List user's contracts
- `isParticipant()` - Check access rights
- `releaseMilestonePayment()` - Release escrowed funds
- `updateContractStatus()` - Change contract state
- `updateMilestoneStatus()` - Update milestone progress
- `getAuthUser()` - Auth verification (GOD NODE)
- `getAuthUserAs()` - Auth with role info

## Contract Lifecycle

```
Job Offer Accepted
  ↓
Contract Created
  ↓
Payment Held in Escrow (Stripe)
  ↓
Work Progresses (Milestones)
  ↓
Milestone Complete
  ↓
Payment Released
  ↓
Contract Complete
```

## Key Data Model

### Contract States
- `pending` - Awaiting acceptance
- `active` - Work in progress
- `paused` - Temporarily suspended
- `completed` - Work finished, payment released
- `disputed` - Under dispute resolution
- `cancelled` - Terminated

### Milestone States
- `pending` - Not started
- `in_progress` - Work ongoing
- `submitted` - Awaiting review
- `completed` - Work accepted
- `payment_released` - Funds disbursed

## Connected to
- [[God Nodes#getAuthUser|getAuthUser()]] - Access control
- Community 9 (Dispute Resolution) - Conflict handling
- Community 8 (Interviews) - Initial agreement
- Stripe API - Payment processing

## Related Pages
- `/dashboard/contracts`
- `/dashboard/contracts/[id]`
- `/dashboard/contracts/[id]/payment`

## Payment Integration

### Stripe Integration
- Creates payment intent on contract creation
- Holds funds in escrow
- Releases on milestone completion
- Handles refunds/disputes

### Webhook Handlers
- `on_payment_succeeded` - Create escrow entry
- `on_payment_failed` - Notify parties
- `on_payment_released` - Update contract

## Critical Features
1. **Escrow Safety** - Funds protected until work verified
2. **Milestone Tracking** - Multiple payment triggers
3. **Dispute Integration** - Seamless escalation
4. **Audit Trail** - All transactions logged

## Security Notes
- Only participants can view contract details
- Payment release requires milestone completion
- Disputed contracts cannot release payment
- Admin override available for edge cases

---

*Heart of the platform's trust model. Careful with permissions and payment logic.*
