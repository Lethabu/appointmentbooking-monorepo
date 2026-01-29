// packages/worker/src/impact-metrics.ts
// Impact Metrics Helper - Cloudflare Workers D1
// Tracks community impact, job creation, and outcome-based pricing events

import { logger } from './logger';

interface ImpactRecord {
  id: string;
  tenant_id: string;
  jobs_supported: number;
  digital_formalization_score: number;
  region: string;
  country_code: string;
  local_currency: string;
  clients_reactivated_this_month: number;
  community_impact_score: number;
  estimated_annual_gdp_contribution: number;
}

interface ImpactEvent {
  id: string;
  tenant_id: string;
  impact_type: 'job_created' | 'client_reactivated' | 'formalization_step' | 'revenue_milestone';
  event_data: Record<string, any>;
  impact_value: number;
  triggered_by: 'user_action' | 'ai_agent' | 'booking_completion' | 'payment_received';
  recorded_at: number;
}

/**
 * Initialize or update impact metrics for a tenant
 */
export async function initializeImpactMetrics(
  env: any,
  tenantId: string,
  region: string = 'SOUTHERN_AFRICA',
  countryCode: string = 'ZA',
  localCurrency: string = 'ZAR'
): Promise<ImpactRecord | null> {
  try {
    const id = `impact_${tenantId}_${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);

    const stmt = env.DB.prepare(`
      INSERT INTO impact_metrics (
        id, tenant_id, region, country_code, local_currency,
        digital_formalization_score, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.run(
      id,
      tenantId,
      region,
      countryCode,
      localCurrency,
      0,
      now,
      now
    );

    logger.info('Impact metrics initialized', {
      tenantId,
      region,
      countryCode,
    });

    return result;
  } catch (err) {
    logger.error('Failed to initialize impact metrics', {
      tenantId,
      error: err,
    });
    return null;
  }
}

/**
 * Record an impact event (job created, client reactivated, etc.)
 */
export async function recordImpactEvent(
  env: any,
  tenantId: string,
  impactType: ImpactEvent['impact_type'],
  eventData: Record<string, any>,
  triggeredBy: ImpactEvent['triggered_by'],
  impactValue: number = 1.0,
  relatedBookingId?: string
): Promise<boolean> {
  try {
    const id = `evt_${tenantId}_${impactType}_${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);

    const stmt = env.DB.prepare(`
      INSERT INTO impact_events (
        id, tenant_id, impact_type, event_data, impact_value,
        triggered_by, related_booking_id, recorded_at, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      tenantId,
      impactType,
      JSON.stringify(eventData),
      impactValue,
      triggeredBy,
      relatedBookingId || null,
      now,
      now
    );

    logger.info('Impact event recorded', {
      tenantId,
      impactType,
      impactValue,
    });

    return true;
  } catch (err) {
    logger.error('Failed to record impact event', {
      tenantId,
      impactType,
      error: err,
    });
    return false;
  }
}

/**
 * Get current impact metrics for a tenant
 */
export async function getImpactMetrics(
  env: any,
  tenantId: string
): Promise<ImpactRecord | null> {
  try {
    const stmt = env.DB.prepare(`
      SELECT * FROM impact_metrics WHERE tenant_id = ? LIMIT 1
    `);

    const result = await stmt.bind(tenantId).first();
    return result || null;
  } catch (err) {
    logger.error('Failed to fetch impact metrics', {
      tenantId,
      error: err,
    });
    return null;
  }
}

/**
 * Update formalization score (0-100)
 * Checks: Has digital booking, payment tracking, client database, schedule automation
 */
export async function updateFormalizationScore(
  env: any,
  tenantId: string
): Promise<number> {
  try {
    let score = 0;

    // Check 1: Has active bookings (digital booking system)
    const bookingCount = await env.DB
      .prepare('SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ?')
      .first(tenantId);
    if (bookingCount?.count > 0) score += 25;

    // Check 2: Has payment records
    const paymentCount = await env.DB
      .prepare('SELECT COUNT(*) as count FROM payments WHERE tenant_id = ?')
      .first(tenantId);
    if (paymentCount?.count > 0) score += 25;

    // Check 3: Has client database
    const clientCount = await env.DB
      .prepare('SELECT COUNT(*) as count FROM clients WHERE tenant_id = ?')
      .first(tenantId);
    if (clientCount?.count > 10) score += 25;

    // Check 4: Has calendar sync or staff schedules
    const scheduleCount = await env.DB
      .prepare('SELECT COUNT(*) as count FROM staff_schedules WHERE tenant_id = ?')
      .first(tenantId);
    if (scheduleCount?.count > 0) score += 25;

    // Update metric
    const now = Math.floor(Date.now() / 1000);
    await env.DB
      .prepare(
        `UPDATE impact_metrics 
         SET digital_formalization_score = ?, updated_at = ? 
         WHERE tenant_id = ?`
      )
      .run(score, now, tenantId);

    logger.info('Formalization score updated', {
      tenantId,
      score,
    });

    return score;
  } catch (err) {
    logger.error('Failed to update formalization score', {
      tenantId,
      error: err,
    });
    return 0;
  }
}

/**
 * Record outcome-based pricing event
 */
export async function recordPricingEvent(
  env: any,
  tenantId: string,
  eventType: 'client_reactivated' | 'revenue_milestone' | 'ai_assistance_used' | 'retention_event',
  baseFee: number,
  outcomeAmount: number,
  revenueGenerated: number = 0,
  affectedClientId?: string
): Promise<boolean> {
  try {
    const id = `price_${tenantId}_${eventType}_${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);
    const billingMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const stmt = env.DB.prepare(`
      INSERT INTO pricing_audit_trail (
        id, tenant_id, event_type, base_fee_charged, outcome_fee_amount,
        total_monthly_charge, affected_client_id, revenue_generated,
        billing_period, billing_month, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      tenantId,
      eventType,
      baseFee,
      outcomeAmount,
      baseFee + outcomeAmount,
      affectedClientId || null,
      revenueGenerated,
      'monthly',
      billingMonth,
      now
    );

    logger.info('Pricing event recorded', {
      tenantId,
      eventType,
      outcomeAmount,
    });

    return true;
  } catch (err) {
    logger.error('Failed to record pricing event', {
      tenantId,
      eventType,
      error: err,
    });
    return false;
  }
}

/**
 * Calculate community impact score (0-100)
 * Composite of: jobs_supported (40%) + formalization_score (30%) + retention_improvement (30%)
 */
export async function calculateCommunityImpactScore(
  env: any,
  tenantId: string
): Promise<number> {
  try {
    const metrics = await getImpactMetrics(env, tenantId);
    if (!metrics) return 0;

    const jobsNormalized = Math.min((metrics.jobs_supported / 10) * 40, 40); // 40 points max
    const formalizationComponent = (metrics.digital_formalization_score / 100) * 30; // 30 points max
    const clientReactivationComponent = Math.min((metrics.clients_reactivated_this_month / 50) * 30, 30); // 30 points max

    const score = jobsNormalized + formalizationComponent + clientReactivationComponent;

    // Update in DB
    const now = Math.floor(Date.now() / 1000);
    await env.DB
      .prepare(
        `UPDATE impact_metrics 
         SET community_impact_score = ?, updated_at = ? 
         WHERE tenant_id = ?`
      )
      .run(score, now, tenantId);

    return Math.round(score);
  } catch (err) {
    logger.error('Failed to calculate community impact score', {
      tenantId,
      error: err,
    });
    return 0;
  }
}
