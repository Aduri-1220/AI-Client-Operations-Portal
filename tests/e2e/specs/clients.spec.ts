import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Email address').fill('admin@company.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');
});

test.describe('Client Management', () => {
  test('navigates to clients page', async ({ page }) => {
    await page.getByRole('link', { name: 'Clients' }).click();
    await expect(page).toHaveURL('/clients');
    await expect(page.getByText('Acme Corporation')).toBeVisible();
  });

  test('creates a new client', async ({ page }) => {
    await page.goto('/clients');
    await page.getByRole('button', { name: 'Add Client' }).click();
    await expect(page.getByRole('heading', { name: 'Add Client' })).toBeVisible();

    await page.getByLabel('Client Name').fill('Test Client Corp');
    await page.getByLabel('Company').fill('Test Corp');
    await page.getByLabel('Contact Person').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane@testcorp.com');
    await page.getByLabel('Phone').fill('+1-555-9999');
    await page.getByRole('button', { name: 'Add Client' }).last().click();

    await expect(page.getByText('Test Client Corp')).toBeVisible();
  });

  test('filters clients by search', async ({ page }) => {
    await page.goto('/clients');
    await page.getByPlaceholder('Search clients...').fill('Acme');
    await expect(page.getByText('Acme Corporation')).toBeVisible();
    await expect(page.getByText('TechStart Inc')).not.toBeVisible();
  });
});
