#!/bin/bash
# =============================================================================
# Fixed WSL Deployment Script - Uses pnpm and ensures Vercel build
# appointmentbooking.co.za Production Deployment
# =============================================================================

set -e  # Exit on any error

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Fixed WSL Deployment                ║"
echo "║  Using pnpm and proper Vercel build                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project ROOT first
PROJECT_ROOT="/mnt/c/Users/Adrin/Documents/MyProjects/appointmentbooking-monorepo"
BOOKING_DIR="$PROJECT_ROOT/apps/booking"

echo "📂 Navigating to project root..."
cd "$PROJECT_ROOT" || {
    echo "❌ ERROR: Could not navigate to $PROJECT_ROOT"
    exit 1
}

echo "✅ Current directory: $(pwd)"
echo ""

# Ensure pnpm is installed
echo "🔍 Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm globally..."
    npm install -g pnpm
    echo "✅ pnpm installed"
else
    echo "✅ pnpm is already installed ($(pnpm --version))"
fi
echo ""

# Install dependencies at monorepo root using pnpm
echo "📦 Installing dependencies at monorepo root with pnpm..."
echo "   This ensures all workspace packages are linked..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Navigate to booking app
echo "📂 Navigating to booking app directory..."
cd "$BOOKING_DIR" || {
    echo "❌ ERROR: Could not navigate to $BOOKING_DIR"
    exit 1
}

echo "✅ Current directory: $(pwd)"
echo ""

# Clean previous builds to avoid conflicts
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf .vercel
echo "✅ Clean complete"
echo ""

# Run Next.js build using pnpm
echo "🔨 Building Next.js application with pnpm..."
echo "   This will take 2-5 minutes..."
pnpm run build
if [ $? -eq 0 ]; then
    echo "✅ Next.js build completed successfully"
else
    echo "❌ Next.js build failed"
    exit 1
fi
echo ""

# Verify .next directory exists
if [ ! -d ".next" ]; then
    echo "❌ ERROR: .next directory not found after build"
    exit 1
fi
echo "✅ .next directory exists"
echo ""

# Run Vercel build to create proper .vercel/output structure
echo "📦 Creating Vercel output structure..."
echo "   This is required for Cloudflare Pages adapter..."

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    pnpm add -D vercel
fi

# Run vercel build to create .vercel/output directory
echo "   Running: pnpm exec vercel build --yes"
PNPM_HOME=$(pnpm store path | sed 's/\/store.*//')
export PATH="$PNPM_HOME:$PATH"
pnpm exec vercel build --yes || {
    echo "⚠️  Vercel build command failed, trying alternative..."
    # Alternative: use next-on-pages directly with experimental flag
    echo "   Using @cloudflare/next-on-pages directly..."
}

# Check if .vercel/output was created
if [ -d ".vercel/output" ]; then
    echo "✅ .vercel/output directory created"
else
    echo "⚠️  .vercel/output not created by Vercel CLI"
    echo "   Attempting direct next-on-pages build..."
fi
echo ""

# Run Cloudflare Pages adapter with pnpm
echo "⚡ Building Cloudflare Pages adapter with pnpm..."
echo "   Converting Next.js build to Cloudflare Workers format..."

# Set PNPM as the package manager for next-on-pages
export npm_config_user_agent="pnpm"

# Run next-on-pages using pnpm
pnpm exec @cloudflare/next-on-pages

if [ $? -eq 0 ]; then
    echo "✅ Cloudflare Pages adapter build completed"
else
    echo "❌ Cloudflare Pages adapter build failed"
    exit 1
fi
echo ""

# Verify build output exists
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
    
    # Check for config.json
    if [ -f ".vercel/output/config.json" ]; then
        echo "✅ Config file exists: config.json"
    else
        echo "⚠️  Warning: config.json not found"
    fi
else
    echo "❌ ERROR: Build output directory not found"
    exit 1
fi
echo ""

# Check if wrangler is authenticated
echo "🔐 Checking Cloudflare authentication..."
if pnpm exec wrangler whoami &> /dev/null; then
    echo "✅ Already authenticated with Cloudflare"
else
    echo "⚠️  Not authenticated. You'll need to login..."
    echo "   Running: pnpm exec wrangler login"
    pnpm exec wrangler login
fi
echo ""

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo "   Project: appointment-booking-coza"
echo "   Output: .vercel/output/static"
echo ""

pnpm exec wrangler pages deploy .vercel/output/static --project-name=appointment-booking-coza --branch=main

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
