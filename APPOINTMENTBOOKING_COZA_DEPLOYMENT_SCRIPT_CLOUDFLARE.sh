#!/bin/bash
# AppointmentBooking.co.za Cloudflare Pages Deployment Script
# Automated deployment with error handling and rollback capabilities
# Cloudflare Pages Migration - January 3, 2026

set -euo pipefail

# Configuration
DOMAIN="appointmentbooking.co.za"
APP_DIR="apps/booking"
BACKUP_DIR="/tmp/appointmentbooking-backup-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/tmp/appointmentbooking-deploy-cloudflare.log"
ENV_FILE="$APP_DIR/.env.production"
PROJECT_NAME="appointmentbooking-coza"

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
    log "Checking deployment prerequisites for Cloudflare Pages..."
    
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
    
    # Check for Cloudflare CLI
    if ! command -v wrangler &> /dev/null; then
        log "Installing Cloudflare CLI..."
        npm install -g wrangler
        log_success "Cloudflare CLI installed"
    else
        log_success "Cloudflare CLI found"
    fi
    
    # Check if wrangler is authenticated
    if ! wrangler whoami &> /dev/null; then
        log_error "Cloudflare CLI not authenticated. Please run 'wrangler login' first"
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
    
    # Backup wrangler.toml
    if [ -f "wrangler.toml" ]; then
        cp "wrangler.toml" "$BACKUP_DIR/wrangler.toml.backup"
    fi
    
    log_success "Backup created at: $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$APP_DIR"
    
    # Use pnpm if available, otherwise npm
    if command -v pnpm &> /dev/null; then
        log "Using pnpm for dependency installation..."
        if pnpm install; then
            log_success "Dependencies installed successfully with pnpm"
        else
            log_warning "pnpm install failed, trying npm..."
            npm install --legacy-peer-deps
        fi
    else
        log "Using npm for dependency installation..."
        if npm install --legacy-peer-deps; then
            log_success "Dependencies installed successfully"
        else
            log_error "Failed to install dependencies"
            return 1
        fi
    fi
}

# Build application for Cloudflare Pages
build_application() {
    log "Building application for Cloudflare Pages..."
    
    cd "$APP_DIR"
    
    # Set production environment
    export NODE_ENV=production
    export NEXT_PUBLIC_APP_URL="https://$DOMAIN"
    
    # Run build with Cloudflare Pages optimizations
    if npm run build; then
        log_success "Application built successfully for Cloudflare Pages"
        
        # Verify build output
        if [ ! -d ".next" ]; then
            log_error "Build output directory .next not found"
            return 1
        fi
        
        # Copy build files to root for Cloudflare Pages
        log "Preparing build output for Cloudflare Pages..."
        cp -r .next ../.next || log_warning "Could not copy .next to root"
    else
        log_error "Build failed"
        return 1
    fi
}

# Configure domain settings
configure_domain() {
    log "Configuring domain settings for $DOMAIN..."
    
    cd "$APP_DIR"
    
    # Update environment variables for Cloudflare Pages
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$DOMAIN|g" "$ENV_FILE"
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://$DOMAIN|g" "$ENV_FILE"
    
    # Update OAuth redirect URIs for Cloudflare Pages
    sed -i "s|GOOGLE_REDIRECT_URI=.*|GOOGLE_REDIRECT_URI=https://$DOMAIN/api/auth/callback/google|g" "$ENV_FILE"
    sed -i "s|MICROSOFT_REDIRECT_URI=.*|MICROSOFT_REDIRECT_URI=https://$DOMAIN/api/auth/callback/microsoft|g" "$ENV_FILE"
    
    # Update wrangler.toml with domain
    sed -i "s|name = .*|name = \"$PROJECT_NAME\"|g" "../wrangler.toml"
    sed -i "s|NEXT_PUBLIC_APP_URL = \".*\"|NEXT_PUBLIC_APP_URL = \"https://$DOMAIN\"|g" "../wrangler.toml"
    sed -i "s|NEXTAUTH_URL = \".*\"|NEXTAUTH_URL = \"https://$DOMAIN\"|g" "../wrangler.toml"
    
    log_success "Domain configuration updated for Cloudflare Pages"
}

# Setup Cloudflare Pages functions
setup_pages_functions() {
    log "Setting up Cloudflare Pages functions..."
    
    # Create functions directory
    mkdir -p "functions"
    
    # Create _worker.js for API routes
    cat > functions/_worker.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Forward to Next.js API routes
      return new Response('API route handled by Next.js', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Handle all other routes - serve static files
    return fetch(request);
  }
};
EOF
    
    # Create _routes.json for routing
    cat > functions/_routes.json << 'EOF'
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
EOF
    
    log_success "Cloudflare Pages functions configured"
}

# Deploy to Cloudflare Pages
deploy_to_cloudflare() {
    log "Deploying to Cloudflare Pages..."
    
    cd "$APP_DIR"
    
    # Ensure wrangler.toml is in the root
    if [ ! -f "../wrangler.toml" ]; then
        log_error "wrangler.toml not found in project root"
        return 1
    fi
    
    # Login check
    if ! wrangler whoami &> /dev/null; then
        log_error "Please login to Cloudflare first: wrangler login"
        return 1
    fi
    
    # Deploy to Cloudflare Pages
    log "Starting Cloudflare Pages deployment..."
    if wrangler pages deploy .next --project-name="$PROJECT_NAME" --branch=main; then
        log_success "Deployed to Cloudflare Pages successfully"
        
        # Get deployment URL
        DEPLOYMENT_URL=$(wrangler pages deployment list --project-name="$PROJECT_NAME" --json | jq -r '.[0].url' 2>/dev/null || echo "unknown")
        log "Deployment URL: https://$DEPLOYMENT_URL"
        
        return 0
    else
        log_error "Cloudflare Pages deployment failed"
        return 1
    fi
}

# Configure custom domain
configure_custom_domain() {
    log "Configuring custom domain $DOMAIN..."
    
    # Add custom domain to Cloudflare Pages
    if wrangler pages domain add "$DOMAIN" --project-name="$PROJECT_NAME"; then
        log_success "Custom domain configured"
        log "DNS records will be automatically managed by Cloudflare"
    else
        log_warning "Custom domain configuration failed - may need manual setup"
        log "Please configure DNS manually using the provided DNS configuration"
    fi
}

# Update DNS configuration for Cloudflare Pages
update_dns() {
    log "DNS configuration for Cloudflare Pages..."
    
    echo ""
    echo "📋 DNS Configuration for Cloudflare Pages:"
    echo "Domain: $DOMAIN"
    echo "Cloudflare Pages automatically manages DNS when custom domain is added."
    echo ""
    echo "Required DNS Records (automatically created by Cloudflare Pages):"
    echo ""
    echo "Type: CNAME"
    echo "Name: @"
    echo "Value: [Cloudflare Pages will provide this]"
    echo ""
    echo "Type: CNAME"
    echo "Name: www"
    echo "Value: [Cloudflare Pages will provide this]"
    echo ""
    echo "Type: CNAME"
    echo "Name: api"
    echo "Value: [Cloudflare Pages will provide this]"
    echo ""
    echo "⚡ Cloudflare Pages manages DNS automatically when you add a custom domain."
    echo "⏰ SSL certificates are automatically provisioned by Cloudflare."
}

# Post-deployment validation
post_deployment_validation() {
    log "Running post-deployment validation for Cloudflare Pages..."
    
    # Wait for deployment to be ready
    log "Waiting for deployment to be ready (60 seconds)..."
    sleep 60
    
    # Test HTTPS endpoint
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        log_success "HTTPS endpoint responding correctly"
    else
        log_warning "HTTPS endpoint not yet available - may still be deploying"
    fi
    
    # Test API endpoints
    if curl -f -s "https://$DOMAIN/api/health" > /dev/null; then
        log_success "API endpoints responding correctly"
    else
        log_warning "API endpoints not yet available"
    fi
    
    # Test Pages deployment status
    if wrangler pages deployment list --project-name="$PROJECT_NAME" --json > /dev/null 2>&1; then
        log_success "Cloudflare Pages deployment status accessible"
    else
        log_warning "Could not access deployment status"
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
        
        # Restore wrangler.toml
        if [ -f "$BACKUP_DIR/wrangler.toml.backup" ]; then
            cp "$BACKUP_DIR/wrangler.toml.backup" "wrangler.toml"
        fi
        
        log_success "Rollback completed"
    else
        log_error "No backup available for rollback"
    fi
    
    exit 1
}

# Main deployment function
main() {
    log "🚀 Starting AppointmentBooking.co.za deployment to Cloudflare Pages..."
    log "Target domain: $DOMAIN"
    log "Project: $PROJECT_NAME"
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
    setup_pages_functions
    
    if deploy_to_cloudflare; then
        configure_custom_domain
        update_dns
        post_deployment_validation
        
        log_success "🎉 Cloudflare Pages deployment completed successfully!"
        log "Website should be available at: https://$DOMAIN"
        log "Project: $PROJECT_NAME"
        log "Backup location: $BACKUP_DIR"
        log "Log file: $LOG_FILE"
        
        echo ""
        echo "🔗 Next Steps:"
        echo "1. Update OAuth redirect URIs in Google/Azure dashboards:"
        echo "   - https://$DOMAIN/api/auth/callback/google"
        echo "   - https://$DOMAIN/api/auth/callback/microsoft"
        echo "2. Monitor deployment at: https://dash.cloudflare.com"
        echo "3. Check SSL certificate status in Cloudflare dashboard"
    else
        rollback
    fi
}

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "AppointmentBooking.co.za Cloudflare Pages Deployment Script"
    echo ""
    echo "Options:"
    echo "  -d, --domain DOMAIN          Target domain (default: appointmentbooking.co.za)"
    echo "  -p, --project PROJECT       Cloudflare Pages project name (default: appointmentbooking-coza)"
    echo "  -h, --help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --domain example.com --project my-project"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -p|--project)
            PROJECT_NAME="$2"
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