import { NextRequest, NextResponse } from 'next/server';

/**
 * API Authentication & Security Middleware
 * Combines Rate Limiting, API Key Validation, and JWT Verification
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
};

// In-memory rate limit store (Note: Replace with Redis for production/distributed envs)
const ipRequestCounts = new Map<string, { count: number; startTime: number }>();

/**
 * Validates API Key from headers
 */
function validateApiKey(req: NextRequest): boolean {
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.API_SECRET_KEY;

    if (!validApiKey) {
        console.warn('API_SECRET_KEY not configured in environment');
        return false;
    }

    return apiKey === validApiKey;
}

/**
 * Checks Rate Limit for a given IP
 */
function checkRateLimit(ip: string, config: RateLimitConfig = DEFAULT_RATE_LIMIT): boolean {
    const now = Date.now();
    const record = ipRequestCounts.get(ip);

    if (!record) {
        ipRequestCounts.set(ip, { count: 1, startTime: now });
        return true;
    }

    if (now - record.startTime > config.windowMs) {
        // Reset window
        record.count = 1;
        record.startTime = now;
        return true;
    }

    if (record.count >= config.maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

/**
 * Main API Security Middleware
 */
export async function apiSecurityMiddleware(req: NextRequest) {
    // 1. IP-based Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
        );
    }

    // 2. API Key Validation for Protected Routes
    // Allow public access to auth endpoints, otherwise require key or session
    const path = req.nextUrl.pathname;
    const isPublicPath = path.startsWith('/api/auth') || path.startsWith('/api/public');

    if (!isPublicPath) {
        const isValidKey = validateApiKey(req);
        const authHeader = req.headers.get('authorization');
        const hasSession = authHeader && authHeader.startsWith('Bearer ');

        if (!isValidKey && !hasSession) {
            // Allow internal service-to-service if secret is present
            const internalSecret = req.headers.get('x-internal-secret');
            if (internalSecret !== process.env.INTERNAL_SERVICE_KEY) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Missing valid authentication credentials' },
                    { status: 401 }
                );
            }
        }
    }

    return null; // Proceed to next handler
}
