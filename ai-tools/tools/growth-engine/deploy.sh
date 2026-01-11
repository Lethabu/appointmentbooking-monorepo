#!/bin/bash

# Automated Growth Engine Deployment Script
# Deploys AI-powered customer acquisition, self-optimizing systems, and automated growth mechanisms

set -e

echo "🚀 Starting Automated Growth & Optimization Engine Deployment..."

# Configuration
CONTAINER_NAME="growth-engine"
DOCKER_IMAGE="appointmentbooking-growth-engine"
PORT_MAIN=8005
PORT_DASHBOARD=8006

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Build the Docker images
build_images() {
    print_status "Building Growth Engine Docker images..."
    docker build -t $DOCKER_IMAGE:latest .
    if [ $? -eq 0 ]; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
}

# Stop existing containers
stop_existing() {
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    print_success "Existing containers stopped"
}

# Start the growth engine services
start_services() {
    print_status "Starting Growth Engine services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:$PORT_MAIN/health > /dev/null 2>&1; then
        print_success "Growth Engine API is healthy"
    else
        print_error "Growth Engine API health check failed"
        exit 1
    fi
    
    if curl -f http://localhost:$PORT_DASHBOARD/health > /dev/null 2>&1; then
        print_success "Growth Engine Dashboard is healthy"
    else
        print_warning "Growth Engine Dashboard health check failed"
    fi
}

# Test the deployment
test_deployment() {
    print_status "Testing Growth Engine deployment..."
    
    # Test health endpoint
    HEALTH_RESPONSE=$(curl -s http://localhost:$PORT_MAIN/health)
    if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
        print_success "Health endpoint test passed"
    else
        print_error "Health endpoint test failed"
        return 1
    fi
    
    # Test metrics endpoint
    METRICS_RESPONSE=$(curl -s http://localhost:$PORT_MAIN/metrics)
    if [[ $METRICS_RESPONSE == *"growth_engine"* ]]; then
        print_success "Metrics endpoint test passed"
    else
        print_warning "Metrics endpoint test failed"
    fi
    
    # Test real-time metrics
    METRICS_API_RESPONSE=$(curl -s http://localhost:$PORT_MAIN/metrics/real-time)
    if [[ $METRICS_API_RESPONSE == *"current_metrics"* ]]; then
        print_success "Real-time metrics API test passed"
    else
        print_warning "Real-time metrics API test failed"
    fi
    
    # Test dashboard
    DASHBOARD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT_DASHBOARD/)
    if [[ $DASHBOARD_RESPONSE == "200" ]]; then
        print_success "Dashboard test passed"
    else
        print_warning "Dashboard test failed (HTTP $DASHBOARD_RESPONSE)"
    fi
}

# Display service information
show_service_info() {
    print_status "Growth Engine Services Information:"
    echo ""
    echo "🔧 Growth Engine API:"
    echo "   URL: http://localhost:$PORT_MAIN"
    echo "   Health: http://localhost:$PORT_MAIN/health"
    echo "   Metrics: http://localhost:$PORT_MAIN/metrics"
    echo "   Real-time API: http://localhost:$PORT_MAIN/metrics/real-time"
    echo "   Campaign API: http://localhost:$PORT_MAIN/campaigns/execute"
    echo "   Optimization API: http://localhost:$PORT_MAIN/optimization/analyze"
    echo ""
    echo "📊 Growth Engine Dashboard:"
    echo "   URL: http://localhost:$PORT_DASHBOARD"
    echo "   API: http://localhost:$PORT_DASHBOARD/api/dashboard"
    echo "   Success Criteria: http://localhost:$PORT_DASHBOARD/api/success-criteria"
    echo "   Optimization: http://localhost:$PORT_DASHBOARD/api/optimization"
    echo "   Alerts: http://localhost:$PORT_DASHBOARD/api/alerts"
    echo ""
    echo "🚀 Success Criteria Targets:"
    echo "   • Customer Acquisition Growth: 40% month-over-month"
    echo "   • Lead Conversion Improvement: 25%"
    echo "   • Pricing Optimization Revenue: 15%"
    echo "   • Referral Acquisition Rate: 30%"
    echo "   • Journey Automation Conversion: 35%"
    echo ""
}

# Execute growth campaigns (demo)
execute_demo_campaigns() {
    print_status "Executing demo growth campaigns..."
    
    # Customer Acquisition Campaign
    print_status "Running Customer Acquisition Campaign..."
    curl -s -X POST http://localhost:$PORT_MAIN/campaigns/execute \
        -H "Content-Type: application/json" \
        -d '{"type": "customer_acquisition", "parameters": {"search_criteria": {"location": "Cape Town", "business_type": "hair_salon"}}}' \
        > /dev/null
    
    # Pricing Optimization Campaign
    print_status "Running Pricing Optimization Campaign..."
    curl -s -X POST http://localhost:$PORT_MAIN/campaigns/execute \
        -H "Content-Type: application/json" \
        -d '{"type": "pricing_optimization", "parameters": {"customer_segment": "high_value", "competitor_data": {"average_price": 650}}}' \
        > /dev/null
    
    # Referral Program Campaign
    print_status "Running Referral Program Campaign..."
    curl -s -X POST http://localhost:$PORT_MAIN/campaigns/execute \
        -H "Content-Type: application/json" \
        -d '{"type": "referral_program", "parameters": {}}' \
        > /dev/null
    
    # Journey Optimization Campaign
    print_status "Running Journey Optimization Campaign..."
    curl -s -X POST http://localhost:$PORT_MAIN/campaigns/execute \
        -H "Content-Type: application/json" \
        -d '{"type": "journey_optimization", "parameters": {"customer_profile": {"business_type": "beauty_salon", "size": "medium"}}}' \
        > /dev/null
    
    print_success "Demo campaigns executed successfully"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "  Automated Growth & Optimization Engine"
    echo "  Deployment Script"
    echo "=========================================="
    echo ""
    
    # Pre-deployment checks
    check_docker
    check_docker_compose
    
    # Build and deploy
    build_images
    stop_existing
    start_services
    
    # Test deployment
    test_deployment
    
    # Execute demo campaigns
    execute_demo_campaigns
    
    # Show service information
    show_service_info
    
    print_success "🎉 Growth Engine deployment completed successfully!"
    print_status "The automated growth and optimization engine is now running with:"
    print_status "• AI-powered customer acquisition automation"
    print_status "• Self-optimizing lead scoring and conversion workflows"
    print_status "• Dynamic pricing algorithms based on market demand"
    print_status "• Automated referral and partnership programs"
    print_status "• Advanced customer journey automation"
    print_status "• Real-time growth engine monitoring dashboard"
    echo ""
    print_status "Access the dashboard at: http://localhost:$PORT_DASHBOARD"
    print_status "Monitor performance at: http://localhost:$PORT_DASHBOARD/api/dashboard"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"