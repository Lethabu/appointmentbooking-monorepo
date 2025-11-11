// Standalone Cloudflare Worker for appointment booking

export interface Env {
  DB: D1Database;
  SUPERSAAS_API_KEY: string;
  SUPERSAAS_SCHEDULE_ID: string;
}

interface SuperSaaSBookingResponse {
  id?: string | number;
}

interface BookingRequestBody {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  scheduledTime: string;
  notes?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'Content-Type': 'application/json',
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
        const body: BookingRequestBody = await request.json();
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
            const supersaasData: SuperSaaSBookingResponse = await supersaasResponse.json();
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

      // Root route - serve booking page
      if (path === '/' || path === '/instyle' || path === '/instylehairboutique') {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instyle Hair Boutique — Book Online | Premium Hair Services Cape Town</title>
    <meta name="description" content="Instyle Hair Boutique - premium hair transformations in Cape Town. Book & pay in under 60 seconds. Middle & Side Installation, Maphondo & Lines, Hair Extensions.">
    <link rel="canonical" href="https://www.instylehairboutique.co.za/">
    <meta property="og:title" content="Instyle Hair Boutique — Premium Hair Services">
    <meta property="og:description" content="Book your transformation today. Professional hair services in Cape Town.">
    <meta property="og:image" content="https://www.instylehairboutique.co.za/og-image.jpg">
    <meta property="og:url" content="https://www.instylehairboutique.co.za/">
    <meta name="theme-color" content="#8B5CF6">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💇</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "name": "Instyle Hair Boutique",
      "description": "Premium hair transformations in Cape Town",
      "url": "https://www.instylehairboutique.co.za",
      "telephone": "+27123456789",
      "email": "bookings@instylehairboutique.co.za",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressCountry": "ZA"
      },
      "openingHours": ["Mo-Fr 09:00-17:00", "Sa 08:00-16:00"],
      "priceRange": "R150-R650"
    }
    </script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen py-12 px-4">
        <div class="max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-purple-600 mb-2">Instyle Hair Boutique</h1>
                <p class="text-gray-600">Professional Hair Services in Cape Town</p>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 class="text-2xl font-semibold mb-4">Our Services</h2>
                <div id="services-list" class="space-y-4">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p class="mt-2 text-gray-500">Loading services...</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-semibold mb-4">Book Your Appointment</h2>
                <form id="booking-form" class="space-y-4">
                    <input type="text" id="name" placeholder="Full Name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <input type="email" id="email" placeholder="Email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <input type="tel" id="phone" placeholder="Phone" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <select id="service" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Select a service</option>
                    </select>
                    <input type="date" id="date" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <select id="time" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Select time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                    </select>
                    <textarea id="notes" rows="3" placeholder="Notes (Optional)" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    <button type="submit" class="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold">Book Appointment</button>
                </form>
            </div>
            <div class="text-center mt-8 text-gray-500">
                <p>📞 +27 123 456 789 | 📧 bookings@instylehairboutique.co.za</p>
            </div>
        </div>
    </div>
    <script>
        const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
        async function loadServices() {
            try {
                const response = await fetch('/api/tenant?slug=instylehairboutique');
                const data = await response.json();
                const servicesList = document.getElementById('services-list');
                const serviceSelect = document.getElementById('service');
                servicesList.innerHTML = '';
                serviceSelect.innerHTML = '<option value="">Select a service</option>';
                data.services.forEach(service => {
                    const serviceDiv = document.createElement('div');
                    serviceDiv.className = 'border rounded-lg p-4 hover:border-purple-300 transition-colors';
                    serviceDiv.innerHTML = \`<div class="flex justify-between items-center"><div><h3 class="font-semibold text-lg">\${service.name}</h3><p class="text-gray-600">\${service.description || 'Professional hair service'}</p><span class="inline-block bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded mt-2">\${service.duration_minutes} minutes</span></div><div class="text-right"><p class="text-2xl font-bold text-purple-600">R\${(service.price / 100).toFixed(0)}</p></div></div>\`;
                    servicesList.appendChild(serviceDiv);
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = \`\${service.name} - R\${(service.price / 100).toFixed(0)}\`;
                    serviceSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading services:', error);
            }
        }
        document.getElementById('booking-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                tenantId: TENANT_ID,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                serviceId: document.getElementById('service').value,
                scheduledTime: \`\${document.getElementById('date').value}T\${document.getElementById('time').value}:00Z\`,
                notes: document.getElementById('notes').value
            };
            try {
                const response = await fetch('/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    alert('🎉 Booking successful! We will contact you to confirm your appointment.');
                    document.getElementById('booking-form').reset();
                } else {
                    alert('❌ Booking failed. Please try again or call us directly.');
                }
            } catch (error) {
                alert('❌ Booking failed. Please try again or call us directly.');
            }
        });
        document.getElementById('date').min = new Date().toISOString().split('T')[0];
        loadServices();
    </script>
</body>
</html>`;
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Cache-Control': 'public, max-age=300'
          }
        });
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