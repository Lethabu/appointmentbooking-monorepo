#!/usr/bin/env node

/**
 * Cloudflare Deployment Script with API Token
 * Works with existing API token authentication
 */

const { execSync } = require('child_process');
const fs = require('fs');

class CloudflareAPIDeployer {
  constructor() {
    this.accountId = '9e96c83268cae3e0f27168ed50c92033';
    this.databaseName = 'appointmentbooking-db';
    this.databaseId = '59c06cd2-8bd2-45cf-ab62-84d7a4919e11';
    this.deploymentLog = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logEntry);
    this.deploymentLog.push(logEntry);
  }

  async run() {
    this.log('🚀 Starting Cloudflare Direct Deployment with API Token');
    this.log('='.repeat(60));

    try {
      // Step 1: Check Wrangler version and status
      this.log('🔍 Checking Wrangler status...');
      try {
        const whoami = execSync('npx wrangler whoami', { 
          encoding: 'utf8', 
          timeout: 10000 
        });
        this.log('✅ Wrangler is authenticated:');
        this.log(whoami);
      } catch (error) {
        this.log('❌ Wrangler authentication failed:', 'error');
        throw new Error('Wrangler authentication required. Please set CLOUDFLARE_API_TOKEN environment variable.');
      }

      // Step 2: Install dependencies
      this.log('📦 Installing dependencies...');
      try {
        execSync('npm install', { stdio: 'inherit' });
        this.log('✅ Dependencies installed');
      } catch (error) {
        this.log('⚠️ npm install failed, trying with current setup...', 'warning');
      }

      // Step 3: Build applications
      this.log('🔨 Building applications...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        this.log('✅ Applications built successfully');
      } catch (error) {
        this.log('❌ Build failed:', 'error');
        throw error;
      }

      // Step 4: Deploy Worker
      this.log('🚀 Deploying Cloudflare Worker...');
      try {
        execSync('npx wrangler deploy', { stdio: 'inherit' });
        this.log('✅ Worker deployed successfully');
      } catch (error) {
        this.log('❌ Worker deployment failed:', 'error');
        throw error;
      }

      // Step 5: Deploy Next.js apps
      this.log('📱 Deploying Next.js applications...');
      const apps = ['booking', 'dashboard'];
      
      for (const app of apps) {
        try {
          this.log(`Deploying ${app} app...`);
          execSync(`cd apps/${app} && npm run pages:deploy`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          this.log(`✅ ${app} app deployed successfully`);
        } catch (error) {
          this.log(`⚠️ ${app} app deployment may have issues:`, 'warning');
          // Continue with other apps even if one fails
        }
      }

      // Step 6: Apply database migrations
      this.log('🗄️ Applying database migrations...');
      const migrations = [
        'scripts/migrations/004-safe-instyle-sync.sql',
        'scripts/migrations/023-import-instyle-data.sql'
      ];

      for (const migration of migrations) {
        if (fs.existsSync(migration)) {
          try {
            this.log(`Applying migration: ${migration}`);
            execSync(`npx wrangler d1 execute ${this.databaseName} --remote --file=${migration}`, {
              stdio: 'inherit'
            });
            this.log(`✅ Migration applied: ${migration}`);
          } catch (error) {
            this.log(`⚠️ Migration may have issues: ${migration}`, 'warning');
          }
        } else {
          this.log(`⚠️ Migration file not found: ${migration}`, 'warning');
        }
      }

      // Step 7: Verify deployment
      this.log('🔍 Verifying deployment...');
      try {
        const deployments = execSync('npx wrangler deployments list', {
          encoding: 'utf8'
        });
        this.log('✅ Deployment verification complete');
        this.log('Recent deployments:', deployments);
      } catch (error) {
        this.log('⚠️ Could not list deployments:', 'warning');
      }

      // Save deployment log
      const logFile = `deployment-log-${Date.now()}.txt`;
      fs.writeFileSync(logFile, this.deploymentLog.join('\n'));
      
      this.log('🎉 DEPLOYMENT COMPLETED!');
      this.log(`📄 Deployment log saved: ${logFile}`);
      
      this.log('\n📋 NEXT STEPS:');
      this.log('1. Check Cloudflare dashboard for deployed workers');
      this.log('2. Configure custom domains:');
      this.log('   - instylehairboutique.co.za -> booking app');
      this.log('   - dashboard subdomain -> dashboard app');
      this.log('3. Test all endpoints manually');
      this.log('4. Verify SSL certificates are active');

      return { success: true, logFile };

    } catch (error) {
      this.log(`💥 DEPLOYMENT FAILED: ${error.message}`, 'error');
      
      const logFile = `deployment-log-${Date.now()}.txt`;
      fs.writeFileSync(logFile, this.deploymentLog.join('\n'));
      
      this.log(`📄 Error log saved: ${logFile}`);
      
      return { success: false, error: error.message, logFile };
    }
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new CloudflareAPIDeployer();
  deployer.run().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = CloudflareAPIDeployer;
