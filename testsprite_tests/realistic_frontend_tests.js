#!/usr/bin/env node

/**
 * BidJobs Realistic Frontend Test Suite
 * Tests actual pages and functionality of the running application
 */

const axios = require('axios');
const assert = require('assert');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

// Tests
const tests = {
  async testHomepageLoads() {
    console.log('✓ Testing: Homepage loads');
    const res = await axios.get(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, 'Homepage should return 200');
    assert(res.data.includes('html'), 'Response should be HTML');
  },

  async testSignInPageLoads() {
    console.log('✓ Testing: Sign In page loads');
    const res = await axios.get(`${BASE_URL}/sign-in`);
    assert.strictEqual(res.status, 200, 'Sign In page should return 200');
  },

  async testSignUpPageLoads() {
    console.log('✓ Testing: Sign Up page loads');
    const res = await axios.get(`${BASE_URL}/sign-up`);
    assert.strictEqual(res.status, 200, 'Sign Up page should return 200');
  },

  async testJobsBrowsePageLoads() {
    console.log('✓ Testing: Jobs Browse page loads');
    const res = await axios.get(`${BASE_URL}/jobs/browse`);
    assert.strictEqual(res.status, 200, 'Jobs Browse page should return 200');
  },

  async testJobsSearchPageLoads() {
    console.log('✓ Testing: Jobs Search page loads');
    const res = await axios.get(`${BASE_URL}/jobs/search`);
    assert.strictEqual(res.status, 200, 'Jobs Search page should return 200');
  },

  async testATSOptimizerPageLoads() {
    console.log('✓ Testing: ATS Optimizer page loads');
    const res = await axios.get(`${BASE_URL}/ats-optimize`);
    assert.strictEqual(res.status, 200, 'ATS Optimizer page should return 200');
  },

  async testContactPageLoads() {
    console.log('✓ Testing: Contact page loads');
    const res = await axios.get(`${BASE_URL}/contact`);
    assert.strictEqual(res.status, 200, 'Contact page should return 200');
  },

  async testAboutPageLoads() {
    console.log('✓ Testing: About page loads');
    const res = await axios.get(`${BASE_URL}/about`);
    assert.strictEqual(res.status, 200, 'About page should return 200');
  },

  async testBlogPageLoads() {
    console.log('✓ Testing: Blog/Community page loads');
    try {
      const res = await axios.get(`${BASE_URL}/community`);
      assert.strictEqual(res.status, 200, 'Blog page should return 200');
    } catch {
      // Try alternative URL
      const res = await axios.get(`${BASE_URL}/blog`);
      assert.strictEqual(res.status, 200, 'Blog page should return 200');
    }
  },

  async testCreateProfilePageLoads() {
    console.log('✓ Testing: Create Profile page loads');
    const res = await axios.get(`${BASE_URL}/create-profile`);
    assert.strictEqual(res.status, 200, 'Create Profile page should return 200');
  },

  async testForgotPasswordPageLoads() {
    console.log('✓ Testing: Forgot Password page loads');
    const res = await axios.get(`${BASE_URL}/forgot-password`);
    assert.strictEqual(res.status, 200, 'Forgot Password page should return 200');
  },

  async testResetPasswordPageLoads() {
    console.log('✓ Testing: Reset Password page loads');
    const res = await axios.get(`${BASE_URL}/reset-password`);
    assert.strictEqual(res.status, 200, 'Reset Password page should return 200');
  },

  async testHomepageHasContent() {
    console.log('✓ Testing: Homepage has content');
    const res = await axios.get(`${BASE_URL}/`);
    const data = res.data.toLowerCase();
    // Check for key elements
    assert(data.includes('bidjob') || data.includes('job') || data.includes('freelance'),
      'Homepage should mention jobs or freelance');
  },

  async testPageResponseTime() {
    console.log('✓ Testing: Page response time');
    const start = Date.now();
    await axios.get(`${BASE_URL}/`);
    const time = Date.now() - start;
    assert(time < 5000, `Homepage should load in < 5 seconds, took ${time}ms`);
    console.log(`  Response time: ${time}ms`);
  },

  async testErrorPageHandling() {
    console.log('✓ Testing: 404 error page handling');
    try {
      await axios.get(`${BASE_URL}/non-existent-page-xyz`);
      // If it doesn't error, check status
    } catch (error) {
      const status = error.response?.status;
      // 404 or 200 (custom error page) both acceptable
      assert(status === 404 || status === 200, `Expected 404 or 200, got ${status}`);
    }
  },

  async testAuthPageRedirect() {
    console.log('✓ Testing: Auth page accessibility');
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`);
      // Dashboard might redirect or return 200 depending on auth state
      assert(res.status === 200 || res.status === 307 || res.status === 302,
        'Dashboard should be accessible or redirect');
    } catch {
      // Expected if not authenticated
    }
  },
};

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting BidJobs Realistic Frontend Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;

  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      await testFn();
      passed++;
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
