import { ApiError } from "./errors";

// packages/worker/src/public-services-endpoint.ts

export async function handlePublicServicesEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
        throw new ApiError(400, 'TenantId required');
    }

    const servicesResult = await env.DB.prepare(
        'SELECT * FROM services WHERE tenant_id = ? AND is_active = 1 ORDER BY created_at ASC'
    ).bind(tenantId).all();

    return new Response(JSON.stringify({
        services: servicesResult.results || []
    }), {
        headers: corsHeaders
    });
}
