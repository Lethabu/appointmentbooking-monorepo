import { calendarConnections, calendarSyncEvents } from '@repo/db';
import { getDb } from '@repo/db';
import { eq } from 'drizzle-orm';
// import { D1Database } from '@cloudflare/workers-types';

// Google Calendar API configuration
const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface GoogleCalendarEvent {
    summary: string;
    description?: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location?: string;
    attendees?: Array<{
        email: string;
        displayName?: string;
    }>;
}

// Helper to refresh Google access token
async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string | null> {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.status}`);
        }

        const data = await response.json();
        return (data as { access_token: string }).access_token;
    } catch (error) {
        console.error('Failed to refresh Google Calendar access token:', error);
        return null;
    }
}

// Get valid access token for tenant
async function getValidAccessToken(env: { DB: any }, tenantId: string): Promise<string | null> {
    const db = getDb({ DB: env.DB });

    const connections = await db
        .select()
        .from(calendarConnections)
        .where(eq(calendarConnections.tenantId, tenantId))
        .limit(1);

    if (connections.length === 0 || !connections[0].isActive) {
        return null;
    }

    const connection = connections[0];
    const now = Math.floor(Date.now() / 1000);

    // Check if token is expired or will expire in 5 minutes
    if (connection.tokenExpiry && connection.tokenExpiry - 300 < now) {
        // Need to refresh token
        if (!connection.refreshToken) {
            return null;
        }

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || connection.syncSettings?.client_id;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || connection.syncSettings?.client_secret;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            return null;
        }

        const newToken = await refreshAccessToken(connection.refreshToken, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

        if (newToken) {
            // Update database with new token
            await db
                .update(calendarConnections)
                .set({
                    accessToken: newToken,
                    tokenExpiry: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
                    updatedAt: new Date(),
                })
                .where(eq(calendarConnections.tenantId, tenantId));

            return newToken;
        }
        return null;
    }

    return connection.accessToken || null;
}

// Create Google Calendar event
export async function createCalendarEvent(
    env: { DB: any },
    tenantId: string,
    event: GoogleCalendarEvent
): Promise<{ eventId: string } | null> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return null;
    }

    try {
        const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`Calendar API error: ${response.status}`);
        }

        const eventData = await response.json();
        return { eventId: (eventData as { id: string }).id };
    } catch (error) {
        console.error('Failed to create calendar event:', error);
        return null;
    }
}

// Update Google Calendar event
export async function updateCalendarEvent(
    env: { DB: any },
    tenantId: string,
    eventId: string,
    event: Partial<GoogleCalendarEvent>
): Promise<boolean> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to update calendar event:', error);
        return false;
    }
}

// Delete Google Calendar event
export async function deleteCalendarEvent(
    env: { DB: any },
    tenantId: string,
    eventId: string
): Promise<boolean> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to delete calendar event:', error);
        return false;
    }
}

// Get calendar connection status for tenant
export async function getCalendarConnectionStatus(
    env: { DB: any },
    tenantId: string
): Promise<{ connected: boolean; expiry?: number }> {
    const db = getDb({ DB: env.DB });

    const connections = await db
        .select()
        .from(calendarConnections)
        .where(eq(calendarConnections.tenantId, tenantId))
        .limit(1);

    if (connections.length === 0) {
        return { connected: false };
    }

    const connection = connections[0];
    return {
        connected: connection.isActive && connection.accessToken ? true : false,
        expiry: connection.tokenExpiry ?? undefined,
    };
}

// Store calendar connection after OAuth
export async function storeCalendarConnection(
    env: { DB: any },
    tenantId: string,
    accessToken: string,
    refreshToken: string,
    expiry: number,
    calendarId: string
): Promise<void> {
    const db = getDb({ DB: env.DB });

    // Check if connection exists for this tenant
    const existing = await db
        .select()
        .from(calendarConnections)
        .where(eq(calendarConnections.tenantId, tenantId))
        .limit(1);

    if (existing.length > 0) {
        // Update existing connection
        await db
            .update(calendarConnections)
            .set({
                googleCalendarId: calendarId,
                accessToken,
                refreshToken,
                tokenExpiry: expiry,
                isActive: true,
                updatedAt: new Date(),
            })
            .where(eq(calendarConnections.id, existing[0].id));
    } else {
        // Insert new connection
        await db.insert(calendarConnections).values({
            id: crypto.randomUUID(),
            tenantId,
            googleCalendarId: calendarId,
            accessToken,
            refreshToken,
            tokenExpiry: expiry,
            isActive: true,
            syncSettings: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
            },
        });
    }
}
