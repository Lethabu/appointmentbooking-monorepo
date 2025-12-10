import { test, expect } from '@playwright/test';

test('should redirect from home to tenant page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/instylehairboutique/);
});

test('should show tenant not found or content', async ({ page }) => {
    await page.goto('/instylehairboutique');
    // Either we see "Tenant not found" or the actual content.
    // We just want to ensure it doesn't crash (500).
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
});
