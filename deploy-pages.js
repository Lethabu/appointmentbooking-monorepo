#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Script
 * Builds and deploys the Next.js frontend to Cloudflare Pages
 */

const { execSync } = require('child_process');
const path = require('path');

const BOOKING_APP_PATH = path.join(__dirname, 'apps', 'booking');

console.log('🚀 Starting Cloudflare Pages Deployment...');

try {
  // Change to booking app directory
  process.chdir(BOOKING_APP_PATH);
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building Next.js app for static export...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('📤 Deploying to Cloudflare Pages...');
  execSync('npx wrangler pages deploy out --project-name instyle-hair-boutique', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN
    }
  });
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Frontend: https://instyle-hair-boutique.pages.dev');
  console.log('🔗 Custom Domain: https://www.instylehairboutique.co.za');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}