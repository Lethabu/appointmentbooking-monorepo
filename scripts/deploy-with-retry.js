#!/usr/bin/env node

/**
 * Deployment with Retry Logic
 * Implements "Repeat 3 Times" principle for deployment attempts
 *
 * Features:
 * - Checks GitHub Actions workflow status
 * - Retries failed deployments up to 3 times
 * - Runs post-deployment validation
 * - Collects metrics and generates reports
 * - Implements 3-level alert system
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_REPO = 'Lethabu/appointmentbooking-monorepo';
const WORKFLOW_FILE = 'cloudflare-deploy.yml';
const MAX_DEPLOYMENT_ATTEMPTS = 3;
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_WAIT_TIME = 1800000; // 30 minutes

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Deployment Retry Script',
        ...headers,
      },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function getLatestWorkflowRun() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1`;
  const data = await httpsGet(url);
  return data.workflow_runs?.[0] || null;
}

async function waitForWorkflowCompletion(runId, maxWaitTime = MAX_WAIT_TIME) {
  const startTime = Date.now();
  let lastStatus = null;

  log(`⏳ Waiting for workflow run ${runId} to complete...`, 'cyan');

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/runs/${runId}`;
      const run = await httpsGet(url);

      if (run.status !== lastStatus) {
        log(`   Status: ${run.status.toUpperCase()}`, 'blue');
        lastStatus = run.status;
      }

      if (run.status === 'completed') {
        log(`✅ Workflow completed with conclusion: ${run.conclusion.toUpperCase()}`,
          run.conclusion === 'success' ? 'green' : 'red');
        return {
          success: run.conclusion === 'success',
          conclusion: run.conclusion,
          url: run.html_url,
        };
      }

      // Show progress dots
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));

    } catch (error) {
      log(`⚠️  Error checking workflow status: ${error.message}`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }

  throw new Error('Workflow did not complete within timeout period');
}

async function triggerDeployment(attemptNumber) {
  log(`\n🚀 Deployment Attempt ${attemptNumber}/${MAX_DEPLOYMENT_ATTEMPTS}`, 'cyan');
  log('─'.repeat(60), 'cyan');

  try {
    // Check if there are any uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        log('📝 Found uncommitted changes, committing...', 'yellow');
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "chore: deployment retry attempt ${attemptNumber}/3"`, { stdio: 'inherit' });
      }
    } catch (e) {
      // No changes to commit
    }

    // Push to trigger deployment
    log('📤 Pushing to remote repository...', 'blue');
    execSync('git push origin main', { stdio: 'inherit' });

    log('✅ Push successful, CI/CD pipeline triggered', 'green');

    // Wait a few seconds for GitHub to register the workflow
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Get the latest workflow run
    const run = await getLatestWorkflowRun();
    if (!run) {
      throw new Error('Could not find workflow run');
    }

    log(`📋 Workflow Run ID: ${run.id}`, 'blue');
    log(`🔗 URL: ${run.html_url}`, 'blue');

    // Wait for completion
    return await waitForWorkflowCompletion(run.id);

  } catch (error) {
    log(`❌ Deployment attempt ${attemptNumber} failed: ${error.message}`, 'red');
    return {
      success: false,
      error: error.message,
    };
  }
}

async function runPostDeploymentValidation() {
  log('\n🧪 Running Post-Deployment Validation...', 'cyan');
  log('─'.repeat(60), 'cyan');

  const validationSteps = [
    { name: 'Health Check', command: 'node scripts/health-check-production.js' },
    { name: 'Endpoint Availability', command: 'node scripts/validate-endpoint-availability.js' },
    { name: 'E2E Contract Tests', command: 'node scripts/e2e-contract-tests.js' },
    { name: 'Zod Runtime Validation', command: 'node scripts/validate-zod-runtime.js' },
    { name: 'Performance Baseline', command: 'node scripts/performance-baseline-tests.js' },
  ];

  let allPassed = true;

  for (const step of validationSteps) {
    try {
      log(`\n▶️  ${step.name}...`, 'blue');
      execSync(step.command, { stdio: 'inherit' });
      log(`✅ ${step.name} passed`, 'green');
    } catch (error) {
      log(`⚠️  ${step.name} failed (non-blocking)`, 'yellow');
      allPassed = false;
    }
  }

  return allPassed;
}

async function collectMetrics() {
  log('\n📊 Collecting Deployment Metrics (3 rounds)...', 'cyan');
  log('─'.repeat(60), 'cyan');

  try {
    execSync('node scripts/collect-deployment-metrics.js full', { stdio: 'inherit' });
    log('✅ Metrics collection completed', 'green');
  } catch (error) {
    log('⚠️  Metrics collection failed (non-blocking)', 'yellow');
  }
}

async function generateReport() {
  log('\n📈 Generating Deployment Report...', 'cyan');
  log('─'.repeat(60), 'cyan');

  try {
    execSync('node scripts/generate-deployment-report.js', { stdio: 'inherit' });
    log('✅ Report generated successfully', 'green');
  } catch (error) {
    log('⚠️  Report generation failed (non-blocking)', 'yellow');
  }
}

async function startContinuousMonitoring() {
  log('\n🔍 Starting Continuous Monitoring...', 'cyan');
  log('─'.repeat(60), 'cyan');
  log('💡 Press Ctrl+C to stop monitoring', 'yellow');

  try {
    execSync('node scripts/post-deployment-monitoring.js 30 60', { stdio: 'inherit' });
  } catch (error) {
    // Monitoring was interrupted
    log('\n👋 Monitoring stopped', 'yellow');
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       PRODUCTION DEPLOYMENT WITH RETRY LOGIC              ║', 'cyan');
  log('║       "Repeat 3 Times" Principle Implementation           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  let deploymentSuccess = false;
  let attemptNumber = 0;
  let lastResult = null;

  // Phase 1: Deploy with Retry Logic (Up to 3 attempts)
  while (attemptNumber < MAX_DEPLOYMENT_ATTEMPTS && !deploymentSuccess) {
    attemptNumber++;

    const result = await triggerDeployment(attemptNumber);
    lastResult = result;

    if (result.success) {
      deploymentSuccess = true;
      log('\n✅ DEPLOYMENT SUCCESSFUL!', 'green');
      break;
    } else {
      log(`\n❌ Attempt ${attemptNumber} failed`, 'red');

      if (attemptNumber < MAX_DEPLOYMENT_ATTEMPTS) {
        const waitTime = attemptNumber * 30; // Progressive backoff
        log(`⏳ Waiting ${waitTime} seconds before retry...`, 'yellow');
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      }
    }
  }

  // Check final result
  if (!deploymentSuccess) {
    log('\n╔════════════════════════════════════════════════════════════╗', 'red');
    log('║  ❌ ALL DEPLOYMENT ATTEMPTS FAILED                        ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝', 'red');
    log('\n🔍 Troubleshooting Steps:', 'yellow');
    log('   1. Check GitHub Actions logs:', 'blue');
    log(`      ${lastResult?.url || 'https://github.com/Lethabu/appointmentbooking-monorepo/actions'}`, 'blue');
    log('   2. Review validation script outputs', 'blue');
    log('   3. Check Cloudflare deployment logs', 'blue');
    log('   4. Verify environment variables and secrets', 'blue');
    log('   5. Test locally with: pnpm run validate:pre-deploy', 'blue');
    process.exit(1);
  }

  // Phase 2: Post-Deployment Validation
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       PHASE 2: POST-DEPLOYMENT VALIDATION                 ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const validationPassed = await runPostDeploymentValidation();

  if (!validationPassed) {
    log('\n⚠️  Some validation checks failed (see above)', 'yellow');
    log('💡 These are non-blocking, but should be investigated', 'yellow');
  }

  // Phase 3: Metrics & Monitoring
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       PHASE 3: METRICS & MONITORING                       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  // Collect metrics (runs for 15 minutes in background)
  log('\n📊 Metrics collection will run for 15 minutes in 3 rounds', 'cyan');
  log('   Round 1: Immediate', 'blue');
  log('   Round 2: +5 minutes', 'blue');
  log('   Round 3: +15 minutes', 'blue');

  // Start metrics collection in background
  const metricsProcess = require('child_process').spawn('node',
    ['scripts/collect-deployment-metrics.js', 'full'],
    { detached: true, stdio: 'ignore' }
  );
  metricsProcess.unref();
  log('✅ Metrics collection started in background', 'green');

  // Generate immediate report
  await generateReport();

  // Final summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║       🎉 DEPLOYMENT COMPLETED SUCCESSFULLY                ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');

  log('\n📋 Summary:', 'cyan');
  log(`   ✅ Deployment succeeded on attempt ${attemptNumber}/${MAX_DEPLOYMENT_ATTEMPTS}`, 'green');
  log(`   ✅ Post-deployment validation ${validationPassed ? 'passed' : 'completed with warnings'}`, validationPassed ? 'green' : 'yellow');
  log('   ✅ Metrics collection running in background', 'green');
  log('   ✅ Initial report generated', 'green');

  log('\n🎯 Next Steps:', 'cyan');
  log('   1. Review deployment report in deployment-reports/', 'blue');
  log('   2. Check production endpoints:', 'blue');
  log('      • https://appointmentbooking.co.za', 'blue');
  log('      • https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/health', 'blue');
  log('   3. Wait 15 minutes for full metrics collection', 'blue');
  log('   4. Generate final report: node scripts/generate-deployment-report.js', 'blue');
  log('   5. Start continuous monitoring (optional):', 'blue');
  log('      node scripts/post-deployment-monitoring.js 30 60', 'blue');

  log('\n💡 Optional: Start continuous monitoring now? (Ctrl+C to skip)', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 5000));

  await startContinuousMonitoring();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

// Run
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
