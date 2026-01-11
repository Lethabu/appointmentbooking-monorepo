// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

// Simplified innovation idea generator (deployment optimization)
import { NextRequest, NextResponse } from 'next/server';

// GET /api/innovation/idea-generator
export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            success: true,
            data: {
                message: 'Innovation idea generation features temporarily disabled for core deployment',
                ideas: [
                    {
                        id: 'innovation_1',
                        title: 'Mobile-First Booking Enhancement',
                        description: 'Optimized mobile booking experience with AI recommendations',
                        category: 'incremental',
                        source: 'customer_feedback',
                        ai_score: 85.5,
                        market_potential: 78,
                        status: 'generated'
                    },
                    {
                        id: 'innovation_2',
                        title: 'AI-Powered Availability Prediction',
                        description: 'Predictive availability based on historical patterns and demand',
                        category: 'breakthrough',
                        source: 'technology_advancement',
                        ai_score: 92.3,
                        market_potential: 88,
                        status: 'generated'
                    }
                ],
                summary: {
                    total_ideas: 2,
                    breakthrough_ideas: 1,
                    incremental_ideas: 1,
                    platform_ideas: 0,
                    average_score: 88.9,
                    top_score: 92.3,
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

// POST /api/innovation/idea-generator
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        return NextResponse.json({
            success: true,
            message: 'Innovation idea features temporarily disabled',
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