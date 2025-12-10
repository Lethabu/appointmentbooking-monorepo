import { NextRequest, NextResponse } from 'next/server';
import { storeCalendarConnection } from '@/services/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        if (error) {
            console.error('Google Calendar OAuth error:', error);
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=oauth_denied`);
        }

        if (!code || !state) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=missing_params`);
        }

        let tenantId: string;
        try {
            const stateData = JSON.parse(state);
            tenantId = stateData.tenantId;
        } catch {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=invalid_state`);
        }

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const GOOGLE_REDIRECT_URI = `${process.env.NEXTAUTH_URL || request.headers.get('host')}/api/google-calendar/oauth/callback`;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=config_missing`);
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: GOOGLE_REDIRECT_URI,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Token exchange failed:', errorData);
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=token_exchange_failed`);
        }

        const tokens = await tokenResponse.json();

        // Check if we have calendar access by getting user profile
        const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
            },
        });

        if (!calendarResponse.ok) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=calendar_access_denied`);
        }

        const calendarData = await calendarResponse.json();
        const primaryCalendar = calendarData.items?.find((cal: any) => cal.primary);

        if (!primaryCalendar) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=no_primary_calendar`);
        }

        const calendarId = primaryCalendar.id;

        // Calculate expiry timestamp
        const expiresIn = tokens.expires_in || 3600;
        const expiry = Math.floor(Date.now() / 1000) + expiresIn;

        // Store connection in database
        await storeCalendarConnection(
            process.env as any,
            tenantId,
            tokens.access_token,
            tokens.refresh_token,
            expiry,
            calendarId
        );

        // Redirect back to settings with success
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?success=google_calendar_connected`);
    } catch (error) {
        console.error('Google Calendar OAuth callback error:', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || request.headers.get('host')}/settings/integrations?error=internal_error`);
    }
}
