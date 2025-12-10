// SSE stream for dashboard updates (polling-based)
export async function handleDashboardSSE(request: Request, env: any, corsHeaders: any) {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
        return new Response(JSON.stringify({ error: 'tenantId required' }), { status: 400, headers: corsHeaders });
    }

    // Create a TransformStream to pump SSE data
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Helper to write an SSE event
    async function writeEvent(event: string, data: any) {
        const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
        await writer.write(new TextEncoder().encode(payload));
    }

    // Track last seen appointment timestamp
    let lastSeen = 0;

    // Poll function: query DB for new appointments since lastSeen
    async function poll() {
        try {
            const res = await env.DB.prepare(`
                SELECT a.id, a.scheduled_time, a.status, a.payment_status, u.name as user_name, s.name as service_name
                FROM appointments a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN services s ON a.service_id = s.id
                WHERE a.tenant_id = ? AND a.scheduled_time > ?
                ORDER BY a.scheduled_time ASC
                LIMIT 50
            `).bind(tenantId, lastSeen).all();

            const rows = (res && res.results) || [];
            if (rows.length > 0) {
                // Update lastSeen to newest timestamp
                const newest = Math.max(...rows.map((r: any) => Number(r.scheduled_time) || 0));
                lastSeen = Math.max(lastSeen, newest);
                // Send a single event with the array of rows
                await writeEvent('appointments', { rows });
            }
        } catch (err) {
            // send an error event but keep the stream alive
            try { await writeEvent('error', { message: err instanceof Error ? err.message : String(err) }); } catch (e) { /* ignore */ }
        }
    }

    // Start initial poll immediately
    poll();

    // Poll every 5 seconds
    const interval = setInterval(poll, 5000);

    // Close the writer when the client disconnects
    const abortHandler = () => {
        clearInterval(interval);
        try { writer.close(); } catch (e) { /* ignore */ }
    };

    try {
        request.signal.addEventListener('abort', abortHandler);
    } catch (e) {
        // ignore if signal not available
    }

    // Send an initial comment to establish the stream
    writer.write(new TextEncoder().encode(`: stream connected\n\n`));

    return new Response(readable, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            ...corsHeaders
        }
    });
}

export default null;
