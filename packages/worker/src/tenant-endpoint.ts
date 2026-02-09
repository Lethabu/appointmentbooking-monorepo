// import { ApiError } from './errors';

// packages/worker/src/tenant-endpoint.ts

export async function handleTenantEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
        throw new ApiError(400, 'Slug parameter required');
    }

    // Fetch tenant data
    const tenant = await env.DB.prepare(
        'SELECT * FROM tenants WHERE slug = ?'
    ).bind(slug).first();

    if (!tenant) {
        throw new ApiError(404, 'Tenant not found');
    }

    // Fetch services for this tenant
    const servicesResult = await env.DB.prepare(
        'SELECT * FROM services WHERE tenant_id = ? AND is_active = 1 ORDER BY created_at ASC'
    ).bind(tenant.id).all();

    return new Response(JSON.stringify({
        tenant,
        services: servicesResult.results || []
    }), {
        headers: corsHeaders
    });
}
