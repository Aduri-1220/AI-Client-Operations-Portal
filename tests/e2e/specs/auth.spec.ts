import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('root redirects to dashboard (no server-side auth guard yet)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows login form', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByText('AI Ops Portal')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email address').fill('admin@company.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back, Admin')).toBeVisible();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Valid email required')).toBeVisible();
  });
});
