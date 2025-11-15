/**
 * E2E Test: Create Location
 *
 * Tests the complete flow of creating a new location for a customer
 * Validates RBAC permissions, form validation, and UI feedback
 */

import { test, expect } from '@playwright/test';

test.describe('Location Management - Create Location', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should create new location successfully', async ({ page }) => {
    // Navigate to customer detail page
    await page.goto('/customers/customer-123');
    await expect(page.locator('h1')).toContainText('Hofladen Müller GmbH');

    // Open Locations tab
    await page.click('button:has-text("Standorte")');

    // Click "New Location" button
    await page.click('button:has-text("Neuer Standort")');

    // Fill location form
    await page.fill('[name="locationName"]', 'Filiale München Süd');

    // Select location type
    await page.click('[name="locationType"]');
    await page.click('text=Filiale');

    // Fill delivery address
    await page.fill('[name="deliveryAddress.street"]', 'Lindwurmstraße');
    await page.fill('[name="deliveryAddress.streetNumber"]', '85');
    await page.fill('[name="deliveryAddress.zipCode"]', '80337');
    await page.fill('[name="deliveryAddress.city"]', 'München');

    // Fill optional fields
    await page.fill('[name="deliveryNotes"]', 'Hintereingang nutzen');
    await page.fill('[name="openingHours"]', 'Mo-Fr 8:00-18:00');

    // Submit form
    await page.click('button:has-text("Erstellen")');

    // Verify success toast
    await expect(page.locator('.toast-success')).toContainText(
      'Standort erfolgreich erstellt'
    );

    // Verify location appears in list
    await expect(page.locator('text=Filiale München Süd')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/customers/customer-123');
    await page.click('button:has-text("Standorte")');
    await page.click('button:has-text("Neuer Standort")');

    // Try to submit with empty location name
    await page.fill('[name="locationName"]', 'A'); // Too short
    await page.click('button:has-text("Erstellen")');

    // Verify validation error
    await expect(page.locator('text=mindestens 2 Zeichen')).toBeVisible();

    // Fix validation error
    await page.fill('[name="locationName"]', 'Test Filiale');

    // Try with invalid postal code
    await page.fill('[name="deliveryAddress.zipCode"]', '123'); // Too short
    await page.click('button:has-text("Erstellen")');

    await expect(page.locator('text=PLZ muss 5-stellig sein')).toBeVisible();
  });

  test('should prevent ADM from creating location for non-owned customer', async ({
    page,
  }) => {
    // Navigate to customer NOT owned by this ADM user
    await page.goto('/customers/customer-999');

    // Try to create location
    await page.click('button:has-text("Standorte")');
    await page.click('button:has-text("Neuer Standort")');

    await page.fill('[name="locationName"]', 'Unauthorized Location');
    await page.fill('[name="deliveryAddress.street"]', 'Test');
    await page.fill('[name="deliveryAddress.zipCode"]', '80331');
    await page.fill('[name="deliveryAddress.city"]', 'München');

    await page.click('button:has-text("Erstellen")');

    // Verify forbidden error
    await expect(page.locator('.toast-error')).toContainText(
      'Zugriff verweigert'
    );
  });

  test('should detect duplicate location name', async ({ page }) => {
    await page.goto('/customers/customer-123');
    await page.click('button:has-text("Standorte")');
    await page.click('button:has-text("Neuer Standort")');

    // Try to create location with existing name
    await page.fill('[name="locationName"]', 'Hauptstandort'); // Assume this exists
    await page.fill('[name="deliveryAddress.street"]', 'Test');
    await page.fill('[name="deliveryAddress.zipCode"]', '80331');
    await page.fill('[name="deliveryAddress.city"]', 'München');

    await page.click('button:has-text("Erstellen")');

    // Verify conflict error
    await expect(page.locator('.toast-error')).toContainText(
      'bereits vorhanden'
    );
  });
});
