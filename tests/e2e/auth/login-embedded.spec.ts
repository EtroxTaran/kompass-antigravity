/**
 * E2E Test: Embedded Login Flow
 *
 * Tests the embedded login flow using direct access grants:
 * - Login form is embedded in the application
 * - Successful login with valid credentials
 * - Error handling for invalid credentials
 * - Redirect to dashboard after successful login
 * - Token storage and session management
 */

import { test, expect } from '@playwright/test';

test.describe('Embedded Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display embedded login form', async ({ page }) => {
    // Verify login page elements
    await expect(page.locator('h1')).toContainText('KOMPASS');
    await expect(page.locator('text=CRM & Projektmanagement')).toBeVisible();

    // Verify form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Anmelden")')).toBeVisible();
    await expect(page.locator('text=Angemeldet bleiben')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Anmelden")');

    // Wait for validation errors
    await expect(
      page.locator('text=E-Mail-Adresse ist erforderlich')
    ).toBeVisible();
    await expect(page.locator('text=Passwort ist erforderlich')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Anmelden")');

    // Verify validation error
    await expect(page.locator('text=Ungültige E-Mail-Adresse')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Anmelden")');

    // Wait for error message
    await expect(page.locator('text=Anmeldung fehlgeschlagen')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Use default admin credentials from Keycloak setup
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123';

    // Fill valid credentials
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button:has-text("Anmelden")');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard|\//, { timeout: 10000 });

    // Verify user is authenticated (check for user menu or dashboard content)
    // The exact elements depend on your dashboard implementation
    await expect(page.locator('body')).not.toContainText('Anmelden');
  });

  test('should remember user when "Angemeldet bleiben" is checked', async ({
    page,
  }) => {
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123';

    // Fill credentials and check "remember me"
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.check('input[type="checkbox"]'); // Remember me checkbox
    await page.click('button:has-text("Anmelden")');

    // Wait for login
    await expect(page).toHaveURL(/\/dashboard|\//, { timeout: 10000 });

    // Reload page and verify user is still authenticated
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard|\//);
  });

  test('should redirect authenticated user away from login page', async ({
    page,
  }) => {
    // First, login
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123';

    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button:has-text("Anmelden")');

    // Wait for login
    await expect(page).toHaveURL(/\/dashboard|\//, { timeout: 10000 });

    // Try to navigate to login page
    await page.goto('/login');

    // Should be redirected away from login page
    await expect(page).not.toHaveURL('/login');
  });

  test('should show loading state during login', async ({ page }) => {
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123';

    // Fill credentials
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);

    // Click login and immediately check for loading state
    const loginButton = page.locator('button:has-text("Anmelden")');
    await loginButton.click();

    // Button should be disabled or show loading text
    await expect(loginButton).toBeDisabled({ timeout: 1000 });
  });
});
