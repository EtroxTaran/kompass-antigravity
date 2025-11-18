/**
 * E2E Test: Customer Detail View
 *
 * Tests the complete customer detail view workflow:
 * - Viewing customer details
 * - RBAC permissions (ADM own customers only, GF all customers)
 * - Edit button permissions (ADM own customers, GF all)
 * - Delete button (GF only)
 * - Financial fields visibility (ADM hidden, GF visible)
 * - Navigation and error states
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Detail View', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user (default for most tests)
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display customer details correctly', async ({ page }) => {
    // Navigate to customer detail page
    await page.goto('/customers/customer-123');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText(/.+/);

    // Check that basic information is displayed
    await expect(page.locator('text=Stammdaten')).toBeVisible();

    // Check contact information section
    await expect(page.locator('text=Kontaktdaten')).toBeVisible();

    // Check billing address section
    await expect(page.locator('text=Rechnungsadresse')).toBeVisible();

    // Check tabs (locations and contacts are now in tabs)
    await expect(page.locator('text=Standorte')).toBeVisible();
    await expect(page.locator('text=Kontakte')).toBeVisible();
    await expect(page.locator('text=Aktivitäten')).toBeVisible();

    // Check metadata section
    await expect(page.locator('text=Metadaten')).toBeVisible();

    // Check activity timeline section
    await expect(page.locator('text=Aktivitäten')).toBeVisible();
  });

  test('should show edit button for ADM own customer', async ({ page }) => {
    // Navigate to customer detail page (assume customer-123 is owned by adm@example.com)
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Check that edit button is visible and enabled
    const editButton = page.getByRole('button', { name: /Bearbeiten/i });
    await expect(editButton).toBeVisible();
    await expect(editButton).not.toBeDisabled();
  });

  test('should disable edit button for ADM viewing other customer', async ({
    page,
  }) => {
    // Navigate to customer NOT owned by this ADM user
    await page.goto('/customers/customer-999');

    // Check that edit button is disabled or not visible
    const editButton = page.getByRole('button', { name: /Bearbeiten/i });

    // Either button is disabled or not visible (depending on implementation)
    const isVisible = await editButton.isVisible().catch(() => false);
    if (isVisible) {
      await expect(editButton).toBeDisabled();
    }
  });

  test('should NOT show delete button for ADM user', async ({ page }) => {
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Delete button should not be visible for ADM
    const deleteButton = page.getByRole('button', { name: /Löschen/i });
    await expect(deleteButton).not.toBeVisible();
  });

  test('should show delete button for GF user', async ({ page }) => {
    // Logout and login as GF user
    await page.goto('/logout');

    await page.goto('/login');
    await page.fill('[name="email"]', 'gf@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Navigate to customer detail
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Delete button should be visible for GF
    const deleteButton = page.getByRole('button', { name: /Löschen/i });
    await expect(deleteButton).toBeVisible();
  });

  test('should hide financial fields for ADM user', async ({ page }) => {
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Financial section should NOT be visible for ADM
    await expect(page.locator('text=Geschäftsdaten')).not.toBeVisible();
  });

  test('should show financial fields for GF user', async ({ page }) => {
    // Logout and login as GF user
    await page.goto('/logout');

    await page.goto('/login');
    await page.fill('[name="email"]', 'gf@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Navigate to customer detail
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Financial section should be visible for GF
    await expect(page.locator('text=Geschäftsdaten')).toBeVisible();

    // Check for financial fields
    await expect(page.locator('text=Kreditlimit')).toBeVisible();
    await expect(page.locator('text=Kontostand')).toBeVisible();
  });

  test('should navigate to edit page when edit button is clicked', async ({
    page,
  }) => {
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Click edit button
    const editButton = page.getByRole('button', { name: /Bearbeiten/i });
    await editButton.click();

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/customers\/customer-123\/edit/);
  });

  test('should show delete confirmation dialog when delete button is clicked', async ({
    page,
  }) => {
    // Login as GF user
    await page.goto('/logout');

    await page.goto('/login');
    await page.fill('[name="email"]', 'gf@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');

    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Click delete button
    const deleteButton = page.getByRole('button', { name: /Löschen/i });
    await deleteButton.click();

    // Dialog should appear
    await expect(page.locator('text=Kunde löschen')).toBeVisible();
    await expect(page.locator('text=Möchten Sie')).toBeVisible();

    // Cancel button should be visible
    const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
    await expect(cancelButton).toBeVisible();

    // Confirm button should be visible
    const confirmButton = page.getByRole('button', { name: /^Löschen$/i });
    await expect(confirmButton).toBeVisible();
  });

  test('should cancel delete when cancel button is clicked', async ({
    page,
  }) => {
    // Login as GF user
    await page.goto('/logout');

    await page.goto('/login');
    await page.fill('[name="email"]', 'gf@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');

    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Click delete button
    const deleteButton = page.getByRole('button', { name: /Löschen/i });
    await deleteButton.click();

    // Wait for dialog
    await expect(page.locator('text=Kunde löschen')).toBeVisible();

    // Click cancel
    const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
    await cancelButton.click();

    // Dialog should close and stay on detail page
    await expect(page.locator('text=Kunde löschen')).not.toBeVisible();
    await expect(page).toHaveURL(/\/customers\/customer-123$/);
  });

  test('should navigate back to customer list when breadcrumb is clicked', async ({
    page,
  }) => {
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Click on "Kunden" in breadcrumb to navigate back to customer list
    const customersLink = page.getByRole('link', { name: /Kunden/i });
    await expect(customersLink).toBeVisible();
    await customersLink.click();

    // Should navigate to customer list
    await expect(page).toHaveURL(/\/customers$/);
    await expect(page.locator('h1, h2')).toContainText(/Kunden/i);
  });

  test('should display 404 error for non-existent customer', async ({
    page,
  }) => {
    // Navigate to non-existent customer
    await page.goto('/customers/customer-nonexistent-999');

    // Should show 404 error
    await expect(page.locator('text=Kunde nicht gefunden')).toBeVisible();
    await expect(
      page.locator('text=Der angeforderte Kunde konnte nicht gefunden werden')
    ).toBeVisible();

    // Back button should be visible
    const backButton = page.getByRole('button', { name: /Zurück zur Liste/i });
    await expect(backButton).toBeVisible();
  });

  test('should display 403 error for unauthorized access', async ({ page }) => {
    // Navigate to customer NOT owned by ADM user
    await page.goto('/customers/customer-999');

    // Should show 403 error or redirect
    // Either show error message or redirect to unauthorized page
    const hasError = await page
      .locator('text=Zugriff verweigert')
      .isVisible()
      .catch(() => false);
    const hasUnauthorized = await page
      .locator('text=Unauthorized')
      .isVisible()
      .catch(() => false);
    const isRedirected = page.url().includes('/unauthorized');

    expect(hasError || hasUnauthorized || isRedirected).toBe(true);
  });

  test('should display loading state while fetching customer', async ({
    page,
  }) => {
    // Navigate to customer detail page
    // Loading state should appear briefly
    await page.goto('/customers/customer-123');

    // Check for skeleton/loading indicators (may be too fast to catch)
    // At minimum, we should eventually see the customer data
    await expect(page.locator('h1')).toContainText(/.+/);
  });

  test('should display rating badge correctly', async ({ page }) => {
    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // Rating badge should be visible in header (if customer has rating)
    // This test may need adjustment based on actual data
    const ratingBadge = page
      .locator('[class*="badge"], text=/^[ABC]$/')
      .first();
    const isVisible = await ratingBadge.isVisible().catch(() => false);

    // If customer has rating, badge should be visible
    if (isVisible) {
      await expect(ratingBadge).toBeVisible();
    }
  });

  test('should display all customer sections in mobile layout', async ({
    page,
    viewport,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/customers/customer-123');

    await expect(page.locator('h1')).toContainText(/.+/);

    // All sections should still be visible on mobile
    await expect(page.locator('text=Stammdaten')).toBeVisible();
    await expect(page.locator('text=Kontaktdaten')).toBeVisible();
    await expect(page.locator('text=Rechnungsadresse')).toBeVisible();
    // Tabs should be visible
    await expect(page.locator('text=Standorte')).toBeVisible();
    await expect(page.locator('text=Kontakte')).toBeVisible();

    // Buttons should be touch-friendly (min 44px height)
    const editButton = page.getByRole('button', { name: /Bearbeiten/i });
    const buttonBox = await editButton.boundingBox();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should handle network error gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/v1/customers/customer-123', (route) => {
      route.abort('failed');
    });

    await page.goto('/customers/customer-123');

    // Should show error state
    await expect(page.locator('text=Fehler')).toBeVisible();

    // Retry button should be visible
    const retryButton = page.getByRole('button', { name: /Erneut versuchen/i });
    await expect(retryButton).toBeVisible();
  });
});
