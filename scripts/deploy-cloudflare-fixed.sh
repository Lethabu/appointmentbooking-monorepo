#!/bin/bash

# ============================================================================
# AppointmentBooking.co.za - Fixed Cloudflare Pages Deployment
# Uses pnpm and proper Cloudflare Pages build process
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Cloudflare Pages Deployment             ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project root
cd /mnt/c/Users/Adrin/Documents/MyProjects/appointmentbooking-monorepo
echo "📂 Navigating to project root..."
echo "✅ Current directory: $(pwd)"
echo ""

# Check for pnpm
echo "🔍 Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    exit 1
fi
echo "✅ pnpm is installed ($(pnpm --version))"
echo ""

# Install dependencies at monorepo root
echo "📦 Installing dependencies with pnpm..."
pnpm install --frozen-lockfile
echo "✅ Dependencies installed"
echo ""

# Navigate to booking app directory
echo "📂 Navigating to booking app directory..."
cd apps/booking
echo "✅ Current directory: $(pwd)"
echo ""

# Install booking app dependencies including devDependencies
echo "📦 Installing booking app dependencies..."
pnpm install
echo "✅ Booking app dependencies installed"
echo ""

# Clean previous build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next .vercel wrangler-dist
echo "✅ Clean complete"
echo ""

# Build Next.js application
echo "🔨 Building Next.js application..."
pnpm run build
echo "✅ Next.js build completed successfully"
echo ""

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi
echo "✅ .next directory exists"
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

# Deploy using wrangler pages deploy with the .vercel/output/static directory
# For Cloudflare Pages, we need to copy the static files appropriately
mkdir -p .vercel/output/static

# Copy Next.js static build output to .vercel/output/static
cp -r .next/server .vercel/output/static/ 2>/dev/null || true
cp -r .next/static .vercel/output/static/ 2>/dev/null || true
cp -r .next/media .vercel/output/static/ 2>/dev/null || true

# Copy public folder
if [ -d "public" ]; then
    cp -r public/* .vercel/output/static/ 2>/dev/null || true
fi

# Create a _headers file for Cloudflare Pages
cat > .vercel/output/static/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_next/*
  Cache-Control: public, max-age=31536000, immutable

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.ico
  Cache-Control: public, max-age=86400
EOF

echo "✅ Created Cloudflare Pages headers"
echo ""

# Deploy to Cloudflare Pages
echo "📤 Uploading to Cloudflare Pages..."
$WRANGLER_CMD pages deploy .vercel/output/static --project-name=appointment-booking-coza --branch=main

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
