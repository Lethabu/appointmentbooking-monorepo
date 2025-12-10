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
            tr