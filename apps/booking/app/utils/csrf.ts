import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * CSRF Protection Middleware
 * Implements Double Submit Cookie pattern for stateless CSRF protection
 */

// Generate a random token
function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function csrfProtection(req: NextRequest) {
    // Skip for GET, HEAD, OPTIONS requests (safe methods)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return null;
    }

    // Skip if we are in a server-to-service call (Internal Secret)
    const internalSecret = req.headers.get('x-internal-secret');
    if (internalSecret && internalSecret === process.env.INTERNAL_SERVICE_KEY) {
        return null;
    }

    // Check for CSRF token in headers
    const csrfHeader = req.headers.get('x-csrf-token');
    const csrfCookie = req.cookies.get('csrf-token')?.value;

    if (!csrfCookie) {
        // If no cookie, we can't validate. 
        // For initial requests or public APIs this might be okay depending on policy,
        // but for mutation actions on protected resources, this is a violation.
        // We'll enforce it for authenticated sessions.

        const session = await getToken({ req });
        if (session) {
            return NextResponse.json(
                { error: 'CSRF Error', message: 'Missing CSRF token' },
                { status: 403 }
            );
        }
        return null;
    }

    if (!csrfHeader || csrfHeader !== csrfCookie) {
        return NextResponse.json(
            { error: 'CSRF Error', message: 'Invalid CSRF token' },
            { status: 403 }
        );
    }

    return null;
}

/**
 * Helper to set CSRF cookie on response
 */
export function setCsrfCookie(res: NextResponse) {
    const token = generateToken();
    res.cookies.set('csrf-token', token, {
        httpOnly: false, // Accessible to JS so it can be read and sent in header
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    return res;
}
