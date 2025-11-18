#!/usr/bin/env node

/**
 * Final Go-Live Execution Script
 * Executes the complete deployment process for production
 */

const { execSync } = require('child_process');

console.log('🚀 APPOINTMENT BOOKING PLATFORM - FINAL GO-LIVE');
console.log('='.repeat(60));

const steps = [
  {
    name: 'Build Verification',
    command: 'pnpm run build',
    description: 'Ensure all applications compile successfully'
  },
  {
    name: 'Database Migration',
    command: 'pnpm run migrate-db',
    description: 'Sync correct services to production database'
  },
  {
    name: 'Production Deployment',
    command: 'pnpm run deploy',
    description: 'Deploy all workers to Cloudflare'
  },
  {
    name: 'API Verification',
    command: 'pnpm run verify-api',
    description: 'Test live tenant API endpoints'
  }
];

async function executeStep(step, index) {
  console.log(`\n[${index + 1}/${steps.length}] ${step.name}`);
  console.log(`📝 ${step.description}`);
  console.log(`🔄 Command: ${step.command}`);
  
  try {
    const output = execSync(step.command, { 
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ SUCCESS');
    return true;
  } catch (error) {
    console.log('❌ FAILED');
    console.error('Error:', error.message);
    
    if (step.name === 'Database Migration' || step.name === 'Production Deployment') {
      console.log('\n🔐 Authentication Required:');
      console.log('Run: npx wrangler login');
      console.log('Or set: CLOUDFLARE_API_TOKEN environment variable');
    }
    
    return false;
  }
}

async function main() {
  let successCount = 0;
  
  for (const [index, step] of steps.entries()) {
    const success = await executeStep(step, index);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Completed: ${successCount}/${steps.length} steps`);
  
  if (successCount === steps.length) {
    console.log('\n🎉 SUCCESS: Platform is LIVE!');
    console.log('\n📋 Manual Steps Remaining:');
    console.log('1. Configure DNS records (if domains not resolving)');
    console.log('2. Instyle owner: Create 4 employee schedules in SuperSaaS');
    console.log('3. Test booking flow end-to-end');
    
    console.log('\n🌐 Platform URLs:');
    console.log('• Instyle Tenant: https://www.instylehairboutique.co.za');
    console.log('• Marketing Site: https://appointmentbooking.co.za');
    console.log('• Dashboard: https://dashboard.appointmentbooking.co.za');
  } else {
    console.log('\n⚠️  PARTIAL SUCCESS: Some steps require manual completion');
    console.log('📖 See COMPLETE_GO_LIVE_GUIDE.md for detailed instructions');
  }
}

main().catch(console.error);