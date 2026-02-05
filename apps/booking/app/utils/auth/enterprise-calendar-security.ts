import { getDb } from '@repo/db';
import { eq, and, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { enterpriseAuth } from './enterprise-auth-framework';
import { sessionManager } from './enterprise-session-manager';

/**
 * Enterprise Calendar Integration Security
 * Enhanced security for Google Calendar and Outlook Calendar integrations
 */

export interface CalendarConnectionSecurity {
    id: string;
    tenantId: string;
    provider: 'google' | 'microsoft';
    calendarId: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiry: number;
    isActive: boolean;
    security: {
        encryptionLevel: 'standard' | 'enhanced' | 'enterprise';
        lastSecurityScan: Date;
        riskScore: number;
        complianceFlags: string[];
        tokenRotationScheduled: boolean;
    };
    audit: {
        createdAt: Date;
        lastUsed: Date;
        usageCount: number;
        errorCount: number;
        lastError?: string;
        securityEvents: SecurityEvent[];
    };
    permissions: {
        scopes: string[];
        grantedAt: Date;
        reviewRequired: boolean;
        lastReview: Date;
    };
}

export interface SecurityEvent {
    id: string;
    eventType: SecurityEventType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    metadata: Record<string, any>;
    timestamp: Date;
    resolved: boolean;
}

export type SecurityEventType =
    | 'token_access' | 'token_refresh' | 'unusual_activity' | 'permission_escalation'
    | 'token_expiry_warning' | 'api_limit_reached' | 'integration_suspicious'
    | 'compliance_violation' | 'data_breach_attempt' | 'unauthorized_access';

export interface CalendarSecurityConfig {
    maxConnectionsPerTenant: number;
    tokenRotationInterval: number; // days
    complianceScanning: boolean;
    auditRetention: number; // days
    riskThreshold: number;
    autoTokenRefresh: boolean;
    emergencyTokenRevocation: boolean;
}

export class EnterpriseCalendarSecurity {
    private db: ReturnType<typeof getDb>;
    private config: CalendarSecurityConfig;
    private securityEventQueue: SecurityEvent[] = [];

    constructor() {
        // Use a mock database instance for TypeScript compatibility
        // In production, this would be properly initialized from the environment
        const mockDb = {} as D1Database;
        this.db = getDb({ DB: mockDb });
        this.config = {
            maxConnectionsPerTenant: 10,
            tokenRotationInterval: 90, // 90 days
            complianceScanning: true,
            auditRetention: 2555, // 7 years
            riskThreshold: 70,
            autoTokenRefresh: true,
            emergencyTokenRevocation: true
        };
    }

    /**
     * Securely establish calendar connection with enterprise controls
     */
    async establishSecureConnection(
        tenantId: string,
        provider: 'google' | 'microsoft',
        authCode: string,
        state: string,
        sessionId: string,
        request: NextRequest
    ): Promise<{
        success: boolean;
        connectionId?: string;
        error?: string;
        securityWarnings?: string[];
    }> {
        try {
            // Validate session and permissions
            const sessionValidation = await sessionManager.validateSession(sessionId, request);
            if (!sessionValidation.valid || !sessionValidation.session) {
                return { success: false, error: 'Invalid session' };
            }

            // Check user permissions for calendar integration
            const authResult = await enterpriseAuth.authorize(
                sessionValidation.session,
                'calendar:manage_integrations'
            );

            if (!authResult.authorized) {
                await this.logSecurityEvent(
                    tenantId,
                    'unauthorized_access',
                    'high',
                    'User attempted calendar integration without permissions',
                    { userId: sessionValidation.session.userId, provider }
                );
                return { success: false, error: 'Insufficient permissions' };
            }

            // Check connection limits
            const existingConnections = await this.getActiveConnections(tenantId);
            if (existingConnections.length >= this.config.maxConnectionsPerTenant) {
                return {
                    success: false,
                    error: `Maximum calendar connections (${this.config.maxConnectionsPerTenant}) reached`
                };
            }

            // Exchange code for tokens securely
            const tokens = await this.exchangeCodeForTokens(provider, authCode);
            if (!tokens) {
                return { success: false, error: 'Failed to exchange authorization code' };
            }

            // Get calendar information
            const calendarInfo = await this.getCalendarInfo(provider, tokens.accessToken);
            if (!calendarInfo) {
                return { success: false, error: 'Failed to retrieve calendar information' };
            }

            // Security scan of the integration
            const securityScan = await this.performSecurityScan(
                provider,
                tokens,
                calendarInfo,
                sessionValidation.session
            );

            // Create secure connection
            const connectionId = await this.createSecureConnection(
                tenantId,
                provider,
                tokens,
                calendarInfo,
                securityScan,
                sessionValidation.session
            );

            // Log successful connection
            await this.logSecurityEvent(
                tenantId,
                'token_access',
                'low',
                'Calendar integration established',
                {
                    connectionId,
                    provider,
                    calendarId: calendarInfo.id,
                    userId: sessionValidation.session.userId
                }
            );

            return {
                success: true,
                connectionId,
                securityWarnings: securityScan.warnings
            };

        } catch (error) {
            console.error('Calendar connection establishment error:', error);
            return {
                success: false,
                error: 'Failed to establish calendar connection'
            };
        }
    }

    /**
     * Secure token refresh with audit logging
     */
    async refreshConnectionTokens(
        connectionId: string,
        tenantId: string,
        sessionId: string,
        request: NextRequest
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const connection = await this.getConnection(connectionId, tenantId);
            if (!connection) {
                return { success: false, error: 'Connection not found' };
            }

            // Validate session
            const sessionValidation = await sessionManager.validateSession(sessionId, request);
            if (!sessionValidation.valid) {
                return { success: false, error: 'Invalid session' };
            }

            // Refresh tokens
            const newTokens = await this.refreshTokens(connection.provider, connection.refreshToken);
            if (!newTokens) {
                await this.logSecurityEvent(
                    tenantId,
                    'token_refresh',
                    'high',
                    'Token refresh failed',
                    { connectionId, provider: connection.provider }
                );
                return { success: false, error: 'Token refresh failed' };
            }

            // Update connection with new tokens
            await this.updateConnectionTokens(connectionId, newTokens);

            // Log successful token refresh
            await this.logSecurityEvent(
                tenantId,
                'token_refresh',
                'low',
                'Tokens refreshed successfully',
                { connectionId, provider: connection.provider }
            );

            return { success: true };

        } catch (error) {
            console.error('Token refresh error:', error);
            return { success: false, error: 'Token refresh failed' };
        }
    }

    /**
     * Comprehensive security audit of calendar integrations
     */
    async performSecurityAudit(tenantId: string): Promise<{
        overallScore: number;
        issues: SecurityIssue[];
        recommendations: string[];
        lastScan: Date;
    }> {
        try {
            const connections = await this.getAllConnections(tenantId);
            const issues: SecurityIssue[] = [];
            let totalScore = 100;
            const recommendations: string[] = [];

            for (const connection of connections) {
                // Check token age
                const tokenAge = Date.now() / 1000 - connection.tokenExpiry;
                if (tokenAge > this.config.tokenRotationInterval * 24 * 60 * 60) {
                    issues.push({
                        type: 'token_age',
                        severity: 'medium',
                        description: `Token for ${connection.provider} is older than ${this.config.tokenRotationInterval} days`,
                        connectionId: connection.id,
                        recommendation: 'Rotate tokens immediately'
                    });
                    totalScore -= 15;
                }

                // Check error rate
                const errorRate = connection.audit.errorCount / Math.max(connection.audit.usageCount, 1);
                if (errorRate > 0.1) {
                    issues.push({
                        type: 'high_error_rate',
                        severity: 'high',
                        description: `High error rate (${(errorRate * 100).toFixed(1)}%) for ${connection.provider} integration`,
                        connectionId: connection.id,
                        recommendation: 'Investigate and resolve recurring errors'
                    });
                    totalScore -= 20;
                }

                // Check permission scope creep
                const suspiciousScopes = this.detectSuspiciousScopes(connection.permissions.scopes);
                if (suspiciousScopes.length > 0) {
                    issues.push({
                        type: 'excessive_permissions',
                        severity: 'high',
                        description: `Suspicious permissions detected: ${suspiciousScopes.join(', ')}`,
                        connectionId: connection.id,
                        recommendation: 'Review and minimize permissions'
                    });
                    totalScore -= 25;
                }

                // Check compliance flags
                if (connection.security.complianceFlags.length > 0) {
                    issues.push({
                        type: 'compliance_flags',
                        severity: 'medium',
                        description: `Compliance flags: ${connection.security.complianceFlags.join(', ')}`,
                        connectionId: connection.id,
                        recommendation: 'Address compliance issues'
                    });
                    totalScore -= 10;
                }
            }

            // Generate recommendations
            if (issues.length === 0) {
                recommendations.push('Calendar integrations are secure and compliant');
            } else {
                const uniqueRecommendations = [...new Set(issues.map(i => i.recommendation))];
                recommendations.push(...uniqueRecommendations);
            }

            return {
                overallScore: Math.max(totalScore, 0),
                issues,
                recommendations,
                lastScan: new Date()
            };

        } catch (error) {
            console.error('Security audit error:', error);
            return {
                overallScore: 0,
                issues: [{
                    type: 'audit_failure',
                    severity: 'critical',
                    description: 'Failed to complete security audit',
                    recommendation: 'Manual audit required'
                }],
                recommendations: ['Manual security audit required'],
                lastScan: new Date()
            };
        }
    }

    /**
     * Emergency token revocation
     */
    async emergencyRevocation(tenantId: string, connectionId: string, reason: string): Promise<boolean> {
        try {
            const connection = await this.getConnection(connectionId, tenantId);
            if (!connection) {
                return false;
            }

            // Revoke tokens with provider
            await this.revokeTokens(connection.provider, connection.accessToken);

            // Deactivate connection
            await this.deactivateConnection(connectionId);

            // Log security event
            await this.logSecurityEvent(
                tenantId,
                'unauthorized_access',
                'critical',
                'Emergency token revocation',
                { connectionId, provider: connection.provider, reason }
            );

            return true;

        } catch (error) {
            console.error('Emergency revocation error:', error);
            return false;
        }
    }

    /**
     * Monitor and detect suspicious calendar activity
     */
    async detectSuspiciousActivity(tenantId: string): Promise<{
        suspiciousConnections: string[];
        recentEvents: SecurityEvent[];
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
    }> {
        try {
            const connections = await this.getAllConnections(tenantId);
            const suspiciousConnections: string[] = [];
            const recentEvents: SecurityEvent[] = [];
            let maxRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

            for (const connection of connections) {
                // Check for unusual activity patterns
                const unusualActivity = await this.detectUnusualPatterns(connection);
                if (unusualActivity.detected) {
                    suspiciousConnections.push(connection.id);
                    maxRiskLevel = this.elevateRiskLevel(maxRiskLevel, unusualActivity.severity);
                }

                // Get recent security events
                const connectionEvents = await this.getRecentSecurityEvents(connection.id, 24);
                recentEvents.push(...connectionEvents);

                // Update risk score
                if (connection.security.riskScore > this.config.riskThreshold) {
                    suspiciousConnections.push(connection.id);
                    maxRiskLevel = this.elevateRiskLevel(maxRiskLevel, 'high');
                }
            }

            return {
                suspiciousConnections,
                recentEvents,
                riskLevel: maxRiskLevel
            };

        } catch (error) {
            console.error('Suspicious activity detection error:', error);
            return {
                suspiciousConnections: [],
                recentEvents: [],
                riskLevel: 'critical'
            };
        }
    }

    /**
     * Auto-remediate security issues
     */
    async autoRemediate(tenantId: string): Promise<{
        actions: RemediationAction[];
        summary: string;
    }> {
        try {
            const actions: RemediationAction[] = [];

            // Auto-refresh tokens that are about to expire
            const expiringConnections = await this.getExpiringConnections(tenantId);
            for (const connection of expiringConnections) {
                if (this.config.autoTokenRefresh) {
                    try {
                        await this.refreshConnectionTokens(connection.id, tenantId, 'system', {} as any);
                        actions.push({
                            type: 'token_refresh',
                            description: `Auto-refreshed tokens for ${connection.provider}`,
                            status: 'completed'
                        });
                    } catch (error) {
                        actions.push({
                            type: 'token_refresh',
                            description: `Failed to auto-refresh tokens for ${connection.provider}`,
                            status: 'failed',
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                }
            }

            // Remove inactive connections
            const inactiveConnections = await this.getInactiveConnections(tenantId);
            for (const connection of inactiveConnections) {
                await this.deactivateConnection(connection.id);
                actions.push({
                    type: 'connection_cleanup',
                    description: `Removed inactive ${connection.provider} connection`,
                    status: 'completed'
                });
            }

            // Schedule token rotation for old tokens
            const oldConnections = await this.getOldTokens(tenantId);
            for (const connection of oldConnections) {
                await this.scheduleTokenRotation(connection.id);
                actions.push({
                    type: 'token_rotation_scheduled',
                    description: `Scheduled token rotation for ${connection.provider}`,
                    status: 'scheduled'
                });
            }

            return {
                actions,
                summary: `${actions.filter(a => a.status === 'completed').length} actions completed, ${actions.filter(a => a.status === 'failed').length} failed`
            };

        } catch (error) {
            console.error('Auto-remediation error:', error);
            return {
                actions: [],
                summary: 'Auto-remediation failed'
            };
        }
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    private async exchangeCodeForTokens(provider: string, authCode: string): Promise<any> {
        // Implementation would exchange authorization code for tokens
        // This is a placeholder for the actual token exchange
        return {
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
            expires_in: 3600
        };
    }

    private async getCalendarInfo(provider: string, accessToken: string): Promise<any> {
        // Implementation would get calendar information from provider
        // This is a placeholder for the actual API call
        return {
            id: 'primary',
            summary: 'Primary Calendar'
        };
    }

    private async performSecurityScan(
        provider: string,
        tokens: any,
        calendarInfo: any,
        session: any
    ): Promise<{ warnings: string[] }> {
        const warnings: string[] = [];

        // Check token scope appropriateness
        const expectedScopes = provider === 'google'
            ? ['https://www.googleapis.com/auth/calendar.readonly']
            : ['Calendars.Read'];

        const hasExcessiveScopes = false; // Placeholder for actual scope checking
        if (hasExcessiveScopes) {
            warnings.push('Token has excessive permissions');
        }

        // Check for compliance violations
        if (this.config.complianceScanning) {
            const complianceCheck = await this.checkCompliance(tokens, session.tenantId);
            if (!complianceCheck.compliant) {
                warnings.push(`Compliance issues: ${complianceCheck.issues.join(', ')}`);
            }
        }

        return { warnings };
    }

    private detectSuspiciousScopes(scopes: string[]): string[] {
        const suspicious: string[] = [];

        // Check for overly broad scopes
        if (scopes.includes('https://www.googleapis.com/auth/calendar') &&
            !scopes.includes('readonly')) {
            suspicious.push('full_calendar_access');
        }

        if (scopes.includes('User.Read.All') || scopes.includes('Calendars.ReadWrite')) {
            suspicious.push('write_permissions');
        }

        return suspicious;
    }

    private async detectUnusualPatterns(connection: CalendarConnectionSecurity): Promise<{
        detected: boolean;
        severity: 'low' | 'medium' | 'high' | 'critical';
    }> {
        // Check for unusual access patterns
        const now = new Date();
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

        if (connection.audit.lastUsed > lastHour) {
            // Check if this is unusual for the user
            const usagePattern = await this.analyzeUsagePattern(connection);
            if (usagePattern.unusual) {
                return { detected: true, severity: usagePattern.severity };
            }
        }

        return { detected: false, severity: 'low' };
    }

    private elevateRiskLevel(current: string, newLevel: string): 'low' | 'medium' | 'high' | 'critical' {
        const levels = ['low', 'medium', 'high', 'critical'];
        const currentIndex = levels.indexOf(current);
        const newIndex = levels.indexOf(newLevel);
        return levels[Math.max(currentIndex, newIndex)] as any;
    }

    private async analyzeUsagePattern(connection: CalendarConnectionSecurity): Promise<{
        unusual: boolean;
        severity: 'low' | 'medium' | 'high' | 'critical';
    }> {
        // Implementation would analyze usage patterns
        // This is a placeholder for actual pattern analysis
        return { unusual: false, severity: 'low' };
    }

    private async checkCompliance(tokens: any, tenantId: string): Promise<{
        compliant: boolean;
        issues: string[];
    }> {
        const issues: string[] = [];

        // Check GDPR compliance
        const gdprCheck = await this.checkGDPRCompliance(tenantId);
        if (!gdprCheck.compliant) {
            issues.push(...gdprCheck.issues);
        }

        // Check PCI compliance for payment-related data
        // Calendar integrations might handle payment information in event descriptions
        const pciCheck = await this.checkPCICompliance(tenantId);
        if (!pciCheck.compliant) {
            issues.push(...pciCheck.issues);
        }

        return {
            compliant: issues.length === 0,
            issues
        };
    }

    private async checkGDPRCompliance(tenantId: string): Promise<{ compliant: boolean; issues: string[] }> {
        // Implementation would check GDPR compliance
        return { compliant: true, issues: [] };
    }

    private async checkPCICompliance(tenantId: string): Promise<{ compliant: boolean; issues: string[] }> {
        // Implementation would check PCI compliance
        return { compliant: true, issues: [] };
    }

    private async logSecurityEvent(
        tenantId: string,
        eventType: SecurityEventType,
        severity: 'low' | 'medium' | 'high' | 'critical',
        description: string,
        metadata: Record<string, any>
    ): Promise<void> {
        const event: SecurityEvent = {
            id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            eventType,
            severity,
            description,
            metadata,
            timestamp: new Date(),
            resolved: false
        };

        this.securityEventQueue.push(event);

        // Process critical events immediately
        if (severity === 'critical') {
            await this.handleCriticalEvent(event, tenantId);
        }
    }

    private async handleCriticalEvent(event: SecurityEvent, tenantId: string): Promise<void> {
        // Implementation would handle critical security events
        // This might include alerting, immediate token revocation, etc.
        console.warn(`CRITICAL SECURITY EVENT: ${event.description}`, event);
    }

    // Placeholder methods for database operations
    private async getActiveConnections(tenantId: string): Promise<CalendarConnectionSecurity[]> {
        return [];
    }

    private async getAllConnections(tenantId: string): Promise<CalendarConnectionSecurity[]> {
        return [];
    }

    private async getConnection(id: string, tenantId: string): Promise<CalendarConnectionSecurity | null> {
        return null;
    }

    private async createSecureConnection(
        tenantId: string,
        provider: string,
        tokens: any,
        calendarInfo: any,
        securityScan: any,
        session: any
    ): Promise<string> {
        return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async updateConnectionTokens(connectionId: string, tokens: any): Promise<void> {
        // Implementation would update connection tokens
    }

    private async refreshTokens(provider: string, refreshToken: string): Promise<any> {
        // Implementation would refresh tokens with provider
        return null;
    }

    private async revokeTokens(provider: string, accessToken: string): Promise<void> {
        // Implementation would revoke tokens with provider
    }

    private async deactivateConnection(connectionId: string): Promise<void> {
        // Implementation would deactivate connection
    }

    private async getExpiringConnections(tenantId: string): Promise<CalendarConnectionSecurity[]> {
        return [];
    }

    private async getInactiveConnections(tenantId: string): Promise<CalendarConnectionSecurity[]> {
        return [];
    }

    private async getOldTokens(tenantId: string): Promise<CalendarConnectionSecurity[]> {
        return [];
    }

    private async scheduleTokenRotation(connectionId: string): Promise<void> {
        // Implementation would schedule token rotation
    }

    private async getRecentSecurityEvents(connectionId: string, hours: number): Promise<SecurityEvent[]> {
        return [];
    }
}

// ============================================================================
// INTERFACES FOR RETURN TYPES
// ============================================================================

interface SecurityIssue {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    connectionId?: string;
    recommendation: string;
}

interface RemediationAction {
    type: string;
    description: string;
    status: 'completed' | 'failed' | 'scheduled';
    error?: string;
}

// Export singleton instance
export const calendarSecurity = new EnterpriseCalendarSecurity();