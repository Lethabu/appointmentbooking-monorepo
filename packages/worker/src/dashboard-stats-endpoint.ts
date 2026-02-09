// import { ApiError } from './errors';
import { logger } from './logger';

export async function handleDashboardStatsEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
        throw new ApiError(400, 'TenantId parameter required');
    }

    // Fetch tenant
    const tenant = await env.DB.prepare(
        'SELECT * FROM tenants WHERE id = ?'
    ).bind(tenantId).first();

    if (!tenant) {
        throw new ApiError(404, 'Tenant not found');
    }

    // Get total appointments count
    const totalAppointmentsResult = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ?'
    ).bind(tenantId).first();
    const totalAppointments = totalAppointmentsResult?.count || 0;

    // Get confirmed appointments count
    const confirmedAppointmentsResult = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ? AND status = ?'
    ).bind(tenantId, 'confirmed').first();
    const confirmedAppointments = confirmedAppointmentsResult?.count || 0;

    // Get pending appointments count
    const pendingAppointmentsResult = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ? AND status = ?'
    ).bind(tenantId, 'pending').first();
    const pendingAppointments = pendingAppointmentsResult?.count || 0;

    // Get active services count
    const activeServicesResult = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM services WHERE tenant_id = ? AND is_active = 1'
    ).bind(tenantId).first();
    const activeServices = activeServicesResult?.count || 0;

    // Get recent appointments with user and service details
    const recentAppointmentsResult = await env.DB.prepare(`
        SELECT 
            a.id,
            a.tenant_id,
            u.name as user_name,
            u.email as user_email,
            u.phone as user_phone,
            s.name as service_name,
            a.scheduled_time,
            a.status,
            a.payment_status,
            a.created_at
        FROM appointments a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.tenant_id = ?
        ORDER BY a.scheduled_time DESC
        LIMIT 10
    `).bind(tenantId).all();

    // Calculate total revenue from confirmed appointments
    const revenueResult = await env.DB.prepare(`
        SELECT COALESCE(SUM(s.price), 0) as total
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.tenant_id = ? AND a.status = 'confirmed'
    `).bind(tenantId).first();
    const totalRevenue = revenueResult?.total || 0;

    // Get total page views (analytics) - gracefully handle missing table
    let pageViews = 0;
    try {
        const pageViewsResult = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM analytics_events WHERE tenant_id = ? AND event_name = 'page_view'"
        ).bind(tenantId).first();
        pageViews = pageViewsResult?.count || 0;
    } catch (error) {
        // Analytics table may not exist, default to 0
        logger.warn('Analytics table not available, defaulting pageViews to 0', { error });
        pageViews = 0;
    }

    return new Response(JSON.stringify({
        tenant: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug
        },
        statistics: {
            totalAppointments,
            confirmedAppointments,
            pendingAppointments,
            totalRevenue,
            activeServices,
            pageViews // Added
        },
        recentAppointments: recentAppointmentsResult.results || []
    }), {
        headers: corsHeaders
    });
}
