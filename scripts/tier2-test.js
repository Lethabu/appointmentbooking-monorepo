#!/usr/bin/env node
/**
 * TIER 2 Endpoint Testing - Tests OAuth and Calendar Endpoints
 * Tests the new Google OAuth and Calendar Sync functionality
 */

const http = require('http');
const https = require('https');

const WORKER_URL = 'https://appointmentbooking-coza.houseofgr8ness.workers.dev';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    };

    const req = protocol.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function test(name, fn) {
  try {
    await fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS', error: null });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function runTests() {
  console.log('\n🔐 TIER 1 + 2 ENDPOINT TESTS\n');

  let jwtToken = null;

  // TIER 1: Authentication Tests
  console.log('=== TIER 1: Authentication ===\n');

  await test('Login Endpoint', async () => {
    const res = await request(`${WORKER_URL}/api/auth/login`, {
      method: 'POST',
      body: { email: 'test@example.com', password: 'admin123' }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body?.data?.token) throw new Error('No token returned');
    jwtToken = res.body.data.token;
  });

  await test('Verify Token Endpoint', async () => {
    if (!jwtToken) throw new Error('No token available');
    const res = await request(`${WORKER_URL}/api/auth/verify`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body?.success) throw new Error('Token verification failed');
  });

  await test('Security Headers Present', async () => {
    const res = await request(`${WORKER_URL}/api/health`);
    const headers = res.headers;
    if (!headers['x-content-type-options']) throw new Error('Missing X-Content-Type-Options');
    if (!headers['x-frame-options']) throw new Error('Missing X-Frame-Options');
    if (!headers['strict-transport-security']) throw new Error('Missing Strict-Transport-Security');
  });

  // TIER 2: OAuth Tests
  console.log('\n=== TIER 2: OAuth ===\n');

  await test('OAuth Authorize Endpoint', async () => {
    const res = await request(`${WORKER_URL}/api/oauth/google/authorize`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body?.data?.authUrl) throw new Error('No authUrl returned');
    if (!res.body.data.authUrl.includes('client_id=')) throw new Error('Missing client_id in authUrl');
    if (!res.body.data.authUrl.includes('676754877412')) throw new Error('Incorrect client_id');
  });

  await test('OAuth Status Endpoint', async () => {
    if (!jwtToken) throw new Error('No token available');
    const res = await request(`${WORKER_URL}/api/oauth/google/status`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body?.data) throw new Error('No response data');
  });

  // TIER 2: Calendar Tests
  console.log('\n=== TIER 2: Calendar ===\n');

  await test('Calendar Events Endpoint', async () => {
    if (!jwtToken) throw new Error('No token available');
    const res = await request(
      `${WORKER_URL}/api/calendar/events?startDate=2026-01-20&endDate=2026-01-21`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      }
    );
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    // May return empty events or error if calendar not connected, but endpoint should be accessible
  });

  await test('Check Conflicts Endpoint', async () => {
    if (!jwtToken) throw new Error('No token available');
    const res = await request(`${WORKER_URL}/api/calendar/check-conflicts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jwtToken}` },
      body: {
        startTime: '2026-01-20T10:00:00Z',
        endTime: '2026-01-20T10:30:00Z'
      }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  await test('Calendar Requires Authentication', async () => {
    const res = await request(`${WORKER_URL}/api/calendar/events?startDate=2026-01-20&endDate=2026-01-21`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (!res.body?.error) throw new Error('No error message');
  });

  // Results
  console.log('\n=== RESULTS ===\n');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Pass Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);

  const failures = results.tests.filter(t => t.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\nFailed Tests:');
    failures.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }

  console.log('\n✅ TIER 2 ENDPOINT VERIFICATION COMPLETE\n');
}

runTests().catch(console.error);
