import { test, expect } from '../support/fixtures';
import { productFactory } from '../support/factories';

test.describe('Catalog Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/catalog');
  });

  test('should add a new product', async ({ authenticatedPage }) => {
    const product = productFactory();

    await authenticatedPage.click('button:has-text("Adaugă Produs")');
    
    await authenticatedPage.fill('input[placeholder="ex: Șuruburi 10mm"]', product.nume);
    await authenticatedPage.fill('textarea[placeholder="Adaugă detalii despre produs..."]', product.descriere);
    await authenticatedPage.fill('input[type="number"] >> nth=0', (product.pret / 100).toString());
    await authenticatedPage.fill('input[type="number"] >> nth=1', product.stoc.toString());
    
    // Select category and unit if available
    await authenticatedPage.selectOption('select >> nth=0', { index: 1 });
    await authenticatedPage.selectOption('select >> nth=1', { index: 1 });

    await authenticatedPage.click('button:has-text("Salvează Produs")');

    // Verify product appears in the list
    await expect(authenticatedPage.locator('table')).toContainText(product.nume);
  });

  test('should update stock via +/- buttons', async ({ authenticatedPage }) => {
    // Find the first row's stock value
    const firstRow = authenticatedPage.locator('tbody tr').first();
    const initialStockText = await firstRow.locator('td >> nth=2 >> span').innerText();
    const initialStock = parseInt(initialStockText);

    // Click + button
    await firstRow.locator('button').filter({ hasText: '+' }).click();
    
    // Check if stock increased
    await expect(firstRow.locator('td >> nth=2 >> span')).toHaveText((initialStock + 1).toString());

    // Click - button
    await firstRow.locator('button').filter({ hasText: '-' }).click();
    
    // Check if stock returned to initial
    await expect(firstRow.locator('td >> nth=2 >> span')).toHaveText(initialStock.toString());
  });

  test('should delete a product', async ({ authenticatedPage }) => {
    // Get product name of the first row to verify deletion
    const firstRow = authenticatedPage.locator('tbody tr').first();
    const productName = await firstRow.locator('td >> nth=0 >> span').first().innerText();

    // Setup dialog handler for confirm
    authenticatedPage.on('dialog', dialog => dialog.accept());

    await firstRow.locator('button:has-text("Șterge")').click();

    // Verify product no longer in list
    await expect(authenticatedPage.locator('table')).not.toContainText(productName);
  });
});
