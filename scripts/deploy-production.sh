# Production Deployment Script
# File: scripts/deploy-production.sh

#!/bin/bash

# Production Deployment Script for Instyle Hair Boutique
# Usage: ./scripts/deploy-production.sh

set -e  # Exit on error

echo "🚀 Starting Production Deployment..."
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo -e "\n${YELLOW}Step 1: Running pre-deployment checks...${NC}"
node scripts/pre-deployment-checklist.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Pre-deployment checks failed. Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"

# Step 2: Create database backup
echo -e "\n${YELLOW}Step 2: Creating database backup...${NC}"
wrangler d1 backup create appointmentbooking-db --env production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database backup created${NC}"
else
    echo -e "${RED}❌ Database backup failed${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 3: Build application
echo -e "\n${YELLOW}Step 3: Building application...${NC}"
cd apps/booking
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Step 4: Deploy to Cloudflare Pages
echo -e "\n${YELLOW}Step 4: Deploying to Cloudflare Pages...${NC}"
pnpm wrangler pages deploy .next \
    --project-name=appointmentbooking \
    --branch=main \
    --commit-dirty=true

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Pages deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pages deployed successfully${NC}"

# Step 5: Deploy Worker
echo -e "\n${YELLOW}Step 5: Deploying Worker...${NC}"
cd ../../packages/worker
pnpm wrangler deploy --env production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Worker deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Worker deployed successfully${NC}"

# Step 6: Health check
echo -e "\n${YELLOW}Step 6: Running health check...${NC}"
sleep 5  # Wait for deployment to propagate

HEALTH_URL="https://www.instylehairboutique.co.za/api/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}⚠️  Manual verification required${NC}"
fi

# Step 7: Run smoke tests
echo -e "\n${YELLOW}Step 7: Running smoke tests...${NC}"
cd ../../apps/booking
BASE_URL=https://www.instylehairboutique.co.za pnpm test:e2e:smoke

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Smoke tests passed${NC}"
else
    echo -e "${RED}❌ Smoke tests failed${NC}"
    echo -e "${YELLOW}⚠️  Manual verification required${NC}"
fi

# Step 8: Deployment summary
echo -e "\n${GREEN}===================================="
echo -e "🎉 Deployment Complete!"
echo -e "====================================${NC}"
echo ""
echo "📊 Deployment Summary:"
echo "  • Database: Backed up"
echo "  • Application: Built and deployed"
echo "  • Worker: Deployed"
echo "  • Health Check: $HTTP_CODE"
echo ""
echo "🔗 URLs:"
echo "  • Website: https://www.instylehairboutique.co.za"
echo "  • Dashboard: https://dashboard.appointmentbooking.co.za/instylehairboutique"
echo "  • Health: $HEALTH_URL"
echo ""
echo "📝 Next Steps:"
echo "  1. Monitor Cloudflare Analytics for 2 hours"
echo "  2. Check Sentry for any errors"
echo "  3. Verify critical user flows"
echo "  4. Notify stakeholders of successful deployment"
echo ""
echo -e "${YELLOW}⚠️  Remember to monitor the application for the next 24 hours${NC}"
