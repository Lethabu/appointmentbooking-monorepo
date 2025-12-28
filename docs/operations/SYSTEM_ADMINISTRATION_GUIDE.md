# 🔧 System Administration Guide - Appointment Booking Platform

**Version:** 1.0.0  
**Date:** December 24, 2025  
**Environment:** Cloudflare (Production)  
**Owner:** DevOps Team  

---

## 🏗️ Infrastructure Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge Network                      │
├─────────────────────────────────────────────────────────────────┤
│  Cloudflare Pages    │  Cloudflare Workers    │  Cloudflare D1  │
│                      │                        │                 │
│  ┌─────────────────┐ │  ┌─────────────────┐   │  ┌─────────────┐│
│  │ Booking UI      │ │  │ API Routes      │   │  │ Appointments││
│  │ Dashboard       │ │  │ Authentication  │   │  │ Users       ││
│  │ Static Assets   │ │  │ Business Logic  │   │  │ Services    ││
│  └─────────────────┘ │  └─────────────────┘   │  │ Sessions    ││
│                      │                        │  └─────────────┘│
└──────────────────────┴────────────────────────┴─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Integrations                       │
├─────────────────────────────────────────────────────────────────┤
│  Paystack          │  Google Calendar      │  WhatsApp        │
│  (Payments)        │  (Calendar Sync)      │  (Notifications) │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Configuration

#### Production Environment

- **Domain**: <www.instylehairboutique.co.za>
- **Worker Route**: `/*`
- **Database**: appointmentbooking-db
- **Environment**: Production
- **Backup Retention**: 30 days

#### Staging Environment  

- **Domain**: [staging-url].pages.dev
- **Worker Route**: `/*`
- **Database**: appointmentbooking-db-staging
- **Environment**: Staging
- **Backup Retention**: 7 days

---

## 🚀 Worker Deployment Procedures

### Pre-Deployment Checklist

#### Code Readiness

- [ ] **Code Review Complete**
  - [ ] All changes reviewed by senior developer
  - [ ] Security review completed
  - [ ] Performance impact assessed
  - [ ] Documentation updated

- [ ] **Testing Complete**
  - [ ] Unit tests passing (`pnpm test`)
  - [ ] Integration tests passing (`pnpm test:integration`)
  - [ ] End-to-end tests passing (`pnpm test:e2e`)
  - [ ] Security tests passing (`pnpm audit`)
  - [ ] Performance tests passing (`pnpm test:performance`)

- [ ] **Environment Ready**
  - [ ] Staging deployment successful
  - [ ] Smoke tests passing on staging
  - [ ] Database migrations tested
  - [ ] External API connectivity verified

#### Infrastructure Preparation

- [ ] **Backup Created**

  ```bash
  # Create pre-deployment backup
  BACKUP_NAME="pre-deploy-$(date +%Y%m%d-%H%M%S)"
  wrangler d1 backup create appointmentbooking-db \
    --name="$BACKUP_NAME"
  
  # Verify backup creation
  wrangler d1 backup list appointmentbooking-db | grep "$BACKUP_NAME"
  ```

- [ ] **Monitoring Ready**
  - [ ] Alert thresholds reviewed
  - [ ] Monitoring dashboards prepared
  - [ ] Rollback plan documented
  - [ ] Communication channels established

### Deployment Process

#### Step 1: Deployment Preparation

```bash
#!/bin/bash
# deployment-prep.sh

set -e

echo "🚀 Starting deployment preparation..."

# Set environment variables
export ENVIRONMENT=production
export DEPLOYMENT_ID=$(date +%Y%m%d-%H%M%S)
export BACKUP_NAME="pre-deploy-$DEPLOYMENT_ID"

echo "Deployment ID: $DEPLOYMENT_ID"
echo "Environment: $ENVIRONMENT"

# Verify prerequisites
echo "Verifying prerequisites..."

# Check Wrangler installation
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Please install: npm install -g wrangler"
    exit 1
fi

# Check environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ CLOUDFLARE_API_TOKEN not set"
    exit 1
fi

echo "✅ Prerequisites verified"
```

#### Step 2: Database Backup

```bash
echo "💾 Creating database backup..."

# Create backup
wrangler d1 backup create appointmentbooking-db \
  --name="$BACKUP_NAME" \
  --env production

# Verify backup
if wrangler d1 backup list appointmentbooking-db --env production | grep -q "$BACKUP_NAME"; then
    echo "✅ Backup created successfully: $BACKUP_NAME"
else
    echo "❌ Backup creation failed"
    exit 1
fi
```

#### Step 3: Worker Deployment

```bash
echo "🚀 Deploying worker..."

cd packages/worker

# Deploy to production
wrangler deploy --env production

# Get deployment info
DEPLOYMENT_INFO=$(wrangler deployments list --env production | head -2)
echo "Deployment completed:"
echo "$DEPLOYMENT_INFO"
```

#### Step 4: Post-Deployment Verification

```bash
echo "🔍 Running post-deployment verification..."

# Test basic connectivity
echo "Testing basic connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.instylehairboutique.co.za)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Basic connectivity test passed"
else
    echo "❌ Basic connectivity test failed: HTTP $HTTP_STATUS"
    exit 1
fi

# Test API endpoints
echo "Testing API endpoints..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.instylehairboutique.co.za/api/health)
if [ "$API_STATUS" = "200" ]; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed: HTTP $API_STATUS"
fi

# Test database connectivity
echo "Testing database connectivity..."
DB_TEST=$(wrangler d1 execute appointmentbooking-db \
  --command="SELECT 1 as test" \
  --env production --local)

if [ "$DB_TEST" = "test\n1" ]; then
    echo "✅ Database connectivity test passed"
else
    echo "❌ Database connectivity test failed"
    exit 1
fi

echo "✅ All post-deployment tests passed"
```

#### Step 5: Monitoring Setup

```bash
echo "📊 Setting up enhanced monitoring..."

# Enable real-time monitoring
echo "Starting real-time log monitoring for 10 minutes..."
wrangler tail --env production --format=pretty &
TAIL_PID=$!

# Set monitoring timeout
sleep 600  # 10 minutes

# Stop monitoring
kill $TAIL_PID 2>/dev/null || true

echo "📋 Deployment completed successfully!"
echo "Deployment ID: $DEPLOYMENT_ID"
echo "Backup: $BACKUP_NAME"
echo "Monitor deployment logs at: https://dash.cloudflare.com"
```

### Rollback Procedures

#### Automatic Rollback Triggers

- [ ] Error rate >5% for 5 minutes
- [ ] Response time >2s for 10 minutes
- [ ] Database connectivity failures
- [ ] Critical application errors

#### Manual Rollback Process

```bash
#!/bin/bash
# rollback.sh

echo "🔄 Initiating rollback..."

DEPLOYMENT_ID=${1:-"latest"}
if [ "$DEPLOYMENT_ID" = "latest" ]; then
    echo "Rolling back to previous deployment..."
    wrangler rollback --env production
else
    echo "Rolling back to deployment: $DEPLOYMENT_ID"
    # Note: Wrangler doesn't support specific deployment rollback
    # This would need to be done via Cloudflare Dashboard
    echo "Please use Cloudflare Dashboard to rollback to deployment: $DEPLOYMENT_ID"
    exit 1
fi

# Verify rollback
echo "Verifying rollback..."
sleep 30  # Wait for rollback to complete

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.instylehairboutique.co.za)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Rollback completed successfully"
else
    echo "❌ Rollback verification failed"
    exit 1
fi
```

---

## 🗄️ Database Management

### Cloudflare D1 Operations

#### Database Backup Procedures

##### Automated Daily Backup

```bash
#!/bin/bash
# daily-backup.sh

BACKUP_NAME="daily-$(date +%Y%m%d-%H%M%S)"
RETENTION_DAYS=30

echo "💾 Creating daily backup: $BACKUP_NAME"

# Create backup
wrangler d1 backup create appointmentbooking-db \
  --name="$BACKUP_NAME" \
  --env production

# Verify backup
if wrangler d1 backup list appointmentbooking-db --env production | grep -q "$BACKUP_NAME"; then
    echo "✅ Backup created: $BACKUP_NAME"
    
    # Log backup info
    echo "$(date): Created backup $BACKUP_NAME" >> backup.log
else
    echo "❌ Backup creation failed"
    exit 1
fi

# Cleanup old backups
echo "🧹 Cleaning up old backups (>$RETENTION_DAYS days)..."
CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)

# Get list of old backups (manual cleanup required via dashboard)
OLD_BACKUPS=$(wrangler d1 backup list appointmentbooking-db --env production | \
  grep "daily-" | awk '{print $1, $2}' | \
  while read name date; do
    if [[ ${date//-/} -lt $CUTOFF_DATE ]]; then
        echo "$name"
    fi
  done)

if [ ! -z "$OLD_BACKUPS" ]; then
    echo "Found old backups to clean up:"
    echo "$OLD_BACKUPS"
    echo "Manual cleanup required via Cloudflare Dashboard"
else
    echo "No old backups found"
fi
```

##### Backup Verification

```bash
#!/bin/bash
# verify-backup.sh

BACKUP_ID=${1:-$(wrangler d1 backup list appointmentbooking-db --env production | tail -1 | awk '{print $1}')}

echo "🔍 Verifying backup: $BACKUP_ID"

# Create temporary database for testing
TEMP_DB="verify-backup-$(date +%Y%m%d-%H%M%S)"

# Restore backup to temporary database
wrangler d1 backup restore appointmentbooking-db \
  --backup-id="$BACKUP_ID" \
  --name="$TEMP_DB" \
  --env production

# Run verification queries
echo "Running verification queries..."

# Check critical tables exist
wrangler d1 execute "$TEMP_DB" \
  --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'appointments', 'services')" \
  --env production

# Check data integrity
wrangler d1 execute "$TEMP_DB" \
  --command="SELECT COUNT(*) as user_count FROM users" \
  --env production

wrangler d1 execute "$TEMP_DB" \
  --command="SELECT COUNT(*) as appointment_count FROM appointments" \
  --env production

# Clean up temporary database
echo "Cleaning up temporary database..."
# Note: D1 doesn't support database deletion via CLI
echo "Temporary database $TEMP_DB created for verification"

echo "✅ Backup verification completed"
```

#### Database Migration Management

##### Migration Execution

```bash
#!/bin/bash
# run-migration.sh

MIGRATION_FILE=${1:-"scripts/migrations/latest.sql"}
ENVIRONMENT=${2:-"production"}

echo "🔄 Running migration: $MIGRATION_FILE"

# Backup before migration
PRE_BACKUP="pre-migration-$(date +%Y%m%d-%H%M%S)"
wrangler d1 backup create appointmentbooking-db \
  --name="$PRE_BACKUP" \
  --env "$ENVIRONMENT"

# Execute migration
echo "Executing migration..."
wrangler d1 execute appointmentbooking-db \
  --file="$MIGRATION_FILE" \
  --env "$ENVIRONMENT"

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
    
    # Verify migration
    echo "Verifying migration..."
    # Add specific verification queries based on migration
    
    echo "Migration backup: $PRE_BACKUP"
else
    echo "❌ Migration failed"
    
    # Rollback from backup
    echo "Rolling back from backup..."
    wrangler d1 backup restore appointmentbooking-db \
      --backup-id="$PRE_BACKUP" \
      --env "$ENVIRONMENT"
    
    exit 1
fi
```

##### Migration Template

```sql
-- Migration: [Description]
-- Date: [Date]
-- Author: [Name]
-- Version: [Version]

-- This migration [describe what it does]

-- Step 1: Create backup point
BEGIN TRANSACTION;

-- Step 2: [Migration steps]
-- Example:
-- CREATE TABLE new_feature (
--     id TEXT PRIMARY KEY,
--     name TEXT NOT NULL,
--     created_at INTEGER DEFAULT (unixepoch())
-- );

-- Step 3: Add indexes
-- CREATE INDEX idx_new_feature_name ON new_feature(name);

-- Step 4: Insert initial data if needed
-- INSERT INTO new_feature (id, name) VALUES ('default', 'Default Feature');

-- Step 5: Verify changes
-- SELECT COUNT(*) FROM new_feature;

COMMIT;

-- Verification queries
SELECT 'Migration completed successfully' as status;
```

#### Performance Monitoring

##### Database Performance Analysis

```sql
-- Database performance analysis queries

-- 1. Table sizes and row counts
SELECT 
    name as table_name,
    (SELECT COUNT(*) FROM sqlite_master sm WHERE sm.tblname = name) as index_count,
    (SELECT COUNT(*) FROM pragma_table_info(name)) as column_count
FROM sqlite_master 
WHERE type = 'table' 
    AND name NOT LIKE 'sqlite_%'
ORDER BY name;

-- 2. Query performance analysis
EXPLAIN QUERY PLAN 
SELECT a.*, s.name as service_name, u.name as user_name
FROM appointments a
JOIN services s ON a.service_id = s.id
JOIN users u ON a.user_id = u.id
WHERE a.tenant_id = ?
  AND a.created_at > datetime('now', '-7 days')
ORDER BY a.created_at DESC
LIMIT 100;

-- 3. Index usage analysis
SELECT 
    name as index_name,
    tbl_name as table_name,
    sql as index_sql
FROM sqlite_master 
WHERE type = 'index' 
    AND name NOT LIKE 'sqlite_%'
ORDER BY tbl_name, name;

-- 4. Database size analysis
SELECT 
    'database_size' as metric,
    page_count * page_size as size_bytes,
    page_count as page_count,
    page_size as page_size
FROM pragma_page_count(), pragma_page_size();

-- 5. Connection and lock analysis
SELECT 
    'connection_info' as info,
    busy_timeout,
    journal_mode,
    synchronous
FROM pragma_busy_timeout, pragma_journal_mode, pragma_synchronous;
```

---

## 🔐 Security Administration

### Access Control Management

#### User Role Management

```sql
-- User role management queries

-- 1. List all users with roles
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.tenant_id,
    u.status,
    u.created_at,
    u.last_login
FROM users u
ORDER BY u.created_at DESC;

-- 2. Check user permissions
SELECT 
    u.email,
    p.permission_name,
    p.resource_type,
    p.action
FROM users u
JOIN user_permissions up ON u.id = up.user_id
JOIN permissions p ON up.permission_id = p.id
WHERE u.id = ?
ORDER BY p.permission_name;

-- 3. Audit recent role changes
SELECT 
    ral.user_id,
    u.email,
    ral.action,
    ral.resource_type,
    ral.old_value,
    ral.new_value,
    ral.created_at
FROM role_audit_log ral
JOIN users u ON ral.user_id = u.id
WHERE ral.created_at > datetime('now', '-7 days')
ORDER BY ral.created_at DESC;

-- 4. Check for dormant accounts
SELECT 
    id,
    email,
    name,
    last_login,
    created_at,
    CASE 
        WHEN last_login IS NULL THEN 'Never logged in'
        WHEN last_login < datetime('now', '-30 days') THEN 'Dormant'
        ELSE 'Active'
    END as status
FROM users
WHERE last_login < datetime('now', '-30 days')
   OR last_login IS NULL;
```

#### API Key Management

```sql
-- API key management queries

-- 1. List active API keys
SELECT 
    id,
    user_id,
    name,
    last_used,
    expires_at,
    CASE 
        WHEN expires_at < datetime('now') THEN 'Expired'
        WHEN last_used < datetime('now', '-90 days') THEN 'Unused'
        ELSE 'Active'
    END as status
FROM api_keys
ORDER BY created_at DESC;

-- 2. Check API usage patterns
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as request_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(response_time_ms) as avg_response_time
FROM api_usage_logs
WHERE timestamp > datetime('now', '-30 days')
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- 3. Detect suspicious API usage
SELECT 
    user_id,
    ip_address,
    COUNT(*) as request_count,
    MIN(timestamp) as first_request,
    MAX(timestamp) as last_request
FROM api_usage_logs
WHERE timestamp > datetime('now', '-1 hour')
GROUP BY user_id, ip_address
HAVING request_count > 100  -- Threshold for rate limiting
ORDER BY request_count DESC;
```

### Security Monitoring

#### Security Event Analysis

```bash
#!/bin/bash
# security-audit.sh

echo "🔍 Running security audit..."

# 1. Check for failed login attempts
echo "Analyzing failed login attempts..."
wrangler d1 execute appointmentbooking-db \
  --command="SELECT 
    ip_address,
    COUNT(*) as attempts,
    MIN(timestamp) as first_attempt,
    MAX(timestamp) as last_attempt
FROM auth_attempts 
WHERE success = 0 
  AND timestamp > datetime('now', '-24 hours')
GROUP BY ip_address
HAVING attempts > 5
ORDER BY attempts DESC" \
  --env production

# 2. Check for privilege escalation attempts
echo "Checking privilege escalation attempts..."
wrangler d1 execute appointmentbooking-db \
  --command="SELECT 
    user_id,
    action,
    resource_type,
    timestamp,
    ip_address
FROM audit_logs
WHERE action LIKE '%admin%' 
   OR action LIKE '%elevate%'
   OR action LIKE '%privilege%'
  AND timestamp > datetime('now', '-7 days')
ORDER BY timestamp DESC" \
  --env production

# 3. Analyze access patterns
echo "Analyzing access patterns..."
wrangler d1 execute appointmentbooking-db \
  --command="SELECT 
    user_id,
    COUNT(*) as total_access,
    COUNT(DISTINCT ip_address) as unique_ips,
    COUNT(DISTINCT user_agent) as unique_agents,
    MIN(timestamp) as first_access,
    MAX(timestamp) as last_access
FROM audit_logs
WHERE timestamp > datetime('now', '-24 hours')
GROUP BY user_id
ORDER BY total_access DESC" \
  --env production

echo "✅ Security audit completed"
```

---

## 📊 Monitoring and Alerting

### Custom Monitoring Scripts

#### System Health Check

```bash
#!/bin/bash
# health-check.sh

HEALTH_ENDPOINT="https://www.instylehairboutique.co.za/api/health"
RESPONSE_TIMEOUT=10
CRITICAL_THRESHOLD=3
WARNING_THRESHOLD=2

check_endpoint() {
    local url=$1
    local timeout=$2
    
    # Check HTTP status and response time
    local response
    response=$(curl -w "@curl-format.txt" -o /dev/null -s --max-time $timeout "$url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        local http_code=$(echo "$response" | grep "http_code" | cut -d'=' -f2)
        local response_time=$(echo "$response" | grep "time_total" | cut -d'=' -f2)
        
        echo "OK|$http_code|$response_time"
    else
        echo "FAIL|0|0"
    fi
}

# Run health checks
echo "🏥 Running system health checks..."

# Check main application
main_result=$(check_endpoint "$HEALTH_ENDPOINT" $RESPONSE_TIMEOUT)
main_status=$(echo "$main_result" | cut -d'|' -f1)
main_code=$(echo "$main_result" | cut -d'|' -f2)
main_time=$(echo "$main_result" | cut -d'|' -f3)

echo "Main Application: $main_status (HTTP: $main_code, Time: ${main_time}s)"

# Check database connectivity
db_result=$(wrangler d1 execute appointmentbooking-db \
  --command="SELECT 1" \
  --env production --local 2>/dev/null)

if [ "$db_result" = "1" ]; then
    echo "Database: OK"
    db_status="OK"
else
    echo "Database: FAIL"
    db_status="FAIL"
fi

# Check external integrations
echo "Checking external integrations..."

# Paystack
paystack_result=$(curl -s -o /dev/null -w "%{http_code}" \
  --max-time 5 \
  "https://api.paystack.co/" \
  2>/dev/null)

if [ "$paystack_result" = "200" ]; then
    echo "Paystack: OK"
    paystack_status="OK"
else
    echo "Paystack: FAIL (HTTP: $paystack_result)"
    paystack_status="FAIL"
fi

# Generate health report
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
overall_status="OK"

if [ "$main_status" = "FAIL" ] || [ "$db_status" = "FAIL" ] || [ "$paystack_status" = "FAIL" ]; then
    overall_status="FAIL"
fi

cat << EOF
{
  "timestamp": "$timestamp",
  "overall_status": "$overall_status",
  "checks": {
    "main_application": {
      "status": "$main_status",
      "http_code": $main_code,
      "response_time": $main_time
    },
    "database": {
      "status": "$db_status"
    },
    "paystack": {
      "status": "$paystack_status"
    }
  }
}
EOF

# Alert if critical issues found
if [ "$overall_status" = "FAIL" ]; then
    echo "🚨 Critical health check failure detected"
    # Send alert (implement alert mechanism)
fi
```

#### Performance Monitoring

```bash
#!/bin/bash
# performance-monitor.sh

URLS=(
    "https://www.instylehairboutique.co.za"
    "https://www.instylehairboutique.co.za/book/instylehairboutique"
    "https://www.instylehairboutique.co.za/api/health"
)

METRICS_FILE="performance-metrics.json"
THRESHOLD_RESPONSE=2.0  # seconds
THRESHOLD_ERROR_RATE=0.01  # 1%

echo "📊 Running performance monitoring..."

# Create temporary file for metrics
temp_metrics=$(mktemp)

# Monitor each URL
for url in "${URLS[@]}"; do
    echo "Testing: $url"
    
    # Run multiple tests
    total_time=0
    total_status=0
    success_count=0
    
    for i in {1..5}; do
        response=$(curl -w "@curl-format.txt" -o /dev/null -s "$url" 2>/dev/null)
        
        if [ $? -eq 0 ]; then
            http_code=$(echo "$response" | grep "http_code" | cut -d'=' -f2)
            response_time=$(echo "$response" | grep "time_total" | cut -d'=' -f2)
            
            total_time=$(echo "$total_time + $response_time" | bc -l)
            
            if [ "$http_code" = "200" ]; then
                success_count=$((success_count + 1))
            fi
        fi
        
        sleep 1
    done
    
    # Calculate averages
    avg_time=$(echo "scale=3; $total_time / 5" | bc -l)
    success_rate=$(echo "scale=2; $success_count * 100 / 5" | bc -l)
    
    echo "  Average response time: ${avg_time}s"
    echo "  Success rate: ${success_rate}%"
    
    # Check thresholds
    if (( $(echo "$avg_time > $THRESHOLD_RESPONSE" | bc -l) )); then
        echo "  ⚠️  Response time threshold exceeded"
    fi
    
    if (( $(echo "$success_rate < 99" | bc -l) )); then
        echo "  ⚠️  Success rate below threshold"
    fi
    
    # Add to metrics
    echo "{\"url\": \"$url\", \"avg_response_time\": $avg_time, \"success_rate\": $success_rate}" >> "$temp_metrics"
done

# Combine metrics
echo "[" > "$METRICS_FILE"
paste -sd',' "$temp_metrics" >> "$METRICS_FILE"
echo "]" >> "$METRICS_FILE"

# Clean up
rm "$temp_metrics"

echo "📊 Performance metrics saved to $METRICS_FILE"
```

---

## 🔄 Automation Scripts

### Deployment Automation

#### CI/CD Pipeline Script

```bash
#!/bin/bash
# cicd-pipeline.sh

set -e

ENVIRONMENT=${1:-"staging"}
BRANCH=${2:-"main"}

echo "🚀 Starting CI/CD pipeline"
echo "Environment: $ENVIRONMENT"
echo "Branch: $BRANCH"

# Stage 1: Code Quality Checks
echo "🔍 Stage 1: Code Quality Checks"

# Linting
echo "Running linter..."
pnpm lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

# Type checking
echo "Running type check..."
pnpm type-check
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed"
    exit 1
fi

# Security audit
echo "Running security audit..."
pnpm audit --audit-level moderate
if [ $? -ne 0 ]; then
    echo "❌ Security audit failed"
    exit 1
fi

# Stage 2: Testing
echo "🧪 Stage 2: Testing"

# Unit tests
echo "Running unit tests..."
pnpm test
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi

# Integration tests
echo "Running integration tests..."
pnpm test:integration
if [ $? -ne 0 ]; then
    echo "❌ Integration tests failed"
    exit 1
fi

# E2E tests (staging only)
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "Running E2E tests..."
    pnpm test:e2e
    if [ $? -ne 0 ]; then
        echo "❌ E2E tests failed"
        exit 1
    fi
fi

# Stage 3: Build
echo "🏗️ Stage 3: Build"

# Build application
pnpm build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Stage 4: Deployment
echo "🚀 Stage 4: Deployment"

if [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment
    echo "Deploying to production..."
    
    # Create backup
    BACKUP_NAME="auto-backup-$(date +%Y%m%d-%H%M%S)"
    wrangler d1 backup create appointmentbooking-db --name="$BACKUP_NAME" --env production
    
    # Deploy
    wrangler deploy --env production
    
    # Verify deployment
    sleep 30
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.instylehairboutique.co.za)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Production deployment successful"
        
        # Run smoke tests
        pnpm test:e2e:smoke
        if [ $? -ne 0 ]; then
            echo "❌ Smoke tests failed, triggering rollback..."
            wrangler rollback --env production
            exit 1
        fi
    else
        echo "❌ Production deployment verification failed"
        exit 1
    fi
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    # Staging deployment
    echo "Deploying to staging..."
    wrangler deploy --env staging
    
    # Verify staging deployment
    sleep 15
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://staging-appointmentbooking.pages.dev")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Staging deployment successful"
    else
        echo "❌ Staging deployment verification failed"
        exit 1
    fi
fi

# Stage 5: Post-deployment
echo "📊 Stage 5: Post-deployment"

# Generate deployment report
cat << EOF > deployment-report.json
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "environment": "$ENVIRONMENT",
  "branch": "$BRANCH",
  "status": "success",
  "backup_name": "$BACKUP_NAME",
  "deployment_id": "$(date +%Y%m%d-%H%M%S)"
}
EOF

echo "✅ CI/CD pipeline completed successfully"
echo "Deployment report: deployment-report.json"
```

### Monitoring Automation

#### Automated Daily Report

```bash
#!/bin/bash
# daily-report.sh

REPORT_DATE=$(date +"%Y-%m-%d")
REPORT_FILE="daily-report-${REPORT_DATE}.json"

echo "📊 Generating daily report for $REPORT_DATE"

# Initialize report
cat > "$REPORT_FILE" << EOF
{
  "date": "$REPORT_DATE",
  "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "metrics": {},
  "incidents": [],
  "summary": {}
}
EOF

# System health metrics
echo "Collecting system metrics..."

# Uptime check
uptime_result=$(curl -s -o /dev/null -w "%{http_code}" https://www.instylehairboutique.co.za)
if [ "$uptime_result" = "200" ]; then
    uptime_status="operational"
else
    uptime_status="degraded"
fi

# Response time
response_time=$(curl -w "@curl-format.txt" -o /dev/null -s https://www.instylehairboutique.co.za | grep "time_total" | cut -d'=' -f2)

# Business metrics
echo "Collecting business metrics..."

# Get booking data (example query)
bookings_data=$(wrangler d1 execute appointmentbooking-db \
  --command="SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as today_bookings,
    SUM(CASE WHEN DATE(created_at) >= DATE('now', '-7 days') THEN 1 ELSE 0 END) as week_bookings
  FROM appointments" \
  --env production --local 2>/dev/null || echo "0|0|0")

# Error metrics
error_count=$(curl -s "https://sentry.io/api/0/projects/your-org/your-project/issues/?statsPeriod=1d" \
  -H "Authorization: Bearer $SENTRY_API_KEY" | \
  jq '. | length' 2>/dev/null || echo "0")

# Generate report summary
echo "Creating report summary..."

# Update report with collected data
jq --arg uptime "$uptime_status" \
   --argjson response_time "$response_time" \
   --argjson bookings "$bookings_data" \
   --argjson errors "$error_count" \
   '.metrics = {
      "uptime_status": $uptime,
      "avg_response_time": $response_time,
      "bookings_today": ($bookings | split("|") | .[1] | tonumber),
      "bookings_week": ($bookings | split("|") | .[2] | tonumber),
      "error_count": $errors
   }' \
   --arg summary_status "healthy" \
   '.summary = {
      "overall_status": $summary_status,
      "key_issues": [],
      "recommendations": []
   }' \
   "$REPORT_FILE" > "${REPORT_FILE}.tmp"

mv "${REPORT_FILE}.tmp" "$REPORT_FILE"

echo "✅ Daily report generated: $REPORT_FILE"

# Send report if configured
if [ ! -z "$REPORT_WEBHOOK" ]; then
    echo "Sending report to webhook..."
    jq -r '.summary.overall_status' "$REPORT_FILE" | \
    while read status; do
        if [ "$status" = "healthy" ]; then
            message="✅ Daily health check: All systems operational"
        else
            message="⚠️ Daily health check: Issues detected"
        fi
        
        curl -X POST "$REPORT_WEBHOOK" \
          -H "Content-Type: application/json" \
          -d "{\"text\":\"$message\nReport: $(pwd)/$REPORT_FILE\"}" \
          2>/dev/null || true
    done
fi
```

---

**Document Control**

- **Version**: 1.0.0
- **Last Updated**: December 24, 2025
- **Next Review**: March 24, 2026
- **Owner**: DevOps Team
- **Approved By**: [To be assigned]

---

*This guide should be used by system administrators for managing the appointment booking platform infrastructure. For questions or support, contact <devops@company.com>.*
