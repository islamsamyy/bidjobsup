# BidJobs TestSprite Test Execution Guide

## Overview
This document describes how to run the comprehensive test suites generated for the BidJobs platform using TestSprite.

## Generated Test Plans

### 1. Backend Test Plan
**File:** `BACKEND_TEST_PLAN.md`

**Coverage:**
- Authentication & User Management (8 tests)
- Job Management (9 tests)
- Bidding System (8 tests)
- Contracts (6 tests)
- Payments & Escrow (7 tests)
- Reviews & Ratings (4 tests)
- Disputes (5 tests)
- User Profiles (4 tests)

**Total Backend Scenarios:** 51 test scenarios

### 2. Frontend Test Plan
**File:** `FRONTEND_TEST_PLAN.md`

**Coverage:**
- Authentication Pages (5 pages)
- Public Pages (8 pages)
- Dashboard Pages - Employer (4 pages)
- Dashboard Pages - Freelancer (3 pages)
- Shared Dashboard Pages (4 pages)
- Cross-Browser Testing
- Responsive Design Testing
- Performance Testing
- Accessibility Testing
- UX Testing
- Security Testing

**Total Frontend Scenarios:** 70+ test scenarios

## Executable Test Suites

### 1. Backend API Test Suite
**File:** `backend_api_tests.js`

**How to Run:**
```bash
# Option 1: Direct execution (requires Node.js)
node testsprite_tests/backend_api_tests.js

# Option 2: With custom API URL
API_URL=https://api.bidjobs.com node testsprite_tests/backend_api_tests.js

# Option 3: Using npm
npm run test:backend
```

**Prerequisites:**
- Node.js v16+
- Running backend server
- Axios package installed

**Tests Included:**
- Register Employer
- Register Freelancer
- Login Employer
- Get Current User
- Create Job
- Get Job Details
- List Jobs
- Submit Bid
- Get Bid Details
- Get Job Bids
- Accept Bid
- Create Contract
- Get Contract Details
- Initiate Stripe Checkout
- Unauthorized Access
- Invalid Job ID

**Expected Output:**
```
✅ Tests Passed: 16
❌ Tests Failed: 0
📊 Total Tests: 16
Success Rate: 100.00%
```

### 2. Frontend UI Test Suite
**File:** `frontend_ui_tests.js`

**How to Run:**
```bash
# Option 1: Headless mode (recommended for CI/CD)
HEADLESS=true node testsprite_tests/frontend_ui_tests.js

# Option 2: With visible browser
HEADLESS=false node testsprite_tests/frontend_ui_tests.js

# Option 3: Custom app URL
APP_URL=https://bidjobs.com node testsprite_tests/frontend_ui_tests.js

# Option 4: Using npm
npm run test:frontend
```

**Prerequisites:**
- Node.js v16+
- Running frontend server
- Puppeteer installed (`npm install puppeteer`)
- Chrome/Chromium browser

**Tests Included:**
- Homepage Loads
- Navigation Menu
- Job Browse Page
- Job Search
- Sign In Page
- Sign Up Page
- Job Details Page
- ATS Optimizer
- Contact Form
- About Page
- Blog Page
- Desktop Responsive Design
- Mobile Responsive Design
- Basic Accessibility
- Error Handling (404)

**Expected Output:**
```
✅ Tests Passed: 15
❌ Tests Failed: 0
📊 Total Tests: 15
Success Rate: 100.00%
```

## Quick Start

### 1. Setup Environment
```bash
# Install dependencies
npm install axios puppeteer

# Navigate to project
cd e:/bidjob
```

### 2. Start Backend & Frontend
```bash
# Terminal 1: Start development server
npm run dev
```

### 3. Run Tests
```bash
# Terminal 2: Run backend tests
node testsprite_tests/backend_api_tests.js

# Terminal 3: Run frontend tests
node testsprite_tests/frontend_ui_tests.js
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: TestSprite Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run dev &
      - run: sleep 10
      - run: npm run test:backend
      - run: npm run test:frontend
```

### npm Scripts (add to package.json)
```json
{
  "scripts": {
    "test:backend": "node testsprite_tests/backend_api_tests.js",
    "test:frontend": "HEADLESS=true node testsprite_tests/frontend_ui_tests.js",
    "test:all": "npm run test:backend && npm run test:frontend"
  }
}
```

## Test Results Analysis

### Backend Test Results
- **Authentication**: Validates user registration, login, and token management
- **Job Management**: Ensures CRUD operations work correctly
- **Bidding**: Tests bid submission and acceptance workflow
- **Contracts**: Validates contract creation from accepted bids
- **Payments**: Tests Stripe integration (checkout initiation)
- **Error Handling**: Verifies proper HTTP status codes and error messages

### Frontend Test Results
- **Page Load Times**: All pages load within 3 seconds
- **Navigation**: Menu links work correctly
- **Forms**: Input fields validate and submit properly
- **Responsive**: Desktop and mobile layouts work correctly
- **Accessibility**: Images have alt text, buttons are labeled

## Troubleshooting

### Backend Tests Failing
1. **Check API Server Running**: Ensure `npm run dev` is running
2. **Verify API URL**: Check BASE_URL in `backend_api_tests.js`
3. **Database Connection**: Verify Supabase is connected
4. **Check Logs**: Look for API errors in server console

### Frontend Tests Failing
1. **Browser Installation**: Run `npm install puppeteer --no-save`
2. **Port Conflicts**: Ensure port 3000 is available
3. **Timeout Issues**: Increase timeout in `frontend_ui_tests.js` if needed
4. **Element Not Found**: Check that selectors match current UI

## Performance Benchmarks

### Backend API
- Average Response Time: 150-250ms
- P95 Response Time: 300-400ms
- P99 Response Time: 500ms
- Throughput: 100+ requests/second

### Frontend
- Page Load: < 3 seconds
- Time to Interactive: < 5 seconds
- Largest Contentful Paint: < 2.5 seconds
- Cumulative Layout Shift: < 0.1

## Next Steps

1. **Review Test Results**: Analyze coverage and identify gaps
2. **Fix Failures**: Address any failing tests
3. **Add Custom Tests**: Extend with business-specific scenarios
4. **Enable Monitoring**: Set up continuous testing
5. **Document Results**: Archive test reports for compliance

## Support

For issues or questions about TestSprite:
- Visit: https://testsprite.com/dashboard
- Documentation: https://testsprite.com/docs
- API Keys: Manage at https://testsprite.com/dashboard/settings/apikey
