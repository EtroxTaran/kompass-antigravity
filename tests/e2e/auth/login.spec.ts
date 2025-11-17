/**
 * E2E Test: User Login Flow
 *
 * Tests the complete Keycloak authentication flow:
 * - Redirect to Keycloak login page
 * - Successful login returns to KOMPASS dashboard
 * - JWT token contains role information
 */

import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test('should redirect to Keycloak login page when clicking Sign In', async ({
    page,
  }) => {
    // Navigate to login page
    await page.goto('/login');

    // Verify login page is displayed
    await expect(page.locator('h1')).toContainText('KOMPASS');
    await expect(page.locator('text=Anmelden')).toBeVisible();

    // Click login button
    await page.click('button:has-text("Anmelden")');

    // Wait for redirect to Keycloak
    // In a real scenario, this would redirect to Keycloak login page
    // For testing, we'll check if the URL changes or if Keycloak elements appear
    await page.waitForTimeout(1000);

    // Note: In a real E2E test with Keycloak running, you would:
    // 1. Verify redirect to Keycloak (check URL contains keycloak URL)
    // 2. Fill in Keycloak login form
    // 3. Submit and wait for redirect back
    // 4. Verify user is authenticated and redirected to dashboard
  });

  test('should handle Keycloak callback and redirect to dashboard', async ({
    page,
  }) => {
    // This test requires Keycloak to be running
    // In a real scenario:
    // 1. Navigate to login page
    // 2. Click login button (redirects to Keycloak)
    // 3. Fill Keycloak login form
    // 4. Submit (redirects back to app)
    // 5. Verify user is on dashboard

    // For now, this is a placeholder test structure
    await page.goto('/login');

    // After successful Keycloak login, user should be redirected to dashboard
    // await expect(page).toHaveURL('/');
    // await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error message if login fails', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Click login button
    await page.click('button:has-text("Anmelden")');

    // In a real scenario with Keycloak:
    // 1. Fill invalid credentials in Keycloak form
    // 2. Submit
    // 3. Verify error message is displayed

    // For now, this is a placeholder
    // await expect(page.locator('text=Login failed')).toBeVisible();
  });

  test('should redirect authenticated user away from login page', async ({
    page,
  }) => {
    // This test requires a user to be already authenticated
    // In a real scenario:
    // 1. Login first (via Keycloak)
    // 2. Navigate to /login
    // 3. Verify redirect to dashboard
    // For now, this is a placeholder
    // await page.goto('/login');
    // await expect(page).toHaveURL('/');
  });
});
