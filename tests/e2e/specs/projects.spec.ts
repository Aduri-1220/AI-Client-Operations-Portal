import { test, expect } from '../fixtures/base';

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('shows existing project cards', async ({ page }) => {
    await expect(page.getByText('E-Commerce Platform')).toBeVisible();
    await expect(page.getByText('CRM Integration')).toBeVisible();
    await expect(page.getByText('Mobile App v2')).toBeVisible();
  });

  test('shows correct status badges', async ({ page }) => {
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('UAT')).toBeVisible();
    await expect(page.getByText('Planning')).toBeVisible();
  });

  test('shows budget and deadline on cards', async ({ page }) => {
    await expect(page.getByText(/\$120,000/)).toBeVisible();
    await expect(page.getByText(/\$45,000/)).toBeVisible();
  });

  test('shows progress bar on each card', async ({ page }) => {
    const progressBars = page.locator('.bg-blue-500.rounded-full');
    await expect(progressBars.first()).toBeVisible();
  });

  test('opens new project modal', async ({ page }) => {
    await page.getByRole('button', { name: /New Project/i }).click();
    await expect(page.getByRole('heading', { name: 'New Project' })).toBeVisible();
    await expect(page.getByLabel('Project Name')).toBeVisible();
  });

  test('creates a new project and shows it in the list', async ({ page }) => {
    await page.getByRole('button', { name: /New Project/i }).click();

    await page.getByLabel('Project Name').fill('E2E Test Project');
    await page.getByLabel('Client').selectOption({ value: '1' });
    await page.getByLabel('Start Date').fill('2026-06-10');
    await page.getByLabel('Deadline').fill('2026-12-31');
    await page.getByLabel('Budget ($)').fill('50000');
    await page.getByLabel('Status').selectOption({ value: 'PLANNING' });

    await page.getByRole('button', { name: 'Create Project' }).click();

    await expect(page.getByText('E2E Test Project')).toBeVisible();
  });

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.getByRole('button', { name: /New Project/i }).click();
    await page.getByRole('button', { name: 'Create Project' }).click();
    await expect(page.getByText('Name required')).toBeVisible();
  });

  test('closes modal on cancel', async ({ page }) => {
    await page.getByRole('button', { name: /New Project/i }).click();
    await expect(page.getByRole('heading', { name: 'New Project' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Project' })).not.toBeVisible();
  });
});
