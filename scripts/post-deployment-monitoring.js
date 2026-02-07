#!/usr/bin/env node

/**
 * Post-Deployment Continuous Monitoring
 *
 * Monitors production health continuously after deployment.
 * Implements "Repeat 3 Times" for alerting:
 * - Alert Threshold 1: Check fails once - Warning
 * - Alert Threshold 2: Check fails twice - Elevated Alert
 * - Alert Threshold 3: Check fails three times - Critical Alert & Rollback Recommendation
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
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${colors[color]}${message}${colors.reset}`);
}

function loadConfig() {
  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    return {
      healthCheckEndpoints: [
        'https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/health',
        'https://appointmentbooking.co.za/api/health'
      ],
      performanceThresholds: {
        api: { p95: 500 }
      }
    };
  }
}

function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
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
          responseTime
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

async function checkEndpoint(url, failureCount) {
  try {
    const result = await makeRequest(url);

    if (result.statusCode === 200) {
      log(`✅ ${url} - OK (${result.responseTime}ms)`, 'green');
      return { success: true, responseTime: result.responseTime, url };
    } else {
      log(`⚠️  ${url} - HTTP ${result.statusCode} (${result.responseTime}ms)`, 'yellow');
      return { success: false, responseTime: result.responseTime, url, statusCode: result.statusCode };
    }
  } catch (error) {
    const level = failureCount >= 2 ? 'red' : failureCount >= 1 ? 'yellow' : 'yellow';
    const emoji = failureCount >= 2 ? '❌' : failureCount >= 1 ? '⚠️ ' : '⚠️ ';

    log(`${emoji} ${url} - ${error.error?.message || 'Error'}`, level);
    return { success: false, url, error: error.error?.message || 'Unknown error' };
  }
}

async function monitoringCycle(config, failureTracking) {
  const endpoints = config.healthCheckEndpoints || [];
  const results = [];

  log('\n🔍 Running health checks...', 'cyan');

  for (const url of endpoints) {
    const currentFailures = failureTracking[url] || 0;
    const result = await checkEndpoint(url, currentFailures);
    results.push(result);

    // Update failure tracking
    if (result.success) {
      failureTracking[url] = 0; // Reset on success
    } else {
      failureTracking[url] = (failureTracking[url] || 0) + 1;

      const failures = failureTracking[url];

      // Three-level alert system
      if (failures === 1) {
        log(`   ⚠️  ALERT LEVEL 1: ${url} failed once`, 'yellow');
        log(`      Monitoring for additional failures...`, 'yellow');
      } else if (failures === 2) {
        log(`   🚨 ALERT LEVEL 2: ${url} failed twice`, 'yellow');
        log(`      Elevated monitoring - potential issue detected`, 'yellow');
      } else if (failures >= 3) {
        log(`   🔴 ALERT LEVEL 3: ${url} failed three times`, 'red');
        log(`      CRITICAL: Consider rollback`, 'red');
        log(`      Run: bash scripts/rollback-deployment.sh`, 'red');
      }
    }
  }

  // Calculate overall health
  const successfulChecks = results.filter(r => r.success).length;
  const healthPercentage = (successfulChecks / results.length) * 100;

  if (healthPercentage === 100) {
    log(`\n✅ All systems operational (${successfulChecks}/${results.length})`, 'green');
  } else if (healthPercentage >= 50) {
    log(`\n⚠️  Partial availability (${successfulChecks}/${results.length})`, 'yellow');
  } else {
    log(`\n🔴 CRITICAL: System degraded (${successfulChecks}/${results.length})`, 'red');
  }

  return { results, healthPercentage, failureTracking };
}

async function continuousMonitoring(durationMinutes = 30, intervalSeconds = 60) {
  log('\n' + '='.repeat(70), 'blue');
  log('  POST-DEPLOYMENT CONTINUOUS MONITORING', 'blue');
  log('  Three-Level Alert System', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  const config = loadConfig();
  const endTime = Date.now() + (durationMinutes * 60 * 1000);
  const failureTracking = {};

  log(`📊 Monitoring for ${durationMinutes} minutes (check every ${intervalSeconds}s)`, 'cyan');
  log(`📍 Monitoring ${config.healthCheckEndpoints.length} endpoints`, 'cyan');
  log(`\n⚠️  Alert Levels:`, 'yellow');
  log(`   Level 1: First failure - Warning`, 'yellow');
  log(`   Level 2: Second failure - Elevated Alert`, 'yellow');
  log(`   Level 3: Third failure - Critical (Rollback Recommended)`, 'yellow');

  let cycleCount = 0;
  const allResults = [];

  while (Date.now() < endTime) {
    cycleCount++;
    log(`\n${'─'.repeat(70)}`, 'blue');
    log(`Cycle ${cycleCount} - ${new Date().toLocaleTimeString()}`, 'cyan');

    const cycleResult = await monitoringCycle(config, failureTracking);
    allResults.push(cycleResult);

    // Check for critical alerts
    const criticalAlerts = Object.entries(failureTracking).filter(([_, count]) => count >= 3);

    if (criticalAlerts.length > 0) {
      log(`\n🚨 CRITICAL ALERT: ${criticalAlerts.length} endpoint(s) failing repeatedly`, 'red');
      log(`Consider immediate rollback`, 'red');

      // Don't break immediately - continue monitoring to confirm
    }

    // Wait for next cycle
    if (Date.now() < endTime) {
      log(`\n⏳ Next check in ${intervalSeconds} seconds...`, 'blue');
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
    }
  }

  // Final summary
  log('\n' + '='.repeat(70), 'blue');
  log('  MONITORING COMPLETE', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  const totalChecks = allResults.length;
  const avgHealth = allResults.reduce((sum, r) => sum + r.healthPercentage, 0) / totalChecks;

  log(`📊 Monitoring Summary:`, 'cyan');
  log(`   Duration: ${durationMinutes} minutes`, 'blue');
  log(`   Total cycles: ${totalChecks}`, 'blue');
  log(`   Average health: ${avgHealth.toFixed(1)}%`, avgHealth >= 95 ? 'green' : avgHealth >= 80 ? 'yellow' : 'red');

  log(`\n📍 Endpoint Status:`, 'cyan');
  Object.entries(failureTracking).forEach(([url, failures]) => {
    const shortUrl = url.replace('https://', '').substring(0, 50);
    if (failures === 0) {
      log(`   ✅ ${shortUrl} - Stable`, 'green');
    } else if (failures < 3) {
      log(`   ⚠️  ${shortUrl} - ${failures} failure(s)`, 'yellow');
    } else {
      log(`   ❌ ${shortUrl} - ${failures} failures (CRITICAL)`, 'red');
    }
  });

  if (avgHealth >= 95) {
    log(`\n✅ Deployment appears stable`, 'green');
    return 0;
  } else if (avgHealth >= 80) {
    log(`\n⚠️  Deployment has some issues, monitor closely`, 'yellow');
    return 0;
  } else {
    log(`\n🔴 Deployment has significant issues, consider rollback`, 'red');
    return 1;
  }
}

async function main() {
  const duration = parseInt(process.argv[2]) || 30; // Default 30 minutes
  const interval = parseInt(process.argv[3]) || 60; // Default 60 seconds

  await continuousMonitoring(duration, interval);
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Monitoring error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { continuousMonitoring, checkEndpoint };
