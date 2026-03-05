// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Calendar OAuth Integration
 * Handles OAuth 2.0 flow for Google Calendar API access
 */

// Google OAuth 2.0 configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-calendar/callback';

// Generate OAuth authorization URL
function generateAuthUrl(tenantId: string, state: string): string {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ].join(' '),
        access_type: 'offline',
        prompt: 'consent',
        state: `${tenantId}:${state}`
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Generate secure state token
function generateState(): string {
    return crypto.randomUUID();
}

/**
 * GET /api/google-calendar/oauth
 * Initiate OAuth flow for Google Calendar integration
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId') || 'default';
        const redirect = searchParams.get('redirect') || '/dashboard/calendar';

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            return NextResponse.json(
                { success: false, error: 'Google OAuth credentials not configured' },
                { status: 500 }
            );
        }

        // Generate state for CSRF protection
        const state = generateState();
        const authUrl = generateAuthUrl(tenantId, state);

        // Store state in secure cookie for validation
        const response = NextResponse.redirect(authUrl);
        response.cookies.set('google_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600 // 10 minutes
        });

        return response;
    } catch (error) {
        console.error('Google OAuth initiation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to initiate OAuth flow' },
            { status: 500 }
        );
    }
}