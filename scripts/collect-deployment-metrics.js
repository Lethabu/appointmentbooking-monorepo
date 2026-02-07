#!/usr/bin/env node

/**
 * Deployment Metrics Collector
 *
 * Tracks deployment metrics over time using the "Repeat 3 Times" principle:
 * - Metric Collection Round 1: Immediate post-deployment
 * - Metric Collection Round 2: 5 minutes post-deployment
 * - Metric Collection Round 3: 15 minutes post-deployment
 *
 * This provides trend data and helps identify performance degradation.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const METRICS_FILE = path.join(__dirname, '../.deployment-metrics.json');
const CONFIG_PATH = path.join(__dirname, '../deployment-config.json');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
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
      ]
    };
  }
}

function loadMetrics() {
  try {
    if (!fs.existsSync(METRICS_FILE)) {
      return { deployments: [] };
    }
    const content = fs.readFileSync(METRICS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`Warning: Could not load previous metrics: ${error.message}`, 'yellow');
    return { deployments: [] };
  }
}

function saveMetrics(metrics) {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    log(`✅ Metrics saved to ${METRICS_FILE}`, 'green');
  } catch (error) {
    log(`Error saving metrics: ${error.message}`, 'red');
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
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = null;
        }

        resolve({
          statusCode: res.statusCode,
          responseTime,
          headers: res.headers,
          body: parsedData
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

async function collectEndpointMetrics(url) {
  const iterations = 3; // Repeat 3 times for accuracy
  const measurements = [];

  for (let i = 0; i < iterations; i++) {
    try {
      const result = await makeRequest(url);
      measurements.push(result.responseTime);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between measurements
    } catch (error) {
      // Continue on error
    }
  }

  if (measurements.length === 0) {
    return { url, available: false, avgResponseTime: null, p95: null };
  }

  measurements.sort((a, b) => a - b);
  const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
  const p95Index = Math.floor(measurements.length * 0.95);
  const p95 = measurements[p95Index] || measurements[measurements.length - 1];

  return {
    url,
    available: true,
    avgResponseTime: Math.round(avg),
    p95: Math.round(p95),
    measurements
  };
}

async function collectDeploymentMetrics(round) {
  log(`\n🔄 Collecting Deployment Metrics - Round ${round}/3`, 'cyan');
  log('='.repeat(60), 'blue');

  const config = loadConfig();
  const endpoints = config.healthCheckEndpoints || [];

  const metrics = {
    timestamp: new Date().toISOString(),
    round,
    endpoints: []
  };

  for (const url of endpoints) {
    log(`\n📊 Measuring: ${url}`, 'blue');
    const endpointMetrics = await collectEndpointMetrics(url);

    if (endpointMetrics.available) {
      log(`   ✅ Available`, 'green');
      log(`   Average: ${endpointMetrics.avgResponseTime}ms`, 'blue');
      log(`   P95: ${endpointMetrics.p95}ms`, 'blue');
    } else {
      log(`   ❌ Unavailable`, 'red');
    }

    metrics.endpoints.push(endpointMetrics);
  }

  return metrics;
}

async function runThreeRoundCollection() {
  log('\n' + '='.repeat(60), 'magenta');
  log('  DEPLOYMENT METRICS COLLECTOR', 'magenta');
  log('  Three-Round Metric Collection Strategy', 'magenta');
  log('='.repeat(60) + '\n', 'magenta');

  const deploymentMetrics = {
    deploymentId: `deploy-${Date.now()}`,
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'unknown',
    rounds: []
  };

  // Round 1: Immediate
  log('\n📍 ROUND 1: Immediate Post-Deployment', 'cyan');
  const round1 = await collectDeploymentMetrics(1);
  deploymentMetrics.rounds.push(round1);

  // Round 2: After 5 minutes
  log('\n⏳ Waiting 5 minutes before Round 2...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));

  log('\n📍 ROUND 2: 5 Minutes Post-Deployment', 'cyan');
  const round2 = await collectDeploymentMetrics(2);
  deploymentMetrics.rounds.push(round2);

  // Round 3: After 15 minutes total
  log('\n⏳ Waiting 10 more minutes before Round 3...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000));

  log('\n📍 ROUND 3: 15 Minutes Post-Deployment', 'cyan');
  const round3 = await collectDeploymentMetrics(3);
  deploymentMetrics.rounds.push(round3);

  // Save metrics
  const allMetrics = loadMetrics();
  allMetrics.deployments.push(deploymentMetrics);

  // Keep only last 50 deployments
  if (allMetrics.deployments.length > 50) {
    allMetrics.deployments = allMetrics.deployments.slice(-50);
  }

  saveMetrics(allMetrics);

  // Analysis
  analyzeMetrics(deploymentMetrics);

  return deploymentMetrics;
}

function analyzeMetrics(deploymentMetrics) {
  log('\n' + '='.repeat(60), 'blue');
  log('  METRICS ANALYSIS', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  const rounds = deploymentMetrics.rounds;

  log('📊 Performance Trend Across 3 Rounds:', 'blue');

  // Calculate averages per round
  rounds.forEach((round, index) => {
    const availableEndpoints = round.endpoints.filter(e => e.available);
    if (availableEndpoints.length > 0) {
      const avgResponse = Math.round(
        availableEndpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / availableEndpoints.length
      );
      const avgP95 = Math.round(
        availableEndpoints.reduce((sum, e) => sum + e.p95, 0) / availableEndpoints.length
      );

      log(`\nRound ${index + 1}:`, 'cyan');
      log(`  Available: ${availableEndpoints.length}/${round.endpoints.length}`, 'blue');
      log(`  Avg Response: ${avgResponse}ms`, 'blue');
      log(`  Avg P95: ${avgP95}ms`, 'blue');
    }
  });

  // Check for degradation
  const round1Avg = calculateRoundAverage(rounds[0]);
  const round3Avg = calculateRoundAverage(rounds[2]);

  if (round1Avg && round3Avg) {
    const degradation = ((round3Avg - round1Avg) / round1Avg) * 100;

    log('\n📈 Performance Change:', 'blue');
    if (Math.abs(degradation) < 5) {
      log(`  ✅ Stable: ${degradation.toFixed(1)}% change`, 'green');
    } else if (degradation > 0) {
      log(`  ⚠️  Degradation: +${degradation.toFixed(1)}% slower`, 'yellow');
    } else {
      log(`  ✅ Improvement: ${Math.abs(degradation).toFixed(1)}% faster`, 'green');
    }
  }
}

function calculateRoundAverage(round) {
  const available = round.endpoints.filter(e => e.available);
  if (available.length === 0) return null;

  return available.reduce((sum, e) => sum + e.avgResponseTime, 0) / available.length;
}

async function main() {
  const mode = process.argv[2] || 'full';

  if (mode === 'quick') {
    // Single round collection for quick checks
    log('\n🚀 Quick Metrics Collection (Single Round)', 'cyan');
    const metrics = await collectDeploymentMetrics(1);

    const allMetrics = loadMetrics();
    allMetrics.deployments.push({
      deploymentId: `quick-${Date.now()}`,
      timestamp: new Date().toISOString(),
      commit: process.env.GITHUB_SHA || 'unknown',
      rounds: [metrics]
    });

    saveMetrics(allMetrics);
    log('\n✅ Quick metrics collection complete', 'green');
  } else {
    // Full three-round collection
    await runThreeRoundCollection();
    log('\n✅ Three-round metrics collection complete', 'green');
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Metrics collection error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { collectDeploymentMetrics, analyzeMetrics };
