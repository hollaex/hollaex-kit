const fs = require('fs');
const path = require('path');
const testData = require('./test-data');

const SESSION_FILE = path.join(__dirname, '../../session-storage/auth-state.json');

/**
 * Save authentication state to file
 */
async function saveAuthState(context) {
  const authState = await context.storageState();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(authState, null, 2));
  console.log('✅ Authentication state saved to:', SESSION_FILE);
}

/**
 * Load authentication state from file
 */
function loadAuthState() {
  if (fs.existsSync(SESSION_FILE)) {
    const authState = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    console.log('✅ Authentication state loaded from:', SESSION_FILE);
    return authState;
  }
  return null;
}

/**
 * Check if valid session exists
 */
function hasValidSession() {
  if (!fs.existsSync(SESSION_FILE)) {
    return false;
  }
  
  try {
    const authState = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    // Check if session is not too old (24 hours)
    const stats = fs.statSync(SESSION_FILE);
    const now = new Date();
    const sessionAge = now - stats.mtime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return sessionAge < maxAge && authState.cookies && authState.cookies.length > 0;
  } catch (error) {
    console.log('❌ Invalid session file, will re-login');
    return false;
  }
}

/**
 * Login and save session if needed
 */
async function ensureAuthenticated(page, context) {
  const authState = loadAuthState();
  
  if (authState && hasValidSession()) {
    console.log('🔄 Using saved authentication state');
    console.log('📊 Session file age:', Math.round((Date.now() - fs.statSync(SESSION_FILE).mtime) / (1000 * 60)), 'minutes');
    await context.addCookies(authState.cookies);
    await context.addInitScript(() => {
      // Set localStorage/sessionStorage if needed
      if (authState.origins && authState.origins[0]) {
        const origin = authState.origins[0];
        if (origin.localStorage) {
          for (const item of origin.localStorage) {
            localStorage.setItem(item.name, item.value);
          }
        }
      }
    });
    
    // Navigate to account page first to verify session is still valid
    await page.goto(`${testData.baseUrl}/account`);
    
    // Check if we're actually logged in by looking for account-specific elements
    try {
      // Wait for page to load
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Check for account-specific indicators that we're logged in
      const isLoggedIn = await page.evaluate(() => {
        // Check for account-specific elements
        const hasAccountElements = document.querySelector('.account, [class*="account"], .user, [class*="user"], .profile, [class*="profile"]');
        const hasNavigationElements = document.querySelector('nav, .navigation, .menu, [class*="nav"]');
        const hasUserElements = document.querySelector('.user-menu, .user-info, [class*="user"]');
        
        // Check if we're not on login page
        const isNotLoginPage = !window.location.href.includes('/login');
        
        // Check for specific text content that indicates we're logged in
        const hasAccountText = document.body.textContent.includes('account') || 
                               document.body.textContent.includes('profile') || 
                               document.body.textContent.includes('user') ||
                               document.body.textContent.includes('wallet') ||
                               document.body.textContent.includes('balance');
        
        console.log('🔍 Account page validation check:', {
          hasAccountElements: !!hasAccountElements,
          hasNavigationElements: !!hasNavigationElements,
          hasUserElements: !!hasUserElements,
          hasAccountText,
          isNotLoginPage,
          currentUrl: window.location.href,
          pageTitle: document.title
        });
        
        // Require actual account content to be present
        return (hasAccountElements || hasNavigationElements || hasUserElements || hasAccountText) && isNotLoginPage;
      });
      
      if (isLoggedIn) {
        console.log('✅ Session is valid, skipping login');
        return true;
      } else {
        console.log('❌ Session expired, will re-login');
      }
    } catch (error) {
      console.log('❌ Session validation failed, will re-login');
    }
  }
  
  // Perform fresh login
  console.log('🔐 Performing fresh login...');
  await performLogin(page);
  
  // Save the new session
  await saveAuthState(context);
  return true;
}

/**
 * Perform the actual login process
 */
async function performLogin(page) {
  // Navigate to login page
  await page.goto(`${testData.baseUrl}/login`);
  
  // Wait for login form to be visible
  await page.getByRole('textbox', { name: 'Type your Email address' }).waitFor({ state: 'visible' });
  
  // Fill login form
  await page.getByRole('textbox', { name: 'Type your Email address' }).fill(testData.users.admin.email);
  await page.getByRole('textbox', { name: 'Type your password' }).fill(testData.users.admin.password);
  
  // Click login button
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for successful login
  try {
    await page.waitForURL('**/account', { timeout: 15000 });
  } catch (error) {
    // If account page doesn't load, check if we're redirected to dashboard or other page
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  }
  
  // Wait for any loading indicators to disappear
  await page.waitForFunction(() => {
    const loaders = document.querySelectorAll('.loader_background, .loader_wrapper, .ant-spin');
    return loaders.length === 0 || Array.from(loaders).every(loader => loader.style.display === 'none');
  }, { timeout: 10000 });
  
  console.log('✅ Login completed successfully');
}

/**
 * Clear saved session
 */
function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
    console.log('🗑️ Session cleared');
  }
}

module.exports = {
  saveAuthState,
  loadAuthState,
  hasValidSession,
  ensureAuthenticated,
  performLogin,
  clearSession
};
