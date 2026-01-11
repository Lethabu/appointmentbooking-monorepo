// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextResponse } from 'next/server';
// import { AIClient } from '@repo/ai'; // Temporarily disabled - @repo/ai package not available

// Initialize AI Client (Server-side only) - Temporarily disabled
// const aiClient = new AIClient({
//     googleApiKey: process.env.GOOGLE_API_KEY,
//     openAIApiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req: Request) {
    try {
        const body = await req.json() as { message: string; history?: any[] };
        const { message, history } = body;

        // Temporarily disabled AI response - return fallback message
        const response = "Hello! I'm Nia, your booking assistant. I'm currently being updated. For now, please use our booking form to schedule your appointment. Thank you for your patience!";

        return NextResponse.json({ response });
    } catch (error) {
        console.error('AI Chat Error:', error);
        return NextResponse.json(
            { error: 'Nia is currently offline. Please try again later.' },
            { status: 500 }
        );
    }
}
