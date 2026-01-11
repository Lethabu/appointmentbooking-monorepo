#!/bin/bash
# =============================================================================
# Quick WSL Deployment Script (Assumes dependencies already installed)
# appointmentbooking.co.za Production Deployment
# =============================================================================

set -e  # Exit on any error

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Quick WSL Deployment                ║"
echo "║  (Skipping dependency installation)                              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project directory
PROJECT_DIR="/mnt/c/Users/Adrin/Documents/MyProjects/appointmentbooking-monorepo/apps/booking"

echo "📂 Navigating to project directory..."
cd "$PROJECT_DIR" || {
    echo "❌ ERROR: Could not navigate to $PROJECT_DIR"
    exit 1
}

echo "✅ Current directory: $(pwd)"
echo ""

# Run Cloudflare Pages adapter build (skip Next.js build since it's already done)
echo "⚡ Building Cloudflare Pages adapter..."
echo "   Converting existing Next.js build to Cloudflare Workers format..."
npx @cloudflare/next-on-pages --skip-build

if [ $? -eq 0 ]; then
    echo "✅ Cloudflare Pages adapter build completed"
else
    echo "❌ Cloudflare Pages adapter build failed"
    exit 1
fi
echo ""

# Check if build output exists
if [ -d ".vercel/output/static" ]; then
    echo "✅ Build output directory exists: .vercel/output/static"
    
    # Check for _worker.js
    if [ -f ".vercel/output/static/_worker.js" ]; then
        echo "✅ Worker file generated: _worker.js"
        
        # Show file size
        WORKER_SIZE=$(du -h ".vercel/output/static/_worker.js" | cut -f1)
        echo "   Worker size: $WORKER_SIZE"
    else
        echo "⚠️  Warning: _worker.js not found in build output"
    fi
else
    echo "❌ ERROR: Build output directory not found"
    exit 1
fi
echo ""

# Check if wrangler is authenticated
echo "🔐 Checking Cloudflare authentication..."
if npx wrangler whoami &> /dev/null; then
    echo "✅ Already authenticated with Cloudflare"
else
    echo "⚠️  Not authenticated. You'll need to login..."
    echo "   Running: npx wrangler login"
    npx wrangler login
fi
echo ""

# Deploy
echo "🚀 Deploying to Cloudflare Pages..."
echo "   Project: appointment-booking-coza"
echo "   Output: .vercel/output/static"
echo ""

npx wrangler pages deploy .vercel/output/static --project-name=appointment-booking-coza --branch=main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║  ✅ DEPLOYMENT SUCCESSFUL!                                       ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Your application should be live at:"
    echo "   https://appointmentbooking.co.za"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Wait 30-60 seconds for deployment to propagate"
    echo "   2. Visit https://appointmentbooking.co.za in your browser"
    echo "   3. Run smoke tests from Windows:"
    echo "      node scripts\\smoke-test-appointmentbooking.js"
    echo ""
else
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║  ❌ DEPLOYMENT FAILED                                            ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Check the error messages above for details."
    exit 1
fi
