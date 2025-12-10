import { NextRequest, NextResponse } from 'next/server';
import { getCalendarConnectionStatus } from '@/services/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const tenantId = url.searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        const status = await getCalendarConnectionStatus(process.env as any, tenantId);

        return NextResponse.json(status);
    } catch (error) {
        console.error('Google Calendar status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
