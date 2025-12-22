
export async function handleHealthEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    // Simple database connectivity check
    const dbCheck = await env.DB.prepare('SELECT 1 as health').first();

    return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: dbCheck ? 'operational' : 'degraded',
            worker: 'operational'
        },
        version: 'e9ebc0e1-d799-4160-8747-7621f42d49ed'
    }), {
        headers: corsHeaders
    });
}
