/**
 * E2E Test: Customer Duplicate Detection
 *
 * Tests the duplicate detection functionality in the customer form:
 * - Company name fuzzy matching (similarity >= 0.8)
 * - VAT number exact matching
 * - Duplicate detection dialog display
 * - Cancel action (clears field)
 * - Continue action (allows form submission)
 * - Debounced company name checking
 * - Immediate VAT number checking
 * - Edit mode (excludes current customer from checks)
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Duplicate Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  describe('Company Name Duplicate Detection', () => {
    test('should detect duplicate company name with fuzzy matching', async ({
      page,
    }) => {
      // First, create a customer with a specific name
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Müller GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE111111111');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();

      // Wait for customer to be created
      await expect(page).toHaveURL(/\/customers\/customer-/);
      await expect(page.locator('h1')).toContainText('Müller GmbH');

      // Now try to create another customer with similar name
      await page.goto('/customers/new');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE222222222');

      // Type similar company name (should trigger duplicate detection)
      await page.fill('[name="companyName"]', 'Mueller GmbH');

      // Wait for debounce delay (500ms) + API call
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });

      // Verify dialog content
      await expect(
        page.locator('text=/Es wurde ein potenzieller doppelter Kunde/i')
      ).toBeVisible();
      await expect(page.locator('text=Müller GmbH')).toBeVisible();
      await expect(page.locator('text=/Ähnlichkeit:/i')).toBeVisible();
    });

    test('should debounce company name input', async ({ page }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Test Company GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE333333333');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate with rapid typing
      await page.goto('/customers/new');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE444444444');

      // Type quickly (should only trigger one API call after debounce)
      const companyNameInput = page.locator('[name="companyName"]');
      await companyNameInput.fill('T');
      await companyNameInput.fill('Te');
      await companyNameInput.fill('Tes');
      await companyNameInput.fill('Test');
      await companyNameInput.fill('Test Company GmbH');

      // Wait for debounce delay
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });
    });

    test('should allow continuing despite duplicate company name', async ({
      page,
    }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Continue Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE555555555');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Continue Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE666666666');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });

      // Click "Trotzdem fortfahren" (Continue anyway)
      const continueButton = page.getByRole('button', {
        name: /Trotzdem fortfahren/i,
      });
      await continueButton.click();

      // Dialog should close
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).not.toBeVisible();

      // Form should still be fillable and submittable
      const submitButton2 = page.getByRole('button', { name: /Erstellen/i });
      await submitButton2.click();

      // Should create customer despite duplicate
      await expect(page).toHaveURL(/\/customers\/customer-/);
    });

    test('should clear company name when canceling duplicate dialog', async ({
      page,
    }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Cancel Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE777777777');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE888888888');

      const companyNameInput = page.locator('[name="companyName"]');
      await companyNameInput.fill('Cancel Test GmbH');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });

      // Click "Abbrechen" (Cancel)
      const cancelButton = page.getByRole('button', { name: /Abbrechen/i });
      await cancelButton.click();

      // Dialog should close
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).not.toBeVisible();

      // Company name field should be cleared
      await expect(companyNameInput).toHaveValue('');
    });
  });

  describe('VAT Number Duplicate Detection', () => {
    test('should detect duplicate VAT number with exact match', async ({
      page,
    }) => {
      // Create first customer with VAT number
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'VAT Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE999999999');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create another customer with same VAT number
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Different Company GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      // Enter duplicate VAT number (should trigger immediate check)
      await page.fill('[name="vatNumber"]', 'DE999999999');

      // Wait for duplicate dialog (should appear quickly, no debounce)
      await expect(
        page.locator('text=/Umsatzsteuer-ID bereits vergeben/i')
      ).toBeVisible({ timeout: 2000 });

      // Verify dialog content
      await expect(
        page.locator(
          'text=/Die Umsatzsteuer-ID "DE999999999" ist bereits für den Kunden/i'
        )
      ).toBeVisible();
      await expect(page.locator('text=VAT Test GmbH')).toBeVisible();
      await expect(page.locator('text=/Exakter Treffer/i')).toBeVisible();
    });

    test('should allow continuing despite duplicate VAT number', async ({
      page,
    }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'VAT Continue Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE111111111');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Another Company GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE111111111');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Umsatzsteuer-ID bereits vergeben/i')
      ).toBeVisible({ timeout: 2000 });

      // Click "Trotzdem fortfahren"
      const continueButton = page.getByRole('button', {
        name: /Trotzdem fortfahren/i,
      });
      await continueButton.click();

      // Dialog should close
      await expect(
        page.locator('text=/Umsatzsteuer-ID bereits vergeben/i')
      ).not.toBeVisible();

      // Form should still be submittable
      const submitButton2 = page.getByRole('button', { name: /Erstellen/i });
      await submitButton2.click();

      // Should create customer despite duplicate VAT
      await expect(page).toHaveURL(/\/customers\/customer-/);
    });

    test('should clear VAT number when canceling duplicate dialog', async ({
      page,
    }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'VAT Cancel Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE222222222');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Another Company GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');

      const vatNumberInput = page.locator('[name="vatNumber"]');
      await vatNumberInput.fill('DE222222222');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Umsatzsteuer-ID bereits vergeben/i')
      ).toBeVisible({ timeout: 2000 });

      // Click "USt-ID korrigieren" (Correct VAT number)
      const cancelButton = page.getByRole('button', {
        name: /USt-ID korrigieren/i,
      });
      await cancelButton.click();

      // Dialog should close
      await expect(
        page.locator('text=/Umsatzsteuer-ID bereits vergeben/i')
      ).not.toBeVisible();

      // VAT number field should be cleared
      await expect(vatNumberInput).toHaveValue('');
    });
  });

  describe('Edit Mode', () => {
    test('should exclude current customer from duplicate checks in edit mode', async ({
      page,
    }) => {
      // Create a customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Edit Mode Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE333333333');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Navigate to edit form
      const editButton = page.getByRole('button', { name: /Bearbeiten/i });
      await editButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-.*\/edit/);

      // Modify company name slightly (should not trigger duplicate for same customer)
      const companyNameInput = page.locator('[name="companyName"]');
      await companyNameInput.fill('Edit Mode Test GmbH'); // Same name

      // Wait a bit to ensure no duplicate dialog appears
      await page.waitForTimeout(1000);

      // Should not show duplicate dialog (same customer excluded)
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).not.toBeVisible();

      // Should be able to save without issues
      const updateButton = page.getByRole('button', { name: /Aktualisieren/i });
      await updateButton.click();

      // Should update successfully
      await expect(page).toHaveURL(/\/customers\/customer-/);
      await expect(page.locator('text=/Kunde aktualisiert/i')).toBeVisible({
        timeout: 5000,
      });
    });
  });

  describe('Dialog Interaction', () => {
    test('should display customer details in duplicate dialog', async ({
      page,
    }) => {
      // Create first customer with full details
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Details Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Hauptstraße');
      await page.fill('[name="billingAddress.streetNumber"]', '42');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE444444444');
      await page.fill('[name="email"]', 'details@test.de');
      await page.fill('[name="phone"]', '+49-89-1234567');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Details Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE555555555');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });

      // Verify customer details are displayed
      await expect(page.locator('text=Details Test GmbH')).toBeVisible();
      await expect(page.locator('text=DE444444444')).toBeVisible();
      await expect(page.locator('text=Hauptstraße')).toBeVisible();
      await expect(page.locator('text=80331')).toBeVisible();
      await expect(page.locator('text=München')).toBeVisible();
      await expect(page.locator('text=details@test.de')).toBeVisible();
      await expect(page.locator('text=+49-89-1234567')).toBeVisible();
    });

    test('should close dialog when clicking outside', async ({ page }) => {
      // Create first customer
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Close Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE666666666');

      const submitButton = page.getByRole('button', { name: /Erstellen/i });
      await submitButton.click();
      await expect(page).toHaveURL(/\/customers\/customer-/);

      // Try to create duplicate
      await page.goto('/customers/new');
      await page.fill('[name="companyName"]', 'Close Test GmbH');
      await page.fill('[name="billingAddress.street"]', 'Teststraße');
      await page.fill('[name="billingAddress.zipCode"]', '80331');
      await page.fill('[name="billingAddress.city"]', 'München');
      await page.fill('[name="vatNumber"]', 'DE777777777');

      // Wait for duplicate dialog
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).toBeVisible({ timeout: 3000 });

      // Click outside dialog (on backdrop)
      await page.click('body', { position: { x: 10, y: 10 } });

      // Dialog should close
      await expect(
        page.locator('text=/Potenzieller doppelter Firmenname/i')
      ).not.toBeVisible({ timeout: 1000 });
    });
  });
});
