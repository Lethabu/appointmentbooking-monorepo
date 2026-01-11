#!/bin/bash

# ============================================================================
# AppointmentBooking.co.za - Cloudflare Pages Deployment (WSL)
# Uses @cloudflare/next-on-pages for proper Next.js to Cloudflare conversion
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Cloudflare Pages Deployment (WSL)       ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "📂 Working directory: $(pwd)"
echo ""

# Check for pnpm
echo "🔍 Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    exit 1
fi
echo "✅ pnpm is installed ($(pnpm --version))"
echo ""

# Navigate to booking app directory
cd apps/booking
echo "📂 Navigating to booking app directory..."
echo "✅ Current directory: $(pwd)"
echo ""

# Install booking app dependencies
echo "📦 Installing booking app dependencies..."
pnpm install
echo "✅ Booking app dependencies installed"
echo ""

# Check if @cloudflare/next-on-pages is available
echo "🔍 Checking for @cloudflare/next-on-pages..."
if [ -f "node_modules/.bin/next-on-pages" ]; then
    NEXT_ON_PAGES="./node_modules/.bin/next-on-pages"
    echo "✅ @cloudflare/next-on-pages is installed locally"
elif command -v next-on-pages &> /dev/null; then
    NEXT_ON_PAGES="next-on-pages"
    echo "✅ @cloudflare/next-on-pages is installed globally"
else
    echo "⚠️  @cloudflare/next-on-pages not found, installing..."
    pnpm add -D @cloudflare/next-on-pages
    NEXT_ON_PAGES="./node_modules/.bin/next-on-pages"
    echo "✅ @cloudflare/next-on-pages installed"
fi
echo ""

# Clean previous build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next .vercel wrangler-dist node_modules/.cache
echo "✅ Clean complete"
echo ""

# Build Next.js application
echo "🔨 Building Next.js application for Cloudflare Pages..."
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm exec next build
echo "✅ Next.js build completed successfully"
echo ""

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi
echo "✅ .next directory exists"
echo ""

# Convert Next.js build to Cloudflare Pages format
echo "🔄 Converting Next.js build to Cloudflare Pages format..."
$NEXT_ON_PAGES

echo "✅ Conversion complete"
echo ""

# Check if .vercel/output directory was created
if [ ! -d ".vercel/output" ]; then
    echo "❌ Conversion failed - .vercel/output directory not found"
    exit 1
fi
echo "✅ .vercel/output directory exists"
echo ""

# Check if wrangler is available
echo "🔍 Checking for wrangler..."
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  wrangler not found globally, using npx..."
    WRANGLER_CMD="npx wrangler"
else
    WRANGLER_CMD="wrangler"
fi
echo "✅ wrangler is available"
echo ""

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo "   Project: appointment-booking-coza"
echo ""

# Deploy using wrangler pages deploy
$WRANGLER_CMD pages deploy .vercel/output --project-name=appointment-booking-coza --branch=main

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Deployment to Cloudflare Pages completed successfully!          ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo "   1. Check deployment status in Cloudflare Dashboard"
echo "   2. Update DNS records if needed"
echo "   3. Test the deployed application"
echo ""
