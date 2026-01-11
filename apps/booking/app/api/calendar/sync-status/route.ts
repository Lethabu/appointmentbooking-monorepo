// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@repo/db';
import { calendarConnections, calendarSyncEvents } from '@repo/db/schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';

/**
 * Calendar Sync Status Monitoring
 * Provides comprehensive sync status and error recovery endpoints
 */

export interface SyncStatusResponse {
    connections: Array<{
        id: string;
        provider: string;
        isActive: boolean;
        lastSync: Date | null;
        tokenExpiry: number | null;
        errorCount: number;
        successCount: number;
        lastError: string | null;
    }>;
    recentEvents: Array<{
        id: string;
        bookingId: string;
        syncStatus: string;
        errorMessage: string | null;
        createdAt: Date;
    }>;
    statistics: {
        totalSyncs: number;
        successfulSyncs: number;
        failedSyncs: number;
        successRate: number;
        averageSyncTime: number;
    };
    health: {
        overall: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
    };
}

/**
 * GET /api/calendar/sync-status
 * Get comprehensive sync status for tenant
 */
export async function GET(request: NextRequest) {
    try {
        const tenantId = request.headers.get('tenantId') || 'default';
        const env = process.env as any;

        if (!env.DB && !(global as any).DB) {
            // Return mock data for development
            return NextResponse.json({
                success: true,
                data: getMockSyncStatus(),
                message: 'Sync status retrieved successfully (mock data)'
            });
        }

        const db = getDb({ DB: env.DB || (global as any).DB });

        // Get calendar connections
        const connections = await db
            .select()
            .from(calendarConnections)
            .where(eq(calendarConnections.tenantId, tenantId));

        // Get recent sync events
        const recentEvents = await db
            .select()
            .from(calendarSyncEvents)
            .where(eq(calendarSyncEvents.tenantId, tenantId))
            .orderBy(desc(calendarSyncEvents.createdAt))
            .limit(50);

        // Calculate sync statistics
        const stats = await db
            .select({
                total: count(),
                successful: sql<number>`count(case when ${calendarSyncEvents.syncStatus} in ('created', 'updated') then 1 end)`,
                failed: sql<number>`count(case when ${calendarSyncEvents.syncStatus} = 'failed' then 1 end)`,
                avgTime: sql<number>`avg(strftime('%s', ${calendarSyncEvents.createdAt}) - strftime('%s', ${calendarSyncEvents.createdAt}))`
            })
            .from(calendarSyncEvents)
            .where(eq(calendarSyncEvents.tenantId, tenantId));

        const statistics = stats[0] || { total: 0, successful: 0, failed: 0, avgTime: 0 };
        const successRate = statistics.total > 0 ? (statistics.successful / statistics.total) * 100 : 0;

        // Determine health status
        const health = determineHealthStatus(statistics, connections, recentEvents);

        // Format connections with error counts
        const connectionStatuses = await Promise.all(
            connections.map(async (conn) => {
                const connectionErrors = recentEvents.filter(
                    event => event.syncStatus === 'failed'
                ).length;

                const connectionSuccesses = recentEvents.filter(
                    event => event.syncStatus === 'created' || event.syncStatus === 'updated'
                ).length;

                return {
                    id: conn.id,
                    provider: conn.syncSettings?.provider || 'google',
                    isActive: conn.isActive,
                    lastSync: conn.updatedAt,
                    tokenExpiry: conn.tokenExpiry,
                    errorCount: connectionErrors,
                    successCount: connectionSuccesses,
                    lastError: recentEvents.find(e => e.syncStatus === 'failed')?.errorMessage || null
                };
            })
        );

        const response: SyncStatusResponse = {
            connections: connectionStatuses.map(conn => ({
                ...conn,
                isActive: conn.isActive ?? false
            })),
            recentEvents: recentEvents.map(event => ({
                id: event.id,
                bookingId: event.bookingId,
                syncStatus: event.syncStatus,
                errorMessage: event.errorMessage,
                createdAt: new Date(event.createdAt as Date || new Date())
            })),
            statistics: {
                totalSyncs: statistics.total,
                successfulSyncs: statistics.successful,
                failedSyncs: statistics.failed,
                successRate: Math.round(successRate),
                averageSyncTime: statistics.avgTime || 0
            },
            health
        };

        return NextResponse.json({
            success: true,
            data: response,
            message: 'Sync status retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching sync status:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch sync status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/calendar/sync-status/retry
 * Retry failed sync operations
 */
export async function POST(request: NextRequest) {
    try {
        const tenantId = request.headers.get('tenantId') || 'default';
        const body = await request.json();

        const { bookingId, maxRetries = 5 } = body as any;

        const env = process.env as any;

        if (!env.DB && !(global as any).DB) {
            return NextResponse.json({
                success: true,
                data: {
                    retried: 2,
                    successful: 2,
                    failed: 0
                },
                message: 'Failed syncs retried successfully (mock data)'
            });
        }

        const db = getDb({ DB: env.DB || (global as any).DB });

        // Get failed sync events
        let query = db
            .select()
            .from(calendarSyncEvents)
            .where(and(
                eq(calendarSyncEvents.tenantId, tenantId),
                eq(calendarSyncEvents.syncStatus, 'failed')
            ));

        // Note: Database query simplified for build compatibility
        const failedEvents = await db
            .select()
            .from(calendarSyncEvents)
            .where(and(
                eq(calendarSyncEvents.tenantId, tenantId),
                eq(calendarSyncEvents.syncStatus, 'failed')
            ))
            .limit(maxRetries);

        if (bookingId) {
            // Additional filtering for specific booking would go here
        }

        const results = {
            retried: 0,
            successful: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Retry each failed sync
        for (const event of failedEvents) {
            try {
                const { CalendarSyncService } = await import('@/services/calendar-sync');
                const calendarSync = new CalendarSyncService({ DB: env.DB || (global as any).DB });

                const syncResults = await calendarSync.syncAppointmentToCalendar(
                    event.bookingId,
                    tenantId,
                    'update'
                );

                results.retried++;

                if (syncResults.some(result => result.success)) {
                    results.successful++;
                } else {
                    results.failed++;
                    results.errors.push(`Failed to sync booking ${event.bookingId}`);
                }

            } catch (error) {
                results.failed++;
                results.errors.push(
                    `Error retrying booking ${event.bookingId}: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }

        return NextResponse.json({
            success: true,
            data: results,
            message: `Retried ${results.retried} sync operations`
        });

    } catch (error) {
        console.error('Error retrying failed syncs:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to retry sync operations',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * Determine overall health status based on sync data
 */
function determineHealthStatus(
    stats: any,
    connections: any[],
    recentEvents: any[]
): SyncStatusResponse['health'] {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check success rate
    const successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;

    if (successRate < 50) {
        issues.push('Very low sync success rate');
        recommendations.push('Check calendar API credentials and network connectivity');
    } else if (successRate < 80) {
        issues.push('Low sync success rate');
        recommendations.push('Monitor sync errors and retry failed operations');
    }

    // Check for stale connections
    const staleConnections = connections.filter(conn => {
        if (!conn.isActive) return false;
        const lastSync = new Date(conn.updatedAt);
        const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
        return hoursSinceSync > 24; // Stale if no sync in 24 hours
    });

    if (staleConnections.length > 0) {
        issues.push(`${staleConnections.length} calendar connection(s) appear stale`);
        recommendations.push('Reconnect stale calendar integrations');
    }

    // Check for token expiry
    const expiredTokens = connections.filter(conn => {
        if (!conn.tokenExpiry) return false;
        return conn.tokenExpiry < Math.floor(Date.now() / 1000);
    });

    if (expiredTokens.length > 0) {
        issues.push(`${expiredTokens.length} calendar connection(s) have expired tokens`);
        recommendations.push('Refresh expired OAuth tokens');
    }

    // Check recent error frequency
    const recentErrors = recentEvents.filter(
        event => event.syncStatus === 'failed' &&
            new Date(event.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000)
    );

    if (recentErrors.length > 10) {
        issues.push('High frequency of recent sync errors');
        recommendations.push('Investigate root cause of sync failures');
    }

    // Determine overall health
    let overall: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (issues.length === 0) {
        overall = 'healthy';
    } else if (issues.length <= 2 && successRate > 70) {
        overall = 'warning';
    } else {
        overall = 'critical';
    }

    return { overall, issues, recommendations };
}

/**
 * Get mock sync status for development
 */
function getMockSyncStatus(): SyncStatusResponse {
    return {
        connections: [
            {
                id: 'conn_1',
                provider: 'google',
                isActive: true,
                lastSync: new Date(),
                tokenExpiry: Math.floor(Date.now() / 1000) + 3600,
                errorCount: 2,
                successCount: 45,
                lastError: null
            },
            {
                id: 'conn_2',
                provider: 'microsoft',
                isActive: false,
                lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                tokenExpiry: Math.floor(Date.now() / 1000) - 1800,
                errorCount: 5,
                successCount: 12,
                lastError: 'Token expired'
            }
        ],
        recentEvents: [
            {
                id: 'event_1',
                bookingId: 'apt_123',
                syncStatus: 'created',
                errorMessage: null,
                createdAt: new Date()
            },
            {
                id: 'event_2',
                bookingId: 'apt_124',
                syncStatus: 'failed',
                errorMessage: 'API rate limit exceeded',
                createdAt: new Date(Date.now() - 60 * 60 * 1000)
            }
        ],
        statistics: {
            totalSyncs: 57,
            successfulSyncs: 55,
            failedSyncs: 2,
            successRate: 96,
            averageSyncTime: 250
        },
        health: {
            overall: 'warning',
            issues: ['1 calendar connection(s) have expired tokens'],
            recommendations: ['Refresh expired OAuth tokens']
        }
    };
}