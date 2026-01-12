

import { getAvailability } from './availability';
import { handleDashboardBookings } from './dashboard-endpoint';
import { handleDashboardSSE } from './dashboard-stream';
import { handleAiEndpoint } from './ai-endpoint';
import { handleTenantEndpoint } from './tenant-endpoint';
import { handleBookEndpoint } from './book-endpoint';
import { handleDashboardStatsEndpoint } from './dashboard-stats-endpoint';
import { handleHealthEndpoint } from './health-endpoint';
import { handlePublicServicesEndpoint } from './public-services-endpoint';
import { handleProductsEndpoint } from './products-endpoint';
import { handleAvailabilityEndpoint } from './availability-endpoint';
import { handleSchedulesEndpoint } from './schedules-endpoint';
import { handleNotification } from './notifications';
// import { Resend } from 'resend';
// import { render } from 'react-email';
// import { BookingConfirmationEmail } from './emails/BookingConfirmation';
import { escapeHtml, formatPrice } from './helpers';
import { logger } from './logger';
import { handleError } from './errors';

// Cloudflare Worker for InStyle landing page
export default {
    async queue(batch: MessageBatch<any>, env: any) {
        // Process each message in the batch
        for (const message of batch.messages) {
            await handleNotification(message, env);
        }
    },

    async fetch(request: Request, env: any) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Serve a lightweight shop page directly from the Worker when the Pages origin
        // is unreachable (avoids Cloudflare 530). This renders a minimal product grid
        // by querying D1 so users can still browse products while routing is fixed.
        if (!path.startsWith('/api') && (path === '/shop' || path.startsWith('/book/instylehairboutique/shop'))) {
            try {
                // Query up to 50 active products
                const productsStmt = env.DB.prepare(`
                    SELECT p.id, p.name, p.price, p.short_description, p.images
                    FROM products p
                    WHERE p.is_active = 1
                    ORDER BY p.created_at DESC
                    LIMIT 50
                `);

                const productsResult = await productsStmt.all();
                const products = (productsResult && productsResult.results) || [];

                const productCards = products.map((p: any) => {
                    let imageUrl = '';
                    try {
                        if (p.images) {
                            const images = JSON.parse(p.images);
                            imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : '';
                        }
                    } catch (e) {
                        // Images field may not be valid JSON
                    }
                    return `
                    <div style="width:220px;margin:12px;border-radius:12px;overflow:hidden;border:1px solid #eee;">
                        <div style="height:160px;background:#f8f8f8;display:flex;align-items:center;justify-content:center;">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.name)}" style="max-height:100%;max-width:100%;"/>` : '<div style="color:#999">No image</div>'}</div>
                        <div style="padding:12px;font-family:Inter,system-ui,sans-serif;">
                            <h3 style="margin:0 0 8px;font-size:15px">${escapeHtml(p.name)}</h3>
                            <p style="margin:0 0 8px;color:#666;font-size:13px">${escapeHtml(p.short_description || '')}</p>
                            <div style="font-weight:700">${formatPrice(p.price, 'ZAR')}</div>
                        </div>
                    </div>
                `;
                }).join('');

                const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shop — InStyle</title><style>body{font-family:Inter,system-ui,Arial,sans-serif;background:#fff;color:#111} .grid{display:flex;flex-wrap:wrap;gap:12px;max-width:1200px;margin:24px auto;justify-content:flex-start;padding:12px}</style></head><body><header style="padding:20px;text-align:center;background:#fff;border-bottom:1px solid #f0f0f0"><h1 style="margin:0">InStyle Shop</h1><h2 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">Shop products</h2><p style="margin:6px 0 0;color:#666">Browse products — booking still available at /book</p></header><main><div class="grid">${productCards}</div></main></body></html>`;

                return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
            } catch (err) {
                logger.error('Shop renderer error', { error: err });
                // If shop renderer fails, return a minimal error response instead of proxying
                return new Response('<html><body><h1>Shop Unavailable</h1><p>Sorry, the shop is temporarily unavailable.</p></body></html>', {
                    status: 503,
                    headers: { 'content-type': 'text/html; charset=utf-8' }
                });
            }
        }

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight OPTIONS
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Root route - serve marketing site for appointmentbooking.co.za
        if (path === '/' && (url.hostname === 'appointmentbooking.co.za' || url.hostname === 'www.appointmentbooking.co.za')) {
            return new Response('<html><body><h1>Appointment Booking Coming Soon</h1></body></html>', {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                    ...corsHeaders
                }
            });
        }

        // Root route - serve InStyle landing page with updated branding
        if (path === '/' || path === '/instyle' || path === '/instylehairboutique' || path === '/book/instylehairboutique') {
            const tenant = await env.DB.prepare(
                'SELECT id FROM tenants WHERE slug = ?'
            ).bind('instylehairboutique').first();

            const tenantId = tenant ? tenant.id : 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'; // fallback to old ID

            // Simplified HTML response for landing page
            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InStyle Hair Boutique | Premium Hair Services Cape Town</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50 font-sans">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold font-serif mb-6 text-gray-900">
                InStyle Hair Boutique
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                Premium hair services and products in Cape Town.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/book/instylehairboutique" class="px-8 py-4 bg-orange-800 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all">
                    📅 Book Appointment
                </a>
                <a href="https://wa.me/27699171527" target="_blank" class="px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded-full shadow-lg">
                    💬 Chat on WhatsApp
                </a>
            </div>
            <script>
                const TENANT_ID = '${tenantId}';
            </script>
        </div>
    </div>
</body>
</html>`;

            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                    ...corsHeaders
                }
            });
        }

        // Handle API routes
        if (path.startsWith('/api/')) {
            return handleApiRoute(request, env);
        }

        // Default not found for other paths
        return new Response('Not found', { status: 404 });
    }
};

// API Route Handler
async function handleApiRoute(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        // Compatibility layer for legacy/consumer-facing API paths
        // Map commonly requested legacy endpoints to current handlers
        // This helps prevent 404s from older client routes and external integrations.
        const urlObj = new URL(request.url);
        const legacyPath = urlObj.pathname;

        // Helper: resolve tenant id from hostname or query param
        async function resolveTenantId(): Promise<string> {
            const qTid = urlObj.searchParams.get('tenantId') || urlObj.searchParams.get('tenant');
            if (qTid) return qTid;
            // Try hostname-based tenant mapping (e.g., instyle.appointmentbooking.co.za)
            const host = urlObj.hostname || '';
            if (host.startsWith('instyle') || host.includes('instyle')) return 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
            // Fallback to default Instyle tenant for legacy compatibility
            return 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
        }

        // Legacy: /api/services -> return services in correct format
        if (legacyPath === '/api/services') {
            try {
                const tid = await resolveTenantId();
                const servicesRes = await env.DB.prepare('SELECT id, name, description, duration_minutes, price FROM services WHERE tenant_id = ? AND is_active = 1 ORDER BY name ASC').bind(tid).all();
                return new Response(JSON.stringify({
                    data: {
                        services: servicesRes.results || []
                    }
                }), { status: 200, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({
                    data: {
                        services: []
                    }
                }), { status: 200, headers: corsHeaders });
            }
        }

        // Legacy: /api/staff or /api/employees -> return employees list for tenant in correct format
        if (legacyPath === '/api/staff' || legacyPath === '/api/employees') {
            try {
                const tid = await resolveTenantId();
                const staffRes = await env.DB.prepare('SELECT id, name, email, phone, is_active FROM employees WHERE tenant_id = ? ORDER BY name ASC').bind(tid).all();
                return new Response(JSON.stringify({
                    data: {
                        staff: staffRes.results || []
                    }
                }), { status: 200, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({
                    data: {
                        staff: []
                    }
                }), { status: 200, headers: corsHeaders });
            }
        }

        // Legacy: /api/services/availability or /api/availability -> map to tenant availability
        if (legacyPath === '/api/availability' || legacyPath === '/api/services/availability') {
            // Delegate to existing availability handler if available
            // Build a synthetic URL expected by availability handler: /api/tenant/{tid}/availability
            const tid = await resolveTenantId();
            const proxyPath = `/api/tenant/${encodeURIComponent(tid)}/availability${urlObj.search}`;
            const proxied = new Request(`${urlObj.origin}${proxyPath}`, { method: request.method, headers: request.headers });
            return handleAvailabilityEndpoint(proxied, env, corsHeaders);
        }

        // Legacy: /api/bookings (GET) -> list appointments for tenant in correct format
        if (legacyPath === '/api/bookings' && request.method === 'GET') {
            try {
                const tid = await resolveTenantId();
                const limit = url.searchParams.get('limit') || '50';
                const rows = await env.DB.prepare('SELECT id, user_id, service_id, scheduled_time, status, created_at FROM appointments WHERE tenant_id = ? ORDER BY scheduled_time DESC LIMIT ?').bind(tid, parseInt(limit)).all();
                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        items: rows.results || []
                    }
                }), { status: 200, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    data: {
                        items: []
                    }
                }), { status: 200, headers: corsHeaders });
            }
        }

        // Legacy: /api/bookings (POST) -> create appointment in correct format
        if (legacyPath === '/api/bookings' && request.method === 'POST') {
            try {
                const tid = await resolveTenantId();
                const body: any = await request.json();
                const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Parse the scheduled time - support both date+time or ISO format
                let scheduledTime: number;
                if (body.date && body.time) {
                    // Combine date and time: date='2026-01-20', time='10:00'
                    const datetime = new Date(`${body.date}T${body.time}:00Z`);
                    scheduledTime = Math.floor(datetime.getTime() / 1000);
                } else if (body.scheduledTime) {
                    // Unix timestamp provided
                    scheduledTime = body.scheduledTime;
                } else {
                    // Default to now + 1 hour
                    scheduledTime = Math.floor(Date.now() / 1000) + 3600;
                }

                // Get or create service
                let serviceId = body.serviceId;
                if (!serviceId) {
                    // Try to get any service from this tenant
                    try {
                        const existingService = await env.DB.prepare(
                            'SELECT id FROM services WHERE tenant_id = ? LIMIT 1'
                        ).bind(tid).first();
                        
                        if (existingService && existingService.id) {
                            serviceId = existingService.id;
                        }
                    } catch (e) {
                        // Service lookup failed, continue with null
                    }
                }

                // Get or create user - prefer existing user from tenant
                let userId = body.customerId;
                if (!userId) {
                    // Try to get an existing user from this tenant to use
                    try {
                        const existingUser = await env.DB.prepare(
                            'SELECT id FROM users WHERE tenant_id = ? LIMIT 1'
                        ).bind(tid).first();
                        
                        if (existingUser && existingUser.id) {
                            userId = existingUser.id;
                        } else {
                            // No users exist, create one
                            userId = `user_${appointmentId}`;
                            const userName = body.customer?.firstName && body.customer?.lastName 
                                ? `${body.customer.firstName} ${body.customer.lastName}` 
                                : `Customer`;
                            const userEmail = body.customer?.email || `customer_${appointmentId}@test.local`;
                            
                            await env.DB.prepare(
                                'INSERT INTO users (id, tenant_id, name, email, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
                            ).bind(
                                userId,
                                tid,
                                userName,
                                userEmail,
                                body.customer?.phone || '',
                                Math.floor(Date.now() / 1000),
                                Math.floor(Date.now() / 1000)
                            ).run();
                        }
                    } catch (e) {
                        logger.error('User lookup failed', { error: e });
                        throw new Error(`Failed to get or create user: ${String(e)}`);
                    }
                }

                // Insert the appointment
                await env.DB.prepare(
                    'INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, status, created_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                ).bind(
                    appointmentId,
                    tid,
                    userId,
                    serviceId || null,
                    scheduledTime,
                    'pending',
                    Math.floor(Date.now() / 1000),
                    body.notes || ''
                ).run();

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        appointment: {
                            id: appointmentId,
                            service_id: serviceId,
                            scheduled_time: scheduledTime,
                            status: 'pending',
                            created_at: Math.floor(Date.now() / 1000)
                        }
                    }
                }), { status: 201, headers: corsHeaders });
            } catch (error) {
                logger.error('Booking creation failed', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: String(error)
                }), { status: 400, headers: corsHeaders });
            }
        }

        // Legacy: /api/bookings (DELETE) -> cancel appointment in correct format
        if (legacyPath === '/api/bookings' && request.method === 'DELETE') {
            try {
                const appointmentId = url.searchParams.get('id');
                if (!appointmentId) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Missing appointment ID'
                    }), { status: 400, headers: corsHeaders });
                }

                await env.DB.prepare(
                    'UPDATE appointments SET status = ? WHERE id = ?'
                ).bind('cancelled', appointmentId).run();

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        appointmentId: appointmentId
                    }
                }), { status: 200, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: String(error)
                }), { status: 400, headers: corsHeaders });
            }
        }
        // AI endpoint - Handle AI conversations and analytics
        if (path === '/api/ai') {
            return handleAiEndpoint(request, env);
        }

        // Dashboard SSE stream - real-time updates (polling inside worker)
        if (path === '/api/dashboard/stream') {
            return handleDashboardSSE(request, env, corsHeaders);
        }

        // Dashboard bookings endpoint - Get 2024+ bookings for dashboard UI
        if (path === '/api/dashboard/bookings') {
            return handleDashboardBookings(request, env, corsHeaders);
        }

        // Tenant endpoint - Get tenant info and services
        if (path === '/api/tenant') {
            return handleTenantEndpoint(request, env, corsHeaders);
        }

        // Book endpoint - Create new booking
        if (path === '/api/book' && request.method === 'POST') {
            return handleBookEndpoint(request, env, corsHeaders);
        }

        // Dashboard endpoint - Get tenant statistics
        if (path === '/api/dashboard') {
            return handleDashboardStatsEndpoint(request, env, corsHeaders);
        }

        // Health check endpoint
        if (path === '/api/health') {
            return handleHealthEndpoint(request, env, corsHeaders);
        }

        // Compatibility: expose more granular health checks for legacy monitors
        if (path === '/api/health/database') {
            try {
                // quick DB ping
                await env.DB.prepare('SELECT 1').first();
                return new Response(JSON.stringify({ database: 'connected' }), { status: 200, headers: corsHeaders });
            } catch (err) {
                return new Response(JSON.stringify({ database: 'unavailable', error: String(err) }), { status: 503, headers: corsHeaders });
            }
        }

        if (path === '/api/health/services') {
            try {
                // Delegate to public services handler to return services list
                const proxiedReq = new Request(`${url.origin}/api/public/services${url.search}`, { method: request.method, headers: request.headers });
                return await handlePublicServicesEndpoint(proxiedReq, env, corsHeaders);
            } catch (err) {
                return new Response(JSON.stringify({ services: [], error: String(err) }), { status: 200, headers: corsHeaders });
            }
        }

        if (path === '/api/health/uptime') {
            const uptime = Math.floor((Date.now() - (env.DEPLOY_START_TS || Date.now())) / 1000);
            return new Response(JSON.stringify({ uptime }), { status: 200, headers: corsHeaders });
        }

        // Public services endpoint
        if (path === '/api/public/services') {
            return handlePublicServicesEndpoint(request, env, corsHeaders);
        }

        // Products endpoint - Get products for the shop
        if (path === '/api/products') {
            return handleProductsEndpoint(request, env, corsHeaders);
        }

        // Availability endpoint - compute available slots for a tenant on a date
        if (path.startsWith('/api/tenant/') && path.endsWith('/availability') && request.method === 'GET') {
            return handleAvailabilityEndpoint(request, env, corsHeaders);
        }

        // Tenant schedules endpoint - create/duplicate schedules
        if (path.startsWith('/api/tenant/') && path.endsWith('/schedules') && request.method === 'POST') {
            return handleSchedulesEndpoint(request, env, corsHeaders);
        }

        // QUICK WIN: POST /api/bookings - Create new booking (enhanced)
        if (path === '/api/bookings' && request.method === 'POST') {
            try {
                const body: any = await request.json();
                const result = await env.DB.prepare(
                    'INSERT INTO appointments (user_id, service_id, staff_id, scheduled_time, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
                ).bind(
                    body.userId || 'guest-' + Math.random().toString(36).substring(7),
                    body.serviceId || 1,
                    body.staffId || 1,
                    body.scheduledTime || new Date().toISOString(),
                    'confirmed',
                    new Date().toISOString()
                ).run();
                
                return new Response(JSON.stringify({
                    id: result.meta.last_row_id,
                    ...body,
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                }), { status: 201, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Failed to create booking', details: String(error) }), { status: 400, headers: corsHeaders });
            }
        }

        // QUICK WIN: GET /api/bookings - List bookings (enhanced)
        if (path === '/api/bookings' && request.method === 'GET') {
            try {
                const limit = url.searchParams.get('limit') || '50';
                const result = await env.DB.prepare(
                    'SELECT id, user_id, service_id, staff_id, scheduled_time, status, created_at FROM appointments ORDER BY scheduled_time DESC LIMIT ?'
                ).bind(parseInt(limit)).all();
                
                return new Response(JSON.stringify({
                    bookings: result.results || [],
                    total: result.results?.length || 0
                }), { status: 200, headers: corsHeaders });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Failed to fetch bookings', details: String(error) }), { status: 400, headers: corsHeaders });
            }
        }

        // API endpoint not found
        return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
            status: 404,
            headers: corsHeaders
        });

    } catch (error) {
        return handleError(error, corsHeaders);
    }
}
