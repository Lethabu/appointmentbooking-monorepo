import { NextRequest, NextResponse } from 'next/server';

import { csrfProtection } from '../csrf';

import { enterpriseAuth } from './enterprise-auth-framework';
import { calendarSecurity } from './enterprise-calendar-security';
import { sessionManager } from './enterprise-session-manager';

/**
 * Enterprise API Authentication & Authorization
 * Enhanced API security with multi-tenant support and compliance features
 */

export interface APIAuthConfig {
    enableRateLimit: boolean;
    enableCSRF: boolean;
    enableAuditLogging: boolean;
    requireMFA: boolean;
    tenantIsolation: boolean;
    complianceMode: 'standard' | 'gdpr' | 'pci' | 'hipaa' | 'enterprise';
    rateLimits: {
        default: { requests: number; window: number };
        auth: { requests: number; window: number };
        admin: { requests: number; window: number };
        webhook: { requests: number; window: number };
    };
}

export interface APIAuthContext {
    userId: string;
    tenantId: string;
    sessionId: string;
    userRole: string;
    permissions: string[];
    mfaVerified: boolean;
    tenant: {
        id: string;
        name: string;
        plan: string;
        compliance: {
            gdprEnabled: boolean;
            pciCompliance: boolean;
            auditLogging: boolean;
        };
    };
    request: {
        ip: string;
        userAgent: string;
        method: string;
        path: string;
        timestamp: Date;
    };
}

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class EnterpriseAPIAuth {
    private config: APIAuthConfig;

    constructor(config?: Partial<APIAuthConfig>) {
        this.config = {
            enableRateLimit: true,
            enableCSRF: true,
            enableAuditLogging: true,
            requireMFA: false,
            tenantIsolation: true,
            complianceMode: 'enterprise',
            rateLimits: {
                default: { requests: 100, window: 60 },
                auth: { requests: 5, window: 300 },
                admin: { requests: 10, window: 60 },
                webhook: { requests: 1000, window: 60 }
            },
            ...config
        };
    }

    /**
     * Main API authentication middleware
     */
    async authenticate(
        request: NextRequest,
        options?: {
            requiredPermission?: string;
            requireMFA?: boolean;
            rateLimitKey?: string;
            auditAction?: string;
        }
    ): Promise<{
        success: boolean;
        context?: APIAuthContext;
        response?: NextResponse;
        error?: string;
    }> {
        try {
            // 1. Rate limiting
            if (this.config.enableRateLimit) {
                const rateLimitResponse = await this.checkRateLimit(request, options?.rateLimitKey);
                if (rateLimitResponse) {
                    return { success: false, response: rateLimitResponse };
                }
            }

            // 2. CSRF protection
            if (this.config.enableCSRF && this.requiresCSRFProtection(request)) {
                const csrfResponse = await csrfProtection(request);
                if (csrfResponse) {
                    await this.logSecurityEvent(request, 'csrf_violation', 'high', 'CSRF protection failed');
                    return { success: false, response: csrfResponse };
                }
            }

            // 3. Extract session token
            const sessionToken = this.extractSessionToken(request);
            if (!sessionToken) {
                return this.handleUnauthorized(request, 'Missing authentication token');
            }

            // 4. Validate session
            const sessionValidation = await sessionManager.validateSession(sessionToken, request);
            if (!sessionValidation.valid || !sessionValidation.session) {
                return this.handleUnauthorized(request, 'Invalid or expired session');
            }

            const session = sessionValidation.session;

            // 5. Get user context
            const userContext = await this.getUserContext(session.userId, session.tenantId);
            if (!userContext) {
                return this.handleUnauthorized(request, 'User context not found');
            }

            // 6. MFA verification if required
            if (this.config.requireMFA || options?.requireMFA) {
                if (!session.mfaVerified) {
                    return this.handleUnauthorized(request, 'MFA verification required', 401, 'MFA_REQUIRED');
                }
            }

            // 7. Permission check
            if (options?.requiredPermission) {
                const authResult = await enterpriseAuth.authorize(session, options.requiredPermission as any);
                if (!authResult.authorized) {
                    await this.logSecurityEvent(
                        request,
                        'permission_denied',
                        'medium',
                        'Insufficient permissions',
                        {
                            userId: session.userId,
                            permission: options.requiredPermission,
                            path: request.nextUrl.pathname
                        }
                    );
                    return this.handleForbidden(request, 'Insufficient permissions');
                }
            }

            // 8. Tenant isolation
            if (this.config.tenantIsolation) {
                const isolationCheck = await this.checkTenantIsolation(userContext, request);
                if (!isolationCheck.allowed) {
                    await this.logSecurityEvent(
                        request,
                        'tenant_isolation_violation',
                        'critical',
                        'Cross-tenant access attempt',
                        {
                            userTenant: userContext.tenantId,
                            requestTenant: this.getRequestTenant(request),
                            path: request.nextUrl.pathname
                        }
                    );
                    return this.handleUnauthorized(request, 'Tenant isolation violation');
                }
            }

            // 9. Create auth context
            const authContext: APIAuthContext = {
                userId: session.userId,
                tenantId: session.tenantId,
                sessionId: session.sessionId,
                userRole: userContext.role,
                permissions: userContext.permissions,
                mfaVerified: session.mfaVerified,
                tenant: userContext.tenant,
                request: {
                    ip: this.getClientIP(request),
                    userAgent: request.headers.get('user-agent') || 'unknown',
                    method: request.method,
                    path: request.nextUrl.pathname,
                    timestamp: new Date()
                }
            };

            // 10. Audit logging
            if (this.config.enableAuditLogging && options?.auditAction) {
                await this.logAuditEvent(authContext, options.auditAction, request);
            }

            // 11. Security monitoring
            await this.monitorRequest(authContext, request);

            return { success: true, context: authContext };

        } catch (error) {
            console.error('API authentication error:', error);
            await this.logSecurityEvent(
                request,
                'authentication_error',
                'high',
                'Authentication system error',
                { error: error instanceof Error ? error.message : 'Unknown error' }
            );
            return this.handleUnauthorized(request, 'Authentication system error');
        }
    }

    /**
     * Service-to-service authentication
     */
    async authenticateService(
        request: NextRequest,
        serviceName: string
    ): Promise<{
        success: boolean;
        serviceId?: string;
        permissions?: string[];
        response?: NextResponse;
    }> {
        try {
            const internalSecret = request.headers.get('x-internal-secret');
            const serviceId = request.headers.get('x-service-id');

            if (!internalSecret || !serviceId) {
                return this.handleUnauthorized(request, 'Missing service credentials');
            }

            // Validate internal secret
            if (internalSecret !== process.env.INTERNAL_SERVICE_KEY) {
                await this.logSecurityEvent(
                    request,
                    'service_auth_failure',
                    'high',
                    'Invalid service credentials',
                    { serviceId, serviceName }
                );
                return this.handleUnauthorized(request, 'Invalid service credentials');
            }

            // Get service permissions
            const servicePermissions = await this.getServicePermissions(serviceId, serviceName);
            if (!servicePermissions) {
                return this.handleUnauthorized(request, 'Service not authorized');
            }

            return {
                success: true,
                serviceId,
                permissions: servicePermissions
            };

        } catch (error) {
            console.error('Service authentication error:', error);
            return this.handleUnauthorized(request, 'Service authentication failed');
        }
    }

    /**
     * Calendar API specific authentication
     */
    async authenticateCalendarAPI(
        request: NextRequest,
        tenantId: string
    ): Promise<{
        success: boolean;
        connectionId?: string;
        permissions?: string[];
        response?: NextResponse;
    }> {
        try {
            // First authenticate user
            const userAuth = await this.authenticate(request, {
                requiredPermission: 'calendar:read',
                rateLimitKey: 'calendar'
            });

            if (!userAuth.success || !userAuth.context) {
                return { success: false, response: userAuth.response };
            }

            // Verify tenant matches
            if (userAuth.context.tenantId !== tenantId) {
                return this.handleUnauthorized(request, 'Tenant mismatch');
            }

            // Check calendar permissions
            const calendarAuth = await enterpriseAuth.authorize(
                { sessionId: userAuth.context.sessionId, userId: userAuth.context.userId, tenantId } as any,
                'calendar:write'
            );

            if (!calendarAuth.authorized) {
                return this.handleForbidden(request, 'Insufficient calendar permissions');
            }

            // Validate calendar connections
            const securityAudit = await calendarSecurity.performSecurityAudit(tenantId);
            if (securityAudit.overallScore < 70) {
                await this.logSecurityEvent(
                    request,
                    'calendar_security_risk',
                    'high',
                    'Calendar integration security risk detected',
                    { score: securityAudit.overallScore, issues: securityAudit.issues.length }
                );
                return this.handleUnauthorized(request, 'Calendar security requirements not met');
            }

            return {
                success: true,
                permissions: ['calendar:read', 'calendar:write']
            };

        } catch (error) {
            console.error('Calendar API authentication error:', error);
            return this.handleUnauthorized(request, 'Calendar authentication failed');
        }
    }

    /**
     * Compliance mode authentication
     */
    async authenticateWithCompliance(
        request: NextRequest,
        complianceType: 'gdpr' | 'pci' | 'hipaa',
        dataAccess: 'read' | 'write' | 'delete'
    ): Promise<{
        success: boolean;
        complianceValidated: boolean;
        context?: APIAuthContext;
        response?: NextResponse;
    }> {
        try {
            // Standard authentication first
            const auth = await this.authenticate(request, {
                requireMFA: true,
                auditAction: `compliance_${complianceType}_${dataAccess}`
            });

            if (!auth.success || !auth.context) {
                return { success: false, complianceValidated: false, response: auth.response };
            }

            // Compliance-specific checks
            const complianceCheck = await this.validateCompliance(
                auth.context,
                complianceType,
                dataAccess,
                request
            );

            if (!complianceCheck.valid) {
                await this.logSecurityEvent(
                    request,
                    'compliance_violation',
                    'critical',
                    `${complianceType.toUpperCase()} compliance violation`,
                    {
                        userId: auth.context.userId,
                        tenantId: auth.context.tenantId,
                        dataAccess,
                        reason: complianceCheck.reason
                    }
                );
                const unauthorizedResult = this.handleUnauthorized(request, `Compliance validation failed: ${complianceCheck.reason}`);
                return {
                    success: false,
                    complianceValidated: false,
                    response: unauthorizedResult.response
                };
            }

            return {
                success: true,
                complianceValidated: true,
                context: auth.context
            };

        } catch (error) {
            console.error('Compliance authentication error:', error);
            const unauthorizedResult = this.handleUnauthorized(request, 'Compliance authentication failed');
            return {
                success: false,
                complianceValidated: false,
                response: unauthorizedResult.response
            };
        }
    }

    /**
     * Rate limiting with tenant and user scope
     */
    async checkRateLimit(
        request: NextRequest,
        customKey?: string
    ): Promise<NextResponse | null> {
        const path = request.nextUrl.pathname;
        const userId = request.headers.get('x-user-id') || 'anonymous';
        const tenantId = request.headers.get('x-tenant-id') || 'global';

        // Determine rate limit config
        let config = this.config.rateLimits.default;
        if (path.includes('/api/auth')) config = this.config.rateLimits.auth;
        else if (path.includes('/api/admin')) config = this.config.rateLimits.admin;
        else if (path.includes('webhook')) config = this.config.rateLimits.webhook;

        // Create rate limit key
        const key = customKey || `${tenantId}:${userId}:${path}`;
        const now = Date.now();
        const record = rateLimitStore.get(key);

        if (!record) {
            rateLimitStore.set(key, { count: 1, resetTime: now + config.window * 1000 });
            return null;
        }

        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + config.window * 1000;
            return null;
        }

        if (record.count >= config.requests) {
            await this.logSecurityEvent(
                request,
                'rate_limit_exceeded',
                'medium',
                'API rate limit exceeded',
                { key, count: record.count, limit: config.requests }
            );

            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.ceil((record.resetTime - now) / 1000)
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
                    }
                }
            );
        }

        record.count++;
        return null;
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    private extractSessionToken(request: NextRequest): string | null {
        // Try multiple sources for session token
        return request.cookies.get('enterprise_session')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '') ||
            request.headers.get('x-session-token');
    }

    private async getUserContext(userId: string, tenantId: string): Promise<any> {
        // Implementation would fetch user context from database
        // This is a placeholder for the actual implementation
        return {
            id: userId,
            role: 'user',
            permissions: ['basic_access'],
            tenant: {
                id: tenantId,
                name: 'Demo Tenant',
                plan: 'enterprise',
                compliance: {
                    gdprEnabled: true,
                    pciCompliance: true,
                    auditLogging: true
                }
            }
        };
    }

    private async getServicePermissions(serviceId: string, serviceName: string): Promise<string[] | null> {
        // Implementation would validate service and return permissions
        return ['service_access'];
    }

    private requiresCSRFProtection(request: NextRequest): boolean {
        const method = request.method;
        const path = request.nextUrl.pathname;

        // Only protect state-changing operations
        return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
            !path.includes('webhook') &&
            !path.includes('auth');
    }

    private async checkTenantIsolation(userContext: any, request: NextRequest): Promise<{ allowed: boolean; reason?: string }> {
        const requestTenantId = this.getRequestTenant(request);

        if (userContext.tenantId !== requestTenantId) {
            return { allowed: false, reason: 'Cross-tenant access attempt' };
        }

        return { allowed: true };
    }

    private getRequestTenant(request: NextRequest): string {
        // Extract tenant from subdomain, header, or path
        const host = request.headers.get('host') || '';
        const subdomain = host.split('.')[0];

        return request.headers.get('x-tenant-id') ||
            subdomain !== 'www' ? subdomain :
            'default';
    }

    private async validateCompliance(
        context: APIAuthContext,
        complianceType: string,
        dataAccess: string,
        request: NextRequest
    ): Promise<{ valid: boolean; reason?: string }> {
        // Implementation would validate compliance requirements
        return { valid: true };
    }

    private async logAuditEvent(context: APIAuthContext, action: string, request: NextRequest): Promise<void> {
        // Implementation would log audit events
        console.log('AUDIT:', {
            action,
            userId: context.userId,
            tenantId: context.tenantId,
            path: request.nextUrl.pathname,
            timestamp: new Date().toISOString()
        });
    }

    private async logSecurityEvent(
        request: NextRequest,
        eventType: string,
        severity: string,
        description: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        // Implementation would log security events
        console.warn('SECURITY:', {
            eventType,
            severity,
            description,
            ip: this.getClientIP(request),
            userAgent: request.headers.get('user-agent'),
            path: request.nextUrl.pathname,
            metadata,
            timestamp: new Date().toISOString()
        });
    }

    private async monitorRequest(context: APIAuthContext, request: NextRequest): Promise<void> {
        // Implementation would monitor requests for anomalies
        // This could include ML-based anomaly detection
    }

    private getClientIP(request: NextRequest): string {
        return request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';
    }

    private handleUnauthorized(
        request: NextRequest,
        message: string,
        status: number = 401,
        code?: string
    ): { success: false; response: NextResponse } {
        const response = NextResponse.json(
            { error: message, code: code || 'UNAUTHORIZED' },
            { status }
        );

        // Add security headers
        response.headers.set('WWW-Authenticate', 'Bearer');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');

        return { success: false, response };
    }

    private handleForbidden(request: NextRequest, message: string): { success: false; response: NextResponse } {
        return this.handleUnauthorized(request, message, 403, 'FORBIDDEN');
    }
}

// Export singleton instance
export const apiAuth = new EnterpriseAPIAuth();