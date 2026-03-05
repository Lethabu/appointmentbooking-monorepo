// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
// Make sure Ollama is running and accessible from your Next.js application.
// You might need to expose it on your network if it's running on a different machine.
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { prompt: string; model?: string };
    const { prompt, model = 'llama3' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: true, // We will handle the streaming response
      }),
    });

    if (!response.body) {
      return NextResponse.json({ error: 'No response body from Ollama' }, { status: 500 });
    }

    // Here we are streaming the response from Ollama back to the client
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return NextResponse.json({ error: 'Failed to call Ollama API' }, { status: 500 });
  }
}
