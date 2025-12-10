import { test, expect } from '@playwright/test';

test('booking flow validation', async ({ page }) => {
    // Go to the booking page directly
    await page.goto('/book/instylehairboutique');

    // 1. Select Service
    // Wait for services to load (they are fetched from API)
    await expect(page.locator('h3', { hasText: 'Middle & Side Installation' })).toBeVisible({ timeout: 10000 });
    await page.locator('h3', { hasText: 'Middle & Side Installation' }).click();

    // 2. Enter Details
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.fill('input[placeholder="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder="Phone Number"]', '1234567890');

    // 3. Select Date & Time
    // Set a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateStr);

    await page.selectOption('select', '10:00');

    // 4. Submit
    // Click the Pay button
    await page.click('button:has-text("Pay")');

    // Expect an alert or error message because of the missing fields
    // Since we can't easily check window.alert in Playwright without handling the dialog,
    // we'll check if the button shows "Processing..." and then reverts or if an error log appears.
    // But actually, we expect the API to return 400.

    // We can intercept the network request to check the response
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/book') && response.request().method() === 'POST');

    // Click again to trigger if needed, or just wait for the previous click to process
    // (The previous click should have triggered it)

    const response = await responsePromise;
    const body = await response.json();

    console.log('Booking API Response:', body);

    // We expect it to succeed
    expect(response.status()).toBe(200); // Or 201, checking the log it returned 200 (default for NextResponse.json)
    expect(body.success).toBe(true);
    expect(body.appointmentId).toBeDefined();
});
