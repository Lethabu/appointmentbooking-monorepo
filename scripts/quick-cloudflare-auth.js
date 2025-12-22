#!/usr/bin/env node

/**
 * Quick Cloudflare Authentication Script
 * Sets up Wrangler authentication for direct deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');

async function setupCloudflareAuth() {
  console.log('🔐 Setting up Cloudflare Authentication for Direct Deployment');
  console.log('='.repeat(60));

  try {
    // Check if wrangler is installed
    console.log('📦 Checking Wrangler installation...');
    try {
      const version = execSync('npx wrangler --version', { encoding: 'utf8' });
      console.log(`✅ Wrangler found: ${version.trim()}`);
    } catch (error) {
      console.log('📦 Installing Wrangler...');
      execSync('npm install -g wrangler', { stdio: 'inherit' });
      console.log('✅ Wrangler installed');
    }

    // Check current authentication status
    console.log('\n🔍 Checking authentication status...');
    try {
      const whoami = execSync('npx wrangler whoami', { encoding: 'utf8', timeout: 5000 });
      console.log('✅ Already authenticated:');
      console.log(whoami);
      
      // Save auth info for reference
      fs.writeFileSync('.wrangler-auth-status', whoami);
      console.log('📄 Authentication status saved to .wrangler-auth-status');
      
    } catch (error) {
      console.log('⚠️ Not authenticated. Please follow these steps:');
      console.log('\n1. Open your browser and go to: https://dash.cloudflare.com/login');
      console.log('2. Log in to your Cloudflare account');
      console.log('3. Run the following command in your terminal:');
      console.log('   npx wrangler login');
      console.log('\n4. Follow the authentication flow in your browser');
      console.log('5. Return here and run this script again');
      
      return false;
    }

    // Verify account access
    console.log('\n🔍 Verifying account access...');
    try {
      const accountInfo = execSync('npx wrangler account list', { encoding: 'utf8', timeout: 10000 });
      console.log('✅ Account access verified');
      console.log(accountInfo);
      
      // Check if our account ID is accessible
      if (accountInfo.includes('9e96c83268cae3e0f27168ed50c92033')) {
        console.log('✅ Target account (9e96c83268cae3e0f27168ed50c92033) is accessible');
      } else {
        console.log('⚠️ Target account may not be accessible');
      }
      
    } catch (error) {
      console.log('❌ Account verification failed:', error.message);
      return false;
    }

    // Save configuration for deployment
    const config = {
      accountId: '9e96c83268cae3e0f27168ed50c92033',
      databaseName: 'appointmentbooking-db',
      databaseId: '59c06cd2-8bd2-45cf-ab62-84d7a4919e11',
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('.cloudflare-config.json', JSON.stringify(config, null, 2));
    console.log('\n📄 Cloudflare configuration saved to .cloudflare-config.json');

    console.log('\n🎉 Authentication setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node scripts/direct-cloudflare-deploy.js');
    console.log('2. Monitor the deployment process');
    console.log('3. Configure custom domains after deployment');
    
    return true;

  } catch (error) {
    console.log(`❌ Setup failed: ${error.message}`);
    return false;
  }
}

// Run setup if called directly
if (require.main === module) {
  setupCloudflareAuth().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = setupCloudflareAuth;
