// packages/worker/src/lite-dashboard-endpoints.ts
// API endpoints for Dashboard Lite (Spaza Mode)
// Lightweight endpoints returning only essential data

import { logger } from './logger';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/dashboard/lite/bookings
 * Return today's bookings only
 */
export async function handleLiteBookingsEndpoint(
  request: Request,
  env: any
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'tenantId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get today's bookings
    const today = new Date().toISOString().split('T')[0];
    const stmt = env.DB.prepare(`
      SELECT 
        a.id,
        c.name as client_name,
        s.name as service,
        TIME(datetime(a.booking_time, 'unixepoch')) as time,
        a.status,
        s.price as amount
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE a.tenant_id = ?
        AND DATE(datetime(a.booking_time, 'unixepoch')) = ?
      ORDER BY a.booking_time ASC
    `);

    const result = await stmt.all(tenantId, today);
    const bookings = result.results || [];

    logger.info('Lite bookings fetched', { tenantId, count: bookings.length });

    return new Response(JSON.stringify(bookings), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    logger.error('Lite bookings error', { error: err });
    return new Response(JSON.stringify({ error: 'Failed to fetch bookings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * GET /api/dashboard/lite/payments-due
 * Return outstanding payments (money owed)
 */
export async function handleLitePaymentsDueEndpoint(
  request: Request,
  env: any
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'tenantId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const stmt = env.DB.prepare(`
      SELECT 
        a.id,
        c.name as client_name,
        (s.price - COALESCE(p.amount, 0)) as amount_owed,
        CAST((julianday('now') - julianday(datetime(a.booking_time, 'unixepoch'))) AS INTEGER) as days_overdue,
        s.name as last_service
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.tenant_id = ?
        AND a.status = 'completed'
        AND (p.status IS NULL OR p.status != 'completed')
        AND (s.price - COALESCE(p.amount, 0)) > 0
      ORDER BY days_overdue DESC
    `);

    const result = await stmt.all(tenantId);
    const payments = (result.results || []).filter((p: any) => p.amount_owed > 0);

    logger.info('Lite payments-due fetched', {
      tenantId,
      count: payments.length,
    });

    return new Response(JSON.stringify(payments), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    logger.error('Lite payments-due error', { error: err });
    return new Response(JSON.stringify({ error: 'Failed to fetch payments' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * GET /api/dashboard/lite/stock-alerts
 * Return low & critical stock items
 */
export async function handleLiteStockAlertsEndpoint(
  request: Request,
  env: any
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'tenantId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const stmt = env.DB.prepare(`
      SELECT 
        id,
        name as item_name,
        quantity as current_quantity,
        reorder_level,
        CASE 
          WHEN quantity <= (reorder_level * 0.5) THEN 'critical'
          WHEN quantity <= reorder_level THEN 'low'
          ELSE 'ok'
        END as status
      FROM inventory
      WHERE tenant_id = ?
        AND quantity <= reorder_level
      ORDER BY quantity ASC
    `);

    const result = await stmt.all(tenantId);
    const alerts = result.results || [];

    logger.info('Lite stock-alerts fetched', { tenantId, count: alerts.length });

    return new Response(JSON.stringify(alerts), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    logger.error('Lite stock-alerts error', { error: err });
    return new Response(JSON.stringify({ error: 'Failed to fetch stock alerts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * Integration point in worker index.ts
 */
export function registerLiteEndpoints(url: URL, request: Request, env: any) {
  const path = url.pathname;

  if (path === '/api/dashboard/lite/bookings') {
    return handleLiteBookingsEndpoint(request, env);
  }
  if (path === '/api/dashboard/lite/payments-due') {
    return handleLitePaymentsDueEndpoint(request, env);
  }
  if (path === '/api/dashboard/lite/stock-alerts') {
    return handleLiteStockAlertsEndpoint(request, env);
  }

  return null;
}
