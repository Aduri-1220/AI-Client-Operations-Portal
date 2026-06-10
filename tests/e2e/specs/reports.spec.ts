import { test, expect } from '../fixtures/base';

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
  });

  test('shows all four report type cards', async ({ page }) => {
    await expect(page.getByText('Project Status Report')).toBeVisible();
    await expect(page.getByText('Client Summary Report')).toBeVisible();
    await expect(page.getByText('Sprint Summary')).toBeVisible();
    await expect(page.getByText('Invoice Draft')).toBeVisible();
  });

  test('shows description text for each report type', async ({ page }) => {
    await expect(page.getByText(/Full status for all active projects/)).toBeVisible();
    await expect(page.getByText(/Auto-generated invoice/)).toBeVisible();
  });

  test('each report card has Preview and Download PDF buttons', async ({ page }) => {
    const previewBtns = page.getByRole('button', { name: /Preview/i });
    const downloadBtns = page.getByRole('button', { name: /Download PDF/i });

    await expect(previewBtns.first()).toBeVisible();
    await expect(downloadBtns.first()).toBeVisible();
    await expect(await previewBtns.count()).toBe(4);
    await expect(await downloadBtns.count()).toBe(4);
  });

  test('shows monthly completed tasks bar chart', async ({ page }) => {
    await expect(page.getByText('Monthly Completed Tasks')).toBeVisible();

    // Month labels
    await expect(page.getByText('Jan')).toBeVisible();
    await expect(page.getByText('Jun')).toBeVisible();
  });

  test('bar chart shows task count values', async ({ page }) => {
    await expect(page.getByText('28')).toBeVisible(); // Jan
    await expect(page.getByText('51')).toBeVisible(); // May
  });
});
