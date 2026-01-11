# Production Rollback Plan

# Appointment Booking System with Enterprise OAuth Integrations

# Created: 2025-12-31T21:14:51.417Z UTC

## 🚨 EMERGENCY ROLLBACK PROCEDURES

### Immediate Rollback Triggers

- Critical security vulnerability detected
- OAuth integration failure affecting >50% of users
- Database corruption or data loss
- Payment processing failures
- SSL certificate compromise
- Compliance violations detected

### Rollback Decision Matrix

| Severity Level | Trigger Condition | Rollback Time | Approval Required |
|----------------|-------------------|---------------|-------------------|
| **CRITICAL** | Security breach, data loss, payment failure | < 5 minutes | DevOps Lead + Security |
| **HIGH** | OAuth failures, database issues | < 15 minutes | DevOps Lead |
| **MEDIUM** | Performance degradation, UI issues | < 30 minutes | DevOps Lead |
| **LOW** | Minor bugs, cosmetic issues | < 2 hours | DevOps Team |

## 🔄 ROLLBACK PROCEDURES

### 1. Application Rollback (Next.js Deployment)

#### Automated Rollback Script

```bash
#!/bin/bash
# /usr/local/bin/emergency-rollback.sh

set -euo pipefail

DEPLOYMENT_VERSION="${1:-previous}"
LOG_FILE="/var/log/emergency-rollback.log"
NOTIFICATION_WEBHOOK="${NOTIFICATION_WEBHOOK_URL:-}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_notification() {
    local message="$1"
    if [[ -n "$NOTIFICATION_WEBHOOK" ]]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"🚨 EMERGENCY ROLLBACK: $message\"}" || true
    fi
}

# Immediate actions
log "EMERGENCY ROLLBACK INITIATED - Version: $DEPLOYMENT_VERSION"
send_notification "Emergency rollback initiated for version $DEPLOYMENT_VERSION"

# 1. Stop current application
systemctl stop appointmentbooking || true

# 2. Backup current deployment
cp -r /var/www/appointmentbooking /var/backups/emergency-rollback-$(date +%Y%m%d-%H%M%S)/

# 3. Restore previous version
if [[ -d "/var/backups/deployments/$DEPLOYMENT_VERSION" ]]; then
    rm -rf /var/www/appointmentbooking
    cp -r "/var/backups/deployments/$DEPLOYMENT_VERSION" /var/www/appointmentbooking
    chown -R www-data:www-data /var/www/appointmentbooking
    log "Successfully restored deployment version: $DEPLOYMENT_VERSION"
else
    log "ERROR: Deployment version $DEPLOYMENT_VERSION not found"
    exit 1
fi

# 4. Restore database (if needed)
if [[ -f "/var/backups/db/emergency-restore.sql" ]]; then
    psql "$DATABASE_URL" < /var/backups/db/emergency-restore.sql
    log "Database restored from backup"
fi

# 5. Restart application
systemctl start appointmentbooking

# 6. Health check
sleep 30
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    log "ROLLBACK SUCCESSFUL - Application is responding"
    send_notification "Emergency rollback completed successfully"
else
    log "ROLLBACK FAILED - Application not responding"
    send_notification "EMERGENCY: Rollback failed, manual intervention required"
    exit 1
fi
```

### 2. Database Rollback Procedures

#### PostgreSQL Point-in-Time Recovery

```sql
-- Emergency database rollback script
-- Run as database superuser

-- 1. Stop application connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'appointmentbooking' 
AND pid != pg_backend_pid();

-- 2. Create emergency backup
\! pg_dump appointmentbooking > /var/backups/db/emergency-pre-rollback-$(date +%Y%m%d-%H%M%S).sql

-- 3. Restore to previous state
\! dropdb appointmentbooking --if-exists
\! createdb appointmentbooking
\! psql appointmentbooking < /var/backups/db/point-in-time-recovery.sql

-- 4. Verify restore
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM calendar_connections;
```

### 3. OAuth Configuration Rollback

#### Reset OAuth Integrations

```bash
#!/bin/bash
# Reset OAuth configurations to previous state

# Google OAuth rollback
update_tenant_config() {
    local tenant_id="$1"
    local config_key="$2"
    local config_value="$3"
    
    psql "$DATABASE_URL" -c "
        UPDATE tenants 
        SET config = jsonb_set(config, '{$config_key}', '\"$config_value\"', true)
        WHERE id = '$tenant_id';
    "
}

# Reset OAuth secrets to previous values
reset_oauth_secrets() {
    local tenant_id="$1"
    
    # Restore previous OAuth configuration
    update_tenant_config "$tenant_id" "google_oauth_client_id" "previous_client_id"
    update_tenant_config "$tenant_id" "microsoft_oauth_client_id" "previous_client_id"
    
    # Clear OAuth tokens
    psql "$DATABASE_URL" -c "
        UPDATE calendar_connections 
        SET access_token = NULL, refresh_token = NULL, token_expires_at = NULL
        WHERE tenant_id = '$tenant_id';
    "
}

log "OAuth configuration rollback completed"
```

### 4. SSL Certificate Rollback

#### Emergency SSL Rollback

```bash
#!/bin/bash
# Emergency SSL certificate rollback

DOMAIN="${DOMAIN:-www.instylehairboutique.co.za}"
SSL_BACKUP_DIR="/var/backups/ssl"

# Rollback to previous certificate
if [[ -f "$SSL_BACKUP_DIR/previous/fullchain.pem" ]]; then
    cp "$SSL_BACKUP_DIR/previous/fullchain.pem" /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem
    cp "$SSL_BACKUP_DIR/previous/privkey.pem" /etc/letsencrypt/live/"$DOMAIN"/privkey.pem
    
    # Reload nginx
    systemctl reload nginx
    
    log "SSL certificate rolled back successfully"
else
    log "ERROR: Previous SSL certificate not found"
    exit 1
fi
```

### 5. Monitoring and Alerting Rollback

#### Disable Enhanced Monitoring

```bash
#!/bin/bash
# Disable enhanced monitoring during rollback

# Temporarily disable alerting
systemctl stop appointmentbooking-monitoring
systemctl disable appointmentbooking-monitoring

# Disable compliance monitoring
export COMPLIANCE_MONITORING_ENABLED=false

# Disable performance monitoring
export PERFORMANCE_MONITORING_ENABLED=false

log "Enhanced monitoring disabled for rollback period"
```

## 📊 ROLLBACK VERIFICATION

### Post-Rollback Checklist

- [ ] Application responds to health checks
- [ ] OAuth integrations functional
- [ ] Database connections established
- [ ] Payment processing operational
- [ ] Calendar sync working
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] Compliance monitoring active
- [ ] All critical endpoints responding
- [ ] User authentication working
- [ ] API rate limiting operational
- [ ] Session management functional

### Automated Verification Script

```bash
#!/bin/bash
# /usr/local/bin/verify-rollback.sh

verify_application() {
    local domain="$1"
    
    # Health check
    if curl -f -s "https://$domain/api/health" > /dev/null; then
        echo "✓ Application health check passed"
    else
        echo "✗ Application health check failed"
        return 1
    fi
    
    # OAuth endpoints
    for endpoint in "google-calendar/status" "outlook-calendar/status" "calendar/sync-status"; do
        if curl -f -s "https://$domain/api/$endpoint" > /dev/null; then
            echo "✓ OAuth endpoint /$endpoint responding"
        else
            echo "✗ OAuth endpoint /$endpoint failed"
        fi
    done
    
    # Database connectivity
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✓ Database connectivity verified"
    else
        echo "✗ Database connectivity failed"
    fi
    
    # SSL certificate
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates > /dev/null; then
        echo "✓ SSL certificate valid"
    else
        echo "✗ SSL certificate validation failed"
    fi
    
    echo "Rollback verification completed"
}
```

## 🔔 NOTIFICATION PROCEDURES

### Stakeholder Communication

```bash
#!/bin/bash
# /usr/local/bin/notify-stakeholders.sh

send_stakeholder_notification() {
    local severity="$1"
    local message="$2"
    local timestamp=$(date)
    
    # Email notifications
    echo "Subject: [$severity] Appointment Booking System - $message
    
    Timestamp: $timestamp
    Severity: $severity
    Message: $message
    System: Appointment Booking System
    Domain: $DOMAIN
    
    Please refer to the rollback documentation for details.
    " | mail -s "[$severity] System Notification" stakeholders@company.com
    
    # Slack notification
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"text\": \"🚨 $severity: $message\",
            \"channel\": \"#operations\",
            \"username\": \"System Monitor\"
        }" || true
    
    # SMS alert for critical issues
    if [[ "$severity" == "CRITICAL" ]]; then
        curl -X POST "$SMS_WEBHOOK_URL" \
            -d "message=CRITICAL: $message" || true
    fi
}
```

## 📋 ROLLBACK DOCUMENTATION

### Post-Incident Report Template

```markdown
# Incident Report - Emergency Rollback

**Date/Time:** [Timestamp]
**Incident ID:** [Generated ID]
**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
**Duration:** [Total time]

## Incident Summary
[Description of what happened]

## Trigger
[What caused the rollback]

## Actions Taken
- [ ] Application rollback executed
- [ ] Database rollback (if applicable)
- [ ] OAuth configuration reset
- [ ] SSL certificate rollback (if applicable)
- [ ] Stakeholders notified
- [ ] Verification completed

## Resolution Time
[Time from incident detection to resolution]

## Lessons Learned
[What can be improved]

## Follow-up Actions
[Required follow-up tasks]
```

## 🎯 DEPLOYMENT WINDOW MANAGEMENT

### Maintenance Window Procedures

```bash
#!/bin/bash
# /usr/local/bin/maintenance-window.sh

enter_maintenance_mode() {
    log "Entering maintenance mode..."
    
    # Set maintenance mode
    export MAINTENANCE_MODE=true
    
    # Disable new bookings
    curl -X POST "https://$DOMAIN/api/maintenance/disable-bookings"
    
    # Notify users
    curl -X POST "https://$DOMAIN/api/maintenance/notify-users"
    
    # Create maintenance page
    cp /var/www/maintenance.html /var/www/appointmentbooking/
    
    log "Maintenance mode activated"
}

exit_maintenance_mode() {
    log "Exiting maintenance mode..."
    
    # Disable maintenance mode
    export MAINTENANCE_MODE=false
    
    # Enable new bookings
    curl -X POST "https://$DOMAIN/api/maintenance/enable-bookings"
    
    # Remove maintenance page
    rm -f /var/www/appointmentbooking/maintenance.html
    
    log "Maintenance mode deactivated"
}
```

## 📞 ESCALATION CONTACTS

| Role | Contact | Phone | Email |
|------|---------|--------|-------|
| DevOps Lead | [Name] | [Phone] | <devops@company.com> |
| Security Lead | [Name] | [Phone] | <security@company.com> |
| Database Admin | [Name] | [Phone] | <dba@company.com> |
| Infrastructure | [Name] | [Phone] | <infrastructure@company.com> |
| Business Owner | [Name] | [Phone] | <business@company.com> |

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-31T21:14:51.417Z UTC  
**Next Review:** 2026-01-31  
**Owner:** DevOps Team  
**Approval:** Security Lead + Business Owner
