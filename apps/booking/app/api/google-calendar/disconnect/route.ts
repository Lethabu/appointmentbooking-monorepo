import { NextRequest, NextResponse } from 'next/server';
import { calendarConnections } from '@repo/db';
import { getDb } from '@repo/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { tenantId } = await request.json();

        if (!tenantId) {
            return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        const db = getDb(process.env as any);

        // Remove calendar connection
        await db
            .delete(calendarConnections)
            .where(eq(calendarConnections.tenantId, tenantId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Google Calendar disconnect error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
