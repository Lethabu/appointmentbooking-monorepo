# 📊 Comprehensive Monitoring & Alerting Setup Guide

**Appointment Booking Platform - Cloudflare Deployment**  
**Version:** 1.0.0  
**Date:** December 24, 2025  
**Environment:** Production (Cloudflare)  

---

## 🎯 Overview

This guide provides comprehensive instructions for implementing monitoring and alerting configurations for the Appointment Booking Platform deployed on Cloudflare. The monitoring stack includes Cloudflare Analytics, Sentry APM, infrastructure monitoring, security monitoring, and business metrics tracking.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare Analytics  │  Sentry APM  │  Custom Dashboards │
├─────────────────────────────────────────────────────────────┤
│  Security Monitoring   │  Business    │  Alert Management  │
│                       │  Metrics     │                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Infrastructure                      │
│  Workers & Pages  │  D1 Database  │  CDN & Edge  │  Security│
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### Required Accounts & Access

- [ ] Cloudflare account with Workers & Pages access
- [ ] Sentry account and project setup
- [ ] Slack workspace with webhook access
- [ ] Email service (for notifications)
- [ ] Database access (Cloudflare D1)
- [ ] DNS management access

### Environment Variables

Configure these environment variables in your Cloudflare deployment:

```bash
# Sentry Configuration
SENTRY_DSN="your_sentry_dsn_here"
SENTRY_ORG="your_org_name"
SENTRY_PROJECT="appointmentbooking-monorepo"

# Notification Channels
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
SLACK_ALERTS_WEBHOOK="https://hooks.slack.com/services/YOUR/ALERTS/WEBHOOK"
SLACK_SECURITY_WEBHOOK="https://hooks.slack.com/services/YOUR/SECURITY/WEBHOOK"
SLACK_BUSINESS_WEBHOOK="https://hooks.slack.com/services/YOUR/BUSINESS/WEBHOOK"

# Email Configuration
EMAIL_WEBHOOK_URL="your_email_service_webhook"
ALERT_EMAIL_RECIPIENTS="ops-team@instyle.co.za,tech-lead@instyle.co.za"

# Business Metrics
BUSINESS_DASHBOARD_URL="your_dashboard_url"
STATUS_PAGE_ID="your_status_page_id"

# Database
DATABASE_URL="your_cloudflare_d1_url"
```

---

## 🚀 Step-by-Step Implementation

### Phase 1: Cloudflare Analytics Setup (30 minutes)

#### 1.1 Configure Cloudflare Dashboard

1. **Navigate to Cloudflare Dashboard**
   - Go to Workers & Pages > `appointmentbooking-monorepo`
   - Enable Analytics if not already enabled

2. **Import Dashboard Configuration**

   ```bash
   # Use the provided JSON configuration
   # File: monitoring/cloudflare-analytics-config.json
   ```

3. **Configure Real-time Alerts**

   ```bash
   # Set up webhook notifications
   - Go to Notifications > Destinations
   - Add Slack webhook URL
   - Configure email notifications
   ```

#### 1.2 Performance Monitoring Setup

```bash
# Configure Workers Analytics
wrangler analytics query \
  --start=2025-12-24T00:00:00Z \
  --end=2025-12-24T23:59:59Z \
  --metric=requests \
  --dimension=country

# Set up D1 Database monitoring
wrangler d1 backup list appointmentbooking-db
```

#### 1.3 Traffic Analytics Configuration

```bash
# Configure real-time traffic monitoring
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/analytics/dashboard" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @monitoring/cloudflare-analytics-config.json
```

### Phase 2: Sentry APM Setup (45 minutes)

#### 2.1 Sentry Project Configuration

1. **Create Sentry Project**

   ```bash
   # Install Sentry SDK
   npm install @sentry/nextjs @sentry/cloudflare
   ```

2. **Configure Sentry Integration**

   ```json
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 0.1,
     profilesSampleRate: 0.01,
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
   });
   ```

3. **Import Configuration**

   ```bash
   # Use the provided Sentry configuration
   # File: monitoring/sentry-apm-config.json
   ```

#### 2.2 Custom Metrics Setup

```javascript
// Add to your application code
import * as Sentry from "@sentry/nextjs";

// Business metrics
Sentry.metrics.distribution('booking_conversion_rate', conversionRate, {
  tags: { service_type: serviceType, tenant: tenantId }
});

Sentry.metrics.distribution('revenue_processed', revenueAmount, {
  tags: { payment_method: paymentMethod }
});

// Performance metrics
Sentry.metrics.histogram('database_query_time', queryTime, {
  tags: { query_type: queryType, table: tableName }
});
```

#### 2.3 Alert Configuration

```bash
# Configure Sentry alerts via API
curl -X POST "https://sentry.io/api/0/projects/your-org/your-project/alert-rules/" \
  -H "Authorization: Bearer YOUR_SENTRY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Error Rate",
    "conditions": [
      {
        "id": "sentry.rules.conditions.first_seen_event",
        "match": "eq",
        "value": ""
      }
    ],
    "actions": [
      {
        "id": "sentry.rules.actions.notify_email",
        "name": "Send a notification to Email"
      }
    ],
    "frequency": 30
  }'
```

### Phase 3: Infrastructure Monitoring (30 minutes)

#### 3.1 Worker Performance Monitoring

```bash
# Configure Cloudflare Workers monitoring
wrangler tail --env production > worker_logs.txt &

# Set up CPU and memory monitoring
# File: monitoring/infrastructure-monitoring-config.json
```

#### 3.2 Database Performance Tracking

```sql
-- Enable query performance monitoring
PRAGMA analysis_limit=1000;
PRAGMA optimize;

-- Create indexes for better monitoring
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_created 
ON appointments (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);
```

#### 3.3 CDN and Edge Performance

```javascript
// Add performance monitoring to your Workers
export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now();
    
    try {
      const response = await handleRequest(request, env);
      const endTime = Date.now();
      
      // Record performance metrics
      await recordMetrics({
        response_time: endTime - startTime,
        status_code: response.status,
        user_agent: request.headers.get('user-agent'),
        country: request.cf?.country
      });
      
      return response;
    } catch (error) {
      await recordError(error);
      throw error;
    }
  }
};
```

### Phase 4: Security Monitoring (45 minutes)

#### 4.1 DDoS Protection Setup

1. **Cloudflare DDoS Configuration**

   ```bash
   # Configure DDoS protection rules
   # Go to Security > DDoS in Cloudflare Dashboard
   # Set up custom rules based on your traffic patterns
   ```

2. **Rate Limiting Rules**

   ```javascript
   // Add to Cloudflare Workers
   const rateLimiter = {
     '/api/auth/login': { limit: 5, window: 60000 },
     '/api/bookings': { limit: 10, window: 60000 },
     '/api/payments': { limit: 3, window: 60000 }
   };
   ```

#### 4.2 Authentication Security Monitoring

```javascript
// Add to authentication endpoints
export async function handleLogin(request) {
  const clientIP = request.headers.get('CF-Connecting-IP');
  const userAgent = request.headers.get('User-Agent');
  
  // Log authentication attempt
  await logSecurityEvent({
    event_type: 'login_attempt',
    client_ip: clientIP,
    user_agent: userAgent,
    timestamp: new Date().toISOString(),
    severity: 'info'
  });
  
  // Check for suspicious patterns
  await checkSuspiciousActivity(clientIP, userAgent);
}
```

#### 4.3 Security Dashboard Setup

```bash
# Import security monitoring configuration
# File: monitoring/security-monitoring-config.json

# Configure automated threat responses
# Set up webhooks for security alerts
```

### Phase 5: Business Metrics Monitoring (30 minutes)

#### 5.1 Conversion Tracking Setup

```javascript
// Add to your booking flow
export async function trackConversion(request) {
  const sessionId = getSessionId(request);
  
  await recordMetric('conversion_funnel_step', {
    step: 'booking_initiated',
    session_id: sessionId,
    timestamp: Date.now(),
    page_url: request.url,
    referrer: request.headers.get('referer')
  });
}
```

#### 5.2 Revenue Tracking

```javascript
// Add to payment completion
export async function recordRevenue(paymentData) {
  await recordMetric('revenue_processed', {
    amount: paymentData.amount,
    currency: paymentData.currency,
    service_type: paymentData.serviceType,
    payment_method: paymentData.method,
    customer_id: paymentData.customerId
  });
}
```

#### 5.3 Customer Analytics

```javascript
// Add customer journey tracking
export async function trackCustomerJourney(sessionData) {
  await recordMetric('customer_journey', {
    session_id: sessionData.id,
    page_views: sessionData.pageViews,
    time_spent: sessionData.duration,
    traffic_source: sessionData.source,
    device_type: sessionData.device,
    conversion_completed: sessionData.converted
  });
}
```

### Phase 6: Alert Configuration (45 minutes)

#### 6.1 Import Alert Rules

```bash
# Import alerting configuration
# File: monitoring/alerting-configuration.yaml

# Configure notification channels
# Set up escalation matrix
```

#### 6.2 Custom Alert Rules

```javascript
// Add custom alert logic to your application
export async function checkBusinessMetrics() {
  const metrics = await getBusinessMetrics();
  
  // Check conversion rate
  if (metrics.conversionRate < 0.12) {
    await sendAlert({
      type: 'warning',
      metric: 'conversion_rate',
      value: metrics.conversionRate,
      threshold: 0.12,
      message: 'Conversion rate below target'
    });
  }
  
  // Check revenue targets
  if (metrics.dailyRevenue < metrics.revenueTarget * 0.8) {
    await sendAlert({
      type: 'critical',
      metric: 'revenue',
      value: metrics.dailyRevenue,
      threshold: metrics.revenueTarget * 0.8,
      message: 'Daily revenue below target'
    });
  }
}
```

#### 6.3 Escalation Setup

```bash
# Configure PagerDuty (optional)
# Configure status page updates
# Set up automated incident response
```

---

## 📊 Dashboard Setup

### Executive Dashboard

```bash
# Import dashboard templates
# File: monitoring/dashboard-templates.json

# Configure sharing permissions
# Set up automated reporting
```

### Operations Dashboard

```javascript
// Add real-time metrics endpoint
export default {
  async fetch(request, env, ctx) {
    if (request.url.includes('/api/metrics/realtime')) {
      const metrics = await getRealTimeMetrics();
      return new Response(JSON.stringify(metrics), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // ... other routes
  }
};
```

### Security Dashboard

```bash
# Configure security event aggregation
# Set up threat intelligence feeds
# Enable automated incident creation
```

---

## 🧪 Testing & Validation

### 1. Test Alert Configuration

```bash
# Test critical alerts
curl -X POST "https://your-app.com/api/test-alert" \
  -H "Content-Type: application/json" \
  -d '{"alert_type": "critical", "message": "Test alert"}'

# Verify notification delivery
# Check Slack channels
# Check email inbox
```

### 2. Validate Dashboard Functionality

```bash
# Test dashboard loading
curl -I "https://your-dashboard.com/executive"
curl -I "https://your-dashboard.com/operations"
curl -I "https://your-dashboard.com/security"

# Verify real-time data updates
# Check mobile responsiveness
```

### 3. Performance Testing

```bash
# Load test monitoring endpoints
wrk -t12 -c400 -d30s "https://your-app.com/api/metrics"

# Verify alert performance
# Test notification delivery times
```

---

## 🔧 Configuration Management

### Environment-Specific Configs

```bash
# Production
cp monitoring/production-config.json monitoring/active-config.json

# Staging
cp monitoring/staging-config.json monitoring/active-config.json

# Development
cp monitoring/dev-config.json monitoring/active-config.json
```

### Configuration Validation

```bash
# Validate JSON configurations
python3 -m json.tool monitoring/*.json

# Validate YAML configurations
yamllint monitoring/*.yaml

# Test webhook endpoints
curl -X POST "$SLACK_WEBHOOK_URL" -d '{"text":"Test webhook"}'
```

### Backup & Recovery

```bash
# Backup current configurations
tar -czf monitoring-backup-$(date +%Y%m%d).tar.gz monitoring/

# Restore from backup
tar -xzf monitoring-backup-20251224.tar.gz
```

---

## 📈 Monitoring Best Practices

### 1. Metric Collection

- **Use meaningful metric names**: `booking_conversion_rate` vs `metric_1`
- **Include relevant tags**: service, region, tenant, user_type
- **Set appropriate sampling rates**: Don't over-collect
- **Consider cost implications**: Monitor your monitoring costs

### 2. Alert Management

- **Start with critical alerts only**: Avoid alert fatigue
- **Use clear alert names**: `High Error Rate` vs `Alert_001`
- **Include context in alerts**: Show current vs threshold values
- **Test alert paths regularly**: Ensure notifications work

### 3. Dashboard Design

- **Group related metrics**: Keep similar widgets together
- **Use consistent color schemes**: Green/Yellow/Red for status
- **Include time ranges**: Allow users to drill down
- **Mobile optimize**: Ensure dashboards work on mobile devices

### 4. Security Considerations

- **Limit dashboard access**: Use role-based permissions
- **Secure webhook endpoints**: Use HTTPS and authentication
- **Monitor monitoring access**: Track who accesses dashboards
- **Regular security reviews**: Update security configurations

---

## 🚨 Troubleshooting Guide

### Common Issues

#### Alerts Not Firing

```bash
# Check alert conditions
# Verify notification channels
# Test webhook endpoints
# Review error logs
```

#### Dashboard Not Loading

```bash
# Check API endpoints
# Verify authentication
# Review browser console errors
# Test data source connections
```

#### High False Positive Rate

```bash
# Review alert thresholds
# Adjust sensitivity levels
# Add suppression rules
# Refine condition logic
```

#### Performance Issues

```bash
# Monitor dashboard load times
# Check database query performance
# Review caching strategies
# Optimize metric collection
```

### Debug Commands

```bash
# Check Cloudflare Worker logs
wrangler tail --env production

# Monitor Sentry events
curl -H "Authorization: Bearer $SENTRY_API_KEY" \
  "https://sentry.io/api/0/projects/your-org/your-project/events/"

# Test Slack webhook
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-type: application/json' \
  --data '{"text":"Monitoring test message"}'

# Check email delivery
# Verify SMTP configuration
# Test email templates
```

---

## 📊 Cost Optimization

### Monitoring Costs

- **Sentry**: Free tier includes 5,000 errors/month
- **Cloudflare Analytics**: Included with Cloudflare plans
- **Custom Dashboards**: Consider data transfer costs
- **Email/SMS Notifications**: Monitor notification volume

### Cost Reduction Tips

1. **Sample data appropriately**: Don't collect everything
2. **Use aggregation**: Store summarized data, not raw events
3. **Implement retention policies**: Delete old data automatically
4. **Monitor your monitoring**: Track costs of monitoring tools

---

## 🔄 Maintenance Schedule

### Daily (Automated)

- [ ] Health check all monitoring systems
- [ ] Verify alert delivery
- [ ] Review dashboard availability
- [ ] Check for configuration drift

### Weekly

- [ ] Review alert false positive rates
- [ ] Analyze dashboard usage patterns
- [ ] Update threshold baselines
- [ ] Clean up old alert data

### Monthly

- [ ] Comprehensive configuration review
- [ ] Cost analysis and optimization
- [ ] Security access audit
- [ ] Performance optimization

### Quarterly

- [ ] Full disaster recovery test
- [ ] Security assessment
- [ ] Technology stack review
- [ ] Team training and updates

---

## 📞 Support & Escalation

### Internal Contacts

- **Operations Team**: <ops-team@instyle.co.za>
- **Security Team**: <security@instyle.co.za>
- **Technical Lead**: <tech-lead@instyle.co.za>
- **Business Owner**: <business-owner@instyle.co.za>

### External Support

- **Cloudflare Support**: <https://dash.cloudflare.com/support>
- **Sentry Support**: <https://sentry.io/support>
- **Status Page**: <https://status.your-domain.com>

### Emergency Procedures

1. **Acknowledge the alert**
2. **Assess severity level**
3. **Follow escalation matrix**
4. **Document actions taken**
5. **Update stakeholders**

---

**Document Control**

- **Version**: 1.0.0
- **Last Updated**: December 24, 2025
- **Next Review**: March 24, 2026
- **Owner**: Operations Team

---

*This guide should be regularly reviewed and updated based on operational experience and changing business requirements.*
