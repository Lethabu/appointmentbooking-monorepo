#!/bin/bash
# =============================================================================
# Cloudflare Pages Deployment Script for WSL
# appointmentbooking.co.za Production Deployment
# =============================================================================

set -e  # Exit on any error

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Cloudflare Pages Deployment         ║"
echo "║  Running in WSL Environment                                      ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project directory (Windows path via WSL)
PROJECT_DIR="/mnt/c/Users/Adrin/Documents/MyProjects/appointmentbooking-monorepo/apps/booking"

echo "📂 Navigating to project directory..."
cd "$PROJECT_DIR" || {
    echo "❌ ERROR: Could not navigate to $PROJECT_DIR"
    exit 1
}

echo "✅ Current directory: $(pwd)"
echo ""

# Check if pnpm is installed
echo "🔍 Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm..."
    npm install -g pnpm
    echo "✅ pnpm installed"
else
    echo "✅ pnpm is already installed ($(pnpm --version))"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Run Next.js build
echo "🔨 Building Next.js application..."
echo "   This will take 2-5 minutes..."
pnpm run build
if [ $? -eq 0 ]; then
    echo "✅ Next.js build completed successfully"
else
    echo "❌ Next.js build failed"
    exit 1
fi
echo ""

# Run Cloudflare Pages adapter build
echo "⚡ Building Cloudflare Pages adapter..."
echo "   Converting Next.js build to Cloudflare Workers format..."
# Use --skip-build since we already have the Next.js build
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
    else
        echo "⚠️  Warning: _worker.js not found in build output"
    fi
else
    echo "❌ ERROR: Build output directory not found"
    exit 1
fi
echo ""

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo "   Project: appointment-booking-coza"
echo "   Output: .vercel/output/static"
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
echo "📤 Uploading to Cloudflare Pages..."
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
    echo "Common issues:"
    echo "  - Missing Cloudflare API token"
    echo "  - Project name mismatch"
    echo "  - Network connectivity issues"
    echo ""
    exit 1
fi
