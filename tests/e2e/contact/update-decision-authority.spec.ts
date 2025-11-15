/**
 * E2E Test: Update Contact Decision Authority
 *
 * Tests RBAC restrictions for updating contact decision-making roles
 * Validates that only PLAN and GF users can update decision authority
 */

import { test, expect } from '@playwright/test';

test.describe('Contact Decision Authority - RBAC', () => {
  test('ADM user should NOT be able to update decision authority', async ({
    page,
  }) => {
    // Login as ADM user
    await page.goto('/login');
    await page.fill('[name="email"]', 'adm@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to contact detail
    await page.goto('/contacts/contact-111');
    await expect(page.locator('h1')).toContainText('Thomas Schmidt');

    // Verify "Bearbeiten" button for decision authority is NOT visible
    const editButton = page.locator(
      'button:has-text("Entscheidungsbefugnis bearbeiten")'
    );
    await expect(editButton).not.toBeVisible();

    // Verify RBAC notice is shown
    await expect(page.locator('text=Nur ADM+ Nutzer')).toBeVisible();
  });

  test('PLAN user should be able to update decision authority', async ({
    page,
  }) => {
    // Login as PLAN user
    await page.goto('/login');
    await page.fill('[name="email"]', 'plan@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to contact detail
    await page.goto('/contacts/contact-111');

    // Click edit button for decision authority
    await page.click('button:has-text("Bearbeiten")');

    // Update decision making role
    await page.click('[name="decisionMakingRole"]');
    await page.click('text=Schlüsselinfluencer');

    // Update authority level
    await page.click('[name="authorityLevel"]');
    await page.click('text=Hoch (bis €50.000)');

    // Enable order approval
    await page.click('[name="canApproveOrders"]');

    // Set approval limit
    await page.fill('[name="approvalLimitEur"]', '50000');

    // Select functional role
    await page.click('[name="functionalRoles.purchasing_manager"]');

    // Submit form
    await page.click('button:has-text("Speichern")');

    // Verify success toast
    await expect(page.locator('.toast-success')).toContainText('erfolgreich');

    // Verify updated decision role is displayed
    await expect(page.locator('text=Schlüsselinfluencer')).toBeVisible();
    await expect(page.locator('text=€50.000')).toBeVisible();
  });

  test('GF user should be able to update decision authority', async ({
    page,
  }) => {
    // Login as GF user
    await page.goto('/login');
    await page.fill('[name="email"]', 'gf@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to contact detail
    await page.goto('/contacts/contact-111');

    // Click edit button
    await page.click('button:has-text("Bearbeiten")');

    // Update to decision maker
    await page.click('[name="decisionMakingRole"]');
    await page.click('text=Entscheidungsträger');

    await page.click('[name="authorityLevel"]');
    await page.click('text=Letztentscheidung');

    await page.click('button:has-text("Speichern")');

    // Verify success
    await expect(page.locator('.toast-success')).toContainText('erfolgreich');
    await expect(page.locator('text=Entscheidungsträger')).toBeVisible();
  });

  test('should validate approval limit when canApproveOrders is enabled', async ({
    page,
  }) => {
    // Login as PLAN user
    await page.goto('/login');
    await page.fill('[name="email"]', 'plan@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/contacts/contact-111');
    await page.click('button:has-text("Bearbeiten")');

    // Enable order approval
    await page.click('[name="canApproveOrders"]');

    // Try to submit without approval limit
    await page.click('button:has-text("Speichern")');

    // Verify validation error
    await expect(
      page.locator('text=Genehmigungslimit ist erforderlich')
    ).toBeVisible();

    // Fix by adding approval limit
    await page.fill('[name="approvalLimitEur"]', '25000');
    await page.click('button:has-text("Speichern")');

    // Verify success
    await expect(page.locator('.toast-success')).toContainText('erfolgreich');
  });
});
