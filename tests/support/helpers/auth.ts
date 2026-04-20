import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for login to complete
  await page.waitForURL(/.*(dashboard|firme)/, { timeout: 20000 });

  // IMPORTANT: Set the cookie manually so the server knows we have a company selected
  await page.context().addCookies([
    {
      name: 'bizhub_selected_company',
      value: '8', // Our E2E test company ID
      domain: 'localhost',
      path: '/',
    }
  ]);

  // Navigate to dashboard with the ID in URL as backup
  await page.goto('/dashboard?companyId=8');

  // Final check for the welcome message
  await expect(page.locator('h2')).toContainText(/Salut/, { timeout: 15000 });
}

export async function logout(page: Page) {
  await page.click('button:has-text("Deconectare")');
  await expect(page).toHaveURL(/.*login/);
}
