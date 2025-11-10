import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ============================================================================
// CLOUDFLARE MIGRATION: Multi-Tenant Middleware with NextAuth
// File: middleware.ts
// Purpose: Handle tenant routing and authentication for Cloudflare deployment
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
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantSlug);
    response.headers.set('x-tenant-host', hostname);

    // For tenant-specific routes, rewrite to dynamic segment
    if (!url.pathname.startsWith('/api')) {
      const rewriteUrl = new URL(`/${tenantSlug}${url.pathname}`, request.url);
      const rewriteResponse = NextResponse.rewrite(rewriteUrl);
      rewriteResponse.headers.set('x-tenant-id', tenantSlug);
      rewriteResponse.headers.set('x-tenant-host', hostname);
      return rewriteResponse;
    }

    return response;
  }

  // For main platform domain, continue normally
  if (
    hostname === 'www.appointmentbooking.co.za' ||
    hostname === 'appointmentbooking.co.za'
  ) {
    return NextResponse.next();
  }

  // Default: continue with request
  return NextResponse.next();
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
