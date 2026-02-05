import { NextRequest, NextResponse } from 'next/server';

import { apiSecurityMiddleware } from '../api-security';
import { csrfProtection } from '../csrf';

import { enterpriseAuth } from './enterprise-auth-framework';

/**
 * Enterprise Authentication Middleware
 * Multi-tenant, compliance-ready authentication middleware with advanced security
 */

// Rate limiting configurations for different endpoints
const RATE_LIMIT_CONFIGS = {
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
    webhook: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
    admin: { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute
};

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Main enterprise authentication middleware
 */
export async function enterpriseAuthMiddleware(request: NextRequest) {
    const url = request.nextUrl;
    const path = url.pathname;

    // Skip for static assets and Next.js internal routes
    if (
        path.startsWith('/_next') ||
        path.startsWith('/api/auth') ||
        path.includes('.') ||
        path === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    try {
        // 1. Extract tenant context from domain or header
        const tenantContext = await extractTenantContext(request);
        if (!tenantContext) {
            return NextResponse.json(
                { error: 'Invalid tenant context', code: 'INVALID_TENANT' },
                { status: 400 }
            );
        }

        // 2. CSRF protection for state-changing operations
        const csrfResult = await csrfProtection(request);
        if (csrfResult) {
            return csrfResult;
        }

        // 3. Rate limiting
        const rateLimitResult = await checkRateLimit(request);
        if (rateLimitResult) {
            return rateLimitResult;
        }

        // 4. Extract and validate session
        const sessionResult = await validateEnterpriseSession(request);
        if (!sessionResult.valid) {
            return handleUnauthorizedRequest(request, 'Invalid or expired session');
        }

        const { session, user, needsRefresh } = sessionResult;

        // 5. Check if session needs refresh
        if (needsRefresh) {
            const refreshResponse = await handleSessionRefresh(request, session);
            if (refreshResponse) {
                return refreshResponse;
            }
        }

        // 6. Add security context to request
        const requestWithContext = addSecurityContext(request, {
            session,
            user,
            tenant: tenantContext
        });

        // 7. Log security event for audit
        if (shouldLogAccess(path) && user && session) {
            await enterpriseAuth.logAuthEvent(
                user.id,
                session.tenantId,
                'data_access',
                {
                    path,
                    method: request.method,
                    timestamp: new Date().toISOString()
                },
                request
            );
        }

        // 8. Check for MFA requirement on sensitive operations
        if (requiresMFA(path, request.method) && session && !session.mfaVerified) {
            return NextResponse.json(
                { error: 'MFA verification required', code: 'MFA_REQUIRED' },
                { status: 401 }
            );
        }

        return NextResponse.next({
            request: {
                headers: new Headers(requestWithContext.headers)
            }
        });

    } catch (error) {
        console.error('Enterprise auth middleware error:', error);

        await enterpriseAuth.logAuthEvent(
            null,
            'system',
            'suspicious_activity',
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                path,
                method: request.method,
                timestamp: new Date().toISOString()
            },
            request
        );

        return NextResponse.json(
            { error: 'Authentication system error', code: 'AUTH_SYSTEM_ERROR' },
            { status: 500 }
        );
    }
}

/**
 * Extract tenant context from request
 */
async function extractTenantContext(request: NextRequest) {
    // Try to get tenant from subdomain
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0];

    // Try to get tenant from header (for API calls)
    const tenantId = request.headers.get('x-tenant-id') || subdomain;

    if (!tenantId || tenantId === 'www' || tenantId === 'localhost') {
        return null;
    }

    // In production, this would query the database for tenant details
    return {
        id: tenantId,
        name: tenantId,
        slug: tenantId,
        plan: 'enterprise',
        features: ['calendar_integration', 'advanced_analytics', 'compliance'],
        compliance: {
            gdprEnabled: true,
            pciCompliance: true,
            auditLogging: true,
            dataRetention: 2555 // 7 years
        },
        limits: {
            maxUsers: 10000,
            maxBookings: 100000,
            apiRateLimit: 10000,
            storageLimit: 10737418240 // 10GB
        }
    };
}

/**
 * Enterprise session validation
 */
async function validateEnterpriseSession(request: NextRequest) {
    const sessionId = request.cookies.get('enterprise_session')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!sessionId) {
        return { valid: false };
    }

    return await enterpriseAuth.validateSession(sessionId, request);
}

/**
 * Rate limiting with tenant and user scope
 */
async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const path = request.nextUrl.pathname;
    const ip = getClientIP(request);

    // Determine rate limit config based on path
    let config = RATE_LIMIT_CONFIGS.api;
    if (path.startsWith('/api/auth')) config = RATE_LIMIT_CONFIGS.auth;
    else if (path.startsWith('/api/admin')) config = RATE_LIMIT_CONFIGS.admin;
    else if (path.includes('webhook')) config = RATE_LIMIT_CONFIGS.webhook;

    const key = `${ip}:${path}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record) {
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
        return null;
    }

    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + config.windowMs;
        return null;
    }

    if (record.count >= config.maxRequests) {
        await enterpriseAuth.logAuthEvent(
            null,
            'system',
            'suspicious_activity',
            {
                reason: 'rate_limit_exceeded',
                path,
                count: record.count,
                limit: config.maxRequests
            },
            request
        );

        return NextResponse.json(
            { error: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' },
            { status: 429 }
        );
    }

    record.count++;
    return null;
}

/**
 * Session refresh handling
 */
async function handleSessionRefresh(request: NextRequest, session: any): Promise<NextResponse | null> {
    try {
        if (!session || !session.userId) {
            return null;
        }

        const newSession = await enterpriseAuth.createSession(
            { id: session.userId } as any,
            session.tenantId,
            request
        );

        const response = NextResponse.next();
        response.headers.set('x-session-refreshed', 'true');
        return response;
    } catch (error) {
        console.error('Session refresh error:', error);
        return null;
    }
}

/**
 * Add security context to request for downstream handlers
 */
function addSecurityContext(request: NextRequest, context: { session: any; user: any; tenant: any }): NextRequest {
    // Create a new request with additional headers
    const requestWithContext = new NextRequest(request.url, {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: request.redirect,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        integrity: request.integrity,
        keepalive: request.keepalive,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy
    });

    // Add context to request headers for downstream access
    if (context.session) {
        requestWithContext.headers.set('x-session-id', context.session.sessionId);
        requestWithContext.headers.set('x-mfa-verified', context.session.mfaVerified.toString());
    }
    if (context.user) {
        requestWithContext.headers.set('x-user-id', context.user.id);
        requestWithContext.headers.set('x-user-role', context.user.role);
    }
    if (context.tenant) {
        requestWithContext.headers.set('x-tenant-id', context.tenant.id);
    }

    return requestWithContext;
}

/**
 * Check if path should be logged for audit
 */
function shouldLogAccess(path: string): boolean {
    const sensitivePaths = [
        '/api/bookings',
        '/api/customers',
        '/api/payments',
        '/api/admin',
        '/api/analytics'
    ];

    return sensitivePaths.some(sp => path.startsWith(sp));
}

/**
 * Check if operation requires MFA
 */
function requiresMFA(path: string, method: string): boolean {
    const mfaRequiredPaths = [
        '/api/admin',
        '/api/auth/change-password',
        '/api/tenant/billing',
        '/api/compliance'
    ];

    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isMfaPath = mfaRequiredPaths.some(p => path.startsWith(p));

    return isMfaPath && isWriteOperation;
}

/**
 * Handle unauthorized requests with appropriate responses
 */
function handleUnauthorizedRequest(request: NextRequest, message: string): NextResponse {
    const path = request.nextUrl.pathname;

    // API requests get JSON responses
    if (path.startsWith('/api/')) {
        return NextResponse.json(
            { error: message, code: 'UNAUTHORIZED' },
            { status: 401 }
        );
    }

    // Web pages redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

// ============================================================================
// MIDDLEWARE WRAPPER FOR API ROUTES
// ============================================================================

/**
 * Wrapper to add enterprise auth to API routes
 */
export function withEnterpriseAuth(handler: Function, options?: {
    requiredPermission?: string;
    requireMFA?: boolean;
    rateLimitConfig?: keyof typeof RATE_LIMIT_CONFIGS;
}) {
    return async (request: NextRequest, ...args: any[]) => {
        try {
            // Apply enterprise auth middleware
            const authResult = await enterpriseAuthMiddleware(request);
            if (authResult) {
                return authResult;
            }

            // Check permissions if specified
            if (options?.requiredPermission) {
                const sessionId = request.cookies.get('enterprise_session')?.value;
                if (sessionId) {
                    const sessionResult = await enterpriseAuth.validateSession(sessionId, request);
                    if (sessionResult.valid && sessionResult.session) {
                        const authResult = await enterpriseAuth.authorize(
                            sessionResult.session,
                            options.requiredPermission as any
                        );

                        if (!authResult.authorized) {
                            return NextResponse.json(
                                { error: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' },
                                { status: 403 }
                            );
                        }
                    }
                }
            }

            // Check MFA requirement if specified
            if (options?.requireMFA) {
                const sessionId = request.cookies.get('enterprise_session')?.value;
                if (sessionId) {
                    const sessionResult = await enterpriseAuth.validateSession(sessionId, request);
                    if (sessionResult.valid && sessionResult.session && !sessionResult.session.mfaVerified) {
                        return NextResponse.json(
                            { error: 'MFA verification required', code: 'MFA_REQUIRED' },
                            { status: 401 }
                        );
                    }
                }
            }

            // Call the original handler with enhanced request
            return await handler(request, ...args);

        } catch (error) {
            console.error('Enterprise auth wrapper error:', error);
            return NextResponse.json(
                { error: 'Authentication error', code: 'AUTH_ERROR' },
                { status: 500 }
            );
        }
    };
}

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export const enterpriseAuthConfig = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    rateLimits: RATE_LIMIT_CONFIGS,
    mfaRequiredPaths: [
        '/api/admin',
        '/api/auth/change-password',
        '/api/tenant/billing'
    ],
    auditLogPaths: [
        '/api/bookings',
        '/api/customers',
        '/api/payments',
        '/api/admin'
    ]
};