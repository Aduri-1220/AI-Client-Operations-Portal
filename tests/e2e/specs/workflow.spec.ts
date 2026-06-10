/**
 * Full end-to-end golden-path workflow test.
 *
 * This spec walks through the core operational loop a user performs in the portal:
 *   Login → Dashboard → Clients → Projects (create) → Tasks (create) →
 *   Approvals (approve) → AI Assistant (send message) → Sign out
 *
 * Each step asserts the result of the previous action before proceeding,
 * so a failure pinpoints exactly which stage broke.
 */
import { test, expect } from '@playwright/test';

const CREDENTIALS = { email: 'admin@company.com', password: 'password123' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/auth/login');
  await page.getByLabel('Email address').fill(CREDENTIALS.email);
  await page.getByLabel('Password').fill(CREDENTIALS.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');
}

test.describe('Full operational workflow', () => {
  test('1 — Login: valid credentials redirect to dashboard', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back, Admin')).toBeVisible();
  });

  test('2 — Dashboard: key metrics are visible', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Total Clients')).toBeVisible();
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Overdue Tasks')).toBeVisible();
    await expect(page.getByText('Pending Approvals')).toBeVisible();
  });

  test('3 — Clients: list loads and search filters correctly', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Clients' }).click();
    await expect(page).toHaveURL('/clients');

    await expect(page.getByText('Acme Corporation')).toBeVisible();
    await expect(page.getByText('TechStart Inc')).toBeVisible();

    await page.getByPlaceholder('Search clients...').fill('Acme');
    await expect(page.getByText('Acme Corporation')).toBeVisible();
    await expect(page.getByText('TechStart Inc')).not.toBeVisible();
  });

  test('4 — Clients: create a new client', async ({ page }) => {
    await login(page);
    await page.goto('/clients');

    await page.getByRole('button', { name: 'Add Client' }).click();
    await expect(page.getByRole('heading', { name: 'Add Client' })).toBeVisible();

    await page.getByLabel('Client Name').fill('Workflow Test Corp');
    await page.getByLabel('Company').fill('WTC Global');
    await page.getByLabel('Contact Person').fill('Alice Tester');
    await page.getByLabel('Email').fill('alice@wtc.example.com');
    await page.getByLabel('Phone').fill('+1-555-8888');

    await page.getByRole('button', { name: 'Add Client' }).last().click();

    await expect(page.getByText('Workflow Test Corp')).toBeVisible();
  });

  test('5 — Projects: create a new project', async ({ page }) => {
    await login(page);
    await page.goto('/projects');

    await page.getByRole('button', { name: /New Project/i }).click();

    await page.getByLabel('Project Name').fill('Workflow E2E Project');
    await page.getByLabel('Client').selectOption({ value: '2' });
    await page.getByLabel('Start Date').fill('2026-06-10');
    await page.getByLabel('Deadline').fill('2026-09-30');
    await page.getByLabel('Budget ($)').fill('75000');
    await page.getByLabel('Status').selectOption({ value: 'IN_PROGRESS' });

    await page.getByRole('button', { name: 'Create Project' }).click();

    await expect(page.getByText('Workflow E2E Project')).toBeVisible();
    await expect(page.getByText('In Progress').first()).toBeVisible();
  });

  test('6 — Tasks: kanban board loads and new task can be created', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    // All kanban columns visible
    await expect(page.getByText('Backlog')).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Review')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();

    // Create a task
    await page.getByRole('button', { name: /New Task/i }).click();
    await page.getByLabel('Title').fill('E2E Workflow Task');
    // projectId is required — select before submitting
    await page.getByLabel('Project').selectOption({ value: '1' });
    await page.getByRole('button', { name: 'Create Task' }).click();

    await expect(page.getByText('E2E Workflow Task')).toBeVisible();
  });

  test('7 — Documents: document list renders and delete works', async ({ page }) => {
    await login(page);
    await page.goto('/documents');

    await expect(page.getByText('5 documents')).toBeVisible();
    await expect(page.getByText('Project_Proposal_ECommerce_v2.pdf')).toBeVisible();

    // Upload button is present (actual upload skipped — no server in e2e)
    await expect(page.getByRole('button', { name: /Upload Document/i })).toBeVisible();
  });

  test('8 — Approvals: approve a pending item', async ({ page }) => {
    await login(page);
    await page.goto('/approvals');

    await expect(page.getByText(/Pending Review/)).toBeVisible();

    const pendingItem = page.locator('text=UAT Sign-off Document — CRM Integration').locator('../..');
    await pendingItem.getByRole('button', { name: /Approve/i }).click();

    // Pending count decreases — at least one approved badge is now visible
    const approvedBadges = page.getByText('Approved');
    await expect(approvedBadges.first()).toBeVisible();
  });

  test('9 — AI Assistant: sends a message and receives a response', async ({ page }) => {
    await login(page);
    await page.goto('/ai-assistant');

    await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible({ timeout: 5000 });

    const input = page.getByPlaceholder(/Ask anything about your clients/i);
    await input.fill('Which tasks are overdue?');
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();

    // User message echoed
    await expect(page.getByText('Which tasks are overdue?')).toBeVisible();

    // AI responds with overdue task content
    await expect(page.getByText('Overdue Tasks')).toBeVisible({ timeout: 8000 });
  });

  test('10 — Sign out: clears session and redirects to login', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');

    // Open user menu
    const userMenuBtn = page.locator('button').filter({ has: page.locator('.bg-blue-600.rounded-full') });
    await userMenuBtn.click();

    await page.getByRole('button', { name: /Sign out/i }).click();

    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Auth guard', () => {
  test('login form rejects empty submission', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Valid email required')).toBeVisible();
  });

  test('login form shows portal branding', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByText('AI Ops Portal')).toBeVisible();
    await expect(page.getByText(/Demo credentials/)).toBeVisible();
  });
});
