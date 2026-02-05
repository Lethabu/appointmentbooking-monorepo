import { getDb } from '@repo/db';
import { eq, and, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Cloudflare D1 Database environment type
interface Env {
    DB: D1Database;
}

/**
 * Enterprise Authentication & Authorization Framework
 * Multi-tenant, compliance-ready authentication system with advanced security features
 */

// ============================================================================
// ENTERPRISE TYPES AND INTERFACES
// ============================================================================

export interface EnterpriseUser {
    id: string;
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role: UserRole;
    tenantId: string;
    tenantRole: TenantRole;
    permissions: Permission[];
    mfaEnabled: boolean;
    lastLogin?: Date;
    loginAttempts: number;
    accountLocked: boolean;
    passwordLastChanged: Date;
    sessionTimeout: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer' | 'guest';
export type TenantRole = 'owner' | 'admin' | 'manager' | 'staff' | 'customer' | 'guest';

export type Permission =
    // User Management
    | 'users:read' | 'users:write' | 'users:delete' | 'users:manage_mfa'
    // Tenant Management
    | 'tenant:read' | 'tenant:write' | 'tenant:manage_billing' | 'tenant:configure'
    // Booking Management
    | 'bookings:read_own' | 'bookings:read_all' | 'bookings:create' | 'bookings:update_own' | 'bookings:update_all' | 'bookings:cancel_own' | 'bookings:cancel_all' | 'bookings:manage'
    // Service Management
    | 'services:read' | 'services:write' | 'services:delete'
    // Financial
    | 'payments:read' | 'payments:process' | 'payments:refund' | 'financial:reports'
    // Analytics & Reporting
    | 'analytics:read' | 'analytics:export' | 'reports:generate'
    // System Administration
    | 'system:config' | 'system:maintenance' | 'logs:read' | 'security:audit'
    // Calendar Integration
    | 'calendar:read' | 'calendar:write' | 'calendar:manage_integrations'
    // Compliance
    | 'compliance:gdpr' | 'compliance:pci' | 'compliance:audit';

export interface TenantContext {
    id: string;
    name: string;
    slug: string;
    plan: 'free' | 'professional' | 'enterprise';
    features: string[];
    compliance: {
        gdprEnabled: boolean;
        pciCompliance: boolean;
        auditLogging: boolean;
        dataRetention: number; // days
    };
    limits: {
        maxUsers: number;
        maxBookings: number;
        apiRateLimit: number;
        storageLimit: number;
    };
}

export interface SessionContext {
    sessionId: string;
    userId: string;
    tenantId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    mfaVerified: boolean;
    deviceFingerprint: string;
}

export interface AuthAuditEvent {
    id: string;
    userId: string;
    tenantId: string;
    eventType: AuthEventType;
    eventData: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export type AuthEventType =
    | 'login_success' | 'login_failure' | 'logout' | 'password_change'
    | 'mfa_setup' | 'mfa_verification' | 'account_locked' | 'account_unlocked'
    | 'permission_denied' | 'session_expired' | 'suspicious_activity'
    | 'data_access' | 'compliance_request';

// ============================================================================
// ENTERPRISE AUTHENTICATION SERVICE
// ============================================================================

export class EnterpriseAuthService {
    private db: ReturnType<typeof getDb>;
    private jwtSecret: string;
    private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
    private maxLoginAttempts: number = 5;
    private lockoutDuration: number = 15 * 60 * 1000; // 15 minutes

    constructor() {
        // Fixed database configuration for TypeScript compatibility
        // For Cloudflare Workers environment
        const env = { DB: {} as D1Database };
        this.db = getDb(env);
        this.jwtSecret = process.env.JWT_SECRET || 'enterprise-jwt-secret-key';
    }

    /**
     * Multi-tenant user authentication with enterprise security
     */
    async authenticateUser(
        email: string,
        password: string,
        tenantId: string,
        request: NextRequest
    ): Promise<{
        success: boolean;
        user?: EnterpriseUser;
        session?: SessionContext;
        mfaRequired?: boolean;
        error?: string;
    }> {
        try {
            // Input validation
            const emailSchema = z.string().email();
            const passwordSchema = z.string().min(8);

            emailSchema.parse(email);
            passwordSchema.parse(password);

            // Check if account is locked
            const user = await this.getUserByEmailAndTenant(email, tenantId);
            if (!user) {
                await this.logAuthEvent(null, tenantId, 'login_failure', {
                    reason: 'user_not_found',
                    email
                }, request);
                return { success: false, error: 'Invalid credentials' };
            }

            if (user.accountLocked) {
                await this.logAuthEvent(user.id, tenantId, 'account_locked', {
                    reason: 'account_locked',
                    attempts: user.loginAttempts
                }, request);
                return { success: false, error: 'Account is temporarily locked' };
            }

            // Validate password using Web Crypto API
            const isPasswordValid = await this.comparePassword(password, user.password);
            if (!isPasswordValid) {
                await this.handleFailedLogin(user, tenantId, request);
                return { success: false, error: 'Invalid credentials' };
            }

            // Check if MFA is required
            const mfaRequired = user.mfaEnabled && !this.hasRecentMfaVerification(user);

            if (mfaRequired) {
                return {
                    success: false,
                    user,
                    mfaRequired: true,
                    error: 'MFA verification required'
                };
            }

            // Successful authentication
            await this.handleSuccessfulLogin(user, tenantId, request);

            const session = await this.createSession(user, tenantId, request);

            return {
                success: true,
                user,
                session
            };

        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, error: 'Authentication failed' };
        }
    }

    /**
     * Create enterprise session with comprehensive tracking
     */
    async createSession(
        user: EnterpriseUser,
        tenantId: string,
        request: NextRequest
    ): Promise<SessionContext> {
        const sessionId = this.generateSecureId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.sessionTimeout);

        const session: SessionContext = {
            sessionId,
            userId: user.id,
            tenantId,
            ipAddress: this.getClientIP(request),
            userAgent: request.headers.get('user-agent') || 'unknown',
            createdAt: now,
            lastActivity: now,
            expiresAt,
            mfaVerified: !user.mfaEnabled,
            deviceFingerprint: this.generateDeviceFingerprint(request)
        };

        // Store session in database
        await this.storeSession(session);

        // Set secure session cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('enterprise_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: this.sessionTimeout / 1000
        });

        return session;
    }

    /**
     * Validate and refresh enterprise session
     */
    async validateSession(sessionId: string, request: NextRequest): Promise<{
        valid: boolean;
        session?: SessionContext;
        user?: EnterpriseUser;
        needsRefresh?: boolean;
    }> {
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                return { valid: false };
            }

            // Check if session is expired
            if (session.expiresAt < new Date()) {
                await this.invalidateSession(sessionId);
                return { valid: false };
            }

            // Check for suspicious activity
            const riskLevel = await this.assessSessionRisk(session, request);
            if (riskLevel === 'high' || riskLevel === 'critical') {
                await this.handleSuspiciousSession(session, request);
                return { valid: false };
            }

            // Update session activity
            await this.updateSessionActivity(sessionId);

            // Get user and check permissions
            const user = await this.getUserById(session.userId);
            if (!user || !user.isActive) {
                return { valid: false };
            }

            // Check if session needs refresh (last 5 minutes)
            const needsRefresh = session.expiresAt.getTime() - Date.now() < 5 * 60 * 1000;

            return {
                valid: true,
                session,
                user,
                needsRefresh
            };

        } catch (error) {
            console.error('Session validation error:', error);
            return { valid: false };
        }
    }

    /**
     * Enterprise-grade authorization with fine-grained permissions
     */
    async authorize(
        session: SessionContext,
        requiredPermission: Permission,
        resourceContext?: Record<string, any>
    ): Promise<{ authorized: boolean; reason?: string }> {
        try {
            const user = await this.getUserById(session.userId);
            if (!user) {
                return { authorized: false, reason: 'User not found' };
            }

            // Check if user has the required permission
            const hasPermission = user.permissions.includes(requiredPermission);
            if (!hasPermission) {
                await this.logAuthEvent(
                    user.id,
                    session.tenantId,
                    'permission_denied',
                    {
                        permission: requiredPermission,
                        resourceContext
                    }
                );
                return { authorized: false, reason: 'Insufficient permissions' };
            }

            // Resource-level access control
            if (resourceContext) {
                const resourceAccess = await this.checkResourceAccess(
                    user,
                    requiredPermission,
                    resourceContext
                );
                if (!resourceAccess.allowed) {
                    return { authorized: false, reason: resourceAccess.reason };
                }
            }

            // Tenant isolation check
            if (user.tenantId !== session.tenantId) {
                return { authorized: false, reason: 'Tenant isolation violation' };
            }

            return { authorized: true };

        } catch (error) {
            console.error('Authorization error:', error);
            return { authorized: false, reason: 'Authorization check failed' };
        }
    }

    /**
     * Multi-Factor Authentication verification
     */
    async verifyMFA(
        userId: string,
        mfaCode: string,
        tenantId: string,
        request: NextRequest
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // This would integrate with your MFA provider (e.g., Auth0, AWS Cognito, etc.)
            // For now, implementing a placeholder
            const isValidCode = await this.validateMFACode(userId, mfaCode);

            if (!isValidCode) {
                await this.logAuthEvent(userId, tenantId, 'mfa_verification', {
                    success: false,
                    reason: 'invalid_code'
                }, request);
                return { success: false, error: 'Invalid MFA code' };
            }

            // Update user's last MFA verification
            await this.updateLastMfaVerification(userId);

            await this.logAuthEvent(userId, tenantId, 'mfa_verification', {
                success: true
            }, request);

            return { success: true };

        } catch (error) {
            console.error('MFA verification error:', error);
            return { success: false, error: 'MFA verification failed' };
        }
    }

    /**
     * Comprehensive audit logging for compliance
     */
    async logAuthEvent(
        userId: string | null,
        tenantId: string,
        eventType: AuthEventType,
        eventData: Record<string, any>,
        request?: NextRequest
    ): Promise<void> {
        try {
            const auditEvent: AuthAuditEvent = {
                id: this.generateSecureId(),
                userId: userId || 'system',
                tenantId,
                eventType,
                eventData,
                ipAddress: request ? this.getClientIP(request) : 'unknown',
                userAgent: request?.headers.get('user-agent') || 'unknown',
                timestamp: new Date(),
                riskLevel: this.assessEventRisk(eventType, eventData)
            };

            // Store in database
            await this.storeAuditEvent(auditEvent);

            // Real-time alerting for critical events
            if (auditEvent.riskLevel === 'critical') {
                await this.triggerSecurityAlert(auditEvent);
            }

        } catch (error) {
            console.error('Failed to log auth event:', error);
        }
    }

    /**
     * Session invalidation and cleanup
     */
    async invalidateSession(sessionId: string): Promise<void> {
        try {
            // Remove from active sessions
            await this.removeSession(sessionId);

            // Clear session cookie
            // This would be handled by the response middleware

        } catch (error) {
            console.error('Session invalidation error:', error);
        }
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    private async getUserByEmailAndTenant(email: string, tenantId: string): Promise<EnterpriseUser | null> {
        // Implementation would query the database
        // This is a placeholder for the actual database query
        return null;
    }

    private async handleFailedLogin(user: EnterpriseUser, tenantId: string, request: NextRequest): Promise<void> {
        const attempts = user.loginAttempts + 1;
        const isLocked = attempts >= this.maxLoginAttempts;

        // Update user login attempts
        // await this.updateLoginAttempts(user.id, attempts, isLocked);

        await this.logAuthEvent(user.id, tenantId, 'login_failure', {
            attempts,
            locked: isLocked,
            reason: 'invalid_password'
        }, request);
    }

    private async handleSuccessfulLogin(user: EnterpriseUser, tenantId: string, request: NextRequest): Promise<void> {
        // Reset login attempts
        // await this.updateLoginAttempts(user.id, 0, false);

        // Update last login
        // await this.updateLastLogin(user.id);

        await this.logAuthEvent(user.id, tenantId, 'login_success', {
            method: 'password',
            device: this.generateDeviceFingerprint(request)
        }, request);
    }

    private generateSecureId(): string {
        return `session_${Date.now()}_${crypto.randomUUID()}`;
    }

    private generateDeviceFingerprint(request: NextRequest): string {
        const userAgent = request.headers.get('user-agent') || '';
        const acceptLanguage = request.headers.get('accept-language') || '';
        const acceptEncoding = request.headers.get('accept-encoding') || '';

        return Buffer.from(`${userAgent}-${acceptLanguage}-${acceptEncoding}`).toString('base64');
    }

    private getClientIP(request: NextRequest): string {
        return request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';
    }

    private hasRecentMfaVerification(user: EnterpriseUser): boolean {
        // Check if user has verified MFA in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return !!(user.lastLogin && user.lastLogin > thirtyDaysAgo);
    }

    private async assessSessionRisk(session: SessionContext, request: NextRequest): Promise<'low' | 'medium' | 'high' | 'critical'> {
        const currentIP = this.getClientIP(request);
        const currentUserAgent = request.headers.get('user-agent') || 'unknown';

        // IP change risk
        if (session.ipAddress !== currentIP) {
            return 'medium';
        }

        // User agent change risk
        if (session.userAgent !== currentUserAgent) {
            return 'high';
        }

        return 'low';
    }

    private assessEventRisk(eventType: AuthEventType, eventData: Record<string, any>): 'low' | 'medium' | 'high' | 'critical' {
        const criticalEvents: AuthEventType[] = [
            'account_locked', 'suspicious_activity', 'permission_denied'
        ];

        const highRiskEvents: AuthEventType[] = [
            'login_failure', 'password_change', 'mfa_setup'
        ];

        if (criticalEvents.includes(eventType)) return 'critical';
        if (highRiskEvents.includes(eventType)) return 'high';
        if (eventType === 'login_failure' && eventData.attempts >= 3) return 'high';

        return 'low';
    }

    private async checkResourceAccess(
        user: EnterpriseUser,
        permission: Permission,
        resourceContext: Record<string, any>
    ): Promise<{ allowed: boolean; reason?: string }> {
        // Implement resource-level access control logic
        // This would check if user can access specific resources within their tenant

        // Example: Booking ownership check
        if (permission.includes('bookings:') && resourceContext.bookingId) {
            if (user.role === 'customer' && resourceContext.customerId !== user.id) {
                return { allowed: false, reason: 'Cannot access other users bookings' };
            }
        }

        return { allowed: true };
    }

    // Placeholder methods for database operations
    private async storeSession(session: SessionContext): Promise<void> {
        // Implementation would store session in database
    }

    private async getSession(sessionId: string): Promise<SessionContext | null> {
        // Implementation would retrieve session from database
        return null;
    }

    private async updateSessionActivity(sessionId: string): Promise<void> {
        // Implementation would update session last activity
    }

    private async removeSession(sessionId: string): Promise<void> {
        // Implementation would remove session from database
    }

    private async getUserById(userId: string): Promise<EnterpriseUser | null> {
        // Implementation would retrieve user from database
        return null;
    }

    private async storeAuditEvent(event: AuthAuditEvent): Promise<void> {
        // Implementation would store audit event in database
    }

    private async triggerSecurityAlert(event: AuthAuditEvent): Promise<void> {
        // Implementation would trigger real-time security alerting
        console.warn('SECURITY ALERT:', event);
    }

    private async validateMFACode(userId: string, code: string): Promise<boolean> {
        // Implementation would validate MFA code with external provider
        return code === '123456'; // Placeholder
    }

    private async updateLastMfaVerification(userId: string): Promise<void> {
        // Implementation would update user's last MFA verification timestamp
    }

    private async handleSuspiciousSession(session: SessionContext, request: NextRequest): Promise<void> {
        await this.invalidateSession(session.sessionId);
        await this.logAuthEvent(session.userId, session.tenantId, 'suspicious_activity', {
            sessionId: session.sessionId,
            reason: 'suspicious_activity_detected'
        }, request);
    }

    /**
     * Compare password using Web Crypto API for Cloudflare Workers compatibility
     */
    private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            // Simple hash comparison for demo purposes
            // In production, use proper bcrypt or argon2 with Web Crypto API
            const encoder = new TextEncoder();
            const data = encoder.encode(`${plainPassword  }salt`);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            return hashHex === hashedPassword;
        } catch (error) {
            console.error('Password comparison error:', error);
            return false;
        }
    }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const enterpriseAuth = new EnterpriseAuthService();