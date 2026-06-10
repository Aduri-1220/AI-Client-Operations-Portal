import { test, expect } from '../fixtures/base';

test.describe('Documents', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents');
  });

  test('shows document count', async ({ page }) => {
    await expect(page.getByText('5 documents')).toBeVisible();
  });

  test('lists existing documents', async ({ page }) => {
    await expect(page.getByText('Project_Proposal_ECommerce_v2.pdf')).toBeVisible();
    await expect(page.getByText('Architecture_Diagram_v3.png')).toBeVisible();
    await expect(page.getByText('Sprint_13_Planning.xlsx')).toBeVisible();
    await expect(page.getByText('UAT_Signoff_CRM.pdf')).toBeVisible();
    await expect(page.getByText('Invoice_Acme_Q2_2026.pdf')).toBeVisible();
  });

  test('shows file size and upload date for each document', async ({ page }) => {
    await expect(page.getByText('2.0 MB')).toBeVisible();
    await expect(page.getByText('Uploaded by Admin').first()).toBeVisible();
  });

  test('shows Download and Delete buttons on each card', async ({ page }) => {
    const downloadBtns = page.getByRole('button', { name: /Download/i });
    await expect(downloadBtns.first()).toBeVisible();

    const deleteBtns = page.getByRole('button').filter({ has: page.locator('svg.lucide-trash-2') });
    await expect(deleteBtns.first()).toBeVisible();
  });

  test('deletes a document and updates the count', async ({ page }) => {
    await expect(page.getByText('5 documents')).toBeVisible();

    // Delete the first document via its trash button
    const firstCard = page.locator('.grid > div').first();
    await firstCard.getByRole('button').filter({ has: page.locator('svg') }).last().click();

    await expect(page.getByText('4 documents')).toBeVisible();
  });

  test('shows upload document button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Document/i })).toBeVisible();
  });
});
