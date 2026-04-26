# Communities Index

Complete mapping of all 126 communities from the graphify analysis. Listed by cohesion (strength).

## Highest Cohesion Communities (Most Connected)

### Community 15 - Analytics
**Cohesion**: 0.73 | **Nodes**: 5
- `buildDateMap()`, `countByStatus()`, `getEmployerAnalytics()`, `getSeekerAnalytics()`, `toCategoryChart()`
- [[Community-15-Analytics|Full Details]]

### Community 21 - PDF Utilities
**Cohesion**: 0.5 | **Nodes**: 3
- `download()`, `run()`, `sanitizeName()`

### Community 22 - Session Management
**Cohesion**: 0.5 | **Nodes**: 2
- `updateSession()`, `proxy()`

### Community 23 - File Utilities
**Cohesion**: 0.67 | **Nodes**: 2
- `copyDir()`, `mkdirp()`

### Community 25 - Date Utilities
**Cohesion**: 0.67 | **Nodes**: 1
- `timeAgo()`

## Core Feature Communities

### Community 0 - Jobs & Contacts
**Cohesion**: 0.05 | **Nodes**: 20
[[Community-0-Jobs-Contacts|View Details]]

### Community 1 - Authentication System
**Cohesion**: 0.06 | **Nodes**: 20
[[Community-1-Auth-System|View Details]]

### Community 2 - User Interactions
**Cohesion**: 0.09 | **Nodes**: 28
- Messaging, notifications, privacy, profile updates

### Community 3 - Contracts & Escrow
**Cohesion**: 0.09 | **Nodes**: 25
[[Community-3-Contracts-Escrow|View Details]]

### Community 4 - UI Components
**Cohesion**: 0.11 | **Nodes**: 17
- Date formatting, status colors, icons, comments, likes, posts

### Community 5 - Admin Dashboard
**Cohesion**: 0.15 | **Nodes**: 17
[[Community-5-Admin-Dashboard|View Details]]

### Community 6 - Internationalization (i18n)
**Cohesion**: 0.15 | **Nodes**: 10
- `useLanguage()`, `PageHeader()`, `useTheme()`, `ThemeSwitcher()`, translation components

### Community 7 - ATS Optimizer
**Cohesion**: 0.14 | **Nodes**: 9
- `analyzeCV()`, `analyzeFormatting()`, `buildRecommendations()`, `extractKeywords()`, `generateUpdatedCV()`

### Community 8 - Interview Management
**Cohesion**: 0.18 | **Nodes**: 13
- `scheduleInterview()`, `rescheduleInterview()`, `getInterviewDetails()`, `updateInterview()`, interview notes

### Community 9 - Dispute Resolution
**Cohesion**: 0.22 | **Nodes**: 10
- `createDispute()`, `addDisputeMessage()`, `addDisputeEvidence()`, `updateDisputeStatus()`, dispute workflows

### Community 10 - AI Features
**Cohesion**: 0.18 | **Nodes**: 8
- `callClaude()`, `suggestMissingKeywords()`, `generateRecommendationSummary()`, `generateUpdatedCVPDF()`, AI analysis

### Community 11 - Job Management Actions
**Cohesion**: 0.2 | **Nodes**: 7
- `createJob()`, `editJob()`, `deleteJob()`, `closeJob()`, `inviteToJob()`, `handleInvite()`

### Community 12 - Analysis History
**Cohesion**: 0.36 | **Nodes**: 7
- `saveAnalysisToHistory()`, `getUserAnalysisHistory()`, `getAnalysisTrends()`, `deleteAnalysisRecord()`, trending analysis

### Community 13 - Reviews
**Cohesion**: 0.22 | **Nodes**: 5
- `createReview()`, `fetchReviews()`, `deleteReview()`, review form handling

## Thin Communities (Weak Connections)

Communities 14-125 are thin (0-2 nodes) or single-page/component clusters. They include:
- Individual page files (page.tsx, layout.tsx, error.tsx)
- UI components (Badge, Button, Input, Label, etc.)
- Config files (next.config.ts, i18n.config.ts, etc.)
- Utility functions (cn(), timeAgo(), etc.)

**Note**: High count of thin communities suggests opportunity for better code organization and stronger intra-community connections.

---

## Quick Navigation by Purpose

### Authentication & Security
- [[Community-1-Auth-System|Community 1 - Auth]]
- [[God Nodes#adminAuth|adminAuth()]]

### Payments & Contracts
- [[Community-3-Contracts-Escrow|Community 3 - Contracts]]
- Stripe integration

### Job Management
- [[Community-0-Jobs-Contacts|Community 0 - Jobs]]
- [[Community-11-Job-Management|Community 11 - Job Actions]]

### User Experience
- [[Community-2-User-Interactions|Community 2 - Interactions]]
- [[Community-6-i18n|Community 6 - i18n]]
- [[Community-4-UI|Community 4 - UI Components]]

### Content Analysis
- [[Community-7-ATS|Community 7 - ATS]]
- [[Community-10-AI|Community 10 - AI]]
- [[Community-12-Analysis|Community 12 - History]]

### User Features
- [[Community-8-Interviews|Community 8 - Interviews]]
- [[Community-9-Disputes|Community 9 - Disputes]]
- [[Community-13-Reviews|Community 13 - Reviews]]

### Admin & Moderation
- [[Community-5-Admin|Community 5 - Admin]]

### Analytics & Reporting
- [[Community-15-Analytics|Community 15 - Analytics]]

---

**Last Updated**: 2026-04-26
**Data Source**: graphify-out/GRAPH_REPORT.md
**Total Communities**: 126 (15 meaningful, 111 thin/single-node)
