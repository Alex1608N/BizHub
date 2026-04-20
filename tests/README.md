# BizHub Test Suite

Production-ready E2E testing framework powered by [Playwright](https://playwright.dev/).

## ę Architecture

- **`tests/e2e/`**: Functional end-to-end tests.
- **`tests/support/fixtures/`**: Playwright fixtures for authenticated state and shared context.
- **`tests/support/helpers/`**: Common actions (auth, navigation, database seeding).
- **`tests/support/factories/`**: Dynamic test data generation.

## đźš€ Getting Started

1. **Prerequisites**: Ensure you have [Node.js 22+](https://nodejs.org/) installed.
2. **Install Dependencies**:
   ```bash
   npm install
   npx playwright install --with-deps
   ```
3. **Environment Setup**: Copy `.env.example` to `.env` and fill in the test credentials.

## đź“– Running Tests

- **Run all tests (headless)**:
  ```bash
  npm run test:e2e
  ```
- **Run tests with UI mode (Interactive)**:
  ```bash
  npm run test:e2e:ui
  ```
- **Debug a specific test**:
  ```bash
  npx playwright test auth.spec.ts --debug
  ```

## đź’ˇ Best Practices

- **Selectors**: Prefer `data-testid` or user-facing locators (`getByText`, `getByRole`).
- **Isolation**: Each test should be independent. Use factories to generate fresh data.
- **Cleanup**: Use `afterEach` or global teardown to clean up DB state if not using a transient DB.
