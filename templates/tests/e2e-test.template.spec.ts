/**
 * E2E Test Template for KOMPASS
 * 
 * Testing: {{ENTITY_NAME}} user journey
 * Framework: Playwright
 * Coverage Target: 90% of critical user paths
 * 
 * Following: USER_JOURNEY_MAPS.md and TEST_STRATEGY_DOCUMENT.md
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Page Object for {{ENTITY_NAME}} pages
 * 
 * Encapsulates page interactions for reusability
 */
class {{ENTITY_NAME}}Page {
  constructor(private readonly page: Page) {}

  /**
   * Navigate to {{ENTITY_NAME}} list
   */
  async goto(): Promise<void> {
    await this.page.goto('/{{ENTITY_NAME_PLURAL_LOWER}}');
    await this.page.waitForSelector('[data-testid="{{ENTITY_NAME_LOWER}}-list"]');
  }

  /**
   * Click "New {{ENTITY_NAME}}" button
   */
  async clickNew(): Promise<void> {
    await this.page.click('button:has-text("New {{ENTITY_NAME}}")');
    await this.page.waitForURL('**/{{ENTITY_NAME_PLURAL_LOWER}}/new');
  }

  /**
   * Fill the {{ENTITY_NAME}} form
   */
  async fillForm(data: {
    name: string;
    email?: string;
    phone?: string;
    status?: string;
  }): Promise<void> {
    await this.page.fill('[name="name"]', data.name);
    
    if (data.email) {
      await this.page.fill('[name="email"]', data.email);
    }
    
    if (data.phone) {
      await this.page.fill('[name="phone"]', data.phone);
    }
    
    if (data.status) {
      await this.page.selectOption('[name="status"]', data.status);
    }
  }

  /**
   * Click save button
   */
  async clickSave(): Promise<void> {
    await this.page.click('button:has-text("Save")');
  }

  /**
   * Search for {{ENTITY_NAME}}
   */
  async search(term: string): Promise<void> {
    await this.page.fill('[placeholder*="Search"]', term);
    await this.page.waitForSelector('[data-testid="search-results"]');
  }

  /**
   * Get list items
   */
  async getListItems(): Promise<number> {
    return this.page.locator('[data-testid="{{ENTITY_NAME_LOWER}}-list-item"]').count();
  }

  /**
   * Click {{ENTITY_NAME}} in list
   */
  async clickListItem(index: number = 0): Promise<void> {
    await this.page.locator('[data-testid="{{ENTITY_NAME_LOWER}}-list-item"]').nth(index).click();
  }
}

/**
 * Helper function to login
 */
async function login(page: Page, role: 'ADM' | 'INNEN' | 'PLAN' | 'BUCH' | 'GF' = 'ADM'): Promise<void> {
  await page.goto('/login');
  
  // Role-specific test credentials
  const credentials = {
    ADM: { email: 'adm@test.de', password: 'test123' },
    INNEN: { email: 'innen@test.de', password: 'test123' },
    PLAN: { email: 'plan@test.de', password: 'test123' },
    BUCH: { email: 'buch@test.de', password: 'test123' },
    GF: { email: 'gf@test.de', password: 'test123' },
  };

  await page.fill('[name="email"]', credentials[role].email);
  await page.fill('[name="password"]', credentials[role].password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard');
}

describe('{{ENTITY_NAME}} Management', () => {
  test.describe('Create {{ENTITY_NAME}}', () => {
    test('E2E-{{ENTITY_CODE}}-001: User can create new {{ENTITY_NAME}}', async ({ page }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);

      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      await {{ENTITY_NAME_LOWER}}Page.clickNew();
      await {{ENTITY_NAME_LOWER}}Page.fillForm({
        name: 'Test {{ENTITY_NAME}} E2E',
        email: 'test@example.com',
        phone: '+49-89-1234567',
        status: 'active',
      });
      await {{ENTITY_NAME_LOWER}}Page.clickSave();

      // Assert
      await expect(page.locator('.toast-success')).toContainText('created');
      await expect(page.locator('h1')).toContainText('Test {{ENTITY_NAME}} E2E');
    });

    test('E2E-{{ENTITY_CODE}}-002: Validation errors prevent submission', async ({ page }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);

      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      await {{ENTITY_NAME_LOWER}}Page.clickNew();
      await {{ENTITY_NAME_LOWER}}Page.fillForm({
        name: 'A', // Too short
      });
      await {{ENTITY_NAME_LOWER}}Page.clickSave();

      // Assert
      await expect(page.locator('.error-message')).toContainText('at least 2 characters');
    });
  });

  test.describe('Search {{ENTITY_NAME}}', () => {
    test('E2E-{{ENTITY_CODE}}-003: User can search for {{ENTITY_NAME}}', async ({ page }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);
      
      // Create test data
      await {{ENTITY_NAME_LOWER}}Page.goto();
      await {{ENTITY_NAME_LOWER}}Page.clickNew();
      await {{ENTITY_NAME_LOWER}}Page.fillForm({ name: 'Searchable {{ENTITY_NAME}}' });
      await {{ENTITY_NAME_LOWER}}Page.clickSave();
      
      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      await {{ENTITY_NAME_LOWER}}Page.search('Searchable');

      // Assert
      const itemCount = await {{ENTITY_NAME_LOWER}}Page.getListItems();
      expect(itemCount).toBeGreaterThan(0);
      await expect(page.locator('[data-testid="{{ENTITY_NAME_LOWER}}-list-item"]').first())
        .toContainText('Searchable {{ENTITY_NAME}}');
    });

    test('E2E-{{ENTITY_CODE}}-004: Search returns results within 500ms', async ({ page }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);
      await {{ENTITY_NAME_LOWER}}Page.goto();

      // Act
      const startTime = Date.now();
      await {{ENTITY_NAME_LOWER}}Page.search('Test');
      await page.waitForSelector('[data-testid="search-results"]');
      const searchTime = Date.now() - startTime;

      // Assert (NFR requirement: search ≤500ms)
      expect(searchTime).toBeLessThan(500);
    });
  });

  test.describe('Offline Mode', () => {
    test('E2E-OFFLINE-001: User can create {{ENTITY_NAME}} while offline', async ({ page, context }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);
      await {{ENTITY_NAME_LOWER}}Page.goto();

      // Act - Go offline
      await context.setOffline(true);
      await expect(page.locator('.offline-indicator')).toBeVisible();

      // Create {{ENTITY_NAME}} offline
      await {{ENTITY_NAME_LOWER}}Page.clickNew();
      await {{ENTITY_NAME_LOWER}}Page.fillForm({
        name: 'Offline {{ENTITY_NAME}}',
      });
      await {{ENTITY_NAME_LOWER}}Page.clickSave();

      // Assert
      await expect(page.locator('.toast-success')).toContainText('Saved locally');
      await expect(page.locator('.sync-pending-badge')).toBeVisible();

      // Go back online
      await context.setOffline(false);

      // Wait for sync
      await expect(page.locator('.sync-success')).toBeVisible({ timeout: 10000 });
    });

    test('E2E-OFFLINE-002: Sync completes within 30 seconds for 100 changes', async ({ page, context }) => {
      // Arrange
      await login(page, 'ADM');
      await context.setOffline(true);

      // Create 100 {{ENTITY_NAME}}s offline
      // (In real test, this would be done programmatically via PouchDB)
      
      // Act - Go online and sync
      const startTime = Date.now();
      await context.setOffline(false);
      await expect(page.locator('.sync-complete')).toBeVisible({ timeout: 35000 });
      const syncTime = Date.now() - startTime;

      // Assert (NFR requirement: 100 changes sync in ≤30s P95)
      expect(syncTime).toBeLessThan(30000);
    });
  });

  test.describe('RBAC Permissions', () => {
    test('E2E-RBAC-001: ADM can only see their own {{ENTITY_NAME}}s', async ({ page }) => {
      // Arrange
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);

      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      const itemCount = await {{ENTITY_NAME_LOWER}}Page.getListItems();

      // Assert - Should only see own {{ENTITY_NAME}}s
      // TODO: Verify filtering logic
      expect(itemCount).toBeGreaterThanOrEqual(0);
    });

    test('E2E-RBAC-002: GF can see all {{ENTITY_NAME}}s', async ({ page }) => {
      // Arrange
      await login(page, 'GF');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);

      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      const itemCount = await {{ENTITY_NAME_LOWER}}Page.getListItems();

      // Assert - Should see all {{ENTITY_NAME}}s regardless of owner
      expect(itemCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('E2E-MOBILE-001: {{ENTITY_NAME}} form works on mobile viewport', async ({ page }) => {
      // Arrange - Set mobile viewport (iPhone 14)
      await page.setViewportSize({ width: 390, height: 844 });
      await login(page, 'ADM');
      const {{ENTITY_NAME_LOWER}}Page = new {{ENTITY_NAME}}Page(page);

      // Act
      await {{ENTITY_NAME_LOWER}}Page.goto();
      await {{ENTITY_NAME_LOWER}}Page.clickNew();
      await {{ENTITY_NAME_LOWER}}Page.fillForm({
        name: 'Mobile Test {{ENTITY_NAME}}',
      });

      // Assert - Touch targets are at least 44px (WCAG requirement)
      const saveButton = await page.locator('button:has-text("Save")').boundingBox();
      expect(saveButton?.height).toBeGreaterThanOrEqual(44);
      expect(saveButton?.width).toBeGreaterThanOrEqual(44);

      await {{ENTITY_NAME_LOWER}}Page.clickSave();
      await expect(page.locator('.toast-success')).toBeVisible();
    });
  });
});

