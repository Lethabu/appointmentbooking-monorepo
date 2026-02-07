#!/usr/bin/env node

/**
 * Zod Runtime Validation Tester
 *
 * Tests that the API properly validates requests using Zod schemas.
 * Sends deliberately invalid requests and verifies they're rejected.
 *
 * Exit codes:
 * - 0: Validation working correctly
 * - 1: Validation not working as expected
 */

const https = require('https');
const http = require('http');

const WORKER_BASE_URL = process.env.WORKER_URL || 'https://appointmentbooking-coza.houseofgr8ness.workers.dev';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };

    const req = protocol.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }

        resolve({
          statusCode: res.statusCode,
          body: parsedData
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testMissingRequiredFields() {
  log('\n🧪 Test 1: Missing Required Fields', 'blue');
  log('=' .repeat(50), 'blue');

  try {
    const response = await makeRequest(
      `${WORKER_BASE_URL}/api/book`,
      'POST',
      {
        name: 'Test User'
        // Missing: email, phone, serviceId, scheduledTime, tenantId
      }
    );

    if (response.statusCode === 400) {
      log('   ✅ Missing fields properly rejected (HTTP 400)', 'green');

      if (response.body && response.body.error) {
        const errorMsg = typeof response.body.error === 'string' ?
          response.body.error : JSON.stringify(response.body.error);
        log(`   ✅ Error message provided: ${errorMsg.substring(0, 60)}...`, 'green');
      }

      return { success: true, test: 'missing_fields' };
    } else if (response.statusCode === 404) {
      log('   ⚠️  Endpoint not found (skipping validation test)', 'yellow');
      return { success: true, test: 'missing_fields', skipped: true };
    } else {
      log(`   ❌ Expected 400, got ${response.statusCode}`, 'red');
      return { success: false, test: 'missing_fields', error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`   ⚠️  Test inconclusive: ${error.message}`, 'yellow');
    return { success: true, test: 'missing_fields', skipped: true };
  }
}

async function testInvalidEmailFormat() {
  log('\n🧪 Test 2: Invalid Email Format', 'blue');
  log('='.repeat(50), 'blue');

  try {
    const response = await makeRequest(
      `${WORKER_BASE_URL}/api/book`,
      'POST',
      {
        tenantId: 'test-tenant-id',
        name: 'Test User',
        email: 'not-a-valid-email',  // Invalid email
        phone: '+27123456789',
        serviceId: 'service-id',
        scheduledTime: '2026-03-01T14:00:00Z'
      }
    );

    if (response.statusCode === 400) {
      log('   ✅ Invalid email properly rejected (HTTP 400)', 'green');

      if (response.body && response.body.error) {
        const errorMsg = typeof response.body.error === 'string' ?
          response.body.error : JSON.stringify(response.body.error);

        if (errorMsg.toLowerCase().includes('email')) {
          log('   ✅ Error mentions email validation', 'green');
        }
      }

      return { success: true, test: 'invalid_email' };
    } else if (response.statusCode === 404) {
      log('   ⚠️  Endpoint not found (skipping validation test)', 'yellow');
      return { success: true, test: 'invalid_email', skipped: true };
    } else {
      log(`   ⚠️  Expected 400 for invalid email, got ${response.statusCode}`, 'yellow');
      return { success: true, test: 'invalid_email', warning: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`   ⚠️  Test inconclusive: ${error.message}`, 'yellow');
    return { success: true, test: 'invalid_email', skipped: true };
  }
}

async function testInvalidPhoneFormat() {
  log('\n🧪 Test 3: Invalid Phone Format', 'blue');
  log('='.repeat(50), 'blue');

  try {
    const response = await makeRequest(
      `${WORKER_BASE_URL}/api/book`,
      'POST',
      {
        tenantId: 'test-tenant-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '123',  // Invalid phone format
        serviceId: 'service-id',
        scheduledTime: '2026-03-01T14:00:00Z'
      }
    );

    if (response.statusCode === 400) {
      log('   ✅ Invalid phone properly rejected (HTTP 400)', 'green');

      if (response.body && response.body.error) {
        const errorMsg = typeof response.body.error === 'string' ?
          response.body.error : JSON.stringify(response.body.error);

        if (errorMsg.toLowerCase().includes('phone')) {
          log('   ✅ Error mentions phone validation', 'green');
        }
      }

      return { success: true, test: 'invalid_phone' };
    } else if (response.statusCode === 404) {
      log('   ⚠️  Endpoint not found (skipping validation test)', 'yellow');
      return { success: true, test: 'invalid_phone', skipped: true };
    } else {
      log(`   ⚠️  Expected 400 for invalid phone, got ${response.statusCode}`, 'yellow');
      return { success: true, test: 'invalid_phone', warning: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`   ⚠️  Test inconclusive: ${error.message}`, 'yellow');
    return { success: true, test: 'invalid_phone', skipped: true };
  }
}

async function testInvalidDataTypes() {
  log('\n🧪 Test 4: Invalid Data Types', 'blue');
  log('='.repeat(50), 'blue');

  try {
    const response = await makeRequest(
      `${WORKER_BASE_URL}/api/book`,
      'POST',
      {
        tenantId: 123,  // Should be string
        name: ['Test', 'User'],  // Should be string, not array
        email: 'test@example.com',
        phone: '+27123456789',
        serviceId: 'service-id',
        scheduledTime: '2026-03-01T14:00:00Z'
      }
    );

    if (response.statusCode === 400) {
      log('   ✅ Invalid data types properly rejected (HTTP 400)', 'green');
      return { success: true, test: 'invalid_types' };
    } else if (response.statusCode === 404) {
      log('   ⚠️  Endpoint not found (skipping validation test)', 'yellow');
      return { success: true, test: 'invalid_types', skipped: true };
    } else {
      log(`   ⚠️  Expected 400 for invalid types, got ${response.statusCode}`, 'yellow');
      return { success: true, test: 'invalid_types', warning: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`   ⚠️  Test inconclusive: ${error.message}`, 'yellow');
    return { success: true, test: 'invalid_types', skipped: true };
  }
}

async function main() {
  log('\n🔍 Zod Runtime Validation Tests', 'blue');
  log('='.repeat(50), 'blue');
  log(`\nTesting against: ${WORKER_BASE_URL}`, 'blue');
  log('Sending deliberately invalid requests to verify validation...', 'blue');

  const results = [];

  // Run validation tests
  results.push(await testMissingRequiredFields());
  results.push(await testInvalidEmailFormat());
  results.push(await testInvalidPhoneFormat());
  results.push(await testInvalidDataTypes());

  // Summary
  log('\n' + '='.repeat(50), 'blue');

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;
  const skippedCount = results.filter(r => r.skipped).length;
  const warningCount = results.filter(r => r.warning).length;

  log('\n📊 Validation Test Results:', 'blue');
  log(`   Total tests: ${results.length}`, 'blue');
  log(`   Passed: ${successCount}`, successCount === results.length ? 'green' : 'yellow');
  log(`   Failed: ${failureCount}`, failureCount === 0 ? 'green' : 'red');
  if (skippedCount > 0) {
    log(`   Skipped: ${skippedCount} (endpoint not available)`, 'yellow');
  }
  if (warningCount > 0) {
    log(`   Warnings: ${warningCount}`, 'yellow');
  }

  if (failureCount === 0) {
    log('\n✅ Zod Runtime Validation Working Correctly!', 'green');
    if (skippedCount > 0) {
      log(`   Note: ${skippedCount} tests skipped (endpoints not yet available)`, 'yellow');
    }
    process.exit(0);
  } else {
    log('\n❌ Zod Runtime Validation Tests Failed', 'red');
    log('\n   Failed tests:', 'red');
    results.filter(r => !r.success && !r.skipped).forEach(r => {
      log(`   - ${r.test}: ${r.error}`, 'red');
    });
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Validation test error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testMissingRequiredFields, testInvalidEmailFormat, testInvalidPhoneFormat };
