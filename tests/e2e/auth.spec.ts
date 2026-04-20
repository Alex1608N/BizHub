import { test, expect } from '../support/fixtures';
import { login } from '../support/helpers/auth';

test.describe('Authentication Flows', () => {
  test('should allow a user to login successfully', async ({ page }) => {
    // Note: These credentials should ideally come from environment variables
    const email = process.env.TEST_USER_EMAIL || 'kipizltu@yahoo.com';
    const password = process.env.TEST_USER_PASSWORD || 'parola';

    await login(page, email, password);
    
    await expect(page.locator('h2')).toContainText(/Salut/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@user.ro');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Adjust this selector based on your actual error message element
    await expect(page.locator('text=Email sau parolă incorectă')).toBeVisible();
  });
});
