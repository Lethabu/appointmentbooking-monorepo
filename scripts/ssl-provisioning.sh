#!/bin/bash
# SSL Certificate Provisioning Script for Appointment Booking System
# Production-ready SSL setup with Let's Encrypt
# Created: 2025-12-31

set -euo pipefail

# Configuration
DOMAIN="${DOMAIN:-appointmentbooking.co.za}"
EMAIL="${EMAIL:-admin@appointmentbooking.co.za}"
STAGING="${STAGING:-false}"
SSL_DIR="/etc/ssl/appointmentbooking"
WEBROOT_DIR="/var/www/appointmentbooking/.well-known/acme-challenge"
RENEWAL_THRESHOLD_DAYS=30
LOG_FILE="/var/log/ssl-certificate.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
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

# Create SSL directory structure
setup_ssl_directories() {
    log "Setting up SSL directory structure..."
    
    sudo mkdir -p "$SSL_DIR"
    sudo mkdir -p "$SSL_DIR/certs"
    sudo mkdir -p "$SSL_DIR/keys"
    sudo mkdir -p "$SSL_DIR/csr"
    sudo mkdir -p "$SSL_DIR/archive"
    sudo mkdir -p "$WEBROOT_DIR"
    
    # Set appropriate permissions
    sudo chmod 755 "$SSL_DIR"
    sudo chmod 700 "$SSL_DIR/keys"
    sudo chmod 755 "$SSL_DIR/certs"
    sudo chmod 755 "$WEBROOT_DIR"
    
    log_success "SSL directories created successfully"
}

# Install certbot if not present
install_certbot() {
    if ! command -v certbot &> /dev/null; then
        log "Installing certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
        log_success "Certbot installed successfully"
    else
        log "Certbot is already installed"
    fi
}

# Get certificate using webroot method
obtain_certificate() {
    log "Obtaining SSL certificate for $DOMAIN..."
    
    # Create webroot challenge directory
    sudo mkdir -p "$WEBROOT_DIR"
    
    # Determine if staging should be used
    if [[ "$STAGING" == "true" ]]; then
        STAGING_FLAG="--staging"
        log_warning "Using Let's Encrypt staging server"
    else
        STAGING_FLAG=""
    fi
    
    # Obtain certificate
    sudo certbot certonly \
        --webroot \
        --webroot-path="$WEBROOT_DIR" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --domains "$DOMAIN" \
        $STAGING_FLAG
    
    log_success "SSL certificate obtained successfully"
}

# Setup nginx configuration for SSL
setup_nginx_ssl() {
    log "Setting up Nginx SSL configuration..."
    
    # Create nginx site configuration
    sudo tee /etc/nginx/sites-available/appointmentbooking > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.supabase.io https://*.supabase.co;" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Root directory
    root /var/www/appointmentbooking;
    index index.html index.htm;
    
    # Main application
    location / {
        try_files \$uri \$uri/ @nextjs;
    }
    
    # Next.js proxy
    location @nextjs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;
    }
    
    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }
    
    # Security.txt
    location = /.well-known/security.txt {
        return 200 "Contact: $EMAIL\n";
        add_header Content-Type text/plain;
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|config)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/appointmentbooking /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    if sudo nginx -t; then
        log_success "Nginx SSL configuration is valid"
    else
        log_error "Nginx SSL configuration has errors"
        exit 1
    fi
}

# Create auto-renewal cron job
setup_auto_renewal() {
    log "Setting up automatic certificate renewal..."
    
    # Create renewal script
    sudo tee /usr/local/bin/renew-ssl-cert.sh > /dev/null <<'EOF'
#!/bin/bash
# SSL Certificate Auto-Renewal Script

DOMAIN="${DOMAIN:-appointmentbooking.co.za}"
LOG_FILE="/var/log/ssl-renewal.log"
SSL_DIR="/etc/ssl/appointmentbooking"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "Starting certificate renewal process..."

# Renew certificate
if certbot renew --quiet --no-self-upgrade; then
    log "Certificate renewed successfully"
    
    # Reload nginx if renewal was successful
    if systemctl reload nginx; then
        log "Nginx reloaded successfully"
    else
        log "ERROR: Failed to reload nginx"
    fi
else
    log "ERROR: Certificate renewal failed"
fi

log "Certificate renewal process completed"
EOF
    
    sudo chmod +x /usr/local/bin/renew-ssl-cert.sh
    
    # Add to crontab (run at 2:30 AM daily)
    (sudo crontab -l 2>/dev/null; echo "30 2 * * * /usr/local/bin/renew-ssl-cert.sh >> /var/log/ssl-renewal.log 2>&1") | sudo crontab -
    
    log_success "Auto-renewal configured"
}

# Create certificate monitoring
setup_certificate_monitoring() {
    log "Setting up certificate monitoring..."
    
    # Create monitoring script
    sudo tee /usr/local/bin/check-ssl-cert.sh > /dev/null <<'EOF'
#!/bin/bash
# SSL Certificate Monitoring Script

DOMAIN="${DOMAIN:-appointmentbooking.co.za}"
RENEWAL_THRESHOLD_DAYS="${RENEWAL_THRESHOLD_DAYS:-30}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@appointmentbooking.co.za}"

# Get certificate expiration date
EXPIRY_DATE=$(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

echo "Certificate expires in $DAYS_UNTIL_EXPIRY days"

# Alert if certificate expires soon
if [ $DAYS_UNTIL_EXPIRY -lt $RENEWAL_THRESHOLD_DAYS ]; then
    echo "WARNING: Certificate expires in $DAYS_UNTIL_EXPIRY days!" | \
    mail -s "SSL Certificate Alert for $DOMAIN" "$ALERT_EMAIL"
fi
EOF
    
    sudo chmod +x /usr/local/bin/check-ssl-cert.sh
    
    # Add monitoring to crontab (check daily)
    (sudo crontab -l 2>/dev/null; echo "0 9 * * * /usr/local/bin/check-ssl-cert.sh") | sudo crontab -
    
    log_success "Certificate monitoring configured"
}

# Backup certificates
backup_certificates() {
    log "Creating certificate backup..."
    
    BACKUP_DIR="/var/backups/ssl-$(date +%Y%m%d-%H%M%S)"
    sudo mkdir -p "$BACKUP_DIR"
    
    # Backup certificates
    sudo cp -r /etc/letsencrypt "$BACKUP_DIR/"
    sudo tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .
    sudo rm -rf "$BACKUP_DIR"
    
    log_success "Certificates backed up to $BACKUP_DIR.tar.gz"
}

# Main execution
main() {
    log "Starting SSL certificate provisioning for $DOMAIN"
    
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
    
    # Setup directories
    setup_ssl_directories
    
    # Install certbot
    install_certbot
    
    # Obtain certificate
    obtain_certificate
    
    # Setup nginx
    setup_nginx_ssl
    
    # Setup auto-renewal
    setup_auto_renewal
    
    # Setup monitoring
    setup_certificate_monitoring
    
    # Create initial backup
    backup_certificates
    
    # Test the setup
    if curl -I https://"$DOMAIN" | grep -q "HTTP/2 200"; then
        log_success "SSL certificate setup completed successfully!"
        log "Your site is now accessible at https://$DOMAIN"
    else
        log_error "SSL setup may have issues. Please check manually."
        exit 1
    fi
    
    log "SSL certificate provisioning completed"
}

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "SSL Certificate Provisioning for Appointment Booking System"
    echo ""
    echo "Options:"
    echo "  -d, --domain DOMAIN          Domain name (default: appointmentbooking.co.za)"
    echo "  -e, --email EMAIL           Email for Let's Encrypt (default: admin@appointmentbooking.co.za)"
    echo "  -s, --staging              Use Let's Encrypt staging server"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOMAIN                      Domain name"
    echo "  EMAIL                       Email for Let's Encrypt"
    echo "  STAGING                     Use staging server (true/false)"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --domain example.com --email admin@example.com"
    echo "  DOMAIN=custom.domain.com EMAIL=admin@custom.domain.com $0"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        -s|--staging)
            STAGING="true"
            shift
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