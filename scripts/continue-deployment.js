#!/usr/bin/env node

/**
 * Check Current Deployment Status and Continue
 * Checks GitHub Actions status and runs post-deployment steps if ready
 */

const https = require('https');
const { execSync } = require('child_process');

const GITHUB_REPO = 'Lethabu/appointmentbooking-monorepo';
const WORKFLOW_FILE = 'cloudflare-deploy.yml';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Node.js' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function checkDeploymentStatus() {
  log('\n🔍 Checking Current Deployment Status...', 'cyan');
  log('─'.repeat(60), 'cyan');

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1`;
    const data = await httpsGet(url);
    const run = data.workflow_runs?.[0];

    if (!run) {
      log('❌ No workflow runs found', 'red');
      log('\n💡 Start deployment with: node scripts/deploy-with-retry.js', 'yellow');
      return null;
    }

    log(`📋 Latest Workflow Run:`, 'blue');
    log(`   ID: ${run.id}`, 'blue');
    log(`   Status: ${run.status.toUpperCase()}`, run.status === 'completed' ? 'green' : 'yellow');
    log(`   Conclusion: ${run.conclusion || 'N/A'}`, run.conclusion === 'success' ? 'green' : 'red');
    log(`   URL: ${run.html_url}`, 'blue');
    log(`   Commit: ${run.head_sha.substring(0, 8)}`, 'blue');
    log(`   Branch: ${run.head_branch}`, 'blue');

    return run;

  } catch (error) {
    log(`❌ Error checking status: ${error.message}`, 'red');
    log('\n💡 GitHub API may be rate-limited or unreachable', 'yellow');
    log('   Visit: https://github.com/Lethabu/appointmentbooking-monorepo/actions', 'blue');
    return null;
  }
}

async function runCommand(description, command) {
  try {
    log(`\n▶️  ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`⚠️  ${description} failed`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       DEPLOYMENT STATUS CHECK & CONTINUATION              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const run = await checkDeploymentStatus();

  if (!run) {
    process.exit(1);
  }

  // Check if deployment is still running
  if (run.status !== 'completed') {
    log('\n⏳ Deployment is still in progress', 'yellow');
    log('\n💡 Options:', 'cyan');
    log('   1. Monitor: node scripts/monitor-github-deployment.js', 'blue');
    log('   2. Wait and retry: node scripts/deploy-with-retry.js', 'blue');
    log(`   3. View logs: ${run.html_url}`, 'blue');
    process.exit(0);
  }

  // Check if deployment succeeded
  if (run.conclusion !== 'success') {
    log('\n❌ Latest deployment failed', 'red');
    log('\n💡 Options:', 'cyan');
    log('   1. Review logs and retry: node scripts/deploy-with-retry.js', 'blue');
    log(`   2. View GitHub logs: ${run.html_url}`, 'blue');
    log('   3. Check locally: node scripts/pre-deployment-validation.js', 'blue');
    process.exit(1);
  }

  // Deployment succeeded - run post-deployment steps
  log('\n✅ Deployment Successful! Starting post-deployment validation...', 'green');
  log('─'.repeat(60), 'cyan');

  // Phase 1: Immediate Validation
  log('\n📍 PHASE 1: Immediate Validation (0-5 min)', 'cyan');
  log('─'.repeat(60), 'cyan');

  await runCommand('Health Check', 'node scripts/health-check-production.js');
  await runCommand('Endpoint Availability', 'node scripts/validate-endpoint-availability.js');
  await runCommand('E2E Contract Tests', 'node scripts/e2e-contract-tests.js');
  await runCommand('Zod Runtime Validation', 'node scripts/validate-zod-runtime.js');
  await runCommand('Performance Baseline', 'node scripts/performance-baseline-tests.js');

  // Phase 2: Metrics Collection
  log('\n📊 PHASE 2: Metrics Collection (15 min - 3 rounds)', 'cyan');
  log('─'.repeat(60), 'cyan');
  log('   Round 1: Immediate', 'blue');
  log('   Round 2: +5 minutes', 'blue');
  log('   Round 3: +15 minutes', 'blue');
  log('', 'reset');

  await runCommand('Collect Metrics (Quick)', 'node scripts/collect-deployment-metrics.js quick');

  log('\n💡 Full metrics collection (3 rounds) takes 15 minutes', 'yellow');
  log('   Run manually: node scripts/collect-deployment-metrics.js full', 'blue');

  // Phase 3: Report Generation
  log('\n📈 PHASE 3: Generate Deployment Report', 'cyan');
  log('─'.repeat(60), 'cyan');

  await runCommand('Generate Report', 'node scripts/generate-deployment-report.js');

  // Summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║       ✅ POST-DEPLOYMENT VALIDATION COMPLETED             ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');

  log('\n🎯 Production Endpoints:', 'cyan');
  log('   • https://appointmentbooking.co.za', 'blue');
  log('   • https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/health', 'blue');

  log('\n📋 Next Steps:', 'cyan');
  log('   1. Review report: cat deployment-reports/latest-report.json', 'blue');
  log('   2. Run full metrics: node scripts/collect-deployment-metrics.js full', 'blue');
  log('   3. Start monitoring: node scripts/post-deployment-monitoring.js 30 60', 'blue');
  log('   4. Check deployment score (target ≥80/100)', 'blue');

  log('\n✨ Deployment complete!', 'green');
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
