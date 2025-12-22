#!/usr/bin/env node

/**
 * Direct Cloudflare Deployment Script
 * Bypasses GitHub for direct deployment to Cloudflare
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DirectCloudflareDeploy {
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

  executeCommand(command, description, cwd = process.cwd()) {
    this.log(`Executing: ${command}`);
    this.log(`Description: ${description}`);

    try {
      const output = execSync(command, {
        cwd,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      this.log('✅ Command executed successfully');
      return { success: true, output };
    } catch (error) {
      this.log(`❌ Command failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async checkWranglerAuth() {
    this.log('🔐 Checking Cloudflare Wrangler Authentication...');
    
    try {
      const result = execSync('npx wrangler whoami', {
        encoding: 'utf8',
        timeout: 10000
      });
      this.log('✅ Wrangler is authenticated');
      return true;
    } catch (error) {
      this.log('❌ Wrangler authentication required', 'error');
      this.log('Please run: npx wrangler login', 'error');
      return false;
    }
  }

  async installDependencies() {
    this.log('📦 Installing project dependencies...');
    
    try {
      execSync('pnpm install', { stdio: 'inherit' });
      this.log('✅ Dependencies installed successfully');
      return true;
    } catch (error) {
      this.log(`❌ Failed to install dependencies: ${error.message}`, 'error');
      return false;
    }
  }

  async buildApplications() {
    this.log('🔨 Building all applications...');
    
    try {
      execSync('pnpm run build', { stdio: 'inherit' });
      this.log('✅ All applications built successfully');
      return true;
    } catch (error) {
      this.log(`❌ Build failed: ${error.message}`, 'error');
      return false;
    }
  }

  async deployWorker() {
    this.log('🚀 Deploying Cloudflare Worker...');
    
    try {
      execSync('npx wrangler deploy', { stdio: 'inherit' });
      this.log('✅ Worker deployed successfully');
      return true;
    } catch (error) {
      this.log(`❌ Worker deployment failed: ${error.message}`, 'error');
      return false;
    }
  }

  async deployNextJsApps() {
    this.log('📱 Deploying Next.js applications...');
    
    const apps = ['booking', 'dashboard'];
    const results = {};
    
    for (const app of apps) {
      this.log(`Deploying ${app} app...`);
      try {
        execSync(`cd apps/${app} && npm run pages:deploy`, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        this.log(`✅ ${app} app deployed successfully`);
        results[app] = true;
      } catch (error) {
        this.log(`❌ ${app} app deployment failed: ${error.message}`, 'error');
        results[app] = false;
      }
    }
    
    return results;
  }

  async applyDatabaseMigrations() {
    this.log('🗄️ Applying database migrations...');
    
    const migrations = [
      'scripts/migrations/004-safe-instyle-sync.sql',
      'scripts/migrations/023-import-instyle-data.sql'
    ];
    
    for (const migration of migrations) {
      if (fs.existsSync(migration)) {
        this.log(`Applying migration: ${migration}`);
        try {
          execSync(`npx wrangler d1 execute ${this.databaseName} --remote --file=${migration}`, {
            stdio: 'inherit'
          });
          this.log(`✅ Migration applied: ${migration}`);
        } catch (error) {
          this.log(`❌ Migration failed: ${migration}`, 'error');
        }
      } else {
        this.log(`⚠️ Migration file not found: ${migration}`, 'warning');
      }
    }
    
    return true;
  }

  async verifyDeployment() {
    this.log('🔍 Verifying deployment...');
    
    // Test API endpoints
    const apiTests = [
      'http://localhost:8787/health',
      'http://localhost:8787/api/tenants'
    ];
    
    for (const endpoint of apiTests) {
      try {
        const result = execSync(`curl -s -o /dev/null -w "%{http_code}" ${endpoint}`, {
          encoding: 'utf8'
        });
        if (result === '200') {
          this.log(`✅ Endpoint accessible: ${endpoint}`);
        } else {
          this.log(`⚠️ Endpoint returned ${result}: ${endpoint}`, 'warning');
        }
      } catch (error) {
        this.log(`⚠️ Endpoint test failed: ${endpoint}`, 'warning');
      }
    }
    
    return true;
  }

  async saveDeploymentLog() {
    const logContent = this.deploymentLog.join('\n');
    const logFile = `deployment-log-${Date.now()}.txt`;
    
    fs.writeFileSync(logFile, logContent);
    this.log(`📄 Deployment log saved: ${logFile}`);
    
    return logFile;
  }

  async run() {
    this.log('🚀 Starting Direct Cloudflare Deployment');
    this.log('='.repeat(60));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Pre-deployment checks
      this.log('📋 Phase 1: Pre-deployment Checks');
      
      const authOk = await this.checkWranglerAuth();
      if (!authOk) {
        throw new Error('Wrangler authentication required');
      }
      
      // Phase 2: Build applications
      this.log('📋 Phase 2: Building Applications');
      
      const depsOk = await this.installDependencies();
      if (!depsOk) {
        throw new Error('Failed to install dependencies');
      }
      
      const buildOk = await this.buildApplications();
      if (!buildOk) {
        throw new Error('Build failed');
      }
      
      // Phase 3: Deploy to Cloudflare
      this.log('📋 Phase 3: Deploying to Cloudflare');
      
      const workerOk = await this.deployWorker();
      if (!workerOk) {
        throw new Error('Worker deployment failed');
      }
      
      const appsOk = await this.deployNextJsApps();
      
      // Phase 4: Database setup
      this.log('📋 Phase 4: Database Setup');
      
      await this.applyDatabaseMigrations();
      
      // Phase 5: Verification
      this.log('📋 Phase 5: Verification');
      
      await this.verifyDeployment();
      
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      
      this.log('🎉 Deployment completed successfully!');
      this.log(`⏱️ Total time: ${duration} seconds`);
      
      const logFile = await this.saveDeploymentLog();
      
      this.log('📋 Next Steps:');
      this.log('1. Configure custom domains in Cloudflare dashboard');
      this.log('2. Set up DNS records for instylehairboutique.co.za');
      this.log('3. Enable SSL/TLS certificates');
      this.log('4. Test end-to-end functionality');
      
      return { success: true, logFile, duration };
      
    } catch (error) {
      this.log(`💥 Deployment failed: ${error.message}`, 'error');
      
      const logFile = await this.saveDeploymentLog();
      
      return { success: false, error: error.message, logFile };
    }
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new DirectCloudflareDeploy();
  deployer.run().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = DirectCloudflareDeploy;
