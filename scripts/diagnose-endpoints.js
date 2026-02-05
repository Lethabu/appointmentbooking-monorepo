#!/usr/bin/env node
/**
 * Endpoint Diagnostic Script
 * Tests connectivity to appointmentbooking.co.za endpoints
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'https://appointmentbooking.co.za';

async function testEndpoint(path, description) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${path}`;
        console.log(`\n🧪 Testing: ${description}`);
        console.log(`   URL: ${url}`);

        const startTime = Date.now();
        const req = https.get(url, { timeout: 10000 }, (res) => {
            const duration = Date.now() - startTime;
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Duration: ${duration}ms`);
                console.log(`   Headers: ${JSON.stringify(res.headers, null, 2).split('\n').slice(0, 5).join('\n')}...`);

                if (data.length < 500) {
                    console.log(`   Body: ${data.substring(0, 200)}`);
                }

                resolve({ success: res.statusCode >= 200 && res.statusCode < 500, status: res.statusCode, duration });
            });
        });

        req.on('error', (error) => {
            const duration = Date.now() - startTime;
            console.log(`   ❌ Error: ${error.code || 'unknown'} - ${error.message}`);
            console.log(`   Duration: ${duration}ms`);
            resolve({ success: false, error: error.code, message: error.message, duration });
        });

        req.on('timeout', () => {
            console.log(`   ❌ Timeout`);
            req.destroy();
            resolve({ success: false, error: 'TIMEOUT' });
        });

        req.end();
    });
}

async function main() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║     ENDPOINT DIAGNOSTIC TOOL                                      ║
║     Target: appointmentbooking.co.za                              ║
╚═══════════════════════════════════════════════════════════════════╝
    `);

    // Test basic connectivity
    console.log('\n📡 CONNECTIVITY TESTS');
    console.log('='.repeat(60));

    await testEndpoint('/', 'Root URL');
    await testEndpoint('/api/health', 'Health Check API');
    await testEndpoint('/health', 'Health Check (root)');

    console.log('\n📅 APPOINTMENT TESTS');
    console.log('='.repeat(60));

    await testEndpoint('/api/availability?date=2026-01-20&serviceId=service_1', 'Availability API');
    await testEndpoint('/api/services', 'Services List');
    await testEndpoint('/api/staff', 'Staff List');
    await testEndpoint('/api/bookings', 'Bookings List');

    console.log('\n🔐 AUTHENTICATION TESTS');
    console.log('='.repeat(60));

    await testEndpoint('/api/auth/login', 'Login Endpoint');
    await testEndpoint('/api/auth/register', 'Register Endpoint');

    console.log('\n📆 CALENDAR TESTS');
    console.log('='.repeat(60));

    await testEndpoint('/api/google-calendar/status', 'Google Calendar Status');
    await testEndpoint('/api/outlook-calendar/status', 'Outlook Calendar Status');
    await testEndpoint('/api/calendar/sync-status', 'Calendar Sync Status');

    console.log('\n💳 PAYMENT TESTS');
    console.log('='.repeat(60));

    await testEndpoint('/api/payments/methods', 'Payment Methods');

    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('Diagnostic complete. Check results above.');
}

main().catch(console.error);
