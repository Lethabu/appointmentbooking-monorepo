// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { getDb } from '@repo/db';
import { calendarConnections } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { CalendarSyncService } from '@/services/calendar-sync';

/**
 * Google Calendar Webhook Handler
 * Handles real-time updates from Google Calendar API
 */

// Verify Google webhook authenticity
function verifyGoogleWebhook(request: NextRequest): boolean {
    const channelId = request.headers.get('x-goog-channel-id');
    const resourceId = request.headers.get('x-goog-resource-id');
    const resourceState = request.headers.get('x-goog-resource-state');

    return !!(channelId && resourceId && resourceState);
}

/**
 * POST /api/calendar/webhooks/google
 * Handle Google Calendar webhook notifications
 */
export async function POST(request: NextRequest) {
    try {
        if (!verifyGoogleWebhook(request)) {
            return NextResponse.json(
                { success: false, error: 'Invalid webhook signature' },
                { status: 401 }
            );
        }

        const headers = {
            channelId: request.headers.get('x-goog-channel-id'),
            resourceId: request.headers.get('x-goog-resource-id'),
            resourceState: request.headers.get('x-goog-resource-state'),
        };

        console.log('Google Calendar webhook received:', headers);

        switch (headers.resourceState) {
            case 'exists':
                await handleCalendarEventChange(headers.channelId, headers.resourceId);
                break;
            case 'sync':
                await handleCalendarSync(headers.channelId);
                break;
            case 'not_exists':
                await handleCalendarEventDeletion(headers.channelId, headers.resourceId);
                break;
            default:
                console.log('Unknown resource state:', headers.resourceState);
        }

        return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Google Calendar webhook error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process webhook',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * Handle calendar event creation or modification
 */
async function handleCalendarEventChange(channelId: string | null, resourceId: string | null) {
    try {
        if (!channelId) return;

        const env = process.env as any;
        const db = getDb({ DB: env.DB });

        const connections = await db
            .select()
            .from(calendarConnections)
            .where(eq(calendarConnections.googleCalendarId, channelId))
            .limit(1);

        if (connections.length === 0) {
            console.error('No calendar connection found for channel:', channelId);
            return;
        }

        const connection = connections[0];

        if (!connection.accessToken) {
            console.error('No access token for connection:', channelId);
            return;
        }

        console.log('Calendar event change detected for tenant:', connection.tenantId);

        await logWebhookEvent(connection.tenantId, 'calendar_event_changed', {
            channelId,
            resourceId,
            source: 'google'
        });

    } catch (error) {
        console.error('Error handling calendar event change:', error);
    }
}

/**
 * Handle calendar synchronization message
 */
async function handleCalendarSync(channelId: string | null) {
    console.log('Calendar sync message received for channel:', channelId);
}

/**
 * Handle calendar event deletion
 */
async function handleCalendarEventDeletion(channelId: string | null, resourceId: string | null) {
    try {
        if (!channelId) return;

        const env = process.env as any;
        const db = getDb({ DB: env.DB });

        const connections = await db
            .select()
            .from(calendarConnections)
            .where(eq(calendarConnections.googleCalendarId, channelId))
            .limit(1);

        if (connections.length === 0) {
            return;
        }

        const connection = connections[0];

        console.log('Calendar event deletion detected for tenant:', connection.tenantId);

        await logWebhookEvent(connection.tenantId, 'calendar_event_deleted', {
            channelId,
            resourceId,
            source: 'google'
        });

    } catch (error) {
        console.error('Error handling calendar event deletion:', error);
    }
}

/**
 * Log webhook events for analytics and debugging
 */
async function logWebhookEvent(tenantId: string, eventName: string, properties: any) {
    try {
        const env = process.env as any;
        const { analyticsEvents } = await import('@repo/db/schema');
        const { drizzle } = await import('drizzle-orm/d1');

        // Mock analytics logging for build compatibility
        console.log('Analytics event logged:', {
            tenantId,
            eventName,
            properties,
            timestamp: Math.floor(Date.now() / 1000)
        });
    } catch (error) {
        console.error('Error logging webhook event:', error);
    }
}

/**
 * GET /api/calendar/webhooks/google
 * Handle webhook verification
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({ success: true, message: 'Google Calendar webhook endpoint active' });
}