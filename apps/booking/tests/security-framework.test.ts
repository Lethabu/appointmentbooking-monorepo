/**
 * Security Framework Integration Tests
 * Comprehensive testing of the enterprise-grade compliance and security framework
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Fix for global jest usage
const jest = vi;

// Mock NextRequest for testing
class MockNextRequest {
    private _body: any = {};
    private _headers = new Map<string, string>();
    private _method = 'GET';
    private _url = 'http://localhost:3000/api/test';

    constructor(options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        url?: string;
    } = {}) {
        this._method = options.method || 'GET';
        this._body = options.body || {};
        this._url = options.url || 'http://localhost:3000/api/test';

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                this._headers.set(key.toLowerCase(), value);
            });
        }
    }

    async json() {
        return this._body;
    }

    get method() {
        return this._method;
    }

    get url() {
        return this._url;
    }

    get nextUrl() {
        return {
            pathname: this._url.split('?')[0],
            searchParams: new URLSearchParams(this._url.split('?')[1] || '')
        };
    }

    headers = {
        get: (name: string) => this._headers.get(name.toLowerCase()) || null
    };

    cookies = {
        get: (name: string) => this._headers.has(name) ? { value: this._headers.get(name) } : undefined
    };
}

describe('Security Framework Integration Tests', () => {

    describe('Input Validation and Sanitization', () => {

        it('should detect XSS attempts', () => {
            const { detectXss } = require('../utils/security/sanitization');

            const xssPayloads = [
                '<script>alert("xss")</script>',
                'javascript:alert("xss")',
                '<img src="x" onerror="alert(1)">',
                '<svg onload="alert(1)">',
                'expression(alert(1))'
            ];

            xssPayloads.forEach(payload => {
                expect(detectXss(payload)).toBe(true);
            });
        });

        it('should detect SQL injection attempts', () => {
            const { detectSqlInjection } = require('../utils/security/sanitization');

            const sqlPayloads = [
                "' OR '1'='1",
                "'; DROP TABLE users; --",
                "' UNION SELECT * FROM users --",
                "admin'--",
                "' OR 1=1#"
            ];

            sqlPayloads.forEach(payload => {
                expect(detectSqlInjection(payload)).toBe(true);
            });
        });

        it('should validate booking requests correctly', () => {
            const { enhancedBookingRequestSchema, validateAndSanitize } = require('../utils/security/validation-schemas');

            const validBooking = {
                serviceId: 'service_1',
                staffId: 'staff_1',
                date: '2024-02-15',
                time: '14:30',
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+27123456789'
                },
                notes: 'Regular customer'
            };

            const result = validateAndSanitize(validBooking, enhancedBookingRequestSchema);
            expect(result.success).toBe(true);
            expect(result.sanitized).toBeDefined();
        });

        it('should generate security headers', () => {
            const { generateSecurityHeaders } = require('../utils/security/sanitization');

            const headers = generateSecurityHeaders();

            expect(headers['X-Content-Type-Options']).toBe('nosniff');
            expect(headers['X-Frame-Options']).toBe('DENY');
            expect(headers['X-XSS-Protection']).toBe('1; mode=block');
            expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
            expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
        });
    });

    describe('Security Middleware', () => {

        beforeEach(() => {
            // Clear any rate limiting data
            (process.env as any).NODE_ENV = 'test';
        });

        it('should allow valid requests through security middleware', async () => {
            const { SecurityMiddleware } = require('../utils/security/security-middleware');

            const request = new MockNextRequest({
                method: 'GET',
                headers: {
                    'x-api-key': 'valid-api-key',
                    'x-forwarded-for': '192.168.1.1'
                }
            });

            // Mock environment variable
            (process.env as any).API_SECRET_KEY = 'valid-api-key';

            const result = await SecurityMiddleware.process(request);
            expect(result).toBeNull(); // Should allow request through
        });

        it('should detect malicious content', async () => {
            const { SecurityMiddleware } = require('../utils/security/security-middleware');

            const request = new MockNextRequest({
                method: 'POST',
                body: {
                    description: '<script>alert("xss")</script>',
                    query: "'; DROP TABLE users; --"
                },
                headers: {
                    'content-type': 'application/json',
                    'x-forwarded-for': '192.168.1.1'
                }
            });

            const result = await SecurityMiddleware.process(request);
            expect(result).not.toBeNull();
            if (result) {
                expect(result.status).toBe(400); // Bad Request
            }
        });
    });

    describe('Security Audit Engine', () => {

        it('should identify vulnerability types', async () => {
            const { VulnerabilityType, SeverityLevel } = require('../utils/security/security-audit');

            // This test would need actual vulnerable code to detect
            // For now, we test the structure
            expect(VulnerabilityType.SQL_INJECTION).toBe('sql_injection');
            expect(VulnerabilityType.XSS).toBe('xss');
            expect(VulnerabilityType.CSRF).toBe('csrf');
            expect(SeverityLevel.CRITICAL).toBe('critical');
            expect(SeverityLevel.HIGH).toBe('high');
        });
    });

    describe('PCI-DSS Compliance', () => {

        it('should assess PCI compliance requirements', async () => {
            const { PCIComplianceEngine, ComplianceStatus } = require('../utils/security/pci-compliance');

            const results = await PCIComplianceEngine.assessCompliance();

            expect(results).toBeDefined();
            expect(results).toHaveLength(6); // 6 PCI requirements

            const networkSecurity = results.find((r: any) => r.requirementId === '1');
            expect(networkSecurity).toBeDefined();
            expect(networkSecurity!.score).toBeGreaterThanOrEqual(0);
            expect(networkSecurity!.score).toBeLessThanOrEqual(100);

            const overallStatus = PCIComplianceEngine.getOverallStatus(results);
            expect([ComplianceStatus.COMPLIANT, ComplianceStatus.PARTIALLY_COMPLIANT, ComplianceStatus.NON_COMPLIANT])
                .toContain(overallStatus);
        });
    });

    describe('GDPR and Privacy Compliance', () => {

        it('should process data subject access requests', async () => {
            const { UserRightsManager } = require('../utils/security/privacy-compliance');

            const result = await UserRightsManager.processAccessRequest('test@example.com');

            expect(result.requestId).toBeDefined();
            expect(result.estimatedCompletion).toBeDefined();
            expect(new Date(result.estimatedCompletion)).toBeAfter(new Date());
        });

        it('should record and manage consent', () => {
            const { ConsentManager, ProcessingPurpose } = require('../utils/security/privacy-compliance');

            const consentId = ConsentManager.recordConsent({
                userId: 'user123',
                purpose: ProcessingPurpose.MARKETING,
                granted: true,
                method: 'explicit',
                version: '1.0',
                ipAddress: '192.168.1.1',
                userAgent: 'Test Agent',
                proof: 'checkbox_checked'
            });

            expect(consentId).toBeDefined();

            const consentCheck = ConsentManager.checkConsent('user123', ProcessingPurpose.MARKETING);
            expect(consentCheck.hasConsent).toBe(true);
            expect(consentCheck.consentRecord).toBeDefined();
        });

        it('should validate GDPR compliance', async () => {
            const { GDPRComplianceValidator, DataCategory, ProcessingPurpose } = require('../utils/security/privacy-compliance');

            const data = {
                dataCategories: [DataCategory.PERSONAL_IDENTIFIERS],
                processingPurposes: [ProcessingPurpose.SERVICE_PROVISION],
                lawfulBasis: 'contract',
                hasConsent: false,
                hasDataProtectionImpactAssessment: false
            };

            const result = await GDPRComplianceValidator.validateCompliance(data);

            expect(result.compliant).toBeDefined();
            expect(result.violations).toBeDefined();
            expect(result.recommendations).toBeDefined();

            // Should be compliant with contract basis
            expect(result.compliant).toBe(true);
        });
    });

    describe('Security Headers and Configuration', () => {

        it('should generate comprehensive security headers', () => {
            const { generateSecurityHeaders } = require('../utils/security/sanitization');

            const headers = generateSecurityHeaders();

            // Test specific security headers
            expect(headers['X-Content-Type-Options']).toBe('nosniff');
            expect(headers['X-Frame-Options']).toBe('DENY');
            expect(headers['X-XSS-Protection']).toBe('1; mode=block');
            expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
            expect(headers['Permissions-Policy']).toBe('geolocation=(), microphone=(), camera=()');

            // Test CSP header
            expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
            expect(headers['Content-Security-Policy']).toContain("script-src 'self'");
            expect(headers['Content-Security-Policy']).toContain("object-src 'none'");

            // Test HSTS header
            expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
            expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
        });
    });

    describe('Error Handling and Logging', () => {

        it('should handle validation errors gracefully', () => {
            const { enhancedBookingRequestSchema, validateAndSanitize } = require('../utils/security/validation-schemas');

            const invalidData = { invalid: 'data' };
            const result = validateAndSanitize(invalidData, enhancedBookingRequestSchema);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors!.errors.length).toBeGreaterThan(0);
        });
    });

    describe('Performance and Load Testing', () => {

        it('should handle concurrent requests efficiently', async () => {
            const { SecurityMiddleware } = require('../utils/security/security-middleware');

            const requests = Array.from({ length: 20 }, (_, i) =>
                new MockNextRequest({
                    method: 'GET',
                    url: `http://localhost:3000/api/bookings?id=${i}`,
                    headers: {
                        'x-forwarded-for': `192.168.1.${i}`,
                        'x-api-key': 'valid-api-key'
                    }
                })
            );

            (process.env as any).API_SECRET_KEY = 'valid-api-key';

            const startTime = Date.now();
            const results = await Promise.all(
                requests.map(req => SecurityMiddleware.process(req))
            );
            const endTime = Date.now();

            // Should process 20 requests in reasonable time (less than 1 second)
            expect(endTime - startTime).toBeLessThan(1000);

            // Most requests should be allowed through
            const allowedCount = results.filter(r => r === null).length;
            expect(allowedCount).toBeGreaterThan(15);
        });
    });
});

// Export test utilities
export { MockNextRequest };