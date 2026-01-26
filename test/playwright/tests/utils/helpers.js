const { expect } = require('@playwright/test');
const testData = require('./test-data');

class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  // Navigation helpers
  async gotoLogin() {
    await this.page.goto(`${testData.baseUrl}${testData.endpoints.login}`);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoSignup() {
    await this.page.goto(`${testData.baseUrl}${testData.endpoints.signup}`);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoMarkets() {
    await this.page.goto(`${testData.baseUrl}${testData.endpoints.markets}`);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoWallet() {
    await this.page.goto(`${testData.baseUrl}${testData.endpoints.wallet}`);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoAccount() {
    await this.page.goto(`${testData.baseUrl}${testData.endpoints.account}`);
    await this.page.waitForLoadState('networkidle');
  }

  // Authentication helpers
  async login(email, password) {
    // Fill email first
    await this.page.fill('[name="email"]', email);
    
    // Wait a bit for email validation
    await this.page.waitForTimeout(1000);
    
    // Fill password
    await this.page.fill('[name="password"]', password);
    
    // Wait a bit for password validation
    await this.page.waitForTimeout(1000);
    
    // Try to click the button with force option
    // The form validation might be client-side only
    await this.page.click('button[type="submit"]', { force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async loginWith2FA(email, password, twoFACode) {
    await this.login(email, password);
    await this.page.waitForSelector('.otp_form-wrapper', { timeout: 10000 });
    await this.page.fill('.masterInput', twoFACode);
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  // Form helpers
  async fillSignupForm(email, password, confirmPassword, referralCode = '') {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.fill('input[placeholder*="Retype your password"]', confirmPassword);
    if (referralCode) {
      await this.page.fill('input[placeholder*="Type your referral code"]', referralCode);
    }
    await this.page.check('input[type="checkbox"]');
  }

  async submitForm() {
    await this.page.click('button[type="submit"]', { force: true });
    await this.page.waitForLoadState('networkidle');
  }

  // Assertion helpers
  async expectErrorMessage(message) {
    await expect(this.page.locator('.field-error-text:first-of-type')).toContainText(message);
  }

  async expectSuccessMessage(message) {
    // Wait for the success message to appear and be visible
    await this.page.waitForSelector(`text=${message}`, { timeout: 10000 });
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }

  async expectToBeLoggedIn(username) {
    await expect(this.page.locator('[data-testid="user-menu"]')).toContainText(username);
  }

  async expectToBeOnPage(pagePath) {
    await expect(this.page).toHaveURL(new RegExp(pagePath));
  }

  // Trading helpers
  async selectMarket(market) {
    await this.page.click(`[data-testid="market-${market}"]`);
    await this.page.waitForLoadState('networkidle');
  }

  async placeBuyOrder(amount, price) {
    await this.page.fill('[data-testid="buy-amount"]', amount);
    await this.page.fill('[data-testid="buy-price"]', price);
    await this.page.click('[data-testid="buy-button"]');
  }

  async placeSellOrder(amount, price) {
    await this.page.fill('[data-testid="sell-amount"]', amount);
    await this.page.fill('[data-testid="sell-price"]', price);
    await this.page.click('[data-testid="sell-button"]');
  }

  async cancelAllOrders() {
    await this.page.click('[data-testid="cancel-all-orders"]');
    await this.page.waitForLoadState('networkidle');
  }

  // Wallet helpers
  async generateWallet(type) {
    await this.page.click(`[data-testid="generate-${type}-wallet"]`);
    await this.page.waitForLoadState('networkidle');
  }

  async getWalletAddress(type) {
    return await this.page.textContent(`[data-testid="${type}-wallet-address"]`);
  }

  // Performance helpers
  async measurePageLoadTime(startTime) {
    return Date.now() - startTime;
  }

  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  // Email helpers
  async generateTOTP(secret) {
    const totp = require('totp-generator');
    return totp(secret);
  }

  // Admin helpers
  async adminLogin() {
    await this.gotoLogin();
    await this.login(testData.users.admin.email, testData.users.admin.password);
  }

  async createUser(userData) {
    await this.page.goto('/admin/users/create');
    await this.page.fill('[name="email"]', userData.email);
    await this.page.fill('[name="password"]', userData.password);
    await this.page.fill('[name="password_confirmation"]', userData.password);
    await this.submitForm();
  }

  async searchUser(searchTerm) {
    await this.page.fill('[data-testid="user-search"]', searchTerm);
    await this.page.click('[data-testid="search-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  // Utility helpers
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async clearCookies() {
    await this.page.context().clearCookies();
  }

  async clearStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  // Error handling
  async handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    await this.takeScreenshot(`error-${context}-${Date.now()}`);
    throw error;
  }
}

module.exports = TestHelpers;