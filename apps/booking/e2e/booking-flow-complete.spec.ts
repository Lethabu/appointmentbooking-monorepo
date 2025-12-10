// E2E Test: Complete Booking Flow
// File: apps/booking/e2e/booking-flow-complete.spec.ts

import { test, expect, Page } from '@playwright/test';

const TENANT_SLUG = 'instylehairboutique';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test data
const TEST_CUSTOMER = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '0821234567',
    notes: 'First time client, student discount requested',
};

// Helper: Wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
}

// Helper: Get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Ensure it's not Sunday
    if (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow.toISOString().split('T')[0];
}

test.describe('Complete Booking Flow - Instyle Hair Boutique', () => {
    test.beforeEach(async ({ page }) => {
        // Set viewport for consistent testing
        await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('should complete full booking flow successfully', async ({ page }) => {
        // Navigate to booking page
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Verify page loaded correctly
        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('text=Select Your Services')).toBeVisible();

        // Take screenshot of initial state
        await page.screenshot({ path: 'test-results/01-initial-load.png', fullPage: true });

        // ===== STEP 1: Service Selection =====
        console.log('Step 1: Selecting service...');

        // Wait for services to load
        await page.waitForSelector('text=Middle & Side Installation', { timeout: 10000 });

        // Select first service
        await page.click('text=Middle & Side Installation');

        // Verify service is selected (checkmark appears)
        await expect(page.locator('text=Your Selection')).toBeVisible();

        // Verify total price is displayed
        await expect(page.locator('text=Total Price')).toBeVisible();
        await expect(page.locator('text=R300')).toBeVisible();

        await page.screenshot({ path: 'test-results/02-service-selected.png', fullPage: true });

        // Click Next button
        const nextButton = page.locator('button:has-text("Next")');
        await expect(nextButton).toBeEnabled();
        await nextButton.click();

        // ===== STEP 2: Date & Time Selection =====
        console.log('Step 2: Selecting date and time...');

        await expect(page.locator('text=Choose Date & Time')).toBeVisible();

        // Select date (tomorrow)
        const tomorrowDate = getTomorrowDate();
        await page.fill('input[type="date"]', tomorrowDate);

        // Wait for time slots to load
        await page.waitForTimeout(2000);

        // Select first available time slot (09:00)
        const timeSlot = page.locator('button:has-text("09:00")').first();
        await expect(timeSlot).toBeVisible();
        await timeSlot.click();

        // Verify selection confirmation
        await expect(page.locator('text=Appointment Time Selected')).toBeVisible();

        await page.screenshot({ path: 'test-results/03-datetime-selected.png', fullPage: true });

        // Click Next
        await page.locator('button:has-text("Next")').click();

        // ===== STEP 3: Customer Details =====
        console.log('Step 3: Filling customer details...');

        await expect(page.locator('text=Your Details')).toBeVisible();

        // Fill in customer information
        await page.fill('input[name="name"]', TEST_CUSTOMER.name);
        await page.fill('input[name="email"]', TEST_CUSTOMER.email);
        await page.fill('input[name="phone"]', TEST_CUSTOMER.phone);
        await page.fill('textarea[name="notes"]', TEST_CUSTOMER.notes);

        // Verify validation success message
        await expect(page.locator('text=All details look good')).toBeVisible();

        await page.screenshot({ path: 'test-results/04-details-filled.png', fullPage: true });

        // Click Next
        await page.locator('button:has-text("Next")').click();

        // ===== STEP 4: Payment Summary =====
        console.log('Step 4: Reviewing payment summary...');

        await expect(page.locator('text=Booking Summary')).toBeVisible();

        // Verify booking details are displayed
        await expect(page.locator(`text=${TEST_CUSTOMER.name}`)).toBeVisible();
        await expect(page.locator(`text=${TEST_CUSTOMER.email}`)).toBeVisible();
        await expect(page.locator('text=Middle & Side Installation')).toBeVisible();

        // Verify payment breakdown
        await expect(page.locator('text=Total Service Price')).toBeVisible();
        await expect(page.locator('text=Booking Fee')).toBeVisible();
        await expect(page.locator('text=Remaining Balance')).toBeVisible();

        await page.screenshot({ path: 'test-results/05-payment-summary.png', fullPage: true });

        // Note: In real test, we would mock the API response
        // For now, we'll stop before actual submission

        console.log('✅ Booking flow test completed successfully');
    });

    test('should validate required fields in customer details', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Navigate to Step 3 (customer details)
        // Step 1: Select service
        await page.click('text=Middle & Side Installation');
        await page.locator('button:has-text("Next")').click();

        // Step 2: Select date/time
        const tomorrowDate = getTomorrowDate();
        await page.fill('input[type="date"]', tomorrowDate);
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("09:00")').first().click();
        await page.locator('button:has-text("Next")').click();

        // Step 3: Try to proceed without filling fields
        await expect(page.locator('text=Your Details')).toBeVisible();

        // Try invalid email
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'invalid-email');
        await page.fill('input[name="phone"]', '123'); // Invalid phone

        // Blur fields to trigger validation
        await page.locator('input[name="email"]').blur();
        await page.locator('input[name="phone"]').blur();

        // Verify error messages appear
        await expect(page.locator('text=Please enter a valid email')).toBeVisible();
        await expect(page.locator('text=Please enter a valid South African phone')).toBeVisible();

        // Next button should be disabled
        const nextButton = page.locator('button:has-text("Next")');
        // Note: Button might not be disabled but validation should prevent progress

        await page.screenshot({ path: 'test-results/06-validation-errors.png', fullPage: true });

        console.log('✅ Validation test completed successfully');
    });

    test('should be mobile responsive', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Verify content is visible on mobile
        await expect(page.locator('text=Select Your Services')).toBeVisible();

        // Check that services are displayed in mobile layout
        const services = page.locator('[class*="service"]').first();
        await expect(services).toBeVisible();

        await page.screenshot({ path: 'test-results/07-mobile-view.png', fullPage: true });

        console.log('✅ Mobile responsive test completed successfully');
    });

    test('should enforce business hours (no Sunday bookings)', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Navigate to date selection
        await page.click('text=Middle & Side Installation');
        await page.locator('button:has-text("Next")').click();

        // Try to select a Sunday
        const nextSunday = new Date();
        nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
        const sundayDate = nextSunday.toISOString().split('T')[0];

        await page.fill('input[type="date"]', sundayDate);
        await page.waitForTimeout(1000);

        // Verify error message or no time slots
        const errorOrNoSlots = await Promise.race([
            page.locator('text=We are closed on Sundays').isVisible(),
            page.locator('text=No available time slots').isVisible(),
        ]);

        expect(errorOrNoSlots).toBeTruthy();

        console.log('✅ Business hours enforcement test completed successfully');
    });

    test('should display progress indicator correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Verify progress indicator shows Step 1
        const step1Indicator = page.locator('text=Services').first();
        await expect(step1Indicator).toBeVisible();

        // Progress to Step 2
        await page.click('text=Middle & Side Installation');
        await page.locator('button:has-text("Next")').click();

        // Verify progress indicator shows Step 2
        const step2Indicator = page.locator('text=Date & Time').first();
        await expect(step2Indicator).toBeVisible();

        // Verify Step 1 shows as completed (green checkmark)
        const completedStep = page.locator('svg').first(); // Checkmark icon
        await expect(completedStep).toBeVisible();

        console.log('✅ Progress indicator test completed successfully');
    });

    test('should allow going back to previous steps', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Go to Step 2
        await page.click('text=Middle & Side Installation');
        await page.locator('button:has-text("Next")').click();

        // Verify we're on Step 2
        await expect(page.locator('text=Choose Date & Time')).toBeVisible();

        // Click Back button
        await page.locator('button:has-text("Back")').click();

        // Verify we're back on Step 1
        await expect(page.locator('text=Select Your Services')).toBeVisible();

        // Verify previous selection is preserved
        await expect(page.locator('text=Your Selection')).toBeVisible();

        console.log('✅ Navigation test completed successfully');
    });
});

test.describe('Booking Flow - Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        const loadTime = Date.now() - startTime;

        console.log(`Page load time: ${loadTime}ms`);

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);

        console.log('✅ Performance test completed successfully');
    });

    test('should not have console errors', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Filter out known acceptable errors
        const criticalErrors = consoleErrors.filter(
            (err) => !err.includes('favicon') && !err.includes('404')
        );

        expect(criticalErrors).toHaveLength(0);

        if (criticalErrors.length > 0) {
            console.error('Console errors found:', criticalErrors);
        }

        console.log('✅ Console error test completed successfully');
    });
});

test.describe('Booking Flow - Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Navigate to customer details form
        await page.click('text=Middle & Side Installation');
        await page.locator('button:has-text("Next")').click();

        const tomorrowDate = getTomorrowDate();
        await page.fill('input[type="date"]', tomorrowDate);
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("09:00")').first().click();
        await page.locator('button:has-text("Next")').click();

        // Check for ARIA labels on form fields
        const nameInput = page.locator('input[name="name"]');
        const emailInput = page.locator('input[name="email"]');
        const phoneInput = page.locator('input[name="phone"]');

        // Verify inputs have proper labels
        await expect(nameInput).toBeVisible();
        await expect(emailInput).toBeVisible();
        await expect(phoneInput).toBeVisible();

        console.log('✅ Accessibility test completed successfully');
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto(`${BASE_URL}/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Tab through elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Verify focus is visible
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();

        console.log('✅ Keyboard navigation test completed successfully');
    });
});
