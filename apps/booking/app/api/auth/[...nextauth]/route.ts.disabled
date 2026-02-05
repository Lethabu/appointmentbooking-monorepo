// ============================================================================
// Edge-Compatible Authentication Handler for Cloudflare Pages
// This file provides a minimal auth implementation that works with Edge runtime
// ============================================================================

import { NextResponse } from 'next/server';

// ============================================================================
// Edge Runtime Configuration
// ============================================================================
export const runtime = 'edge';

// ============================================================================
// Simple Token Generation (for demo purposes)
// In production, use a proper JWT library compatible with Edge runtime
// ============================================================================
function generateToken(payload: Record<string, unknown>, secret: string): string {
    // Simple base64 encoding for demo - in production use @edge-runtime/jwt
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 }));
    return `${header}.${body}.signature`;
}

function verifyToken(token: string, secret: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const body = JSON.parse(atob(parts[1]));
        if (body.exp < Date.now()) return null;
        return body;
    } catch {
        return null;
    }
}

// ============================================================================
// Auth Handlers
// ============================================================================
export async function GET(request: Request) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // For NextAuth compatibility - redirect to sign in
    if (!action) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    return NextResponse.json({ message: 'Auth action not implemented in Edge mode' });
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as {
            email?: string;
            password?: string;
            provider?: string;
        };
        const { email, password, provider } = body;

        // Simple demo authentication
        // In production, integrate with your actual auth provider

        if (provider === 'credentials' && email && password) {
            // Demo: Accept any login with valid email format
            if (email.includes('@') && password.length >= 6) {
                const token = generateToken(
                    { email, name: email.split('@')[0] },
                    process.env.NEXTAUTH_SECRET || 'demo-secret'
                );

                const response = NextResponse.json({
                    ok: true,
                    url: '/dashboard',
                    token,
                });

                // Set auth cookie
                response.cookies.set('next-auth.session-token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 86400,
                    path: '/',
                });

                return response;
            }

            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // OAuth providers would redirect here
        return NextResponse.json({
            message: 'OAuth providers require additional setup for Edge runtime',
            provider,
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
