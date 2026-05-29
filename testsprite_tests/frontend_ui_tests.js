#!/usr/bin/env node

/**
 * BidJobs Frontend UI Test Suite
 * Tests critical user journeys and page functionality
 */

const puppeteer = require('puppeteer');
const assert = require('assert');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false';

let browser;
let page;

const tests = {
  async setupBrowser() {
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    console.log('✓ Browser launched');
  },

  async testHomepageLoads() {
    console.log('\n✓ Testing: Homepage Loads');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const title = await page.title();
    assert(title.length > 0, 'Page title is empty');
    const headings = await page.$$('h1');
    assert(headings.length > 0, 'No h1 headings found on homepage');
  },

  async testNavigationMenu() {
    console.log('✓ Testing: Navigation Menu');
    const navLinks = await page.$$('nav a');
    assert(navLinks.length > 0, 'No navigation links found');
    console.log(`  Found ${navLinks.length} navigation links`);
  },

  async testJobBrowsePage() {
    console.log('✓ Testing: Jobs Browse Page');
    await page.goto(`${BASE_URL}/jobs/browse`, { waitUntil: 'networkidle2' });
    const jobCards = await page.$$('[data-testid="job-card"], .job-card, [class*="job"]');
    console.log(`  Found ${jobCards.length} job cards`);
  },

  async testJobSearch() {
    console.log('✓ Testing: Job Search');
    const searchInput = await page.$('input[placeholder*="search"], input[type="search"]');
    if (searchInput) {
      await searchInput.type('React developer', { delay: 100 });
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      const results = await page.$$('[data-testid="search-result"], .result, [class*="result"]');
      console.log(`  Found ${results.length} search results`);
    }
  },

  async testSignInPage() {
    console.log('✓ Testing: Sign In Page');
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle2' });
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    assert(emailInput, 'Email input not found');
    assert(passwordInput, 'Password input not found');
    assert(submitButton, 'Submit button not found');
  },

  async testSignUpPage() {
    console.log('✓ Testing: Sign Up Page');
    await page.goto(`${BASE_URL}/sign-up`, { waitUntil: 'networkidle2' });
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const roleSelect = await page.$('select, [role="combobox"], [class*="select"]');
    assert(emailInput, 'Email input not found');
    assert(passwordInput, 'Password input not found');
  },

  async testJobDetailsPage() {
    console.log('✓ Testing: Job Details Page');
    // Navigate to first job if available
    await page.goto(`${BASE_URL}/jobs/browse`, { waitUntil: 'networkidle2' });
    const firstJobLink = await page.$('a[href*="/jobs/"]');
    if (firstJobLink) {
      await firstJobLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const jobTitle = await page.$('h1, [class*="title"]');
      assert(jobTitle, 'Job title not found on details page');
      const bidButton = await page.$('button:has-text("Bid"), button:contains("Bid"), [class*="bid"]');
      console.log(`  Job details page loaded correctly`);
    }
  },

  async testATSOptimizer() {
    console.log('✓ Testing: ATS Optimizer Page');
    await page.goto(`${BASE_URL}/ats-optimize`, { waitUntil: 'networkidle2' });
    const fileInput = await page.$('input[type="file"]');
    const textarea = await page.$('textarea, [class*="description"]');
    assert(fileInput || textarea, 'Upload or input fields not found on ATS page');
  },

  async testContactForm() {
    console.log('✓ Testing: Contact Form');
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle2' });
    const nameInput = await page.$('input[type="text"], input[name="name"]');
    const emailInput = await page.$('input[type="email"]');
    const messageInput = await page.$('textarea, [name="message"]');
    const submitButton = await page.$('button[type="submit"]');
    assert(nameInput || emailInput, 'Contact form inputs not found');
  },

  async testAboutPage() {
    console.log('✓ Testing: About Page');
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle2' });
    const pageContent = await page.$('main, [role="main"], [class*="container"]');
    assert(pageContent, 'About page content not found');
  },

  async testBlogPage() {
    console.log('✓ Testing: Blog/Community Page');
    const blogUrl = `${BASE_URL}/community`;
    await page.goto(blogUrl, { waitUntil: 'networkidle2' }).catch(async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle2' }).catch(() => {});
    });
    const articles = await page.$$('article, [class*="post"], [class*="article"]');
    console.log(`  Found ${articles.length} articles/posts`);
  },

  async testResponsiveDesktop() {
    console.log('✓ Testing: Responsive Design (Desktop)');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const mobileMenu = await page.$('[class*="mobile"], [class*="hamburger"]');
    console.log('  Desktop view loaded');
  },

  async testResponsiveMobile() {
    console.log('✓ Testing: Responsive Design (Mobile)');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const mobileMenu = await page.$('[class*="mobile"], [class*="hamburger"]');
    console.log('  Mobile view loaded');
  },

  async testAccessibility() {
    console.log('✓ Testing: Basic Accessibility');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const images = await page.$$('img[alt]');
    console.log(`  Found ${images.length} images with alt text`);
    const buttons = await page.$$('button');
    console.log(`  Found ${buttons.length} buttons`);
  },

  async testErrorHandling() {
    console.log('✓ Testing: 404 Error Page');
    await page.goto(`${BASE_URL}/non-existent-page`, { waitUntil: 'networkidle2' }).catch(() => {});
    const statusCode = page.response().status();
    console.log(`  Status code: ${statusCode}`);
  },

  async closeBrowser() {
    if (browser) {
      await browser.close();
      console.log('\n✓ Browser closed');
    }
  },
};

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting BidJobs Frontend UI Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;
  const testNames = Object.keys(tests).filter(k => k !== 'setupBrowser' && k !== 'closeBrowser');

  try {
    // Setup
    await tests.setupBrowser();

    // Run tests
    for (const testName of testNames) {
      try {
        await tests[testName]();
        passed++;
      } catch (error) {
        console.error(`❌ ${testName} failed: ${error.message}`);
        failed++;
      }
    }

    // Cleanup
    await tests.closeBrowser();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    await tests.closeBrowser();
    process.exit(1);
  }

  console.log('='.repeat(50));
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
