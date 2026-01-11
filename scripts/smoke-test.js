#!/usr/bin/env node
/**
 * Post-Deployment Smoke Test Suite for appointmentbooking.co.za
 * Tests all critical endpoints and functionality after deployment
 * 
 * Run: node scripts/smoke-test.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    baseUrl: 'https://4afe5103.appointment-booking-coza.pages.dev',
    stagingUrl: 'https://staging.appointmentbooking.co.za',
    apiBase: 'https://4afe5103.appointment-booking-coza.pages.dev/api',
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 2000
};

// Test results storage
const testResults = {
    passed: [],
    failed: [],
    warnings: [],
    errors: [],
    startTime: null,
    endTime: null,
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0
};

// Utility functions
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
        'info': '🔵',
        'success': '🟢',
        'error': '🔴',
        'warning': '🟡',
        'test': '🧪'
    }[type] || '⚪';

    console.log(`[${timestamp}] ${prefix} ${message}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;

        const defaultOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'AppointmentBooking-SmokeTest/1.0',
                'Accept': 'application/json',
                ...options.headers
            },
            timeout: CONFIG.timeout
        };

        const req = protocol.request({ ...defaultOptions, ...options }, (res) => {
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const jsonResponse = data ? JSON.parse(data) : {};
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: jsonResponse,
                        rawBody: data
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data,
                        rawBody: data
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

async function retryRequest(url, options = {}) {
    for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
        try {
            return await httpRequest(url, options);
        } catch (error) {
            log(`Attempt ${attempt}/${CONFIG.maxRetries} failed: ${error.message}`, 'warning');
            if (attempt < CONFIG.maxRetries) {
                await sleep(CONFIG.retryDelay);
            }
        }
    }
    throw new Error(`All ${CONFIG.maxRetries} attempts failed`);
}

function recordTest(name, passed, details = {}) {
    testResults.totalTests++;
    if (passed) {
        testResults.totalPassed++;
        testResults.passed.push({ name, ...details });
        log(`✓ ${name}`, 'success');
    } else {
        testResults.totalFailed++;
        testResults.failed.push({ name, ...details });
        log(`✗ ${name}: ${details.error || 'Unknown error'}`, 'error');
    }
}

function recordWarning(name, message) {
    testResults.warnings.push({ name, message });
    log(`⚠ ${name}: ${message}`, 'warning');
}

function recordError(name, error) {
    testResults.errors.push({ name, error: error.message || String(error) });
    log(`❌ ${name}: ${error.message || error}`, 'error');
}

// ============================================
// HEALTH CHECK TESTS
// ============================================

async function testHealthEndpoints() {
    log('Testing Health Check Endpoints...', 'test');

    // Test main health endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health`);
        recordTest(
            'GET /api/health',
            response.status === 200 && response.body.status === 'healthy',
            { status: response.status, response: response.body }
        );
    } catch (error) {
        recordTest('GET /api/health', false, { error: error.message });
    }

    // Test root health endpoint
    try {
        const response = await retryRequest(`${CONFIG.baseUrl}/health`);
        recordTest(
            'GET /health (root)',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('GET /health (root)', false, { error: error.message });
    }

    // Test database connectivity
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health/database`);
        recordTest(
            'GET /api/health/database',
            response.status === 200 && response.body.database === 'connected',
            { status: response.status, response: response.body }
        );
    } catch (error) {
        recordTest('GET /api/health/database', false, { error: error.message });
    }

    // Test service health
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health/services`);
        recordTest(
            'GET /api/health/services',
            response.status === 200 && Array.isArray(response.body.services),
            { status: response.status, services: response.body.services }
        );
    } catch (error) {
        recordTest('GET /api/health/services', false, { error: error.message });
    }

    // Test uptime endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health/uptime`);
        recordTest(
            'GET /api/health/uptime',
            response.status === 200 && response.body.uptime > 0,
            { status: response.status, uptime: response.body.uptime }
        );
    } catch (error) {
        recordTest('GET /api/health/uptime', false, { error: error.message });
    }
}

// ============================================
// APPOINTMENT MANAGEMENT TESTS
// ============================================

async function testAppointmentManagement() {
    log('Testing Appointment Management APIs...', 'test');

    // Test availability endpoint
    try {
        const response = await retryRequest(
            `${CONFIG.apiBase}/availability?date=2026-01-20&serviceId=service_1`
        );
        recordTest(
            'GET /api/availability',
            response.status === 200 && response.body.success,
            { status: response.status, slots: response.body.data?.slots?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/availability', false, { error: error.message });
    }

    // Test services listing
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/services`);
        recordTest(
            'GET /api/services',
            response.status === 200 && Array.isArray(response.body.data?.services),
            { status: response.status, count: response.body.data?.services?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/services', false, { error: error.message });
    }

    // Test staff listing
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/staff`);
        recordTest(
            'GET /api/staff',
            response.status === 200 && Array.isArray(response.body.data?.staff),
            { status: response.status, count: response.body.data?.staff?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/staff', false, { error: error.message });
    }

    // Test booking creation (with mock data)
    try {
        const bookingData = {
            serviceId: 'service_1',
            date: '2026-01-20',
            time: '10:00',
            staffId: 'staff_1',
            customer: {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@smoketest.com',
                phone: '+27123456789'
            },
            notes: 'Smoke test booking - please cancel'
        };

        const response = await retryRequest(`${CONFIG.apiBase}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        recordTest(
            'POST /api/bookings (creation)',
            response.status === 201 && response.body.success,
            { status: response.status, appointmentId: response.body.data?.appointment?.id }
        );

        // Store appointment ID for cancellation test
        if (response.body.data?.appointment?.id) {
            testResults.lastAppointmentId = response.body.data.appointment.id;
        }
    } catch (error) {
        recordTest('POST /api/bookings (creation)', false, { error: error.message });
    }

    // Test booking retrieval
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/bookings?limit=5`);
        recordTest(
            'GET /api/bookings (listing)',
            response.status === 200 && response.body.success,
            { status: response.status, count: response.body.data?.items?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/bookings (listing)', false, { error: error.message });
    }

    // Test booking cancellation (if we have an appointment ID)
    if (testResults.lastAppointmentId) {
        try {
            const response = await retryRequest(
                `${CONFIG.apiBase}/bookings?id=${testResults.lastAppointmentId}`,
                { method: 'DELETE' }
            );
            recordTest(
                'DELETE /api/bookings (cancellation)',
                response.status === 200 && response.body.success,
                { status: response.status, appointmentId: testResults.lastAppointmentId }
            );
        } catch (error) {
            recordTest('DELETE /api/bookings (cancellation)', false, { error: error.message });
        }
    } else {
        recordWarning('DELETE /api/bookings', 'No appointment ID available for cancellation test');
    }
}

// ============================================
// AUTHENTICATION FLOW TESTS
// ============================================

async function testAuthenticationFlows() {
    log('Testing Authentication Flows...', 'test');

    // Test login endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'test' })
        });

        recordTest(
            'POST /api/auth/login',
            response.status === 200 || response.status === 401, // 401 = auth error, not server error
            { status: response.status, hasToken: !!response.body.token || !!response.body.data?.token }
        );
    } catch (error) {
        recordTest('POST /api/auth/login', false, { error: error.message });
    }

    // Test registration endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `smoketest_${Date.now()}@test.com`,
                password: 'TestPassword123',
                firstName: 'Smoke',
                lastName: 'Test'
            })
        });

        recordTest(
            'POST /api/auth/register',
            response.status === 201 || response.status === 400 || response.status === 409, // Expected responses
            { status: response.status, success: response.body.success }
        );
    } catch (error) {
        recordTest('POST /api/auth/register', false, { error: error.message });
    }

    // Test password reset request
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/auth/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' })
        });

        recordTest(
            'POST /api/auth/password-reset',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('POST /api/auth/password-reset', false, { error: error.message });
    }

    // Test token refresh endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: 'test-token' })
        });

        recordTest(
            'POST /api/auth/refresh',
            response.status === 200 || response.status === 401,
            { status: response.status }
        );
    } catch (error) {
        recordTest('POST /api/auth/refresh', false, { error: error.message });
    }

    // Test protected endpoint without auth
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/user/profile`);
        recordTest(
            'GET /api/user/profile (unauthenticated)',
            response.status === 401 || response.status === 403,
            { status: response.status, correctlyProtected: response.status >= 400 && response.status < 500 }
        );
    } catch (error) {
        recordTest('GET /api/user/profile (unauthenticated)', false, { error: error.message });
    }
}

// ============================================
// CALENDAR INTEGRATION TESTS
// ============================================

async function testCalendarIntegrations() {
    log('Testing Calendar Integrations...', 'test');

    // Test Google Calendar OAuth initiation
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/google-calendar/oauth`);
        recordTest(
            'GET /api/google-calendar/oauth',
            response.status === 302 || response.status === 200,
            { status: response.status, redirect: response.headers.location || null }
        );
    } catch (error) {
        recordTest('GET /api/google-calendar/oauth', false, { error: error.message });
    }

    // Test Google Calendar status
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/google-calendar/status`);
        recordTest(
            'GET /api/google-calendar/status',
            response.status === 200 && response.body.success !== undefined,
            { status: response.status, connected: response.body.data?.connected }
        );
    } catch (error) {
        recordTest('GET /api/google-calendar/status', false, { error: error.message });
    }

    // Test Outlook Calendar OAuth initiation
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/outlook-calendar/oauth`);
        recordTest(
            'GET /api/outlook-calendar/oauth',
            response.status === 302 || response.status === 200,
            { status: response.status, redirect: response.headers.location || null }
        );
    } catch (error) {
        recordTest('GET /api/outlook-calendar/oauth', false, { error: error.message });
    }

    // Test Outlook Calendar status
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/outlook-calendar/status`);
        recordTest(
            'GET /api/outlook-calendar/status',
            response.status === 200 && response.body.success !== undefined,
            { status: response.status, connected: response.body.data?.connected }
        );
    } catch (error) {
        recordTest('GET /api/outlook-calendar/status', false, { error: error.message });
    }

    // Test calendar sync status
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/calendar/sync-status`);
        recordTest(
            'GET /api/calendar/sync-status',
            response.status === 200,
            { status: response.status, syncStatus: response.body.data?.status }
        );
    } catch (error) {
        recordTest('GET /api/calendar/sync-status', false, { error: error.message });
    }
}

// ============================================
// PAYMENT PROCESSING TESTS
// ============================================

async function testPaymentProcessing() {
    log('Testing Payment Processing...', 'test');

    // Test payment intent creation
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/payments/create-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 25000, // in cents
                currency: 'zar',
                bookingId: 'test_booking_123'
            })
        });

        recordTest(
            'POST /api/payments/create-intent',
            response.status === 200 && response.body.clientSecret !== undefined,
            { status: response.status, hasClientSecret: !!response.body.clientSecret }
        );
    } catch (error) {
        recordTest('POST /api/payments/create-intent', false, { error: error.message });
    }

    // Test payment confirmation webhook endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/payments/webhook/stripe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'payment_intent.succeeded', data: {} })
        });

        recordTest(
            'POST /api/payments/webhook/stripe',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('POST /api/payments/webhook/stripe', false, { error: error.message });
    }

    // Test refund endpoint
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/payments/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentIntentId: 'pi_test_refund',
                amount: 2500
            })
        });

        recordTest(
            'POST /api/payments/refund',
            response.status === 200 || response.status === 404, // 404 if payment not found is acceptable
            { status: response.status }
        );
    } catch (error) {
        recordTest('POST /api/payments/refund', false, { error: error.message });
    }

    // Test payment methods listing
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/payments/methods`);
        recordTest(
            'GET /api/payments/methods',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('GET /api/payments/methods', false, { error: error.message });
    }
}

// ============================================
// INFRASTRUCTURE TESTS
// ============================================

async function testInfrastructure() {
    log('Testing Infrastructure...', 'test');

    // Test SSL certificate
    try {
        const response = await retryRequest(CONFIG.baseUrl);
        const cert = response.connection?.getPeerCertificate?.();
        recordTest(
            'SSL Certificate Valid',
            response.connection?.authorized === true || response.connection?.authorizationError === undefined,
            {
                status: response.status,
                valid: response.connection?.authorized,
                issuer: cert?.issuer?.O || 'Unknown'
            }
        );
    } catch (error) {
        recordTest('SSL Certificate Valid', false, { error: error.message });
    }

    // Test response headers security
    try {
        const response = await retryRequest(CONFIG.apiBase);
        const hasCSP = response.headers['content-security-policy'] !== undefined;
        const hasXFO = response.headers['x-frame-options'] !== undefined;
        const hasXCTO = response.headers['x-content-type-options'] !== undefined;

        recordTest(
            'Security Headers Present',
            hasCSP && hasXFO && hasXCTO,
            {
                status: response.status,
                headers: {
                    'Content-Security-Policy': hasCSP,
                    'X-Frame-Options': hasXFO,
                    'X-Content-Type-Options': hasXCTO
                }
            }
        );
    } catch (error) {
        recordTest('Security Headers Present', false, { error: error.message });
    }

    // Test CORS configuration
    try {
        const response = await retryRequest(CONFIG.apiBase, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'POST'
            }
        });

        recordTest(
            'CORS Headers Configured',
            response.status === 200 || response.status === 204,
            {
                status: response.status,
                'Access-Control-Allow-Origin': response.headers['access-control-allow-origin']
            }
        );
    } catch (error) {
        recordTest('CORS Headers Configured', false, { error: error.message });
    }

    // Test compression
    try {
        const response = await retryRequest(CONFIG.apiBase);
        const hasGzip = response.headers['content-encoding']?.includes('gzip');
        const hasBrotli = response.headers['content-encoding']?.includes('br');

        recordTest(
            'Response Compression Enabled',
            hasGzip || hasBrotli,
            {
                status: response.status,
                encoding: response.headers['content-encoding'] || 'none'
            }
        );
    } catch (error) {
        recordTest('Response Compression Enabled', false, { error: error.message });
    }
}

// ============================================
// PERFORMANCE TESTS
// ============================================

async function testPerformance() {
    log('Testing Performance...', 'test');

    // Test API response time
    try {
        const startTime = Date.now();
        const response = await retryRequest(`${CONFIG.apiBase}/health`);
        const responseTime = Date.now() - startTime;

        recordTest(
            'API Response Time (< 500ms)',
            responseTime < 500 && response.status === 200,
            {
                status: response.status,
                responseTime,
                threshold: 500
            }
        );
    } catch (error) {
        recordTest('API Response Time (< 500ms)', false, { error: error.message });
    }

    // Test concurrent requests
    try {
        const concurrentRequests = 5;
        const startTime = Date.now();

        const requests = Array.from({ length: concurrentRequests }, () =>
            retryRequest(`${CONFIG.apiBase}/services`)
        );

        const responses = await Promise.all(requests);
        const totalTime = Date.now() - startTime;

        const allSuccessful = responses.every(r => r.status === 200);
        const avgResponseTime = totalTime / concurrentRequests;

        recordTest(
            `Concurrent Requests (${concurrentRequests})`,
            allSuccessful && avgResponseTime < 1000,
            {
                allSuccessful,
                totalTime,
                avgResponseTime,
                threshold: 1000
            }
        );
    } catch (error) {
        recordTest('Concurrent Requests', false, { error: error.message });
    }

    // Test page load time (frontend)
    try {
        const startTime = Date.now();
        const response = await retryRequest(CONFIG.baseUrl);
        const loadTime = Date.now() - startTime;

        recordTest(
            'Frontend Page Load (< 2s)',
            loadTime < 2000 && response.status === 200,
            {
                status: response.status,
                loadTime,
                threshold: 2000
            }
        );
    } catch (error) {
        recordTest('Frontend Page Load (< 2s)', false, { error: error.message });
    }
}

// ============================================
// END-TO-END WORKFLOW TEST
// ============================================

async function testEndToEndWorkflow() {
    log('Testing End-to-End Workflow...', 'test');

    try {
        // Step 1: Check availability
        const availabilityResponse = await retryRequest(
            `${CONFIG.apiBase}/availability?date=2026-01-25&serviceId=service_1`
        );

        if (availabilityResponse.status !== 200 || !availabilityResponse.body.success) {
            recordTest('E2E Workflow: Availability Check', false, {
                status: availabilityResponse.status
            });
            return;
        }

        // Step 2: Create booking
        const availableSlot = availabilityResponse.body.data?.slots?.find((s) => s.isAvailable);
        const bookingTime = availableSlot?.start?.split('T')[1] || '10:00';

        const bookingResponse = await retryRequest(`${CONFIG.apiBase}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceId: 'service_1',
                date: '2026-01-25',
                time: bookingTime,
                staffId: 'staff_1',
                customer: {
                    firstName: 'E2E',
                    lastName: 'Test User',
                    email: 'e2e@smoketest.com',
                    phone: '+27123456789'
                },
                notes: 'E2E smoke test - please cancel'
            })
        });

        if (bookingResponse.status !== 201 || !bookingResponse.body.success) {
            recordTest('E2E Workflow: Booking Creation', false, {
                status: bookingResponse.status
            });
            return;
        }

        const appointmentId = bookingResponse.body.data?.appointment?.id;

        // Step 3: Retrieve booking
        const retrieveResponse = await retryRequest(`${CONFIG.apiBase}/bookings?id=${appointmentId}`);

        if (retrieveResponse.status !== 200 || !retrieveResponse.body.success) {
            recordTest('E2E Workflow: Booking Retrieval', false, {
                status: retrieveResponse.status
            });
            return;
        }

        // Step 4: Cancel booking
        const cancelResponse = await retryRequest(
            `${CONFIG.apiBase}/bookings?id=${appointmentId}`,
            { method: 'DELETE' }
        );

        const success = cancelResponse.status === 200 && cancelResponse.body.success;

        recordTest(
            'Complete E2E Workflow',
            success,
            {
                appointmentId,
                steps: ['availability', 'create', 'retrieve', 'cancel'],
                success
            }
        );

    } catch (error) {
        recordTest('Complete E2E Workflow', false, { error: error.message });
    }
}

// ============================================
// GENERATE REPORT
// ============================================

function generateReport() {
    const duration = testResults.endTime - testResults.startTime;
    const passRate = ((testResults.totalPassed / testResults.totalTests) * 100).toFixed(2);

    let report = `
╔══════════════════════════════════════════════════════════════════════════╗
║     POST-DEPLOYMENT SMOKE TEST REPORT - appointmentbooking.co.za        ║
╚══════════════════════════════════════════════════════════════════════════╝

📊 EXECUTIVE SUMMARY
─────────────────────────────────────────────────────────────────────────────
🕐 Test Execution: ${new Date(testResults.startTime).toISOString()}
⏱️ Duration: ${(duration / 1000).toFixed(2)} seconds
📈 Total Tests: ${testResults.totalTests}
✅ Passed: ${testResults.totalPassed} (${passRate}%)
❌ Failed: ${testResults.totalFailed}
⚠️ Warnings: ${testResults.warnings.length}
❗ Errors: ${testResults.errors.length}

🎯 PASS/FAIL RATE
─────────────────────────────────────────────────────────────────────────────
${'█'.repeat(Math.floor(passRate / 10))}${'░'.repeat(10 - Math.floor(passRate / 10))} ${passRate}%

📋 PASSED TESTS (${testResults.passed.length})
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.map(t => `✓ ${t.name}`).join('\n') || 'No tests passed'}

📋 FAILED TESTS (${testResults.failed.length})
─────────────────────────────────────────────────────────────────────────────
${testResults.failed.map(t => `✗ ${t.name}${t.error ? ': ' + t.error : ''}`).join('\n') || 'No tests failed'}

⚠️ WARNINGS
─────────────────────────────────────────────────────────────────────────────
${testResults.warnings.map(w => `⚠ ${w.name}: ${w.message}`).join('\n') || 'No warnings'}

❗ ERRORS
─────────────────────────────────────────────────────────────────────────────
${testResults.errors.map(e => `❌ ${e.name}: ${e.error}`).join('\n') || 'No errors'}

🏥 HEALTH CHECK STATUS
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.some(t => t.name.includes('health')) ? '✓ Health endpoints responding' : '⚠ Health endpoints may have issues'}

🔐 AUTHENTICATION STATUS
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.some(t => t.name.includes('auth')) ? '✓ Authentication flows functional' : '⚠ Authentication flows may have issues'}

📅 CALENDAR INTEGRATION STATUS
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.some(t => t.name.includes('calendar')) ? '✓ Calendar integrations operational' : '⚠ Calendar integrations may have issues'}

💳 PAYMENT PROCESSING STATUS
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.some(t => t.name.includes('payment')) ? '✓ Payment processing functional' : '⚠ Payment processing may have issues'}

⚡ PERFORMANCE STATUS
─────────────────────────────────────────────────────────────────────────────
${testResults.passed.some(t => t.name.includes('Response Time') || t.name.includes('Concurrent')) ? '✓ Performance metrics acceptable' : '⚠ Performance may need optimization'}

╔══════════════════════════════════════════════════════════════════════════╗
║  DEPLOYMENT STATUS: ${testResults.totalFailed === 0 ? '✅ READY FOR PRODUCTION' : '⚠️ ISSUES DETECTED - REVIEW REQUIRED'}  ║
╚══════════════════════════════════════════════════════════════════════════╝
`;

    return report;
}

async function saveReport(report) {
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filename = `smoke-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, report);
    log(`Report saved to: ${filepath}`, 'info');

    // Also save JSON version
    const jsonPath = filepath.replace('.txt', '.json');
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2));
    log(`JSON report saved to: ${jsonPath}`, 'info');

    return filepath;
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
    console.clear();
    console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║     POST-DEPLOYMENT SMOKE TEST SUITE v1.0                               ║
║     Target: appointmentbooking.co.za                                    ║
╚══════════════════════════════════════════════════════════════════════════╝
    `);

    testResults.startTime = Date.now();

    try {
        // Run all test suites
        await testHealthEndpoints();
        await sleep(500);

        await testAppointmentManagement();
        await sleep(500);

        await testAuthenticationFlows();
        await sleep(500);

        await testCalendarIntegrations();
        await sleep(500);

        await testPaymentProcessing();
        await sleep(500);

        await testInfrastructure();
        await sleep(500);

        await testPerformance();
        await sleep(500);

        await testEndToEndWorkflow();

        testResults.endTime = Date.now();

        // Generate and display report
        const report = generateReport();
        console.log(report);

        await saveReport(report);

        // Exit with appropriate code
        const exitCode = testResults.totalFailed > 0 ? 1 : 0;
        log(`Smoke tests completed with exit code: ${exitCode}`, 'info');
        process.exit(exitCode);

    } catch (error) {
        testResults.endTime = Date.now();
        recordError('Main Execution', error);

        const report = generateReport();
        console.log(report);

        await saveReport(report);
        process.exit(1);
    }
}

// Run smoke tests
main();
