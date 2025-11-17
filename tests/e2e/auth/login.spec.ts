/**
 * E2E Test: User Login Flow (DEPRECATED)
 *
 * ⚠️ DEPRECATED: This test file is for the old redirect-based Keycloak login flow.
 * Use `login-embedded.spec.ts` instead, which tests the new embedded login flow.
 *
 * This file is kept for reference but should not be used for new tests.
 * The embedded login flow uses direct access grants and does not redirect to Keycloak.
 *
 * @deprecated Use `login-embedded.spec.ts` instead
 */

import { test, expect } from '@playwright/test';

test.describe.skip('User Login Flow (DEPRECATED - Redirect-based)', () => {
  // All tests are skipped - this file is deprecated
  // See login-embedded.spec.ts for current tests

  test('should redirect to Keycloak login page when clicking Sign In', async ({
    page,
  }) => {
    // DEPRECATED: Redirect-based flow no longer used
  });

  test('should handle Keycloak callback and redirect to dashboard', async ({
    page,
  }) => {
    // DEPRECATED: Redirect-based flow no longer used
  });

  test('should show error message if login fails', async ({ page }) => {
    // DEPRECATED: Redirect-based flow no longer used
  });

  test('should redirect authenticated user away from login page', async ({
    page,
  }) => {
    // DEPRECATED: Redirect-based flow no longer used
  });
});
