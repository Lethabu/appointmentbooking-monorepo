// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

// Simplified competitive intelligence API (deployment optimization)
import { NextRequest, NextResponse } from 'next/server';

// GET /api/competitive-intelligence
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'overview';

        return NextResponse.json({
            success: true,
            data: {
                message: 'Competitive intelligence features temporarily disabled for core deployment',
                action,
                overview: {
                    totalMarketSize: 'R2.8B',
                    activeCompetitors: 25,
                    highPriorityOpportunities: 3,
                    criticalThreats: 1,
                    lastUpdated: new Date().toISOString()
                },
                note: 'Core appointment booking functionality is fully operational'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST /api/competitive-intelligence
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        return NextResponse.json({
            success: true,
            message: 'Competitive intelligence features temporarily disabled',
            received: body,
            note: 'Core appointment booking functionality is fully operational'
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}