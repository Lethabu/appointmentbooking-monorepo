

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


        // API endpoint not found
        return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
            status: 404,
            headers: corsHeaders
        });

    } catch (error) {
        return handleError(error, corsHeaders);
    }
}
