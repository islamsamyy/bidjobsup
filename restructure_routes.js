const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

// Map from current Stitch folder names → clean routes
const routeMap = {
  // Auth
  'bidjobs-sign-in':                        '(auth)/sign-in',
  'bidjobs-create-profile':                 '(auth)/create-profile',
  'bidjobs-account-recovery':               '(auth)/forgot-password',
  'bidjobs-reset-password':                 '(auth)/reset-password',
  'bidjobs-join-the-elite':                 '(auth)/join',

  // Public pages
  'bidjobs-homepage-pixel-perfect':         '(public)/home',
  'bidjobs-homepage-arabic':                '(public)/home-ar',
  'bidjobs-homepage-v2-html':               '(public)/home-v2',
  'bidjobs-about-us':                       '(public)/about',
  'bidjobs-contact-support':                '(public)/contact',
  'bidjobs-terms-privacy':                  '(public)/terms',
  'bidjobs-pricing-plans':                  '(public)/pricing',
  'bidjobs-page-not-found-404':             '(public)/404',

  // Jobs
  'bidjobs-browse-jobs':                    'jobs/browse',
  'bidjobs-job-list':                       'jobs/list',
  'bidjobs-job-details':                    'jobs/details',
  'bidjobs-enhanced-search-results':        'jobs/search',
  'bidjobs-no-results-found':              'jobs/no-results',

  // Community
  'bidjobs-community-feed':                 'community/feed',
  'bidjobs-blog-index':                     'community/blog',
  'bidjobs-single-article':                 'community/article',

  // Seeker dashboard
  'bidjobs-seeker-dashboard-overview':      'dashboard/seeker',
  'bidjobs-seeker-my-profile':              'dashboard/seeker/profile',
  'bidjobs-seeker-my-applications':         'dashboard/seeker/applications',
  'bidjobs-seeker-saved-notifications':     'dashboard/seeker/saved',
  'bidjobs-seeker-subscription-plans':      'dashboard/seeker/subscription',

  // Employer dashboard
  'bidjobs-employer-dashboard-overview':    'dashboard/employer',
  'bidjobs-employer-manage-listings':       'dashboard/employer/listings',
  'bidjobs-employer-post-a-new-role':       'dashboard/employer/post-job',
  'bidjobs-employer-company-profile-editor':'dashboard/employer/profile',
  'bidjobs-employer-talent-pipeline':       'dashboard/employer/talent',
  'bidjobs-employer-billing-plans':         'dashboard/employer/billing',

  // Messaging
  'bidjobs-messages':                       'messages',
};

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  mkdirp(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function rmdir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

let moved = 0;
for (const [oldName, newRoute] of Object.entries(routeMap)) {
  const src = path.join(appDir, oldName);
  const dest = path.join(appDir, newRoute);

  if (!fs.existsSync(src)) {
    console.log(`SKIP (not found): ${oldName}`);
    continue;
  }

  copyDir(src, dest);
  rmdir(src);
  console.log(`✓ ${oldName} → ${newRoute}`);
  moved++;
}

console.log(`\nDone! Moved ${moved} routes.`);
