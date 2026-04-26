# System Architecture - Graphify Analysis

**Generated**: 2026-04-26  
**Source**: graphify-out/GRAPH_REPORT.md  
**Data Points**: 524 nodes, 596 edges, 126 communities

## Architecture Overview

### The Three Core Pillars

```
┌─────────────────────────────────────────────┐
│          BidJob Platform Core                │
├─────────────────────────────────────────────┤
│                                              │
│  Authentication Layer                        │
│  └─ getAuthUser() [55 edges]                │
│  └─ createClient() [23 edges]               │
│  └─ tryGetAuth() [15 edges]                 │
│                                              │
│  Error Handling Layer                        │
│  └─ Error() [34 edges]                      │
│  └─ Error boundaries on key pages           │
│                                              │
│  Business Logic Layer                        │
│  └─ 126 communities (524 nodes total)       │
│  └─ 10 major features                       │
│                                              │
└─────────────────────────────────────────────┘
```

### Communication Patterns

**67% Extracted** (explicit code relationships)  
**33% Inferred** (AI-reasoned connections)

High inferred ratio on god nodes suggests they're system-wide, touching many components.

## Feature Communities (Meaningful Clusters)

### Tier 1: Critical Systems
1. **Community 1 - Auth** (Cohesion: 0.06, Nodes: 20)
   - Entry point for all users
   - Session management
   - Password reset flows

2. **Community 3 - Contracts & Escrow** (Cohesion: 0.09, Nodes: 25)
   - Payment lifecycle
   - Milestone tracking
   - Dispute integration

3. **Community 5 - Admin Dashboard** (Cohesion: 0.15, Nodes: 17)
   - Moderation
   - User management
   - Platform health

### Tier 2: Core Features
4. **Community 0 - Jobs & Contacts** (Cohesion: 0.05, Nodes: 20)
5. **Community 2 - User Interactions** (Cohesion: 0.09, Nodes: 28)
6. **Community 8 - Interviews** (Cohesion: 0.18, Nodes: 13)
7. **Community 9 - Disputes** (Cohesion: 0.22, Nodes: 10)

### Tier 3: Enhancement Features
8. **Community 7 - ATS Optimizer** (Cohesion: 0.14, Nodes: 9)
9. **Community 10 - AI Features** (Cohesion: 0.18, Nodes: 8)
10. **Community 13 - Reviews** (Cohesion: 0.22, Nodes: 5)

### Tier 4: UX & Infrastructure
11. **Community 6 - i18n** (Cohesion: 0.15, Nodes: 10)
12. **Community 4 - UI Components** (Cohesion: 0.11, Nodes: 17)
13. **Community 15 - Analytics** (Cohesion: 0.73, Nodes: 5)

## God Node Centrality Analysis

### getAuthUser() - System Backbone (55 edges)

**Betweenness**: 0.190 (highest cross-community bridge)

Connects:
```
getAuthUser()
├─ Community 0 (Jobs)
├─ Community 1 (Auth)
├─ Community 2 (User Interactions)
├─ Community 3 (Contracts)
├─ Community 5 (Admin)
├─ Community 8 (Interviews)
├─ Community 9 (Disputes)
├─ Community 10 (AI)
├─ Community 12 (Analysis)
├─ Community 13 (Reviews)
└─ Community 15 (Analytics)
```

**Implication**: Removing or significantly changing this function would break the entire system. This is the authentication gateway.

### createClient() - Data Access Gateway (23 edges)

**Betweenness**: 0.099

Used by:
- All database operations
- Auth flows (Community 1)
- Contract operations (Community 3)
- Job management (Community 0, 11)

**Implication**: All data access flows through this client factory.

### Error() - Error Boundary (34 edges)

**Betweenness**: 0.080

Catches errors from:
- Community 0 (Jobs)
- Community 1 (Auth)
- Community 2 (Interactions)
- Community 8 (Interviews)
- Community 9 (Disputes)
- Community 10 (AI)
- Community 12 (Analysis)
- Community 13 (Reviews)

**Implication**: Global error handling mechanism. Ensure it never breaks.

## Data Flow Architecture

### User Registration → Contract → Payment → Completion

```
1. Auth (Community 1)
   signup() → createClient() → Supabase Auth
   
2. Job Discovery (Community 0)
   getAuthUser() → getUserContracts()
   
3. Interview (Community 8)
   scheduleInterview() → getAuthUser()
   
4. Contract (Community 3)
   createContract() → releaseMilestonePayment()
   
5. Dispute (Community 9)
   createDispute() → updateDisputeStatus()
   
6. Admin Review (Community 5)
   adminAuth() → getAllDisputes()
   
7. Analytics (Community 15)
   getEmployerAnalytics() → getAdminMetrics()
```

## Code Organization Issues (From Thin Communities)

### Issue: Too Many Single-Node Communities
- **111 thin communities** (out of 126)
- Indicates many isolated components
- Suggests opportunity for consolidation

### Issue: Low Cohesion in Core Communities
- Community 0 (Jobs): 0.05 - Functions loosely connected
- Community 1 (Auth): 0.06 - Could be better organized
- Community 3 (Contracts): 0.09 - Complex system, needs clearer structure

### Recommendation: Refactor Strategy
1. **Consolidate** thin communities into meaningful features
2. **Strengthen** cohesion in core communities by extracting shared patterns
3. **Document** hidden connections in low-cohesion communities

## Inferred vs Extracted Edges

### High Confidence Connections (Extracted)
- getAuthUser() calls in protected operations
- Error() in error.tsx files
- createClient() in auth flows

### Inferred Edges (Confidence: ~0.8)
- fetchReviews() calls Error()
- saveAnalysisToHistory() calls getAuthUser()
- scheduleInterview() calls getAuthUser()
- deleteJob() calls getAuthUser()
- markNotificationAsRead() calls getAuthUser()

**Action**: These inferred edges should be verified when refactoring related code.

## System Dependencies

### External Services
- **Supabase**: Auth, Database, Real-time (via createClient)
- **Stripe**: Payments (Community 3 - Contracts)
- **Resend**: Email (Community 0 - Jobs)
- **Claude API**: AI Analysis (Community 10)

### Key Vulnerabilities
1. **Single point of failure: getAuthUser()**
   - Mitigation: Ensure high test coverage, gradual rollouts
   
2. **Complex payment logic: Community 3**
   - Mitigation: Thorough testing, clear audit logs
   
3. **Admin access: Community 5**
   - Mitigation: Two-factor auth, activity logging

## Metrics Summary

| Metric | Value |
|--------|-------|
| Total Nodes | 524 |
| Total Edges | 596 |
| Communities | 126 |
| Extraction Rate | 67% |
| Inference Rate | 33% |
| Avg Cohesion | 0.30 |
| Max Cohesion | 0.73 (Community 15 - Analytics) |
| Min Cohesion | 0.05 (Community 0 - Jobs) |

## Recommendations

1. **Improve God Node Documentation**
   - They are the most critical code paths
   - Document preconditions and side effects clearly

2. **Increase Test Coverage for God Nodes**
   - Focus on getAuthUser(), createClient(), Error()
   - These have highest blast radius

3. **Consolidate Thin Communities**
   - 111 communities with <2 nodes each
   - Better code organization opportunity

4. **Strengthen Core Community Cohesion**
   - Extract shared patterns
   - Create clear interfaces between communities

5. **Monitor Inferred Edges**
   - 199 inferred edges need verification
   - Use as refactoring checklist

---

**Next Steps**:
- Run `graphify update .` after major refactoring
- Review this analysis quarterly
- Use god node architecture for design decisions
