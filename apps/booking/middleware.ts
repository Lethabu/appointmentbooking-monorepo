import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// ROUTER UNIFICATION FIX: App Router Optimized Middleware
// File: middleware.ts
// Purpose: Resolve routing conflicts and enable multi-tenant functionality
// ============================================================================

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Add a cache-control header
  request.headers.set('x-middleware-cache', 'no-cache');

  // CRITICAL: Bypass all internal, asset, and API paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const tenants: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instylehairboutique',
    'instylehairboutique.co.za': 'instylehairboutique',
    'instyle-hair-boutique.co.za': 'instylehairboutique',
    'www.instyle-hair-boutique.co.za': 'instylehairboutique',
  };

  const tenantSlug = tenants[hostname.replace('www.', '')];

  if (tenantSlug) {
    // Rewrite to the App Router dynamic segment path
    const rewriteUrl = new URL(`/${tenantSlug}${url.pathname}`, request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-forwarded-host', hostname);
    return response;
  }

  // For the main domain, ensure it resolves to the platform pages
  if (
    hostname === 'www.appointmentbooking.co.za' ||
    hostname === 'appointmentbooking.co.za'
  ) {
    // Route to platform pages in (main) route group
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except API routes and static assets
    '/((?!api|_next|.*\\.).*)',
    '/',
    '/clerk'
  ],
};
