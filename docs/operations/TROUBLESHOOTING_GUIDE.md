# 🔧 Troubleshooting Guide - Appointment Booking Platform

**Version:** 1.0.0  
**Date:** December 24, 2025  
**Environment:** Cloudflare (Production)  
**Owner:** Support Team  

---

## 🚨 Quick Diagnosis Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    ISSUE REPORTED                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INITIAL TRIAGE                                │
├─────────────────────────────────────────────────────────────────┤
│ 1. What type of issue?                                         │
│    □ Application not loading                                    │
│    □ Booking flow broken                                       │
│    □ Payment issues                                            │
│    □ Authentication problems                                   │
│    □ Performance degradation                                   │
│    □ Database errors                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 CHECK SYSTEM STATUS                            │
├─────────────────────────────────────────────────────────────────┤
│ • Cloudflare Dashboard                                        │
│ • Sentry Error Dashboard                                       │
│ • Database Connectivity                                        │
│ • External API Status                                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INVESTIGATE & FIX                             │
├─────────────────────────────────────────────────────────────────┤
│ • Review logs                                                 │
│ • Check metrics                                               │
│ • Apply appropriate fix                                       │
│ • Verify resolution                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Common Issues and Solutions

### 1. Application Not Loading

#### Symptoms

- Main website returns 404 or 500 error
- Cloudflare Workers showing deployment errors
- DNS resolution issues

#### Diagnosis Steps

**Step 1: Check Cloudflare Dashboard**

```bash
# Check Workers & Pages status
# Navigate to: Cloudflare Dashboard > Workers & Pages > appointmentbooking
# Look for deployment status and errors
```

**Step 2: Test Basic Connectivity**

```bash
# Test main domain
curl -I https://www.instylehairboutique.co.za

# Expected output:
# HTTP/2 200 
# content-type: text/html; charset=utf-8

# If 404 or 500, proceed with troubleshooting
```

**Step 3: Check DNS Resolution**

```bash
# Check DNS
nslookup www.instylehairboutique.co.za
dig www.instylehairboutique.co.za

# Should resolve to Cloudflare IP addresses
```

#### Solutions

**Solution A: Deployment Issue**

```bash
# Check deployment status
wrangler deployments list --env production

# If deployment failed, redeploy
cd packages/worker
wrangler deploy --env production

# Verify deployment
wrangler tail --env production
```

**Solution B: DNS Configuration**

```bash
# Verify DNS settings in Cloudflare Dashboard
# A record should point to Cloudflare Pages
# CNAME record for www should point to domain root
```

**Solution C: Worker Route Configuration**

```javascript
// Check wrangler.toml routes configuration
// Should include: routes = [{ pattern = "*.instylehairboutique.co.za/*", zone_id = "..." }]

// Redeploy with correct routes
wrangler deploy --env production
```

---

### 2. Booking Flow Broken

#### Symptoms

- Users cannot complete bookings
- API errors in booking process
- Database constraint violations
- Payment integration failures

#### Diagnosis Steps

**Step 1: Check API Endpoints**

```bash
# Test booking API
curl -X POST https://www.instylehairboutique.co.za/api/book \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Should return 200 or 400 (validation error), not 500
```

**Step 2: Database Connectivity**

```bash
# Test database connection
wrangler d1 execute appointmentbooking-db \
  --command="SELECT COUNT(*) FROM appointments" \
  --env production

# Should return a count, not connection error
```

**Step 3: Check Recent Logs**

```bash
# Check recent errors
wrangler tail --env production --format=pretty | grep -i error

# Look for:
# - Database connection errors
# - Authentication failures  
# - Validation errors
# - External API timeouts
```

#### Solutions

**Solution A: Database Schema Issues**

```sql
-- Check table structure
.tables

-- Verify foreign key constraints
PRAGMA foreign_key_check;

-- If constraint violations, restore from backup
wrangler d1 backup restore appointmentbooking-db \
  --backup-id=<backup-id> \
  --env production
```

**Solution B: API Logic Errors**

```javascript
// Review API route code
// Check for:
// - Missing error handling
// - Incorrect parameter validation
// - Database query errors
// - External API integration issues

// Common fixes:
// 1. Add proper error boundaries
// 2. Validate input parameters
// 3. Check database transaction handling
// 4. Verify external API responses
```

**Solution C: Environment Configuration**

```bash
# Check environment variables
wrangler secret list --env production

# Verify critical variables:
# - DATABASE_URL
# - GOOGLE_CLIENT_ID
# - PAYSTACK_SECRET_KEY
# - JWT_SECRET

# Update missing variables
wrangler secret put VARIABLE_NAME --env production
```

---

### 3. Payment Issues

#### Symptoms

- Payment processing failures
- Paystack API errors
- Transaction inconsistencies
- Refund processing problems

#### Diagnosis Steps

**Step 1: Test Paystack Connectivity**

```bash
# Test Paystack API
curl -X GET "https://api.paystack.co/" \
  -H "Authorization: Bearer $PAYSTACK_SECRET_KEY"

# Should return 200 OK with API information
```

**Step 2: Check Webhook Configuration**

```bash
# Verify webhook URL in Paystack dashboard
# Should be: https://www.instylehairboutique.co.za/api/webhooks/paystack

# Test webhook endpoint
curl -X POST https://www.instylehairboutique.co.za/api/webhooks/paystack \
  -H "Content-Type: application/json" \
  -d '{"event": "charge.success", "data": {"reference": "test"}}'

# Should return 200 OK
```

**Step 3: Review Payment Logs**

```sql
-- Check recent payment records
SELECT 
  id,
  reference,
  amount,
  status,
  created_at,
  processed_at
FROM payments
WHERE created_at > datetime('now', '-24 hours')
ORDER BY created_at DESC;

-- Check for failed transactions
SELECT 
  COUNT(*) as failed_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failures
FROM payments
WHERE created_at > datetime('now', '-24 hours');
```

#### Solutions

**Solution A: API Key Issues**

```bash
# Update Paystack keys
wrangler secret put PAYSTACK_SECRET_KEY --env production
wrangler secret put NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY --env production

# Verify keys are correct in Paystack dashboard
```

**Solution B: Webhook Failures**

```javascript
// Fix webhook handler
export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const payload = await request.text();
    
    // Verify signature
    if (!verifyPaystackSignature(payload, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }
    
    // Process webhook
    const event = JSON.parse(payload);
    await processPaystackWebhook(event);
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
```

**Solution C: Transaction Recovery**

```sql
-- Manual transaction processing for failed payments
UPDATE payments 
SET status = 'processing', 
    processed_at = datetime('now')
WHERE status = 'pending' 
  AND created_at < datetime('now', '-1 hour');

-- Clean up orphaned transactions
DELETE FROM payments 
WHERE status = 'pending' 
  AND created_at < datetime('now', '-24 hours');
```

---

### 4. Authentication Problems

#### Symptoms

- Users cannot log in
- Google OAuth failures
- Session management issues
- Permission errors

#### Diagnosis Steps

**Step 1: Check OAuth Configuration**

```bash
# Test Google OAuth endpoint
curl -X GET "https://accounts.google.com/.well-known/openid_configuration"

# Should return OAuth configuration
```

**Step 2: Test Authentication Flow**

```javascript
// Test auth endpoint
const testAuth = async () => {
  try {
    const response = await fetch('/api/auth/signin');
    const data = await response.json();
    console.log('Auth endpoint status:', response.status);
    console.log('Auth data:', data);
  } catch (error) {
    console.error('Auth test failed:', error);
  }
};
```

**Step 3: Check Database Auth Records**

```sql
-- Check user authentication records
SELECT 
  id,
  email,
  name,
  role,
  tenant_id,
  created_at,
  last_login
FROM users
WHERE email LIKE '%google%'  -- Google OAuth users
ORDER BY created_at DESC
LIMIT 10;

-- Check for auth session issues
SELECT 
  user_id,
  COUNT(*) as session_count,
  MAX(last_activity) as last_activity
FROM user_sessions
WHERE last_activity > datetime('now', '-24 hours')
GROUP BY user_id
ORDER BY session_count DESC
LIMIT 10;
```

#### Solutions

**Solution A: OAuth Configuration**

```bash
# Update Google OAuth credentials
wrangler secret put GOOGLE_CLIENT_ID --env production
wrangler secret put GOOGLE_CLIENT_SECRET --env production

# Verify in Google Cloud Console:
# - Authorized redirect URIs
# - Authorized JavaScript origins
# - OAuth consent screen
```

**Solution B: Session Management**

```sql
-- Clean up stale sessions
DELETE FROM user_sessions 
WHERE last_activity < datetime('now', '-7 days');

-- Fix user roles if corrupted
UPDATE users 
SET role = 'user' 
WHERE role IS NULL OR role = '';
```

**Solution C: JWT Token Issues**

```javascript
// Fix JWT configuration
const authOptions = {
  // ... other config
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  }
};
```

---

### 5. Performance Degradation

#### Symptoms

- Slow page load times
- High API response times
- Database query bottlenecks
- Resource utilization spikes

#### Diagnosis Steps

**Step 1: Performance Monitoring**

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s \
  https://www.instylehairboutique.co.za

# Analyze response time components
# Look for: time_namelookup, time_connect, time_appconnect, time_pretransfer, time_redirect, time_starttransfer, time_total
```

**Step 2: Database Performance**

```sql
-- Check slow queries
EXPLAIN QUERY PLAN 
SELECT * FROM appointments 
WHERE tenant_id = ? 
ORDER BY created_at DESC 
LIMIT 100;

-- Check table statistics
SELECT 
  name,
  (SELECT COUNT(*) FROM pragma_table_info(name)) as column_count
FROM sqlite_master 
WHERE type = 'table' 
ORDER BY name;
```

**Step 3: Resource Usage**

```bash
# Check Worker CPU usage
wrangler tail --env production | grep "cpu"

# Check memory usage patterns
# Monitor Cloudflare Analytics for traffic patterns
```

#### Solutions

**Solution A: Database Optimization**

```sql
-- Add missing indexes
CREATE INDEX idx_appointments_tenant_created 
ON appointments(tenant_id, created_at DESC);

CREATE INDEX idx_users_tenant_role 
ON users(tenant_id, role);

-- Optimize queries
-- Use specific column selection instead of SELECT *
-- Add LIMIT clauses to large queries
-- Use pagination for large datasets
```

**Solution B: Caching Implementation**

```javascript
// Add response caching
const cacheKey = `booking:${tenantId}:${serviceId}`;
const cached = await cache.get(cacheKey);

if (cached) {
  return new Response(JSON.parse(cached), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Cache results
await cache.put(cacheKey, JSON.stringify(data), { expirationTtl: 300 });
```

**Solution C: Code Optimization**

```javascript
// Optimize database queries
// Before:
const appointments = await db.select().from(appointments);

// After:
const appointments = await db.select({
  id: appointments.id,
  scheduledTime: appointments.scheduledTime,
  status: appointments.status
}).from(appointments)
  .where(eq(appointments.tenantId, tenantId))
  .orderBy(desc(appointments.createdAt))
  .limit(50);

// Batch operations
const batchInsert = async (data) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += 100) {
    chunks.push(data.slice(i, i + 100));
  }
  
  for (const chunk of chunks) {
    await db.insert(appointments).values(chunk);
  }
};
```

---

### 6. Database Issues

#### Symptoms

- Database connection failures
- Data corruption
- Query errors
- Performance issues

#### Diagnosis Steps

**Step 1: Database Connectivity**

```bash
# Test D1 connection
wrangler d1 execute appointmentbooking-db \
  --command="SELECT 1" \
  --env production

# Check database list
wrangler d1 list
```

**Step 2: Schema Validation**

```sql
-- Check database integrity
PRAGMA integrity_check;

-- Verify table structure
.tables

-- Check foreign key constraints
PRAGMA foreign_key_check;
```

**Step 3: Data Consistency**

```sql
-- Check for orphaned records
SELECT 
  'users' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT tenant_id) as unique_tenants
FROM users

UNION ALL

SELECT 
  'appointments' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT tenant_id) as unique_tenants
FROM appointments;

-- Check for data validation issues
SELECT COUNT(*) as invalid_records
FROM appointments
WHERE tenant_id NOT IN (SELECT id FROM tenants);
```

#### Solutions

**Solution A: Database Repair**

```bash
# Restore from recent backup
LATEST_BACKUP=$(wrangler d1 backup list appointmentbooking-db --env production | grep "daily-" | tail -1 | awk '{print $1}')

wrangler d1 backup restore appointmentbooking-db \
  --backup-id="$LATEST_BACKUP" \
  --env production
```

**Solution B: Data Cleanup**

```sql
-- Clean up orphaned records
DELETE FROM appointments 
WHERE tenant_id NOT IN (SELECT id FROM tenants);

DELETE FROM users 
WHERE tenant_id NOT IN (SELECT id FROM tenants);

-- Repair foreign key constraints
PRAGMA foreign_keys = OFF;
PRAGMA foreign_keys = ON;

-- Recalculate statistics
ANALYZE;
```

**Solution C: Migration Rollback**

```bash
# If issue introduced by migration, rollback
# Find pre-migration backup
PRE_MIGRATION_BACKUP=$(wrangler d1 backup list appointmentbooking-db --env production | grep "pre-migration" | tail -1 | awk '{print $1}')

wrangler d1 backup restore appointmentbooking-db \
  --backup-id="$PRE_MIGRATION_BACKUP" \
  --env production
```

---

## 🔍 Error Code Reference

### HTTP Status Codes

| Code | Category | Description | Common Causes |
|------|----------|-------------|---------------|
| **400** | Client Error | Bad Request | Invalid JSON, missing parameters |
| **401** | Client Error | Unauthorized | Missing/invalid authentication |
| **403** | Client Error | Forbidden | Insufficient permissions |
| **404** | Client Error | Not Found | Wrong route, missing resource |
| **429** | Client Error | Too Many Requests | Rate limiting, DDoS protection |
| **500** | Server Error | Internal Server Error | Application bug, database error |
| **502** | Server Error | Bad Gateway | External API failure |
| **503** | Server Error | Service Unavailable | Maintenance, overload |

### Application Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| **AUTH001** | Invalid JWT token | Check token expiration, refresh token |
| **AUTH002** | Missing authentication header | Add Authorization header |
| **AUTH003** | OAuth configuration error | Verify Google OAuth setup |
| **DB001** | Database connection failed | Check D1 connectivity |
| **DB002** | Query constraint violation | Check data integrity |
| **PAY001** | Payment processing failed | Verify Paystack configuration |
| **PAY002** | Webhook verification failed | Check webhook signature |
| **VAL001** | Input validation failed | Check request parameters |
| **API001** | External API timeout | Check third-party service status |

### Database Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| **SQLITE_CONSTRAINT** | Foreign key violation | Check referential integrity |
| **SQLITE_BUSY** | Database locked | Wait and retry operation |
| **SQLITE_CORRUPT** | Database corruption | Restore from backup |
| **SQLITE_NOMEM** | Out of memory | Optimize queries, reduce data |

---

## 📊 Log Analysis Procedures

### Cloudflare Worker Logs

#### Real-time Log Monitoring

```bash
# Monitor live logs
wrangler tail --env production --format=pretty

# Filter for errors
wrangler tail --env production --format=pretty | grep -i error

# Filter for specific routes
wrangler tail --env production --format=pretty | grep "/api/book"

# Save logs to file
wrangler tail --env production --format=pretty > worker-logs-$(date +%Y%m%d).log
```

#### Log Analysis Patterns

```bash
# Find frequent errors
grep -i error worker-logs-*.log | sort | uniq -c | sort -nr

# Analyze response times
grep -o "time_total=[0-9.]*" worker-logs-*.log | cut -d'=' -f2 | sort -n

# Check for timeout patterns
grep -i timeout worker-logs-*.log | head -20

# Analyze traffic patterns
grep -o "method=[A-Z]*" worker-logs-*.log | sort | uniq -c
```

### Database Query Analysis

#### Slow Query Detection

```sql
-- Enable query analysis
PRAGMA analysis_limit = 1000;

-- Find slow queries
EXPLAIN QUERY PLAN 
SELECT a.*, s.name, u.name as user_name
FROM appointments a
JOIN services s ON a.service_id = s.id  
JOIN users u ON a.user_id = u.id
WHERE a.tenant_id = ?
ORDER BY a.created_at DESC;

-- Check query execution plans
EXPLAIN QUERY PLAN SELECT * FROM appointments WHERE tenant_id = ?;
EXPLAIN QUERY PLAN SELECT * FROM users WHERE tenant_id = ? AND role = ?;
```

### Performance Metrics Analysis

#### Response Time Analysis

```bash
#!/bin/bash
# analyze-performance.sh

echo "📊 Performance Analysis Report"
echo "Generated: $(date)"
echo "================================"

# Response time analysis
echo "Response Time Analysis:"
echo "-----------------------"
for url in "https://www.instylehairboutique.co.za" \
          "https://www.instylehairboutique.co.za/api/health"; do
    echo "Testing: $url"
    
    # Test multiple times
    times=()
    for i in {1..10}; do
        time_val=$(curl -w "%{time_total}" -o /dev/null -s "$url")
        times+=($time_val)
    done
    
    # Calculate statistics
    total=0
    for time in "${times[@]}"; do
        total=$(echo "$total + $time" | bc -l)
    done
    
    avg=$(echo "scale=3; $total / ${#times[@]}" | bc -l)
    min=$(printf '%s\n' "${times[@]}" | sort -n | head -1)
    max=$(printf '%s\n' "${times[@]}" | sort -nr | head -1)
    
    echo "  Average: ${avg}s"
    echo "  Min: ${min}s"  
    echo "  Max: ${max}s"
    echo ""
done
```

---

## 🔧 Connectivity Diagnostics

### Network Diagnostics

#### DNS Resolution Testing

```bash
# Test DNS resolution
dig www.instylehairboutique.co.za
nslookup www.instylehairboutique.co.za

# Test from different locations
curl -H "CF-Connecting-IP: 8.8.8.8" https://www.instylehairboutique.co.za
curl -H "CF-Connecting-IP: 1.1.1.1" https://www.instylehairboutique.co.za

# Check SSL certificate
openssl s_client -connect www.instylehairboutique.co.za:443 -servername www.instylehairboutique.co.za
```

#### API Endpoint Testing

```bash
# Test all critical endpoints
endpoints=(
    "https://www.instylehairboutique.co.za"
    "https://www.instylehairboutique.co.za/api/health"
    "https://www.instylehairboutique.co.za/api/book"
    "https://www.instylehairboutique.co.za/api/appointments"
    "https://www.instylehairboutique.co.za/api/employees"
)

echo "Testing API endpoints..."
for endpoint in "${endpoints[@]}"; do
    echo -n "Testing $endpoint ... "
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    response_time=$(curl -w "%{time_total}" -o /dev/null -s "$endpoint")
    
    if [ "$http_code" = "200" ]; then
        echo "✅ OK (${response_time}s)"
    else
        echo "❌ FAILED (HTTP: $http_code, ${response_time}s)"
    fi
done
```

### External Service Diagnostics

#### Paystack Integration

```bash
# Test Paystack API
echo "Testing Paystack connectivity..."

# Test basic connectivity
curl -X GET "https://api.paystack.co/" \
  -H "Authorization: Bearer $PAYSTACK_SECRET_KEY" \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n"

# Test transaction initialization
curl -X POST "https://api.paystack.co/transaction/initialize" \
  -H "Authorization: Bearer $PAYSTACK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 1000
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

#### Google Calendar Integration

```bash
# Test Google API connectivity
curl -X GET "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=$GOOGLE_ACCESS_TOKEN"

# Test Calendar API
curl -X GET "https://www.googleapis.com/calendar/v3/calendars/primary/events" \
  -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

---

## 🚀 Escalation Procedures

### When to Escalate

#### Immediate Escalation (0-15 minutes)

- [ ] Complete system outage
- [ ] Security breach confirmed
- [ ] Payment system failure
- [ ] Data corruption detected
- [ ] Critical business impact

#### Standard Escalation (1-4 hours)

- [ ] Performance degradation affecting users
- [ ] Authentication system issues
- [ ] External integration failures
- [ ] Database performance issues
- [ ] Repeated errors

#### Planned Escalation (24+ hours)

- [ ] Configuration issues
- [ ] Non-critical bugs
- [ ] Feature enhancements
- [ ] Documentation updates
- [ ] Training needs

### Escalation Matrix

| Issue Type | Primary Contact | Secondary Contact | Escalation Time |
|------------|----------------|-------------------|-----------------|
| **Security** | Security Team Lead | CISO | Immediate |
| **Infrastructure** | DevOps Lead | CTO | 15 minutes |
| **Application** | Senior Developer | Engineering Manager | 1 hour |
| **Database** | Database Administrator | Senior Developer | 30 minutes |
| **Business** | Product Manager | Business Owner | 2 hours |
| **External APIs** | Integration Specialist | Technical Lead | 1 hour |

### Escalation Communication Template

```
🔴 ESCALATION REQUIRED

Issue: [Brief description]
Severity: [High/Critical]
Environment: Production
Time: [Timestamp]

DETAILS:
- Affected Systems: [List]
- User Impact: [Description]
- Business Impact: [Assessment]

TRIAGE COMPLETED:
- [x] Initial diagnosis
- [x] Basic troubleshooting attempted  
- [x] Logs analyzed
- [x] Impact assessed

IMMEDIATE ACTIONS TAKEN:
- [List actions performed]

NEXT STEPS REQUIRED:
- [Specific actions needed]
- [Resources required]
- [Timeline expectations]

Escalated by: [Name]
Contact: [Phone/Email]
Available: [Time]
```

---

**Document Control**

- **Version**: 1.0.0
- **Last Updated**: December 24, 2025
- **Next Review**: March 24, 2026
- **Owner**: Support Team
- **Approved By**: [To be assigned]

---

*This troubleshooting guide should be used by support staff and engineers for diagnosing and resolving common issues. For complex issues, escalate according to the escalation matrix. For questions or improvements, contact <support@company.com>.*
