#!/usr/bin/env node

/**
 * Quick Deployment Audit Script
 * Verifies critical endpoints after deployment
 */

const baseUrl = 'https://www.instylehairboutique.co.za';
const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

async function testEndpoint(name, url, expectedStatus = 200) {
    try {
        const startTime = Date.now();
        const response = await fetch(url);
        const duration = Date.now() - startTime;

        const success = response.status === expectedStatus;
        const statusIcon = success ? '✅' : '❌';

        console.log(`${statusIcon} ${name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Duration: ${duration}ms`);

        if (success && response.headers.get('content-type')?.includes('application/json')) {
            try {
                const data = await response.json();
                console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
            } catch (e) {
                // Not JSON
            }
        }

        console.log('');
        return success;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
        return false;
    }
}

async function runAudit() {
    console.log('🚀 InStyle Hair Boutique - Quick Deployment Audit');
    console.log('='.repeat(60));
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Tenant ID: ${tenantId}`);
    console.log(`Audit Time: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('');

    const tests = [
        {
            name: 'Homepage',
            url: baseUrl,
        },
        {
            name: 'Tenant API',
            url: `${baseUrl}/api/tenant?slug=instylehairboutique`,
        },
        {
            name: 'Dashboard API',
            url: `${baseUrl}/api/dashboard?tenantId=${tenantId}`,
        },
        {
            name: 'Health Check',
            url: `${baseUrl}/api/health`,
        },
    ];

    const results = [];
    for (const test of tests) {
        const success = await testEndpoint(test.name, test.url, test.expectedStatus);
        results.push({ name: test.name, success });
    }

    console.log('='.repeat(60));
    console.log('Audit Summary:');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.success).length;
    const total = results.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log('');

    if (passed === total) {
        console.log('✅ All tests passed! Deployment is healthy.');
    } else {
        console.log('⚠️  Some tests failed. Please review the results above.');
    }

    console.log('='.repeat(60));
}

runAudit().catch(console.error);
