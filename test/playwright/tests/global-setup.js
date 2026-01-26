const { chromium } = require('@playwright/test');
const testData = require('./utils/test-data');
const path = require('path');
const fs = require('fs');

/**
 * Global setup to authenticate once and save the session state
 * This avoids logging in for every test
 */
async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto(`${testData.baseUrl}/login`);
    
    // Wait for login form
    await page.getByRole('textbox', { name: 'Type your Email address' }).waitFor({ state: 'visible' });
    
    // Fill login form with admin credentials
    const adminUser = testData.users.admin;
    await page.getByRole('textbox', { name: 'Type your Email address' }).fill(adminUser.email);
    await page.getByRole('textbox', { name: 'Type your password' }).fill(adminUser.password);
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for successful login
    try {
      await page.waitForURL('**/account', { timeout: 15000 });
    } catch (error) {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        throw new Error('Login failed - still on login page');
      }
    }
    
    // Verify login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      throw new Error('Login failed - redirected back to login page');
    }
    
    // Wait for any loaders to disappear
    await page.waitForFunction(() => {
      const loaders = document.querySelectorAll('.loader_background, .loader_wrapper, .ant-spin');
      return loaders.length === 0 || Array.from(loaders).every(loader => loader.style.display === 'none');
    }, { timeout: 10000 }).catch(() => {
      // Ignore timeout if loaders don't disappear
    });
    
    // Save authentication state
    const storageStatePath = path.join(__dirname, '../.auth/admin.json');
    const storageStateDir = path.dirname(storageStatePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(storageStateDir)) {
      fs.mkdirSync(storageStateDir, { recursive: true });
    }
    
    await context.storageState({ path: storageStatePath });
    console.log('✅ Authentication state saved successfully');
    
  } catch (error) {
    console.error('❌ Failed to save authentication state:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;

