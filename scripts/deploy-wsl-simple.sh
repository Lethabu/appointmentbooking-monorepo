#!/bin/bash

# ============================================================================
# AppointmentBooking.co.za - Simple Cloudflare Pages Deployment
# Deploys static build output to Cloudflare Pages
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Simple Cloudflare Pages Deployment      ║"
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

# Build Next.js application for static export
echo "🔨 Building Next.js application for static export..."
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

# Create static output directory
echo "📦 Creating static output for Cloudflare Pages..."
mkdir -p static-deploy

# Copy Next.js build to static-deploy
cp -r .next/static static-deploy/ 2>/dev/null || true
cp -r .next/server/app static-deploy/ 2>/dev/null || true
cp -r .next/server/pages static-deploy/ 2>/dev/null || true

# Copy public folder if exists
if [ -d "public" ]; then
    cp -r public/* static-deploy/ 2>/dev/null || true
fi

# Copy root files
cp -f .next/server/index.html static-deploy/index.html 2>/dev/null || true
cp -f .next/server/404.html static-deploy/404.html 2>/dev/null || true

# Create _redirects for SPA-style routing (fallback to index.html)
cat > static-deploy/_redirects << 'EOF'
/_next/* /.next/:splat 200
/static/* /static/:splat 200
/* /index.html 200
EOF

# Create _headers for security and caching
cat > static-deploy/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cache-Control: public, max-age=0, must-revalidate

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.ico
  Cache-Control: public, max-age=86400

/*.png
  Cache-Control: public, max-age=86400

/*.jpg
  Cache-Control: public, max-age=86400
EOF

echo "✅ Static output created in static-deploy/"
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
echo "   Source: static-deploy/"
echo ""

# Deploy using wrangler pages deploy
$WRANGLER_CMD pages deploy static-deploy --project-name=appointment-booking-coza --branch=main

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Deployment to Cloudflare Pages completed successfully!          ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo "   1. Check deployment status in Cloudflare Dashboard"
echo "   2. Note: API routes require Cloudflare Workers for full functionality"
echo "   3. Test the deployed application"
echo ""
