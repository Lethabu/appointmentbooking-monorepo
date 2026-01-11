#!/bin/bash

# ============================================================================
# AppointmentBooking.co.za - Production Cloudflare Pages Deployment
# 
# This script performs a complete deployment of the Next.js application
# to Cloudflare Pages using @cloudflare/next-on-pages.
#
# Features:
# - Monorepo support with pnpm
# - Edge runtime configuration for all routes
# - Comprehensive error handling
# - Progress reporting
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  $1${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}📂 $1...${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Navigate to project root
cd "$PROJECT_ROOT"

print_header "AppointmentBooking.co.za - Cloudflare Pages Deployment"

echo "📍 Working directory: $PROJECT_ROOT"
echo ""

# ============================================================================
# Step 1: Prerequisites Check
# ============================================================================
print_step "Checking prerequisites"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    print_info "Visit: https://pnpm.io/installation"
    exit 1
fi
print_success "pnpm is installed ($(pnpm --version))"

# Check for Node.js version
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_warning "Node.js version $(node -v) detected. Cloudflare recommends Node.js 20+."
    print_warning "Consider upgrading for better compatibility."
fi
print_success "Node.js $(node -v) detected"

# Check for wrangler
if ! command -v wrangler &> /dev/null; then
    print_warning "wrangler not found. Will use npx wrangler instead."
    WRANGLER_CMD="npx wrangler"
else
    WRANGLER_CMD="wrangler"
fi
print_success "wrangler is available"

echo ""

# ============================================================================
# Step 2: Navigate to Booking App
# ============================================================================
print_step "Navigating to booking app directory"
cd apps/booking
echo "📍 Working directory: $(pwd)"
echo ""

# ============================================================================
# Step 3: Install Dependencies
# ============================================================================
print_step "Installing dependencies with pnpm"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
print_success "Dependencies installed"
echo ""

# ============================================================================
# Step 4: Clean Previous Build Artifacts
# ============================================================================
print_step "Cleaning previous build artifacts"
rm -rf .next .vercel wrangler-dist node_modules/.cache
print_success "Clean complete"
echo ""

# ============================================================================
# Step 5: Build Next.js Application
# ============================================================================
print_step "Building Next.js application"
export NODE_OPTIONS="--max-old-space-size=8192"

if pnpm exec next build; then
    print_success "Next.js build completed successfully"
else
    print_error "Next.js build failed"
    exit 1
fi
echo ""

# Verify build output
if [ ! -d ".next" ]; then
    print_error "Build failed - .next directory not found"
    exit 1
fi
print_success "Build output verified"
echo ""

# ============================================================================
# Step 6: Convert to Cloudflare Pages Format
# ============================================================================
print_step "Converting Next.js build to Cloudflare Pages format"

# Check if next-on-pages is available
if [ -f "node_modules/.bin/next-on-pages" ]; then
    NEXT_ON_PAGES="./node_modules/.bin/next-on-pages"
elif command -v next-on-pages &> /dev/null; then
    NEXT_ON_PAGES="next-on-pages"
else
    print_warning "Installing @cloudflare/next-on-pages..."
    pnpm add -D @cloudflare/next-on-pages
    NEXT_ON_PAGES="./node_modules/.bin/next-on-pages"
fi

if $NEXT_ON_PAGES; then
    print_success "Cloudflare Pages conversion completed"
else
    print_error "Cloudflare Pages conversion failed"
    exit 1
fi
echo ""

# Verify conversion output
if [ ! -d ".vercel/output" ]; then
    print_error "Conversion failed - .vercel/output directory not found"
    exit 1
fi
print_success "Conversion output verified"
echo ""

# ============================================================================
# Step 7: Deploy to Cloudflare Pages
# ============================================================================
print_step "Deploying to Cloudflare Pages"
echo "   Project: appointment-booking-coza"
echo "   Branch: main"
echo ""

# Check if logged in to Cloudflare
if ! $WRANGLER_CMD whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare. Please run:"
    echo "   npx wrangler login"
    echo ""
    print_info "Or set up authentication manually."
    print_info "See: https://developers.cloudflare.com/pages/platform/direct-upload/"
    
    # Offer to deploy without authentication (will fail)
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy to Cloudflare Pages
if $WRANGLER_CMD pages deploy .vercel/output --project-name=appointment-booking-coza --branch=main; then
    print_success "Deployment to Cloudflare Pages completed successfully"
else
    print_error "Deployment failed"
    print_info "Check the error messages above for details."
    print_info "Common issues:"
    print_info "  - Authentication: Run 'npx wrangler login'"
    print_info "  - Project not found: Create 'appointment-booking-coza' in Cloudflare Dashboard"
    print_info "  - Build errors: Check the build output above"
    exit 1
fi

echo ""

# ============================================================================
# Deployment Summary
# ============================================================================
print_header "Deployment Complete! 🎉"

echo "📋 Deployment Summary:"
echo "   • Project: appointment-booking-coza"
echo "   • Framework: Next.js 14 on Cloudflare Pages"
echo "   • Runtime: Edge (serverless functions)"
echo ""
echo "📌 Next Steps:"
echo "   1. Visit Cloudflare Dashboard to verify deployment"
echo "   2. Configure custom domain (appointmentbooking.co.za)"
echo "   3. Set up environment variables in Dashboard"
echo "   4. Test all API endpoints"
echo "   5. Monitor edge function performance"
echo ""
echo "📚 Documentation:"
echo "   • Deployment Guide: docs/CLOUDFLARE_PAGES_DEPLOYMENT_GUIDE.md"
echo "   • Cloudflare Docs: https://developers.cloudflare.com/pages/"
echo ""

print_success "Happy deploying! 🚀"
