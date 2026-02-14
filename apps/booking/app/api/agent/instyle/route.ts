// ============================================================================
// API Route for Nia Agent
// Note: Using Node.js runtime due to dependencies (Supabase, Google AI)
// ============================================================================
// // export const runtime = 'edge'; // Disabled for OpenNext compatibility // Disabled - incompatible dependencies

import { NextRequest, NextResponse } from 'next/server';

import { niaAgent } from '@/lib/ai/agents/NiaAgent';

export async function POST(request: NextRequest) {
    try {
        const { input, agent, tenantId } = await request.json() as { input: string; agent: string; tenantId?: string };

        if (!input) {
            return NextResponse.json(
                { error: 'Input message is required' },
                { status: 400 }
            );
        }

        // For now, only support Nia agent for instyle
        if (agent !== 'nia') {
            return NextResponse.json(
                { error: 'Agent not supported' },
                { status: 400 }
            );
        }

        // Generate a temporary user ID for the conversation
        const userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Process the message with the agent
        const response = await niaAgent.handleBookingIntent(userId, input, {

        });

        return NextResponse.json({
            response: response.message,
            agent,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Agent API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}