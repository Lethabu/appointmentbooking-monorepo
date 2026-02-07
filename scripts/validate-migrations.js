#!/usr/bin/env node

/**
 * Migration Validator
 *
 * Validates database migration files for correctness and idempotency.
 * Ensures migrations follow best practices.
 *
 * Exit codes:
 * - 0: All migrations valid
 * - 1: Validation issues found
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_PATH = path.join(__dirname, '../scripts/migrations');

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

function getMigrationFiles() {
  try {
    if (!fs.existsSync(MIGRATIONS_PATH)) {
      log(`Migrations directory not found: ${MIGRATIONS_PATH}`, 'red');
      return [];
    }

    const files = fs.readdirSync(MIGRATIONS_PATH)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return files.map(file => ({
      filename: file,
      path: path.join(MIGRATIONS_PATH, file),
      number: extractNumber(file)
    }));
  } catch (error) {
    log(`Error reading migrations: ${error.message}`, 'red');
    return [];
  }
}

function extractNumber(filename) {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function validateMigrationSequence(migrations) {
  const issues = [];

  log('\n📋 Validating Migration Sequence...', 'blue');

  if (migrations.length === 0) {
    log('   No migrations found', 'yellow');
    return issues;
  }

  // Check numbering
  const numbers = migrations.map(m => m.number).filter(n => n !== null);

  if (numbers.length !==migrations.length) {
    log('   ❌ Some migrations lack numbering prefix', 'red');
    migrations.forEach(m => {
      if (m.number === null) {
        log(`      ${m.filename}`, 'red');
        issues.push({
          type: 'numbering',
          file: m.filename,
          message: 'Missing numbering prefix'
        });
      }
    });
  }

  // Check for sequential numbering
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] === numbers[i + 1]) {
      log(`   ❌ Duplicate migration number: ${numbers[i]}`, 'red');
      issues.push({
        type: 'duplicate',
        number: numbers[i],
        message: `Duplicate migration number`
      });
    } else if (numbers[i] > numbers[i + 1]) {
      log(`   ❌ Migration numbers not sequential: ${numbers[i]} > ${numbers[i + 1]}`, 'red');
      issues.push({
        type: 'sequence',
        message: `Non-sequential: ${numbers[i]} > ${numbers[i + 1]}`
      });
    }
  }

  if (issues.length === 0) {
    log(`   ✅ Migration sequence valid (${migrations.length} migrations)`, 'green');
  }

  return issues;
}

function validateMigrationContent(migration) {
  const issues = [];

  try {
    const content = fs.readFileSync(migration.path, 'utf8');

    // Check for idempotency markers
    const hasIfNotExists = content.toUpperCase().includes('IF NOT EXISTS');

    if (!hasIfNotExists) {
      issues.push({
        type: 'idempotency',
        file: migration.filename,
        message: 'Missing IF NOT EXISTS - migration may not be idempotent'
      });
    }

    // Check for dangerous operations
    const hasDrop = content.toUpperCase().includes('DROP TABLE') &&
                    !content.toUpperCase().includes('DROP TABLE IF EXISTS');

    if (hasDrop) {
      issues.push({
        type: 'safety',
        file: migration.filename,
        message: 'Contains DROP TABLE without IF EXISTS - potentially destructive'
      });
    }

    // Check for transactions (good practice)
    const hasTransaction = content.toUpperCase().includes('BEGIN') ||
                          content.toUpperCase().includes('START TRANSACTION');

    // Check file size (basic sanity check)
    const stats = fs.statSync(migration.path);
    if (stats.size === 0) {
      issues.push({
        type: 'empty',
        file: migration.filename,
        message: 'Migration file is empty'
      });
    } else if (stats.size > 1000000) { // 1MB
      issues.push({
        type: 'size',
        file: migration.filename,
        message: 'Migration file is very large (>1MB)'
      });
    }

    return {
      file: migration.filename,
      hasIfNotExists,
      hasTransaction,
      hasDangerousDrop: hasDrop,
      size: stats.size,
      issues
    };
  } catch (error) {
    return {
      file: migration.filename,
      issues: [{
        type: 'error',
        file: migration.filename,
        message: `Error reading file: ${error.message}`
      }]
    };
  }
}

function main() {
  log('\n🔍 Migration Validation', 'blue');
  log('='.repeat(50), 'blue');

  const migrations = getMigrationFiles();

  if (migrations.length === 0) {
    log('\n⚠️  No migrations found', 'yellow');
    log('If this is a new project, this is expected.', 'yellow');
    process.exit(0);
  }

  log(`\nFound ${migrations.length} migration files`, 'green');

  // Validate sequence
  const sequenceIssues = validateMigrationSequence(migrations);

  // Validate content
  log('\n📝 Validating Migration Content...', 'blue');

  const contentResults = migrations.map(validateMigrationContent);
  const contentIssues = contentResults.flatMap(r => r.issues);

  contentResults.forEach(result => {
    if (result.issues.length === 0) {
      log(`   ✅ ${result.file}`, 'green');
      if (result.hasIfNotExists) {
        log(`      - Idempotent (IF NOT EXISTS)`, 'green');
      }
      if (result.hasTransaction) {
        log(`      - Uses transactions`, 'green');
      }
    } else {
      result.issues.forEach(issue => {
        if (issue.type === 'idempotency') {
          log(`   ⚠️  ${result.file}`, 'yellow');
          log(`      ${issue.message}`, 'yellow');
        } else {
          log(`   ❌ ${result.file}`, 'red');
          log(`      ${issue.message}`, 'red');
        }
      });
    }
  });

  // Summary
  log('\n' + '='.repeat(50), 'blue');

  const allIssues = [...sequenceIssues, ...contentIssues];
  const criticalIssues = allIssues.filter(i =>
    i.type !== 'idempotency' && i.type !== 'size'
  );
  const warnings = allIssues.filter(i =>
    i.type === 'idempotency' || i.type === 'size'
  );

  if (allIssues.length === 0) {
    log('\n✅ All Migrations Valid!', 'green');
    log(`   Validated ${migrations.length} migration files`, 'green');
    process.exit(0);
  } else if (criticalIssues.length === 0) {
    log('\n✅ Migrations Valid', 'green');
    log(`   ${warnings.length} warning(s) - review recommended`, 'yellow');
    log('\n   Consider adding IF NOT EXISTS for idempotency', 'yellow');
    process.exit(0); // Don't fail on warnings
  } else {
    log('\n❌ Migration Validation Failed', 'red');
    log(`   ${criticalIssues.length} critical issue(s)`, 'red');
    log(`   ${warnings.length} warning(s)`, 'yellow');
    log('\n   Please fix migration issues before deployment.', 'yellow');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getMigrationFiles, validateMigrationContent };
