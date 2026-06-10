import { test as base, expect } from '@playwright/test';

// Authenticated test fixture — bypasses the login form by injecting the
// mock JWT token into localStorage before the page scripts execute.
// Use this in any spec that tests pages behind the auth shell.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'mock-jwt-token');
    });
    await use(page);
  },
});

export { expect };
