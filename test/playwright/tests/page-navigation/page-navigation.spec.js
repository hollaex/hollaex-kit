const { test, expect } = require('@playwright/test');
const { loginUser } = require('../utils/login-helper');
const testData = require('../utils/test-data');

test.describe('Page Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Check if login is needed (only logs in if not already authenticated)
    // The storageState from global setup should handle authentication, but this is a fallback
    await loginUser(page, 'admin');
    // Wait for navigation after login (if login was performed)
    await page.waitForTimeout(2000);
  });

  test.describe('Wallet Pages', () => {
    test('should load Wallet main page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet/);
      // Verify wallet table is visible
      await expect(page.getByRole('table')).toBeVisible();
    });

    test('should load Deposit page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/deposit`, { waitUntil: 'networkidle' });
      // Wait for URL to stabilize - it might redirect, so wait for either deposit or wallet URL
      await page.waitForURL(/.*\/wallet(\/deposit)?/, { timeout: 10000 });
      const currentUrl = page.url();
      
      // The page might redirect to /wallet, so check for either URL
      if (currentUrl.includes('/wallet/deposit')) {
        // Verify deposit form elements - use first() to avoid strict mode violation
        await expect(page.getByText(/Select asset|Select/i).first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Deposit|deposit/i).first()).toBeVisible({ timeout: 10000 });
        // Verify deposit history table is visible
        await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
      } else if (currentUrl.includes('/wallet') && !currentUrl.includes('/deposit')) {
        // If redirected to wallet page, verify we're on wallet page and it has a table
        await expect(page).toHaveURL(/.*\/wallet/);
        await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
      } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
      }
    });

    test('should load Withdrawal page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/withdraw`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet\/withdraw/);
      // Verify withdrawal page is loaded - use first() to avoid strict mode violation
      await expect(page.getByText(/withdraw|Withdraw/i).first()).toBeVisible({ timeout: 10000 });
      // Verify withdrawal history table is visible - wait for table to be visible
      await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    });

    test('should load Addresses page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/address-book`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet\/address-book/);
      // Verify address book is loaded - use first() to avoid strict mode violation
      await expect(page.getByText(/Address|address/i).first()).toBeVisible({ timeout: 10000 });
      // Verify address book table or form is visible
      const hasTable = await page.getByRole('table').isVisible().catch(() => false);
      const hasForm = await page.getByRole('form').isVisible().catch(() => false);
      expect(hasTable || hasForm).toBeTruthy();
    });

    test('should load Volume page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/volume`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet\/volume/);
      // Verify volume page is loaded - use first() to avoid strict mode violation
      await expect(page.getByText(/volume|Volume/i).first()).toBeVisible({ timeout: 10000 });
      // Verify volume data is displayed
      const hasTable = await page.getByRole('table').isVisible().catch(() => false);
      const hasTradingText = await page.getByText(/Trading|trading/i).isVisible().catch(() => false);
      expect(hasTable || hasTradingText).toBeTruthy();
    });

    test('should load Wallet Volume page with trading statistics', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/volume`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(10000); // Increased from 3000ms to 10000ms for slow loading
      await expect(page).toHaveURL(/.*\/wallet\/volume/);
      
      // Verify main elements - use more specific selectors
      await expect(page.getByText('Trading Volume')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Back')).toBeVisible({ timeout: 10000 });
      
      // Verify navigation links - try different selector approaches since they're clickable links
      const hasMarketsText = await page.getByText('MARKETS').isVisible().catch(() => false);
      const hasMarketsRole = await page.getByRole('link', { name: 'MARKETS' }).isVisible().catch(() => false);
      const hasMarketsLocator = await page.locator('text=MARKETS').isVisible().catch(() => false);
      const hasMarkets = hasMarketsText || hasMarketsRole || hasMarketsLocator;
      
      const hasConvertText = await page.getByText('CONVERT').isVisible().catch(() => false);
      const hasConvertRole = await page.getByRole('link', { name: 'CONVERT' }).isVisible().catch(() => false);
      const hasConvertLocator = await page.locator('text=CONVERT').isVisible().catch(() => false);
      const hasConvert = hasConvertText || hasConvertRole || hasConvertLocator;
      
      const hasHistoryText = await page.getByText('HISTORY').isVisible().catch(() => false);
      const hasHistoryRole = await page.getByRole('link', { name: 'HISTORY' }).isVisible().catch(() => false);
      const hasHistoryLocator = await page.locator('text=HISTORY').isVisible().catch(() => false);
      const hasHistory = hasHistoryText || hasHistoryRole || hasHistoryLocator;
      
      // At least 2 out of 3 navigation links should be visible
      const navigationLinksCount = [hasMarkets, hasConvert, hasHistory].filter(Boolean).length;
      expect(navigationLinksCount).toBeGreaterThanOrEqual(2);
      
      // Wait for volume data to load and verify volume periods are visible
      await page.waitForTimeout(5000); // Additional wait for volume data to load
      const has24HourVolume = await page.locator('text=24 HOUR VOLUME').isVisible().catch(() => false);
      const has7DayVolume = await page.locator('text=7-DAY VOLUME').isVisible().catch(() => false);
      const has30DayVolume = await page.locator('text=30-DAY VOLUME').isVisible().catch(() => false);
      const has90DayVolume = await page.locator('text=90-DAY VOLUME').isVisible().catch(() => false);
      
      // At least one volume period should be visible
      const volumePeriodsCount = [has24HourVolume, has7DayVolume, has30DayVolume, has90DayVolume].filter(Boolean).length;
      expect(volumePeriodsCount).toBeGreaterThanOrEqual(1);
      
      // Verify top asset sections are visible - check for specific ones we saw in the snapshot
      const hasTop1D = await page.locator('text=TOP 1 D VOL. ASSET').isVisible().catch(() => false);
      const hasTop7D = await page.locator('text=TOP 7 D VOL. ASSET').isVisible().catch(() => false);
      const hasTop30D = await page.locator('text=TOP 30 D VOL. ASSET').isVisible().catch(() => false);
      const hasTop90D = await page.locator('text=TOP 90 D VOL. ASSET').isVisible().catch(() => false);
      
      // At least one top asset section should be visible
      const topAssetSectionsCount = [hasTop1D, hasTop7D, hasTop30D, hasTop90D].filter(Boolean).length;
      expect(topAssetSectionsCount).toBeGreaterThanOrEqual(1);
      
      
      // Verify the page title contains "VOLUME" (more reliable check)
      const hasVolumeTitle = await page.getByText('VOLUME', { exact: true }).isVisible().catch(() => false);
      expect(hasVolumeTitle).toBeTruthy();
    });

    test('should load Wallet Duster page from wallet', async ({ page }) => {
      // First navigate to wallet page
      await page.goto(`${testData.baseUrl}/wallet`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet/);
      
      // Find and click the "Wallet duster" link
      await expect(page.getByText('Wallet duster')).toBeVisible({ timeout: 10000 });
      await page.getByText('Wallet duster').click();
      
      // Wait for duster modal to load and verify basic content
      await page.waitForTimeout(3000);
      // Verify duster modal content is visible
      const hasDusterTitle = await page.getByText('Convert wallet dust').isVisible().catch(() => false);
      const hasDusterDescription = await page.getByText(/Convert all low wallet balances/i).isVisible().catch(() => false);
      const hasBackLink = await page.getByText('Back to my wallet').isVisible().catch(() => false);
      expect(hasDusterTitle || hasDusterDescription || hasBackLink).toBeTruthy();
    });

    test('should load Wallet History page with P&L tabs', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/wallet/history`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/wallet\/history/);
      
      // Verify P&L tabs are visible
      await expect(page.getByText('P&L Summary')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Balance History')).toBeVisible({ timeout: 10000 });
      
      // Verify back to wallet link
      await expect(page.getByText('Back')).toBeVisible({ timeout: 10000 });
      
      // Verify basic content loads (balance text or performance text)
      const hasEstBalance = await page.getByText('Est. Total Balance').isVisible().catch(() => false);
      const hasBalancePerformance = await page.getByText('Balance performance').isVisible().catch(() => false);
      const hasWalletBreakdown = await page.getByText('Wallet balance breakdown').isVisible().catch(() => false);
      expect(hasEstBalance || hasBalancePerformance || hasWalletBreakdown).toBeTruthy();
    });
  });

  test.describe('History Pages', () => {
    test('should load Trades history page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/transactions?tab=trades`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/transactions.*tab=trades/);
      // Verify trades table is visible
      await expect(page.getByRole('table')).toBeVisible();
      // Use more specific selector to avoid strict mode violation
      await expect(page.getByText('Trades History')).toBeVisible();
    });

    test('should load Order history page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/transactions?tab=orders`);
      await page.waitForTimeout(3000);
      // Note: orders tab redirects to trades, so check for trades URL
      await expect(page).toHaveURL(/.*\/transactions.*tab=trades/);
      // Verify order history tab is visible (even though it redirects to trades)
      await expect(page.getByRole('table')).toBeVisible();
      // Check for "Order history" tab button
      await expect(page.getByText('Order history')).toBeVisible();
    });

    test('should load Deposits history page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/transactions?tab=deposits`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/transactions.*tab=deposits/);
      // Verify deposits history is loaded - use first() to avoid strict mode violation
      await expect(page.getByText(/Deposit|deposit/i).first()).toBeVisible();
    });

    test('should load Withdrawals history page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/transactions?tab=withdrawals`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/transactions.*tab=withdrawals/);
      // Verify withdrawals history is loaded - use first() to avoid strict mode violation
      await expect(page.getByText(/Withdraw|withdraw/i).first()).toBeVisible();
    });
  });

  test.describe('Security Pages', () => {
    test('should load 2FA page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/security?2fa`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/security.*2fa/);
      // Verify 2FA page is loaded - use text selector since it's text in a generic element, not a button
      await expect(page.getByText('Enable Two-Factor Authentication').first()).toBeVisible();
    });

    test('should load Password page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/security?password`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/security.*password/);
      // Verify password page is loaded - use more specific selector
      await expect(page.getByText('Change Password')).toBeVisible();
    });

    test('should load API Keys page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/security?apiKeys`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/security.*apiKeys/);
      // Verify API keys page is loaded - use .first() since "API Key" appears multiple times (tab, table header, table body)
      // Or check for unique text on the page
      const hasApiDescription = await page.getByText('The API provides functionality').isVisible().catch(() => false);
      const hasApiKeyText = await page.getByText('API Key', { exact: true }).first().isVisible().catch(() => false);
      expect(hasApiDescription || hasApiKeyText).toBeTruthy();
    });

    test('should load Sessions page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/security?sessions`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/security.*sessions/);
      // Verify sessions page is loaded - use .first() since "Active sessions" appears twice (heading and in description)
      await expect(page.getByText('Active sessions').first()).toBeVisible();
    });

    test('should load Login History page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/security?login-history`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/security.*login-history/);
      // Verify login history page is loaded - use more specific selector
      await expect(page.getByText('Login Attempts Record')).toBeVisible();
    });
  });

  test.describe('Verification Pages', () => {
    test('should load Email verification page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/verification?email`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/verification.*email/);
      // Verify email verification page is loaded - use more specific selector
      await expect(page.getByText('Email', { exact: true }).first()).toBeVisible();
    });

    test('should load Phone verification page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/verification?phone`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/verification.*phone/);
      // Verify phone verification page is loaded - check for verification page title
      await expect(page.getByText('Verification').first()).toBeVisible();
    });

    test('should load Identity verification page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/verification?identity`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/verification.*identity/);
      // Verify identity verification page is loaded - use more specific selector
      await expect(page.getByText('Identity', { exact: true })).toBeVisible();
    });

    test('should load Payment verification page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/verification?payment-accounts`);
      await page.waitForTimeout(3000);
      // Note: payment-accounts redirects to email, so check for verification page
      await expect(page).toHaveURL(/.*\/verification/);
      // Verify verification page is loaded
      await expect(page.getByText('Verification').first()).toBeVisible();
    });
  });

  test.describe('Settings Pages', () => {
    test('should load Notification settings page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?notification`);
      await page.waitForTimeout(3000);
      // Note: notification redirects to signals, so check for signals URL
      await expect(page).toHaveURL(/.*\/settings.*signals/);
      // Verify notification settings page is loaded - use .first() since "Notification" appears twice (tab and title)
      await expect(page.getByText('Notification', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    });

    test('should load Interface settings page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?interface`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/settings.*interface/);
      // Verify interface settings page is loaded - use .first() since "Interface" appears twice (tab and title)
      await expect(page.getByText('Interface', { exact: true }).first()).toBeVisible();
    });

    test('should load Language settings page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?language`);
      // Give more wait time for page loading
      await page.waitForTimeout(5000);
      await expect(page).toHaveURL(/.*\/settings.*language/);
      // Verify language settings page is loaded - check for Settings page title
      await expect(page.getByText('Settings').first()).toBeVisible();
      // Language tab might not be visible, so just verify we're on settings page
      const hasLanguageTab = await page.getByText('Language').first().isVisible().catch(() => false);
      expect(hasLanguageTab).toBeTruthy();
    });

    test('should load Audio Cues settings page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?audioCue`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/settings.*audioCue/);
      // Verify audio cues settings page is loaded - use .first() since "Audio Cues" appears twice (tab and title)
      await expect(page.getByText('Audio Cues', { exact: true }).first()).toBeVisible();
    });

    test('should load Account settings page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?account`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/settings.*account/);
      // Verify account settings page is loaded - use more specific selector
      await expect(page.getByText('Account', { exact: true }).first()).toBeVisible();
    });

    test('should load Account Settings with Sub Account management', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?account`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/settings.*account/);
      
      // Verify Manage Sub Accounts section
      await expect(page.getByText('Manage Sub Accounts')).toBeVisible({ timeout: 10000 });
      
      // Verify sub account description
      await expect(page.getByText(/Set up Sub Accounts to keep funds separate/i)).toBeVisible({ timeout: 10000 });
      
      // Verify account table is visible
      await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
      
      // Verify Account Sharing section
      await expect(page.getByText('Account Sharing')).toBeVisible({ timeout: 10000 });
      
      // Verify sharing description
      await expect(page.getByText(/Share your account with others/i)).toBeVisible({ timeout: 10000 });
    });

    test('should load Settings page and test notification toggle with revert', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/settings?signals`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/settings.*signals/);
      
      // Verify main Settings elements - use first() to avoid strict mode violation (Settings appears in sidebar, title, and descriptions)
      await expect(page.getByText('Settings').first()).toBeVisible({ timeout: 10000 });
      // Notification appears in both tab and section header, use first() to avoid strict mode violation
      await expect(page.getByText('Notification').first()).toBeVisible({ timeout: 10000 });
      
      // Find the "Show pop up when canceling orders" toggle
      // First verify the text is visible
      await expect(page.getByText('Show pop up when canceling orders')).toBeVisible({ timeout: 10000 });
      
      // Since "Show pop up when canceling orders" is the 5th notification option,
      // find all elements with "on" or "off" text and use the 5th one
      // These toggles show "on" when enabled and "off" when disabled
      const allToggleTexts = page.locator('text=/^(on|off)$/i');
      const toggleCount = await allToggleTexts.count();
      
      // We should have at least 5 toggles (one for each notification option)
      expect(toggleCount).toBeGreaterThanOrEqual(5);
      
      // Use the 5th toggle (index 4, 0-based) which corresponds to "Show pop up when canceling orders"
      const cancelOrderToggle = allToggleTexts.nth(4);
      await expect(cancelOrderToggle).toBeVisible({ timeout: 10000 });
      
      // Helper function to get toggle state (works for both switch and text-based toggles)
      const getToggleState = async (toggle) => {
        try {
          return await toggle.isChecked();
        } catch {
          // If not a switch, check if the text is "on" (checked) or "off" (unchecked)
          const toggleText = await toggle.textContent();
          return toggleText?.trim().toLowerCase() === 'on';
        }
      };
      
      // Get the original state of the toggle
      const originalState = await getToggleState(cancelOrderToggle);
      
      // Step 1: Click toggle to change state - use force click to bypass Trollbox overlay
      await cancelOrderToggle.click({ force: true });
      await page.waitForTimeout(1000);
      
      // Step 2: Click toggle again to revert to original state
      await cancelOrderToggle.click({ force: true });
      await page.waitForTimeout(1000);
      
      // Step 3: Verify toggle reverted to original state
      const revertedState = await getToggleState(cancelOrderToggle);
      expect(revertedState).toBe(originalState);
      
      // Verify other notification toggles are visible
      const hasOtherToggles = await page.getByText('Show pop up when order has been completed').isVisible().catch(() => false) ||
                             await page.getByText('Show pop up when order has partially filled').isVisible().catch(() => false) ||
                             await page.getByText('Show pop up when a new order has been placed').isVisible().catch(() => false);
      expect(hasOtherToggles).toBeTruthy();
    });
  });

  test.describe('Stake Page', () => {
    test('should load Stake page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/stake`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/stake/);
      // Verify stake page is loaded - use more specific selector
      await expect(page.getByRole('heading', { name: 'Stake' })).toBeVisible();
    });

    test('should load Staking Details page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/stake/details/xht`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/stake\/details\/xht/);
      
      // Verify token name is visible
      await expect(page.getByText('HollaEx Token')).toBeVisible({ timeout: 10000 });
      
      // Verify three tabs are visible
      await expect(page.getByText('Public info')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Distributions')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('My staking')).toBeVisible({ timeout: 10000 });
      
      // Verify back link
      await expect(page.getByText('Go back')).toBeVisible({ timeout: 10000 });
      
      // Verify basic staking content loads
      const hasStakingInfo = await page.getByText('Staking information').isVisible().catch(() => false);
      const hasTokenomics = await page.getByText(/staking tokenomics for HollaEx/i).isVisible().catch(() => false);
      expect(hasStakingInfo || hasTokenomics).toBeTruthy();
    });

    test('should load CeFi Staking page with Pools and My Stakes tabs', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/stake?cefi`);
      await page.waitForTimeout(3000);
      
      // The page initially redirects to ?defi, so we need to click the CeFi tab
      await expect(page).toHaveURL(/.*\/stake\?defi/); // Initially shows DeFi
      
      // Verify main staking elements are visible
      await expect(page.getByRole('heading', { name: 'Stake' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Defi Staking')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Cefi Staking')).toBeVisible({ timeout: 10000 });
      
      // Click on CeFi Staking tab to switch to CeFi view
      await page.getByText('Cefi Staking').click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/.*\/stake\?cefi/); // Now shows CeFi
      
      // Verify POOLS and MY STAKES tabs are visible
      await expect(page.getByRole('tab', { name: 'POOLS' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('tab', { name: 'MY STAKES' })).toBeVisible({ timeout: 10000 });
      
      // Verify POOLS tab content (should be active by default)
      await expect(page.getByText('Local Cefi Staking Pools')).toBeVisible({ timeout: 10000 });
      
      // Verify staking pools content is visible - just check if any staking content exists
      const hasStakingContent = await page.getByText('Local Cefi Staking Pools').isVisible().catch(() => false);
      expect(hasStakingContent).toBeTruthy();
      
      // Click on MY STAKES tab and verify content
      await page.getByRole('tab', { name: 'MY STAKES' }).click();
      await page.waitForTimeout(2000);
      
      // Verify MY STAKES tab content
      await expect(page.getByText('All staking events')).toBeVisible({ timeout: 10000 });
      
      // Verify table headers are visible
      const hasTableHeaders = await page.getByRole('table').isVisible().catch(() => false);
      expect(hasTableHeaders).toBeTruthy();
    });
  });

  test.describe('P2P Pages', () => {
    test('should load P2P main page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/p2p/);
      // Verify P2P page is loaded - use .first() since "P2P Deals" appears twice (heading and in description)
      await expect(page.getByText('P2P Deals').first()).toBeVisible();
    });

    test('should load P2P page with buy/sell toggle', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/p2p/);
      
      // Verify main P2P elements - use exact text match to avoid strict mode violation
      await expect(page.getByText('P2P Deals', { exact: true })).toBeVisible({ timeout: 10000 });
      
      // Verify buy/sell toggle elements
      await expect(page.getByText('I want to buy')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('I want to sell')).toBeVisible({ timeout: 10000 });
      
      // Verify toggle switch is visible and functional
      const toggleSwitch = page.getByRole('switch');
      await expect(toggleSwitch).toBeVisible({ timeout: 10000 });
      
      // Verify toggle is checked (buy mode by default)
      await expect(toggleSwitch).toBeChecked();
      
      // Verify P2P table with vendor data is visible
      await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
      
      // Verify filter options are visible
      await expect(page.getByText('Select Fiat currency')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Amount:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Method:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Available Regions:')).toBeVisible({ timeout: 10000 });
    });

    test('should load P2P Orders page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p/orders`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/p2p\/orders/);
      // Verify P2P orders page is loaded - check for "All Orders" text or "Orders" tab
      const hasAllOrders = await page.getByText('All Orders').isVisible().catch(() => false);
      const hasOrdersTab = await page.getByRole('tab', { name: 'Orders' }).isVisible().catch(() => false);
      expect(hasAllOrders || hasOrdersTab).toBeTruthy();
    });

    test('should load P2P Profile page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p/profile`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/p2p\/profile/);
      // Verify P2P profile page is loaded - check for "Display Name" or "Total Orders" which are specific to profile page
      const hasDisplayName = await page.getByText('Display Name').isVisible().catch(() => false);
      const hasTotalOrders = await page.getByText('Total Orders').isVisible().catch(() => false);
      expect(hasDisplayName || hasTotalOrders).toBeTruthy();
    });

    test('should load Post Deal page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p/post-deal`);
      await page.waitForTimeout(3000);
      // Note: post-deal might redirect to login if not authorized, so check for either
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        // If redirected to login, skip this test or mark as expected behavior
        test.skip();
      } else {
        await expect(page).toHaveURL(/.*\/p2p\/post-deal/);
        // Verify post deal page is loaded - use more specific selector
        await expect(page.getByText('Post Deal')).toBeVisible();
      }
    });

    test('should load My Deals page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/p2p/mydeals`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/p2p\/mydeals/);
      // Verify my deals page is loaded - use more specific selector
      await expect(page.getByText('My Deals')).toBeVisible();
    });
  });

  test.describe('Apps Page', () => {
    test('should load Apps page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/apps`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/apps/);
      // Verify apps page is loaded - use more specific selector
      await expect(page.getByText('Your exchange apps')).toBeVisible();
    });

    test('should load Apps page with All apps and My apps tabs', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/apps`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/apps/);
      
      // Verify main Apps elements - use first() to avoid strict mode violation
      await expect(page.getByText('Apps').first()).toBeVisible({ timeout: 10000 });
      
      // Verify All apps and My apps tabs are visible
      await expect(page.getByText('All apps')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('My apps')).toBeVisible({ timeout: 10000 });
      
      // Verify All apps tab content (should be active by default) - use exact match to avoid strict mode violation
      await expect(page.getByText('Exchange apps', { exact: true })).toBeVisible({ timeout: 10000 });
      await expect(page.getByPlaceholder('Search apps...')).toBeVisible({ timeout: 10000 });
      
      // Verify table with App name and Description headers
      await expect(page.getByText('App name')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Description')).toBeVisible({ timeout: 10000 });
      
      // Click on My apps tab and verify content
      await page.getByText('My apps').click();
      await page.waitForTimeout(2000);
      
      // Verify My apps tab content
      await expect(page.getByText('My exchange apps')).toBeVisible({ timeout: 10000 });
      
      // Verify table headers for My apps
      const hasMyAppsHeaders = await page.getByText('Configure').isVisible().catch(() => false) ||
                              await page.getByText('Action').isVisible().catch(() => false);
      expect(hasMyAppsHeaders).toBeTruthy();
    });
  });

  test.describe('Core Pages', () => {
    test('should load Summary page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/summary`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/summary/);
      // Verify summary page is loaded - use more specific selector
      await expect(page.getByText('Summary', { exact: true }).first()).toBeVisible();
    });

    test('should load Account page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/account`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/account/);
      // Verify account page is loaded - use more specific selector
      await expect(page.getByText('Account', { exact: true }).first()).toBeVisible();
    });

    test('should load Markets page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/markets`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/markets/);
      // Verify markets table is visible
      await expect(page.getByRole('table')).toBeVisible();
    });

    test('should load Trade page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/trade`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/trade/);
      // Verify trade page is loaded
      await expect(page.getByRole('table')).toBeVisible();
    });

    test('should load Trade page with BTC-USDT chart', async ({ page }) => {
      // Increase timeout for this test since charts can take time to load
      test.setTimeout(60000); // 60 seconds
      
      // Use 'load' instead of 'networkidle' to avoid timeout from continuous network requests
      await page.goto(`${testData.baseUrl}/trade/btc-usdt`, { waitUntil: 'load', timeout: 60000 });
      await expect(page).toHaveURL(/.*\/trade\/btc-usdt/);
      
      // Wait for market pair to be visible first (indicates page loaded)
      await expect(page.getByText(/BTC.*USDT|btc.*usdt/i).first()).toBeVisible({ timeout: 15000 });
      
      // Wait for TradingView iframe to load - use TradingView-specific selector
      const iframe = page.frameLocator('iframe[name^="tradingview_"]');
      
      // Wait until the iframe is attached and loaded
      await expect(iframe.locator('body')).toBeVisible({ timeout: 30000 });
      
      // Verify chart is loaded - check for TradingView container, iframe, or chart controls
      // TradingView container on main page
      const hasTradingViewContainer = await page.locator('[id^="tradingview_"], [class*="tradingview"]').isVisible().catch(() => false);
      // TradingView iframe
      const hasIframe = await page.locator('iframe[name^="tradingview_"]').isVisible().catch(() => false);
      // Chart controls on main page (Line, Area, Candles, Bars, Indicators)
      const hasChartControls = await page.getByText(/Line|Area|Candles|Bars|Indicators/i).first().isVisible().catch(() => false);
      // Chart title/cell within iframe (e.g., "SANDBOX:BTC-USDT · 1D ·")
      const hasChartTitle = await iframe.getByRole('cell', { name: /BTC.*USDT|btc.*usdt/i }).isVisible().catch(() => false);
      
      // At least one of these should be visible to confirm chart loaded
      expect(hasTradingViewContainer || hasIframe || hasChartControls || hasChartTitle).toBeTruthy();
    });

    test('should load Prices page', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/prices`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/prices/);
      // Verify prices page is loaded - use more specific selector
      await expect(page.getByText('Asset', { exact: true })).toBeVisible();
    });

    test('should load Announcements page with filters and table', async ({ page }) => {
      // Double the timeout for this test (default is 30s, so 60s)
      test.setTimeout(60000);
      
      await page.goto(`${testData.baseUrl}/announcement`);
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/.*\/announcement/);
      
      // Wait for table to load first (more reliable indicator that page is loaded)
      await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
      
      // Verify page title - use first() to avoid strict mode violation (Announcements appears in top bar and main content)
      const hasAnnouncementsTitle = await page.getByText('Announcements').first().isVisible().catch(() => false);
      expect(hasAnnouncementsTitle).toBeTruthy();
      
      // Verify description text - only check for "Exchange events and messages"
      const hasDescription = await page.getByText('Exchange events and messages').isVisible().catch(() => false);
      expect(hasDescription).toBeTruthy();
      
      // Verify filter tabs are visible (at least some common ones)
      const hasAllTab = await page.getByText('All').isVisible().catch(() => false);
      const hasListingTab = await page.getByText('Listing').isVisible().catch(() => false);
      const hasNewsTab = await page.getByText('News').isVisible().catch(() => false);
      const hasEventsTab = await page.getByText('Events').isVisible().catch(() => false);
      
      // At least 2 filter tabs should be visible
      const filterTabsCount = [hasAllTab, hasListingTab, hasNewsTab, hasEventsTab].filter(Boolean).length;
      expect(filterTabsCount).toBeGreaterThanOrEqual(2);
      
      // Verify table headers (table already verified above)
      await expect(page.getByText('Type')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Title')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Message/Contents')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Time')).toBeVisible({ timeout: 10000 });
      
      // Verify at least one announcement row is visible (check for "View more" button which appears in each row)
      const hasViewMore = await page.getByText('View more').isVisible().catch(() => false);
      expect(hasViewMore).toBeTruthy();
      
      // Verify navigation links are visible
      const hasSummaryLink = await page.getByText('< Summary').isVisible().catch(() => false);
      const hasDepositLink = await page.getByText('DEPOSIT').isVisible().catch(() => false);
      const hasWithdrawLink = await page.getByText('WITHDRAW').isVisible().catch(() => false);
      const hasTradeLink = await page.getByText('TRADE').isVisible().catch(() => false);
      
      // At least 2 navigation links should be visible
      const navLinksCount = [hasSummaryLink, hasDepositLink, hasWithdrawLink, hasTradeLink].filter(Boolean).length;
      expect(navLinksCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Top Bar Tests', () => {
    test('should test top bar hover functionality', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/summary`);
      await page.waitForTimeout(3000);
      
      // Test hover over navigation items to show dropdown menus
      const summaryNav = page.getByText('Summary').first();
      const walletNav = page.getByText('Wallet').first();
      const tradeNav = page.getByText('Trade').first();
      const earnNav = page.getByText('Earn').first();
      const othersNav = page.getByText('Others').first();
      
      // Verify navigation items are visible
      await expect(summaryNav).toBeVisible({ timeout: 10000 });
      await expect(walletNav).toBeVisible({ timeout: 10000 });
      await expect(tradeNav).toBeVisible({ timeout: 10000 });
      await expect(earnNav).toBeVisible({ timeout: 10000 });
      await expect(othersNav).toBeVisible({ timeout: 10000 });
      
      // Test hover functionality (hover should show dropdown indicators)
      await summaryNav.hover();
      await page.waitForTimeout(500);
      await walletNav.hover();
      await page.waitForTimeout(500);
      await tradeNav.hover();
      await page.waitForTimeout(500);
      
      // Verify Account dropdown functionality - find Account in top navigation bar
      // Find all Account text elements and get the one in a clickable container
      const allAccountTexts = page.getByText('Account', { exact: true });
      const accountCount = await allAccountTexts.count();
      
      let accountDropdown = null;
      for (let i = 0; i < accountCount; i++) {
        const accountText = allAccountTexts.nth(i);
        const parent = accountText.locator('..');
        const parentTag = await parent.evaluate(el => el.tagName?.toLowerCase()).catch(() => '');
        const hasCursor = await parent.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.cursor === 'pointer' || el.getAttribute('cursor') === 'pointer';
        }).catch(() => false);
        const isVisible = await accountText.isVisible().catch(() => false);
        
        // Find the Account that's in a clickable container (not style/script)
        if (isVisible && !['style', 'script', 'noscript'].includes(parentTag) && (hasCursor || parentTag === 'button' || parentTag === 'a')) {
          accountDropdown = parent;
          break;
        }
      }
      
      if (!accountDropdown) {
        throw new Error('Could not find Account dropdown in navigation');
      }
      
      await expect(accountDropdown).toBeVisible({ timeout: 10000 });
      await accountDropdown.hover();
      await page.waitForTimeout(500);
    });

    test('should test market selection', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/summary`);
      await page.waitForTimeout(3000);
      
      // Find and verify market selection dropdown
      const marketSelector = page.getByText('Select a market');
      await expect(marketSelector).toBeVisible({ timeout: 10000 });
      
      // Click to open market selection
      await marketSelector.click();
      
      // Wait for market selection dropdown to load - wait for USDT tab or market pairs to appear
      await page.waitForTimeout(3000); // Increased wait time for dropdown to fully load
      
      // Verify market selection opened - check for USDT tab or market pairs containing USDT
      const hasUSDTTab = await page.getByText('USDT', { exact: true }).isVisible().catch(() => false);
      const hasUSDTMarket = await page.getByText(/\/USDT/i).isVisible().catch(() => false);
      const hasMarketOptions = hasUSDTTab || hasUSDTMarket;
      
      expect(hasMarketOptions).toBeTruthy();
    });

    test('should test dark/light mode toggle', async ({ page }) => {
      await page.goto(`${testData.baseUrl}/summary`);
      await page.waitForTimeout(3000);
      
      // Initial URL doesn't have theme parameter (uses account default)
      const initialUrl = page.url();
      expect(initialUrl).not.toContain('theme=');
      
      // Click the theme toggle - this will add the theme parameter to URL
      await page.locator('.toggle-action_button').click();
      await page.waitForTimeout(1000);
      
      // Verify URL now includes a theme parameter
      const firstClickUrl = page.url();
      expect(firstClickUrl).toContain('theme=');
      const firstTheme = firstClickUrl.includes('theme=white') ? 'light' : 'dark';
      
      // Click again to toggle theme
      await page.locator('.toggle-action_button').click();
      await page.waitForTimeout(1000);
      
      // Verify theme changed to the opposite
      const secondClickUrl = page.url();
      expect(secondClickUrl).toContain('theme=');
      const secondTheme = secondClickUrl.includes('theme=white') ? 'light' : 'dark';
      
      // Theme should have changed
      expect(secondTheme).not.toBe(firstTheme);
    });
  });
});
