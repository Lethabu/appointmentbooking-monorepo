// @ts-nocheck
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// ROUTER UNIFICATION FIX: App Router Optimized Middleware
// File: middleware.ts
// Purpose: Resolve routing conflicts and enable multi-tenant functionality
// ============================================================================

// Prefer fetching tenant routing from Vercel Edge Config for ultra-fast lookups.
// If Edge Config is not available at runtime, fall back to a local map to
// preserve existing behavior (useful for local dev and CI).
async function resolveTenantFromEdgeConfig(hostname: string) {
  try {
    // Dynamically import edge-config helpers to keep dev environment flexible
    // The `get` function is available from '@vercel/edge-config' in Edge runtime.
    // We'll attempt to use it; if it fails (not deployed on Vercel), we ignore it.
    // Note: In some environments this import may throw, hence wrapped in try/catch.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { get } = await import('@vercel/edge-config');
    const tenantsRaw = await get('tenants');
    if (!tenantsRaw) return undefined;
    // Expecting tenantsRaw to be a JSON object mapping host -> tenantSlug
    const normalizedHost = hostname.replace(/^www\./, '');
    return tenantsRaw[normalizedHost] || undefined;
  } catch (err) {
    // Edge Config not available — caller will use fallback map
    return undefined;
  }
}

// Annotate params to satisfy TS and avoid implicit any errors in linters.
// Keep `clerkMiddleware` usage the same to preserve existing auth behavior.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default clerkMiddleware(async (auth: any, request: NextRequest) => {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Add a cache-control header for downstream services (can be adjusted later)
  request.headers.set('x-middleware-cache', 'no-cache');

  // CRITICAL: Bypass all internal, asset, and API paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Try Edge Config first (fast, global), fallback to local map
  const tenantFromEdge = await resolveTenantFromEdgeConfig(hostname);
  const tenantsFallback: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instylehairboutique',
    'instylehairboutique.co.za': 'instylehairboutique',
    'instyle-hair-boutique.co.za': 'instylehairboutique',
    'www.instyle-hair-boutique.co.za': 'instylehairboutique',
  };

  const normalizedHost = hostname.replace(/^www\./, '');
  const tenantSlug = tenantFromEdge || tenantsFallback[normalizedHost];

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

// Test route to verify Edge Config directly
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Special test route for Edge Config
  if (pathname === '/api/edge-config-test') {
    try {
      const { get } = await import('@vercel/edge-config');
      const tenants = await get('tenants');
      return NextResponse.json({ 
        success: true, 
        tenants,
        message: 'Edge Config is working!' 
      });
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
  }

  // Continue with existing middleware
  return clerkMiddleware(request);
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
