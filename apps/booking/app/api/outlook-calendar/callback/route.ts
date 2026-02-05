// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

import { storeOutlookCalendarConnection } from '@/services/outlook-calendar';

/**
 * Microsoft Outlook Calendar OAuth Callback
 * Handles OAuth callback and token exchange
 */

// Microsoft OAuth configuration
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/api/outlook-calendar/callback';

/**
 * Exchange authorization code for access token (Microsoft)
 */
async function exchangeCodeForTokens(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
} | null> {
    try {
        const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: MICROSOFT_CLIENT_ID,
                client_secret: MICROSOFT_CLIENT_SECRET,
                redirect_uri: MICROSOFT_REDIRECT_URI,
                grant_type: 'authorization_code',
                code,
            }),
        });

        if (!response.ok) {
            console.error('Microsoft token exchange failed:', response.status, await response.text());
            return null;
        }

        const data = await response.json() as any;
        return data;
    } catch (error) {
        console.error('Microsoft token exchange error:', error);
        return null;
    }
}

/**
 * Get user's Outlook Calendar ID
 */
async function getUserCalendarId(accessToken: string): Promise<string | null> {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to get calendar list:', response.status);
            return null;
        }

        const data = await response.json() as any;

        // Find primary calendar
        const primaryCalendar = data.value?.find((calendar: any) => calendar.isDefault);
        return primaryCalendar?.id || data.value?.[0]?.id || null;
    } catch (error) {
        console.error('Error getting calendar ID:', error);
        return null;
    }
}

/**
 * GET /api/outlook-calendar/callback
 * Handle OAuth callback from Microsoft
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (error) {
            console.error('Microsoft OAuth error:', error, errorDescription);
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=oauth_failed`);
        }

        if (!code || !state) {
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=invalid_callback`);
        }

        // Validate state parameter (CSRF protection)
        const storedState = request.cookies.get('microsoft_oauth_state')?.value;
        if (!storedState || storedState !== state.split(':')[1]) {
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=invalid_state`);
        }

        // Parse tenant ID from state
        const tenantId = state.split(':')[0];
        if (!tenantId) {
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=invalid_tenant`);
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);
        if (!tokens) {
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=token_exchange_failed`);
        }

        // Get user's calendar ID
        const calendarId = await getUserCalendarId(tokens.access_token);
        if (!calendarId) {
            const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
            return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=calendar_access_failed`);
        }

        // Calculate token expiry timestamp
        const expiry = Math.floor(Date.now() / 1000) + tokens.expires_in;

        // Store calendar connection in database
        const env = process.env as any;
        if (env.DB) {
            await storeOutlookCalendarConnection(
                env,
                tenantId,
                tokens.access_token,
                tokens.refresh_token,
                expiry,
                calendarId
            );
        }

        // Clear the OAuth state cookie
        const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
        const response = NextResponse.redirect(`${baseUrl}/dashboard/calendar?success=true`);
        response.cookies.delete('microsoft_oauth_state');

        return response;
    } catch (error) {
        console.error('Microsoft OAuth callback error:', error);
        const baseUrl = request.headers.get('origin') || new URL(request.url).origin;
        return NextResponse.redirect(`${baseUrl}/dashboard/calendar?error=callback_failed`);
    }
}