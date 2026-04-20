import { test, expect } from '../support/fixtures';
import { productFactory } from '../support/factories';

test.describe('Audit Trail', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/audit');
  });

  test('should display audit logs list', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1')).toContainText('Timeline Audit');
    // Check if there's at least one log entry or the empty message
    const logEntries = authenticatedPage.locator('.divide-y > div');
    const emptyMessage = authenticatedPage.locator('text=Nu s-au găsit loguri');
    
    const count = await logEntries.count();
    if (count === 0) {
      await expect(emptyMessage).toBeVisible();
    } else {
      await expect(logEntries.first()).toBeVisible();
    }
  });

  test('should filter logs by date', async ({ authenticatedPage }) => {
    // Set a date that likely has no logs (far future)
    await authenticatedPage.fill('input[type="date"] >> nth=0', '2050-01-01');
    await authenticatedPage.fill('input[type="date"] >> nth=1', '2050-12-31');

    // Wait for the UI to update
    await authenticatedPage.waitForTimeout(1000);

    const emptyIndicators = [
        'Nu s-au găsit loguri',
        'Nicio înregistrare pentru intervalul selectat'
    ];
    
    // Check main content area specifically
    const content = await authenticatedPage.locator('main').innerText();
    const found = emptyIndicators.some(msg => content.includes(msg));
    expect(found).toBe(true);
    
    // Reset filters
    await authenticatedPage.click('text=Resetează');
  });

  test('should record an audit log when a product is added', async ({ authenticatedPage }) => {
    const product = productFactory();

    // 1. Go to catalog and add product
    await authenticatedPage.goto('/catalog');
    await authenticatedPage.click('button:has-text("Adaugă Produs")');
    await authenticatedPage.fill('input[placeholder="ex: Șuruburi 10mm"]', product.nume);
    await authenticatedPage.fill('input[type="number"] >> nth=0', "10");
    await authenticatedPage.fill('input[type="number"] >> nth=1', "5");
    await authenticatedPage.click('button:has-text("Salvează Produs")');
    await expect(authenticatedPage.locator('table')).toContainText(product.nume);

    // 2. Go to audit and check for the log
    await authenticatedPage.goto('/audit');
    
    // Wait for the log to appear (might be indexed at the top)
    const firstLog = authenticatedPage.locator('.divide-y > div').first();
    await expect(firstLog).toContainText('CREATE');
    await expect(firstLog).toContainText(product.nume);
  });
});
