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
 * Microsoft Outlook Calendar Webhook Handler
 * Handles real-time updates from Microsoft Graph API
 */

// Type definitions for webhook payload
interface OutlookWebhookPayload {
    changeType?: string;
    resource?: string;
    subscriptionId?: string;
    validationToken?: string;
    resourceData?: any;
}

// Verify Microsoft webhook authenticity (simplified)
function verifyOutlookWebhook(request: NextRequest): boolean {
    const validationToken = request.headers.get('validationToken');
    const clientState = request.headers.get('clientState');

    // Basic validation - Microsoft Graph validation
    return !!(validationToken || clientState);
}

/**
 * POST /api/calendar/webhooks/outlook
 * Handle Microsoft Outlook calendar webhook notifications
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as any;
        const notificationType = body.changeType;
        const resource = body.resource;
        const subscriptionId = body.subscriptionId;

        console.log('Outlook Calendar webhook received:', {
            notificationType,
            resource,
            subscriptionId
        });

        // Handle validation token if present
        if (body.validationToken) {
            return new Response(body.validationToken, {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        }

        // Process notification based on change type
        switch (notificationType) {
            case 'created':
                await handleCalendarEventCreated(resource, subscriptionId);
                break;
            case 'updated':
                await handleCalendarEventUpdated(resource, subscriptionId);
                break;
            case 'deleted':
                await handleCalendarEventDeleted(resource, subscriptionId);
                break;
            default:
                console.log('Unknown notification type:', notificationType);
        }

        return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Outlook Calendar webhook error:', error);
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
 * Handle calendar event creation
 */
async function handleCalendarEventCreated(resource: string, subscriptionId: string) {
    try {
        const connection = await findConnectionBySubscription(subscriptionId);
        if (!connection) return;

        console.log('Calendar event created for tenant:', connection.tenantId);

        await logWebhookEvent(connection.tenantId, 'calendar_event_created', {
            subscriptionId,
            resource,
            source: 'microsoft'
        });

    } catch (error) {
        console.error('Error handling calendar event creation:', error);
    }
}

/**
 * Handle calendar event update
 */
async function handleCalendarEventUpdated(resource: string, subscriptionId: string) {
    try {
        const connection = await findConnectionBySubscription(subscriptionId);
        if (!connection) return;

        console.log('Calendar event updated for tenant:', connection.tenantId);

        await logWebhookEvent(connection.tenantId, 'calendar_event_updated', {
            subscriptionId,
            resource,
            source: 'microsoft'
        });

    } catch (error) {
        console.error('Error handling calendar event update:', error);
    }
}

/**
 * Handle calendar event deletion
 */
async function handleCalendarEventDeleted(resource: string, subscriptionId: string) {
    try {
        const connection = await findConnectionBySubscription(subscriptionId);
        if (!connection) return;

        console.log('Calendar event deleted for tenant:', connection.tenantId);

        await logWebhookEvent(connection.tenantId, 'calendar_event_deleted', {
            subscriptionId,
            resource,
            source: 'microsoft'
        });

    } catch (error) {
        console.error('Error handling calendar event deletion:', error);
    }
}

/**
 * Find calendar connection by subscription ID
 */
async function findConnectionBySubscription(subscriptionId: string) {
    const env = process.env as any;
    const db = getDb({ DB: env.DB });

    const connections = await db
        .select()
        .from(calendarConnections)
        .where(eq(calendarConnections.googleCalendarId, subscriptionId))
        .limit(1);

    return connections[0] || null;
}

/**
 * Log webhook events for analytics and debugging
 */
async function logWebhookEvent(tenantId: string, eventName: string, properties: any) {
    try {
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
 * GET /api/calendar/webhooks/outlook
 * Handle webhook validation (Microsoft sends validation requests)
 */
export async function GET(request: NextRequest) {
    // Microsoft Graph validation - return validation token if present
    const validationToken = request.headers.get('validationToken');

    if (validationToken) {
        return new Response(validationToken, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    // Otherwise, just acknowledge the endpoint is active
    return NextResponse.json({ success: true, message: 'Outlook Calendar webhook endpoint active' });
}