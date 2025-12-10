# Instyle Hair Boutique - Monitoring & Observability Setup

**Version:** 1.0  
**Date:** 2024-12-01  
**Status:** Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Monitoring Stack](#monitoring-stack)
3. [Cloudflare Analytics](#cloudflare-analytics)
4. [Error Tracking (Sentry)](#error-tracking-sentry)
5. [Performance Monitoring](#performance-monitoring)
6. [Business Metrics](#business-metrics)
7. [Alerting Strategy](#alerting-strategy)
8. [Dashboards](#dashboards)
9. [Implementation Steps](#implementation-steps)

---

## Overview

### Monitoring Objectives

1. **Technical Health:** Uptime, performance, errors
2. **Business Metrics:** Bookings, revenue, conversions
3. **User Experience:** Page load times, bounce rates, funnel completion
4. **AI Agent Performance:** Response times, success rates, escalations

### SLA Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | 99.9% | <99.5% |
| API Response Time (p95) | <200ms | >500ms |
| Page Load Time | <2.5s | >5s |
| Error Rate | <0.1% | >1% |
| AI Response Time | <60s | >120s |

---

## Monitoring Stack

### 1. Cloudflare Analytics (Built-in)
- **Purpose:** Infrastructure monitoring, traffic analysis
- **Cost:** Free (included with Workers)
- **Metrics:** Requests, bandwidth, cache hit ratio, errors

### 2. Sentry (Error Tracking)
- **Purpose:** Application error monitoring
- **Cost:** Free tier (5k events/month)
- **Features:** Stack traces, release tracking, user context

### 3. Cloudflare Web Analytics (RUM)
- **Purpose:** Real User Monitoring
- **Cost:** Free
- **Metrics:** Page views, bounce rate, time on site

### 4. Custom Dashboard (Grafana Cloud - Optional)
- **Purpose:** Unified metrics visualization
- **Cost:** Free tier available
- **Features:** Custom dashboards, alerting

---

## Cloudflare Analytics

### Setup

1. **Enable Analytics in Cloudflare Dashboard**
   - Navigate to: Workers & Pages → appointmentbooking → Analytics
   - Enable "Web Analytics" for the domain

2. **Add Analytics Script to Website**

```typescript
// apps/booking/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR_BEACON_TOKEN"}'
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Key Metrics to Monitor

#### Worker Analytics
- **Requests:** Total requests per minute/hour/day
- **Success Rate:** % of 2xx responses
- **Error Rate:** % of 4xx/5xx responses
- **CPU Time:** Worker execution time
- **Bandwidth:** Data transferred

#### Web Analytics
- **Page Views:** Total page views
- **Unique Visitors:** Unique users
- **Bounce Rate:** % of single-page sessions
- **Time on Site:** Average session duration
- **Top Pages:** Most visited pages

### Alerts Configuration

```yaml
# Cloudflare Notifications (configure in dashboard)
alerts:
  - name: "High Error Rate"
    condition: error_rate > 1%
    notification: email, slack
    
  - name: "Worker CPU Exceeded"
    condition: cpu_time > 50ms (p95)
    notification: email
    
  - name: "Traffic Spike"
    condition: requests > 1000/min
    notification: slack
```

---

## Error Tracking (Sentry)

### Setup

1. **Install Sentry SDK**

```bash
cd apps/booking
pnpm add @sentry/nextjs
```

2. **Configure Sentry**

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // User context
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
  
  // Ignore known errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  
  // Server-specific config
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
```

3. **Add to API Routes**

```typescript
// apps/booking/app/api/book/route.ts
import * as Sentry from '@sentry/nextjs';

export async function POST(req: Request) {
  try {
    // Your booking logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/book',
        tenantId: tenantId,
      },
      extra: {
        requestBody: await req.json(),
      },
    });
    
    throw error;
  }
}
```

### Error Categories

| Category | Severity | Response Time |
|----------|----------|---------------|
| Payment Failures | Critical | <2 hours |
| Booking API Errors | High | <4 hours |
| AI Agent Failures | Medium | <24 hours |
| UI Rendering Errors | Low | <1 week |

---

## Performance Monitoring

### 1. Lighthouse CI

**Setup:**

```bash
# Install Lighthouse CI
pnpm add -D @lhci/cli

# Create config
cat > lighthouserc.json << EOF
{
  "ci": {
    "collect": {
      "url": [
        "https://www.instylehairboutique.co.za/",
        "https://www.instylehairboutique.co.za/book/instylehairboutique"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
EOF
```

**Run in CI/CD:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm lhci autorun
```

### 2. Web Vitals Monitoring

```typescript
// apps/booking/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Custom Web Vitals Reporter:**

```typescript
// lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Performance Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | <2.5s | 2.5s-4s | >4s |
| FID (First Input Delay) | <100ms | 100ms-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| TTFB (Time to First Byte) | <800ms | 800ms-1.8s | >1.8s |

---

## Business Metrics

### Custom Analytics API

```typescript
// apps/booking/app/api/analytics/track/route.ts
export async function POST(req: Request) {
  const { event, properties } = await req.json();
  
  // Store in D1 database
  await env.DB.prepare(`
    INSERT INTO analytics_events (event_name, properties, timestamp)
    VALUES (?, ?, ?)
  `).bind(event, JSON.stringify(properties), Date.now()).run();
  
  return Response.json({ success: true });
}
```

### Events to Track

```typescript
// Client-side tracking
import { track } from '@/lib/analytics';

// Booking funnel
track('booking_started', { tenantId, serviceId });
track('booking_step_completed', { step: 1, tenantId });
track('booking_submitted', { tenantId, serviceId, amount });
track('payment_initiated', { tenantId, amount });
track('payment_completed', { tenantId, amount, method });

// User engagement
track('service_viewed', { serviceId, serviceName });
track('whatsapp_clicked', { tenantId, source: 'booking_confirmation' });
track('social_media_clicked', { platform: 'instagram' });

// AI Agent
track('ai_query_sent', { agent: 'Nia', query });
track('ai_response_received', { agent: 'Nia', responseTime });
track('ai_booking_completed', { agent: 'Nia', serviceId });
```

### Business Dashboard Queries

```sql
-- Daily bookings
SELECT 
  DATE(created_at) as date,
  COUNT(*) as bookings,
  SUM(price) as revenue
FROM appointments
WHERE tenant_id = ?
  AND created_at >= datetime('now', '-30 days')
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Conversion funnel
SELECT 
  event_name,
  COUNT(*) as count,
  COUNT(*) * 100.0 / LAG(COUNT(*)) OVER (ORDER BY timestamp) as conversion_rate
FROM analytics_events
WHERE event_name IN ('booking_started', 'booking_step_completed', 'booking_submitted', 'payment_completed')
GROUP BY event_name;

-- Popular services
SELECT 
  s.name,
  COUNT(a.id) as bookings,
  SUM(s.price) as revenue
FROM appointments a
JOIN services s ON a.service_id = s.id
WHERE a.tenant_id = ?
  AND a.created_at >= datetime('now', '-7 days')
GROUP BY s.id
ORDER BY bookings DESC
LIMIT 5;

-- AI Agent performance
SELECT 
  agent_name,
  COUNT(*) as queries,
  AVG(response_time_ms) as avg_response_time,
  SUM(CASE WHEN resolved = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate
FROM ai_agent_logs
WHERE tenant_id = ?
  AND created_at >= datetime('now', '-7 days')
GROUP BY agent_name;
```

---

## Alerting Strategy

### Alert Channels

1. **Email:** Critical alerts (downtime, payment failures)
2. **Slack:** High-priority alerts (error spikes, performance degradation)
3. **SMS:** Emergency alerts (complete outage)
4. **Dashboard:** All alerts visible in admin panel

### Alert Rules

```typescript
// packages/worker/src/monitoring/alerts.ts
export const alertRules = [
  {
    name: 'High Error Rate',
    condition: (metrics) => metrics.errorRate > 0.01, // >1%
    severity: 'critical',
    channels: ['email', 'slack'],
    cooldown: 300, // 5 minutes
  },
  {
    name: 'Slow API Response',
    condition: (metrics) => metrics.apiResponseTimeP95 > 500, // >500ms
    severity: 'high',
    channels: ['slack'],
    cooldown: 600, // 10 minutes
  },
  {
    name: 'AI Agent Failure',
    condition: (metrics) => metrics.aiSuccessRate < 0.9, // <90%
    severity: 'medium',
    channels: ['slack'],
    cooldown: 1800, // 30 minutes
  },
  {
    name: 'Low Booking Conversion',
    condition: (metrics) => metrics.bookingConversion < 0.1, // <10%
    severity: 'low',
    channels: ['email'],
    cooldown: 86400, // 24 hours
  },
];
```

### Alert Notification Template

```typescript
// Slack webhook payload
{
  "text": "🚨 *High Error Rate Alert*",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Alert:* High Error Rate\n*Severity:* Critical\n*Current Value:* 2.5%\n*Threshold:* 1%"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Tenant:*\nInstyle Hair Boutique"
        },
        {
          "type": "mrkdwn",
          "text": "*Time:*\n2024-12-01 20:30 SAST"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Dashboard"
          },
          "url": "https://dash.cloudflare.com/..."
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Logs"
          },
          "url": "https://sentry.io/..."
        }
      ]
    }
  ]
}
```

---

## Dashboards

### 1. Technical Health Dashboard

**Metrics:**
- Uptime (last 24h, 7d, 30d)
- Request rate (requests/min)
- Error rate (%)
- API response time (p50, p95, p99)
- Worker CPU time
- Database query time

**Visualization:**
```
┌─────────────────────────────────────────┐
│ Uptime: 99.95% (Last 30 days)          │
│ ✅ All systems operational              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Request Rate                            │
│ ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁ 45 req/min             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ API Response Time (p95)                 │
│ ▁▁▂▂▃▃▄▄▅▅▆▆▇▇█ 185ms                  │
└─────────────────────────────────────────┘
```

### 2. Business Metrics Dashboard

**Metrics:**
- Today's bookings
- Weekly revenue
- Booking conversion rate
- Popular services
- Peak booking times
- New vs returning customers

**Visualization:**
```
┌─────────────────────────────────────────┐
│ Today's Bookings: 12                    │
│ Weekly Revenue: R13,500                 │
│ Conversion Rate: 15.2% ↑ 2.1%          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Popular Services (This Week)            │
│ 1. Middle & Side (15) ████████████      │
│ 2. Maphondo (12)      ██████████        │
│ 3. Soft Glam (8)      ██████            │
└─────────────────────────────────────────┘
```

### 3. AI Agent Dashboard

**Metrics:**
- Queries handled
- Success rate
- Average response time
- Escalations to human
- Booking completion rate

**Visualization:**
```
┌─────────────────────────────────────────┐
│ Nia (Booking Assistant)                 │
│ Queries: 45 | Success: 92% | Avg: 42s  │
│ ████████████████████░░░░                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Response Time Distribution              │
│ <30s:  ████████████████ 60%             │
│ 30-60s: ████████ 30%                    │
│ >60s:   ██ 10%                          │
└─────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Foundation (Week 1)

1. **Set up Cloudflare Analytics**
   - [ ] Enable Web Analytics in Cloudflare dashboard
   - [ ] Add beacon script to website
   - [ ] Configure basic alerts (uptime, error rate)

2. **Set up Sentry**
   - [ ] Create Sentry project
   - [ ] Install SDK in Next.js app
   - [ ] Configure error filtering
   - [ ] Test error reporting

3. **Create Analytics Database Tables**
   ```sql
   CREATE TABLE analytics_events (
     id TEXT PRIMARY KEY,
     tenant_id TEXT NOT NULL,
     event_name TEXT NOT NULL,
     properties TEXT,
     timestamp INTEGER NOT NULL
   );
   
   CREATE INDEX idx_events_tenant ON analytics_events(tenant_id, timestamp);
   ```

### Phase 2: Business Metrics (Week 2)

4. **Implement Event Tracking**
   - [ ] Add tracking to booking funnel
   - [ ] Add tracking to AI agent interactions
   - [ ] Add tracking to user engagement

5. **Create Business Dashboard**
   - [ ] Build analytics API endpoints
   - [ ] Create dashboard UI components
   - [ ] Add charts and visualizations

### Phase 3: Advanced Monitoring (Week 3)

6. **Set up Performance Monitoring**
   - [ ] Configure Lighthouse CI
   - [ ] Add Web Vitals tracking
   - [ ] Create performance dashboard

7. **Configure Alerting**
   - [ ] Set up Slack webhook
   - [ ] Configure alert rules
   - [ ] Test alert notifications

### Phase 4: Optimization (Week 4)

8. **Review and Optimize**
   - [ ] Analyze metrics and identify bottlenecks
   - [ ] Optimize slow queries
   - [ ] Reduce error rates
   - [ ] Improve conversion rates

---

## Monitoring Checklist

### Daily
- [ ] Check error rate in Sentry
- [ ] Review booking conversion funnel
- [ ] Monitor AI agent success rate
- [ ] Check for any alerts

### Weekly
- [ ] Review performance metrics (Lighthouse scores)
- [ ] Analyze popular services and peak times
- [ ] Review customer feedback
- [ ] Check uptime and reliability

### Monthly
- [ ] Generate business metrics report
- [ ] Review and update alert thresholds
- [ ] Analyze trends and patterns
- [ ] Plan optimizations

---

## Appendix

### Useful Commands

```bash
# View Cloudflare Worker logs
wrangler tail

# Run Lighthouse audit
pnpm lhci autorun

# Check Sentry errors
open https://sentry.io/organizations/your-org/issues/

# Query analytics
wrangler d1 execute appointmentbooking-db --command "SELECT * FROM analytics_events LIMIT 10"
```

### Resources

- [Cloudflare Analytics Docs](https://developers.cloudflare.com/analytics/)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Maintained By:** DevOps Team  
**Last Updated:** 2024-12-01  
**Next Review:** 2024-12-15
