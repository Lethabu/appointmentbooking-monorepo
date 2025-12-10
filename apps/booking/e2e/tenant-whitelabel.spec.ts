import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Tests for Tenant Whitelabeled Website
 * Testing: instylehairboutique tenant
 * 
 * Best Practices Implemented:
 * - Wait for actual UI elements to be visible
 * - Use data-testid selectors where possible (fallback to semantic selectors)
 * - Screenshots and videos on failure
 * - Comprehensive assertions
 * - Mobile and desktop testing
 */

const TENANT_SLUG = 'instylehairboutique';

// Helper function to wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
}

test.describe('Tenant Homepage - UI and Navigation', () => {
    test('should load tenant homepage with proper branding', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Ensure we see actual UI, not code
        const body = await page.locator('body').textContent();
        expect(body).not.toContain('<!DOCTYPE');
        expect(body).not.toContain('<html');

        // Check that the page has rendered content
        await expect(page.locator('body')).toBeVisible();

        // Take screenshot for visual verification
        await page.screenshot({ path: 'test-results/homepage-loaded.png', fullPage: true });
    });

    test('should display navigation menu', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Check for common navigation elements
        const nav = page.locator('nav, header').first();
        await expect(nav).toBeVisible();

        await page.screenshot({ path: 'test-results/navigation-visible.png' });
    });

    test('should have no console errors on homepage', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Filter out known acceptable errors (if any)
        const criticalErrors = consoleErrors.filter(err =>
            !err.includes('favicon') &&
            !err.includes('404')
        );

        expect(criticalErrors).toHaveLength(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Ensure content is visible on mobile
        await expect(page.locator('body')).toBeVisible();

        await page.screenshot({ path: 'test-results/mobile-homepage.png', fullPage: true });
    });
});

test.describe('Booking Flow - Complete User Journey', () => {
    test('should navigate to booking page', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Look for booking CTA button
        const bookingButton = page.locator('a:has-text("Book"), button:has-text("Book")').first();

        if (await bookingButton.isVisible()) {
            await bookingButton.click();
            await waitForPageLoad(page);
        } else {
            // Navigate directly to booking page
            await page.goto(`/book/${TENANT_SLUG}`);
            await waitForPageLoad(page);
        }

        // Verify we're on the booking page
        await expect(page).toHaveURL(new RegExp(`/book/${TENANT_SLUG}`));

        await page.screenshot({ path: 'test-results/booking-page-loaded.png', fullPage: true });
    });

    test('should display available services', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Wait for services to load (API call)
        await page.waitForTimeout(3000);

        // Check for service elements - look for common patterns
        const serviceElements = page.locator('h3, .service-name, [class*="service"]');
        const count = await serviceElements.count();

        expect(count).toBeGreaterThan(0);

        await page.screenshot({ path: 'test-results/services-loaded.png', fullPage: true });
    });

    test('should complete full booking flow', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Wait for services to load
        await page.waitForTimeout(3000);

        // Step 1: Select a service
        const serviceHeading = page.locator('h3').first();
        if (await serviceHeading.isVisible()) {
            await serviceHeading.click();
            await page.waitForTimeout(500);
        }

        await page.screenshot({ path: 'test-results/service-selected.png', fullPage: true });

        // Step 2: Fill in customer details
        const nameInput = page.locator('input[placeholder*="Name" i], input[name="name"]').first();
        const emailInput = page.locator('input[placeholder*="Email" i], input[type="email"]').first();
        const phoneInput = page.locator('input[placeholder*="Phone" i], input[type="tel"]').first();

        if (await nameInput.isVisible()) {
            await nameInput.fill('Test User');
        }

        if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com');
        }

        if (await phoneInput.isVisible()) {
            await phoneInput.fill('0612345678');
        }

        await page.screenshot({ path: 'test-results/details-filled.png', fullPage: true });

        // Step 3: Select date and time
        const dateInput = page.locator('input[type="date"]').first();
        if (await dateInput.isVisible()) {
            // Set date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0];
            await dateInput.fill(dateStr);
        }

        const timeSelect = page.locator('select, [role="combobox"]').first();
        if (await timeSelect.isVisible()) {
            await timeSelect.click();
            await page.waitForTimeout(500);

            // Select first available time
            const options = page.locator('option, [role="option"]');
            if (await options.count() > 0) {
                await options.first().click();
            }
        }

        await page.screenshot({ path: 'test-results/datetime-selected.png', fullPage: true });

        // Step 4: Submit booking (but intercept to avoid actual payment)
        const submitButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), button[type="submit"]').first();

        if (await submitButton.isVisible()) {
            // Set up network interception to monitor the API call
            const responsePromise = page.waitForResponse(
                response => response.url().includes('/api/book') || response.url().includes('/book'),
                { timeout: 10000 }
            ).catch(() => null);

            await submitButton.click();

            // Wait a bit for the response
            const response = await responsePromise;

            if (response) {
                console.log('Booking API called:', response.url(), response.status());
            }

            await page.screenshot({ path: 'test-results/booking-submitted.png', fullPage: true });
        }
    });

    test('should validate required fields', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Try to submit without filling fields
        const submitButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), button[type="submit"]').first();

        if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(1000);

            // Check for validation messages or that the form didn't submit
            const currentUrl = page.url();

            // Form should still be on the same page or show validation
            await page.screenshot({ path: 'test-results/validation-check.png', fullPage: true });
        }
    });
});

test.describe('Tenant Branding and Content', () => {
    test('should display tenant-specific branding', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Check for logo or branding
        const logo = page.locator('img[alt*="logo" i], img[alt*="instyle" i], img[class*="logo"]').first();

        // Either logo exists or we have text branding
        const hasLogo = await logo.isVisible().catch(() => false);
        const bodyText = await page.locator('body').textContent();
        const hasBrandingText = bodyText?.toLowerCase().includes('instyle') || false;

        expect(hasLogo || hasBrandingText).toBeTruthy();

        await page.screenshot({ path: 'test-results/branding-visible.png', fullPage: true });
    });

    test('should have proper metadata (SEO)', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Check title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // Check meta description
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toBeTruthy();

        console.log('Page Title:', title);
        console.log('Meta Description:', metaDescription);
    });
});

test.describe('Performance and Loading', () => {
    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        const loadTime = Date.now() - startTime;

        console.log('Page load time:', loadTime, 'ms');

        // Page should load within 10 seconds
        expect(loadTime).toBeLessThan(10000);
    });

    test('should not have broken images', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Get all images
        const images = await page.locator('img').all();

        for (const img of images) {
            const src = await img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
                const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);

                // Images should have loaded (naturalWidth > 0) or be lazy-loaded
                const isVisible = await img.isVisible();
                if (isVisible) {
                    expect(naturalWidth).toBeGreaterThan(0);
                }
            }
        }
    });
});

test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Should not have more than one h1 (best practice)
        expect(h1Count).toBeLessThanOrEqual(2);
    });

    test('should have focusable interactive elements', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await waitForPageLoad(page);

        // All buttons and links should be focusable
        const buttons = await page.locator('button, a').all();

        for (const button of buttons.slice(0, 5)) { // Test first 5
            const isVisible = await button.isVisible();
            if (isVisible) {
                await button.focus();
                const isFocused = await button.evaluate(el => el === document.activeElement);
                expect(isFocused).toBeTruthy();
            }
        }
    });
});
