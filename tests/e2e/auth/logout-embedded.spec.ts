/**
 * E2E Test: Logout Flow
 *
 * Tests the logout functionality:
 * - User can logout from authenticated state
 * - Logout clears session and tokens
 * - User is redirected to login page
 * - User cannot access protected routes after logout
 */

import { test, expect } from '@playwright/test';

test.describe('Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123';

    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button:has-text("Anmelden")');

    // Wait for login to complete
    await expect(page).toHaveURL(/\/dashboard|\//, { timeout: 10000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Find and click logout button
    // The exact selector depends on your UI implementation
    // Common patterns: button with text "Abmelden", user menu > logout, etc.
    const logoutButton = page
      .locator('button:has-text("Abmelden")')
      .or(page.locator('[aria-label*="logout" i]'))
      .or(page.locator('[aria-label*="abmelden" i]'));

    // If logout is in a menu, open menu first
    const userMenu = page
      .locator('[aria-label*="user menu" i]')
      .or(page.locator('button[aria-haspopup="menu"]'));

    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500); // Wait for menu to open
    }

    // Click logout
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Fallback: try to find any logout link/button
      await page.click('text=/logout|abmelden/i');
    }

    // Should be redirected to login page
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('should clear session after logout', async ({ page }) => {
    // Logout
    const logoutButton = page
      .locator('button:has-text("Abmelden")')
      .or(page.locator('[aria-label*="logout" i]'));

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      await page.click('text=/logout|abmelden/i');
    }

    // Wait for redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });

    // Try to access protected route
    await page.goto('/dashboard');

    // Should be redirected back to login (not authenticated)
    await expect(page).toHaveURL('/login');
  });

  test('should require login after logout to access protected routes', async ({
    page,
  }) => {
    // Logout
    const logoutButton = page
      .locator('button:has-text("Abmelden")')
      .or(page.locator('[aria-label*="logout" i]'));

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      await page.click('text=/logout|abmelden/i');
    }

    // Wait for redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });

    // Try to access user management (requires authentication)
    await page.goto('/admin');

    // Should be redirected to login
    await expect(page).toHaveURL('/login');
  });
});
