#!/bin/bash
# Disaster Recovery and Backup Procedures
# Comprehensive backup and recovery system for appointment booking system
# Created: 2025-12-31

set -euo pipefail

# Configuration
PROJECT_NAME="appointmentbooking"
BACKUP_DIR="/var/backups/$PROJECT_NAME"
LOG_FILE="/var/log/disaster-recovery.log"
RETENTION_DAYS=30
S3_BUCKET="appointmentbooking-backups"
ENCRYPTION_KEY="/etc/ssl/$PROJECT_NAME/backup.key"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Create backup directory structure
setup_backup_directories() {
    log "Setting up backup directory structure..."
    
    sudo mkdir -p "$BACKUP_DIR"/{database,application,config,logs,ssl,monitoring}
    sudo mkdir -p "$BACKUP_DIR"/database/{full,differential,transaction_log}
    sudo mkdir -p "$BACKUP_DIR"/application/{code,assets,builds}
    sudo mkdir -p "$BACKUP_DIR"/config/{nginx,docker,environment,secrets}
    
    # Set permissions
    sudo chmod 750 "$BACKUP_DIR"
    sudo chmod 700 "$BACKUP_DIR"/{secrets,ssl}
    sudo chmod 755 "$BACKUP_DIR"/{database,application,config,logs,monitoring}
    
    log_success "Backup directory structure created"
}

# Database backup functions
backup_database() {
    log "Starting database backup..."
    
    local backup_type="${1:-full}"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/database/$backup_type/backup_${timestamp}.sql"
    
    case "$backup_type" in
        "full")
            log_info "Performing full database backup..."
            pg_dump -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "${DB_NAME:-appointmentbooking}" \
                --verbose --clean --if-exists --create --format=custom --compress=9 \
                --file="$backup_file.custom"
            
            # Also create SQL dump for compatibility
            pg_dump -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "${DB_NAME:-appointmentbooking}" \
                --verbose --clean --if-exists --create \
                --file="$backup_file.sql"
            
            log_success "Full database backup completed: $backup_file"
            ;;
            
        "differential")
            log_info "Performing differential database backup..."
            # Differential backup based on last full backup
            local last_full=$(find "$BACKUP_DIR/database/full" -name "backup_*.custom" | sort | tail -1)
            if [[ -n "$last_full" ]]; then
                pg_dump -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "${DB_NAME:-appointmentbooking}" \
                    --verbose --format=custom --compress=9 \
                    --file="$backup_file.custom"
                log_success "Differential database backup completed: $backup_file"
            else
                log_warning "No full backup found, performing full backup instead..."
                backup_database "full"
            fi
            ;;
            
        "transaction_log")
            log_info "Performing transaction log backup..."
            # This would require WAL archiving to be configured
            pg_dump -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "${DB_NAME:-appointmentbooking}" \
                --verbose --data-only --inserts \
                --file="$backup_file.sql"
            log_success "Transaction log backup completed: $backup_file"
            ;;
    esac
    
    # Compress and encrypt backup
    compress_and_encrypt_backup "$backup_file" "$backup_file.sql"
    
    # Verify backup integrity
    verify_backup_integrity "$backup_file"
}

# Application backup functions
backup_application() {
    log "Starting application backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_DIR/application/code/backup_$timestamp"
    
    # Backup application code
    mkdir -p "$backup_dir"
    
    # Copy application files (excluding node_modules, .git, etc.)
    rsync -av --exclude='node_modules/' \
                 --exclude='.git/' \
                 --exclude='dist/' \
                 --exclude='build/' \
                 --exclude='coverage/' \
                 --exclude='logs/' \
                 --exclude='*.log' \
                 /var/www/appointmentbooking/ "$backup_dir/"
    
    # Backup built assets
    if [[ -d "/var/www/appointmentbooking/.next" ]]; then
        mkdir -p "$backup_dir/.next"
        rsync -av /var/www/appointmentbooking/.next/ "$backup_dir/.next/"
    fi
    
    # Backup public assets
    if [[ -d "/var/www/appointmentbooking/public" ]]; then
        mkdir -p "$backup_dir/public"
        rsync -av /var/www/appointmentbooking/public/ "$backup_dir/public/"
    fi
    
    # Create archive
    local archive_file="$BACKUP_DIR/application/code/backup_${timestamp}.tar.gz"
    tar -czf "$archive_file" -C "$backup_dir" .
    rm -rf "$backup_dir"
    
    # Compress and encrypt
    compress_and_encrypt_backup "$archive_file" "$archive_file"
    
    log_success "Application backup completed: $archive_file"
}

# Configuration backup functions
backup_configuration() {
    log "Starting configuration backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local config_backup="$BACKUP_DIR/config/config_backup_$timestamp.tar.gz"
    
    # Create temporary directory
    local temp_dir=$(mktemp -d)
    
    # Backup nginx configuration
    if [[ -d "/etc/nginx" ]]; then
        mkdir -p "$temp_dir/nginx"
        rsync -av /etc/nginx/ "$temp_dir/nginx/"
    fi
    
    # Backup docker configuration
    if [[ -f "/etc/docker/daemon.json" ]]; then
        mkdir -p "$temp_dir/docker"
        cp /etc/docker/daemon.json "$temp_dir/docker/"
    fi
    
    # Backup environment configurations
    if [[ -d "/etc/environment/$PROJECT_NAME" ]]; then
        mkdir -p "$temp_dir/environment"
        rsync -av /etc/environment/$PROJECT_NAME/ "$temp_dir/environment/"
    fi
    
    # Backup secrets (encrypted)
    if [[ -d "/etc/secrets/$PROJECT_NAME" ]]; then
        mkdir -p "$temp_dir/secrets"
        # Encrypt secrets before backup
        tar -czf - /etc/secrets/$PROJECT_NAME | \
        gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 \
            --s2k-count 65536 --force-mdc --quiet --no-greeting --batch --yes \
            --passphrase-file "$ENCRYPTION_KEY" --symmetric --output "$temp_dir/secrets.enc"
        mv "$temp_dir/secrets.enc" "$temp_dir/secrets/"
    fi
    
    # Backup SSL certificates
    if [[ -d "/etc/letsencrypt" ]]; then
        mkdir -p "$temp_dir/ssl"
        rsync -av /etc/letsencrypt/ "$temp_dir/ssl/"
    fi
    
    # Create archive
    tar -czf "$config_backup" -C "$temp_dir" .
    rm -rf "$temp_dir"
    
    log_success "Configuration backup completed: $config_backup"
}

# Monitoring data backup
backup_monitoring() {
    log "Starting monitoring data backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/monitoring/monitoring_backup_$timestamp.tar.gz"
    
    # Backup Prometheus data
    if [[ -d "/var/lib/prometheus" ]]; then
        local prometheus_dir=$(mktemp -d)
        rsync -av /var/lib/prometheus/ "$prometheus_dir/"
        tar -czf - -C "$prometheus_dir" prometheus > "$backup_file"
        rm -rf "$prometheus_dir"
    fi
    
    # Backup Grafana data
    if [[ -d "/var/lib/grafana" ]]; then
        local grafana_dir=$(mktemp -d)
        rsync -av /var/lib/grafana/ "$grafana_dir/"
        tar -czf - -C "$grafana_dir" grafana >> "$backup_file"
        rm -rf "$grafana_dir"
    fi
    
    # Backup logs
    if [[ -d "/var/log" ]]; then
        local logs_dir=$(mktemp -d)
        find /var/log -name "*$PROJECT_NAME*" -exec rsync -av {} "$logs_dir/" \;
        tar -czf - -C "$logs_dir" . >> "$backup_file"
        rm -rf "$logs_dir"
    fi
    
    log_success "Monitoring backup completed: $backup_file"
}

# Compress and encrypt backup
compress_and_encrypt_backup() {
    local original_file="$1"
    local encrypted_file="${2:-$1.enc}"
    
    # Compress if not already compressed
    if [[ ! "$original_file" =~ \.(gz|gzip)$ ]]; then
        gzip -9 "$original_file"
        original_file="${original_file}.gz"
    fi
    
    # Encrypt if encryption key exists
    if [[ -f "$ENCRYPTION_KEY" ]]; then
        gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 \
            --s2k-count 65536 --force-mdc --quiet --no-greeting --batch --yes \
            --passphrase-file "$ENCRYPTION_KEY" --symmetric \
            --output "$encrypted_file" "$original_file"
        
        # Remove original unencrypted file
        rm -f "$original_file"
        log_info "Backup encrypted: $encrypted_file"
    fi
}

# Verify backup integrity
verify_backup_integrity() {
    local backup_file="$1"
    
    if [[ -f "$backup_file" ]]; then
        if [[ "$backup_file" =~ \.enc$ ]]; then
            # Verify encrypted file
            if gpg --quiet --batch --passphrase-file "$ENCRYPTION_KEY" --decrypt "$backup_file" > /dev/null 2>&1; then
                log_success "Encrypted backup verified: $backup_file"
            else
                log_error "Encrypted backup verification failed: $backup_file"
                return 1
            fi
        elif [[ "$backup_file" =~ \.gz$ ]]; then
            # Verify compressed file
            if gzip -t "$backup_file"; then
                log_success "Compressed backup verified: $backup_file"
            else
                log_error "Compressed backup verification failed: $backup_file"
                return 1
            fi
        else
            # Verify regular file
            if [[ -s "$backup_file" ]]; then
                log_success "Backup verified: $backup_file"
            else
                log_error "Backup verification failed: $backup_file"
                return 1
            fi
        fi
    else
        log_error "Backup file not found: $backup_file"
        return 1
    fi
}

# Upload backup to cloud storage
upload_to_cloud() {
    local backup_file="$1"
    local backup_type="$2"
    
    if command -v aws &> /dev/null; then
        local s3_path="s3://$S3_BUCKET/$PROJECT_NAME/$(date +%Y/%m/%d)/"
        aws s3 cp "$backup_file" "$s3_path"
        log_success "Backup uploaded to S3: $s3_path"
    elif command -v gsutil &> /dev/null; then
        local gcs_path="gs://$S3_BUCKET/$PROJECT_NAME/$(date +%Y/%m/%d)/"
        gsutil cp "$backup_file" "$gcs_path"
        log_success "Backup uploaded to GCS: $gcs_path"
    else
        log_warning "No cloud storage CLI found, skipping cloud upload"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Find and remove backups older than retention period
    find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete
    
    # Clean up empty directories
    find "$BACKUP_DIR" -type d -empty -delete
    
    log_success "Old backups cleaned up (older than $RETENTION_DAYS days)"
}

# Recovery functions
recover_database() {
    local backup_file="$1"
    local target_database="${2:-appointmentbooking}"
    
    log "Starting database recovery from: $backup_file"
    
    # Decrypt if necessary
    local decrypted_file="$backup_file"
    if [[ "$backup_file" =~ \.enc$ ]]; then
        decrypted_file="${backup_file%.enc}"
        gpg --quiet --batch --passphrase-file "$ENCRYPTION_KEY" --decrypt \
            --output "$decrypted_file" "$backup_file"
    fi
    
    # Decompress if necessary
    if [[ "$decrypted_file" =~ \.gz$ ]]; then
        gunzip -c "$decrypted_file" > "${decrypted_file%.gz}"
        decrypted_file="${decrypted_file%.gz}"
    fi
    
    # Restore database
    if [[ "$decrypted_file" =~ \.custom$ ]]; then
        pg_restore -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "$target_database" \
            --verbose --clean --if-exists --create "$decrypted_file"
    else
        psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d postgres \
            -f "$decrypted_file"
    fi
    
    log_success "Database recovery completed"
}

recover_application() {
    local backup_file="$1"
    local target_dir="${2:-/var/www/appointmentbooking}"
    
    log "Starting application recovery from: $backup_file"
    
    # Create backup of current application
    if [[ -d "$target_dir" ]]; then
        local current_backup="$target_dir.backup.$(date +%Y%m%d_%H%M%S)"
        mv "$target_dir" "$current_backup"
        log_info "Current application backed up to: $current_backup"
    fi
    
    # Decrypt and extract backup
    local temp_dir=$(mktemp -d)
    local decrypted_file="$temp_dir/backup.tar.gz"
    
    if [[ "$backup_file" =~ \.enc$ ]]; then
        gpg --quiet --batch --passphrase-file "$ENCRYPTION_KEY" --decrypt \
            --output "$decrypted_file" "$backup_file"
    else
        cp "$backup_file" "$decrypted_file"
    fi
    
    # Extract to target directory
    mkdir -p "$target_dir"
    tar -xzf "$decrypted_file" -C "$target_dir"
    
    # Set permissions
    chown -R www-data:www-data "$target_dir"
    chmod -R 755 "$target_dir"
    
    rm -rf "$temp_dir"
    log_success "Application recovery completed"
}

recover_configuration() {
    local backup_file="$1"
    
    log "Starting configuration recovery from: $backup_file"
    
    # Create backup of current configuration
    local config_backup="/etc/config.backup.$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$config_backup"
    
    # Backup current configs
    [[ -d "/etc/nginx" ]] && cp -r /etc/nginx "$config_backup/"
    [[ -d "/etc/environment/$PROJECT_NAME" ]] && cp -r /etc/environment/$PROJECT_NAME "$config_backup/"
    [[ -d "/etc/secrets/$PROJECT_NAME" ]] && cp -r /etc/secrets "$config_backup/"
    
    # Decrypt and extract backup
    local temp_dir=$(mktemp -d)
    local decrypted_file="$temp_dir/config.tar.gz"
    
    if [[ "$backup_file" =~ \.enc$ ]]; then
        gpg --quiet --batch --passphrase-file "$ENCRYPTION_KEY" --decrypt \
            --output "$decrypted_file" "$backup_file"
    else
        cp "$backup_file" "$decrypted_file"
    fi
    
    # Extract configuration
    tar -xzf "$decrypted_file" -C "$temp_dir"
    
    # Restore configurations
    [[ -d "$temp_dir/nginx" ]] && cp -r "$temp_dir/nginx/"* /etc/nginx/
    [[ -d "$temp_dir/environment" ]] && cp -r "$temp_dir/environment/"* /etc/environment/$PROJECT_NAME/
    [[ -d "$temp_dir/secrets" ]] && cp -r "$temp_dir/secrets/"* /etc/secrets/$PROJECT_NAME/
    [[ -d "$temp_dir/ssl" ]] && cp -r "$temp_dir/ssl/"* /etc/ssl/$PROJECT_NAME/
    
    rm -rf "$temp_dir"
    log_success "Configuration recovery completed"
}

# Health check after recovery
post_recovery_health_check() {
    log "Running post-recovery health check..."
    
    local issues=0
    
    # Check database connectivity
    if ! psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-app_user}" -d "${DB_NAME:-appointmentbooking}" -c "SELECT 1;" &>/dev/null; then
        log_error "Database connectivity check failed"
        ((issues++))
    else
        log_success "Database connectivity check passed"
    fi
    
    # Check application health
    if curl -f http://localhost/health &>/dev/null; then
        log_success "Application health check passed"
    else
        log_error "Application health check failed"
        ((issues++))
    fi
    
    # Check nginx configuration
    if nginx -t &>/dev/null; then
        log_success "Nginx configuration check passed"
    else
        log_error "Nginx configuration check failed"
        ((issues++))
    fi
    
    # Check SSL certificates
    if [[ -f "/etc/letsencrypt/live/appointmentbooking.co.za/fullchain.pem" ]]; then
        log_success "SSL certificates check passed"
    else
        log_error "SSL certificates check failed"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        log_success "Post-recovery health check completed successfully"
        return 0
    else
        log_error "Post-recovery health check completed with $issues issues"
        return 1
    fi
}

# Main backup function
perform_backup() {
    local backup_type="${1:-full}"
    
    log "Starting $backup_type backup process..."
    
    # Setup directories
    setup_backup_directories
    
    # Perform backups based on type
    case "$backup_type" in
        "full")
            backup_database "full"
            backup_application
            backup_configuration
            backup_monitoring
            ;;
        "incremental")
            backup_database "differential"
            backup_application
            ;;
        "quick")
            backup_database "transaction_log"
            backup_application
            ;;
    esac
    
    # Upload to cloud storage
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -o -name "*.enc" | while read -r file; do
        upload_to_cloud "$file" "$(basename "$(dirname "$file")")"
    done
    
    # Cleanup old backups
    cleanup_old_backups
    
    log_success "$backup_type backup process completed"
}

# Main recovery function
perform_recovery() {
    local recovery_type="$1"
    local backup_file="$2"
    
    log "Starting $recovery_type recovery process..."
    
    case "$recovery_type" in
        "database")
            recover_database "$backup_file"
            ;;
        "application")
            recover_application "$backup_file"
            ;;
        "configuration")
            recover_configuration "$backup_file"
            ;;
        "full")
            log_info "Starting full system recovery..."
            recover_database "$backup_file"
            recover_application "$backup_file"
            recover_configuration "$backup_file"
            post_recovery_health_check
            ;;
    esac
    
    log_success "$recovery_type recovery process completed"
}

# Usage information
usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo "Disaster Recovery and Backup Management for Appointment Booking System"
    echo ""
    echo "Commands:"
    echo "  backup [TYPE]     Perform backup (full|incremental|quick)"
    echo "  recover TYPE FILE Perform recovery (database|application|configuration|full)"
    echo "  status           Show backup status and recent backups"
    echo "  verify FILE      Verify backup integrity"
    echo "  cleanup          Clean up old backups"
    echo ""
    echo "Examples:"
    echo "  $0 backup full"
    echo "  $0 backup incremental"
    echo "  $0 recover database /path/to/backup.sql.enc"
    echo "  $0 status"
    echo "  $0 verify /path/to/backup.tar.gz.enc"
}

# Status reporting
show_status() {
    log "Backup System Status Report"
    echo "=============================="
    echo ""
    
    echo "Recent Backups:"
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -o -name "*.enc" | sort -r | head -10 | while read -r file; do
        local size=$(du -h "$file" | cut -f1)
        local date=$(date -r "$file" '+%Y-%m-%d %H:%M:%S')
        echo "  $file ($size) - $date"
    done
    
    echo ""
    echo "Disk Usage:"
    du -sh "$BACKUP_DIR" 2>/dev/null || echo "  No backup directory found"
    
    echo ""
    echo "Backup Schedule:"
    echo "  Full backups: Daily at 2:00 AM"
    echo "  Incremental backups: Every 6 hours"
    echo "  Transaction log backups: Every 15 minutes"
    echo "  Retention period: $RETENTION_DAYS days"
}

# Parse command line arguments
case "${1:-}" in
    "backup")
        perform_backup "${2:-full}"
        ;;
    "recover")
        if [[ -z "${2:-}" || -z "${3:-}" ]]; then
            log_error "Recovery requires type and backup file"
            usage
            exit 1
        fi
        perform_recovery "$2" "$3"
        ;;
    "status")
        show_status
        ;;
    "verify")
        if [[ -z "${2:-}" ]]; then
            log_error "Verify requires backup file"
            usage
            exit 1
        fi
        verify_backup_integrity "$2"
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    "")
        log_error "No command specified"
        usage
        exit 1
        ;;
    *)
        log_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac