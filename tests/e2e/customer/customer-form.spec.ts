/**
 * E2E Test: Customer Create/Edit Form
 *
 * Tests the complete customer form functionality:
 * - Create new customer
 * - Edit existing customer
 * - Form validation
 * - Unsaved changes confirmation
 * - RBAC field visibility (financial fields)
 * - Navigation and routing
 * - Success/error handling
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Form', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  describe('Create Customer', () => {
    test('should navigate to create customer form', async ({ page }) => {
      await page.goto('/customers');
      await expect(page.locator('h1')).toContainText(/Kunden/i);

      // Click "New Customer" button
      const newCustomerButton = page.getByRole('button', {
        name: /Neuer Kunde/i,
      });
      await expect(newCustomerButton).toBeVisible();
      await newCustomerButton.click();

      // Should navigate to create form
      await expect(page).toHaveURL(/\/customers\/new/);
      await expect(page.locator('h1')).toContainText(/Neuer Kunde/i);
    });

    test('should create new customer with valid data', async ({ page }) => {
      await page.goto('/customers/new');

      // Fill required fields
      await page.fill('[name="companyName"]', 'E2E Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      // Fill optional fields
      await page.fill('[name="vatNumber"]', 'DE999999999');
      await page.fill('[name="email"]', 'test@e2e.de');
      await page.fill('[name="phone"]', '+49-89-1234567');

      // Submit form
      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Should navigate to customer detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);
      await expect(page.locator('h1')).toContainText('E2E Test GmbH');

      // Should show success toast
      await expect(page.locator('text=/Kunde erstellt/i')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/customers/new');

      // Try to submit without filling required fields
      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Should show validation errors
      await expect(
        page.locator('text=/Firmenname muss mindestens 2 Zeichen lang sein/i')
      ).toBeVisible();
      await expect(
        page.locator('text=/Straße muss mindestens 2 Zeichen lang sein/i')
      ).toBeVisible();
    });

    test('should validate VAT number format', async ({ page }) => {
      await page.goto('/customers/new');

      // Fill required fields
      await page.fill('[name="companyName"]', 'Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      // Invalid VAT number
      await page.fill('[name="vatNumber"]', 'INVALID');

      // Submit form
      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Should show validation error
      await expect(
        page.locator(
          'text=/Umsatzsteuer-ID muss das Format DE123456789 haben/i'
        )
      ).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/customers/new');

      // Fill required fields
      await page.fill('[name="companyName"]', 'Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      // Invalid email
      await page.fill('[name="email"]', 'invalid-email');

      // Submit form
      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Should show validation error
      await expect(
        page.locator('text=/Ungültiges E-Mail-Format/i')
      ).toBeVisible();
    });

    test('should validate ZIP code format', async ({ page }) => {
      await page.goto('/customers/new');

      // Fill required fields
      await page.fill('[name="companyName"]', 'Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');

      // Invalid ZIP code (not 5 digits)
      await page.fill('[name="billingAddress.zipCode"]', '123');

      // Submit form
      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Should show validation error
      await expect(
        page.locator('text=/Postleitzahl muss 5 Ziffern haben/i')
      ).toBeVisible();
    });
  });

  describe('Edit Customer', () => {
    test('should navigate to edit customer form', async ({ page }) => {
      // First, create a customer (or navigate to existing one)
      await page.goto('/customers/new');

      // Fill and submit form
      await page.fill('[name="companyName"]', 'Edit Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Wait for navigation to detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Click edit button
      const editButton = page.getByRole('button', { name: /Bearbeiten/i });
      await expect(editButton).toBeVisible();
      await editButton.click();

      // Should navigate to edit form
      await expect(page).toHaveURL(/\/customers\/customer-.*\/edit/);
      await expect(page.locator('h1')).toContainText(/Kunde bearbeiten/i);
    });

    test('should load existing customer data in edit form', async ({
      page,
    }) => {
      // Create a customer first
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Load Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE888888888');
      await page.fill('[name="email"]', 'load@test.de');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Wait for detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Navigate to edit form
      const editButton = page.getByRole('button', { name: /Bearbeiten/i });
      await editButton.click();

      // Should have form fields pre-filled
      await expect(page.locator('[name="companyName"]')).toHaveValue(
        'Load Test GmbH'
      );
      await expect(page.locator('[name="vatNumber"]')).toHaveValue(
        'DE888888888'
      );
      await expect(page.locator('[name="email"]')).toHaveValue('load@test.de');
    });

    test('should update customer with valid data', async ({ page }) => {
      // Create a customer first
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Update Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Wait for detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Navigate to edit form
      const editButton = page.getByRole('button', { name: /Bearbeiten/i });
      await editButton.click();

      // Update company name
      await page.fill('[name="companyName"]', 'Updated Test GmbH');

      // Submit form
      const updateButton = page.getByRole('button', { name: /Aktualisieren/i });
      await updateButton.click();

      // Should navigate back to detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);
      await expect(page.locator('h1')).toContainText('Updated Test GmbH');

      // Should show success toast
      await expect(page.locator('text=/Kunde aktualisiert/i')).toBeVisible({
        timeout: 5000,
      });
    });
  });

  describe('Unsaved Changes', () => {
    test('should show confirmation dialog when canceling with unsaved changes', async ({
      page,
    }) => {
      await page.goto('/customers/new');

      // Make a change
      await page.fill('[name="companyName"]', 'Test');

      // Click cancel
      const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
      await cancelButton.click();

      // Should show confirmation dialog
      await expect(
        page.locator('text=/Ungespeicherte Änderungen/i')
      ).toBeVisible();
      await expect(
        page.locator('text=/Sie haben ungespeicherte Änderungen/i')
      ).toBeVisible();
    });

    test('should not show confirmation dialog when canceling without changes', async ({
      page,
    }) => {
      await page.goto('/customers/new');

      // Click cancel without making changes
      const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
      await cancelButton.click();

      // Should navigate back without confirmation
      await expect(page).toHaveURL(/\/customers/);
      await expect(
        page.locator('text=/Ungespeicherte Änderungen/i')
      ).not.toBeVisible();
    });

    test('should discard changes when confirming cancel', async ({ page }) => {
      await page.goto('/customers/new');

      // Make a change
      await page.fill('[name="companyName"]', 'Test');

      // Click cancel
      const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
      await cancelButton.click();

      // Confirm cancel
      await expect(
        page.locator('text=/Ungespeicherte Änderungen/i')
      ).toBeVisible();

      const confirmButton = page.getByRole('button', {
        name: /Abbrechen und Änderungen verwerfen/i,
      });
      await confirmButton.click();

      // Should navigate back
      await expect(page).toHaveURL(/\/customers/);
    });

    test('should return to form when canceling confirmation', async ({
      page,
    }) => {
      await page.goto('/customers/new');

      // Make a change
      await page.fill('[name="companyName"]', 'Test');

      // Click cancel
      const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
      await cancelButton.click();

      // Cancel the confirmation dialog
      await expect(
        page.locator('text=/Ungespeicherte Änderungen/i')
      ).toBeVisible();

      const backButton = page.getByRole('button', {
        name: /Zurück zum Formular/i,
      });
      await backButton.click();

      // Should still be on form page
      await expect(page).toHaveURL(/\/customers\/new/);
      await expect(
        page.locator('text=/Ungespeicherte Änderungen/i')
      ).not.toBeVisible();
    });
  });

  describe('RBAC Field Visibility', () => {
    test('should hide financial fields for ADM role', async ({ page }) => {
      await page.goto('/customers/new');

      // Financial fields should not be visible
      await expect(page.locator('text=Finanzdaten')).not.toBeVisible();
      await expect(page.locator('text=Kreditlimit')).not.toBeVisible();
      await expect(page.locator('text=Zahlungsbedingungen')).not.toBeVisible();
    });

    test('should show financial fields for BUCH role', async ({ page }) => {
      // Login as BUCH user
      await page.goto('/login');
      await page.fill('[name="email"]', 'buch@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      await page.goto('/customers/new');

      // Financial fields should be visible
      await expect(page.locator('text=Finanzdaten')).toBeVisible();
      await expect(page.locator('text=Kreditlimit')).toBeVisible();
      await expect(page.locator('text=Zahlungsbedingungen')).toBeVisible();
    });

    test('should show financial fields for GF role', async ({ page }) => {
      // Login as GF user
      await page.goto('/login');
      await page.fill('[name="email"]', 'gf@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      await page.goto('/customers/new');

      // Financial fields should be visible
      await expect(page.locator('text=Finanzdaten')).toBeVisible();
      await expect(page.locator('text=Kreditlimit')).toBeVisible();
      await expect(page.locator('text=Zahlungsbedingungen')).toBeVisible();
    });
  });

  describe('Navigation', () => {
    test('should navigate back to list from create form', async ({ page }) => {
      await page.goto('/customers/new');

      // Click back button
      const backButton = page.getByRole('button', { name: /Zurück/i });
      await backButton.click();

      // Should navigate to customer list
      await expect(page).toHaveURL(/\/customers/);
    });

    test('should navigate back to detail from edit form', async ({ page }) => {
      // Create a customer first
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Nav Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Wait for detail page
      await expect(page).toHaveURL(/\/customers\/customer-/);
      const detailUrl = page.url();

      // Navigate to edit form
      const editButton = page.getByRole('button', { name: /Bearbeiten/i });
      await editButton.click();

      // Click back button
      const backButton = page.getByRole('button', { name: /Zurück/i });
      await backButton.click();

      // Should navigate back to detail page
      await expect(page).toHaveURL(detailUrl);
    });
  });

  describe('Form Sections', () => {
    test('should render all form sections', async ({ page }) => {
      await page.goto('/customers/new');

      // Check all sections are visible
      await expect(page.locator('text=Grunddaten')).toBeVisible();
      await expect(page.locator('text=Rechnungsadresse')).toBeVisible();
      await expect(page.locator('text=Kontaktinformationen')).toBeVisible();
      await expect(page.locator('text=Weitere Informationen')).toBeVisible();
    });

    test('should allow selecting customer type', async ({ page }) => {
      await page.goto('/customers/new');

      // Click customer type select
      const customerTypeSelect = page.getByText(/Kundentyp auswählen/i);
      await customerTypeSelect.click();

      // Should show all options
      await expect(page.locator('text=Aktiv')).toBeVisible();
      await expect(page.locator('text=Interessent')).toBeVisible();
      await expect(page.locator('text=Inaktiv')).toBeVisible();
      await expect(page.locator('text=Archiviert')).toBeVisible();
    });

    test('should allow selecting rating', async ({ page }) => {
      await page.goto('/customers/new');

      // Click rating select
      const ratingSelect = page.getByText(/Bewertung auswählen/i);
      await ratingSelect.click();

      // Should show all options
      await expect(page.locator('text=A - Strategisch')).toBeVisible();
      await expect(page.locator('text=B - Standard')).toBeVisible();
      await expect(page.locator('text=C - Klein')).toBeVisible();
    });
  });
});
