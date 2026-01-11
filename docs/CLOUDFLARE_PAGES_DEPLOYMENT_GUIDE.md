# Next.js on Cloudflare Pages - Comprehensive Deployment Guide

## Overview

This document provides best practices for deploying Next.js 14 applications to Cloudflare Pages using `@cloudflare/next-on-pages`.

## Architecture Considerations

### Hybrid Static/Serverless Deployment

Cloudflare Pages with `@cloudflare/next-on-pages` supports:

- **Static pages**: Pages with `export const dynamic = 'force-static'` or no dynamic features
- **Edge serverless functions**: Pages/routes with `export const runtime = 'edge'`

### Key Configuration Files

#### 1. wrangler.toml

```toml
name = "appointment-booking-coza"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[pages]
build_command = "npx @cloudflare/next-on-pages"
# Optional: Specify output directory
# output_directory = ".vercel/output"

# Caching configuration
[env_vars]
# Environment variables are loaded from .env files
```

#### 2. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better edge support
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Images configuration for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
  
  // SWC minification
  swcMinify: true,
  
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Setup Cloudflare Pages development platform
  ...(process.env.NODE_ENV === 'development' && {
    onDevSdkRequestRefresh: true,
  }),
};

module.exports = nextConfig;
```

#### 3. Runtime Configuration

##### Root Layout (app/layout.tsx)

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appointment Booking',
  description: 'Professional appointment booking platform',
};

// Required for Cloudflare Pages
export const runtime = 'edge';

// Optional: Force dynamic for authenticated routes
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

##### API Routes (app/api/*/route.ts)

```typescript
import { NextResponse } from 'next/server';

// REQUIRED: Edge runtime for Cloudflare Pages
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ data: 'Hello' });
}
```

## Best Practices

### 1. Route Classification

| Route Type | Runtime | Static Export |
|------------|---------|---------------|
| Marketing pages | edge | Yes |
| API routes | edge | No |
| Dashboard pages | edge | No |
| Static content | - | Yes |

### 2. Environment Variables

- Use Cloudflare Dashboard for sensitive variables
- Prefix non-sensitive variables with `NEXT_PUBLIC_`
- Do NOT commit `.env` files to version control

### 3. Build Optimization

```bash
# Use pnpm for monorepo support
pnpm install
pnpm exec next build

# Build with increased memory for large projects
NODE_OPTIONS='--max-old-space-size=8192' pnpm exec next build
```

### 4. Performance Optimization

- Use `next/image` with `unoptimized: true` for static export
- Enable compression in wrangler.toml
- Configure caching headers in `_headers` file

### 5. Debugging Deployment Issues

Common issues and solutions:

1. **"Routes not configured for Edge Runtime"**
   - Add `export const runtime = 'edge'` to each route file

2. **"Node.js APIs not supported"**
   - Replace Node-specific imports (fs, path, etc.) with Edge-compatible alternatives

3. **"Build exceeds size limits"**
   - Use dynamic imports for large components
   - Enable tree shaking
   - Use lighter alternatives to heavy libraries

## Deployment Scripts

### Production Deployment

```bash
# Install dependencies
pnpm install

# Build
pnpm exec next build

# Convert to Cloudflare format
pnpm exec next-on-pages

# Deploy
npx wrangler pages deploy .vercel/output --project-name=YOUR_PROJECT
```

### Preview Deployment

```bash
# Build and preview locally
pnpm exec next-on-pages --preview

# Or use wrangler pages dev
npx wrangler pages dev .vercel/output
```

## Monitoring and Debugging

### 1. Cloudflare Dashboard

- Monitor edge function invocations
- View error logs
- Configure custom domains

### 2. Local Development

```bash
# Development with Cloudflare Pages
npx wrangler pages dev .

# With specific directory
npx wrangler pages dev .vercel/output
```

## Security Considerations

1. **Environment Variables**
   - Never expose sensitive keys client-side
   - Use Cloudflare Secrets for production

2. **CORS**
   - Configure proper CORS headers in API routes

3. **Rate Limiting**
   - Implement rate limiting in API routes
   - Consider using Cloudflare Rate Limiting

## Migration Checklist

- [ ] Update `wrangler.toml` with correct build command
- [ ] Update `next.config.js` for edge compatibility
- [ ] Add `export const runtime = 'edge'` to all API routes
- [ ] Update root layout with edge runtime
- [ ] Test locally with `wrangler pages dev`
- [ ] Configure environment variables in Cloudflare Dashboard
- [ ] Set up custom domains
- [ ] Configure error pages and redirects
- [ ] Test deployment in staging before production

## Troubleshooting Commands

```bash
# Check wrangler installation
npx wrangler --version

# Login to Cloudflare
npx wrangler login

# List deployments
npx wrangler pages deployment list --project-name=YOUR_PROJECT

# View logs
npx wrangler pages deployment tail --project-name=YOUR_PROJECT
```
