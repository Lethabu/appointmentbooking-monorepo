import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/d1';
import { availabilityOverrides } from '@repo/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogger } from '../../../../utils/security/audit-logger';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const employeeId = searchParams.get('employeeId');

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const db = drizzle((process.env as any).DB);

    try {
        const query = db.select().from(availabilityOverrides).where(eq(availabilityOverrides.tenantId, tenantId));

        // Filter by employee if provided
        const results = employeeId
            ? await query.where(and(eq(availabilityOverrides.tenantId, tenantId), eq(availabilityOverrides.employeeId, employeeId)))
            : await query;

        return NextResponse.json({ success: true, overrides: results });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch overrides' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { tenantId, employeeId, date, startTime, endTime, isWorking } = body;

    if (!tenantId || !employeeId || !date) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = drizzle((process.env as any).DB);
    const logger = new AuditLogger((process.env as any).DB);

    try {
        const id = uuidv4();
        await db.insert(availabilityOverrides).values({
            id,
            tenantId,
            employeeId,
            date,
            startTime,
            endTime,
            isWorking: isWorking ?? true,
        });

        await logger.log(
            {
                tenantId,
                ipAddress: req.headers.get('x-forwarded-for') || 'unknown'
            },
            'booking',
            'create',
            { overrideId: id, employeeId, date },
            'info'
        );

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create override' }, { status: 500 });
    }
}
