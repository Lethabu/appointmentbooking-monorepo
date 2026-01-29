#!/usr/bin/env node

/**
 * Calendar Sync Endpoint Tests
 * Tests the Google Calendar integration
 */

const WORKER_URL = 'https://appointmentbooking-coza.houseofgr8ness.workers.dev';

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
        return true;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('\n📅 Calendar Sync Endpoint Tests\n');
    
    let passed = 0;
    let failed = 0;

    // First, get a JWT token
    let jwtToken;
    if (await test('Login to get JWT token', async () => {
        const response = await fetch(`${WORKER_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'admin123'
            })
        });
        const json = await response.json();
        if (!json.data.token) throw new Error('No token returned');
        jwtToken = json.data.token;
    })) {
        passed++;
    } else {
        failed++;
    }

    if (!jwtToken) {
        console.log('\n❌ Cannot proceed without JWT token\n');
        return;
    }

    // Test calendar endpoints
    if (await test('GET /api/calendar/events without OAuth should return empty', async () => {
        const response = await fetch(`${WORKER_URL}/api/calendar/events?startDate=2026-01-01&endDate=2026-01-31`, {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const json = await response.json();
        if (json.data.connected !== false) throw new Error('Should not be connected');
        if (!Array.isArray(json.data.events)) throw new Error('Events should be array');
    })) {
        passed++;
    } else {
        failed++;
    }

    if (await test('POST /api/calendar/check-conflicts without appointment', async () => {
        const response = await fetch(`${WORKER_URL}/api/calendar/check-conflicts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime: '2026-01-20T10:00:00Z',
                endTime: '2026-01-20T10:30:00Z'
            })
        });
        const json = await response.json();
        if (typeof json.data.hasConflicts !== 'boolean') throw new Error('hasConflicts should be boolean');
    })) {
        passed++;
    } else {
        failed++;
    }

    if (await test('POST /api/calendar/create-event without OAuth should fail', async () => {
        const response = await fetch(`${WORKER_URL}/api/calendar/create-event`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Test Event',
                startTime: '2026-01-20T10:00:00Z',
                endTime: '2026-01-20T10:30:00Z'
            })
        });
        const json = await response.json();
        if (json.success !== false) throw new Error('Should fail without OAuth');
        if (json.error !== 'Google Calendar not connected') throw new Error('Wrong error message');
    })) {
        passed++;
    } else {
        failed++;
    }

    if (await test('DELETE /api/calendar/delete-event without OAuth should fail', async () => {
        const response = await fetch(`${WORKER_URL}/api/calendar/delete-event?googleEventId=test123`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const json = await response.json();
        if (json.success !== false) throw new Error('Should fail without OAuth');
    })) {
        passed++;
    } else {
        failed++;
    }

    console.log(`\n✓ ${passed} tests passed`);
    console.log(`✗ ${failed} tests failed`);
    console.log(`\n📊 Pass Rate: ${Math.round((passed / (passed + failed)) * 100)}%\n`);
}

runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
