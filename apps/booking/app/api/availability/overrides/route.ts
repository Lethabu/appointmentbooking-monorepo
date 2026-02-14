import { availabilityOverrides } from '@repo/db/schema';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { AuditLogger } from '@/utils/security/audit-logger';

// export const runtime = 'edge'; // Disabled for OpenNext compatibility

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const employeeId = searchParams.get('employeeId');

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const db = drizzle((process.env as any).DB);

    try {
        let conditions = eq(availabilityOverrides.tenantId, tenantId);

        if (employeeId) {
            conditions = and(conditions, eq(availabilityOverrides.employeeId, employeeId)) as any;
        }

        const results = await db.select().from(availabilityOverrides as any).where(conditions);

        return NextResponse.json({ success: true, overrides: results });
    } catch (error) {
        console.error('Error fetching overrides:', error);
        return NextResponse.json({ error: 'Failed to fetch overrides' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as {
            tenantId: string;
            employeeId: string;
            date: string;
            startTime: string;
            endTime: string;
            isWorking?: boolean;
        };
        const { tenantId, employeeId, date, startTime, endTime, isWorking } = body;

        if (!tenantId || !employeeId || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = drizzle((process.env as any).DB);
        const logger = new AuditLogger((process.env as any).DB);

        const id = uuidv4();
        await db.insert(availabilityOverrides as any).values({
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
            'availability_override',
            'create',
            { overrideId: id, employeeId, date },
            'info'
        );

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating override:', error);
        return NextResponse.json({ error: 'Failed to create override' }, { status: 500 });
    }
}
