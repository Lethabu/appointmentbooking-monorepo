#!/usr/bin/env node
/**
 * Test Alternative Route Patterns
 */

const https = require('https');

const BASE_URL = 'https://appointmentbooking.co.za';

async function testEndpoint(path, description) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${path}`;
        console.log(`\n🧪 ${description}`);
        console.log(`   ${url}`);

        const req = https.get(url, { timeout: 10000 }, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode} | Body: ${data.substring(0, 100)}`);
                resolve({ success: res.statusCode < 500, status: res.statusCode, data });
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ Error: ${e.code}`);
            resolve({ success: false, error: e.code });
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
║     TESTING ALTERNATIVE ROUTE PATTERNS                            ║
╚═══════════════════════════════════════════════════════════════════╝
    `);

    // Test booking routes (various patterns)
    console.log('\n📅 BOOKING ROUTES');
    console.log('='.repeat(60));
    await testEndpoint('/api/bookings', 'Standard API route');
    await testEndpoint('/api/bookings/route.ts', 'Direct route file');
    await testEndpoint('/bookings', 'Direct bookings path');

    // Test health routes
    console.log('\n🏥 HEALTH ROUTES');
    console.log('='.repeat(60));
    await testEndpoint('/api/health', 'Standard health');
    await testEndpoint('/api/health/route.ts', 'Direct health route');
    await testEndpoint('/health', 'Root health');

    // Test auth routes
    console.log('\n🔐 AUTH ROUTES');
    console.log('='.repeat(60));
    await testEndpoint('/api/auth/login', 'Login');
    await testEndpoint('/api/auth/signin', 'Signin');
    await testEndpoint('/api/auth/signin/page.tsx', 'NextAuth signin');

    // Test availability
    console.log('\n📅 AVAILABILITY');
    console.log('='.repeat(60));
    await testEndpoint('/api/availability', 'Availability API');
    await testEndpoint('/availability', 'Direct availability');

    // Test services
    console.log('\n🛠️ SERVICES');
    console.log('='.repeat(60));
    await testEndpoint('/api/services', 'Services API');
    await testEndpoint('/services', 'Direct services');

    // Test staff
    console.log('\n👥 STAFF');
    console.log('='.repeat(60));
    await testEndpoint('/api/staff', 'Staff API');
    await testEndpoint('/staff', 'Direct staff');

    // Test calendar
    console.log('\n📆 CALENDAR');
    console.log('='.repeat(60));
    await testEndpoint('/api/google-calendar/status', 'Google Calendar');
    await testEndpoint('/api/google-calendar/oauth', 'Google OAuth');

    // Test if the app renders
    console.log('\n🌐 APP PAGES');
    console.log('='.repeat(60));
    await testEndpoint('/', 'Homepage');
    await testEndpoint('/book', 'Booking Page');
    await testEndpoint('/services', 'Services Page');
    await testEndpoint('/about', 'About Page');
    await testEndpoint('/contact', 'Contact Page');

    console.log('\n═══════════════════════════════════════════════════════════════════');
}

main().catch(console.error);
