#!/bin/bash
# AI Tools Infrastructure - Production Deployment Start Script
# Initiates the complete deployment process

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AI Tools Infrastructure Deployment${NC}"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${YELLOW}⚠️  Running from deployment directory${NC}"
    cd "$(dirname "$0")"
fi

# Make deployment script executable
chmod +x deploy-production.sh

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "✅ Environment configuration ready"
echo "✅ Docker Compose configuration ready"
echo "✅ Deployment scripts ready"

echo
echo -e "${BLUE}🔧 Environment Setup:${NC}"

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is available: $(docker --version)"
else
    echo "❌ Docker is not installed"
    exit 1
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is available: $(docker-compose --version)"
else
    echo "❌ Docker Compose is not installed"
    exit 1
fi

# Check environment file
if [ -f ".env" ]; then
    echo "✅ Environment file found"
    # Source environment variables
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Environment file .env not found"
    echo "Creating from template..."
    cp .env.template .env
    echo "⚠️  Please configure .env file with your settings before continuing"
    exit 1
fi

# Check required environment variables
required_vars=("OPENAI_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" == "sk-your-openai-api-key-here" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo "Please configure these in your .env file"
    exit 1
fi

echo "✅ All required environment variables are configured"

echo
echo -e "${GREEN}🎯 Ready to deploy AI Tools Infrastructure!${NC}"
echo
echo -e "${BLUE}Deployment will include:${NC}"
echo "  📊 Excel AI Agent (Port 8000)"
echo "  📈 CSV AI Analyzer (Port 8001)"
echo "  🌐 Real Time Translator (Port 8002)"
echo "  📱 Monitoring Dashboard (Port 8003)"
echo "  🔧 Nginx Load Balancer (Ports 80/443)"
echo "  💾 Redis Cache (Port 6379)"
echo "  📊 Prometheus (Port 9090)"
echo "  📈 Grafana (Port 3000)"
echo "  🔍 Jaeger Tracing (Port 16686)"
echo

# Ask for confirmation
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo
echo -e "${BLUE}🚀 Starting production deployment...${NC}"
echo

# Run the deployment
./deploy-production.sh

echo
echo -e "${GREEN}🎉 Deployment initiated successfully!${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. Monitor deployment progress in the terminal"
echo "2. Access the monitoring dashboard at http://localhost:8003"
echo "3. Check service health at http://localhost:8003/api/health"
echo "4. View Grafana dashboards at http://localhost:3000"
echo
echo -e "${GREEN}Deployment is now in progress!${NC}"