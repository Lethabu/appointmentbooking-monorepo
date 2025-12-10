# Monitoring Dashboard Setup Guide
# File: docs/MONITORING_DASHBOARD_SETUP.md

## Cloudflare Analytics Configuration

### Step 1: Enable Web Analytics

1. Login to Cloudflare Dashboard
2. Navigate to **Analytics & Logs** > **Web Analytics**
3. Click **Enable Web Analytics**
4. Copy the beacon token
5. Add to `apps/booking/app/layout.tsx`:

```typescript
<script
  defer
  src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_BEACON_TOKEN"}'
></script>
```

### Step 2: Configure Custom Events

Track key user actions:

```typescript
// Track booking completion
if (typeof window !== 'undefined' && window.cloudflare) {
  window.cloudflare.track('booking_completed', {
    service: serviceName,
    value: totalPrice,
  });
}
```

### Step 3: Set Up Alerts

1. Go to **Notifications**
2. Create alerts for:
   - High error rate (>1%)
   - Traffic spike (>1000 req/min)
   - Worker CPU exceeded (>50ms avg)

---

## Sentry Error Tracking

### Step 1: Install Sentry

```bash
cd apps/booking
pnpm add @sentry/nextjs
```

### Step 2: Initialize Sentry

Create `sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});
```

Create `sentry.server.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // Lower for server
});
```

### Step 3: Configure Alerts

1. Go to Sentry Dashboard
2. Navigate to **Alerts** > **Create Alert**
3. Set up alerts for:
   - New error types
   - Error spike (>10/min)
   - Performance degradation (>2s p95)

---

## Custom Metrics Dashboard

### Key Metrics to Track

#### Technical KPIs
- **Uptime:** 99.9% target
- **API Response Time:** <200ms (p95)
- **Page Load Time:** <2.5s
- **Error Rate:** <0.1%
- **Lighthouse Score:** >90

#### Business KPIs
- **Booking Conversion:** >15%
- **AI Resolution Rate:** >90%
- **Revenue (Daily/Monthly)**
- **Customer Satisfaction:** >4.5/5

#### User Experience KPIs
- **Booking Time:** <3min
- **Mobile Bounce Rate:** <40%
- **Repeat Customer Rate:** >60%

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│         INSTYLE DASHBOARD               │
├─────────────────────────────────────────┤
│                                         │
│  📊 Quick Stats (Today)                 │
│  ├─ Bookings: 12                        │
│  ├─ Revenue: R3,450                     │
│  ├─ AI Messages: 45                     │
│  └─ Resolution Rate: 93%                │
│                                         │
│  📈 Trends (7 Days)                     │
│  ├─ Booking Growth: +15%                │
│  ├─ Revenue Growth: +20%                │
│  └─ Customer Retention: 65%             │
│                                         │
│  🚨 Alerts                              │
│  ├─ No active alerts                    │
│  └─ Last check: 2 min ago               │
│                                         │
│  🤖 AI Performance                      │
│  ├─ Messages Handled: 450/week          │
│  ├─ Resolution Rate: 92%                │
│  ├─ Avg Response Time: 45s              │
│  └─ Handoffs: 8 (2 pending)             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Slack Integration

### Step 1: Create Slack Webhook

1. Go to Slack workspace
2. Navigate to **Apps** > **Incoming Webhooks**
3. Click **Add to Slack**
4. Select channel (e.g., #instyle-alerts)
5. Copy webhook URL

### Step 2: Configure Alerts

Add to `.env.production`:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Step 3: Send Alerts

```typescript
// Send alert to Slack
async function sendSlackAlert(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: message,
      username: 'Instyle Bot',
      icon_emoji: ':hair:',
    }),
  });
}

// Example usage
await sendSlackAlert('🚨 High error rate detected: 15 errors in last 5 minutes');
```

---

## Monitoring Checklist

### Daily (Automated)
- [ ] Check error rate (Sentry)
- [ ] Check uptime (Cloudflare)
- [ ] Check AI resolution rate
- [ ] Check booking conversion

### Weekly (Manual)
- [ ] Review analytics trends
- [ ] Check customer feedback
- [ ] Review AI conversations
- [ ] Optimize slow queries

### Monthly (Manual)
- [ ] Generate performance report
- [ ] Review and update KPIs
- [ ] Plan optimizations
- [ ] Update documentation

---

## Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | >0.5% | >1% |
| Response Time | >500ms | >1s |
| Uptime | <99.5% | <99% |
| AI Resolution | <85% | <80% |
| Booking Conversion | <12% | <10% |

---

## Monitoring Tools Summary

| Tool | Purpose | Cost |
|------|---------|------|
| **Cloudflare Analytics** | Traffic, performance | Free |
| **Sentry** | Error tracking | Free tier |
| **Slack** | Alerts | Free |
| **Custom Dashboard** | Business metrics | Included |

---

**Setup Time:** 2-3 hours  
**Maintenance:** 1 hour/week  
**ROI:** Early issue detection, improved uptime
