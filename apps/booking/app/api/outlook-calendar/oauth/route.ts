// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';

/**
 * Microsoft Outlook Calendar OAuth Integration
 * Handles OAuth 2.0 flow for Microsoft Graph API access
 */

// Microsoft OAuth 2.0 configuration
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/api/outlook-calendar/callback';

// Generate OAuth authorization URL for Microsoft
function generateAuthUrl(tenantId: string, state: string): string {
    const params = new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        response_type: 'code',
        redirect_uri: MICROSOFT_REDIRECT_URI,
        scope: [
            'offline_access',
            'Calendars.ReadWrite',
            'User.Read'
        ].join(' '),
        response_mode: 'query',
        state: `${tenantId}:${state}`
    });

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
}

// Generate secure state token
function generateState(): string {
    return crypto.randomUUID();
}

/**
 * GET /api/outlook-calendar/oauth
 * Initiate OAuth flow for Microsoft Calendar integration
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId') || 'default';
        const redirect = searchParams.get('redirect') || '/dashboard/calendar';

        if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET) {
            return NextResponse.json(
                { success: false, error: 'Microsoft OAuth credentials not configured' },
                { status: 500 }
            );
        }

        // Generate state for CSRF protection
        const state = generateState();
        const authUrl = generateAuthUrl(tenantId, state);

        // Store state in secure cookie for validation
        const response = NextResponse.redirect(authUrl);
        response.cookies.set('microsoft_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600 // 10 minutes
        });

        return response;
    } catch (error) {
        console.error('Microsoft OAuth initiation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to initiate OAuth flow' },
            { status: 500 }
        );
    }
}