#!/usr/bin/env node

/**
 * Cloudflare Direct Deployment - Task Progress Tracker
 * Manages the deployment checklist and progress tracking
 */

const taskProgress = {
  "cloudflare_direct_deployment": {
    "title": "Deploy to Cloudflare Directly (Bypassing GitHub)",
    "description": "Complete end-to-end deployment to Cloudflare without using GitHub",
    "tasks": [
      {
        "id": "setup_authentication",
        "title": "Set up Cloudflare Authentication",
        "description": "Configure Wrangler authentication for direct Cloudflare access",
        "status": "pending",
        "command": "node scripts/quick-cloudflare-auth.js",
        "estimated_time": "5 minutes"
      },
      {
        "id": "verify_configuration",
        "title": "Verify Project Configuration",
        "description": "Check wrangler.toml, package.json, and deployment configs",
        "status": "pending",
        "command": "npm run build && npm run lint",
        "estimated_time": "10 minutes"
      },
      {
        "id": "build_applications",
        "title": "Build All Applications",
        "description": "Build Next.js apps and prepare Worker for deployment",
        "status": "pending",
        "command": "pnpm run build",
        "estimated_time": "15 minutes"
      },
      {
        "id": "deploy_worker",
        "title": "Deploy Cloudflare Worker",
        "description": "Deploy main Worker API to Cloudflare",
        "status": "pending",
        "command": "npx wrangler deploy",
        "estimated_time": "5 minutes"
      },
      {
        "id": "deploy_nextjs_apps",
        "title": "Deploy Next.js Applications",
        "description": "Deploy booking and dashboard apps to Cloudflare Pages",
        "status": "pending",
        "command": "cd apps/booking && npm run pages:deploy && cd ../dashboard && npm run pages:deploy",
        "estimated_time": "10 minutes"
      },
      {
        "id": "apply_database_migrations",
        "title": "Apply Database Migrations",
        "description": "Execute D1 database migrations on Cloudflare",
        "status": "pending",
        "command": "wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/004-safe-instyle-sync.sql",
        "estimated_time": "5 minutes"
      },
      {
        "id": "configure_custom_domains",
        "title": "Configure Custom Domains",
        "description": "Set up instylehairboutique.co.za and dashboard subdomain routing",
        "status": "pending",
        "command": "Manual via Cloudflare Dashboard",
        "estimated_time": "15 minutes"
      },
      {
        "id": "verify_deployment",
        "title": "Verify Deployment",
        "description": "Test all endpoints and functionality",
        "status": "pending",
        "command": "node scripts/verify-production-api.js",
        "estimated_time": "10 minutes"
      },
      {
        "id": "end_to_end_testing",
        "title": "End-to-End Testing",
        "description": "Complete user journey testing from booking to dashboard",
        "status": "pending",
        "command": "Manual testing + automated tests",
        "estimated_time": "20 minutes"
      }
    ],
    "total_estimated_time": "95 minutes",
    "status": "in_progress",
    "created_at": new Date().toISOString()
  }
};

function updateTaskProgress(taskId, status, notes = '') {
  const task = taskProgress.cloudflare_direct_deployment.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;
    task.notes = notes;
    task.completed_at = status === 'completed' ? new Date().toISOString() : null;
  }
  return task;
}

function getCurrentStatus() {
  const tasks = taskProgress.cloudflare_direct_deployment.tasks;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const progress = Math.round((completed / total) * 100);
  
  return {
    completed,
    total,
    progress,
    remaining_time: estimateRemainingTime(tasks)
  };
}

function estimateRemainingTime(tasks) {
  const remaining = tasks.filter(t => t.status !== 'completed');
  const totalMinutes = remaining.reduce((sum, task) => {
    const minutes = parseInt(task.estimated_time) || 5;
    return sum + minutes;
  }, 0);
  return `${totalMinutes} minutes`;
}

function generateProgressReport() {
  const status = getCurrentStatus();
  const tasks = taskProgress.cloudflare_direct_deployment.tasks;
  
  console.log('\n🚀 CLOUDFLARE DIRECT DEPLOYMENT - PROGRESS REPORT');
  console.log('='.repeat(60));
  console.log(`📊 Progress: ${status.completed}/${status.total} tasks (${status.progress}%)`);
  console.log(`⏱️ Estimated remaining time: ${status.remaining_time}`);
  console.log(`📅 Status: ${taskProgress.cloudflare_direct_deployment.status}`);
  console.log('\n📋 TASK BREAKDOWN:');
  
  tasks.forEach((task, index) => {
    const icon = task.status === 'completed' ? '✅' : 
                task.status === 'in_progress' ? '🔄' : 
                task.status === 'failed' ? '❌' : '⏳';
    
    console.log(`\n${index + 1}. ${icon} ${task.title}`);
    console.log(`   📝 ${task.description}`);
    console.log(`   ⏱️ Estimated: ${task.estimated_time}`);
    if (task.notes) {
      console.log(`   📄 Notes: ${task.notes}`);
    }
  });
  
  return status;
}

// Save progress to file
function saveProgress() {
  const fs = require('fs');
  const progressFile = `deployment-progress-${Date.now()}.json`;
  fs.writeFileSync(progressFile, JSON.stringify(taskProgress, null, 2));
  console.log(`💾 Progress saved to: ${progressFile}`);
  return progressFile;
}

// Main execution functions
async function runDeployment() {
  console.log('🎯 Starting Cloudflare Direct Deployment Process');
  
  try {
    // Step 1: Setup Authentication
    updateTaskProgress('setup_authentication', 'in_progress');
    console.log('\n🔐 STEP 1: Setting up authentication...');
    const { setupCloudflareAuth } = require('./quick-cloudflare-auth.js');
    const authResult = await setupCloudflareAuth();
    
    if (authResult) {
      updateTaskProgress('setup_authentication', 'completed', 'Authentication setup successful');
    } else {
      updateTaskProgress('setup_authentication', 'failed', 'Authentication setup failed - manual intervention required');
      throw new Error('Authentication setup failed');
    }

    // Step 2: Verify Configuration
    updateTaskProgress('verify_configuration', 'in_progress');
    console.log('\n🔍 STEP 2: Verifying configuration...');
    
    // Check if all required files exist
    const fs = require('fs');
    const requiredFiles = ['wrangler.toml', 'package.json', 'apps/booking/package.json'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      updateTaskProgress('verify_configuration', 'failed', `Missing files: ${missingFiles.join(', ')}`);
      throw new Error(`Configuration verification failed: Missing files ${missingFiles.join(', ')}`);
    }
    
    updateTaskProgress('verify_configuration', 'completed', 'All configuration files verified');

    // Step 3: Build Applications
    updateTaskProgress('build_applications', 'in_progress');
    console.log('\n🔨 STEP 3: Building applications...');
    const { execSync } = require('child_process');
    
    try {
      execSync('pnpm run build', { stdio: 'inherit' });
      updateTaskProgress('build_applications', 'completed', 'All applications built successfully');
    } catch (error) {
      updateTaskProgress('build_applications', 'failed', `Build failed: ${error.message}`);
      throw error;
    }

    // Step 4: Deploy Worker
    updateTaskProgress('deploy_worker', 'in_progress');
    console.log('\n🚀 STEP 4: Deploying Worker...');
    
    try {
      execSync('npx wrangler deploy', { stdio: 'inherit' });
      updateTaskProgress('deploy_worker', 'completed', 'Worker deployed successfully');
    } catch (error) {
      updateTaskProgress('deploy_worker', 'failed', `Worker deployment failed: ${error.message}`);
      throw error;
    }

    // Step 5: Deploy Next.js Apps
    updateTaskProgress('deploy_nextjs_apps', 'in_progress');
    console.log('\n📱 STEP 5: Deploying Next.js applications...');
    
    const apps = ['booking', 'dashboard'];
    for (const app of apps) {
      try {
        console.log(`Deploying ${app}...`);
        execSync(`cd apps/${app} && npm run pages:deploy`, { stdio: 'inherit' });
        console.log(`✅ ${app} deployed successfully`);
      } catch (error) {
        updateTaskProgress('deploy_nextjs_apps', 'failed', `${app} deployment failed: ${error.message}`);
        throw error;
      }
    }
    
    updateTaskProgress('deploy_nextjs_apps', 'completed', 'All Next.js apps deployed');

    // Step 6: Database Migrations
    updateTaskProgress('apply_database_migrations', 'in_progress');
    console.log('\n🗄️ STEP 6: Applying database migrations...');
    
    try {
      const migrations = [
        'scripts/migrations/004-safe-instyle-sync.sql',
        'scripts/migrations/023-import-instyle-data.sql'
      ];
      
      for (const migration of migrations) {
        if (fs.existsSync(migration)) {
          console.log(`Applying migration: ${migration}`);
          execSync(`npx wrangler d1 execute appointmentbooking-db --remote --file=${migration}`, {
            stdio: 'inherit'
          });
        }
      }
      
      updateTaskProgress('apply_database_migrations', 'completed', 'Database migrations applied');
    } catch (error) {
      updateTaskProgress('apply_database_migrations', 'failed', `Migration failed: ${error.message}`);
      throw error;
    }

    // Update overall status
    taskProgress.cloudflare_direct_deployment.status = 'completed';
    taskProgress.cloudflare_direct_deployment.completed_at = new Date().toISOString();
    
    console.log('\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
    console.log('📋 Next Steps:');
    console.log('1. Configure custom domains in Cloudflare dashboard');
    console.log('2. Set up DNS records');
    console.log('3. Enable SSL certificates');
    console.log('4. Run end-to-end testing');
    
    const progressFile = saveProgress();
    const report = generateProgressReport();
    
    return { success: true, progressFile, report };
    
  } catch (error) {
    taskProgress.cloudflare_direct_deployment.status = 'failed';
    taskProgress.cloudflare_direct_deployment.failed_at = new Date().toISOString();
    taskProgress.cloudflare_direct_deployment.error = error.message;
    
    console.log(`\n💥 DEPLOYMENT FAILED: ${error.message}`);
    
    const progressFile = saveProgress();
    const report = generateProgressReport();
    
    return { success: false, error: error.message, progressFile, report };
  }
}

// Run if called directly
if (require.main === module) {
  runDeployment().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = {
  taskProgress,
  updateTaskProgress,
  getCurrentStatus,
  generateProgressReport,
  runDeployment,
  saveProgress
};
