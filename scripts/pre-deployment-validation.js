#!/usr/bin/env node

/**
 * Pre-Deployment Validation Script
 *
 * Implements the "Repeat 3 Times" validation strategy:
 * - Round 1: Code Quality & Static Analysis
 * - Round 2: Build Validation & Spec Compliance
 * - Round 3: Contract Verification & Final Checks
 *
 * This script ensures all spec-driven development best practices are followed
 * before code reaches production deployment.
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: One or more validations failed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function runCommand(command, description, continueOnError = false) {
  const startTime = Date.now();

  try {
    log(`\n🔄 ${description}...`, 'cyan');
    execSync(command, { stdio: 'inherit' });
    const duration = Date.now() - startTime;
    log(`✅ ${description} - PASSED (${duration}ms)`, 'green');
    return { success: true, duration, description };
  } catch (error) {
    const duration = Date.now() - startTime;
    if (continueOnError) {
      log(`⚠️  ${description} - WARNING (${duration}ms)`, 'yellow');
      return { success: true, duration, description, warning: true };
    } else {
      log(`❌ ${description} - FAILED (${duration}ms)`, 'red');
      return { success: false, duration, description };
    }
  }
}

function printBanner(text) {
  const width = 60;
  const padding = '='.repeat(width);

  log(`\n${padding}`, 'blue');
  log(`  ${text}`, 'blue');
  log(`${padding}\n`, 'blue');
}

function printPhaseHeader(phase, title) {
  log(`\n${'━'.repeat(60)}`, 'magenta');
  log(`🔄 VALIDATION ROUND ${phase}: ${title}`, 'magenta');
  log(`${'━'.repeat(60)}`, 'magenta');
}

async function main() {
  printBanner('PRE-DEPLOYMENT VALIDATION');
  log('Implementing Spec-Driven Development Best Practices', 'cyan');
  log('Three-Round Validation Strategy\n', 'cyan');

  const allResults = [];
  let hasFailures = false;

  // =========================================================================
  // ROUND 1: Code Quality & Static Analysis
  // =========================================================================
  printPhaseHeader(1, 'Code Quality & Static Analysis');
  log('Validating code meets quality standards and type safety', 'cyan');

  const round1 = [
    { cmd: 'pnpm run type-check', desc: 'TypeScript type checking', critical: true },
    { cmd: 'pnpm run lint', desc: 'ESLint code quality', critical: true },
    { cmd: 'pnpm run format:check', desc: 'Code formatting (Prettier)', critical: false },
    { cmd: 'node scripts/validate-env.js', desc: 'Environment configuration validation', critical: false },
    { cmd: 'pnpm audit --audit-level=high', desc: 'Security vulnerability scan', critical: false }
  ];

  log('\n📋 Running Round 1 validations...', 'blue');
  for (const validation of round1) {
    const result = runCommand(validation.cmd, validation.desc, !validation.critical);
    allResults.push(result);
    if (!result.success) {
      hasFailures = true;
      if (validation.critical) {
        log('\n❌ Critical validation failed in Round 1. Stopping.', 'red');
        process.exit(1);
      }
    }
  }

  // =========================================================================
  // ROUND 2: Build Validation & Spec Compliance
  // =========================================================================
  printPhaseHeader(2, 'Build Validation & Spec Compliance');
  log('Validating specs, schemas, and database structure', 'cyan');

  const round2 = [
    { cmd: 'node scripts/validate-openapi-contract.js', desc: 'OpenAPI contract compliance', critical: false },
    { cmd: 'node scripts/validate-database-schema.js', desc: 'Database schema validation', critical: false },
    { cmd: 'node scripts/validate-zod-schemas.js', desc: 'Zod schema alignment', critical: false },
    { cmd: 'node scripts/validate-migrations.js', desc: 'Migration file validation', critical: false }
  ];

  log('\n📋 Running Round 2 validations...', 'blue');
  for (const validation of round2) {
    const result = runCommand(validation.cmd, validation.desc, !validation.critical);
    allResults.push(result);
    if (!result.success) {
      hasFailures = true;
    }
  }

  // =========================================================================
  // ROUND 3: Contract Verification & Final Checks
  // =========================================================================
  printPhaseHeader(3, 'Contract Verification & Final Checks');
  log('Running final integration and contract tests', 'cyan');

  const round3 = [
    { cmd: 'pnpm run test:unit', desc: 'Unit tests', critical: true },
    { cmd: 'pnpm run test:integration', desc: 'Integration tests', critical: true }
  ];

  // Check if build artifacts exist for bundle size check
  const buildPath = path.join(__dirname, '../apps/booking/.open-next/assets');
  if (fs.existsSync(buildPath)) {
    round3.push({
      cmd: 'node scripts/check-bundle-size.js apps/booking/.open-next/assets',
      desc: 'Bundle size validation',
      critical: false
    });
  } else {
    log('\n⚠️  Build artifacts not found, skipping bundle size check', 'yellow');
    log('   Run `pnpm run build` first to validate bundle sizes', 'yellow');
  }

  log('\n📋 Running Round 3 validations...', 'blue');
  for (const validation of round3) {
    const result = runCommand(validation.cmd, validation.desc, !validation.critical);
    allResults.push(result);
    if (!result.success) {
      hasFailures = true;
      if (validation.critical) {
        log('\n❌ Critical validation failed in Round 3. Stopping.', 'red');
        printSummary(allResults);
        process.exit(1);
      }
    }
  }

  // =========================================================================
  // Summary Report
  // =========================================================================
  printSummary(allResults);

  if (hasFailures) {
    log('\n❌ PRE-DEPLOYMENT VALIDATION FAILED', 'red');
    log('Please fix the issues above before deploying to production.', 'yellow');
    process.exit(1);
  } else {
    log('\n✅ PRE-DEPLOYMENT VALIDATION PASSED', 'green');
    log('All three validation rounds completed successfully!', 'green');
    log('Ready for production deployment.', 'green');
    process.exit(0);
  }
}

function printSummary(results) {
  printBanner('VALIDATION SUMMARY');

  const passed = results.filter(r => r.success && !r.warning).length;
  const warnings = results.filter(r => r.warning).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  log('📊 Results:', 'blue');
  log(`   Total checks: ${results.length}`, 'blue');
  log(`   ✅ Passed: ${passed}`, passed === results.length ? 'green' : 'blue');
  if (warnings > 0) {
    log(`   ⚠️  Warnings: ${warnings}`, 'yellow');
  }
  if (failed > 0) {
    log(`   ❌ Failed: ${failed}`, 'red');
  }
  log(`   ⏱️  Total time: ${Math.round(totalDuration / 1000)}s\n`, 'blue');

  if (failed > 0) {
    log('❌ Failed Validations:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`   - ${r.description}`, 'red');
    });
  }

  if (warnings > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    results.filter(r => r.warning).forEach(r => {
      log(`   - ${r.description}`, 'yellow');
    });
  }
}

// Run validation
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Validation error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runCommand };
