// Dashboard bookings endpoint - Get 2024+ bookings for dashboard UI
export async function handleDashboardBookings(request: Request, env: any, corsHeaders: any): Promise<Response> {
    try {
        const url = new URL(request.url);
        const tenantId = url.searchParams.get('tenantId');
        const status = url.searchParams.get('status'); // optional: filter by status
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500); // max 500

        if (!tenantId) {
            return new Response(JSON.stringify({ error: 'tenantId required' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        let query = `
            SELECT * FROM dashboard_bookings_2024_plus
            WHERE tenant_id = ?
        `;
        const params: any[] = [tenantId];

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        query += ` ORDER BY scheduled_time DESC LIMIT ?`;
        params.push(limit);

        try {
            const stmt = env.DB.prepare(query);
            const bookingsResult = await stmt.bind(...params).all();

            return new Response(JSON.stringify({
                bookings: bookingsResult.results || [],
                count: bookingsResult.results ? bookingsResult.results.length : 0
            }), {
                headers: corsHeaders
            });
        } catch (e) {
            // If dashboard aggregation table doesn't exist in this environment, fall back
            // to joining appointments -> users -> services so endpoint still works.
            try {
                const fallback = await env.DB.prepare(`
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
                    LIMIT ?
                `).bind(tenantId, limit).all();

                return new Response(JSON.stringify({
                    bookings: fallback.results || [],
                    count: fallback.results ? fallback.results.length : 0,
                    fallback: true
                }), { headers: corsHeaders });
            } catch (err2) {
                throw err2;
            }
        }
    } catch (error) {
        console.error('Dashboard bookings error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch dashboard bookings' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
