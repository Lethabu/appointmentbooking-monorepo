import { ApiError } from './errors';

// packages/worker/src/schedules-endpoint.ts

export async function handleSchedulesEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const path = new URL(request.url).pathname;
    // path example: /api/tenant/<tenantId>/schedules
    const segments = path.split('/').filter(Boolean); // ['api','tenant','<tenantId>','schedules']
    const tenantId = segments[2];
    if (!tenantId) {
        throw new ApiError(400, 'tenantId missing in path');
    }

    const body = await request.json() as any;
    const { staffNames, schedule, serviceId } = body || {};
    const targets = (Array.isArray(staffNames) && staffNames.length > 0) ? staffNames : [null];

    for (const staffName of targets) {
        for (const slot of schedule || []) {
            await env.DB.prepare(`
                INSERT INTO staff_schedules (id, tenant_id, staff_name, service_id, start_time, end_time, day_of_week, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                crypto.randomUUID(),
                tenantId,
                staffName,
                serviceId,
                slot.start,
                slot.end,
                slot.day,
                Math.floor(Date.now() / 1000),
                Math.floor(Date.now() / 1000)
            ).run();
        }
    }

    return new Response(JSON.stringify({ success: true, message: `Schedule updated for ${targets.length} staff members` }), { headers: corsHeaders });
}
