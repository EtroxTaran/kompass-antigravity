/**
 * TEMPLATE: E2E Test (Playwright)
 * 
 * Usage: Copy this template when creating E2E tests
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. E2E tests in tests/e2e/ directory
 * 2. Follow USER_JOURNEY_MAPS.md scenarios
 * 3. Test happy path AND error scenarios
 * 4. Verify NFR performance targets (response times)
 * 5. Test offline functionality
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Test suite for {{EntityName}} Management
 * 
 * @description End-to-end tests covering complete user journeys
 * @reference TEST_STRATEGY_DOCUMENT.md - E2E scenarios
 */
test.describe('{{EntityName}} Management', () => {
  let page: Page;

  // ============================================================================
  // SETUP & TEARDOWN
  // ============================================================================

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  // ============================================================================
  // CREATE TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-001: User can create new {{entityName}}', async () => {
    // Navigate to {{entityName}}s page
    await page.goto('/{{entity-names}}');
    await expect(page.locator('h1')).toContainText('{{EntityName}}s');

    // Click "New {{EntityName}}" button
    await page.click('button:has-text("New {{EntityName}}")');
    await expect(page).toHaveURL('/{{entity-names}}/new');

    // Fill form
    await page.fill('[name="exampleField"]', 'Test Value');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="phone"]', '+49-89-1234567');
    
    // Submit form
    await page.click('button:has-text("Save")');

    // Verify success
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('.toast-success')).toContainText('{{EntityName}} created');
    
    // Verify redirect to detail page
    await expect(page).toHaveURL(/\/{{entity-names}}\/{{entityName}}-/);
    
    // Verify data displayed
    await expect(page.locator('h1')).toContainText('Test Value');
  });

  test('E2E-{{ENTITY}}-002: Form validation prevents invalid data', async () => {
    // Navigate to create form
    await page.goto('/{{entity-names}}/new');

    // Try to submit with missing required field
    await page.click('button:has-text("Save")');

    // Verify validation error
    await expect(page.locator('.form-error')).toBeVisible();
    await expect(page.locator('.form-error')).toContainText('required');
    
    // Verify form not submitted
    await expect(page).toHaveURL('/{{entity-names}}/new');
  });

  // ============================================================================
  // READ/SEARCH TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-003: User can search {{entityName}}s', async () => {
    // Navigate to list page
    await page.goto('/{{entity-names}}');

    // Search
    await page.fill('[placeholder*="Search"]', 'Test Query');
    
    // Verify search results update
    await expect(page.locator('.{{entity-name}}-list-item')).toHaveCount(1);
    
    // Verify performance (NFR: search < 500ms)
    const startTime = Date.now();
    await page.fill('[placeholder*="Search"]', 'Another Query');
    await page.waitForSelector('.{{entity-name}}-list-item', { timeout: 1000 });
    const searchTime = Date.now() - startTime;
    
    expect(searchTime).toBeLessThan(500); // NFR requirement
  });

  // ============================================================================
  // UPDATE TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-004: User can edit {{entityName}}', async () => {
    // Navigate to existing {{entityName}}
    await page.goto('/{{entity-names}}/{{entityName}}-test-123');
    
    // Click edit button
    await page.click('button:has-text("Edit")');
    await expect(page).toHaveURL('/{{entity-names}}/{{entityName}}-test-123/edit');

    // Update field
    await page.fill('[name="exampleField"]', 'Updated Value');
    await page.click('button:has-text("Save")');

    // Verify success
    await expect(page.locator('.toast-success')).toContainText('updated');
    
    // Verify updated value displayed
    await expect(page.locator('[data-testid="example-field"]')).toContainText('Updated Value');
  });

  // ============================================================================
  // DELETE TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-005: User can delete {{entityName}}', async () => {
    // Navigate to {{entityName}}
    await page.goto('/{{entity-names}}/{{entityName}}-test-456');
    
    // Click delete button
    await page.click('button:has-text("Delete")');
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    // Verify redirect to list
    await expect(page).toHaveURL('/{{entity-names}}');
    
    // Verify success message
    await expect(page.locator('.toast-success')).toContainText('deleted');
  });

  // ============================================================================
  // OFFLINE TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-006: User can create {{entityName}} while offline', async ({ context }) => {
    // Go to create page
    await page.goto('/{{entity-names}}/new');
    
    // Go offline
    await context.setOffline(true);
    
    // Verify offline indicator
    await expect(page.locator('.offline-indicator')).toBeVisible();
    
    // Fill form
    await page.fill('[name="exampleField"]', 'Offline Test');
    await page.click('button:has-text("Save")');
    
    // Verify saved locally
    await expect(page.locator('.toast')).toContainText('Saved locally');
    await expect(page.locator('.sync-pending-badge')).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
    
    // Wait for sync
    await page.waitForSelector('.sync-success', { timeout: 10000 });
    await expect(page.locator('.sync-pending-badge')).not.toBeVisible();
  });

  // ============================================================================
  // RBAC TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-007: User without permission cannot access restricted features', async () => {
    // Login as limited user
    await page.goto('/login');
    await page.fill('[name="email"]', 'limited@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Try to access {{entityName}}s
    await page.goto('/{{entity-names}}');
    
    // Verify access denied or restricted view
    await expect(
      page.locator('text=/access denied|insufficient permissions/i')
    ).toBeVisible();
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-008: Form is keyboard accessible', async () => {
    await page.goto('/{{entity-names}}/new');
    
    // Tab through form fields
    await page.keyboard.press('Tab'); // Focus first field
    await expect(page.locator('[name="exampleField"]')).toBeFocused();
    
    await page.keyboard.type('Test Value');
    await page.keyboard.press('Tab'); // Next field
    
    // Navigate to save button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Save")')).toBeFocused();
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    
    // Verify submission worked
    await expect(page.locator('.toast-success')).toBeVisible();
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  test('E2E-{{ENTITY}}-009: {{EntityName}} list loads within performance target', async () => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/{{entity-names}}');
    await page.waitForSelector('[data-testid="{{entity-name}}-list-loaded"]');
    const loadTime = Date.now() - startTime;
    
    // Verify NFR: Page load < 3s (P95 target)
    expect(loadTime).toBeLessThan(3000);
    
    // Verify data displayed
    await expect(page.locator('.{{entity-name}}-list-item')).toHaveCount(10);
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Login helper function
 */
async function loginAs(page: Page, email: string, password: string = 'password123') {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

/**
 * Create test {{entityName}} helper
 */
async function createTest{{EntityName}}(page: Page, data: any) {
  // Implementation depends on your test data setup
  // Could use API calls or database seeding
}

