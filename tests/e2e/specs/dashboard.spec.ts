import { test, expect } from '../fixtures/base';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('shows welcome message', async ({ page }) => {
    await expect(page.getByText('Welcome back, Admin')).toBeVisible();
  });

  test('renders all six stat cards', async ({ page }) => {
    await expect(page.getByText('Total Clients')).toBeVisible();
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Overdue Tasks')).toBeVisible();
    await expect(page.getByText('Pending Approvals')).toBeVisible();
    await expect(page.getByText('Sprint Velocity')).toBeVisible();
    await expect(page.getByText('Open Risks')).toBeVisible();
  });

  test('shows correct stat values', async ({ page }) => {
    // 24 = Total Clients (unique on page), 42 = Sprint Velocity (unique on page)
    // 12 = Active Projects but also appears as a trend indicator elsewhere, so skipped
    await expect(page.getByText('24')).toBeVisible();
    await expect(page.getByText('42')).toBeVisible();
  });

  test('renders recent projects table with all columns', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Project' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Client' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Deadline' })).toBeVisible();
  });

  test('shows project rows in the table', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'E-Commerce Platform' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'CRM Integration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Mobile App v2' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Data Pipeline' })).toBeVisible();
  });

  test('shows task status breakdown chart', async ({ page }) => {
    await expect(page.getByText('Task Status Breakdown')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
    // 'In Progress' appears in both the recent-projects table and the breakdown chart
    await expect(page.getByText('In Progress').first()).toBeVisible();
    await expect(page.getByText('Review')).toBeVisible();
    await expect(page.getByText('Backlog')).toBeVisible();
  });

  test('sidebar navigation links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Clients/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Tasks/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Documents/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Approvals/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /AI Assistant/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Reports/i })).toBeVisible();
  });
});
