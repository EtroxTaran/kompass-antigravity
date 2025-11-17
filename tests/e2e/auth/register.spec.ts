import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    await expect(page.locator('button:has-text("Registrieren")')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Submit empty form
    await page.click('button:has-text("Registrieren")');

    // Check for validation errors
    await expect(page.locator('text=/email/i')).toBeVisible();
    await expect(page.locator('text=/password/i')).toBeVisible();
    await expect(page.locator('text=/display.*name/i')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'ValidPassword123!');

    await page.click('button:has-text("Registrieren")');

    // Check for email validation error
    await expect(page.locator('text=/invalid.*email/i')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'Short1!');

    await page.click('button:has-text("Registrieren")');

    // Check for password length validation error
    await expect(page.locator('text=/password.*12.*characters/i')).toBeVisible();
  });

  test('should show validation error for weak password', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="displayName"]', 'Test User');
    // Password without uppercase, lowercase, number, and special character
    await page.fill('input[type="password"]', 'weakpassword123');

    await page.click('button:has-text("Registrieren")');

    // Check for password complexity validation error
    await expect(
      page.locator('text=/uppercase.*lowercase.*number.*special/i')
    ).toBeVisible();
  });

  test('should show validation error for short display name', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="displayName"]', 'A');
    await page.fill('input[type="password"]', 'ValidPassword123!');

    await page.click('button:has-text("Registrieren")');

    // Check for display name length validation error
    await expect(page.locator('text=/display.*name.*2.*characters/i')).toBeVisible();
  });

  test('should register new user successfully', async ({ page }) => {
    // Generate unique email for each test run
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!@#';
    const testDisplayName = 'Test User';

    // Fill registration form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', testDisplayName);
    await page.fill('input[type="password"]', testPassword);

    // Submit form
    await page.click('button:has-text("Registrieren")');

    // Wait for success message or redirect
    await expect(
      page.locator('text=/success|erfolgreich|registriert/i')
    ).toBeVisible({ timeout: 10000 });

    // Should redirect to login or dashboard
    await expect(page).toHaveURL(/\/login|\/dashboard|\//, { timeout: 10000 });
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Use admin email (should already exist)
    const existingEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';

    await page.fill('input[type="email"]', existingEmail);
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'TestPassword123!@#');

    await page.click('button:has-text("Registrieren")');

    // Check for duplicate email error
    await expect(
      page.locator('text=/already.*exists|bereits.*vorhanden|duplicate/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true);

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'TestPassword123!@#');

    await page.click('button:has-text("Registrieren")');

    // Should show network error message
    await expect(
      page.locator('text=/network|connection|offline|fehler/i')
    ).toBeVisible({ timeout: 5000 });

    // Go back online
    await context.setOffline(false);
  });

  test('should navigate to login page from registration', async ({ page }) => {
    // Look for login link
    const loginLink = page.locator('a:has-text("Anmelden"), a:has-text("Login")');

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });
});

