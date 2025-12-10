
import { test, expect } from '@playwright/test';

/**
 * Simple Smoke Tests for Tenant Whitelabeled Website
 * 
 * These tests verify the most critical functionality:
 * 1. Pages load with UI (not code)
 * 2. Basic navigation works
 * 3. Booking flow is accessible
 */

const TENANT_SLUG = 'instylehairboutique';

// Increase timeouts for slow compilation
test.setTimeout(180000); // 3 minutes per test

test.describe('Critical Smoke Tests - UI Rendering', () => {
    test('Homepage loads with rendered UI', async ({ page }) => {
        console.log('Navigating to homepage...');

        await page.goto(`/${TENANT_SLUG}`, {
            waitUntil: 'domcontentloaded',
            timeout: 120000 // 2 minutes for first load
        });

        console.log('Page loaded (domcontentloaded), waiting for body visibility...');
        await page.locator('body').waitFor({ state: 'visible', timeout: 60000 });

        // Wait a bit for hydration
        await page.waitForTimeout(5000);

        console.log('Checking page content...');
        const bodyText = await page.locator('body').textContent();

        // Critical check: We should see UI, not HTML code
        expect(bodyText).not.toContain('<!DOCTYPE');
        expect(bodyText).not.toContain('<html>');

        // Take screenshot for visual verification
        await page.screenshot({
            path: 'test-results/smoke-homepage.png',
            fullPage: true
        });

        console.log('✓ Homepage renders UI successfully');
    });

    test('Booking page loads with rendered UI', async ({ page }) => {
        console.log('Navigating to booking page...');

        await page.goto(`/book/${TENANT_SLUG}`, {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        console.log('Page loaded (domcontentloaded), waiting for body visibility...');
        await page.locator('body').waitFor({ state: 'visible', timeout: 60000 });

        // Wait a bit for hydration
        await page.waitForTimeout(5000);

        console.log('Checking page content...');
        const bodyText = await page.locator('body').textContent();

        // Critical check: We should see UI, not HTML code
        expect(bodyText).not.toContain('<!DOCTYPE');
        expect(bodyText).not.toContain('<html>');

        // URL should be correct
        expect(page.url()).toContain(`/book/${TENANT_SLUG}`);

        // Take screenshot
        await page.screenshot({
            path: 'test-results/smoke-booking.png',
            fullPage: true
        });

        console.log('✓ Booking page renders UI successfully');
    });

    test('Booking page shows booking form', async ({ page }) => {
        await page.goto(`/book/${TENANT_SLUG}`, {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        await page.locator('body').waitFor({ state: 'visible', timeout: 60000 });

        // Give extra time for async content to load
        await page.waitForTimeout(5000);

        // Check for the presence of form elements or booking-related content
        const pageContent = await page.locator('body').textContent();

        // Should have some booking-related text
        const hasBookingContent =
            pageContent?.toLowerCase().includes('book') ||
            pageContent?.toLowerCase().includes('service') ||
            pageContent?.toLowerCase().includes('appointment');

        expect(hasBookingContent).toBeTruthy();

        // Take screenshot showing form
        await page.screenshot({
            path: 'test-results/smoke-booking-form.png',
            fullPage: true
        });

        console.log('✓ Booking form content is present');
    });
});

test.describe('Mobile Responsiveness Check', () => {
    test('Homepage displays on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto(`/${TENANT_SLUG}`, {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        await page.locator('body').waitFor({ state: 'visible', timeout: 60000 });

        // Body should be visible
        await expect(page.locator('body')).toBeVisible();

        // Check no excessive horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        // Allow a small tolerance (20px)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);

        await page.screenshot({
            path: 'test-results/smoke-mobile.png',
            fullPage: true
        });

        console.log('✓ Mobile display is responsive');
    });
});
