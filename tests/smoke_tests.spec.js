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

        // Wait for tenant dropdown to load
        await page.locator('select[name="tenantId"]').locator(`option:text("${user.tenant}")`).waitFor({ timeout: 10000 });

        // Login
        await page.locator('select[name="tenantId"]').selectOption({ label: user.tenant });
        await page.getByPlaceholder('Email address').fill(user.email);
        await page.getByPlaceholder('Password').fill(user.password);
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Verify login successful - user name appears
        await expect(page.getByText(user.name)).toBeVisible({ timeout: 10000 });

        // Verify dashboard/main page loaded
        await expect(page.locator('.app-layout, .view, main')).toBeVisible();
    });
}

test('Superadmin can login', async ({ page }) => {
    await page.goto('/');

    await page.locator('select[name="tenantId"]').selectOption({ label: 'Platform Superadmin' });
    await page.getByPlaceholder('Email address').fill('superadmin@emr.local');
    await page.getByPlaceholder('Password').fill('Admin@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Superadmin')).toBeVisible({ timeout: 10000 });
});
