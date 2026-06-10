import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Email address').fill('admin@company.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');
});

test.describe('Task Board', () => {
  test('shows kanban columns', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByText('Backlog')).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Review')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
  });

  test('creates a new task', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('button', { name: 'New Task' }).click();

    await page.getByLabel('Title').fill('Implement user notifications');
    // projectId is required by the form schema — select one before submitting
    await page.getByLabel('Project').selectOption({ value: '1' });
    await page.getByRole('button', { name: 'Create Task' }).click();

    await expect(page.getByText('Implement user notifications')).toBeVisible();
  });

  test('displays task story points', async ({ page }) => {
    await page.goto('/tasks');
    // Multiple tasks have 5pt — use first() to satisfy strict mode
    await expect(page.getByText('5pt').first()).toBeVisible();
  });
});
