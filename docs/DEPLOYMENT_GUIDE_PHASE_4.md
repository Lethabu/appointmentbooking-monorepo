# Phase 4 Deployment Guide: Launching appointmentbooking.co.za

This guide details the steps to deploy the finalized Marketing Site and the Notification Worker.

## Prerequisites

- [x] Node.js & pnpm installed
- [ ] Cloudflare Account
- [ ] Wrangler CLI authenticated (`npx wrangler login`)

## 1. Deploying the Marketing Site (Cloudflare Pages)

The marketing site is built with Next.js. We use `@cloudflare/next-on-pages` or static export.

### Build & Deploy

Run the following from the root:

```bash
# Build the application
pnpm --filter marketing run build

# Deploy to Cloudflare Pages
pnpm --filter marketing run pages:deploy
```

*Note: Ensure your `apps/marketing/package.json` has the correct `pages:deploy` script set to `wrangler pages deploy .vercel/output/static` (if using Vercel build output) or `out` (if static export).*

## 2. Deploying the Notification Worker

The notification service runs as a Cloudflare Worker.

### Deploy

```bash
cd packages/worker
pnpm run deploy
```

## 3. Post-Deployment Verification

1. Visit `https://appointmentbooking.co.za` (or your staging URL).
2. Verify the landing page loads with the new design.
3. specific: Test the AI Chat widget (Nia) functionality.
4. Test the "Book Now" flow.

## Troubleshooting

- If the build fails on Cloudflare, ensure the `NODE_VERSION` environment variable is set to `18` or higher.
- If the Worker fails to send notifications, check the D1 `notifications` table for error logs.
