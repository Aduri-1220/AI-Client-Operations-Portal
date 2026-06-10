import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Email address').fill('admin@company.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');
});

test.describe('AI Assistant', () => {
  test('loads AI assistant page', async ({ page }) => {
    await page.goto('/ai-assistant');
    await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible({ timeout: 5000 });
  });

  test('shows suggested prompts', async ({ page }) => {
    await page.goto('/ai-assistant');
    await expect(page.getByText('Summarize the E-Commerce Platform project')).toBeVisible();
  });

  test('sends a message and receives a response', async ({ page }) => {
    await page.goto('/ai-assistant');
    const input = page.getByPlaceholder('Ask anything about your clients');
    await input.fill('Which tasks are overdue?');
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();
    await expect(page.getByText('Which tasks are overdue?')).toBeVisible();
    // Loading dots appear briefly (~1200ms) — wait directly for the response instead
    await expect(page.getByText('Overdue Tasks')).toBeVisible({ timeout: 8000 });
  });
});
