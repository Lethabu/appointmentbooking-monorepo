# 📊 Monitoring & Observability Guide

This guide outlines how to monitor the Instyle Hair Boutique platform in production.

## 1. Cloudflare Dashboard

### Workers & Pages
- **Real-time Logs**: Go to Workers & Pages > `appointmentbooking-monorepo` > Logs.
  - View live request/response data.
  - Filter by status code (e.g., `status:500`) to find errors.
- **Metrics**: View requests, CPU time, and duration charts.

### D1 Database
- **Metrics**: Monitor read/write operations and storage usage.
- **Query Performance**: Check for slow queries in the D1 dashboard.

## 2. Application Logging

The application logs critical events to the console, which are captured by Cloudflare.

### Key Events Logged
- **Booking Created**: `[Booking] Created appointment: <id>`
- **Payment Success**: `[Payment] Successful charge: <reference>`
- **Agent Interaction**: `[Agent API] Processing request for: <agent>`

## 3. Availability Monitoring

We recommend setting up an external uptime monitor (e.g., UptimeRobot, Better Stack) to ping the health endpoint.

- **Health Endpoint**: `https://www.instylehairboutique.co.za/api/health`
- **Expected Response**: `200 OK` `{"status":"ok"}`

## 4. Error Tracking (Recommended)

For advanced error tracking, integrate **Sentry**:

1.  Create a Sentry project for Next.js.
2.  Install the SDK:
    ```bash
    pnpm add @sentry/nextjs
    ```
3.  Configure `sentry.client.config.js` and `sentry.server.config.js`.
4.  Add `SENTRY_DSN` to your environment variables.

## 5. Manual Verification Commands

Use these commands to manually check system health:

```bash
# Check API Health
curl https://www.instylehairboutique.co.za/api/health

# Check Tenant Data
curl "https://www.instylehairboutique.co.za/api/tenant?slug=instylehairboutique"
```
