// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

import { POST as bookingsPOST } from '../bookings/route';

/**
 * Critical Fix for Phase 7: Booking API Error 1101 Resolution
 * This route fixes the routing mismatch between /api/book and /api/bookings
 */

export async function POST(req: NextRequest) {
    try {
        // Delegate to the existing bookings route
        return await bookingsPOST(req);
    } catch (error: any) {
        console.error('Booking API error (1101):', error);
        return NextResponse.json({
            error: 'Booking API Error 1101 - Internal Server Error',
            code: 1101,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    // Handle GET requests to /api/book for debugging
    return NextResponse.json({
        status: 'operational',
        endpoint: '/api/book',
        timestamp: new Date().toISOString(),
        message: 'Booking API is operational - use POST for bookings'
    });
}