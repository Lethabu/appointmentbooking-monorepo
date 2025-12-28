# 📋 Operational Runbook - Appointment Booking Platform

**Version:** 1.0.0  
**Date:** December 24, 2025  
**Environment:** Cloudflare (Production)  
**Owner:** Operations Team  

---

## 🚨 Quick Reference

### Emergency Contacts

| Role | Primary | Secondary | Email |
|------|---------|-----------|-------|
| **Incident Commander** | [TBD] | [TBD] | <ops-team@company.com> |
| **Security Lead** | [TBD] | [TBD] | <security@company.com> |
| **Technical Lead** | [TBD] | [TBD] | <tech-lead@company.com> |
| **Business Owner** | Zanele | +27 69 917 1527 | <business@company.com> |

### Critical System Status

- **Main Application**: <https://www.instylehairboutique.co.za>
- **Dashboard**: <https://dashboard.appointmentbooking.co.za>
- **API Status**: Check Cloudflare Dashboard
- **Database Status**: Cloudflare D1
- **Payment Gateway**: Paystack

### Current SLA Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Uptime** | 99.9% | <99.5% | <99% |
| **API Response Time (p95)** | <200ms | >500ms | >1000ms |
| **Page Load Time** | <2.5s | >5s | >10s |
| **Error Rate** | <0.1% | >0.5% | >1% |
| **Booking Conversion** | >15% | <12% | <10% |

---

## 📊 System Overview

### Architecture Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare     │    │   External      │
│     Pages       │────│    Workers       │────│   Services      │
│                 │    │                  │    │                 │
│ - Booking UI    │    │ - API Routes     │    │ - Google Cal    │
│ - Dashboard     │    │ - Auth           │    │ - Paystack      │
│ - Static Assets │    │ - Business Logic │    │ - WhatsApp      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Analytics &    │    │   Monitoring    │
│      D1         │    │   Logging        │    │                 │
│                 │    │                  │    │ - Sentry        │
│ - Appointments  │    │ - Cloudflare     │    │ - Analytics     │
│ - Users         │    │   Analytics      │    │ - Custom        │
│ - Services      │    │ - Error Tracking │    │   Dashboards    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Technologies

- **Frontend**: Next.js (Apps Router)
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: NextAuth.js + Google OAuth
- **Payments**: Paystack
- **Calendar**: Google Calendar API
- **Monitoring**: Sentry + Cloudflare Analytics
- **Deployment**: Cloudflare Pages + Wrangler

---

## 🔄 Daily Operations Checklist

### Morning Health Check (9:00 AM SAST)

#### System Health Verification

- [ ] **Cloudflare Dashboard Status**
  - [ ] Check Workers & Pages status
  - [ ] Verify no critical alerts
  - [ ] Review traffic patterns

- [ ] **Application Availability**
  - [ ] Test main website (instylehairboutique.co.za)
  - [ ] Test booking flow (complete test booking)
  - [ ] Test dashboard access
  - [ ] Verify API endpoints responding

- [ ] **Error Monitoring**
  - [ ] Check Sentry for new errors
  - [ ] Review Cloudflare Analytics errors
  - [ ] Verify no payment failures
  - [ ] Check AI agent performance

#### Business Metrics Review

- [ ] **Booking Performance**
  - [ ] Yesterday's bookings count
  - [ ] Revenue processed
  - [ ] Conversion rate analysis
  - [ ] Popular services review

- [ ] **User Experience**
  - [ ] Page load times
  - [ ] Mobile responsiveness
  - [ ] AI agent success rate
  - [ ] Customer satisfaction scores

### Midday Monitoring (1:00 PM SAST)

- [ ] **Performance Check**
  - [ ] Review response times
  - [ ] Check database performance
  - [ ] Monitor resource usage
  - [ ] Verify caching effectiveness

- [ ] **Security Review**
  - [ ] Check for suspicious activities
  - [ ] Review access logs
  - [ ] Verify security headers
  - [ ] Monitor rate limiting

### End of Day Summary (5:00 PM SAST)

- [ ] **Daily Report Generation**
  - [ ] Compile system health report
  - [ ] Generate business metrics summary
  - [ ] Document any incidents
  - [ ] Plan next day priorities

---

## 📅 Weekly Maintenance Procedures

### Monday: System Review & Planning

#### Performance Analysis

```bash
# Check last week's metrics
wrangler analytics query \
  --start=2025-12-16T00:00:00Z \
  --end=2025-12-23T23:59:59Z \
  --metric=requests \
  --dimension=country

# Review error patterns
curl -H "Authorization: Bearer $SENTRY_API_KEY" \
  "https://sentry.io/api/0/projects/your-org/your-project/issues/?statsPeriod=7d"
```

#### Database Maintenance

- [ ] **Backup Verification**

  ```bash
  # Create weekly backup
  wrangler d1 backup create appointmentbooking-db \
    --name="weekly-backup-$(date +%Y%m%d)"
  
  # Verify backup integrity
  wrangler d1 backup list appointmentbooking-db
  ```

- [ ] **Performance Optimization**
  - [ ] Analyze slow queries
  - [ ] Review index usage
  - [ ] Optimize frequently accessed tables
  - [ ] Clean up old analytics data

#### Security Review

- [ ] **Access Pattern Analysis**
  - [ ] Review authentication logs
  - [ ] Check for unusual login patterns
  - [ ] Verify role assignments
  - [ ] Review API key usage

- [ ] **Vulnerability Assessment**
  - [ ] Check for security updates
  - [ ] Review dependency vulnerabilities
  - [ ] Scan for configuration issues
  - [ ] Test security controls

### Wednesday: Performance Tuning

#### Database Optimization

```sql
-- Analyze query performance
EXPLAIN QUERY PLAN SELECT * FROM appointments 
WHERE tenant_id = ? AND created_at > datetime('now', '-7 days');

-- Check table statistics
SELECT name, COUNT(*) as row_count 
FROM sqlite_master sm
JOIN pragma_table_info(sm.name) pti
WHERE sm.type = 'table'
GROUP BY name;
```

#### Application Optimization

- [ ] **Cache Review**
  - [ ] Analyze cache hit rates
  - [ ] Review cache invalidation
  - [ ] Optimize cache keys
  - [ ] Clear stale cache entries

- [ ] **Resource Usage**
  - [ ] Monitor Worker CPU usage
  - [ ] Check memory consumption
  - [ ] Review bandwidth usage
  - [ ] Optimize asset delivery

### Friday: Week Wrap-up

- [ ] **Documentation Updates**
  - [ ] Update runbooks with lessons learned
  - [ ] Document any new procedures
  - [ ] Review and update contact lists
  - [ ] Update emergency procedures

- [ ] **Team Communication**
  - [ ] Weekly ops team meeting
  - [ ] Share performance insights
  - [ ] Plan next week's priorities
  - [ ] Escalate any ongoing issues

---

## 🔍 Monthly Security Reviews

### First Monday of Each Month

#### Access Control Audit

```bash
# Review user access patterns
wrangler d1 execute appointmentbooking-db \
  --command="SELECT tenant_id, COUNT(*) as user_count 
             FROM users GROUP BY tenant_id"

# Check for dormant accounts
wrangler d1 execute appointmentbooking-db \
  --command="SELECT id, email, last_login 
             FROM users 
             WHERE last_login < datetime('now', '-30 days')"
```

#### Security Configuration Review

- [ ] **Authentication Settings**
  - [ ] Verify OAuth configurations
  - [ ] Review session timeouts
  - [ ] Check MFA implementation
  - [ ] Validate password policies

- [ ] **Network Security**
  - [ ] Review firewall rules
  - [ ] Check SSL/TLS configurations
  - [ ] Verify security headers
  - [ ] Test DDoS protection

#### Compliance Verification

- [ ] **Data Protection**
  - [ ] Verify encryption at rest
  - [ ] Check data retention policies
  - [ ] Review privacy controls
  - [ ] Test data deletion procedures

- [ ] **Audit Trail Review**
  - [ ] Verify all access is logged
  - [ ] Review audit log integrity
  - [ ] Check log retention periods
  - [ ] Test audit reporting

---

## 🆘 Incident Response Procedures

### Severity Classification

#### Severity 1 (Critical) - 15 Minute Response

- **Definition**: Complete service outage or major security breach
- **Examples**:
  - Main website completely down
  - Database corruption or loss
  - Confirmed data breach
  - Payment system compromise
  - Active security attack

#### Severity 2 (High) - 1 Hour Response

- **Definition**: Significant service degradation or security incident
- **Examples**:
  - Partial service outage
  - High error rate (>5%)
  - Performance severely degraded
  - Unauthorized access attempt
  - DDoS attack

#### Severity 3 (Medium) - 4 Hour Response

- **Definition**: Minor security events or service issues
- **Examples**:
  - Individual feature not working
  - Slow performance
  - Minor security vulnerabilities
  - Single account compromise
  - Integration failures

#### Severity 4 (Low) - 24 Hour Response

- **Definition**: Informational events or minor issues
- **Examples**:
  - Documentation updates needed
  - Minor UI issues
  - Routine maintenance
  - Feature requests
  - Performance optimization

### Incident Response Workflow

```
Detection → Assessment → Containment → Investigation → Recovery → Post-Incident
    ↓           ↓            ↓            ↓           ↓            ↓
  Alerts →   Severity →   Isolate →   Root Cause →  Restore →   Lessons
  Logs     →  Classify →  Systems →   Analysis →   Service →   Learned
```

#### Phase 1: Detection and Assessment (0-15 minutes)

**Initial Response Checklist:**

- [ ] Acknowledge alert and create incident ticket
- [ ] Verify incident is not false positive
- [ ] Assess severity level
- [ ] Identify affected systems
- [ ] Notify incident commander
- [ ] Begin incident documentation

**Communication Template:**

```
🚨 INCIDENT DETECTED

Incident ID: INC-2025-XXXX
Severity: [1-Critical|2-High|3-Medium|4-Low]
Time Detected: [timestamp]
Affected Systems: [list]
Initial Assessment: [brief description]
Incident Commander: [name]
Next Update: [time]

Status: INVESTIGATING
```

#### Phase 2: Containment (15-30 minutes)

**Immediate Actions:**

- [ ] Isolate affected systems
- [ ] Disable compromised accounts
- [ ] Block malicious traffic
- [ ] Preserve evidence
- [ ] Implement temporary workarounds
- [ ] Update stakeholders

#### Phase 3: Investigation (30 minutes - 4 hours)

**Technical Investigation:**

- [ ] Analyze logs and metrics
- [ ] Identify root cause
- [ ] Document timeline
- [ ] Assess impact scope
- [ ] Plan remediation approach
- [ ] Test proposed solutions

#### Phase 4: Recovery (Variable)

**Service Restoration:**

- [ ] Implement fix
- [ ] Verify service functionality
- [ ] Monitor for recurrence
- [ ] Gradual service restoration
- [ ] Performance validation
- [ ] Customer communication

#### Phase 5: Post-Incident (24-48 hours)

**Review and Improvement:**

- [ ] Conduct lessons learned session
- [ ] Update procedures and runbooks
- [ ] Implement preventive measures
- [ ] Update monitoring rules
- [ ] Document for team training

---

## 🔧 System Administration Procedures

### Worker Deployment Procedures

#### Pre-Deployment Checklist

- [ ] **Code Review**
  - [ ] All changes peer reviewed
  - [ ] Security review completed
  - [ ] Performance impact assessed
  - [ ] Documentation updated

- [ ] **Testing**
  - [ ] Unit tests passing
  - [ ] Integration tests passing
  - [ ] Security tests passing
  - [ ] Performance tests passing
  - [ ] Smoke tests on staging

#### Deployment Process

```bash
# 1. Prepare deployment
export ENVIRONMENT=production
export DEPLOYMENT_ID=$(date +%Y%m%d-%H%M%S)

# 2. Create backup
wrangler d1 backup create appointmentbooking-db \
  --name="pre-deploy-$DEPLOYMENT_ID"

# 3. Deploy worker
cd packages/worker
wrangler deploy --env production

# 4. Verify deployment
wrangler deployments list
wrangler tail --env production

# 5. Run smoke tests
pnpm test:e2e:smoke

# 6. Monitor for 30 minutes
echo "Deployment $DEPLOYMENT_ID completed. Monitoring for 30 minutes..."
```

#### Rollback Procedure

```bash
# Immediate rollback
wrangler rollback --env production

# Database rollback if needed
wrangler d1 backup restore appointmentbooking-db \
  --backup-id=<backup-id> \
  --env production

# Verify rollback
curl -I https://www.instylehairboutique.co.za
```

### Database Management

#### Daily Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_NAME="daily-$(date +%Y%m%d-%H%M%S)"
echo "Creating backup: $BACKUP_NAME"

wrangler d1 backup create appointmentbooking-db \
  --name="$BACKUP_NAME"

# Verify backup
wrangler d1 backup list appointmentbooking-db | grep "$BACKUP_NAME"
```

#### Query Performance Monitoring

```sql
-- Enable query logging
PRAGMA analysis_limit=1000;

-- Check slow queries
SELECT 
  sql,
  COUNT(*) as execution_count,
  AVG(cast(total_time as real)/1000) as avg_time_ms,
  MAX(cast(total_time as real)/1000) as max_time_ms
FROM sqlite_stat1 st1
JOIN sqlite_stat4 st4 ON st1.tblname = st4.tblname
WHERE st1.tblname IN ('appointments', 'users', 'services')
GROUP BY sql
ORDER BY avg_time_ms DESC;
```

### Monitoring and Alerting

#### Alert Configuration

```javascript
// Cloudflare Worker alert handler
export default {
  async fetch(request, env, ctx) {
    try {
      // Check system health
      const health = await checkSystemHealth();
      
      if (health.status === 'critical') {
        await sendAlert('critical', health.details);
      } else if (health.status === 'warning') {
        await sendAlert('warning', health.details);
      }
      
      return new Response(JSON.stringify(health), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      await sendAlert('critical', { error: error.message });
      return new Response('System health check failed', { status: 500 });
    }
  }
};

async function checkSystemHealth() {
  // Implement health checks
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      external_apis: await checkExternalAPIs(),
      performance: await checkPerformance()
    }
  };
}
```

---

## 🚨 Emergency Procedures

### Complete System Outage

#### Immediate Response (0-15 minutes)

1. **Verify Outage**

   ```bash
   # Test from multiple locations
   curl -I https://www.instylehairboutique.co.za
   curl -I https://api.instylehairboutique.co.za/health
   
   # Check Cloudflare status
   # Visit: https://www.cloudflarestatus.com/
   ```

2. **Activate Incident Response**
   - [ ] Declare Severity 1 incident
   - [ ] Notify incident commander
   - [ ] Create communication channel
   - [ ] Begin documentation

3. **Initial Assessment**
   - [ ] Check Cloudflare dashboard
   - [ ] Verify DNS configuration
   - [ ] Test database connectivity
   - [ ] Review recent deployments

#### Short-term Response (15-60 minutes)

1. **Service Restoration**

   ```bash
   # Check worker status
   wrangler deployments list
   
   # Redeploy if necessary
   wrangler deploy --env production
   
   # Verify database
   wrangler d1 execute appointmentbooking-db \
     --command="SELECT COUNT(*) FROM appointments LIMIT 1"
   ```

2. **Communication**

   ```
   🚨 SERVICE OUTAGE UPDATE

   Incident: Complete system outage
   Start Time: [timestamp]
   Current Status: Investigating
   Next Update: 30 minutes
   
   Impact: All services unavailable
   Estimated Resolution: [TBD]
   
   We are actively working to restore service.
   ```

#### Recovery (1-4 hours)

- [ ] Gradually restore services
- [ ] Monitor system health
- [ ] Verify all functionality
- [ ] Customer communication
- [ ] Performance validation

### Security Incident Response

#### Suspected Data Breach

1. **Immediate Containment**

   ```bash
   # Isolate affected systems
   # Disable compromised accounts
   # Block suspicious IP addresses
   # Preserve evidence
   ```

2. **Evidence Collection**
   - [ ] Secure all logs
   - [ ] Document current state
   - [ ] Preserve database snapshots
   - [ ] Screenshot dashboards
   - [ ] Record timeline

3. **Impact Assessment**
   - [ ] Determine data scope
   - [ ] Identify affected users
   - [ ] Assess breach vector
   - [ ] Calculate risk level
   - [ ] Plan remediation

#### DDoS Attack Response

1. **Detection**
   - [ ] Monitor traffic spikes
   - [ ] Analyze request patterns
   - [ ] Identify attack sources
   - [ ] Assess impact severity

2. **Mitigation**

   ```bash
   # Enable Cloudflare DDoS protection
   # Block malicious IP ranges
   # Enable challenge mode
   # Implement rate limiting
   ```

3. **Recovery**
   - [ ] Monitor attack cessation
   - [ ] Gradually restore normal operations
   - [ ] Review and strengthen defenses
   - [ ] Document lessons learned

---

## 📊 Performance Troubleshooting

### Common Performance Issues

#### Slow API Response Times

**Symptoms:**

- API response time > 500ms (p95)
- User complaints of slow booking process
- High CPU usage on Workers

**Diagnosis:**

```bash
# Check Worker performance
wrangler tail --env production | grep "cpu"

# Analyze database performance
wrangler d1 execute appointmentbooking-db \
  --command="EXPLAIN QUERY PLAN 
             SELECT * FROM appointments 
             WHERE tenant_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10"

# Check external API latency
curl -w "@curl-format.txt" -o /dev/null -s \
  https://api.paystack.co/transaction/initialize
```

**Common Solutions:**

- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement caching
- [ ] Optimize external API calls
- [ ] Review Worker code efficiency

#### High Error Rate

**Symptoms:**

- Error rate > 1%
- Increased 4xx/5xx responses
- User booking failures

**Diagnosis:**

```bash
# Check Sentry for error details
curl -H "Authorization: Bearer $SENTRY_API_KEY" \
  "https://sentry.io/api/0/projects/your-org/your-project/issues/?statsPeriod=1h"

# Analyze Cloudflare logs
wrangler analytics query \
  --start=2025-12-24T00:00:00Z \
  --end=2025-12-24T23:59:59Z \
  --metric=errors
```

**Common Solutions:**

- [ ] Fix application bugs
- [ ] Improve error handling
- [ ] Update dependency versions
- [ ] Fix configuration issues
- [ ] Improve input validation

### Performance Monitoring

#### Real-time Metrics

```javascript
// Performance monitoring endpoint
export default {
  async fetch(request, env, ctx) {
    if (request.url.includes('/admin/metrics')) {
      const metrics = await getSystemMetrics();
      return new Response(JSON.stringify(metrics), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // ... other routes
  }
};

async function getSystemMetrics() {
  return {
    timestamp: Date.now(),
    performance: {
      response_time: await measureResponseTime(),
      cpu_usage: await getCPUUsage(),
      memory_usage: await getMemoryUsage(),
      database_queries: await getQueryMetrics()
    },
    business: {
      bookings_today: await getBookingsToday(),
      revenue_today: await getRevenueToday(),
      conversion_rate: await getConversionRate()
    }
  };
}
```

---

## 📞 Escalation Procedures

### Contact Hierarchy

#### Level 1: Operations Team (0-1 hour)

- **Primary**: On-call Engineer
- **Contact**: <ops-oncall@company.com>
- **Phone**: +27-XXX-XXX-XXXX
- **Responsibilities**:
  - Initial incident assessment
  - Basic troubleshooting
  - Status page updates
  - Customer communication

#### Level 2: Technical Leadership (1-4 hours)

- **Primary**: Senior Developer
- **Contact**: <tech-lead@company.com>
- **Phone**: +27-XXX-XXX-XXXX
- **Responsibilities**:
  - Complex technical issues
  - Architecture decisions
  - Resource allocation
  - External vendor coordination

#### Level 3: Executive Leadership (4+ hours)

- **Primary**: CTO
- **Contact**: <cto@company.com>
- **Phone**: +27-XXX-XXX-XXXX
- **Responsibilities**:
  - Business impact decisions
  - Customer escalation
  - Media relations
  - Strategic resource allocation

### Communication Templates

#### Internal Alert

```
🔴 SEV[1] - CRITICAL INCIDENT

Incident: [Brief description]
Time: [Timestamp]
Systems Affected: [List]
Customer Impact: [Description]
Status: [Investigating/Containment/Recovery/Resolved]
ETA: [Estimated resolution time]

Actions Taken:
- [List actions]

Next Steps:
- [List next steps]

Incident Commander: [Name]
Next Update: [Time]

Updates will be sent every 30 minutes.
```

#### Customer Communication

```
🚨 Service Update

We're currently experiencing issues with our booking system that may affect your ability to make appointments. Our team is actively working to resolve this.

What we're doing:
- [Actions being taken]

Expected resolution:
- [ETA]

We apologize for any inconvenience and will provide updates as available.

Next update: [Time]
```

---

## 📋 Templates and Checklists

### Daily Operations Template

```
DAILY OPERATIONS CHECKLIST - [DATE]

System Health:
□ Cloudflare Workers status: [OK/WARNING/CRITICAL]
□ Database connectivity: [OK/WARNING/CRITICAL]  
□ External API status: [OK/WARNING/CRITICAL]
□ SSL certificate: [Valid/Expiring soon/Expired]

Business Metrics:
□ Bookings yesterday: [Number]
□ Revenue processed: [Amount]
□ Conversion rate: [Percentage]
□ Customer satisfaction: [Score]

Issues Found:
□ None / □ [List issues with severity and status]

Next Day Priorities:
□ [Priority 1]
□ [Priority 2]
□ [Priority 3]

Completed by: [Name]
Time: [Timestamp]
```

### Incident Report Template

```
INCIDENT REPORT

Incident ID: INC-2025-[Number]
Date/Time: [Start] - [End]
Severity: [1-Critical/2-High/3-Medium/4-Low]
Commander: [Name]

SUMMARY:
[Brief description of incident]

TIMELINE:
[Timestamps with actions taken]

ROOT CAUSE:
[Detailed root cause analysis]

IMPACT:
- Systems affected: [List]
- Duration: [Time]
- Customer impact: [Description]
- Business impact: [Description]

RESOLUTION:
[How the issue was resolved]

LESSONS LEARNED:
- What went well: [List]
- What could be improved: [List]
- Action items: [List with owners and dates]

PREVENTIVE MEASURES:
[List of measures to prevent recurrence]

Prepared by: [Name]
Date: [Date]
Review Date: [Date]
```

### Deployment Checklist

```
DEPLOYMENT CHECKLIST

Deployment ID: [ID]
Date: [Date]
Environment: [Production/Staging]
Deployed by: [Name]

PRE-DEPLOYMENT:
□ Code review completed
□ Tests passing
□ Security review completed
□ Documentation updated
□ Backup created
□ Rollback plan prepared

DEPLOYMENT:
□ Worker deployed: [Success/Failed]
□ Database migrations: [Success/Failed]
□ Configuration updated: [Success/Failed]
□ Cache cleared: [Success/Failed]

POST-DEPLOYMENT:
□ Smoke tests passed
□ Monitoring alerts: [OK]
□ Performance baseline: [OK]
□ Customer-facing features: [Working]
□ Rollback plan: [Available]

Rollback executed: [Yes/No]
Reason for rollback: [If applicable]

Completed by: [Name]
Time: [Timestamp]
```

---

## 🔄 Continuous Improvement

### Monthly Review Process

#### Performance Analysis

- [ ] Review SLA compliance
- [ ] Analyze incident trends
- [ ] Assess customer satisfaction
- [ ] Evaluate team effectiveness

#### Process Optimization

- [ ] Identify automation opportunities
- [ ] Streamline workflows
- [ ] Update documentation
- [ ] Improve training materials

#### Technology Assessment

- [ ] Evaluate new monitoring tools
- [ ] Assess infrastructure needs
- [ ] Review security posture
- [ ] Plan capacity upgrades

### Quarterly Disaster Recovery Testing

#### Test Scenarios

1. **Complete Infrastructure Failure**
   - Simulate Cloudflare outage
   - Test backup restoration
   - Verify communication procedures

2. **Database Corruption**
   - Simulate data corruption
   - Test backup integrity
   - Validate recovery procedures

3. **Security Breach**
   - Simulate unauthorized access
   - Test incident response
   - Validate forensic procedures

#### Test Execution

```bash
# Quarterly DR test script
#!/bin/bash

echo "Starting Quarterly DR Test"
echo "Date: $(date)"

# Test 1: Backup restoration
echo "Testing backup restoration..."
BACKUP_ID=$(wrangler d1 backup list appointmentbooking-db | tail -1 | awk '{print $1}')
wrangler d1 backup restore appointmentbooking-db --backup-id=$BACKUP_ID --name=test-restore

# Test 2: System failover
echo "Testing system failover..."
# [Implement failover tests]

# Test 3: Communication procedures
echo "Testing communication..."
# [Test alert systems]

echo "DR Test Completed"
```

---

**Document Control**

- **Version**: 1.0.0
- **Last Updated**: December 24, 2025
- **Next Review**: March 24, 2026
- **Owner**: Operations Team
- **Approved By**: [To be assigned]

---

*This document is maintained by the Operations Team and should be reviewed and updated regularly. For questions or suggestions, contact <ops-team@company.com>.*
