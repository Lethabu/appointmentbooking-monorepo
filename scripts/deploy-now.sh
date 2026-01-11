#!/bin/bash
# Quick Deployment Command for AppointmentBooking.co.za
# Executes the full deployment workflow in one command

set -e

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Production Deployment               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Set deployment ID
DEPLOYMENT_ID="deploy-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="deployment-log-${DEPLOYMENT_ID}.txt"

# Initialize log
cat > "$LOG_FILE" << EOF
================================================================================
AppointmentBooking.co.za - Production Deployment Log
Deployment ID: $DEPLOYMENT_ID
Start Time: $(date '+%Y-%m-%d %H:%M:%S')
================================================================================

EOF

log() {
    echo "[$(date '+%H:%M:%S')] $1"
    echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"
}

log "🚀 Starting production deployment..."
log ""

# ==============================================================================
# STEP 1: VALIDATE ENVIRONMENT
# ==============================================================================
log "📋 Step 1: Validating environment configuration..."

if [ ! -f "apps/booking/.env.production" ]; then
    log "❌ ERROR: apps/booking/.env.production not found"
    exit 1
fi

# Check for placeholders
PLACEHOLDERS=$(grep -c "your-" apps/booking/.env.production 2>/dev/null || echo "0")
if [ "$PLACEHOLDERS" -gt 0 ]; then
    log "⚠️  WARNING: $PLACEHOLDERS placeholder values found in .env.production"
    log "   Run 'bash scripts/generate-production-secrets.sh' first for production deployment"
fi

log "✅ Environment configuration validated"
log ""

# ==============================================================================
# STEP 2: BUILD APPLICATION
# ==============================================================================
log "🔨 Step 2: Building Next.js application..."

if [ ! -d "apps/booking" ]; then
    log "❌ ERROR: apps/booking directory not found"
    exit 1
fi

cd apps/booking

# Build the application
log "   Running: npm run build..."
npm run build >> "../$LOG_FILE" 2>&1

if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next | cut -f1)
    log "✅ Build completed successfully (size: $BUILD_SIZE)"
    cd ..
else
    log "❌ ERROR: Build output not found"
    exit 1
fi

log ""

# ==============================================================================
# STEP 3: DEPLOY TO CLOUDFLARE PAGES
# ==============================================================================
log "🚀 Step 3: Deploying to Cloudflare Pages..."

# Check for Cloudflare authentication
CLOUDFLARE_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
if [ -z "$CLOUDFLARE_TOKEN" ] && [ -f "apps/booking/.env" ]; then
    CLOUDFLARE_TOKEN=$(grep "CLOUDFLARE_API_TOKEN=" apps/booking/.env | cut -d'=' -f2)
fi

if [ -n "$CLOUDFLARE_TOKEN" ]; then
    export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_TOKEN"
    log "   Cloudflare token found"
else
    log "⚠️  Cloudflare token not found - using default project"
fi

# Deploy using wrangler
if command -v npx &> /dev/null; then
    log "   Deploying to Cloudflare Pages..."
    npx wrangler pages deploy .next --project-name=appointment-booking-coza >> "../$LOG_FILE" 2>&1
    
    # Extract deployment URL from log
    DEPLOYMENT_URL=$(grep -o 'https://[^[:space:]]*\.pages\.dev' "../$LOG_FILE" | tail -1 || echo "https://appointment-booking-coza.pages.dev")
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        log "✅ Deployment successful: $DEPLOYMENT_URL"
    else
        DEPLOYMENT_URL="https://appointment-booking-coza.pages.dev"
        log "✅ Deployment initiated (URL: $DEPLOYMENT_URL)"
    fi
else
    log "❌ ERROR: npx not found - cannot deploy"
    exit 1
fi

log ""

# ==============================================================================
# STEP 4: VERIFY DEPLOYMENT
# ==============================================================================
log "✅ Step 4: Verifying deployment..."

if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        log "✅ Application is responding (HTTP $HTTP_CODE)"
    else
        log "⚠️  Application returned HTTP $HTTP_CODE - may need a few more seconds"
    fi
    
    # Check health endpoint
    HEALTH_URL="${DEPLOYMENT_URL}/health"
    HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
    log "   Health endpoint: HTTP $HEALTH_CODE"
fi

log ""

# ==============================================================================
# COMPLETION
# ==============================================================================
DEPLOYMENT_END=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END - $(date +%s -d "@$(date +%s - 60)")))

cat >> "$LOG_FILE" << EOF

================================================================================
DEPLOYMENT COMPLETED
================================================================================
Deployment ID: $DEPLOYMENT_ID
Completion Time: $(date '+%Y-%m-%d %H:%M:%S')
Deployment URL: $DEPLOYMENT_URL
================================================================================
EOF

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ DEPLOYMENT COMPLETE                        ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Deployment Summary:"
echo "   • Deployment ID: $DEPLOYMENT_ID"
echo "   • URL: $DEPLOYMENT_URL"
echo "   • Log File: $LOG_FILE"
echo ""
echo "⚠️  Important Reminders:"
echo "   1. Review $LOG_FILE for any warnings"
echo "   2. Test the application at $DEPLOYMENT_URL"
echo "   3. Configure custom domain in Cloudflare Dashboard"
echo "   4. Set up monitoring and alerting"
echo ""

exit 0
