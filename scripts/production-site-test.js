#!/usr/bin/env node
/**
 * Production Website Test for appointmentbooking.co.za
 * Tests main website functionality and API endpoints in production
 * 
 * Run: node scripts/production-site-test.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Production Configuration
const CONFIG = {
    mainSiteUrl: 'https://www.appointmentbooking.co.za',
    apiBase: 'https://www.appointmentbooking.co.za/api',
    timeout: 15000,
    maxRetries: 2,
    retryDelay: 1000
};

// Test results
const testResults = {
    passed: [],
    failed: [],
    warnings: [],
    startTime: new Date(),
    endTime: null,
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
        'info': '🔵',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'test': '🧪'
    }[type] || '⚪';

    console.log(`[${timestamp}] ${prefix} ${message}`);
}

function recordTest(name, passed, details = {}) {
    testResults.totalTests++;
    if (passed) {
        testResults.totalPassed++;
        testResults.passed.push(name);
        log(`✅ ${name}`, 'success');
    } else {
        testResults.totalFailed++;
        testResults.failed.push({ name, ...details });
        log(`❌ ${name}`, 'error');
        if (details.error) console.log(`   Error: ${details.error}`);
        if (details.status) console.log(`   Status: ${details.status}`);
    }
}

async function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);

        const defaultOptions = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'ProductionSiteTest/1.0',
                'Accept': 'application/json, text/html',
                ...options.headers
            },
            timeout: CONFIG.timeout
        };

        const req = https.request(defaultOptions, (res) => {
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
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function retryRequest(url, options = {}, maxRetries = CONFIG.maxRetries) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await httpRequest(url, options);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        }
    }
}

async function runTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  PRODUCTION WEBSITE TEST SUITE v1.0                        ║');
    console.log('║  Target: www.appointmentbooking.co.za                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    log('Starting production website tests...', 'test');

    // 1. Test Main Website
    console.log('\n📍 SECTION 1: Main Website Accessibility');
    try {
        const response = await retryRequest(`${CONFIG.mainSiteUrl}/`);
        recordTest('Main Website (GET /)', response.status === 200, { status: response.status });
    } catch (error) {
        recordTest('Main Website (GET /)', false, { error: error.message });
    }

    // 2. Test Booking Pages
    console.log('\n📍 SECTION 2: Booking Interface');
    try {
        const response = await retryRequest(`${CONFIG.mainSiteUrl}/book/instylehairboutique`);
        recordTest('Booking Page (GET /book/instylehairboutique)', response.status === 200, { status: response.status });
    } catch (error) {
        recordTest('Booking Page (GET /book/instylehairboutique)', false, { error: error.message });
    }

    try {
        const response = await retryRequest(`${CONFIG.mainSiteUrl}/shop`);
        recordTest('Shop Page (GET /shop)', response.status === 200, { status: response.status });
    } catch (error) {
        recordTest('Shop Page (GET /shop)', false, { error: error.message });
    }

    // 3. Test API Endpoints
    console.log('\n📍 SECTION 3: API Endpoints');
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/services`);
        recordTest(
            'GET /api/services',
            response.status === 200 && response.body.data?.services,
            { status: response.status, services: response.body.data?.services?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/services', false, { error: error.message });
    }

    try {
        const response = await retryRequest(`${CONFIG.apiBase}/staff`);
        recordTest(
            'GET /api/staff',
            response.status === 200 && response.body.data?.staff,
            { status: response.status, staff: response.body.data?.staff?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/staff', false, { error: error.message });
    }

    try {
        const response = await retryRequest(`${CONFIG.apiBase}/bookings`);
        recordTest(
            'GET /api/bookings',
            response.status === 200 && response.body.data?.items !== undefined,
            { status: response.status, bookings: response.body.data?.items?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/bookings', false, { error: error.message });
    }

    try {
        const response = await retryRequest(`${CONFIG.apiBase}/availability?date=2026-01-20&serviceId=svc_middle_side`);
        recordTest(
            'GET /api/availability',
            response.status === 200 && response.body.success && response.body.data?.slots,
            { status: response.status, slots: response.body.data?.slots?.length || 0 }
        );
    } catch (error) {
        recordTest('GET /api/availability', false, { error: error.message });
    }

    // 4. Test Health Checks
    console.log('\n📍 SECTION 4: Health Checks');
    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health`);
        recordTest(
            'GET /api/health',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('GET /api/health', false, { error: error.message });
    }

    try {
        const response = await retryRequest(`${CONFIG.apiBase}/health/database`);
        recordTest(
            'GET /api/health/database',
            response.status === 200,
            { status: response.status }
        );
    } catch (error) {
        recordTest('GET /api/health/database', false, { error: error.message });
    }

    // 5. Test Performance
    console.log('\n📍 SECTION 5: Performance Metrics');
    try {
        const start = Date.now();
        await retryRequest(`${CONFIG.mainSiteUrl}/`);
        const duration = Date.now() - start;
        recordTest('Main Page Load Time < 3s', duration < 3000, { duration: `${duration}ms` });
    } catch (error) {
        recordTest('Main Page Load Time < 3s', false, { error: error.message });
    }

    // 6. Test Concurrent Requests
    console.log('\n📍 SECTION 6: Concurrent Load Test');
    try {
        const promises = Array(5).fill(null).map(() => 
            retryRequest(`${CONFIG.apiBase}/services`).catch(() => null)
        );
        const results = await Promise.all(promises);
        const successful = results.filter(r => r?.status === 200).length;
        recordTest('Concurrent Requests (5x)', successful >= 4, { successful: `${successful}/5` });
    } catch (error) {
        recordTest('Concurrent Requests (5x)', false, { error: error.message });
    }

    // 7. Test Security Headers
    console.log('\n📍 SECTION 7: Security Verification');
    try {
        const response = await retryRequest(`${CONFIG.mainSiteUrl}/`);
        const hasSecurityHeaders = response.headers['content-security-policy'] || 
                                   response.headers['x-content-type-options'] ||
                                   response.headers['x-frame-options'];
        recordTest('Security Headers Present', !!hasSecurityHeaders, { 
            headers: Object.keys(response.headers).filter(h => h.includes('x-') || h.includes('content-security')).join(', ') 
        });
    } catch (error) {
        recordTest('Security Headers Present', false, { error: error.message });
    }

    // 8. Test SSL/TLS
    console.log('\n📍 SECTION 8: SSL/TLS Certificate');
    try {
        const response = await retryRequest(`${CONFIG.mainSiteUrl}/`);
        recordTest('SSL Certificate Valid', response.status === 200, { 
            protocol: 'HTTPS', 
            status: response.status 
        });
    } catch (error) {
        recordTest('SSL Certificate Valid', false, { error: error.message });
    }

    // Print Summary
    testResults.endTime = new Date();
    const duration = testResults.endTime - testResults.startTime;
    const passRate = ((testResults.totalPassed / testResults.totalTests) * 100).toFixed(2);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  TEST RESULTS SUMMARY                                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Total Tests: ${testResults.totalTests}`);
    console.log(`✅ Passed: ${testResults.totalPassed}`);
    console.log(`❌ Failed: ${testResults.totalFailed}`);
    console.log(`📈 Pass Rate: ${passRate}%`);
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s\n`);

    if (testResults.totalFailed > 0) {
        console.log('Failed Tests:');
        testResults.failed.forEach(test => {
            console.log(`  ❌ ${test.name}`);
            if (test.error) console.log(`     ${test.error}`);
            if (test.status) console.log(`     Status: ${test.status}`);
        });
    }

    console.log('\n' + '═'.repeat(62) + '\n');

    if (passRate >= 80) {
        console.log('🎉 PRODUCTION WEBSITE: HEALTHY');
    } else if (passRate >= 50) {
        console.log('⚠️  PRODUCTION WEBSITE: PARTIALLY OPERATIONAL');
    } else {
        console.log('🚨 PRODUCTION WEBSITE: CRITICAL ISSUES DETECTED');
    }

    console.log('═'.repeat(62) + '\n');

    // Save report
    const reportPath = path.join(__dirname, '../reports/production-test-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    log(`Report saved to: ${reportPath}`, 'info');

    process.exit(testResults.totalFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
});
