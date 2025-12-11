import { test, expect } from "@playwright/test";

test("Critical Path: Load App and Create Customer", async ({ page }) => {
  // Inject Mock Token
  await page.addInitScript(() => {
    localStorage.setItem(
      "auth_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLWFkbWluIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIkFETSJdfSwiaWF0IjoxNzY1NDg2MDMzLjk4Nn0.zQFIC_wosZ5IGMW1VgKMZIsUSqQ8G72fW93Rr4QUv6s"
    );
  });

  // 1. Load the App
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  console.log("Page loaded", await page.title());
  await expect(page.getByText("KOMPASS MVP")).toBeVisible({ timeout: 10000 });

  // 2. Verify all sections are present
  await expect(page.getByText("Sales & Projects")).toBeVisible();
  await expect(page.getByText("Master Data")).toBeVisible();

  // 3. Create a Dummy Customer (Simulate Offline Write)
  // 3. Create a Customer
  // Switch to ADM tab where the button is
  await page.click("text=Sales (ADM)");
  await page.click("text=Neuer Kunde");
  await page.waitForURL("**/customers/new");

  await page.fill('input[name="companyName"]', "Test Company");
  await page.fill('input[name="billingAddress.street"]', "Test Str 1");
  await page.fill('input[name="billingAddress.zipCode"]', "12345");
  await page.fill('input[name="billingAddress.city"]', "Test City");
  await page.fill('input[name="billingAddress.country"]', "Germany");

  await page.click("button:has-text('Save Customer')");
  await page.waitForURL("**/customers");

  // 4. Verify it appears in the list
  await expect(page.getByText("Test Company")).toBeVisible();
  await expect(page.getByText("Musterstadt")).toBeVisible();

  // 5. Verify Project Creation
  await page.click("text=New Project");
  await expect(page.getByText("Shopfitting Project")).toBeVisible();

  // 6. Verify Opportunity Creation
  await page.click("text=New Opportunity");
  await expect(page.getByText("Deal")).toBeVisible();
});
