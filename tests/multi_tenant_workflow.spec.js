import { test, expect } from '@playwright/test';

const CLIENT_URL = 'http://127.0.0.1:5175';

const users = [
    // City General Hospital (city_general)
    {
        name: 'Admin Lisa White',
        email: 'lisa.white@citygen.local',
        tenant: 'City General Hospital',
        role: 'Admin',
        expectedText: 'Manage Access'
    },
    {
        name: 'Dr. Emily Chen',
        email: 'emily.chen@citygen.local',
        tenant: 'City General Hospital',
        role: 'Doctor',
        expectedText: 'Appointments'
    },
    {
        name: 'Nurse Sarah Jones',
        email: 'sarah.jones@citygen.local',
        tenant: 'City General Hospital',
        role: 'Nurse',
        expectedText: 'Patients'
    },

    // Valley Health Clinic (valley_health)
    {
        name: 'Dr. Mark Davis',
        email: 'mark.davis@valley.local',
        tenant: 'Valley Health Clinic',
        role: 'Doctor',
        expectedText: 'Appointments'
    },

    // Kidz Clinic (SCH)
    {
        name: 'Dr. Anita Sharma',
        email: 'anita@sch.local',
        tenant: 'Kidz Clinic',
        role: 'Admin',
        expectedText: 'Manage Access'
    },
    {
        name: 'Meera Pharmacist',
        email: 'meera@sch.local',
        tenant: 'Kidz Clinic',
        role: 'Pharmacy',
        expectedText: 'Dispense'
    }
];

test.describe('Multi-Tenant User Workflows', () => {

    for (const user of users) {
        test(`Login and Verify Workflow for ${user.name} (${user.role} at ${user.tenant})`, async ({ page }) => {
            console.log(`Testing login for ${user.name}...`);

            await page.goto(CLIENT_URL);

            // Select Tenant
            await page.selectOption('select', { label: user.tenant });

            // Fill Credentials
            await page.fill('input[type="email"]', user.email);
            await page.fill('input[type="password"]', 'Test@123'); // Assuming default password

            // Login
            await page.click('button[type="submit"]');

            // Verify Dashboard access
            // We expect some role-specific content or just the main dashboard
            // Adjust timeout for potential cold starts
            await expect(page.locator('#root')).toBeVisible();

            // Check for specific element based on role logic if possible, 
            // or at least that we are NOT on the login page anymore
            await expect(page.locator('text=Sign In')).not.toBeVisible({ timeout: 10000 });

            // Check for role-specific expected text
            if (user.expectedText) {
                await expect(page.getByText(user.expectedText).first()).toBeVisible();
            }

            console.log(`Successfully verified ${user.name}`);

            // Cleanup / Logout
            // Locate logout button - usually in sidebar or header
            // If logout is not easily clickable, we can just clear cookies or rely on independent browser contexts (default in Playwright per test)
            // But let's try to logout cleanly if possible to test that flow too
            const logoutBtn = page.getByText('Logout');
            if (await logoutBtn.isVisible()) {
                await logoutBtn.click();
                await expect(page.locator('text=Sign In')).toBeVisible();
            }
        });
    }
});
