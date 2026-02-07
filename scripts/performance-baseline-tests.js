#!/usr/bin/env node

/**
 * Performance Baseline Validator
 *
 * Validates that performance metrics meet acceptable baseline thresholds.
 * Measures API response times and page load metrics.
 *
 * Exit codes:
 * - 0: Performance within acceptable thresholds
 * - 1: Performance below acceptable thresholds
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
    log('Using default performance thresholds', 'yellow');
    return {
      performanceThresholds: {
        api: { p95: 500, avgResponseTime: 200 }
      }
    };
  }
}

function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const url Obj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          responseTime,
          url
        });
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      reject({ error, responseTime });
    });

    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      reject({ error: new Error('Timeout'), responseTime });
    });
  });
}

async function measureEndpointPerformance(url, iterations = 5) {
  const measurements = [];

  log(`\n📊 Measuring: ${url}`, 'blue');
  log(`   Running ${iterations} iterations...`, 'blue');

  for (let i = 0; i < iterations; i++) {
    try {
      const result = await makeRequest(url);
      measurements.push(result.responseTime);
      log(`   ${i + 1}. ${result.responseTime}ms`, 'blue');
    } catch (error) {
      log(`   ${i + 1}. Failed: ${error.error?.message || 'Unknown error'}`, 'red');
    }
  }

  if (measurements.length === 0) {
    return null;
  }

  // Calculate statistics
  measurements.sort((a, b) => a - b);
  const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
  const p95Index = Math.floor(measurements.length * 0.95);
  const p95 = measurements[p95Index] || measurements[measurements.length - 1];
  const min = measurements[0];
  const max = measurements[measurements.length - 1];

  return {
    url,
    measurements,
    avg: Math.round(avg),
    p95: Math.round(p95),
    min,
    max
  };
}

async function main() {
  log('\n⚡ Performance Baseline Validation', 'blue');
  log('='.repeat(50), 'blue');

  const config = loadConfig();
  const thresholds = config.performanceThresholds;

  // Define endpoints to test
  const endpoints = [
    'https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/health',
    'https://appointmentbooking.co.za/api/health'
  ];

  const results = [];
  const failures = [];

  for (const url of endpoints) {
    const stats = await measureEndpointPerformance(url);

    if (stats) {
      results.push(stats);

      log(`\n   Results:`, 'blue');
      log(`   - Average: ${stats.avg}ms`, 'blue');
      log(`   - P95: ${stats.p95}ms`, 'blue');
      log(`   - Range: ${stats.min}ms - ${stats.max}ms`, 'blue');

      // Check against thresholds
      const p95Threshold = thresholds.api.p95;
      const avgThreshold = thresholds.api.avgResponseTime;

      if (stats.p95 > p95Threshold) {
        log(`   ❌ P95 above threshold (${stats.p95}ms > ${p95Threshold}ms)`, 'red');
        failures.push({
          url,
          metric: 'p95',
          value: stats.p95,
          threshold: p95Threshold
        });
      } else {
        log(`   ✅ P95 within threshold (${stats.p95}ms ≤ ${p95Threshold}ms)`, 'green');
      }

      if (stats.avg > avgThreshold) {
        log(`   ❌ Average above threshold (${stats.avg}ms > ${avgThreshold}ms)`, 'red');
        failures.push({
          url,
          metric: 'avg',
          value: stats.avg,
          threshold: avgThreshold
        });
      } else {
        log(`   ✅ Average within threshold (${stats.avg}ms ≤ ${avgThreshold}ms)`, 'green');
      }
    } else {
      log(`   ❌ Failed to measure endpoint`, 'red');
      failures.push({
        url,
        metric: 'availability',
        value: 0,
        threshold: 100
      });
    }
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');

  if (failures.length === 0) {
    log('\n✅ All Performance Baselines Met!', 'green');
    log(`   Endpoints tested: ${results.length}`, 'green');

    if (results.length > 0) {
      const overallAvg = Math.round(
        results.reduce((sum, r) => sum + r.avg, 0) / results.length
      );
      const overallP95 = Math.max(...results.map(r => r.p95));
      log(`   Overall average: ${overallAvg}ms`, 'green');
      log(`   Overall P95: ${overallP95}ms`, 'green');
    }

    process.exit(0);
  } else {
    log('\n❌ Performance Baseline Validation Failed', 'red');
    log(`   ${failures.length} metric(s) exceeded thresholds`, 'red');
    log('\n   Failures:', 'red');
    failures.forEach(f => {
      log(`   - ${f.url}`, 'red');
      log(`     ${f.metric}: ${f.value}ms (threshold: ${f.threshold}ms)`, 'red');
    });
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Performance test error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { measureEndpointPerformance };
