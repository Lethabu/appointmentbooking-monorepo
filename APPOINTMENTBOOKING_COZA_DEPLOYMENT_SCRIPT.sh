#!/bin/bash
# AppointmentBooking.co.za Production Deployment Script
# Automated deployment with error handling and rollback capabilities
# Created: January 1, 2026

set -euo pipefail

# Configuration
DOMAIN="appointmentbooking.co.za"
APP_DIR="apps/booking"
BACKUP_DIR="/tmp/appointmentbooking-backup-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/tmp/appointmentbooking-deploy.log"
ENV_FILE="$APP_DIR/.env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check if required tools are installed
    local missing_tools=()
    
    for tool in node npm git curl; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file not found: $ENV_FILE"
        exit 1
    fi
    
    # Check if application directory exists
    if [ ! -d "$APP_DIR" ]; then
        log_error "Application directory not found: $APP_DIR"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup environment file
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "$BACKUP_DIR/.env.production.backup"
    fi
    
    # Backup application directory if it exists
    if [ -d "$APP_DIR" ]; then
        cp -r "$APP_DIR" "$BACKUP_DIR/app.backup"
    fi
    
    log_success "Backup created at: $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$APP_DIR"
    
    # Try npm install with different methods
    if npm install --legacy-peer-deps; then
        log_success "Dependencies installed successfully (legacy-peer-deps)"
    elif npm install; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        return 1
    fi
}

# Build application
build_application() {
    log "Building application for production..."
    
    cd "$APP_DIR"
    
    # Set production environment
    export NODE_ENV=production
    
    # Run build
    if npm run build; then
        log_success "Application built successfully"
    else
        log_error "Build failed"
        return 1
    fi
}

# Configure domain settings
configure_domain() {
    log "Configuring domain settings for $DOMAIN..."
    
    cd "$APP_DIR"
    
    # Update environment variables
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$DOMAIN|g" "$ENV_FILE"
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://$DOMAIN|g" "$ENV_FILE"
    
    # Update OAuth redirect URIs
    sed -i "s|GOOGLE_REDIRECT_URI=.*|GOOGLE_REDIRECT_URI=https://$DOMAIN/api/auth/callback/google|g" "$ENV_FILE"
    sed -i "s|MICROSOFT_REDIRECT_URI=.*|MICROSOFT_REDIRECT_URI=https://$DOMAIN/api/auth/callback/microsoft|g" "$ENV_FILE"
    
    log_success "Domain configuration updated"
}

# Setup SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Run SSL provisioning script
    if [ -f "scripts/ssl-provisioning.sh" ]; then
        chmod +x scripts/ssl-provisioning.sh
        if scripts/ssl-provisioning.sh --domain "$DOMAIN"; then
            log_success "SSL certificates provisioned successfully"
        else
            log_warning "SSL provisioning failed - may need manual setup"
        fi
    else
        log_warning "SSL provisioning script not found"
    fi
}

# Test deployment
test_deployment() {
    log "Testing deployment..."
    
    # Test if application starts
    cd "$APP_DIR"
    
    # Start application in background
    npm run start &
    local app_pid=$!
    
    # Wait for application to start
    sleep 10
    
    # Test HTTP endpoint
    if curl -f -s "http://localhost:3000" > /dev/null; then
        log_success "Application responding correctly"
    else
        log_error "Application not responding"
        kill $app_pid 2>/dev/null || true
        return 1
    fi
    
    # Test API endpoint
    if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
        log_success "API endpoints working correctly"
    else
        log_warning "API health endpoint not responding"
    fi
    
    # Stop test application
    kill $app_pid 2>/dev/null || true
    sleep 2
}

# Deploy to hosting platform
deploy_to_platform() {
    log "Deploying to hosting platform..."
    
    cd "$APP_DIR"
    
    # Try different deployment methods
    if command -v vercel &> /dev/null; then
        log "Deploying to Vercel..."
        if vercel --prod --alias "$DOMAIN"; then
            log_success "Deployed to Vercel successfully"
            return 0
        fi
    fi
    
    if command -v wrangler &> /dev/null; then
        log "Deploying to Cloudflare Pages..."
        if npm run pages:deploy; then
            log_success "Deployed to Cloudflare Pages successfully"
            return 0
        fi
    fi
    
    # Manual deployment fallback
    log "Using manual deployment method..."
    if npm run start; then
        log_success "Application started (manual deployment)"
        return 0
    else
        log_error "Manual deployment failed"
        return 1
    fi
}

# Update DNS configuration
update_dns() {
    log "DNS configuration guidance..."
    
    echo ""
    echo "📋 DNS Configuration Required:"
    echo "Please update your DNS records for $DOMAIN:"
    echo ""
    echo "Type: A Record"
    echo "Name: @"
    echo "Value: [YOUR_SERVER_IP]"
    echo ""
    echo "Type: CNAME"
    echo "Name: www"
    echo "Value: $DOMAIN"
    echo ""
    echo "Type: CNAME"
    echo "Name: api"
    echo "Value: $DOMAIN"
    echo ""
    echo "⏰ DNS propagation may take 24-48 hours globally."
    echo "🔍 You can check propagation status at: https://dnschecker.org"
}

# Post-deployment validation
post_deployment_validation() {
    log "Running post-deployment validation..."
    
    # Wait for DNS propagation
    log "Waiting for DNS propagation (60 seconds)..."
    sleep 60
    
    # Test HTTPS endpoint
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        log_success "HTTPS endpoint responding correctly"
    else
        log_warning "HTTPS endpoint not yet available - DNS may still be propagating"
    fi
    
    # Test API endpoints
    if curl -f -s "https://$DOMAIN/api/health" > /dev/null; then
        log_success "API endpoints responding correctly"
    else
        log_warning "API endpoints not yet available"
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    # Kill any background processes
    jobs -p | xargs -r kill 2>/dev/null || true
    
    # Remove temporary files
    rm -f /tmp/appointmentbooking-start.log
    
    log_success "Cleanup completed"
}

# Rollback function
rollback() {
    log_error "Deployment failed - initiating rollback..."
    
    if [ -d "$BACKUP_DIR" ]; then
        log "Restoring from backup: $BACKUP_DIR"
        
        # Restore application
        if [ -d "$BACKUP_DIR/app.backup" ]; then
            rm -rf "$APP_DIR"
            cp -r "$BACKUP_DIR/app.backup" "$APP_DIR"
        fi
        
        # Restore environment file
        if [ -f "$BACKUP_DIR/.env.production.backup" ]; then
            cp "$BACKUP_DIR/.env.production.backup" "$ENV_FILE"
        fi
        
        log_success "Rollback completed"
    else
        log_error "No backup available for rollback"
    fi
    
    exit 1
}

# Main deployment function
main() {
    log "🚀 Starting AppointmentBooking.co.za deployment..."
    log "Target domain: $DOMAIN"
    log "Log file: $LOG_FILE"
    
    # Set trap for cleanup and rollback
    trap cleanup EXIT
    trap rollback ERR
    
    # Run deployment steps
    check_prerequisites
    create_backup
    install_dependencies
    build_application
    configure_domain
    setup_ssl
    
    if deploy_to_platform; then
        update_dns
        post_deployment_validation
        
        log_success "🎉 Deployment completed successfully!"
        log "Website should be available at: https://$DOMAIN"
        log "Backup location: $BACKUP_DIR"
        log "Log file: $LOG_FILE"
    else
        rollback
    fi
}

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "AppointmentBooking.co.za Production Deployment Script"
    echo ""
    echo "Options:"
    echo "  -d, --domain DOMAIN          Target domain (default: appointmentbooking.co.za)"
    echo "  -h, --help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --domain example.com"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run main function
main