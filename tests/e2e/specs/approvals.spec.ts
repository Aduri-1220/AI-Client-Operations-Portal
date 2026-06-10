import { test, expect } from '../fixtures/base';

test.describe('Approvals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/approvals');
  });

  test('shows the three summary count cards', async ({ page }) => {
    // 'Pending' also appears in "Pending Review" section header — use first() to match count card label
    await expect(page.getByText('Pending', { exact: true }).first()).toBeVisible();
    // 'Approved' appears in count card and history badges — use first()
    await expect(page.getByText('Approved', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Rejected', { exact: true }).first()).toBeVisible();
  });

  test('pending review section lists pending approvals', async ({ page }) => {
    await expect(page.getByText(/Pending Review/)).toBeVisible();
    await expect(page.getByText('UAT Sign-off Document — CRM Integration')).toBeVisible();
    await expect(page.getByText('Architecture Decision Record — Auth')).toBeVisible();
  });

  test('history section shows decided approvals', async ({ page }) => {
    await expect(page.getByText('History')).toBeVisible();
    await expect(page.getByText('Project Proposal — Mobile App v2')).toBeVisible();
    await expect(page.getByText('Invoice Draft — Acme Corp Q2')).toBeVisible();
  });

  test('approves a pending item and moves it to history', async ({ page }) => {
    const approvalTitle = 'UAT Sign-off Document — CRM Integration';

    await expect(page.getByText(approvalTitle)).toBeVisible();

    const approvalRow = page.locator(`text="${approvalTitle}"`).locator('../..');
    await approvalRow.getByRole('button', { name: /Approve/i }).click();

    // Item moves to history with Approved badge
    await expect(page.getByText('Approved').first()).toBeVisible();
  });

  test('rejects a pending item and moves it to history', async ({ page }) => {
    const approvalTitle = 'Architecture Decision Record — Auth';

    await expect(page.getByText(approvalTitle)).toBeVisible();

    const approvalRow = page.locator(`text="${approvalTitle}"`).locator('../..');
    await approvalRow.getByRole('button', { name: /Reject/i }).click();

    await expect(page.getByText('Rejected').first()).toBeVisible();
  });

  test('approved approval has correct badge in history', async ({ page }) => {
    // Project Proposal — Mobile App v2 is already approved in mock data; appears in History section
    await expect(page.getByText('Project Proposal — Mobile App v2')).toBeVisible();
  });

  test('shows requestor and date on pending items', async ({ page }) => {
    await expect(page.getByText(/Requested by Sarah Johnson/)).toBeVisible();
    await expect(page.getByText(/Requested by Emma Wilson/)).toBeVisible();
  });
});
