import { NextRequest, NextResponse } from 'next/server';

import { DEFAULT_TENANT_CONFIG, resolveTenantByHost } from '@repo/services';

// ============================================================================
// CLOUDFLARE MIGRATION: Multi-Tenant Middleware with NextAuth
// File: middleware.ts
// Purpose: Handle tenant routing, authentication, and security headers
// ============================================================================

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  let response = NextResponse.next();

  // CRITICAL: Bypass all internal, asset, and NextAuth API paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const tenant = resolveTenantByHost(hostname);
  const isPlatformTenant = tenant.slug === DEFAULT_TENANT_CONFIG.slug;

  response.headers.set('x-tenant-id', tenant.slug);
  response.headers.set('x-tenant-host', hostname);

  if (!isPlatformTenant && !url.pathname.startsWith('/api')) {
    const tenantRoute = tenant.route.endsWith('/') && tenant.route !== '/' ? tenant.route.slice(0, -1) : tenant.route;
    const normalizedPath = url.pathname === '/' ? '' : url.pathname;

    if (!url.pathname.startsWith(tenantRoute)) {
      const destinationPath = `${tenantRoute}${normalizedPath || ''}` || tenantRoute || '/';
      const rewriteUrl = new URL(destinationPath.startsWith('/') ? destinationPath : `/${destinationPath}`, request.url);
      const rewriteResponse = NextResponse.rewrite(rewriteUrl);
      rewriteResponse.headers.set('x-tenant-id', tenant.slug);
      rewriteResponse.headers.set('x-tenant-host', hostname);
      response = rewriteResponse;
    }
  }

  // ============================================================================
  // SECURITY HEADERS (Emergency Patch)
  // ============================================================================

  // HSTS - Force HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // X-Frame-Options - Prevent Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options - Prevent MIME Sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy - Privacy Protection
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy - Restrict Browser Features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")');

  // Content-Security-Policy - mitigate XSS
  // allowing unsafe-inline/eval for Next.js functionality, strictly scoped otherwise
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://js.stripe.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "connect-src 'self' https://api.stripe.com https://*.googleapis.com https://vitals.vercel-insights.com"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next|.*\\.).*)',
    '/',
    '/clerk',
    '/api/edge-config-test'  // Add our test route
  ],
};
