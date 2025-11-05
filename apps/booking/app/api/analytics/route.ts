import { NextResponse } from 'next/server';

// Simple server endpoint to receive client-side analytics events.
// This is intentionally minimal: it logs received events to the server console
// and returns 204. In production you should forward these to Vercel Analytics
// (or another analytics provider) using server-side SDKs or the provider API.

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // eslint-disable-next-line no-console
    console.info('Analytics event received:', JSON.stringify(payload));
    // TODO: Forward to Vercel Analytics or a BI pipeline here.
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
}
