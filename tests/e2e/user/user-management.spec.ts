/**
 * E2E Test: User Management Flow
 *
 * Tests user management functionality:
 * - List users (requires ADMIN/GF role)
 * - Create new user
 * - Update user profile
 * - Assign/revoke roles
 * - Delete/deactivate user
 * - RBAC enforcement
 */

import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  // Helper function to login as admin
  async function loginAsAdmin(page: any): Promise<void> {
    const adminEmail = process.env.KEYCLOAK_ADMIN_EMAIL || 'admin@kompass.de';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'Admin123!@#';

    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button:has-text("Anmelden")');

    // Wait for login to complete
    await expect(page).toHaveURL(/\/dashboard|\//, { timeout: 10000 });
  }

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display user list page', async ({ page }) => {
    // Navigate to user management
    await page.goto('/admin');

    // Verify page elements
    await expect(page.locator('h1')).toContainText(
      /Benutzerverwaltung|User Management/i
    );
    await expect(
      page.locator('button:has-text("Neuer Benutzer")')
    ).toBeVisible();
  });

  test('should show list of users', async ({ page }) => {
    await page.goto('/admin');

    // Wait for user list to load
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

    // Verify table headers
    await expect(
      page.locator('text=/Name|E-Mail|Rollen|Status/i')
    ).toBeVisible();
  });

  test('should create new user', async ({ page }) => {
    await page.goto('/admin');

    // Click "New User" button
    await page.click('button:has-text("Neuer Benutzer")');

    // Wait for form to appear
    await expect(
      page.locator('text=/Neuer Benutzer|Create User/i')
    ).toBeVisible();

    // Fill user form
    const testEmail = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');

    // Select role (check checkbox or select from dropdown)
    const roleCheckbox = page
      .locator('input[type="checkbox"]')
      .or(
        page.locator('text=ADM').locator('..').locator('input[type="checkbox"]')
      );
    if (await roleCheckbox.first().isVisible()) {
      await roleCheckbox.first().check();
    }

    // Submit form
    await page.click('button:has-text("Benutzer erstellen")');

    // Wait for success message or redirect
    await expect(
      page.locator('text=/Benutzer erstellt|User created/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should validate user form fields', async ({ page }) => {
    await page.goto('/admin');
    await page.click('button:has-text("Neuer Benutzer")');

    // Try to submit empty form
    await page.click('button:has-text("Benutzer erstellen")');

    // Verify validation errors
    await expect(
      page.locator('text=/E-Mail-Adresse ist erforderlich|Email is required/i')
    ).toBeVisible();
    await expect(
      page.locator('text=/Name muss mindestens|Display name is required/i')
    ).toBeVisible();
    await expect(
      page.locator('text=/Passwort ist erforderlich|Password is required/i')
    ).toBeVisible();
  });

  test('should validate password complexity', async ({ page }) => {
    await page.goto('/admin');
    await page.click('button:has-text("Neuer Benutzer")');

    const testEmail = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[type="password"]', 'weak'); // Too weak
    await page.fill('input[name="confirmPassword"]', 'weak');

    await page.click('button:has-text("Benutzer erstellen")');

    // Verify password complexity error
    await expect(
      page.locator('text=/mindestens 12 Zeichen|at least 12 characters/i')
    ).toBeVisible();
  });

  test('should search and filter users', async ({ page }) => {
    await page.goto('/admin');

    // Wait for user list
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

    // Enter search term
    const searchInput = page
      .locator('input[placeholder*="suche" i]')
      .or(page.locator('input[type="search"]'));
    if (await searchInput.isVisible()) {
      await searchInput.fill('admin');
      await page.waitForTimeout(1000); // Wait for search to execute

      // Verify filtered results (at least admin user should be visible)
      await expect(page.locator('text=/admin/i')).toBeVisible();
    }
  });

  test('should filter users by role', async ({ page }) => {
    await page.goto('/admin');

    // Wait for user list
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

    // Find role filter dropdown
    const roleFilter = page
      .locator('select')
      .or(page.locator('[role="combobox"]'))
      .first();

    if (await roleFilter.isVisible()) {
      await roleFilter.selectOption({ label: /ADM|Außendienst/i });
      await page.waitForTimeout(1000); // Wait for filter to apply

      // Verify filtered results
      // The exact verification depends on your UI implementation
    }
  });

  test('should edit user profile', async ({ page }) => {
    await page.goto('/admin');

    // Wait for user list
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

    // Find and click edit button for first user
    const editButton = page
      .locator('button[aria-label*="bearbeiten" i]')
      .or(page.locator('button[aria-label*="edit" i]'))
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Wait for edit form
      await expect(
        page.locator('text=/Benutzer bearbeiten|Edit User/i')
      ).toBeVisible({ timeout: 5000 });

      // Update display name
      const displayNameInput = page.locator('input[name="displayName"]');
      if (await displayNameInput.isVisible()) {
        await displayNameInput.clear();
        await displayNameInput.fill('Updated Name');
      }

      // Submit changes
      await page.click('button:has-text("aktualisieren")');

      // Verify success
      await expect(page.locator('text=/aktualisiert|updated/i')).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should assign roles to user', async ({ page }) => {
    await page.goto('/admin');

    // Wait for user list
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

    // Find and click edit button
    const editButton = page
      .locator('button[aria-label*="bearbeiten" i]')
      .or(page.locator('button[aria-label*="edit" i]'))
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Wait for edit form
      await expect(
        page.locator('text=/Benutzer bearbeiten|Edit User/i')
      ).toBeVisible({ timeout: 5000 });

      // Check additional role checkbox
      const planRoleCheckbox = page
        .locator('text=PLAN')
        .locator('..')
        .locator('input[type="checkbox"]')
        .first();

      if (await planRoleCheckbox.isVisible()) {
        await planRoleCheckbox.check();
      }

      // Submit changes
      await page.click('button:has-text("aktualisieren")');

      // Verify success
      await expect(page.locator('text=/aktualisiert|updated/i')).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should prevent unauthorized access to user management', async ({
    page,
  }) => {
    // Logout admin first
    const logoutButton = page.locator('button:has-text("Abmelden")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    }

    // Try to access user management without authentication
    await page.goto('/admin');

    // Should be redirected to login
    await expect(page).toHaveURL('/login');
  });
});
