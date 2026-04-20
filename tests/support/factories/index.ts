/**
 * Simple data factory for products
 */
export const productFactory = (overrides = {}) => ({
  nume: `Test Product ${Date.now()}`,
  descriere: 'Automatically generated test product description.',
  pret: 1000, // 10.00 RON
  stoc: 50,
  ...overrides,
});

/**
 * Simple data factory for companies
 */
export const companyFactory = (overrides = {}) => ({
  nume: `Test Company ${Date.now()}`,
  cui: `RO${Math.floor(Math.random() * 10000000)}`,
  ...overrides,
});
