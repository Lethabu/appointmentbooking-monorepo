import { NextResponse } from 'next/server';

// export const runtime = 'edge'; // Commented out for Cloudflare Pages compatibility
// import { getDb } from '../../../../lib/db';
// import { checkConflict } from '@repo/db/conflicts';

interface ConflictCheckRequest {
    tenantId: string;
    startTime: number;
    endTime: number;
    staffId: string;
    excludeBookingId?: string;
}

export async function POST(req: Request) {
    try {
        const { tenantId, startTime, endTime, staffId, excludeBookingId }: ConflictCheckRequest = await req.json();

        if (!tenantId || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // const hasConflict = await checkConflict(
        //     getDb(),
        //     tenantId,
        //     Number(startTime),
        //     Number(endTime),
        //     staffId
        // );

        // Temporary mock response for emergency restoration
        const hasConflict = false;

        return NextResponse.json({ conflict: hasConflict });
    } catch (error) {
        console.error('Conflict check error:', error);
        return NextResponse.json({ error: 'Failed to check conflicts' }, { status: 500 });
    }
}
