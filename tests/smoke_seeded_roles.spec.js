import { test, expect } from '@playwright/test';

const PASSWORD = 'Test@123';

// Use the same tenants that exist in smoke_tests.spec.js
const TENANTS = [
  { code: 'city_general', label: 'City General Hospital' },
];

const ROLES = [
  { key: 'admin', email: 'lisa.white@citygen.local', displayName: 'Lisa White' },
  { key: 'nurse', email: 'sarah.jones@citygen.local', displayName: 'Sarah Jones' },
  { key: 'lab', email: 'michael.brown@citygen.local', displayName: 'Michael Brown' },
  { key: 'billing', email: 'robert.billing@citygen.local', displayName: 'Robert' },
];

async function login(page, tenantLabel, email) {
  await page.goto('/');
  
  // Wait for tenant select to load
  await page.locator('select[name="tenantId"]').waitFor({ state: 'visible', timeout: 10000 });
  
  // Login
  await page.locator('select[name="tenantId"]').selectOption({ label: tenantLabel });
  await page.getByPlaceholder('name@hospital.org').fill(email);
  await page.getByPlaceholder('Enter your secure password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

for (const tenant of TENANTS) {
  for (const role of ROLES) {
    test(`Smoke: ${role.key} login works on ${tenant.code}`, async ({ page }) => {
      await login(page, tenant.label, role.email);

      await expect(page.getByRole('button', { name: /Sign Out/i })).toBeVisible({ timeout: 20000 });
      await expect(page.getByText(role.displayName).first()).toBeVisible({ timeout: 20000 });
    });
  }
}
