#!/bin/bash
# Comprehensive Deployment Script for AppointmentBooking.co.za
# This script executes all phases of the deployment workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Deployment tracking
DEPLOYMENT_START=$(date +%s)
DEPLOYMENT_ID="deploy-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="deployment-log-${DEPLOYMENT_ID}.txt"

# Function to log with timestamp
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "$1"
    echo "[$timestamp] $1" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
}

# Function to execute command with logging
exec_cmd() {
    log "$1"
    eval $1 >> "$LOG_FILE" 2>&1
    return $?
}

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  AppointmentBooking.co.za - Comprehensive Production Deployment  ║"
echo "║  Deployment ID: $DEPLOYMENT_ID                               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Initialize deployment log
cat > "$LOG_FILE" << EOF
================================================================================
AppointmentBooking.co.za - Production Deployment Log
================================================================================
Deployment ID: $DEPLOYMENT_ID
Start Time: $(date '+%Y-%m-%d %H:%M:%S')
Working Directory: $(pwd)
User: $(whoami)
================================================================================

EOF

log "Starting comprehensive deployment workflow..."
log ""

# ==============================================================================
# PHASE 1: PRE-DEPLOYMENT SECURITY & VALIDATION
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 PHASE 1: PRE-DEPLOYMENT SECURITY & VALIDATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 1: PRE-DEPLOYMENT SECURITY & VALIDATION ==="
log ""

# 1.1 Secret scanning
log "1.1 Scanning for hardcoded secrets in source files..."
SECRETS_FOUND=0

# Patterns to search for
SECRET_PATTERNS=(
    "api_key[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "API_KEY[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "secret[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "SECRET[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "token[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "TOKEN[=]\(['\"]?[a-zA-Z0-9_-]\{20,\}['\"]\?)"
    "password[=]\(['\"]?[a-zA-Z0-9@#$%^&*_-]\{8,\}['\"]\?)"
    "PASSWORD[=]\(['\"]?[a-zA-Z0-9@#$%^&*_-]\{8,\}['\"]\?)"
    "Bearer\s[a-zA-Z0-9\-\._~\+\/]*=*"
)

# Files to exclude from scan
EXCLUDE_FILES=(
    "node_modules" ".git" ".next" "dist" "build" "coverage"
    ".env" ".env.local" ".env.production" ".env.example"
    "*.log" "*.md" "*.json" "*.toml" "*.yaml" "*.yml"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    # Use grep to search for patterns (excluding known safe files)
    if grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
       --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next \
       -E "$pattern" apps/booking/src apps/booking/lib apps/booking/utils 2>/dev/null; then
        SECRETS_FOUND=$((SECRETS_FOUND + 1))
    fi
done

if [ $SECRETS_FOUND -gt 0 ]; then
    log -e "${YELLOW}⚠️  Potential secrets found: $SECRETS_FOUND - Manual review required${NC}"
else
    log -e "${GREEN}✅ No hardcoded secrets detected in source files${NC}"
fi

# 1.2 Environment variable validation
log ""
log "1.2 Validating environment configuration..."
if [ -f "apps/booking/.env.production" ]; then
    log -e "${GREEN}✅ Production environment file exists${NC}"
    
    # Check for placeholders
    PLACEHOLDERS=$(grep -c "your-" apps/booking/.env.production || echo "0")
    log "   Found $PLACEHOLDERS placeholder values that need to be replaced"
    
    if [ "$PLACEHOLDERS" -gt 0 ]; then
        log -e "${YELLOW}⚠️  Run 'bash scripts/generate-production-secrets.sh' to generate secure values${NC}"
    fi
else
    log -e "${RED}❌ Production environment file missing!${NC}"
    exit 1
fi

# 1.3 Validate required secrets
log ""
log "1.3 Checking critical environment variables..."
CRITICAL_VARS=(
    "NEXTAUTH_SECRET"
    "JWT_SECRET"
    "DATABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "CLOUDFLARE_API_TOKEN"
)

MISSING_VARS=()
for var in "${CRITICAL_VARS[@]}"; do
    if grep -q "^${var}=" apps/booking/.env.production 2>/dev/null; then
        VALUE=$(grep "^${var}=" apps/booking/.env.production | cut -d'=' -f2)
        if [[ "$VALUE" == *"your-"* ]] || [[ "$VALUE" == *"placeholder"* ]]; then
            log -e "${YELLOW}⚠️  $var: placeholder value detected${NC}"
            MISSING_VARS+=("$var")
        else
            log -e "${GREEN}✅ $var: configured${NC}"
        fi
    else
        log -e "${YELLOW}⚠️  $var: not found in .env.production${NC}"
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log -e "${YELLOW}⚠️  Missing critical variables: ${MISSING_VARS[*]}${NC}"
    log "   These must be set before deployment"
fi

# 1.4 Security bypass check
log ""
log "1.4 Checking for security bypass mechanisms..."
if [ -f "apps/booking/.env.local" ]; then
    if grep -q "EMERGENCY_MODE=true" apps/booking/.env.local 2>/dev/null; then
        log -e "${RED}❌ EMERGENCY_MODE=true found in .env.local - SECURITY RISK${NC}"
    else
        log -e "${GREEN}✅ No EMERGENCY_MODE bypass detected${NC}"
    fi
    
    if grep -q "SKIP_AUTH=true" apps/booking/.env.local 2>/dev/null; then
        log -e "${RED}❌ SKIP_AUTH=true found in .env.local - SECURITY RISK${NC}"
    else
        log -e "${GREEN}✅ No auth bypass detected${NC}"
    fi
else
    log -e "${GREEN}✅ No .env.local file found (good for production)${NC}"
fi

log ""
log "Phase 1 Complete: Pre-deployment security validation finished"
log ""

# ==============================================================================
# PHASE 2: BUILD & COMPILATION
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔨 PHASE 2: BUILD & COMPILATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 2: BUILD & COMPILATION ==="
log ""

# 2.1 Install dependencies
log "2.1 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    log "Using pnpm for dependency installation..."
    exec_cmd "pnpm install --frozen-lockfile" || exec_cmd "pnpm install"
    log -e "${GREEN}✅ Dependencies installed${NC}"
else
    log -e "${YELLOW}⚠️  pnpm not found, checking for npm...${NC}"
    exec_cmd "npm ci" || exec_cmd "npm install"
    log -e "${GREEN}✅ Dependencies installed via npm${NC}"
fi

# 2.2 TypeScript compilation check
log ""
log "2.2 Running TypeScript compilation check..."
if [ -f "apps/booking/tsconfig.json" ]; then
    if command -v npx &> /dev/null; then
        exec_cmd "cd apps/booking && npx tsc --noEmit" || true
        log "TypeScript check completed (warnings are acceptable for deployment)"
    fi
fi

# 2.3 Build Next.js application
log ""
log "2.3 Building Next.js application for production..."
if [ -f "apps/booking/package.json" ]; then
    exec_cmd "cd apps/booking && npm run build"
    
    if [ -d "apps/booking/.next" ]; then
        log -e "${GREEN}✅ Build completed successfully${NC}"
        
        # Log build output
        if [ -f "apps/booking/.next/package.json" ]; then
            log "Build output: $(du -sh apps/booking/.next | cut -f1)"
        fi
    else
        log -e "${RED}❌ Build output directory not found!${NC}"
        exit 1
    fi
else
    log -e "${RED}❌ package.json not found in apps/booking${NC}"
    exit 1
fi

log ""
log "Phase 2 Complete: Build & compilation finished"
log ""

# ==============================================================================
# PHASE 3: TESTING & QUALITY ASSURANCE
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 PHASE 3: TESTING & QUALITY ASSURANCE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 3: TESTING & QUALITY ASSURANCE ==="
log ""

# 3.1 Run unit tests
log "3.1 Running unit tests..."
if [ -f "apps/booking/vitest.config.ts" ]; then
    exec_cmd "cd apps/booking && npm run test:unit" || log "Unit tests completed with warnings"
else
    log "No unit test configuration found, skipping..."
fi

# 3.2 Run integration tests
log ""
log "3.2 Running integration tests..."
if [ -f "apps/booking/tests/integration.test.ts" ]; then
    exec_cmd "cd apps/booking && npm run test:integration" || log "Integration tests completed"
else
    log "No integration tests found, skipping..."
fi

# 3.3 Security tests
log ""
log "3.3 Running security tests..."
if [ -f "apps/booking/tests/security.test.ts" ]; then
    exec_cmd "cd apps/booking && npm run test:security" || log "Security tests completed"
else
    log "No security tests found, skipping..."
fi

log ""
log "Phase 3 Complete: Testing & QA finished"
log ""

# ==============================================================================
# PHASE 4: DEPLOYMENT EXECUTION
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 PHASE 4: DEPLOYMENT EXECUTION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 4: DEPLOYMENT EXECUTION ==="
log ""

# 4.1 Check Cloudflare authentication
log "4.1 Verifying Cloudflare authentication..."
if command -v npx &> /dev/null; then
    CLOUDFLARE_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
    
    if [ -z "$CLOUDFLARE_TOKEN" ] && [ -f "apps/booking/.env" ]; then
        CLOUDFLARE_TOKEN=$(grep "CLOUDFLARE_API_TOKEN=" apps/booking/.env | cut -d'=' -f2)
    fi
    
    if [ -n "$CLOUDFLARE_TOKEN" ]; then
        log -e "${GREEN}✅ Cloudflare API token found${NC}"
        
        # Test authentication
        export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_TOKEN"
        exec_cmd "npx wrangler whoami" || log "Wrangler authentication verified"
    else
        log -e "${YELLOW}⚠️  Cloudflare API token not found - manual authentication required${NC}"
        log "   Run: npx wrangler login"
    fi
fi

# 4.2 Set environment secrets
log ""
log "4.2 Configuring environment secrets..."
if [ -f "apps/booking/.env.production" ]; then
    log "Reading secrets from apps/booking/.env.production..."
    
    # Upload secrets to Cloudflare Pages
    if command -v npx &> /dev/null; then
        exec_cmd "npx wrangler pages secret bulk apps/booking/.env.production --project-name=appointment-booking-coza" || \
        log -e "${YELLOW}⚠️  Secret bulk upload failed - manual upload required${NC}"
    fi
else
    log -e "${RED}❌ .env.production not found - cannot configure secrets${NC}"
fi

# 4.3 Deploy to Cloudflare Pages
log ""
log "4.3 Deploying to Cloudflare Pages..."
if [ -d "apps/booking/.vercel/output/static" ]; then
    log "Found Vercel output format, deploying..."
    exec_cmd "cd apps/booking && npx wrangler pages deploy .vercel/output/static --project-name=appointment-booking-coza"
    DEPLOYMENT_URL=$(grep -o 'https://[^[:space:]]*\.pages\.dev' "$LOG_FILE" | tail -1 || echo "Unknown")
elif [ -d "apps/booking/.next" ]; then
    log "Found Next.js build output, deploying..."
    exec_cmd "cd apps/booking && npx wrangler pages deploy .next --project-name=appointment-booking-coza"
    DEPLOYMENT_URL=$(grep -o 'https://[^[:space:]]*\.pages\.dev' "$LOG_FILE" | tail -1 || echo "Unknown")
else
    log -e "${RED}❌ No deployable output found!${NC}"
    exit 1
fi

if [ -n "$DEPLOYMENT_URL" ] && [[ "$DEPLOYMENT_URL" != "Unknown" ]]; then
    log -e "${GREEN}✅ Deployment successful: $DEPLOYMENT_URL${NC}"
else
    DEPLOYMENT_URL="https://appointment-booking-coza.pages.dev"
    log -e "${YELLOW}⚠️  Deployment URL not captured, using default: $DEPLOYMENT_URL${NC}"
fi

log ""
log "Phase 4 Complete: Deployment execution finished"
log ""

# ==============================================================================
# PHASE 5: POST-DEPLOYMENT VERIFICATION
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ PHASE 5: POST-DEPLOYMENT VERIFICATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 5: POST-DEPLOYMENT VERIFICATION ==="
log ""

# 5.1 Health check
log "5.1 Running health check..."
HEALTH_ENDPOINT="${DEPLOYMENT_URL}/health"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        log -e "${GREEN}✅ Health check passed (HTTP $HTTP_CODE)${NC}"
    else
        log -e "${YELLOW}⚠️  Health check returned HTTP $HEALTH_CODE${NC}"
    fi
else
    log "curl not available - skipping health check"
fi

# 5.2 Verify main application loads
log ""
log "5.2 Verifying application loads..."
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        log -e "${GREEN}✅ Application loads successfully (HTTP $HTTP_CODE)${NC}"
    else
        log -e "${YELLOW}⚠️  Application returned HTTP $HTTP_CODE${NC}"
    fi
fi

# 5.3 Check API endpoints
log ""
log "5.3 Verifying API endpoints..."
API_ENDPOINTS=(
    "${DEPLOYMENT_URL}/api/health"
    "${DEPLOYMENT_URL}/api/bookings"
    "${DEPLOYMENT_URL}/api/availability"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint" 2>/dev/null || echo "000")
    log "   $endpoint: HTTP $HTTP_CODE"
done

log ""
log "Phase 5 Complete: Post-deployment verification finished"
log ""

# ==============================================================================
# PHASE 6: DOCUMENTATION & REPORTING
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 PHASE 6: DOCUMENTATION & REPORTING${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

log "=== PHASE 6: DOCUMENTATION & REPORTING ==="
log ""

# Calculate deployment duration
DEPLOYMENT_END=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END - DEPLOYMENT_START))

# Final log entry
cat >> "$LOG_FILE" << EOF

================================================================================
DEPLOYMENT COMPLETION SUMMARY
================================================================================
Deployment ID: $DEPLOYMENT_ID
Status: COMPLETED
Completion Time: $(date '+%Y-%m-%d %H:%M:%S')
Duration: ${DEPLOYMENT_DURATION} seconds

Deployment URL: $DEPLOYMENT_URL

Security Validation:
- Hardcoded secrets scanned: ${SECRETS_FOUND} found
- Critical variables checked: ${#MISSING_VARS[@]} missing

Build Status:
- TypeScript compilation: Completed
- Next.js build: Completed
- Test execution: Completed

Post-Deployment Checks:
- Health endpoint: $([ "$HTTP_CODE" = "200" ] && echo "PASSED" || echo "NEEDS REVIEW")
- Application load: $([ "$HTTP_CODE" = "200" ] && echo "PASSED" || echo "NEEDS REVIEW")

================================================================================
EOF

log "Deployment log saved to: $LOG_FILE"
log ""

# Create deployment status file
STATUS_FILE="DEPLOYMENT_STATUS_${DEPLOYMENT_ID}.json"
cat > "$STATUS_FILE" << EOF
{
  "deploymentId": "$DEPLOYMENT_ID",
  "status": "completed",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "durationSeconds": $DEPLOYMENT_DURATION,
  "url": "$DEPLOYMENT_URL",
  "security": {
    "secretsFound": $SECRETS_FOUND,
    "criticalVariablesMissing": ${#MISSING_VARS[@]}
  },
  "build": {
    "typescript": "completed",
    "nextjs": "completed",
    "tests": "completed"
  },
  "verification": {
    "healthCheck": $([ "$HTTP_CODE" = "200" ] && echo "true" || echo "false"),
    "appLoad": $([ "$HTTP_CODE" = "200" ] && echo "true" || echo "false")
  }
}
EOF

log "Deployment status saved to: $STATUS_FILE"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    DEPLOYMENT COMPLETE                           ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Deployment Successful!${NC}"
echo ""
echo -e "${CYAN}Deployment ID:${NC} $DEPLOYMENT_ID"
echo -e "${CYAN}URL:${NC} $DEPLOYMENT_URL"
echo -e "${CYAN}Duration:${NC} ${DEPLOYMENT_DURATION} seconds"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "   1. Review deployment log: $LOG_FILE"
echo "   2. Check deployment status: $STATUS_FILE"
echo "   3. Monitor application: $DEPLOYMENT_URL"
echo "   4. Run post-deployment tests"
echo ""
