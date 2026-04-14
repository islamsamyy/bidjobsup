# Concerns & Risk Analysis

Identified technical debt, risks, and architectural concerns.

## Technical Debt

### Routing Fragmentation
- **Issue**: Historical redundant and fragmented routes (e.g., `bidjobs-` prefixed folders).
- **Status**: Consolidation effort is ongoing to move logic into a unified App Router structure.
- **Risk**: Potential for broken links and orphaned code during migration.

### Hydration Errors
- **Issue**: `PublicHeader.tsx` has historically suffered from hydration mismatches.
- **Root Cause**: Likely mismatch between server-rendered time/auth state and client-side initialization.
- **Impact**: Cumulative Layout Shift (CLS) and degraded User Experience.

## Project Structure

### Root Directory Bloat
- **Issue**: Excessive number of markdown documentation files in the project root.
- **Risk**: Obscures critical source files and complicates onboarding.
- **Action**: Should be moved to `/docs` or `.planning/history`.

## Localization

### Arabic Content Completeness
- **Issue**: Large-scale translation effort for Arabic (Vision 2030 focus).
- **Risk**: Missing translation keys or inconsistent RTL styling in complex components.

## Quality Assurance

### Lack of Automation
- **Issue**: Heavy reliance on manual checklists and manual verification.
- **Risk**: High probability of regression bugs during feature expansion or refactoring.
- **Recommendation**: Prioritize E2E testing for critical business flows.
