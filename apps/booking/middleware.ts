import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// CLOUDFLARE MIGRATION: Multi-Tenant Middleware with NextAuth
// File: middleware.ts
// Purpose: Handle tenant routing, authentication, and security headers
// ============================================================================

// Cloudflare KV or D1 based tenant resolution
// For now using static mapping, but can be extended to use D1 database
const TENANT_MAPPING: Record<string, string> = {
  'www.instylehairboutique.co.za': 'instylehairboutique',
  'instylehairboutique.co.za': 'instylehairboutique',
  'instyle-hair-boutique.co.za': 'instylehairboutique',
  'www.instyle-hair-boutique.co.za': 'instylehairboutique',
  // Add more tenant mappings as needed
};

async function resolveTenant(hostname: string): Promise<string | null> {
  const normalizedHost = hostname.replace(/^www\./, '');
  return TENANT_MAPPING[normalizedHost] || null;
}

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

  // Handle tenant routing for multi-tenant domains
  const tenantSlug = await resolveTenant(hostname);

  if (tenantSlug) {
    // Add tenant information to headers for downstream use
    response.headers.set('x-tenant-id', tenantSlug);
    response.headers.set('x-tenant-host', hostname);

    // For tenant-specific routes, rewrite to dynamic segment
    if (!url.pathname.startsWith('/api')) {
      const rewriteUrl = new URL(`/${tenantSlug}${url.pathname}`, request.url);
      const rewriteResponse = NextResponse.rewrite(rewriteUrl);
      rewriteResponse.headers.set('x-tenant-id', tenantSlug);
      rewriteResponse.headers.set('x-tenant-host', hostname);
      response = rewriteResponse;
    }
  } else if (
    hostname === 'www.appointmentbooking.co.za' ||
    hostname === 'appointmentbooking.co.za'
  ) {
    // For main platform domain, continue normally
    response = NextResponse.next();
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
