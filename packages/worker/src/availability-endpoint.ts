// packages/worker/src/availability-endpoint.ts

import { getAvailability } from './availability';
import { ApiError } from './errors';

export async function handleAvailabilityEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    try {
        const url = new URL(request.url);
        const path = url.pathname;
        // path example: /api/tenant/<tenantId>/availability
        const segments = path.split('/').filter(Boolean);
        
        // segments[0] = 'api', segments[1] = 'tenant', segments[2] = tenantId, segments[3] = 'availability'
        const tenantId = segments[2];
        
        const date = url.searchParams.get('date');
        const serviceId = url.searchParams.get('serviceId');

        if (!tenantId || !date || !serviceId) {
            throw new ApiError(400, `Missing required parameters. tenantId: ${tenantId}, date: ${date}, serviceId: ${serviceId}`);
        }

        // Validate date format YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD');
        }

        const service = await env.DB.prepare('SELECT duration_minutes FROM services WHERE id = ? AND is_active = 1').bind(serviceId).first();
        if (!service) {
            throw new ApiError(404, `Service not found: ${serviceId}`);
        }

        const slots = await getAvailability(env.DB, tenantId, date, service.duration_minutes || 60);
        return new Response(JSON.stringify({ 
            success: true, 
            data: { slots } 
        }), { headers: corsHeaders });
    } catch (error: any) {
        console.error('Availability endpoint error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, `Internal error: ${error.message}`);
    }
}
