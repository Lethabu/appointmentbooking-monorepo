import { test, expect, Page } from '@playwright/test';

/**
 * Focused E2E Tests for InStyle Hair Boutique Whitelabeled Tenant
 * 
 * Best Practices:
 * - Explicit waits for dynamic content
 * - Network idle states before assertions
 * - Proper error handling
 * - Visual regression capture
 */

const TENANT_SLUG = 'instylehairboutique';
const BASE_URL = `http://localhost:3000`;

// Helper to ensure page is fully loaded
async function ensurePageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(2000); // Additional buffer for React hydration
}

test.describe('Tenant UI Verification Tests', () => {
    test('should load tenant homepage and display UI (not HTML code)', async ({ page }) => {
        // Navigate to tenant page
        await page.goto(`/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Verify we're seeing rendered UI, not raw HTML
        const bodyContent = await page.locator('body').textContent();

        // These should NOT appear in rendered UI
        expect(bodyContent).not.toContain('<!DOCTYPE');
        expect(bodyContent).not.toContain('<html>');
        expect(bodyContent).not.toContain('<head>');

        // Body should be visible and have content
        await expect(page.locator('body')).toBeVisible();

        // Take full page screenshot for manual verification
        await page.screenshot({
            path: 'test-results/homepage-ui-rendered.png',
            fullPage: true
        });

        console.log('✓ Homepage loaded with proper UI rendering');
    });

    test('should have no critical JavaScript errors', async ({ page }) => {
        const jsErrors: string[] = [];

        // Capture console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });

        // Capture page errors
        page.on('pageerror', error => {
            jsErrors.push(error.message);
        });

        await page.goto(`/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Filter out non-critical errors
        const criticalErrors = jsErrors.filter(err =>
            !err.includes('favicon') &&
            !err.includes('404') &&
            !err.toLowerCase().includes('warning')
        );

        if (criticalErrors.length > 0) {
            console.log('JavaScript Errors Found:', criticalErrors);
        }

        expect(criticalErrors).toHaveLength(0);
    });

    test('should navigate to booking page with UI', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Verify URL
        expect(page.url()).toContain(`/book/${TENANT_SLUG}`);

        // Verify UI is rendered
        const bodyContent = await page.locator('body').textContent();
        expect(bodyContent).not.toContain('<!DOCTYPE');

        // Take screenshot
        await page.screenshot({
            path: 'test-results/booking-page-ui-rendered.png',
            fullPage: true
        });

        console.log('✓ Booking page loaded with proper UI rendering');
    });

    test('should display services on booking page', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Wait for services to load from API
        await page.waitForTimeout(5000);

        // Check for service-related elements
        const hasH3Headings = await page.locator('h3').count() > 0;
        const hasServiceText = (await page.locator('body').textContent())?.includes('Installation') ?? false;

        // At least one service should be visible
        expect(hasH3Headings || hasServiceText).toBeTruthy();

        await page.screenshot({
            path: 'test-results/services-displayed.png',
            fullPage: true
        });

        console.log('✓ Services are being displayed');
    });
});

test.describe('Booking Flow End-to-End', () => {
    test('should allow service selection', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Wait for services
        await page.waitForTimeout(5000);

        // Try to select first service
        const firstService = page.locator('h3, [class*="service"], [data-testid*="service"]').first();

        if (await firstService.isVisible()) {
            await firstService.click();
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: 'test-results/service-selected.png',
                fullPage: true
            });

            console.log('✓ Service selection works');
        } else {
            console.log('⚠ No clickable services found - may need to adjust selectors');
        }
    });

    test('should display booking form fields', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Look for common form inputs
        const nameInput = page.locator('input[placeholder*="name" i], input[name*="name"]').first();
        const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
        const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();

        const inputs = [
            { locator: nameInput, name: 'Name' },
            { locator: emailInput, name: 'Email' },
            { locator: phoneInput, name: 'Phone' }
        ];

        const visibleInputs = [];
        for (const input of inputs) {
            if (await input.locator.isVisible().catch(() => false)) {
                visibleInputs.push(input.name);
            }
        }

        console.log('Visible form fields:', visibleInputs);

        await page.screenshot({
            path: 'test-results/booking-form-fields.png',
            fullPage: true
        });

        // Should have at least some form fields
        expect(visibleInputs.length).toBeGreaterThan(0);
    });
});

test.describe('Mobile Responsiveness', () => {
    test('should display properly on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto(`/${TENANT_SLUG}`);
        await ensurePageReady(page);

        // Verify content is visible
        await expect(page.locator('body')).toBeVisible();

        // Check for horizontal scroll (bad UX)
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        // Some horizontal scroll is okay, but excessive is bad
        expect(hasHorizontalScroll).toBe(false);

        await page.screenshot({
            path: 'test-results/mobile-responsive.png',
            fullPage: true
        });

        console.log('✓ Mobile display is functional');
    });
});

test.describe('Performance Checks', () => {
    test('should load within reasonable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(`/${TENANT_SLUG}`);
        await ensurePageReady(page);

        const loadTime = Date.now() - startTime;

        console.log(`Page load time: ${loadTime}ms`);

        // Should load within 15 seconds
        expect(loadTime).toBeLessThan(15000);
    });

    test('should have valid images (no broken images)', async ({ page }) => {
        await page.goto(`/${TENANT_SLUG}`);
        await ensurePageReady(page);

        const images = await page.locator('img').all();

        if (images.length === 0) {
            console.log('⚠ No images found on page');
            return;
        }

        let brokenImages = 0;
        for (const img of images.slice(0, 10)) { // Check first 10 images
            const src = await img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
                const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
                if (naturalWidth === 0 && await img.isVisible()) {
                    brokenImages++;
                    console.log('Broken image:', src);
                }
            }
        }

        expect(brokenImages).toBe(0);
    });
});
