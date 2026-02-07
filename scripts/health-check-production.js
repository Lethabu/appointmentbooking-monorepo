#!/usr/bin/env node

/**
 * Production Health Check Script
 *
 * Performs comprehensive health checks across all production services.
 * Validates that all services are operational and responding correctly.
 *
 * Exit codes:
 * - 0: All health checks passed
 * - 1: One or more health checks failed
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../deployment-config.json');

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

function loadConfig() {
  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    log('Warning: Could not load deployment-config.json, using defaults', 'yellow');
    return {
      healthCheckEndpoints: [
        'https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/health',
        'https://appointmentbooking.co.za/api/health'
      ]
    };
  }
}

function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkEndpoint(url) {
  const startTime = Date.now();

  try {
    const response = await fetchUrl(url);
    const responseTime = Date.now() - startTime;

    let healthData;
    try {
      healthData = JSON.parse(response.body);
    } catch {
      healthData = { status: 'unknown' };
    }

    return {
      url,
      success: response.statusCode === 200,
      statusCode: response.statusCode,
      responseTime,
      healthData,
      error: null
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      url,
      success: false,
      statusCode: null,
      responseTime,
      healthData: null,
      error: error.message
    };
  }
}

async function checkSecurityHeaders(url) {
  try {
    const response = await fetchUrl(url);

    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security'
    ];

    const presentHeaders = [];
    const missingHeaders = [];

    requiredHeaders.forEach(header => {
      if (response.headers[header] || response.headers[header.toUpperCase()]) {
        presentHeaders.push(header);
      } else {
        missingHeaders.push(header);
      }
    });

    return {
      url,
      present: presentHeaders,
      missing: missingHeaders,
      allPresent: missingHeaders.length === 0
    };
  } catch (error) {
    return {
      url,
      present: [],
      missing: [],
      allPresent: false,
      error: error.message
    };
  }
}

async function main() {
  log('\n🏥 Production Health Check', 'blue');
  log('='.repeat(50), 'blue');

  const config = loadConfig();
  const endpoints = config.healthCheckEndpoints || [];

  if (endpoints.length === 0) {
    log('No health check endpoints configured', 'yellow');
    process.exit(0);
  }

  log(`\nChecking ${endpoints.length} endpoints...`, 'blue');

  const results = [];
  let allPassed = true;

  // Check each endpoint
  for (const url of endpoints) {
    log(`\n🔍 Checking: ${url}`, 'blue');

    const result = await checkEndpoint(url);
    results.push(result);

    if (result.success) {
      log(`   ✅ Status: ${result.statusCode}`, 'green');
      log(`   ⏱️  Response time: ${result.responseTime}ms`, 'green');

      if (result.healthData && result.healthData.status) {
        log(`   💚 Health status: ${result.healthData.status}`, 'green');
      }

      // Check if response time is acceptable
      if (result.responseTime > 1000) {
        log(`   ⚠️  Slow response (>${1000}ms)`, 'yellow');
      }
    } else {
      log(`   ❌ Health check failed`, 'red');
      if (result.statusCode) {
        log(`   Status code: ${result.statusCode}`, 'red');
      }
      if (result.error) {
        log(`   Error: ${result.error}`, 'red');
      }
      allPassed = false;
    }
  }

  // Check security headers (on main app URL)
  const mainAppUrl = endpoints.find(url => url.includes('appointmentbooking.co.za')) || endpoints[0];

  if (mainAppUrl) {
    log(`\n🔒 Checking Security Headers: ${mainAppUrl}`, 'blue');
    const securityResult = await checkSecurityHeaders(mainAppUrl);

    if (securityResult.allPresent) {
      log('   ✅ All required security headers present', 'green');
      securityResult.present.forEach(header => {
        log(`      - ${header}`, 'green');
      });
    } else {
      log('   ⚠️  Some security headers missing', 'yellow');
      securityResult.missing.forEach(header => {
        log(`      - ${header} (missing)`, 'yellow');
      });
    }
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');

  const passedCount = results.filter(r => r.success).length;
  const failedCount = results.length - passedCount;

  if (allPassed) {
    log(`✅ All Health Checks Passed!`, 'green');
    log(`   Endpoints checked: ${results.length}`, 'green');
    log(`   Average response time: ${Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)}ms`, 'green');
    process.exit(0);
  } else {
    log(`❌ Health Check Failed`, 'red');
    log(`   Passed: ${passedCount}/${results.length}`, failedCount > 0 ? 'red' : 'green');
    log(`   Failed: ${failedCount}/${results.length}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Health check error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { checkEndpoint, checkSecurityHeaders };
