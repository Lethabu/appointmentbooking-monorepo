import { calendarConnections, calendarSyncEvents } from '@repo/db';
import { getDb } from '@repo/db';
import { eq } from 'drizzle-orm';

// Microsoft Graph API configuration
const MICROSOFT_GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

export interface OutlookCalendarEvent {
    subject: string;
    body?: {
        contentType: string;
        content: string;
    };
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location?: {
        displayName: string;
    };
    attendees?: Array<{
        emailAddress: {
            address: string;
            name?: string;
        };
        type: string;
    }>;
}

// Helper to refresh Microsoft access token
async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string | null> {
    try {
        const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.status}`);
        }

        const data = await response.json();
        return (data as { access_token: string }).access_token;
    } catch (error) {
        console.error('Failed to refresh Microsoft access token:', error);
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

        const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || connection.syncSettings?.client_id;
        const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || connection.syncSettings?.client_secret;

        if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET) {
            return null;
        }

        const newToken = await refreshAccessToken(connection.refreshToken, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET);

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

// Create Outlook Calendar event
export async function createCalendarEvent(
    env: { DB: any },
    tenantId: string,
    calendarId: string,
    event: OutlookCalendarEvent
): Promise<{ eventId: string } | null> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return null;
    }

    try {
        const response = await fetch(`${MICROSOFT_GRAPH_API_BASE}/me/calendars/${calendarId}/events`, {
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
        console.error('Failed to create Outlook calendar event:', error);
        return null;
    }
}

// Update Outlook Calendar event
export async function updateCalendarEvent(
    env: { DB: any },
    tenantId: string,
    calendarId: string,
    eventId: string,
    event: Partial<OutlookCalendarEvent>
): Promise<boolean> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch(`${MICROSOFT_GRAPH_API_BASE}/me/calendars/${calendarId}/events/${eventId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to update Outlook calendar event:', error);
        return false;
    }
}

// Delete Outlook Calendar event
export async function deleteCalendarEvent(
    env: { DB: any },
    tenantId: string,
    calendarId: string,
    eventId: string
): Promise<boolean> {
    const accessToken = await getValidAccessToken(env, tenantId);

    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch(`${MICROSOFT_GRAPH_API_BASE}/me/calendars/${calendarId}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to delete Outlook calendar event:', error);
        return false;
    }
}

// Store Outlook calendar connection after OAuth
export async function storeOutlookCalendarConnection(
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
                googleCalendarId: calendarId, // Using same field for Outlook calendar ID
                accessToken,
                refreshToken,
                tokenExpiry: expiry,
                isActive: true,
                updatedAt: new Date(),
                syncSettings: {
                    client_id: process.env.MICROSOFT_CLIENT_ID,
                    client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                    provider: 'microsoft'
                },
            })
            .where(eq(calendarConnections.id, existing[0].id));
    } else {
        // Insert new connection
        await db.insert(calendarConnections).values({
            id: crypto.randomUUID(),
            tenantId,
            googleCalendarId: calendarId, // Using same field for Outlook calendar ID
            accessToken,
            refreshToken,
            tokenExpiry: expiry,
            isActive: true,
            syncSettings: {
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                provider: 'microsoft'
            },
        });
    }
}