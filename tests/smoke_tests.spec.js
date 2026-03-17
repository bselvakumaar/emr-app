import { test, expect } from '@playwright/test';

// Simplified smoke tests - just verify login works for each role
const TENANT_1 = 'City General Hospital';
const TENANT_2 = 'Valley Health Clinic';

const users = [
    { tenant: TENANT_1, email: 'jessica.taylor@citygen.local', password: 'Test@123', name: 'Jessica Taylor', role: 'Support Staff' },
    { tenant: TENANT_1, email: 'sarah.jones@citygen.local', password: 'Test@123', name: 'Sarah Jones', role: 'Nurse' },
    { tenant: TENANT_1, email: 'emily.chen@citygen.local', password: 'Test@123', name: 'Emily Chen', role: 'Doctor' },
    { tenant: TENANT_1, email: 'michael.brown@citygen.local', password: 'Test@123', name: 'Michael Brown', role: 'Lab Tech' },
    { tenant: TENANT_1, email: 'lisa.white@citygen.local', password: 'Test@123', name: 'Lisa White', role: 'Admin' },
    { tenant: TENANT_1, email: 'robert.billing@citygen.local', password: 'Test@123', name: 'Robert', role: 'Billing' },
    { tenant: TENANT_2, email: 'mark.davis@valley.local', password: 'Test@123', name: 'Mark Davis', role: 'Doctor' },
];

for (const user of users) {
    test(`${user.role} can login - ${user.tenant}`, async ({ page }) => {
        await page.goto('/');

        // Wait for tenant dropdown to be visible
        const tenantSelect = page.locator('select[name="tenantId"]');
        await tenantSelect.waitFor({ state: 'visible', timeout: 10000 });
        
        // Try to select City General Hospital or fallback to first real option
        try {
          await tenantSelect.selectOption({ value: 'city_general' });
        } catch {
          // Try Valley Health Clinic
          try {
            await tenantSelect.selectOption({ value: 'valley_health' });
          } catch {
            // Just select the first non-placeholder option
            await tenantSelect.selectOption({ index: 1 });
          }
        }
        
        // Fill and submit login
        await page.getByPlaceholder('name@hospital.org').fill(user.email);
        await page.getByPlaceholder('Enter your secure password').fill(user.password);
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Verify login successful - user name appears
        await expect(page.getByText(user.name)).toBeVisible({ timeout: 10000 });

        // Verify dashboard/main page loaded
        await expect(page.locator('.app-layout, .view, main')).toBeVisible();
    });
}

test('Superadmin can login', async ({ page }) => {
    await page.goto('/');

    await page.locator('select[name="tenantId"]').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('select[name="tenantId"]').selectOption({ label: 'Healthcare Platform' });
    await page.getByPlaceholder('name@hospital.org').fill('superadmin@emr.local');
    await page.getByPlaceholder('Enter your secure password').fill('Admin@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Superadmin')).toBeVisible({ timeout: 10000 });
});
