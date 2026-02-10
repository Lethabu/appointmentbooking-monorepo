# Advanced Monitoring & Analytics Setup

## Overview
Set up comprehensive monitoring for your AppointmentBooking platform with error tracking, performance monitoring, and analytics.

## Architecture

```
┌─────────────────┐
│  Cloudflare     │
│  Analytics      │─────┐
└─────────────────┘     │
                        │
┌─────────────────┐     │     ┌──────────────┐
│  Sentry         │     ├────→│  Dashboard   │
│  Error Tracking │─────┘     │  (Graphana/  │
└─────────────────┘           │   Custom)    │
                        ┌─────→              │
┌─────────────────┐     │     └──────────────┘
│  Cloudflare     │     │
│  Web Analytics  │─────┘
└─────────────────┘
```

## Components

1. **Sentry** - Error & Performance Tracking
2. **Cloudflare Analytics** - Traffic & Performance Metrics
3. **Cloudflare Web Analytics** - User Behavior & Page Views
4. **Health Monitoring** - Uptime & API Health Checks
5. **Custom Metrics** - Business KPIs

---

## 1. Sentry Setup (Error Tracking)

### Create Sentry Account & Projects

1. Go to https://sentry.io and sign up
2. Create organization: "AppointmentBooking"
3. Create three projects:
   - `appointmentbooking-worker` (Platform: Node.js)
   - `appointmentbooking-booking` (Platform: Next.js)
   - `appointmentbooking-dashboard` (Platform: Next.js)

### Get DSN URLs

For each project, note the DSN format:
```
https://<key>@<org>.ingest.sentry.io/<project-id>
```

### Configure Worker Sentry

**File:** `packages/worker/src/index.ts`

Add at the top:
```typescript
import * as Sentry from '@sentry/cloudflare';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize Sentry
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.ENVIRONMENT || 'production',
      tracesSampleRate: 1.0,
    });

    try {
      // Your existing code...
      const response = await handleRequest(request, env);
      return response;
    } catch (error) {
      Sentry.captureException(error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
```

Install Sentry SDK:
```powershell
cd packages/worker
npm install @sentry/cloudflare
```

Set DSN secret:
```powershell
npx wrangler secret put SENTRY_DSN --name appointmentbooking-worker
# Paste Worker DSN
```

### Configure Next.js Apps with Sentry

**Install Sentry SDK:**
```powershell
cd apps/booking
npm install @sentry/nextjs
```

**Create `sentry.client.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Create `sentry.server.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Create `sentry.edge.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Update `next.config.js`:**
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing config...
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: 'your-org',
  project: 'appointmentbooking-booking',
});
```

**Set environment variables:**
```powershell
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-booking
npx wrangler pages secret put NEXT_PUBLIC_SENTRY_DSN --project-name=appointmentbooking-booking
```

### Configure Alerts

In Sentry Dashboard:
1. Go to **Alerts** > **Create Alert**
2. Create alerts for:
   - Error rate >10/minute
   - New error types
   - Performance degradation (p95 >1s)
3. Configure notifications (Email, Slack, PagerDuty)

---

## 2. Cloudflare Analytics

### Enable Analytics Dashboard

Already enabled by default! Access at:
```
https://dash.cloudflare.com/9e96c83268cae3e0f27168ed50c92033
```

Navigate to:
- **Workers & Pages** > **appointmentbooking-worker** > **Metrics**
- **Workers & Pages** > **appointmentbooking-booking** > **Analytics**

### Key Metrics to Monitor

**Worker Metrics:**
- Requests per second
- Success rate (status 200)
- Error rate (status 5xx)
- CPU time
- Duration (ms)

**Pages Metrics:**
- Page views
- Unique visitors
- Bandwidth usage
- Cache hit ratio

### Set Up Graphql Analytics API

Create analytics dashboard script:

**File:** `scripts/analytics-dashboard.ps1`

```powershell
$accountId = "9e96c83268cae3e0f27168ed50c92033"
$apiToken = $env:CLOUDFLARE_API_TOKEN

$query = @"
query {
  viewer {
    accounts(filter: {accountTag: \"$accountId\"}) {
      workersInvocationsAdaptive(
        filter: {scriptName: \"appointmentbooking-worker\"}
        limit: 100
        orderBy: [datetimeMinute_DESC]
      ) {
        sum {
          requests
          errors
        }
        dimensions {
          datetimeMinute
        }
      }
    }
  }
}
"@

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

$body = @{
    query = $query
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://api.cloudflare.com/client/v4/graphql" -Headers $headers -Body $body
```

---

## 3. Cloudflare Web Analytics

### Set Up Web Analytics (Privacy-Friendly)

1. Go to **Analytics & Logs** > **Web Analytics** in Cloudflare Dashboard
2. Click **Add a site**
3. Enter site name: "AppointmentBooking Booking"
4. Get tracking snippet

### Install Tracking Code

**Option A: Via Script Tag (Quick)**

Add to `apps/booking/app/layout.tsx`:
```typescript
export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html>
      <head>
        <script 
          defer 
          src='https://static.cloudflareinsights.com/beacon.min.js' 
          data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Option B: Via Environment Variable**

```typescript
export default function RootLayout({ children }: { children: React.Node }) {
  const cfToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  
  return (
    <html>
      <head>
        {cfToken && (
          <script 
            defer 
            src='https://static.cloudflareinsights.com/beacon.min.js' 
            data-cf-beacon={`{"token": "${cfToken}"}`}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Set environment variable:
```powershell
npx wrangler pages secret put NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN --project-name=appointmentbooking-booking
# Paste your token
```

---

## 4. Health Monitoring & Uptime

### Use Cloudflare Health Checks

1. Go to **Traffic** > **Health Checks**
2. Create health check:
   - **Name:** Worker API Health  
   - **URL:** `https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health`
   - **Interval:** Every 60 seconds
   - **Expected status:** 200
   - **Expected body:** Contains "healthy"

3. Configure notifications:
   - Email when health check fails
   - Webhook to Slack/Discord

### Alternative: UptimeRobot

1. Sign up at https://uptimerobot.com (Free plan: 50 monitors)
2. Add monitors:
   - Worker API: `https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health`
   - Booking Pages: `https://appointmentbooking-booking.pages.dev`
   - Dashboard: `https://appointmentbooking-dashboard.pages.dev`
3. Set check interval: 5 minutes
4. Configure email/SMS alerts

### Create Custom Health Dashboard

**File:** `scripts/health-dashboard.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>AppointmentBooking Health Dashboard</title>
    <style>
        body { font-family: system-ui; padding: 20px; }
        .service { padding: 15px; margin: 10px 0; border-radius: 8px; }
        .healthy { background: #d4edda; color: #155724; }
        .unhealthy { background: #f8d7da; color: #721c24; }
        .metric { display: inline-block; margin-right: 20px; }
    </style>
    <script>
        async function checkHealth() {
            const services = [
                { name: 'Worker API', url: 'https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health' },
                { name: 'Products API', url: 'https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/products?limit=1' },
                { name: 'Booking Pages', url: 'https://appointmentbooking-booking.pages.dev' },
                { name: 'Dashboard', url: 'https://appointmentbooking-dashboard.pages.dev' }
            ];

            for (const service of services) {
                const start = Date.now();
                try {
                    const response = await fetch(service.url);
                    const duration = Date.now() - start;
                    const status = response.ok ? 'healthy' : 'unhealthy';
                    
                    document.getElementById(service.name).innerHTML = `
                        <strong>${service.name}</strong>
                        <div class="metric">Status: ${response.status}</div>
                        <div class="metric">Response Time: ${duration}ms</div>
                    `;
                    document.getElementById(service.name).className = `service ${status}`;
                } catch (error) {
                    document.getElementById(service.name).innerHTML = `
                        <strong>${service.name}</strong>
                        <div class="metric">Status: Error - ${error.message}</div>
                    `;
                    document.getElementById(service.name).className = 'service unhealthy';
                }
            }
        }

        setInterval(checkHealth, 30000); // Check every 30 seconds
        checkHealth(); // Initial check
    </script>
</head>
<body>
    <h1>🏥 AppointmentBooking Health Dashboard</h1>
    <p>Last updated: <span id="timestamp"></span></p>
    
    <div id="Worker API" class="service">Loading...</div>
    <div id="Products API" class="service">Loading...</div>
    <div id="Booking Pages" class="service">Loading...</div>
    <div id="Dashboard" class="service">Loading...</div>

    <script>
        setInterval(() => {
            document.getElementById('timestamp').textContent = new Date().toLocaleString();
        }, 1000);
    </script>
</body>
</html>
```

---

## 5. Custom Business Metrics

### Track Key Business Events

**Worker Event Tracking:**

```typescript
// In packages/worker/src/index.ts

async function trackEvent(env: Env, event: string, metadata: any) {
  await env.ANALYTICS.writeDataPoint({
    indexes: [event],
    doubles: [metadata.value || 0],
    blobs: [JSON.stringify(metadata)]
  });
}

// Usage examples:
await trackEvent(env, 'booking_created', { tenantId, serviceId, amount });
await trackEvent(env, 'payment_completed', { amount, method: 'paystack' });
await trackEvent(env, 'api_error', { endpoint, statusCode: 500 });
```

**Add Analytics Binding to wrangler.toml:**

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

### Query Custom Metrics

```graphql
query {
  viewer {
    accounts(filter: {accountTag: "9e96c83268cae3e0f27168ed50c92033"}) {
      workersAnalyticsEngineDatasets {
        analyticsEngine(
          filter: {
            dataset: "appointmentbooking-worker"
            index: "booking_created"
          }
        ) {
          count
          sum {
            doubles
          }
        }
      }
    }
  }
}
```

---

## 6. Monitoring Dashboard Setup

### Option A: Grafana Cloud (Free Tier)

1. Sign up at https://grafana.com
2. Create Cloudflare data source
3. Import pre-built dashboard: https://grafana.com/grafana/dashboards/13133
4. Customize with your metrics

### Option B: Custom Dashboard

Create `monitoring-dashboard.html` with:
- Real-time health checks
- Error rate graphs
- Response time charts
- Business metrics (bookings, revenue)

---

## 7. Alert Configuration

### Critical Alerts (Immediate Response)

- Worker error rate >5% for 5 minutes
- API response time >2s (p95)
- Health check failure
- Database connection errors
- Payment processing failures

### Warning Alerts (Monitor)

- Error rate >2% for 15 minutes
- API response time >1s (p95)
- Slow database queries (>500ms)
- High memory usage (>80%)

### Informational Alerts

- Deployment successful
- New error types detected
- Daily metrics summary

### Configure Alert Channels

**Sentry:**
- Project Settings > Alerts > Add Alert Rule
- Choose notification channel (Email, Slack, PagerDuty)

**Cloudflare:**
- Account Notifications
- Set up email alerts for:
  - Worker errors
  - Health check failures
  - DDoS attacks

---

## 8. Monitoring Checklist

### Daily Checks
- [ ] Review error rates in Sentry
- [ ] Check API response times
- [ ] Monitor active users
- [ ] Review failed payments

### Weekly Checks
- [ ] Review performance trends
- [ ] Check error patterns
- [ ] Monitor resource usage
- [ ] Review alert configurations

### Monthly Checks
- [ ] Analyze traffic patterns
- [ ] Review and update alert thresholds
- [ ] Check billing and usage costs
- [ ] Update monitoring documentation

---

## 9. Cost Estimation

**Free Tier Coverage:**
- ✅ Cloudflare Analytics: Unlimited (included)
- ✅ Cloudflare Web Analytics: Unlimited (included)
- ✅ Sentry: 5K errors/month (free tier)
- ✅ UptimeRobot: 50 monitors (free tier)
- ✅ Grafana Cloud: 10K series (free tier)

**Estimated Monthly Cost: $0-10**
(Stays free for most small to medium businesses)

---

## 10. Quick Setup Script

Create `scripts/setup-monitoring.ps1`:

```powershell
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Advanced Monitoring Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Install Sentry SDK
Write-Host "[1/4] Installing Sentry SDKs..." -ForegroundColor Green
cd packages/worker
npm install @sentry/cloudflare

cd ../../apps/booking
npm install @sentry/nextjs

cd ../dashboard
npm install @sentry/nextjs

# Configure Sentry DSNs
Write-Host "`n[2/4] Configuring Sentry..." -ForegroundColor Green
Write-Host "Enter Sentry DSN for Worker:" -NoNewline
$workerDSN = Read-Host
Write-Host "Enter Sentry DSN for Booking:" -NoNewline
$bookingDSN = Read-Host

npx wrangler secret put SENTRY_DSN --name appointmentbooking-worker <<< $workerDSN
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-booking <<< $bookingDSN

# Set up Web Analytics
Write-Host "`n[3/4] Web Analytics token:" -NoNewline
$waToken = Read-Host
npx wrangler pages secret put NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN --project-name=appointmentbooking-booking <<< $waToken

Write-Host "`n[4/4] Setting up health checks..." -ForegroundColor Green
Write-Host "Visit: https://dash.cloudflare.com/9e96c83268cae3e0f27168ed50c92033"
Write-Host "Go to Traffic > Health Checks to configure"

Write-Host "`n✅ Monitoring setup complete!`n" -ForegroundColor Green
```

---

## Next Steps

1. ✅ Set up Sentry projects and configure DSNs
2. ✅ Enable Cloudflare Web Analytics
3. ✅ Configure health checks
4. ✅ Set up alert notifications
5. ✅ Create monitoring dashboard
6. ✅ Test all monitoring systems

**Estimated Setup Time: 20-30 minutes**
