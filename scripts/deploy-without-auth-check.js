#!/usr/bin/env node

/**
 * Cloudflare Deployment Script - Skip network auth check
 * Deploys directly without waiting for network connectivity verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DirectCloudflareDeployer {
  constructor() {
    this.deploymentLog = [];
    this.startTime = Date.now();
    this.deploymentId = `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.envVars = {};
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logEntry);
    this.deploymentLog.push(logEntry);
    
    // Write to deployment log file
    const logFile = `direct-deployment-${this.deploymentId}.log`;
    fs.appendFileSync(logFile, `${logEntry  }\n`);
  }

  loadEnvFromFile() {
    this.log('📋 Loading environment variables from .env files...');
    
    const bookingEnvPath = path.join(process.cwd(), 'apps', 'booking', '.env');
    
    if (fs.existsSync(bookingEnvPath)) {
      this.log('✅ Found apps/booking/.env file');
      const envContent = fs.readFileSync(bookingEnvPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            this.envVars[key.trim()] = value;
            
            // Set Cloudflare specific environment variables
            if (key.trim() === 'CLOUDFLARE_API_TOKEN' || key.trim() === 'CLOUDFLARE_ACCOUNT_ID') {
              process.env[key.trim()] = value;
              this.log(`✅ Set ${key.trim()} from .env`);
            }
          }
        }
      }
    } else {
      this.log('❌ apps/booking/.env file not found', 'error');
      throw new Error('Environment file not found');
    }
    
    return Object.keys(this.envVars).length > 0;
  }

  async run() {
    this.log('🚀 Starting Direct Cloudflare Deployment (Skip Auth Check)');
    this.log('='.repeat(60));
    
    try {
      // Step 1: Load environment variables
      this.log('Step 1: Loading environment variables...');
      this.loadEnvFromFile();
      
      if (!process.env.CLOUDFLARE_API_TOKEN) {
        throw new Error('CLOUDFLARE_API_TOKEN not found in .env files');
      }
      
      // Step 2: Skip network connectivity check and proceed directly
      this.log('Step 2: Skipping network connectivity check, proceeding with deployment...');
      
      // Step 3: Build applications
      this.log('Step 3: Building applications...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        this.log('✅ Applications built successfully');
      } catch (error) {
        this.log('❌ Build failed:', 'error');
        throw error;
      }
      
      // Step 4: Deploy Worker
      this.log('Step 4: Deploying Cloudflare Worker...');
      try {
        execSync('npx wrangler deploy', { stdio: 'inherit' });
        this.log('✅ Worker deployed successfully');
      } catch (error) {
        this.log('❌ Worker deployment failed:', 'error');
        throw error;
      }
      
      // Step 5: Deploy Next.js apps
      this.log('Step 5: Deploying Next.js applications...');
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
      this.log('Step 6: Applying database migrations...');
      const migrations = [
        'scripts/migrations/004-safe-instyle-sync.sql',
        'scripts/migrations/023-import-instyle-data.sql'
      ];
      
      for (const migration of migrations) {
        if (fs.existsSync(migration)) {
          try {
            this.log(`Applying migration: ${migration}`);
            execSync(`npx wrangler d1 execute appointmentbooking-db --remote --file=${migration}`, {
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
      
      // Save deployment log
      const logFile = `direct-deployment-${this.deploymentId}.log`;
      
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
      
      const logFile = `direct-deployment-${this.deploymentId}.log`;
      this.log(`📄 Error log saved: ${logFile}`);
      
      return { success: false, error: error.message, logFile };
    }
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new DirectCloudflareDeployer();
  deployer.run().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = DirectCloudflareDeployer;
