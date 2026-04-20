import { test as base, Page } from '@playwright/test';
import { login } from '../helpers/auth';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const email = process.env.TEST_USER_EMAIL || 'kipizltu@yahoo.com';
    const password = process.env.TEST_USER_PASSWORD || 'parola';

    await login(page, email, password);
    await use(page);
  },
});

export { expect } from '@playwright/test';
