import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { tenantId } = await request.json();

        if (!tenantId) {
            return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_REDIRECT_URI = `${process.env.NEXTAUTH_URL || request.headers.get('host')}/api/google-calendar/oauth/callback`;

        if (!GOOGLE_CLIENT_ID) {
            return NextResponse.json({ error: 'Google Calendar not configured' }, { status: 500 });
        }

        // Build OAuth URL
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
            state: JSON.stringify({ tenantId }),
        });

        const oauthUrl = `https://accounts.google.com/oauth/authorize?${params.toString()}`;

        return NextResponse.json({ oauthUrl });
    } catch (error) {
        console.error('Google Calendar OAuth error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
