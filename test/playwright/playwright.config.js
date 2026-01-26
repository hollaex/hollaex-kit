// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const path = require('path');
const fs = require('fs');

// Path to authentication state file (will be created by global setup)
const storageStatePath = path.join(__dirname, '.auth/admin.json');

module.exports = defineConfig({
  testDir: './tests',
  /* Global setup to authenticate once and save session state */
  globalSetup: require.resolve('./tests/global-setup.js'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Limit to 1 worker to avoid HTTP 429 errors */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://sandbox.hollaex.com',
    /* Use stored authentication state to avoid logging in for each test */
    /* The global setup will create this file before tests run */
    /* Only use it if the file exists (it will be created by global setup) */
    /* If it doesn't exist, the login helper will handle authentication */
    ...(fs.existsSync(storageStatePath) ? { storageState: storageStatePath } : {}),
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Global timeout for each action */
    actionTimeout: 10000,
    /* Global timeout for navigation */
    navigationTimeout: 30000,
    /* Run in headed mode as requested */
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

