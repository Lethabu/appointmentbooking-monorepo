/**
 * Cloudflare Pages Middleware
 * SPEC: Middleware pattern for Pages Functions v1
 * Purpose: Route /api/* requests to Worker backend
 * 
 * This middleware intercepts API requests and routes them to the
 * Cloudflare Worker backend (appointmentbooking-coza.workers.dev)
 */

// Cloudflare Pages Function context type
interface PagesContext {
  request: Request;
  env: Record<string, unknown>;
  params: Record<string, string>;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);

  // SPEC: Detect API requests
  if (url.pathname.startsWith('/api/')) {
    // Get the API path
    const apiPath = url.pathname;
    const query = url.search;
    
    // If this is an auth-related path, allow Pages/Next.js to handle it (NextAuth lives in the Next build)
    if (apiPath.startsWith('/api/auth') || apiPath.startsWith('/api/nextauth') || apiPath.startsWith('/api/session')) {
      const pagesOrigin = process.env.PAGES_ORIGIN || 'https://appointment-booking-coza.pages.dev';
      const pagesUrl = `${pagesOrigin}${apiPath}${query}`;
      try {
        const pagesRequest = new Request(pagesUrl, {
          method: request.method,
          headers: new Headers(request.headers),
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
        });
        return await fetch(pagesRequest);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'Pages proxy error', message: errorMessage }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // SPEC: Route to Worker backend for API endpoints served by the Worker
    const workerUrl = `https://appointmentbooking-coza.houseofgr8ness.workers.dev${apiPath}${query}`;
    
    try {
      // Create a new request to the Worker
      const workerRequest = new Request(workerUrl, {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? request.body 
          : null,
      });

      // Forward the request to the Worker
      const response = await fetch(workerRequest);
      
      return response;
    } catch (error) {
      // Fallback error response
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new Response(
        JSON.stringify({
          error: 'API Gateway Error',
          message: errorMessage,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'X-Error-Source': 'pages-middleware',
          },
        }
      );
    }
  }

  // Pass through to Pages for non-API requests
  return context.next();
}
