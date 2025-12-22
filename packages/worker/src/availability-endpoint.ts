// packages/worker/src/availability-endpoint.ts

import { getAvailability } from './availability';
import { ApiError } from './errors';

export async function handleAvailabilityEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    // path example: /api/tenant/<tenantId>/availability
    const segments = path.split('/').filter(Boolean);
    const tenantId = segments[2];
    const date = url.searchParams.get('date');
    const serviceId = url.searchParams.get('serviceId');

    if (!tenantId || !date || !serviceId) {
        throw new ApiError(400, 'tenantId, date and serviceId are required');
    }

    const service = await env.DB.prepare('SELECT duration_minutes FROM services WHERE id = ?').bind(serviceId).first();
    if (!service) {
        throw new ApiError(404, 'Service not found');
    }

    const slots = await getAvailability(env.DB, tenantId, date, service.duration_minutes || 60);
    return new Response(JSON.stringify({ slots }), { headers: corsHeaders });
}
