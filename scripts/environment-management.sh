#!/bin/bash
# Environment Variables and Secrets Management System
# Production-grade environment configuration management
# Created: 2025-12-31

set -euo pipefail

# Configuration
PROJECT_NAME="appointmentbooking"
SECRETS_DIR="/etc/secrets/$PROJECT_NAME"
ENV_DIR="/etc/environment/$PROJECT_NAME"
LOG_FILE="/var/log/environment-management.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment types
ENVIRONMENT_TYPES=("development" "staging" "production")
SERVICE_TYPES=("database" "api" "web" "cache" "queue" "monitoring" "auth" "payments" "email" "storage")

# Logging functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Create directory structure
setup_directories() {
    log "Setting up environment management directories..."
    
    sudo mkdir -p "$SECRETS_DIR"
    sudo mkdir -p "$ENV_DIR"
    sudo mkdir -p "$ENV_DIR/development"
    sudo mkdir -p "$ENV_DIR/staging"
    sudo mkdir -p "$ENV_DIR/production"
    sudo mkdir -p "$SECRETS_DIR/development"
    sudo mkdir -p "$SECRETS_DIR/staging"
    sudo mkdir -p "$SECRETS_DIR/production"
    
    # Set appropriate permissions
    sudo chmod 750 "$SECRETS_DIR"
    sudo chmod 755 "$ENV_DIR"
    sudo chmod 600 "$SECRETS_DIR"/*
    sudo chmod 644 "$ENV_DIR"/*
    
    log_success "Directory structure created"
}

# Generate environment templates
generate_environment_templates() {
    log "Generating environment configuration templates..."
    
    # Development environment
    cat > "$ENV_DIR/development/.env.template" <<'EOF'
# Development Environment Configuration
# This file contains non-sensitive configuration for development

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database Configuration (Non-sensitive)
DATABASE_HOST=localhost
DATABASE_PORT=54322
DATABASE_NAME=appointmentbooking_dev
DATABASE_SCHEMA=public
DATABASE_SSL=false

# Cache Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AUTOMATED_TESTING=true
ENABLE_DEBUG_MODE=true
ENABLE_PERFORMANCE_MONITORING=false

# External Services (Development Keys)
GOOGLE_CALENDAR_API_KEY=dev_google_api_key
OUTLOOK_CLIENT_ID=dev_outlook_client_id
STRIPE_PUBLISHABLE_KEY=pk_test_dev_key
PAYSTACK_PUBLIC_KEY=pk_test_dev_paystack

# Logging
LOG_LEVEL=debug
LOG_FORMAT=dev
ENABLE_REQUEST_LOGGING=true

# Development Tools
ENABLE_HOT_RELOAD=true
ENABLE_CSRF_PROTECTION=false
ENABLE_CORS=true
EOF

    # Staging environment
    cat > "$ENV_DIR/staging/.env.template" <<'EOF'
# Staging Environment Configuration
# This file contains non-sensitive configuration for staging

# Application Settings
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.appointmentbooking.co.za
NEXT_PUBLIC_API_URL=https://staging.appointmentbooking.co.za/api

# Database Configuration (Non-sensitive)
DATABASE_HOST=staging-db.internal
DATABASE_PORT=5432
DATABASE_NAME=appointmentbooking_staging
DATABASE_SCHEMA=public
DATABASE_SSL=true

# Cache Configuration
REDIS_HOST=staging-cache.internal
REDIS_PORT=6379
REDIS_DB=0

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AUTOMATED_TESTING=true
ENABLE_DEBUG_MODE=false
ENABLE_PERFORMANCE_MONITORING=true

# External Services (Staging Keys)
GOOGLE_CALENDAR_API_KEY=staging_google_api_key
OUTLOOK_CLIENT_ID=staging_outlook_client_id
STRIPE_PUBLISHABLE_KEY=pk_staging_stripe_key
PAYSTACK_PUBLIC_KEY=pk_staging_paystack_key

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
ENABLE_REQUEST_LOGGING=true

# Security Settings
ENABLE_HOT_RELOAD=false
ENABLE_CSRF_PROTECTION=true
ENABLE_CORS=true
EOF

    # Production environment
    cat > "$ENV_DIR/production/.env.template" <<'EOF'
# Production Environment Configuration
# This file contains non-sensitive configuration for production

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://appointmentbooking.co.za
NEXT_PUBLIC_API_URL=https://appointmentbooking.co.za/api

# Database Configuration (Non-sensitive)
DATABASE_HOST=prod-db.internal
DATABASE_PORT=5432
DATABASE_NAME=appointmentbooking_prod
DATABASE_SCHEMA=public
DATABASE_SSL=true

# Cache Configuration
REDIS_HOST=prod-cache.internal
REDIS_PORT=6379
REDIS_DB=0

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AUTOMATED_TESTING=false
ENABLE_DEBUG_MODE=false
ENABLE_PERFORMANCE_MONITORING=true

# External Services (Production URLs)
GOOGLE_CALENDAR_API_KEY=prod_google_api_key
OUTLOOK_CLIENT_ID=prod_outlook_client_id
STRIPE_PUBLISHABLE_KEY=pk_live_stripe_key
PAYSTACK_PUBLIC_KEY=pk_live_paystack_key

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json
ENABLE_REQUEST_LOGGING=true

# Security Settings
ENABLE_HOT_RELOAD=false
ENABLE_CSRF_PROTECTION=true
ENABLE_CORS=true
EOF

    log_success "Environment templates created"
}

# Generate secrets templates
generate_secrets_templates() {
    log "Generating secrets configuration templates..."
    
    # Development secrets
    cat > "$SECRETS_DIR/development/.secrets.template" <<'EOF'
# Development Environment Secrets
# WARNING: This file contains sensitive information. Do not commit to version control.

# Database Secrets
DATABASE_PASSWORD=dev_db_password
DATABASE_URL=postgresql://dev_user:dev_db_password@localhost:54322/appointmentbooking_dev

# Authentication Secrets
JWT_SECRET=dev_jwt_secret_key_for_development_only
NEXTAUTH_SECRET=dev_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External Service Secrets
GOOGLE_CALENDAR_CLIENT_SECRET=dev_google_client_secret
OUTLOOK_CLIENT_SECRET=dev_outlook_client_secret
STRIPE_SECRET_KEY=sk_test_dev_secret_key
PAYSTACK_SECRET_KEY=sk_test_dev_secret_key

# Email Service Secrets
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SENDGRID_API_KEY=dev_sendgrid_api_key

# Cache Secrets
REDIS_PASSWORD=

# Payment Processing
STRIPE_WEBHOOK_SECRET=whsec_dev_webhook_secret
PAYSTACK_WEBHOOK_SECRET=whsec_dev_webhook_secret

# Development Tools
SENTRY_DSN=
ANALYTICS_API_KEY=
EOF

    # Staging secrets
    cat > "$SECRETS_DIR/staging/.secrets.template" <<'EOF'
# Staging Environment Secrets
# WARNING: This file contains sensitive information. Do not commit to version control.

# Database Secrets
DATABASE_PASSWORD=staging_db_password_secure
DATABASE_URL=postgresql://staging_user:staging_db_password_secure@staging-db.internal:5432/appointmentbooking_staging

# Authentication Secrets
JWT_SECRET=staging_jwt_secret_key_secure
NEXTAUTH_SECRET=staging_nextauth_secret_secure
NEXTAUTH_URL=https://staging.appointmentbooking.co.za

# External Service Secrets
GOOGLE_CALENDAR_CLIENT_SECRET=staging_google_client_secret
OUTLOOK_CLIENT_SECRET=staging_outlook_client_secret
STRIPE_SECRET_KEY=sk_staging_secret_key
PAYSTACK_SECRET_KEY=sk_staging_secret_key

# Email Service Secrets
SMTP_HOST=staging-smtp.internal
SMTP_PORT=587
SMTP_USER=staging_smtp_user
SMTP_PASSWORD=staging_smtp_password
SENDGRID_API_KEY=staging_sendgrid_api_key

# Cache Secrets
REDIS_PASSWORD=staging_redis_password

# Payment Processing
STRIPE_WEBHOOK_SECRET=whsec_staging_webhook_secret
PAYSTACK_WEBHOOK_SECRET=whsec_staging_webhook_secret

# Monitoring
SENTRY_DSN=https://staging-sentry-dsn
ANALYTICS_API_KEY=staging_analytics_key
EOF

    # Production secrets
    cat > "$SECRETS_DIR/production/.secrets.template" <<'EOF'
# Production Environment Secrets
# WARNING: This file contains sensitive information. Do not commit to version control.

# Database Secrets
DATABASE_PASSWORD=PRODUCTION_DB_PASSWORD_FROM_SECURE_VAULT
DATABASE_URL=postgresql://prod_user:PRODUCTION_DB_PASSWORD_FROM_SECURE_VAULT@prod-db.internal:5432/appointmentbooking_prod

# Authentication Secrets
JWT_SECRET=PRODUCTION_JWT_SECRET_FROM_SECURE_VAULT
NEXTAUTH_SECRET=PRODUCTION_NEXTAUTH_SECRET_FROM_SECURE_VAULT
NEXTAUTH_URL=https://appointmentbooking.co.za

# External Service Secrets
GOOGLE_CALENDAR_CLIENT_SECRET=PRODUCTION_GOOGLE_SECRET_FROM_SECURE_VAULT
OUTLOOK_CLIENT_SECRET=PRODUCTION_OUTLOOK_SECRET_FROM_SECURE_VAULT
STRIPE_SECRET_KEY=sk_live_production_secret_key
PAYSTACK_SECRET_KEY=sk_live_production_secret_key

# Email Service Secrets
SMTP_HOST=prod-smtp.internal
SMTP_PORT=587
SMTP_USER=prod_smtp_user
SMTP_PASSWORD=PRODUCTION_SMTP_PASSWORD_FROM_SECURE_VAULT
SENDGRID_API_KEY=PRODUCTION_SENDGRID_API_KEY_FROM_SECURE_VAULT

# Cache Secrets
REDIS_PASSWORD=PRODUCTION_REDIS_PASSWORD_FROM_SECURE_VAULT

# Payment Processing
STRIPE_WEBHOOK_SECRET=whsec_production_webhook_secret
PAYSTACK_WEBHOOK_SECRET=whsec_production_webhook_secret

# Monitoring
SENTRY_DSN=https://production-sentry-dsn
ANALYTICS_API_KEY=PRODUCTION_ANALYTICS_KEY_FROM_SECURE_VAULT
EOF

    log_success "Secrets templates created"
}

# Create service-specific configurations
create_service_configurations() {
    log "Creating service-specific configurations..."
    
    for service in "${SERVICE_TYPES[@]}"; do
        # Database service config
        if [[ "$service" == "database" ]]; then
            cat > "$ENV_DIR/production/$service.conf" <<EOF
# Database Service Configuration
DB_HOST=prod-db.internal
DB_PORT=5432
DB_NAME=appointmentbooking_prod
DB_USER=app_user
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000
DB_SSL_MODE=require
DB_MAX_QUERIES=1000
DB_MAX_CONNECTIONS=100
EOF
        fi
        
        # API service config
        if [[ "$service" == "api" ]]; then
            cat > "$ENV_DIR/production/$service.conf" <<EOF
# API Service Configuration
API_PORT=3000
API_HOST=0.0.0.0
API_RATE_LIMIT=100
API_RATE_WINDOW=900000
API_TIMEOUT=30000
API_COMPRESSION=true
API_CORS_ORIGIN=https://appointmentbooking.co.za
API_JWT_EXPIRY=3600
API_REFRESH_TOKEN_EXPIRY=604800
EOF
        fi
        
        # Web service config
        if [[ "$service" == "web" ]]; then
            cat > "$ENV_DIR/production/$service.conf" <<EOF
# Web Service Configuration
WEB_PORT=80
WEB_SSL_PORT=443
WEB_MAX_BODY_SIZE=10m
WEB_STATIC_CACHE_TIME=31536000
WEB_COMPRESSION_LEVEL=6
WEB_ENABLE_HTTP2=true
WEB_HSTS_MAX_AGE=31536000
EOF
        fi
        
        # Cache service config
        if [[ "$service" == "cache" ]]; then
            cat > "$ENV_DIR/production/$service.conf" <<EOF
# Cache Service Configuration
REDIS_HOST=prod-cache.internal
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=\${REDIS_PASSWORD}
REDIS_TIMEOUT=5000
REDIS_MAX_RETRIES=3
REDIS_KEY_PREFIX=appointmentbooking:
REDIS_DEFAULT_TTL=3600
EOF
        fi
    done
    
    log_success "Service configurations created"
}

# Generate environment validation script
create_env_validator() {
    log "Creating environment validation script..."
    
    cat > /usr/local/bin/validate-environment.sh <<'EOF'
#!/bin/bash
# Environment Validation Script

ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="/var/www/appointmentbooking"
ENV_DIR="/etc/environment/appointmentbooking"
SECRETS_DIR="/etc/secrets/appointmentbooking"

validate_environment() {
    local env_type="$1"
    local errors=0
    
    echo "Validating $env_type environment configuration..."
    
    # Check if environment files exist
    if [[ ! -f "$ENV_DIR/$env_type/.env.template" ]]; then
        echo "❌ Missing environment template: $ENV_DIR/$env_type/.env.template"
        ((errors++))
    fi
    
    if [[ ! -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        echo "❌ Missing secrets template: $SECRETS_DIR/$env_type/.secrets.template"
        ((errors++))
    fi
    
    # Check required variables
    local required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
        "STRIPE_SECRET_KEY"
        "PAYSTACK_SECRET_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "$var" "$SECRETS_DIR/$env_type/.secrets.template" 2>/dev/null; then
            echo "❌ Missing required secret: $var"
            ((errors++))
        fi
    done
    
    # Validate URLs
    local urls=(
        "NEXT_PUBLIC_APP_URL"
        "NEXT_PUBLIC_API_URL"
    )
    
    for url in "${urls[@]}"; do
        if grep -q "$url" "$ENV_DIR/$env_type/.env.template"; then
            local url_value=$(grep "$url" "$ENV_DIR/$env_type/.env.template" | cut -d'=' -f2)
            if [[ ! "$url_value" =~ ^https?:// ]]; then
                echo "❌ Invalid URL format for $url: $url_value"
                ((errors++))
            fi
        fi
    done
    
    # Check file permissions
    if [[ -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        local perms=$(stat -c "%a" "$SECRETS_DIR/$env_type/.secrets.template")
        if [[ "$perms" != "600" ]]; then
            echo "⚠️  Secrets file has incorrect permissions: $perms (should be 600)"
        fi
    fi
    
    if [[ $errors -eq 0 ]]; then
        echo "✅ $env_type environment validation passed"
        return 0
    else
        echo "❌ $env_type environment validation failed with $errors errors"
        return 1
    fi
}

# Main validation
validate_environment "$ENVIRONMENT"
EOF
    
    chmod +x /usr/local/bin/validate-environment.sh
    
    log_success "Environment validation script created"
}

# Create environment loader
create_env_loader() {
    log "Creating environment loader script..."
    
    cat > /usr/local/bin/load-environment.sh <<'EOF'
#!/bin/bash
# Environment Loader Script

ENVIRONMENT="${1:-production}"
SERVICE="${2:-all}"
PROJECT_DIR="/var/www/appointmentbooking"
ENV_DIR="/etc/environment/appointmentbooking"
SECRETS_DIR="/etc/secrets/appointmentbooking"
LOADED_ENV_FILE="/tmp/appointmentbooking_env_loaded"

load_environment() {
    local env_type="$1"
    local service_type="$2"
    
    echo "Loading $env_type environment for $service_type service..."
    
    # Load base environment
    if [[ -f "$ENV_DIR/$env_type/.env.template" ]]; then
        source "$ENV_DIR/$env_type/.env.template"
        echo "✅ Loaded base environment from $ENV_DIR/$env_type/.env.template"
    else
        echo "❌ Environment file not found: $ENV_DIR/$env_type/.env.template"
        return 1
    fi
    
    # Load secrets
    if [[ -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        source "$SECRETS_DIR/$env_type/.secrets.template"
        echo "✅ Loaded secrets from $SECRETS_DIR/$env_type/.secrets.template"
    else
        echo "❌ Secrets file not found: $SECRETS_DIR/$env_type/.secrets.template"
        return 1
    fi
    
    # Load service-specific configuration
    if [[ "$service_type" != "all" && -f "$ENV_DIR/$env_type/$service_type.conf" ]]; then
        source "$ENV_DIR/$env_type/$service_type.conf"
        echo "✅ Loaded service config from $ENV_DIR/$env_type/$service_type.conf"
    fi
    
    # Export all variables
    export $(grep -v '^#' "$ENV_DIR/$env_type/.env.template" | xargs)
    export $(grep -v '^#' "$SECRETS_DIR/$env_type/.secrets.template" | xargs)
    
    # Mark as loaded
    echo "$env_type:$service_type" > "$LOADED_ENV_FILE"
    
    return 0
}

# Get current environment
if [[ -f "$LOADED_ENV_FILE" ]]; then
    current_env=$(cat "$LOADED_ENV_FILE")
    echo "Current environment: $current_env"
fi

# Load specified environment
load_environment "$ENVIRONMENT" "$SERVICE"
EOF
    
    chmod +x /usr/local/bin/load-environment.sh
    
    log_success "Environment loader script created"
}

# Setup secrets rotation
setup_secrets_rotation() {
    log "Setting up secrets rotation system..."
    
    # Create rotation script
    cat > /usr/local/bin/rotate-secrets.sh <<'EOF'
#!/bin/bash
# Secrets Rotation Script

PROJECT_NAME="appointmentbooking"
SECRETS_DIR="/etc/secrets/$PROJECT_NAME"
BACKUP_DIR="/var/backups/secrets"
LOG_FILE="/var/log/secrets-rotation.log"

rotate_secrets() {
    local environment="$1"
    local secret_type="$2"
    local backup_date=$(date +%Y%m%d-%H%M%S)
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting secrets rotation for $environment/$secret_type" >> "$LOG_FILE"
    
    # Create backup
    mkdir -p "$BACKUP_DIR"
    if [[ -f "$SECRETS_DIR/$environment/.secrets.template" ]]; then
        cp "$SECRETS_DIR/$environment/.secrets.template" "$BACKUP_DIR/secrets-$environment-$backup_date.backup"
        echo "✅ Created backup: secrets-$environment-$backup_date.backup"
    fi
    
    # Generate new secrets based on type
    case "$secret_type" in
        "database")
            new_password=$(openssl rand -base64 32)
            sed -i "s/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=$new_password/" "$SECRETS_DIR/$environment/.secrets.template"
            ;;
        "jwt")
            new_jwt=$(openssl rand -base64 64)
            sed -i "s/JWT_SECRET=.*/JWT_SECRET=$new_jwt/" "$SECRETS_DIR/$environment/.secrets.template"
            ;;
        "auth")
            new_secret=$(openssl rand -base64 32)
            sed -i "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$new_secret/" "$SECRETS_DIR/$environment/.secrets.template"
            ;;
        "all")
            # Rotate all secrets
            rotate_secrets "$environment" "database"
            rotate_secrets "$environment" "jwt"
            rotate_secrets "$environment" "auth"
            ;;
    esac
    
    # Set proper permissions
    chmod 600 "$SECRETS_DIR/$environment/.secrets.template"
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Secrets rotation completed for $environment/$secret_type" >> "$LOG_FILE"
}

# Add to crontab for automatic rotation (monthly for production)
(crontab -l 2>/dev/null; echo "0 2 1 * * /usr/local/bin/rotate-secrets.sh production all >> /var/log/secrets-rotation.log 2>&1") | crontab -
EOF
    
    chmod +x /usr/local/bin/rotate-secrets.sh
    
    log_success "Secrets rotation system configured"
}

# Create environment monitoring
create_env_monitoring() {
    log "Creating environment monitoring..."
    
    # Create monitoring script
    cat > /usr/local/bin/monitor-environment.sh <<'EOF'
#!/bin/bash
# Environment Monitoring Script

ENVIRONMENT="${1:-production}"
SECRETS_DIR="/etc/secrets/appointmentbooking"
LOG_FILE="/var/log/environment-monitor.log"

monitor_environment() {
    local env_type="$1"
    local alerts=()
    
    # Check secrets file age
    if [[ -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        local file_age=$(( $(date +%s) - $(stat -c %Y "$SECRETS_DIR/$env_type/.secrets.template") ))
        if [[ $file_age -gt 2592000 ]]; then  # 30 days
            alerts+=("Secrets file is older than 30 days: $SECRETS_DIR/$env_type/.secrets.template")
        fi
    fi
    
    # Check for weak passwords
    if [[ -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        if grep -q "password.*123\|password.*abc\|password.*test" "$SECRETS_DIR/$env_type/.secrets.template"; then
            alerts+=("Weak password detected in secrets file")
        fi
    fi
    
    # Check file permissions
    if [[ -f "$SECRETS_DIR/$env_type/.secrets.template" ]]; then
        local perms=$(stat -c "%a" "$SECRETS_DIR/$env_type/.secrets.template")
        if [[ "$perms" != "600" ]]; then
            alerts+=("Incorrect file permissions on secrets: $perms (should be 600)")
        fi
    fi
    
    # Report results
    if [[ ${#alerts[@]} -eq 0 ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Environment monitoring: No issues found for $env_type" >> "$LOG_FILE"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Environment monitoring alerts for $env_type:" >> "$LOG_FILE"
        for alert in "${alerts[@]}"; do
            echo "  - $alert" >> "$LOG_FILE"
        done
    fi
}

monitor_environment "$ENVIRONMENT"
EOF
    
    chmod +x /usr/local/bin/monitor-environment.sh
    
    # Add to crontab (daily check)
    (crontab -l 2>/dev/null; echo "0 8 * * * /usr/local/bin/monitor-environment.sh production >> /var/log/environment-monitor.log 2>&1") | crontab -
    
    log_success "Environment monitoring configured"
}

# Main execution
main() {
    log "Starting environment and secrets management setup..."
    
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
    
    # Setup directories
    setup_directories
    
    # Generate templates
    generate_environment_templates
    generate_secrets_templates
    
    # Create configurations
    create_service_configurations
    
    # Create utilities
    create_env_validator
    create_env_loader
    
    # Setup rotation and monitoring
    setup_secrets_rotation
    create_env_monitoring
    
    log_success "Environment and secrets management setup completed"
    
    echo ""
    echo "🔧 Environment Management Setup Complete"
    echo "=========================================="
    echo ""
    echo "📁 Configuration files created:"
    echo "  - Environment templates: $ENV_DIR/"
    echo "  - Secrets templates: $SECRETS_DIR/"
    echo "  - Service configurations: $ENV_DIR/production/*.conf"
    echo ""
    echo "🛠️  Utility scripts created:"
    echo "  - validate-environment.sh: Validate environment configuration"
    echo "  - load-environment.sh: Load environment variables"
    echo "  - rotate-secrets.sh: Rotate secrets automatically"
    echo "  - monitor-environment.sh: Monitor environment security"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Review and customize environment templates"
    echo "  2. Replace placeholder secrets with real values"
    echo "  3. Set up secure secret storage (HashiCorp Vault, AWS Secrets Manager, etc.)"
    echo "  4. Configure service-specific settings"
    echo "  5. Set up monitoring and alerting"
    echo ""
    echo "⚠️  Security reminders:"
    echo "  - Never commit secrets to version control"
    echo "  - Use secure secret storage for production"
    echo "  - Regularly rotate secrets"
    echo "  - Monitor for unauthorized access"
}

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Environment Variables and Secrets Management Setup"
    echo ""
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  None required - uses defaults"
    echo ""
    echo "Examples:"
    echo "  $0"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
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