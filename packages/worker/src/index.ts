// Standalone Cloudflare Worker for appointment booking

export interface Env {
  DB: D1Database;
  SUPERSAAS_API_KEY: string;
  SUPERSAAS_SCHEDULE_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Tenant API
      if (path === '/api/tenant' && request.method === 'GET') {
        const slug = url.searchParams.get('slug');
        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400, headers: corsHeaders });
        }

        const tenant = await env.DB.prepare('SELECT * FROM tenants WHERE slug = ? LIMIT 1')
          .bind(slug)
          .first();

        if (!tenant) {
          return Response.json({ error: 'Tenant not found' }, { status: 404, headers: corsHeaders });
        }

        const services = await env.DB.prepare('SELECT * FROM services WHERE tenant_id = ? AND is_active = 1')
          .bind(tenant.id)
          .all();

        return Response.json({
          tenant,
          services: services.results,
        }, { headers: corsHeaders });
      }

      // Booking API
      if (path === '/api/book' && request.method === 'POST') {
        const body = await request.json();
        const { tenantId, name, email, phone, serviceId, scheduledTime, notes } = body;

        // Create user
        const userId = crypto.randomUUID();
        await env.DB.prepare(`
          INSERT INTO users (id, tenant_id, name, email, phone) 
          VALUES (?, ?, ?, ?, ?)
        `).bind(userId, tenantId, name, email, phone).run();

        // Create appointment
        const appointmentId = crypto.randomUUID();
        const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
        await env.DB.prepare(`
          INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, notes, status) 
          VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
        `).bind(appointmentId, tenantId, userId, serviceId, timestamp, notes).run();

        // Sync with SuperSaaS
        try {
          const supersaasResponse = await fetch('https://www.supersaas.com/api/bookings.json', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.SUPERSAAS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              schedule_id: env.SUPERSAAS_SCHEDULE_ID,
              user_name: name,
              user_email: email,
              start: scheduledTime,
              description: notes,
            }),
          });

          if (supersaasResponse.ok) {
            const supersaasData = await supersaasResponse.json();
            await env.DB.prepare(`
              UPDATE appointments SET supersaas_booking_id = ? WHERE id = ?
            `).bind(supersaasData.id?.toString(), appointmentId).run();
          }
        } catch (error) {
          console.error('SuperSaaS sync failed:', error);
        }

        return Response.json({
          success: true,
          appointmentId,
          message: 'Booking created successfully',
        }, { headers: corsHeaders });
      }

      // Dashboard API
      if (path === '/api/dashboard' && request.method === 'GET') {
        const tenantId = url.searchParams.get('tenantId');
        if (!tenantId) {
          return Response.json({ error: 'Tenant ID is required' }, { status: 400, headers: corsHeaders });
        }

        const appointments = await env.DB.prepare(`
          SELECT 
            a.id, a.scheduled_time, a.status, a.notes,
            u.name as user_name, u.email as user_email,
            s.name as service_name, s.price as service_price, s.duration_minutes
          FROM appointments a
          JOIN users u ON a.user_id = u.id
          JOIN services s ON a.service_id = s.id
          WHERE a.tenant_id = ?
          ORDER BY a.scheduled_time DESC
          LIMIT 20
        `).bind(tenantId).all();

        const results = appointments.results || [];
        const totalAppointments = results.length;
        const confirmedAppointments = results.filter((apt: any) => apt.status === 'confirmed').length;
        const pendingAppointments = results.filter((apt: any) => apt.status === 'pending').length;
        const totalRevenue = results
          .filter((apt: any) => apt.status === 'confirmed')
          .reduce((sum: number, apt: any) => sum + (apt.service_price || 0), 0);

        return Response.json({
          stats: {
            totalAppointments,
            confirmedAppointments,
            pendingAppointments,
            totalRevenue: totalRevenue / 100,
          },
          appointments: results.map((apt: any) => ({
            id: apt.id,
            clientName: apt.user_name,
            service: apt.service_name,
            time: new Date(apt.scheduled_time * 1000).toLocaleTimeString('en-ZA', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            duration: `${apt.duration_minutes}min`,
            status: apt.status,
            phone: 'N/A',
            price: (apt.service_price || 0) / 100,
          })),
        }, { headers: corsHeaders });
      }

      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('Worker error:', error);
      return Response.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500, headers: corsHeaders });
    }
  },
};