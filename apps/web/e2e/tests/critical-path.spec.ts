import { test, expect } from '@playwright/test';

test('Critical Path: Load App and Create Customer', async ({ page }) => {
    // 1. Load the Dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('Page loaded', await page.title());
    await expect(page.getByText('KOMPASS MVP')).toBeVisible({ timeout: 10000 });

    // 2. Verify all sections are present
    await expect(page.getByText('Sales & Projects')).toBeVisible();
    await expect(page.getByText('Master Data')).toBeVisible();

    // 3. Create a Dummy Customer (Simulate Offline Write)
    await page.click('text=Add Dummy Customer');

    // 4. Verify it appears in the list
    await expect(page.getByText('Test Company')).toBeVisible();
    await expect(page.getByText('Musterstadt')).toBeVisible();

    // 5. Verify Project Creation
    await page.click('text=New Project');
    await expect(page.getByText('Shopfitting Project')).toBeVisible();

    // 6. Verify Opportunity Creation
    await page.click('text=New Opportunity');
    await expect(page.getByText('Deal')).toBeVisible();
});
