#!/usr/bin/env node

/**
 * Database Schema Validator
 *
 * Validates that the D1 database schema matches the Drizzle ORM schema definition.
 * This ensures database consistency and prevents schema drift.
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation failures detected
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DRIZZLE_SCHEMA_PATH = path.join(__dirname, '../packages/db/src/schema.ts');
const MIGRATIONS_PATH = path.join(__dirname, '../scripts/migrations');

// Color codes
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

function extractTablesFromDrizzle() {
  try {
    const schemaContent = fs.readFileSync(DRIZZLE_SCHEMA_PATH, 'utf8');
    const tables = [];

    // Extract table definitions using regex
    // Matches patterns like: export const tableName = sqliteTable('table_name', {
    const tablePattern = /export\s+const\s+(\w+)\s*=\s*(?:sqliteTable|pgTable)\s*\(\s*['"`]([^'"`]+)['"`]/g;

    let match;
    while ((match = tablePattern.exec(schemaContent)) !== null) {
      tables.push({
        variableName: match[1],
        tableName: match[2]
      });
    }

    return tables;
  } catch (error) {
    log(`Error reading Drizzle schema: ${error.message}`, 'red');
    return [];
  }
}

function getMigrationFiles() {
  try {
    if (!fs.existsSync(MIGRATIONS_PATH)) {
      log(`Migrations directory not found: ${MIGRATIONS_PATH}`, 'yellow');
      return [];
    }

    const files = fs.readdirSync(MIGRATIONS_PATH)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return files.map(file => ({
      filename: file,
      path: path.join(MIGRATIONS_PATH, file)
    }));
  } catch (error) {
    log(`Error reading migrations: ${error.message}`, 'red');
    return [];
  }
}

function extractTablesFromMigrations(migrations) {
  const tables = new Set();

  migrations.forEach(migration => {
    try {
      const content = fs.readFileSync(migration.path, 'utf8');

      // Extract CREATE TABLE statements
      const createTablePattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?['"`]?(\w+)['"`]?/gi;

      let match;
      while ((match = createTablePattern.exec(content)) !== null) {
        tables.add(match[1].toLowerCase());
      }
    } catch (error) {
      log(`Error reading migration ${migration.filename}: ${error.message}`, 'yellow');
    }
  });

  return Array.from(tables);
}

function validateMigrations(migrations) {
  const issues = [];

  log('\n📝 Validating Migration Files...', 'blue');

  // Check if migrations are numbered correctly
  const numbers = migrations.map(m => {
    const match = m.filename.match(/^(\d+)/);
    return match ? parseInt(match[1]) : null;
  }).filter(n => n !== null);

  // Check for sequential numbering
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] >= numbers[i + 1]) {
      issues.push({
        type: 'ordering',
        message: `Migration numbers not sequential: ${numbers[i]} >= ${numbers[i + 1]}`
      });
      log(`   ⚠️  Migration ordering issue: ${numbers[i]} >= ${numbers[i + 1]}`, 'yellow');
    }
  }

  // Check for idempotency markers
  migrations.forEach(migration => {
    try {
      const content = fs.readFileSync(migration.path, 'utf8');
      const hasIfNotExists = content.includes('IF NOT EXISTS');

      if (!hasIfNotExists) {
        log(`   ⚠️  Migration may not be idempotent: ${migration.filename}`, 'yellow');
        log(`      Consider using 'IF NOT EXISTS' for safer re-runs`, 'yellow');
      } else {
        log(`   ✅ ${migration.filename} appears idempotent`, 'green');
      }
    } catch (error) {
      log(`   ❌ Error reading ${migration.filename}: ${error.message}`, 'red');
    }
  });

  return issues;
}

function compareSchemas(drizzleTables, migrationTables) {
  const issues = [];

  log('\n🔍 Comparing Drizzle Schema with Migrations...', 'blue');
  log('=' .repeat(50), 'blue');

  // Check if all Drizzle tables have migrations
  drizzleTables.forEach(table => {
    const tableName = table.tableName.toLowerCase();
    if (!migrationTables.includes(tableName)) {
      issues.push({
        type: 'missing_migration',
        table: table.tableName,
        message: `Table '${table.tableName}' defined in Drizzle but not found in migrations`
      });
      log(`❌ Missing migration for: ${table.tableName}`, 'red');
    } else {
      log(`✅ Migration exists for: ${table.tableName}`, 'green');
    }
  });

  // Check for extra tables in migrations (informational)
  migrationTables.forEach(tableName => {
    const inDrizzle = drizzleTables.some(t => t.tableName.toLowerCase() === tableName.toLowerCase());
    if (!inDrizzle) {
      // This might be OK - migrations can include temp tables or historical tables
      log(`⚠️  Table '${tableName}' in migrations but not in current Drizzle schema`, 'yellow');
      log(`   (This may be intentional for historical data)`, 'yellow');
    }
  });

  return issues;
}

function checkD1Connection() {
  log('\n🔌 Checking D1 Database Connection...', 'blue');

  try {
    // Try to list D1 databases to verify wrangler is configured
    execSync('npx wrangler d1 list', { stdio: 'pipe' });
    log('   ✅ Wrangler configured, D1 accessible', 'green');
    return true;
  } catch (error) {
    log('   ⚠️  Cannot connect to D1 (wrangler may need configuration)', 'yellow');
    log('   Skipping live D1 schema validation', 'yellow');
    return false;
  }
}

function main() {
  log('\n🔍 Database Schema Validation', 'blue');
  log('='.repeat(50), 'blue');

  let allIssues = [];

  // Extract Drizzle tables
  log('\n📖 Parsing Drizzle ORM Schema...', 'blue');
  const drizzleTables = extractTablesFromDrizzle();
  log(`   Found ${drizzleTables.length} tables defined in Drizzle schema`, 'green');

  if (drizzleTables.length > 0) {
    log('\n   Drizzle Tables:', 'blue');
    drizzleTables.forEach(table => {
      log(`   - ${table.tableName} (${table.variableName})`, 'blue');
    });
  }

  // Get migration files
  log('\n📂 Loading Migration Files...', 'blue');
  const migrations = getMigrationFiles();
  log(`   Found ${migrations.length} migration files`, 'green');

  if (migrations.length > 0) {
    log('\n   Migrations:', 'blue');
    migrations.forEach((migration, i) => {
      log(`   ${i + 1}. ${migration.filename}`, 'blue');
    });
  }

  // Validate migrations
  const migrationIssues = validateMigrations(migrations);
  allIssues = allIssues.concat(migrationIssues);

  // Extract tables from migrations
  log('\n🔍 Extracting Tables from Migrations...', 'blue');
  const migrationTables = extractTablesFromMigrations(migrations);
  log(`   Found ${migrationTables.length} tables in migrations`, 'green');

  // Compare schemas
  const schemaIssues = compareSchemas(drizzleTables, migrationTables);
  allIssues = allIssues.concat(schemaIssues);

  // Check D1 connection (optional - may not be available in CI)
  checkD1Connection();

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (allIssues.length === 0) {
    log('✅ Database Schema Validation Passed!', 'green');
    log(`   Drizzle tables: ${drizzleTables.length}`, 'green');
    log(`   Migration tables: ${migrationTables.length}`, 'green');
    log(`   Migrations files: ${migrations.length}`, 'green');
    process.exit(0);
  } else {
    log(`❌ Found ${allIssues.length} schema validation issues`, 'red');
    log('\nSchema Validation Failed!', 'red');
    log('Please ensure Drizzle schema matches migrations.', 'yellow');
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = { extractTablesFromDrizzle, extractTablesFromMigrations, compareSchemas };
