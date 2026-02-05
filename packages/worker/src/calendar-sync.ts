/**
 * Google Calendar integration endpoint
 * Syncs appointments with Google Calendar and detects conflicts
 */

import { extractToken } from './jwt';
import { logger } from './logger';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export async function handleCalendarSyncEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
        // GET /api/calendar/events - Fetch calendar events within a date range
        if (path === '/api/calendar/events' && request.method === 'GET') {
            const authHeader = request.headers.get('authorization');
            const token = extractToken(authHeader || undefined);

            if (!token) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Authorization required'
                }), { status: 401, headers: corsHeaders });
            }

            const startDate = url.searchParams.get('startDate');
            const endDate = url.searchParams.get('endDate');

            if (!startDate || !endDate) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'startDate and endDate required'
                }), { status: 400, headers: corsHeaders });
            }

            try {
                // Decode JWT to get user
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/\-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                // Get user's Google OAuth tokens
                const oauth = await env.DB.prepare(`
                    SELECT access_token, token_expiry FROM google_oauth 
                    WHERE user_id = ? LIMIT 1
                `).bind(payload.sub).first();

                if (!oauth || !oauth.access_token) {
                    return new Response(JSON.stringify({
                        success: true,
                        data: {
                            connected: false,
                            events: []
                        }
                    }), { status: 200, headers: corsHeaders });
                }

                // Check token expiry and refresh if needed (in production)
                // For now, use existing token
                const accessToken = oauth.access_token;

                // Fetch events from Google Calendar API
                const calendarResponse = await fetch(
                    `${GOOGLE_CALENDAR_API}/calendars/primary/events?${  new URLSearchParams({
                        timeMin: new Date(startDate).toISOString(),
                        timeMax: new Date(endDate).toISOString(),
                        singleEvents: 'true',
                        orderBy: 'startTime'
                    }).toString()}`,
                    {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }
                );

                if (!calendarResponse.ok) {
                    logger.error('Google Calendar API error', { status: calendarResponse.status });
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Failed to fetch calendar events'
                    }), { status: 400, headers: corsHeaders });
                }

                const calendarData = await calendarResponse.json() as any;
                const events = (calendarData.items || []).map((event: any) => ({
                    id: event.id,
                    title: event.summary,
                    start: event.start?.dateTime || event.start?.date,
                    end: event.end?.dateTime || event.end?.date,
                    description: event.description
                }));

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        connected: true,
                        events,
                        count: events.length
                    }
                }), { status: 200, headers: corsHeaders });

            } catch (error) {
                logger.error('Calendar events fetch error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to fetch calendar events'
                }), { status: 500, headers: corsHeaders });
            }
        }

        // POST /api/calendar/create-event - Create event on Google Calendar
        if (path === '/api/calendar/create-event' && request.method === 'POST') {
            const authHeader = request.headers.get('authorization');
            const token = extractToken(authHeader || undefined);

            if (!token) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Authorization required'
                }), { status: 401, headers: corsHeaders });
            }

            const body = await request.json() as any;
            const { title, description, startTime, endTime, timeZone } = body;

            if (!title || !startTime || !endTime) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'title, startTime, endTime required'
                }), { status: 400, headers: corsHeaders });
            }

            try {
                // Decode JWT
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/\-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                // Get OAuth token
                const oauth = await env.DB.prepare(`
                    SELECT access_token FROM google_oauth 
                    WHERE user_id = ? LIMIT 1
                `).bind(payload.sub).first();

                if (!oauth || !oauth.access_token) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Google Calendar not connected'
                    }), { status: 400, headers: corsHeaders });
                }

                // Create event on Google Calendar
                const eventData = {
                    summary: title,
                    description: description || '',
                    start: {
                        dateTime: startTime,
                        timeZone: timeZone || 'UTC'
                    },
                    end: {
                        dateTime: endTime,
                        timeZone: timeZone || 'UTC'
                    }
                };

                const createResponse = await fetch(
                    `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${oauth.access_token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(eventData)
                    }
                );

                if (!createResponse.ok) {
                    logger.error('Google Calendar create error', { status: createResponse.status });
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Failed to create calendar event'
                    }), { status: 400, headers: corsHeaders });
                }

                const createdEvent = await createResponse.json() as any;

                // Store event mapping in database
                const eventMapping = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await env.DB.prepare(`
                    INSERT INTO calendar_sync_events (
                        id, user_id, tenant_id, google_event_id, 
                        appointment_id, title, start_time, end_time, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    eventMapping,
                    payload.sub,
                    payload.tenantId,
                    createdEvent.id,
                    body.appointmentId || null,
                    title,
                    startTime,
                    endTime,
                    Math.floor(Date.now() / 1000)
                ).run();

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        googleEventId: createdEvent.id,
                        googleCalendarLink: createdEvent.htmlLink,
                        mappingId: eventMapping
                    }
                }), { status: 201, headers: corsHeaders });

            } catch (error) {
                logger.error('Calendar event creation error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to create calendar event'
                }), { status: 500, headers: corsHeaders });
            }
        }

        // POST /api/calendar/check-conflicts - Check for booking conflicts
        if (path === '/api/calendar/check-conflicts' && request.method === 'POST') {
            const authHeader = request.headers.get('authorization');
            const token = extractToken(authHeader || undefined);

            if (!token) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Authorization required'
                }), { status: 401, headers: corsHeaders });
            }

            const body = await request.json() as any;
            const { startTime, endTime, serviceId, staffId } = body;

            if (!startTime || !endTime) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'startTime and endTime required'
                }), { status: 400, headers: corsHeaders });
            }

            try {
                // Decode JWT
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/\-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                const startTs = Math.floor(new Date(startTime).getTime() / 1000);
                const endTs = Math.floor(new Date(endTime).getTime() / 1000);

                // Check for conflicts in appointments table
                // Simple check: conflict if appointment scheduled_time overlaps with requested time
                let query = `
                    SELECT COUNT(*) as conflict_count FROM appointments 
                    WHERE tenant_id = ? 
                    AND status != 'cancelled'
                    AND scheduled_time >= ?
                    AND scheduled_time < ?
                `;
                const params = [payload.tenantId, startTs, endTs];

                if (staffId) {
                    query += ' AND staff_id = ?';
                    params.push(staffId);
                }

                let conflictResult;
                try {
                    conflictResult = await env.DB.prepare(query).bind(...params).first();
                } catch (e) {
                    logger.error('Database query error', { error: e });
                    conflictResult = { conflict_count: 0 };
                }
                const hasConflicts = (conflictResult?.conflict_count || 0) > 0;

                // Also check Google Calendar if connected
                let googleConflicts = false;
                try {
                    const oauth = await env.DB.prepare(`
                        SELECT access_token FROM google_oauth 
                        WHERE user_id = ? LIMIT 1
                    `).bind(payload.sub).first();

                    if (oauth && oauth.access_token) {
                        const calendarResponse = await fetch(
                            `${GOOGLE_CALENDAR_API}/calendars/primary/events?${  new URLSearchParams({
                                timeMin: startTime,
                                timeMax: endTime,
                                singleEvents: 'true'
                            }).toString()}`,
                            { headers: { 'Authorization': `Bearer ${oauth.access_token}` } }
                        );

                        if (calendarResponse.ok) {
                            const calendarData = await calendarResponse.json() as any;
                            googleConflicts = (calendarData.items || []).length > 0;
                        }
                    }
                } catch (e) {
                    logger.error('Google Calendar conflict check error', { error: e });
                }

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        hasConflicts: hasConflicts || googleConflicts,
                        databaseConflicts: hasConflicts,
                        googleConflicts,
                        conflictCount: conflictResult?.conflict_count || 0
                    }
                }), { status: 200, headers: corsHeaders });

            } catch (error) {
                logger.error('Conflict check error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to check conflicts'
                }), { status: 500, headers: corsHeaders });
            }
        }

        // DELETE /api/calendar/delete-event - Delete event from Google Calendar
        if (path === '/api/calendar/delete-event' && request.method === 'DELETE') {
            const authHeader = request.headers.get('authorization');
            const token = extractToken(authHeader || undefined);

            if (!token) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Authorization required'
                }), { status: 401, headers: corsHeaders });
            }

            const googleEventId = url.searchParams.get('googleEventId');

            if (!googleEventId) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'googleEventId required'
                }), { status: 400, headers: corsHeaders });
            }

            try {
                // Decode JWT
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/\-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                // Get OAuth token
                const oauth = await env.DB.prepare(`
                    SELECT access_token FROM google_oauth 
                    WHERE user_id = ? LIMIT 1
                `).bind(payload.sub).first();

                if (!oauth || !oauth.access_token) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Google Calendar not connected'
                    }), { status: 400, headers: corsHeaders });
                }

                // Delete from Google Calendar
                const deleteResponse = await fetch(
                    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`,
                    {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${oauth.access_token}` }
                    }
                );

                if (!deleteResponse.ok && deleteResponse.status !== 404) {
                    logger.error('Google Calendar delete error', { status: deleteResponse.status });
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Failed to delete calendar event'
                    }), { status: 400, headers: corsHeaders });
                }

                // Remove mapping from database
                await env.DB.prepare(`
                    DELETE FROM calendar_sync_events 
                    WHERE google_event_id = ? AND user_id = ?
                `).bind(googleEventId, payload.sub).run();

                return new Response(JSON.stringify({
                    success: true,
                    data: { deleted: true }
                }), { status: 200, headers: corsHeaders });

            } catch (error) {
                logger.error('Calendar event deletion error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to delete calendar event'
                }), { status: 500, headers: corsHeaders });
            }
        }

        return new Response(JSON.stringify({
            error: 'Calendar endpoint not found'
        }), { status: 404, headers: corsHeaders });

    } catch (error) {
        logger.error('Calendar sync endpoint error', { error, path });
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error'
        }), { status: 500, headers: corsHeaders });
    }
}
