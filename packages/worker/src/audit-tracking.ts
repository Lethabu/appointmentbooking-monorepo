// packages/worker/src/audit-tracking.ts
// Track Revenue Audit Bot usage and conversion metrics
// Measure lead magnet effectiveness

import { logger } from './logger';

export interface AuditEvent {
  id: string;
  tenant_id?: string;
  audit_type: 'initiated' | 'completed' | 'converted' | 'failed';
  formalization_score?: number;
  estimated_recovery?: number;
  client_email?: string;
  timestamp: number;
}

/**
 * Record audit bot event for tracking funnel
 */
export async function recordAuditEvent(
  env: any,
  event: AuditEvent
): Promise<void> {
  try {
    const eventId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Math.floor(Date.now() / 1000);

    // Insert into audit_events table
    await env.DB.prepare(`
      INSERT INTO audit_events (id, tenant_id, audit_type, formalization_score, estimated_recovery, client_email, recorded_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      eventId,
      event.tenant_id || null,
      event.audit_type,
      event.formalization_score || null,
      event.estimated_recovery || null,
      event.client_email || null,
      now,
      now
    ).run();

    logger.info('Audit event recorded', {
      event_id: eventId,
      event_type: event.audit_type,
      tenant_id: event.tenant_id,
    });
  } catch (err) {
    logger.error('Failed to record audit event', { error: err });
  }
}

/**
 * Get audit funnel metrics (last 30 days)
 */
export async function getAuditFunnelMetrics(
  env: any
): Promise<{
  total_initiated: number;
  total_completed: number;
  total_converted: number;
  total_failed: number;
  completion_rate: number;
  conversion_rate: number;
  avg_formalization_score: number;
  avg_estimated_recovery: number;
}> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const result = await env.DB.prepare(`
      SELECT
        SUM(CASE WHEN audit_type = 'initiated' THEN 1 ELSE 0 END) as total_initiated,
        SUM(CASE WHEN audit_type = 'completed' THEN 1 ELSE 0 END) as total_completed,
        SUM(CASE WHEN audit_type = 'converted' THEN 1 ELSE 0 END) as total_converted,
        SUM(CASE WHEN audit_type = 'failed' THEN 1 ELSE 0 END) as total_failed,
        AVG(formalization_score) as avg_formalization,
        AVG(estimated_recovery) as avg_recovery
      FROM audit_events
      WHERE recorded_at >= ?
    `).bind(thirtyDaysAgo).first();

    const initiated = result?.total_initiated || 0;
    const completed = result?.total_completed || 0;
    const converted = result?.total_converted || 0;

    return {
      total_initiated: initiated,
      total_completed: completed,
      total_converted: converted,
      total_failed: result?.total_failed || 0,
      completion_rate: initiated > 0 ? (completed / initiated) * 100 : 0,
      conversion_rate: completed > 0 ? (converted / completed) * 100 : 0,
      avg_formalization_score: Math.round(result?.avg_formalization || 0),
      avg_estimated_recovery: Math.round(result?.avg_recovery || 0),
    };
  } catch (err) {
    logger.error('Failed to get audit funnel metrics', { error: err });
    return {
      total_initiated: 0,
      total_completed: 0,
      total_converted: 0,
      total_failed: 0,
      completion_rate: 0,
      conversion_rate: 0,
      avg_formalization_score: 0,
      avg_estimated_recovery: 0,
    };
  }
}

/**
 * Handle /api/audit/funnel endpoint
 */
export async function handleAuditFunnelEndpoint(
  request: Request,
  env: any
): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const metrics = await getAuditFunnelMetrics(env);

    return new Response(JSON.stringify({
      metrics,
      timestamp: new Date().toISOString(),
      message: 'Revenue Audit Bot - Lead Magnet Performance',
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    logger.error('Audit funnel endpoint error', { error: err });
    return new Response(JSON.stringify({ error: 'Failed to fetch funnel metrics' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
