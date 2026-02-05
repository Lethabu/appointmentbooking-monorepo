#!/usr/bin/env node

/**
 * Go-Live Checklist Automation
 * Executes the complete go-live process for the appointment booking platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHECKLIST = [
  {
    id: 'auth_check',
    name: 'Cloudflare Authentication',
    description: 'Verify Wrangler is authenticated',
    command: 'npx wrangler whoami',
    required: true
  },
  {
    id: 'db_migration',
    name: 'Database Migration',
    description: 'Execute final Instyle services sync',
    command: 'npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/004-safe-instyle-sync.sql',
    required: true
  },
  {
    id: 'build_check',
    name: 'Build Verification',
    description: 'Ensure all apps build successfully',
    command: 'pnpm run build',
    required: true
  },
  {
    id: 'deploy',
    name: 'Production Deployment',
    description: 'Deploy all workers to Cloudflare',
    command: 'npx wrangler deploy',
    required: true
  },
  {
    id: 'api_test',
    name: 'API Verification',
    description: 'Test live tenant API endpoints',
    command: 'node scripts/verify-production-api.js',
    required: true
  }
];

function executeCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  console.log(`📝 Command: ${command}`);

  try {
    const output = execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'inherit'
    });

    console.log('✅ Success');
    // Output is already printed to console
    return true;
  } catch (error) {
    console.error('❌ Failed');
    console.error('🚨 Error:', error.message);
    if (error.stdout) {
      console.error('📄 Stdout:', error.stdout.toString().substring(0, 200));
    }
    if (error.stderr) {
      console.error('📄 Stderr:', error.stderr.toString().substring(0, 200));
    }
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

async function runGoLiveChecklist() {
  console.log('🚀 APPOINTMENT BOOKING PLATFORM - GO-LIVE CHECKLIST');
  console.log('='.repeat(60));

  // Pre-flight checks
  console.log('\n📋 Pre-flight Checks:');

  const requiredFiles = [
    'wrangler.toml',
    'scripts/migrations/004-safe-instyle-sync.sql',
    'package.json'
  ];

  for (const file of requiredFiles) {
    const exists = checkFileExists(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) {
      console.error(`🚨 Required file missing: ${file}`);
      process.exit(1);
    }
  }

  // Execute checklist
  console.log('\n🎯 Executing Go-Live Steps:');
  let successCount = 0;

  for (const [index, item] of CHECKLIST.entries()) {
    console.log(`\n[${index + 1}/${CHECKLIST.length}] ${item.name}`);
    console.log(`📝 ${item.description}`);

    const success = executeCommand(item.command, item.description);

    if (success) {
      successCount++;
      console.log(`✅ Step ${index + 1} completed successfully`);
    } else {
      console.error(`❌ Step ${index + 1} failed`);
      if (item.required) {
        console.error('🚨 This is a required step. Stopping execution.');
        break;
      }
    }
  }

  // Final report
  console.log(`\n${  '='.repeat(60)}`);
  console.log('📊 GO-LIVE SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Completed: ${successCount}/${CHECKLIST.length} steps`);

  if (successCount === CHECKLIST.length) {
    console.log('\n🎉 SUCCESS: Platform is ready for production!');
    console.log('\n📋 Manual Steps Required:');
    console.log('1. Instyle owner must create 4 employee schedules in SuperSaaS');
    console.log('2. Configure employee working hours in each schedule');
    console.log('3. Test booking flow on instylehairboutique.co.za');
    console.log('4. Verify marketing site at appointmentbooking.co.za');
    console.log('5. Verify dashboard at dashboard.appointmentbooking.co.za');

    return true;
  } else {
    console.log('\n❌ INCOMPLETE: Some steps failed. Review errors above.');
    return false;
  }
}

if (require.main === module) {
  runGoLiveChecklist().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runGoLiveChecklist };