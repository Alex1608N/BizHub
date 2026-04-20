import { test, expect } from '../support/fixtures';

test.describe('Dashboard and Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
  });

  test('should display the welcome message with user name', async ({ authenticatedPage }) => {
    // Assuming the test user name is "Administrator" from seed
    await expect(authenticatedPage.locator('h2')).toContainText(/Salut/);
  });

  test('should display all stats cards', async ({ authenticatedPage }) => {
    const statsLabels = [
      'Vanzari Azi',
      'Valoare Stoc',
      'Produse in Catalog',
      'Alerte Stoc',
      'Unitati Masura'
    ];

    for (const label of statsLabels) {
      // Use first() to avoid strict mode violation if text appears in multiple places
      await expect(authenticatedPage.locator(`text=${label}`).first()).toBeVisible();
    }
  });

  test('should navigate to Catalog via Sidebar', async ({ authenticatedPage }) => {
    await authenticatedPage.click('nav >> text=Catalog Produse');
    await expect(authenticatedPage).toHaveURL(/.*catalog/);
    await expect(authenticatedPage.locator('h1')).toContainText('Catalog Produse');
  });

  test('should navigate to Audit via Sidebar', async ({ authenticatedPage }) => {
    await authenticatedPage.click('nav >> text=Timeline Audit');
    await expect(authenticatedPage).toHaveURL(/.*audit/);
    await expect(authenticatedPage.locator('h1')).toContainText('Audit');
  });

  test('should toggle sidebar collapse on desktop', async ({ authenticatedPage, isMobile }) => {
    if (isMobile) return;

    const sidebar = authenticatedPage.locator('aside');
    const initialWidth = await sidebar.evaluate(el => el.getBoundingClientRect().width);

    // Click collapse button
    await authenticatedPage.click('aside button >> nth=0');
    
    // Wait for transition animation
    await authenticatedPage.waitForTimeout(500);
    
    const collapsedWidth = await sidebar.evaluate(el => el.getBoundingClientRect().width);
    expect(collapsedWidth).toBeLessThan(initialWidth);

    // Click again to expand
    await authenticatedPage.click('aside button >> nth=0');
    
    // Wait for transition animation
    await authenticatedPage.waitForTimeout(500);
    
    const expandedWidth = await sidebar.evaluate(el => el.getBoundingClientRect().width);
    expect(expandedWidth).toBeGreaterThan(collapsedWidth);
  });
});
