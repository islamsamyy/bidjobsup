#!/usr/bin/env node

/**
 * BidJobs Backend API Test Suite
 * Tests core API endpoints for authentication, jobs, bids, contracts, and payments
 */

const axios = require('axios');
const assert = require('assert');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test data
let testData = {
  employer: { email: 'employer@test.com', password: 'TestPass123!' },
  freelancer: { email: 'freelancer@test.com', password: 'TestPass123!' },
  jobId: null,
  bidId: null,
  contractId: null,
};

let authTokens = {};

// Helper functions
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TEST_TIMEOUT,
  validateStatus: () => true, // Don't throw on any status code
});

async function makeRequest(method, url, data = null, token = null) {
  const config = {};
  if (token) {
    config.headers = { 'Authorization': `Bearer ${token}` };
  }

  if (method === 'GET') return api.get(url, config);
  if (method === 'POST') return api.post(url, data, config);
  if (method === 'PUT') return api.put(url, data, config);
  if (method === 'DELETE') return api.delete(url, config);
}

// Test Suite
const tests = {
  // Authentication Tests
  async testRegisterEmployer() {
    console.log('\n✓ Testing: Register Employer');
    const res = await makeRequest('POST', '/api/auth/register', {
      email: testData.employer.email,
      password: testData.employer.password,
      role: 'employer',
      full_name: 'Test Employer',
    });
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}`);
    assert(res.data.token, 'Token not returned');
    authTokens.employer = res.data.token;
    return true;
  },

  async testRegisterFreelancer() {
    console.log('✓ Testing: Register Freelancer');
    const res = await makeRequest('POST', '/api/auth/register', {
      email: testData.freelancer.email,
      password: testData.freelancer.password,
      role: 'freelancer',
      full_name: 'Test Freelancer',
    });
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}`);
    assert(res.data.token, 'Token not returned');
    authTokens.freelancer = res.data.token;
    return true;
  },

  async testLoginEmployer() {
    console.log('✓ Testing: Login Employer');
    const res = await makeRequest('POST', '/api/auth/login', {
      email: testData.employer.email,
      password: testData.employer.password,
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert(res.data.token, 'Token not returned');
    authTokens.employer = res.data.token;
    return true;
  },

  async testGetCurrentUser() {
    console.log('✓ Testing: Get Current User');
    const res = await makeRequest('GET', '/api/auth/user', null, authTokens.employer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert.strictEqual(res.data.email, testData.employer.email);
    return true;
  },

  // Job Management Tests
  async testCreateJob() {
    console.log('✓ Testing: Create Job');
    const res = await makeRequest('POST', '/api/jobs', {
      title: 'Build a React App',
      description: 'Need a React application built',
      budget: 5000,
      category: 'web-development',
      skills: ['React', 'JavaScript'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }, authTokens.employer);
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}`);
    assert(res.data.id, 'Job ID not returned');
    testData.jobId = res.data.id;
    return true;
  },

  async testGetJob() {
    console.log('✓ Testing: Get Job Details');
    const res = await makeRequest('GET', `/api/jobs/${testData.jobId}`, null, authTokens.freelancer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert.strictEqual(res.data.title, 'Build a React App');
    assert.strictEqual(res.data.budget, 5000);
    return true;
  },

  async testListJobs() {
    console.log('✓ Testing: List Jobs');
    const res = await makeRequest('GET', '/api/jobs?limit=10&offset=0', null, authTokens.freelancer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.jobs), 'Jobs should be an array');
    return true;
  },

  // Bidding Tests
  async testSubmitBid() {
    console.log('✓ Testing: Submit Bid');
    const res = await makeRequest('POST', '/api/bids', {
      job_id: testData.jobId,
      amount: 4500,
      timeline_days: 14,
      proposal: 'I can build this React app with all required features',
    }, authTokens.freelancer);
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}`);
    assert(res.data.id, 'Bid ID not returned');
    testData.bidId = res.data.id;
    return true;
  },

  async testGetBid() {
    console.log('✓ Testing: Get Bid Details');
    const res = await makeRequest('GET', `/api/bids/${testData.bidId}`, null, authTokens.freelancer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert.strictEqual(res.data.amount, 4500);
    return true;
  },

  async testGetJobBids() {
    console.log('✓ Testing: Get Job Bids');
    const res = await makeRequest('GET', `/api/jobs/${testData.jobId}/bids`, null, authTokens.employer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.bids), 'Bids should be an array');
    assert(res.data.bids.length > 0, 'Should have at least one bid');
    return true;
  },

  async testAcceptBid() {
    console.log('✓ Testing: Accept Bid');
    const res = await makeRequest('POST', `/api/bids/${testData.bidId}/accept`, {}, authTokens.employer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert.strictEqual(res.data.status, 'accepted');
    return true;
  },

  // Contract Tests
  async testCreateContract() {
    console.log('✓ Testing: Create Contract from Bid');
    const res = await makeRequest('POST', '/api/contracts', {
      bid_id: testData.bidId,
    }, authTokens.employer);
    assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}`);
    assert(res.data.id, 'Contract ID not returned');
    testData.contractId = res.data.id;
    return true;
  },

  async testGetContract() {
    console.log('✓ Testing: Get Contract Details');
    const res = await makeRequest('GET', `/api/contracts/${testData.contractId}`, null, authTokens.employer);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert(res.data.id);
    return true;
  },

  // Payment Tests
  async testInitiateCheckout() {
    console.log('✓ Testing: Initiate Stripe Checkout');
    const res = await makeRequest('POST', '/api/stripe/checkout', {
      planId: 'employer_pro',
    }, authTokens.employer);
    // Should return checkout URL or error, both valid responses
    assert(res.status === 200 || res.status === 400 || res.status === 503, `Unexpected status ${res.status}`);
    return true;
  },

  // Error Handling Tests
  async testUnauthorizedAccess() {
    console.log('✓ Testing: Unauthorized Access');
    const res = await makeRequest('GET', '/api/jobs');
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    return true;
  },

  async testInvalidJob() {
    console.log('✓ Testing: Invalid Job ID');
    const res = await makeRequest('GET', '/api/jobs/invalid-id', null, authTokens.freelancer);
    assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
    return true;
  },
};

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting BidJobs Backend API Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;

  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      const result = await testFn();
      if (result) {
        passed++;
      }
    } catch (error) {
      console.error(`❌ ${testName} failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Tests Passed: ${passed}`);
  console.log(`❌ Tests Failed: ${failed}`);
  console.log(`📊 Total Tests: ${passed + failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
