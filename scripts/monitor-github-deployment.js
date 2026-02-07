#!/usr/bin/env node

/**
 * Monitor GitHub Actions Deployment
 * Polls GitHub Actions API to monitor deployment progress
 * Implements retry logic (3 attempts per check)
 */

const https = require('https');

const GITHUB_REPO = 'Lethabu/appointmentbooking-monorepo';
const WORKFLOW_FILE = 'cloudflare-deploy.yml';
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Color codes
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

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Deployment Monitor',
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
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function getLatestWorkflowRun(retryCount = 0) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1`;
    const data = await httpsGet(url);

    if (data.workflow_runs && data.workflow_runs.length > 0) {
      return data.workflow_runs[0];
    }
    return null;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      log(`⚠️  API request failed (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying...`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return getLatestWorkflowRun(retryCount + 1);
    }
    throw error;
  }
}

async function getWorkflowJobs(runId, retryCount = 0) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/runs/${runId}/jobs`;
    const data = await httpsGet(url);
    return data.jobs || [];
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      log(`⚠️  Jobs request failed (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying...`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return getWorkflowJobs(runId, retryCount + 1);
    }
    return [];
  }
}

function getStatusIcon(status, conclusion) {
  if (status === 'completed') {
    if (conclusion === 'success') return '✅';
    if (conclusion === 'failure') return '❌';
    if (conclusion === 'cancelled') return '🚫';
    return '⚠️';
  }
  if (status === 'in_progress') return '🔄';
  if (status === 'queued') return '⏳';
  return '❓';
}

function formatDuration(startTime, endTime) {
  if (!startTime) return 'N/A';
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const durationMs = end - start;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

async function monitorDeployment() {
  log('\n🚀 Deployment Monitor Started', 'cyan');
  log('─'.repeat(60), 'cyan');
  log(`Repository: ${GITHUB_REPO}`, 'blue');
  log(`Workflow: ${WORKFLOW_FILE}`, 'blue');
  log(`Check Interval: ${CHECK_INTERVAL / 1000}s`, 'blue');
  log('─'.repeat(60), 'cyan');

  let lastRunId = null;
  let lastStatus = null;
  let checkCount = 0;

  while (true) {
    checkCount++;

    try {
      log(`\n[Check ${checkCount}] ${new Date().toLocaleTimeString()}`, 'cyan');

      const run = await getLatestWorkflowRun();

      if (!run) {
        log('No workflow runs found', 'yellow');
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
        continue;
      }

      const { id, status, conclusion, html_url, created_at, updated_at } = run;

      // New run detected
      if (id !== lastRunId) {
        log('\n📋 New Deployment Detected!', 'green');
        log(`Run ID: ${id}`, 'blue');
        log(`URL: ${html_url}`, 'blue');
        lastRunId = id;
      }

      // Status changed
      if (status !== lastStatus || conclusion) {
        const icon = getStatusIcon(status, conclusion);
        const duration = formatDuration(created_at, updated_at);

        log(`${icon} Status: ${status.toUpperCase()}`, status === 'completed' ? 'green' : 'yellow');
        log(`   Duration: ${duration}`, 'blue');

        if (conclusion) {
          log(`   Conclusion: ${conclusion.toUpperCase()}`,
            conclusion === 'success' ? 'green' : 'red');
        }

        lastStatus = status;
      }

      // Get and display jobs
      const jobs = await getWorkflowJobs(id);
      if (jobs.length > 0) {
        log('\n📊 Job Status:', 'cyan');
        jobs.forEach(job => {
          const icon = getStatusIcon(job.status, job.conclusion);
          const duration = formatDuration(job.started_at, job.completed_at);
          log(`   ${icon} ${job.name} - ${job.status} (${duration})`, 'blue');

          // Highlight our 3 phases
          if (job.name.includes('Phase 1') || job.name.includes('Phase 2') || job.name.includes('Phase 3')) {
            log(`      ↳ ${job.conclusion || 'running'}`, job.conclusion === 'success' ? 'green' : 'yellow');
          }
        });
      }

      // Check if deployment completed
      if (status === 'completed') {
        log('\n' + '═'.repeat(60), 'cyan');
        if (conclusion === 'success') {
          log('✅ DEPLOYMENT SUCCESSFUL!', 'green');
          log('\n🎯 Next Steps:', 'cyan');
          log('   1. Run post-deployment validation:', 'blue');
          log('      pnpm run validate:phase2', 'blue');
          log('      pnpm run validate:phase3', 'blue');
          log('   2. Collect deployment metrics:', 'blue');
          log('      pnpm run monitor:collect', 'blue');
          log('   3. Generate deployment report:', 'blue');
          log('      pnpm run monitor:report', 'blue');
          log('   4. Start continuous monitoring:', 'blue');
          log('      pnpm run monitor:continuous', 'blue');
        } else {
          log('❌ DEPLOYMENT FAILED!', 'red');
          log('\n🔍 Check logs at:', 'yellow');
          log(`   ${html_url}`, 'blue');
          log('\n💡 Troubleshooting:', 'yellow');
          log('   1. Review the failed job logs', 'blue');
          log('   2. Check validation script outputs', 'blue');
          log('   3. Verify deployment configuration', 'blue');
          log('   4. Consider rollback if critical', 'blue');
        }
        log('═'.repeat(60), 'cyan');

        // Wait 30 seconds before exiting to show final status
        log('\nMonitoring will exit in 30 seconds...', 'yellow');
        await new Promise(resolve => setTimeout(resolve, 30000));
        break;
      }

      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));

    } catch (error) {
      log(`\n❌ Error: ${error.message}`, 'red');
      log('⚠️  Will retry in 60 seconds...', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  log('\n👋 Monitoring complete', 'cyan');
  process.exit(conclusion === 'success' ? 0 : 1);
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\n👋 Monitoring interrupted by user', 'yellow');
  process.exit(0);
});

// Run
monitorDeployment().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
