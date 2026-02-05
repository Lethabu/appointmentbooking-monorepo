/**
 * AppointmentBooking.co.za Smoke Test Suite
 * File: scripts/smoke-test-appointmentbooking.js
 * 
 * Comprehensive smoke tests for production deployment validation
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    PRIMARY_URL: 'https://appointmentbooking.co.za',
    BACKUP_URL: 'https://www.appointmentbooking.co.za',
    TIMEOUT: 30000,
    EXPECTED_STATUS: 200,
};

// Test results
const results = {
    timestamp: new Date().toISOString(),
    url: CONFIG.PRIMARY_URL,
    tests: {
        coreFunctionality: [],
        authentication: [],
        bookingWorkflow: [],
        paymentProcessing: [],
        calendarIntegrations: [],
        emailNotifications: [],
        security: [],
        performance: [],
    },
    summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
    },
};

// Simple HTTP request function
async function request(url, options = {}) {
    return new Promise((resolve) => {
        const http = url.startsWith('https') ? require('https') : require('http');
        const req = http.get(url, { timeout: options.timeout || 10000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data.substring(0, 5000),
                    success: res.statusCode >= 200 && res.statusCode < 400,
                });
            });
        });
        req.on('error', (err) => resolve({ success: false, error: err.message }));
        req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'timeout' }); });
    });
}

// Test helper
async function test(name, url, expectedStatus = 200, timeout = 10000) {
    const result = await request(url, { timeout });
    const passed = result.success && result.statusCode === expectedStatus;

    results.summary.total++;
    if (passed) results.summary.passed++;
    else results.summary.failed++;

    const testResult = {
        name,
        url,
        expectedStatus,
        actualStatus: result.statusCode || 'error',
        passed,
        responseTime: result.responseTime || 'N/A',
        timestamp: new Date().toISOString(),
    };

    console.log(`${passed ? '✓' : '✗'} ${name}: ${passed ? 'PASS' : 'FAIL'} (${result.statusCode || 'ERR'})`);
    return testResult;
}

/**
 * Core Functionality Tests
 */
async function testCoreFunctionality() {
    console.log('\n--- Core Functionality Tests ---\n');

    results.tests.coreFunctionality = [
        await test('Homepage Loads', CONFIG.PRIMARY_URL),
        await test('Health Check API', `${CONFIG.PRIMARY_URL}/api/health`),
        await test('Services API', `${CONFIG.PRIMARY_URL}/api/services`),
        await test('Staff API', `${CONFIG.PRIMARY_URL}/api/staff`),
        await test('Availability API', `${CONFIG.PRIMARY_URL}/api/availability?date=2026-01-15`),
        await test('Tenants API', `${CONFIG.PRIMARY_URL}/api/tenants`),
    ];
}

/**
 * Authentication Flow Tests
 */
async function testAuthentication() {
    console.log('\n--- Authentication Flow Tests ---\n');

    results.tests.authentication = [
        await test('Auth Login Endpoint', `${CONFIG.PRIMARY_URL}/api/auth/login`, 400), // Expects POST
        await test('Auth Register Endpoint', `${CONFIG.PRIMARY_URL}/api/auth/register`, 400),
        await test('Auth Forgot Password', `${CONFIG.PRIMARY_URL}/api/auth/forgot-password`, 400),
        await test('Auth Refresh Token', `${CONFIG.PRIMARY_URL}/api/auth/refresh`, 400),
        await test('Google OAuth Init', `${CONFIG.PRIMARY_URL}/api/auth/google`),
        await test('Microsoft OAuth Init', `${CONFIG.PRIMARY_URL}/api/auth/microsoft`),
    ];
}

/**
 * Booking Workflow Tests
 */
async function testBookingWorkflow() {
    console.log('\n--- Booking Workflow Tests ---\n');

    results.tests.bookingWorkflow = [
        await test('Create Booking Endpoint', `${CONFIG.PRIMARY_URL}/api/bookings`, 400), // Expects POST
        await test('List Bookings Endpoint', `${CONFIG.PRIMARY_URL}/api/bookings`, 401), // Requires auth
        await test('Cancel Booking Endpoint', `${CONFIG.PRIMARY_URL}/api/bookings/cancel`, 400),
        await test('Reschedule Booking Endpoint', `${CONFIG.PRIMARY_URL}/api/bookings/reschedule`, 400),
        await test('Booking Status Endpoint', `${CONFIG.PRIMARY_URL}/api/bookings/status`, 400),
        await test('Booking Reminders API', `${CONFIG.PRIMARY_URL}/api/bookings/reminders`),
    ];
}

/**
 * Payment Processing Tests
 */
async function testPaymentProcessing() {
    console.log('\n--- Payment Processing Tests ---\n');

    results.tests.paymentProcessing = [
        await test('Stripe Create Payment Intent', `${CONFIG.PRIMARY_URL}/api/payments/create-intent`, 400),
        await test('Stripe Webhook', `${CONFIG.PRIMARY_URL}/api/payments/webhook/stripe`, 400),
        await test('Paystack Initialize', `${CONFIG.PRIMARY_URL}/api/payments/paystack/initialize`, 400),
        await test('Paystack Webhook', `${CONFIG.PRIMARY_URL}/api/payments/webhook/paystack`, 400),
        await test('Refund Endpoint', `${CONFIG.PRIMARY_URL}/api/payments/refund`, 400),
        await test('Payment Methods API', `${CONFIG.PRIMARY_URL}/api/payments/methods`, 401),
    ];
}

/**
 * Calendar Integration Tests
 */
async function testCalendarIntegrations() {
    console.log('\n--- Calendar Integration Tests ---\n');

    results.tests.calendarIntegrations = [
        await test('Google Calendar OAuth', `${CONFIG.PRIMARY_URL}/api/google-calendar/oauth`),
        await test('Google Calendar Status', `${CONFIG.PRIMARY_URL}/api/google-calendar/status`),
        await test('Google Calendar Events', `${CONFIG.PRIMARY_URL}/api/google-calendar/events`),
        await test('Outlook Calendar OAuth', `${CONFIG.PRIMARY_URL}/api/outlook-calendar/oauth`),
        await test('Outlook Calendar Status', `${CONFIG.PRIMARY_URL}/api/outlook-calendar/status`),
        await test('Calendar Sync Status', `${CONFIG.PRIMARY_URL}/api/calendar/sync-status`),
    ];
}

/**
 * Email Notification Tests
 */
async function testEmailNotifications() {
    console.log('\n--- Email Notification Tests ---\n');

    results.tests.emailNotifications = [
        await test('Send Test Email', `${CONFIG.PRIMARY_URL}/api/notifications/test-email`, 400),
        await test('Email Templates API', `${CONFIG.PRIMARY_URL}/api/notifications/templates`),
        await test('Email Logs API', `${CONFIG.PRIMARY_URL}/api/notifications/logs`, 401),
    ];
}

/**
 * Security Tests
 */
async function testSecurity() {
    console.log('\n--- Security Tests ---\n');

    const mainPage = await request(CONFIG.PRIMARY_URL);

    const securityTests = {
        httpsEnforced: CONFIG.PRIMARY_URL.startsWith('https'),
        contentSecurityPolicy: mainPage.headers?.['content-security-policy'] ? true : false,
        xFrameOptions: mainPage.headers?.['x-frame-options'] ? true : false,
        xContentTypeOptions: mainPage.headers?.['x-content-type-options'] ? true : false,
        strictTransportSecurity: mainPage.headers?.['strict-transport-security'] ? true : false,
        xssProtection: mainPage.headers?.['x-xss-protection'] ? true : false,
        referrerPolicy: mainPage.headers?.['referrer-policy'] ? true : false,
    };

    let passed = 0;
    let failed = 0;

    for (const [name, value] of Object.entries(securityTests)) {
        if (value) passed++; else failed++;
        console.log(`${value ? '✓' : '✗'} ${name}: ${value ? 'PASS' : 'FAIL'}`);
    }

    results.tests.security = {
        checks: securityTests,
        passed,
        failed,
    };

    results.summary.total += Object.keys(securityTests).length;
    results.summary.passed += passed;
    results.summary.failed += failed;
}

/**
 * Performance Tests
 */
async function testPerformance() {
    console.log('\n--- Performance Tests ---\n');

    const endpoints = [
        CONFIG.PRIMARY_URL,
        `${CONFIG.PRIMARY_URL}/api/health`,
        `${CONFIG.PRIMARY_URL}/api/services`,
    ];

    const performanceMetrics = {};

    for (const endpoint of endpoints) {
        const times = [];
        for (let i = 0; i < 5; i++) {
            const start = Date.now();
            await request(endpoint);
            times.push(Date.now() - start);
        }

        performanceMetrics[endpoint] = {
            avg: Math.round(times.reduce((a, b) => a + b) / times.length),
            min: Math.min(...times),
            max: Math.max(...times),
            p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)],
        };

        const avg = performanceMetrics[endpoint].avg;
        const passed = avg < 2000; // 2 second threshold
        results.summary.total++;
        if (passed) results.summary.passed++; else results.summary.failed++;

        console.log(`${passed ? '✓' : '✗'} ${endpoint}: ${avg}ms (avg) ${passed ? 'PASS' : 'FAIL'}`);
    }

    // Concurrency test
    console.log('\nConcurrency Test (10 simultaneous requests):');
    const concurrentStart = Date.now();
    const promises = Array(10).fill(null).map(() => request(`${CONFIG.PRIMARY_URL}/api/health`));
    const concurrentResults = await Promise.all(promises);
    const concurrentTime = Date.now() - concurrentStart;

    const allSuccessful = concurrentResults.every(r => r.success);
    results.tests.performance = {
        endpoints: performanceMetrics,
        concurrency: {
            totalRequests: 10,
            successful: concurrentResults.filter(r => r.success).length,
            totalTime: concurrentTime,
            avgTimePerRequest: Math.round(concurrentTime / 10),
            allSuccessful,
        },
    };

    results.summary.total++;
    if (allSuccessful && concurrentTime < 10000) results.summary.passed++; else results.summary.failed++;
    console.log(`${allSuccessful && concurrentTime < 10000 ? '✓' : '✗'} Concurrency: ${concurrentResults.filter(r => r.success).length}/10 successful in ${concurrentTime}ms`);
}

/**
 * Generate Report
 */
function generateReport() {
    const passRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);

    console.log(`\n${  '='.repeat(70)}`);
    console.log('  SMOKE TEST REPORT - APPOINTMENTBOOKING.CO.ZA');
    console.log('='.repeat(70));

    console.log(`\nTest Timestamp: ${results.timestamp}`);
    console.log(`URL: ${results.url}`);
    console.log(`\nSummary:`);
    console.log(`  Total Tests: ${results.summary.total}`);
    console.log(`  ✓ Passed: ${results.summary.passed}`);
    console.log(`  ✗ Failed: ${results.summary.failed}`);
    console.log(`  ⚠ Warnings: ${results.summary.warnings}`);
    console.log(`  Pass Rate: ${passRate}%`);

    console.log('\nCategory Breakdown:');
    for (const [category, tests] of Object.entries(results.tests)) {
        if (Array.isArray(tests)) {
            const passed = tests.filter(t => t.passed).length;
            const total = tests.length;
            console.log(`  ${category}: ${passed}/${total} passed`);
        } else if (tests.checks) {
            console.log(`  ${category}: ${tests.passed}/${tests.passed + tests.failed} passed`);
        }
    }

    // Save report
    const reportPath = path.join(__dirname, '../reports/smoke-test-report-appointmentbooking.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);

    // Return overall status
    return results.summary.failed === 0 ? 'SUCCESS' : 'NEEDS_ATTENTION';
}

/**
 * Main Execution
 */
async function main() {
    console.log(`\n${  '='.repeat(70)}`);
    console.log('  APPOINTMENTBOOKING.CO.ZA SMOKE TEST SUITE');
    console.log(`${'='.repeat(70)  }\n`);

    try {
        await testCoreFunctionality();
        await testAuthentication();
        await testBookingWorkflow();
        await testPaymentProcessing();
        await testCalendarIntegrations();
        await testEmailNotifications();
        await testSecurity();
        await testPerformance();

        const status = generateReport();

        console.log(`\n${status === 'SUCCESS' ? '✅ ALL TESTS PASSED' : '⚠ SOME TESTS FAILED - REVIEW RESULTS'}`);

        return status;
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        return 'ERROR';
    }
}

// Export for testing
module.exports = {
    testCoreFunctionality,
    testAuthentication,
    testBookingWorkflow,
    testPaymentProcessing,
    testCalendarIntegrations,
    testEmailNotifications,
    testSecurity,
    testPerformance,
    generateReport,
};

// Run if executed directly
if (require.main === module) {
    main().then(status => process.exit(status === 'SUCCESS' ? 0 : 1));
}
