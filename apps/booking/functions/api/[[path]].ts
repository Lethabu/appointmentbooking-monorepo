/**
 * Cloudflare Pages Function to proxy API requests to Worker
 * Routes: /api/*
 * 
 * This function forwards all API requests from Pages to the Worker backend,
 * enabling separation of static content (Pages) from dynamic API (Worker).
 */

interface Env {
  WORKER_URL: string
}

export async function onRequest(context: {
  request: Request
  env: Env
  params: { path: string[] }
}): Promise<Response> {
  const { request, env, params } = context
  const url = new URL(request.url)

  // Construct Worker URL
  const pathSegments = params.path || []
  const queryString = url.search
  const workerPath = `/api/${pathSegments.join('/')}`
  const workerUrl = `${env.WORKER_URL}${workerPath}${queryString}`

  console.log(`[Pages Function] Proxying ${request.method} ${url.pathname} to ${workerUrl}`)

  try {
    // Forward request to Worker
    const response = await fetch(workerUrl, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body ? request.body : undefined,
      // Allow streaming response
      cf: {
        minify: {
          javascript: false,
          css: false,
          html: false
        }
      }
    })

    // Return response with proper headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })

    // Add CORS headers if needed
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    return newResponse
  } catch (error) {
    console.error('[Pages Function] Proxy error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({
        error: 'Gateway Error',
        message: `Failed to proxy request to Worker: ${errorMessage}`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}
