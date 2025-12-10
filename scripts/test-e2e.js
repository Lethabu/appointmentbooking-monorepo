#!/usr/bin/env node
/**
 * End-to-End Testing Suite for AppointmentBooking.co.za
 * Tests availability engine, booking flow, and production readiness
 * 
 * Usage: node scripts/test-e2e.js
 */

const https = require('https');

const CONFIG = {
  workerUrl: 'https://www.instylehairboutique.co.za',
  tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  services: [
    { id: 1, name: 'Middle & Side Installation' },
    { id: 2, name: 'Maphondo & Lines Installation' },
    { id: 3, name: 'Soft Glam Makeup' },
  ],
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      timeout: 5000,
      ...options,
    };

    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: res.statusCode === 204 ? null : JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Request timeout')));
  });
}

async function test(name, fn) {
  testResults.total++;
  try {
    await fn();
    log(`  ✓ ${name}`, 'green');
    testResults.passed++;
  } catch (error) {
    log(`  ✗ ${name}`, 'red');
    log(`    Error: ${error.message}`, 'red');
    testResults.failed++;
  }
}

async function runTests() {
  log('\n=== AppointmentBooking.co.za E2E Tests ===\n', 'blue');

  // Test 1: Availability Endpoint
  log('Test Suite 1: Availability Engine', 'blue');
  
  await test('Availability endpoint responds', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
  });

  await test('Availability returns slots array', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    if (!response.body || !Array.isArray(response.body.slots)) {
      throw new Error('Response does not contain slots array');
    }
    
    if (response.body.slots.length === 0) {
      throw new Error('No available slots returned');
    }
  });

  await test('Availability slots have correct format', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    const slot = response.body.slots[0];
    if (!slot.start || !slot.end) {
      throw new Error(`Slot missing start/end: ${JSON.stringify(slot)}`);
    }
    
    // Verify ISO datetime format
    if (!new Date(slot.start).getTime()) {
      throw new Error(`Invalid start time format: ${slot.start}`);
    }
  });

  await test('Availability respects service duration', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    // Installation service = 60 minutes
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    const slot = response.body.slots[0];
    const start = new Date(slot.start).getTime();
    const end = new Date(slot.end).getTime();
    const durationMinutes = (end - start) / (1000 * 60);
    
    if (durationMinutes !== 60) {
      throw new Error(`Expected 60-minute slots, got ${durationMinutes} minutes`);
    }
  });

  await test('Availability respects staff schedule', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    // Zindzi works 9:00-17:00, so first slot should be at 9:00
    const firstSlot = response.body.slots[0];
    const slotTime = new Date(firstSlot.start).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (!slotTime.startsWith('09:')) {
      throw new Error(`First slot should be 9:00 AM, got ${slotTime}`);
    }
  });

  // Test 2: Data Integrity
  log('\nTest Suite 2: Data Integrity', 'blue');

  await test('Services are configured', async () => {
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/services`;
    const response = await makeHttpsRequest(url);
    
    if (!response.body || !Array.isArray(response.body)) {
      throw new Error('Services endpoint invalid');
    }
    
    if (response.body.length === 0) {
      throw new Error('No services configured');
    }
  });

  await test('Staff schedules are configured', async () => {
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/staff`;
    const response = await makeHttpsRequest(url);
    
    if (!response.body || !Array.isArray(response.body)) {
      throw new Error('Staff endpoint invalid');
    }
    
    if (response.body.length === 0) {
      throw new Error('No staff configured');
    }
  });

  // Test 3: Error Handling
  log('\nTest Suite 3: Error Handling', 'blue');

  await test('Invalid service ID returns error', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=invalid`;
    const response = await makeHttpsRequest(url);
    
    if (response.status !== 400 && response.status !== 404) {
      throw new Error(`Expected 400 or 404, got ${response.status}`);
    }
  });

  await test('Past date returns error or empty slots', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const response = await makeHttpsRequest(url);
    
    if (response.status !== 400 && response.status !== 200) {
      throw new Error(`Unexpected status ${response.status}`);
    }
    
    if (response.status === 200 && response.body.slots.length > 0) {
      throw new Error('Should not return slots for past dates');
    }
  });

  // Test 4: Performance
  log('\nTest Suite 4: Performance', 'blue');

  await test('Availability endpoint responds in <1s', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    
    const url = `${CONFIG.workerUrl}/api/tenant/${CONFIG.tenantId}/availability?date=${date}&serviceId=1`;
    const startTime = Date.now();
    await makeHttpsRequest(url);
    const duration = Date.now() - startTime;
    
    if (duration > 1000) {
      throw new Error(`Response took ${duration}ms, expected <1000ms`);
    }
  });

  // Print summary
  log('\n=== Test Results ===\n', 'blue');
  log(`Total: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  
  if (testResults.failed === 0) {
    log('\n✓ All tests passed!', 'green');
    process.exit(0);
  } else {
    log(`\n✗ ${testResults.failed} test(s) failed`, 'red');
    process.exit(1);
  }
}

runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
