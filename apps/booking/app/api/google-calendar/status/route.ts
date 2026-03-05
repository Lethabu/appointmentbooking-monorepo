// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';

import { getCalendarConnectionStatus } from '@/services/google-calendar';

/**
 * Google Calendar Integration Status
 * Check connection status and sync health
 */

/**
 * GET /api/google-calendar/status
 * Get calendar connection status for tenant
 */
export async function GET(request: NextRequest) {
    try {
        const tenantId = request.headers.get('tenantId') || 'default';
        const env = process.env as any;

        if (!env.DB && !(global as any).DB) {
            // Return mock status for development
            return NextResponse.json({
                success: true,
                data: {
                    connected: false,
                    provider: 'google',
                    lastSync: null,
                    syncStatus: 'not_configured',
                    error: null,
                    upcomingEvents: 0,
                    configuredCalendars: []
                },
                message: 'Calendar status retrieved successfully (mock data)'
            });
        }

        // Get real connection status
        const db = env.DB || (global as any).DB;
        const status = await getCalendarConnectionStatus(db, tenantId);

        // Get additional sync information
        const { calendarSyncEvents } = await import('@repo/db/schema');
        const { drizzle } = await import('drizzle-orm/d1');
        const { desc, eq, sql } = await import('drizzle-orm');

        const dbInstance = drizzle(db);

        // Get last sync event
        const lastSyncEvent = await dbInstance
            .select()
            .from(calendarSyncEvents)
            .where(eq(calendarSyncEvents.tenantId, tenantId))
            .orderBy(desc(calendarSyncEvents.createdAt))
            .limit(1);

        const lastSync = lastSyncEvent[0]?.createdAt ? new Date(Number(lastSyncEvent[0].createdAt) * 1000) : null;

        // Get sync statistics
        const syncStats = await dbInstance
            .select({
                total: sql<number>`count(*)`,
                successful: sql<number>`count(case when ${calendarSyncEvents.syncStatus} = 'created' or ${calendarSyncEvents.syncStatus} = 'updated' then 1 end)`,
                failed: sql<number>`count(case when ${calendarSyncEvents.syncStatus} = 'failed' then 1 end)`
            })
            .from(calendarSyncEvents)
            .where(eq(calendarSyncEvents.tenantId, tenantId));

        const stats = syncStats[0] || { total: 0, successful: 0, failed: 0 };

        return NextResponse.json({
            success: true,
            data: {
                connected: status.connected,
                provider: 'google',
                tokenExpiry: status.expiry,
                lastSync,
                syncStatus: status.connected ? 'active' : 'disconnected',
                syncStats: {
                    total: stats.total || 0,
                    successful: stats.successful || 0,
                    failed: stats.failed || 0,
                    successRate: stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0
                },
                error: null,
                configuredCalendars: status.connected ? ['primary'] : []
            },
            message: 'Calendar status retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching calendar status:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch calendar status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}