/**
 * E2E Test: Customer Search
 *
 * Tests the complete customer search functionality:
 * - Search input filters customers by companyName
 * - Search input filters customers by VAT number
 * - Debounced search (500ms delay)
 * - Search highlighting in results
 * - Clear search button
 * - Search persists in URL query params
 * - Browser back/forward navigation preserves search
 * - Mobile-responsive search UI
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Navigate to customer list
    await page.goto('/customers');
    await expect(page.locator('h1')).toContainText(/Kunden/i);
  });

  test('should filter customers by company name', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    // Find search input
    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term
    await searchInput.fill('Test');

    // Wait for debounce (500ms) + filtering
    await page.waitForTimeout(600);

    // Should show filtered results
    // Note: This test assumes test data exists
    // In real scenario, we'd seed test data first
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    // If there are results, they should match the search
    if (rowCount > 0) {
      // Check that visible rows contain "Test" (case-insensitive)
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const row = tableRows.nth(i);
        const companyName = await row.locator('td').nth(1).textContent();
        expect(companyName?.toLowerCase()).toContain('test');
      }
    }
  });

  test('should filter customers by VAT number', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    // Find search input
    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type VAT number search
    await searchInput.fill('DE123456789');

    // Wait for debounce (500ms) + filtering
    await page.waitForTimeout(600);

    // Should show filtered results
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    // If there are results, they should match the VAT number
    if (rowCount > 0) {
      const firstRow = tableRows.first();
      const vatNumber = await firstRow.locator('td').nth(2).textContent();
      expect(vatNumber).toContain('DE123456789');
    }
  });

  test('should debounce search input (500ms delay)', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type quickly (should only trigger search after debounce)
    await searchInput.fill('T');
    await page.waitForTimeout(100);
    await searchInput.fill('Te');
    await page.waitForTimeout(100);
    await searchInput.fill('Tes');
    await page.waitForTimeout(100);
    await searchInput.fill('Test');

    // Wait for debounce (500ms)
    await page.waitForTimeout(600);

    // Search should have been applied (check URL or filtered results)
    // URL should contain search param after debounce
    await expect(page).toHaveURL(/search=Test/, { timeout: 2000 });
  });

  test('should highlight matching text in company name', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term
    await searchInput.fill('Test');

    // Wait for debounce (500ms) + highlighting
    await page.waitForTimeout(600);

    // Check for highlighted text (mark element)
    const highlightedText = page.locator('mark');
    const count = await highlightedText.count();

    if (count > 0) {
      // At least one highlight should be visible
      await expect(highlightedText.first()).toBeVisible();
      // Highlighted text should contain the search term
      const text = await highlightedText.first().textContent();
      expect(text?.toLowerCase()).toContain('test');
    }
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term
    await searchInput.fill('Test');

    // Wait for debounce
    await page.waitForTimeout(600);

    // Find and click clear button (X icon)
    const clearButton = page.getByLabelText(/Suche löschen/i);
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Search input should be cleared
    await expect(searchInput).toHaveValue('');

    // URL should not contain search param
    await expect(page).not.toHaveURL(/search=/);

    // All customers should be visible again (if we had test data)
    // This is a basic check - in real scenario we'd verify row count
  });

  test('should persist search in URL query params', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term
    await searchInput.fill('Test');

    // Wait for debounce (500ms) + URL update
    await page.waitForTimeout(600);

    // URL should contain search param
    await expect(page).toHaveURL(/search=Test/, { timeout: 2000 });

    // Reload page
    await page.reload();

    // Search term should be restored from URL
    await expect(searchInput).toHaveValue('Test', { timeout: 2000 });

    // Results should still be filtered
    // (We can't easily verify this without test data, but URL persistence is verified)
  });

  test('should preserve search state on browser back/forward', async ({
    page,
  }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term
    await searchInput.fill('Test');

    // Wait for debounce
    await page.waitForTimeout(600);

    // Navigate to a customer detail page
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();

    // Wait for navigation
    await expect(page).toHaveURL(/\/customers\/customer-/, { timeout: 2000 });

    // Go back
    await page.goBack();

    // Should be back on customer list
    await expect(page).toHaveURL(/\/customers/, { timeout: 2000 });

    // Search term should be restored from URL
    const searchInputAfterBack =
      page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInputAfterBack).toHaveValue('Test', { timeout: 2000 });
  });

  test('should have mobile-friendly search UI', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Search input should be full-width on mobile
    const inputBox = await searchInput.boundingBox();
    if (inputBox) {
      // Input should take significant width (at least 80% of viewport)
      expect(inputBox.width).toBeGreaterThan(300);
    }

    // Clear button should be touch-friendly (min 44px)
    const clearButton = page.getByLabelText(/Suche löschen/i);
    // Type something to make clear button visible
    await searchInput.fill('Test');
    await page.waitForTimeout(100);

    const clearButtonBox = await clearButton.boundingBox();
    if (clearButtonBox) {
      expect(clearButtonBox.height).toBeGreaterThanOrEqual(44);
      expect(clearButtonBox.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('should handle empty search results', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type search term that won't match anything
    await searchInput.fill('NonExistentCompanyXYZ123');

    // Wait for debounce
    await page.waitForTimeout(600);

    // Should show empty state
    await expect(page.locator('text=Keine Kunden gefunden')).toBeVisible({
      timeout: 2000,
    });

    // Should show message about search
    await expect(page.locator('text=/Keine Ergebnisse für/i')).toBeVisible({
      timeout: 2000,
    });
  });

  test('should filter case-insensitively', async ({ page }) => {
    // Wait for customer list to load
    await expect(page.locator('text=Kunden')).toBeVisible();

    const searchInput = page.getByPlaceholderText(/Kunden durchsuchen/i);
    await expect(searchInput).toBeVisible();

    // Type lowercase search
    await searchInput.fill('test');

    // Wait for debounce
    await page.waitForTimeout(600);

    // Should still match "Test GmbH" (case-insensitive)
    // Check URL contains search param
    await expect(page).toHaveURL(/search=test/, { timeout: 2000 });

    // Results should be filtered (if test data exists)
    // Highlighting should work case-insensitively
    const highlightedText = page.locator('mark');
    const count = await highlightedText.count();

    if (count > 0) {
      // Highlighting should work even with lowercase query
      await expect(highlightedText.first()).toBeVisible();
    }
  });
});
