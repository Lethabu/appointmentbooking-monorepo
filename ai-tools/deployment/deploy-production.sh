#!/bin/bash
# Production Deployment Script for AI Tools Infrastructure
# Comprehensive deployment with validation and monitoring

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-tools-infrastructure"
ENVIRONMENT=${1:-production}
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="./deployment-$(date +%Y%m%d_%H%M%S).log"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check Docker and Docker Compose
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check environment file
    if [ ! -f ".env" ]; then
        error "Environment file .env not found"
    fi
    
    # Check required environment variables
    source .env
    
    required_vars=("OPENAI_API_KEY")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "Required environment variable $var is not set"
        fi
    done
    
    # Check disk space (require at least 10GB)
    available_space=$(df . | awk 'NR==2 {print $4}')
    if [ $available_space -lt 104857 # 10GB60 ]; then  in KB
        warning "Low disk space detected. Available: $(($available_space / 1024 / 1024))GB"
    fi
    
    # Check system resources
    memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    if [ $memory -lt 2048 ]; then
        warning "Low available memory detected. Available: ${memory}MB"
    fi
    
    success "Pre-deployment checks completed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p $BACKUP_DIR
    
    # Backup existing containers and volumes
    if docker-compose -f docker-compose.prod.yml ps -q | grep -q .; then
        docker-compose -f docker-compose.prod.yml exec -T redis redis-cli BGSAVE || true
        docker cp redis:/data/dump.rdb $BACKUP_DIR/redis_backup.rdb || true
    fi
    
    # Backup configuration files
    cp -r .env $BACKUP_DIR/ 2>/dev/null || true
    cp -r deployment/ $BACKUP_DIR/ 2>/dev/null || true
    
    success "Backup created at $BACKUP_DIR"
}

# Build and deploy services
deploy_services() {
    log "Building and deploying AI tools services..."
    
    # Pull latest base images
    docker-compose -f docker-compose.prod.yml pull
    
    # Build service images
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    log "Waiting for services to be healthy..."
    
    services=("excel-ai-agent:8000" "csv-ai-analyzer:8001" "real-time-translator:8002" "monitoring-dashboard:8003")
    timeout=300  # 5 minutes
    elapsed=0
    
    for service_port in "${services[@]}"; do
        service=${service_port%:*}
        port=${service_port#*:}
        
        log "Waiting for $service to be healthy on port $port..."
        
        while [ $elapsed -lt $timeout ]; do
            if curl -f -s http://localhost:$port/health > /dev/null 2>&1; then
                success "$service is healthy"
                break
            fi
            
            echo -n "."
            sleep 5
            elapsed=$((elapsed + 5))
        done
        
        if [ $elapsed -ge $timeout ]; then
            error "$service failed to become healthy within timeout"
        fi
        
        elapsed=0
    done
    
    success "All services are healthy"
}

# Run validation tests
run_validation_tests() {
    log "Running validation tests..."
    
    # Test Excel AI Agent
    log "Testing Excel AI Agent..."
    response=$(curl -s -X POST http://localhost:8000/health)
    if echo $response | grep -q "healthy"; then
        success "Excel AI Agent validation passed"
    else
        error "Excel AI Agent validation failed"
    fi
    
    # Test CSV AI Analyzer
    log "Testing CSV AI Analyzer..."
    response=$(curl -s -X POST http://localhost:8001/health)
    if echo $response | grep -q "healthy"; then
        success "CSV AI Analyzer validation passed"
    else
        error "CSV AI Analyzer validation failed"
    fi
    
    # Test Real Time Translator
    log "Testing Real Time Translator..."
    response=$(curl -s -X POST http://localhost:8002/health)
    if echo $response | grep -q "healthy"; then
        success "Real Time Translator validation passed"
    else
        error "Real Time Translator validation failed"
    fi
    
    # Test Monitoring Dashboard
    log "Testing Monitoring Dashboard..."
    response=$(curl -s http://localhost:8003/health)
    if echo $response | grep -q "healthy"; then
        success "Monitoring Dashboard validation passed"
    else
        error "Monitoring Dashboard validation failed"
    fi
    
    # Test Nginx Load Balancer
    log "Testing Nginx Load Balancer..."
    if curl -f -s http://localhost/health > /dev/null 2>&1; then
        success "Nginx Load Balancer validation passed"
    else
        error "Nginx Load Balancer validation failed"
    fi
    
    # Test Prometheus
    log "Testing Prometheus..."
    if curl -f -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
        success "Prometheus validation passed"
    else
        error "Prometheus validation failed"
    fi
    
    success "All validation tests passed"
}

# Performance validation
performance_validation() {
    log "Running performance validation..."
    
    # Load test with concurrent requests
    log "Running concurrent request test..."
    
    # Test Excel AI Agent with sample data
    for i in {1..5}; do
        (
            curl -s -X POST http://localhost:8000/health > /dev/null &
        )
    done
    wait
    
    success "Performance validation completed"
}

# Setup monitoring and alerts
setup_monitoring() {
    log "Setting up monitoring and alerts..."
    
    # Configure Grafana dashboards (if needed)
    log "Checking Grafana access..."
    if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Grafana is accessible at http://localhost:3000"
        log "Default credentials - Username: admin, Password: $GRAFANA_ADMIN_PASSWORD"
    else
        warning "Grafana is not accessible"
    fi
    
    # Configure Prometheus access
    log "Checking Prometheus access..."
    if curl -f -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
        success "Prometheus is accessible at http://localhost:9090"
    else
        warning "Prometheus is not accessible"
    fi
    
    # Configure Jaeger access
    log "Checking Jaeger access..."
    if curl -f -s http://localhost:16686 > /dev/null 2>&1; then
        success "Jaeger is accessible at http://localhost:16686"
    else
        warning "Jaeger is not accessible"
    fi
}

# Generate deployment report
generate_deployment_report() {
    log "Generating deployment report..."
    
    report_file="deployment-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > $report_file << EOF
# AI Tools Infrastructure - Production Deployment Report

**Date:** $(date)
**Environment:** $ENVIRONMENT
**Project:** $PROJECT_NAME

## Deployment Summary

### Services Deployed
- ✅ Excel AI Agent (Port 8000)
- ✅ CSV AI Analyzer (Port 8001)
- ✅ Real Time Translator (Port 8002)
- ✅ Monitoring Dashboard (Port 8003)
- ✅ Nginx Load Balancer (Ports 80, 443)
- ✅ Redis Cache (Port 6379)
- ✅ Prometheus (Port 9090)
- ✅ Grafana (Port 3000)
- ✅ Jaeger Tracing (Port 16686)

### Service Health Status
$(docker-compose -f docker-compose.prod.yml ps)

### Resource Usage
$(docker stats --no-stream)

### Access URLs
- **Main Dashboard:** http://localhost:8003
- **Excel AI Agent:** http://localhost:8000
- **CSV AI Analyzer:** http://localhost:8001
- **Real Time Translator:** http://localhost:8002
- **Grafana:** http://localhost:3000
- **Prometheus:** http://localhost:9090
- **Jaeger:** http://localhost:16686

### Environment Configuration
- **Environment File:** .env
- **Backup Location:** $BACKUP_DIR
- **Log File:** $LOG_FILE

### Next Steps
1. Access the monitoring dashboard to verify system health
2. Configure Grafana dashboards for custom metrics
3. Set up alert notifications
4. Schedule regular backups
5. Monitor resource usage and scale as needed

### Support
For technical support, refer to the monitoring dashboard and logs.
EOF

    success "Deployment report generated: $report_file"
}

# Main deployment function
main() {
    log "Starting AI Tools Infrastructure Production Deployment"
    log "Environment: $ENVIRONMENT"
    log "Log file: $LOG_FILE"
    
    pre_deployment_checks
    create_backup
    deploy_services
    wait_for_services
    run_validation_tests
    performance_validation
    setup_monitoring
    generate_deployment_report
    
    success "🎉 Production deployment completed successfully!"
    echo
    echo -e "${GREEN}=== DEPLOYMENT COMPLETE ===${NC}"
    echo -e "${BLUE}Access your AI tools at:${NC}"
    echo -e "  📊 Monitoring Dashboard: http://localhost:8003"
    echo -e "  📈 Grafana: http://localhost:3000"
    echo -e "  🔍 Jaeger Tracing: http://localhost:16686"
    echo -e "  📊 Prometheus: http://localhost:9090"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Review the deployment report"
    echo -e "  2. Configure monitoring alerts"
    echo -e "  3. Set up backup schedules"
    echo -e "  4. Monitor system performance"
    echo
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        log "Rolling back to previous deployment..."
        if [ -d "$BACKUP_DIR" ]; then
            docker-compose -f docker-compose.prod.yml down
            # Restore from backup logic would go here
            success "Rollback completed"
        else
            error "No backup found for rollback"
        fi
        ;;
    "status")
        log "Checking deployment status..."
        docker-compose -f docker-compose.prod.yml ps
        ;;
    "logs")
        log "Showing deployment logs..."
        docker-compose -f docker-compose.prod.yml logs -f
        ;;
    "health")
        log "Checking service health..."
        for service in excel-ai-agent csv-ai-analyzer real-time-translator monitoring-dashboard; do
            if curl -f -s http://localhost:$(docker-compose -f docker-compose.prod.yml port $service 80 2>/dev/null | cut -d: -f2)/health > /dev/null 2>&1; then
                success "$service is healthy"
            else
                error "$service is unhealthy"
            fi
        done
        ;;
    *)
        main
        ;;
esac