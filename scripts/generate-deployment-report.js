#!/usr/bin/env node

/**
 * Deployment Report Generator
 *
 * Generates comprehensive deployment reports with historical analysis.
 * Uses the "Repeat 3 Times" principle for data validation:
 * - Round 1: Current deployment metrics
 * - Round 2: Comparison with previous deployment
 * - Round 3: Trend analysis across last 10 deployments
 */

const fs = require('fs');
const path = require('path');

const METRICS_FILE = path.join(__dirname, '../.deployment-metrics.json');

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

function loadMetrics() {
  try {
    if (!fs.existsSync(METRICS_FILE)) {
      log('No deployment metrics found. Deploy first to collect metrics.', 'yellow');
      return null;
    }
    const content = fs.readFileSync(METRICS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`Error loading metrics: ${error.message}`, 'red');
    return null;
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateDeploymentScore(deployment) {
  if (!deployment.rounds || deployment.rounds.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let factors = 0;

  // Factor 1: Availability (40% weight)
  deployment.rounds.forEach(round => {
    const available = round.endpoints.filter(e => e.available).length;
    const total = round.endpoints.length;
    const availabilityScore = (available / total) * 40;
    totalScore += availabilityScore;
    factors++;
  });

  // Factor 2: Performance (40% weight)
  deployment.rounds.forEach(round => {
    const available = round.endpoints.filter(e => e.available);
    if (available.length > 0) {
      const avgResponse = available.reduce((sum, e) => sum + e.avgResponseTime, 0) / available.length;
      // Score based on performance: 200ms = 40 points, scales down
      const performanceScore = Math.max(0, Math.min(40, 40 * (500 - avgResponse) / 300));
      totalScore += performanceScore;
      factors++;
    }
  });

  // Factor 3: Stability (20% weight)
  if (deployment.rounds.length >= 2) {
    const round1Avg = calculateRoundAverage(deployment.rounds[0]);
    const round3Avg = calculateRoundAverage(deployment.rounds[deployment.rounds.length - 1]);

    if (round1Avg && round3Avg) {
      const variance = Math.abs(round3Avg - round1Avg) / round1Avg;
      // Stability score: less variance = higher score
      const stabilityScore = Math.max(0, 20 * (1 - variance));
      totalScore += stabilityScore;
      factors++;
    }
  }

  return Math.round(totalScore / factors * (100 / 40)); // Normalize to 0-100
}

function calculateRoundAverage(round) {
  const available = round.endpoints.filter(e => e.available);
  if (available.length === 0) return null;

  return available.reduce((sum, e) => sum + e.avgResponseTime, 0) / available.length;
}

function generateCurrentDeploymentReport(metrics) {
  log('\n' + '='.repeat(70), 'blue');
  log('  ANALYSIS ROUND 1: Current Deployment Metrics', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  const deployments = metrics.deployments;
  if (deployments.length === 0) {
    log('No deployments recorded yet.', 'yellow');
    return;
  }

  const latest = deployments[deployments.length - 1];

  log(`📦 Deployment ID: ${latest.deploymentId}`, 'cyan');
  log(`📅 Timestamp: ${formatDate(latest.timestamp)}`, 'cyan');
  log(`💾 Commit: ${latest.commit}`, 'cyan');
  log(`🔄 Rounds Collected: ${latest.rounds.length}`, 'cyan');

  const score = calculateDeploymentScore(latest);
  const scoreColor = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red';
  log(`\n⭐ Deployment Score: ${score}/100`, scoreColor);

  log('\n📊 Round-by-Round Metrics:', 'blue');
  latest.rounds.forEach((round, index) => {
    log(`\n  Round ${index + 1} (${formatDate(round.timestamp)}):`, 'cyan');

    round.endpoints.forEach(endpoint => {
      const url = endpoint.url.replace('https://', '').substring(0, 40);
      if (endpoint.available) {
        log(`    ✅ ${url}`, 'green');
        log(`       Avg: ${endpoint.avgResponseTime}ms | P95: ${endpoint.p95}ms`, 'blue');
      } else {
        log(`    ❌ ${url} - Unavailable`, 'red');
      }
    });
  });
}

function generateComparisonReport(metrics) {
  log('\n' + '='.repeat(70), 'blue');
  log('  ANALYSIS ROUND 2: Comparison with Previous Deployment', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  const deployments = metrics.deployments;
  if (deployments.length < 2) {
    log('Need at least 2 deployments for comparison.', 'yellow');
    return;
  }

  const latest = deployments[deployments.length - 1];
  const previous = deployments[deployments.length - 2];

  const latestScore = calculateDeploymentScore(latest);
  const previousScore = calculateDeploymentScore(previous);
  const scoreDiff = latestScore - previousScore;

  log(`📊 Current Deployment: ${latest.deploymentId}`, 'cyan');
  log(`   Score: ${latestScore}/100`, latestScore >= previousScore ? 'green' : 'yellow');

  log(`\n📊 Previous Deployment: ${previous.deploymentId}`, 'cyan');
  log(`   Score: ${previousScore}/100`, 'blue');

  log(`\n📈 Change:`, 'blue');
  if (scoreDiff > 0) {
    log(`   ✅ Improved by ${scoreDiff} points`, 'green');
  } else if (scoreDiff < 0) {
    log(`   ⚠️  Decreased by ${Math.abs(scoreDiff)} points`, 'yellow');
  } else {
    log(`   ➡️  No change`, 'blue');
  }

  // Performance comparison
  const latestAvg = calculateRoundAverage(latest.rounds[0]);
  const previousAvg = calculateRoundAverage(previous.rounds[0]);

  if (latestAvg && previousAvg) {
    const perfDiff = ((latestAvg - previousAvg) / previousAvg) * 100;

    log(`\n⚡ Performance Comparison:`, 'blue');
    log(`   Current: ${latestAvg}ms avg response time`, 'cyan');
    log(`   Previous: ${previousAvg}ms avg response time`, 'cyan');

    if (Math.abs(perfDiff) < 5) {
      log(`   ✅ Similar performance (${perfDiff.toFixed(1)}%)`, 'green');
    } else if (perfDiff > 0) {
      log(`   ⚠️  ${perfDiff.toFixed(1)}% slower`, 'yellow');
    } else {
      log(`   ✅ ${Math.abs(perfDiff).toFixed(1)}% faster`, 'green');
    }
  }
}

function generateTrendAnalysis(metrics) {
  log('\n' + '='.repeat(70), 'blue');
  log('  ANALYSIS ROUND 3: Trend Analysis (Last 10 Deployments)', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  const deployments = metrics.deployments;
  const last10 = deployments.slice(-10);

  if (last10.length < 3) {
    log('Need at least 3 deployments for trend analysis.', 'yellow');
    return;
  }

  log(`📊 Analyzing ${last10.length} deployments`, 'cyan');

  // Calculate scores for all
  const scores = last10.map(d => ({
    id: d.deploymentId,
    timestamp: d.timestamp,
    score: calculateDeploymentScore(d)
  }));

  // Calculate average score
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

  log(`\n📈 Average Score: ${Math.round(avgScore)}/100`, 'blue');

  // Identify trend
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));

  const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;

  log(`\n📊 Trend Analysis:`, 'blue');
  log(`   First half average: ${Math.round(firstHalfAvg)}/100`, 'cyan');
  log(`   Second half average: ${Math.round(secondHalfAvg)}/100`, 'cyan');

  if (secondHalfAvg > firstHalfAvg + 5) {
    log(`   ✅ Improving trend`, 'green');
  } else if (secondHalfAvg < firstHalfAvg - 5) {
    log(`   ⚠️  Declining trend`, 'yellow');
  } else {
    log(`   ➡️  Stable`, 'blue');
  }

  // Show recent deployments
  log(`\n📋 Recent Deployments:`, 'blue');
  last10.slice(-5).forEach(d => {
    const score = calculateDeploymentScore(d);
    const emoji = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
    log(`   ${emoji} ${d.deploymentId} - Score: ${score}/100 - ${formatDate(d.timestamp)}`, 'cyan');
  });

  // Calculate success rate
  const successfulDeployments = scores.filter(s => s.score >= 70).length;
  const successRate = (successfulDeployments / scores.length) * 100;

  log(`\n📊 Success Rate: ${successRate.toFixed(1)}% (${successfulDeployments}/${scores.length} deployments >= 70 score)`,
      successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
}

function main() {
  log('\n' + '='.repeat(70), 'magenta');
  log('  DEPLOYMENT REPORT GENERATOR', 'magenta');
  log('  Three-Round Analysis Strategy', 'magenta');
  log('='.repeat(70), 'magenta');

  const metrics = loadMetrics();
  if (!metrics) {
    process.exit(1);
  }

  // Round 1: Current deployment
  generateCurrentDeploymentReport(metrics);

  // Round 2: Comparison
  generateComparisonReport(metrics);

  // Round 3: Trend analysis
  generateTrendAnalysis(metrics);

  // Summary
  log('\n' + '='.repeat(70), 'blue');
  log('  REPORT COMPLETE', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  log('💡 Insights:', 'cyan');
  log('   - Review scores < 70 for potential issues', 'blue');
  log('   - Monitor declining trends for early intervention', 'blue');
  log('   - Investigate performance regressions', 'blue');

  log('\n✅ Deployment report generated successfully', 'green');
}

if (require.main === module) {
  main();
}

module.exports = { generateCurrentDeploymentReport, generateComparisonReport, generateTrendAnalysis };
