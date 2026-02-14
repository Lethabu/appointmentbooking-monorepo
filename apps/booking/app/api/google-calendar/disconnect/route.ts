// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { getDb } from '@repo/db';
import { calendarConnections, calendarSyncEvents } from '@repo/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Calendar Disconnection
 * Remove calendar connection and clean up sync data
 */

/**
 * POST /api/google-calendar/disconnect
 * Disconnect Google Calendar integration
 */
export async function POST(request: NextRequest) {
    try {
        const tenantId = request.headers.get('tenantId') || 'default';
        const env = process.env as any;

        if (!env.DB && !(global as any).DB) {
            // Return mock response for development
            return NextResponse.json({
                success: true,
                data: {
                    disconnected: true,
                    cleanedSyncEvents: 0,
                    message: 'Google Calendar disconnected successfully (mock data)'
                },
                message: 'Calendar disconnected successfully'
            });
        }

        const db = getDb({ DB: env.DB || (global as any).DB });

        // Update calendar connection to inactive
        await db
            .update(calendarConnections)
            .set({
                isActive: false,
                updatedAt: new Date()
            })
            .where(eq(calendarConnections.tenantId, tenantId));

        // Clean up sync events for this tenant
        const deletedEvents = await db
            .delete(calendarSyncEvents)
            .where(eq(calendarSyncEvents.tenantId, tenantId))
            .returning({ id: calendarSyncEvents.id });

        return NextResponse.json({
            success: true,
            data: {
                disconnected: true,
                cleanedSyncEvents: deletedEvents.length,
                message: 'Google Calendar disconnected successfully'
            },
            message: 'Calendar disconnected successfully'
        });
    } catch (error) {
        console.error('Error disconnecting Google Calendar:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to disconnect calendar',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/google-calendar/disconnect
 * Alternative endpoint for disconnection (RESTful)
 */
export async function DELETE(request: NextRequest) {
    return POST(request);
}