# HollaEx Kit Test Suite

This directory contains end-to-end tests for the HollaEx Kit application using Playwright.

## Overview

The test suite validates page navigation and functionality across the HollaEx platform, including wallet management, trading, security settings, and more.

## Test Structure

```
test/
├── playwright/              # Playwright test suite
│   ├── tests/
│   │   ├── global-setup.js  # Global authentication setup
│   │   ├── page-navigation/ # Page navigation tests
│   │   └── utils/           # Test utilities and helpers
│   └── playwright.config.js # Playwright configuration
└── Cypress/                 # Cypress test suite (legacy)
```

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn

## Setup

1. Navigate to the Playwright test directory:
   ```bash
   cd test/playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure test credentials:
   - Ensure `tests/utils/test-data.js` file exists and contains the required test credentials
   - The file should include user credentials, API endpoints, and test configuration
   - You can override default values using environment variables if needed

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run specific test file:
```bash
npx playwright test tests/page-navigation/page-navigation.spec.js
```

### Run tests with UI mode:
```bash
npx playwright test --ui
```

## Test Configuration

- **Base URL**: `https://sandbox.hollaex.com`
- **Browser**: Chromium (Desktop Chrome)
- **Workers**: 1 (to avoid HTTP 429 errors)
- **Retries**: 2 on CI, 0 locally
- **Authentication**: Global setup authenticates once and reuses session state

## Test Categories

### Wallet Pages
- Wallet main page
- Deposit page
- Withdrawal page
- Address book
- Volume page
- Wallet history

### History Pages
- Trades history
- Order history
- Deposits history
- Withdrawals history

### Security Pages
- 2FA settings
- Password change
- API Keys management
- Active sessions
- Login history

### Verification Pages
- Email verification
- Phone verification
- Identity verification
- Payment verification

### Settings Pages
- Notification settings
- Interface settings
- Language settings
- Audio cues
- Account settings

### Stake Pages
- Stake main page
- Staking details
- CeFi/DeFi staking

### P2P Pages
- P2P deals
- P2P orders
- P2P profile
- Post deal
- My deals

### Apps Page
- Apps listing
- My apps

### Core Pages
- Summary
- Account
- Markets
- Trade (including chart functionality)
- Prices

### Top Bar Tests
- Navigation hover functionality
- Market selection
- Dark/light mode toggle

## Test Utilities

The test suite includes helper utilities in `tests/utils/`:

- **test-data.js**: Test configuration file that must contain test credentials, user accounts, API endpoints, and other test data. This file is required for tests to run.
- **login-helper.js**: Authentication helpers
- **helpers.js**: General test utilities
- **session-helper.js**: Session management

## Global Setup

The `global-setup.js` file handles authentication before tests run, saving the session state to avoid repeated logins. The authentication state is stored in `.auth/admin.json`.

## Test Reports

Test results are generated in multiple formats:
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/results.xml`

View the HTML report:
```bash
npx playwright show-report
```

## Troubleshooting

### Authentication Issues
- Clear the authentication state: Delete `.auth/admin.json`
- Verify that `tests/utils/test-data.js` exists and contains valid test credentials
- Check that the credentials in `test-data.js` match your test environment

### Timeout Issues
- Increase timeout values in `playwright.config.js`
- Check network connectivity to the sandbox environment

### Flaky Tests
- Tests are configured to retry on CI
- Check for network issues or slow page loads
- Review screenshots and videos in `test-results/` directory

## Notes

- Tests run against the sandbox environment by default
- Authentication is performed once via global setup for efficiency
- Screenshots and videos are captured on test failures
- Tests use a single worker to prevent rate limiting

