/**
 * Test Setup and Configuration
 * Centralized test configuration, utilities, and fixtures
 */

// Import testing utilities - using Jest globals to match existing setup
const describe = global.describe;
const it = global.it;
const expect = global.expect;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;
const beforeAll = global.beforeAll;
const afterAll = global.afterAll;

// Test environment configuration
export const testConfig = {
    database: {
        url: process.env.TEST_DATABASE_URL || 'sqlite:memory:',
        pool: {
            min: 0,
            max: 10
        }
    },
    redis: {
        url: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1'
    },
    api: {
        baseUrl: process.env.TEST_API_URL || 'http://localhost:3000',
        timeout: 30000
    },
    calendar: {
        google: {
            clientId: process.env.TEST_GOOGLE_CLIENT_ID || 'test-client-id',
            clientSecret: process.env.TEST_GOOGLE_CLIENT_SECRET || 'test-client-secret'
        },
        outlook: {
            clientId: process.env.TEST_OUTLOOK_CLIENT_ID || 'test-outlook-client-id',
            clientSecret: process.env.TEST_OUTLOOK_CLIENT_SECRET || 'test-outlook-client-secret'
        }
    },
    security: {
        jwtSecret: process.env.TEST_JWT_SECRET || 'test-jwt-secret-key',
        bcryptRounds: 4 // Lower for faster tests
    }
};

// Test data fixtures
export const testFixtures = {
    users: {
        admin: {
            id: 'admin_123',
            email: 'admin@test.com',
            name: 'Test Admin',
            role: 'admin',
            tenantId: 'test-tenant'
        },
        staff: {
            id: 'staff_123',
            email: 'staff@test.com',
            name: 'Test Staff',
            role: 'staff',
            tenantId: 'test-tenant'
        },
        customer: {
            id: 'customer_123',
            email: 'customer@test.com',
            name: 'Test Customer',
            role: 'customer',
            tenantId: 'test-tenant'
        }
    },

    services: {
        haircut: {
            id: 'service_haircut',
            name: 'Premium Haircut',
            duration: 60,
            price: 250,
            bufferTime: 15,
            requiresSpecialist: false,
            active: true
        },
        coloring: {
            id: 'service_coloring',
            name: 'Color & Highlights',
            duration: 120,
            price: 450,
            bufferTime: 30,
            requiresSpecialist: true,
            specialtiesRequired: ['coloring'],
            active: true
        },
        treatment: {
            id: 'service_treatment',
            name: 'Keratin Treatment',
            duration: 180,
            price: 380,
            bufferTime: 30,
            requiresSpecialist: true,
            specialtiesRequired: ['keratin_treatment'],
            active: true
        }
    },

    staff: {
        sarah: {
            id: 'staff_sarah',
            name: 'Sarah Johnson',
            email: 'sarah@test.com',
            specialties: ['haircut', 'coloring', 'styling'],
            workingHours: {
                monday: { open: '09:00', close: '17:00' },
                tuesday: { open: '09:00', close: '17:00' },
                wednesday: { open: '09:00', close: '17:00' },
                thursday: { open: '09:00', close: '17:00' },
                friday: { open: '09:00', close: '17:00' },
                saturday: { open: '09:00', close: '15:00' },
                sunday: { closed: true }
            },
            active: true
        },
        michael: {
            id: 'staff_michael',
            name: 'Michael Chen',
            email: 'michael@test.com',
            specialties: ['haircut', 'beard_trim', 'styling'],
            workingHours: {
                monday: { open: '10:00', close: '18:00' },
                tuesday: { open: '10:00', close: '18:00' },
                wednesday: { open: '10:00', close: '18:00' },
                thursday: { open: '10:00', close: '18:00' },
                friday: { open: '10:00', close: '18:00' },
                saturday: { closed: true },
                sunday: { closed: true }
            },
            active: true
        }
    },

    appointments: {
        confirmed: {
            id: 'apt_confirmed_123',
            customerId: 'customer_123',
            serviceId: 'service_haircut',
            staffId: 'staff_sarah',
            date: '2026-01-15',
            time: '14:00',
            duration: 60,
            status: 'confirmed',
            totalPrice: 250,
            tenantId: 'test-tenant',
            createdAt: new Date('2026-01-10T10:00:00Z')
        },
        pending: {
            id: 'apt_pending_123',
            customerId: 'customer_123',
            serviceId: 'service_coloring',
            staffId: 'staff_sarah',
            date: '2026-01-16',
            time: '10:00',
            duration: 120,
            status: 'pending',
            totalPrice: 450,
            tenantId: 'test-tenant',
            createdAt: new Date('2026-01-10T11:00:00Z')
        },
        cancelled: {
            id: 'apt_cancelled_123',
            customerId: 'customer_123',
            serviceId: 'service_treatment',
            staffId: 'staff_michael',
            date: '2026-01-17',
            time: '09:00',
            duration: 180,
            status: 'cancelled',
            totalPrice: 380,
            tenantId: 'test-tenant',
            createdAt: new Date('2026-01-10T12:00:00Z'),
            cancelledAt: new Date('2026-01-12T14:00:00Z')
        }
    },

    calendarEvents: {
        google: {
            id: 'google_event_123',
            summary: 'External Meeting',
            description: 'Important client meeting',
            start: { dateTime: '2026-01-15T10:00:00Z', timeZone: 'Africa/Johannesburg' },
            end: { dateTime: '2026-01-15T11:00:00Z', timeZone: 'Africa/Johannesburg' },
            location: 'Conference Room A'
        },
        outlook: {
            id: 'outlook_event_123',
            subject: 'Team Standup',
            body: { contentType: 'text', content: 'Daily team standup meeting' },
            start: { dateTime: '2026-01-15T15:00:00Z', timeZone: 'Africa/Johannesburg' },
            end: { dateTime: '2026-01-15T15:30:00Z', timeZone: 'Africa/Johannesburg' },
            location: { displayName: 'Meeting Room B' }
        }
    }
};

// Test utilities
export class TestUtils {
    static generateId(prefix: string = 'test'): string {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    static generateEmail(userType: string = 'user'): string {
        return `${userType}_${Date.now()}@test.com`;
    }

    static generatePhoneNumber(): string {
        return `+27${Math.floor(Math.random() * 900000000 + 100000000)}`;
    }

    static generateBookingData(overrides: any = {}): any {
        return {
            serviceId: 'service_haircut',
            date: '2026-01-20',
            time: '14:00',
            staffId: 'staff_sarah',
            customer: {
                firstName: 'John',
                lastName: 'Doe',
                email: this.generateEmail('customer'),
                phone: this.generatePhoneNumber()
            },
            notes: 'Test booking',
            ...overrides
        };
    }

    static generateTimeSlot(date: string, hour: number = 14, minute: number = 0): string {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    static addDays(date: string, days: number): string {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    }

    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static formatTime(date: Date): string {
        return date.toTimeString().split(' ')[0].substr(0, 5);
    }

    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async waitFor(condition: () => boolean, timeout: number = 5000, interval: number = 100): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (condition()) {
                return true;
            }
            await this.sleep(interval);
        }

        return false;
    }
}

// Database test helpers
export class DatabaseTestHelper {
    static async setupTestDatabase(): Promise<void> {
        // Setup test database schema
        console.log('Setting up test database...');
        // Implementation would depend on the actual database setup
    }

    static async cleanupTestDatabase(): Promise<void> {
        // Clean up test data
        console.log('Cleaning up test database...');
        // Implementation would depend on the actual database cleanup
    }

    static async seedTestData(): Promise<void> {
        // Seed test data
        console.log('Seeding test data...');
        // Implementation would insert test fixtures
    }

    static async clearTestData(): Promise<void> {
        // Clear all test data
        console.log('Clearing test data...');
        // Implementation would clear test tables
    }
}

// API test helpers
export class ApiTestHelper {
    static async makeRequest(
        method: string,
        endpoint: string,
        data?: any,
        headers: any = {}
    ): Promise<{ status: number; data: any; headers: any }> {
        const url = `${testConfig.api.baseUrl}${endpoint}`;
        const requestOptions: any = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            requestOptions.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, requestOptions);
            const responseData = await response.json();

            return {
                status: response.status,
                data: responseData,
                headers: response.headers
            };
        } catch (error) {
            throw new Error(`API request failed: ${error}`);
        }
    }

    static async createBooking(bookingData: any = {}): Promise<any> {
        const data = TestUtils.generateBookingData(bookingData);
        return this.makeRequest('POST', '/api/bookings', data);
    }

    static async getBookings(params: any = {}): Promise<any> {
        const queryString = new URLSearchParams(params).toString();
        return this.makeRequest('GET', `/api/bookings?${queryString}`);
    }

    static async cancelBooking(appointmentId: string): Promise<any> {
        return this.makeRequest('DELETE', `/api/bookings?id=${appointmentId}`);
    }

    static async getAvailability(date: string, serviceId: string): Promise<any> {
        const params = { date, serviceId };
        const queryString = new URLSearchParams(params).toString();
        return this.makeRequest('GET', `/api/availability?${queryString}`);
    }
}

// Authentication test helpers
export class AuthTestHelper {
    static generateToken(payload: any = {}): string {
        const defaultPayload = {
            userId: testFixtures.users.customer.id,
            tenantId: 'test-tenant',
            role: 'customer',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        };

        const tokenPayload = { ...defaultPayload, ...payload };
        // In real implementation, this would use JWT signing
        return `mock_jwt_token_${Buffer.from(JSON.stringify(tokenPayload)).toString('base64')}`;
    }

    static getAuthHeaders(token?: string): any {
        const authToken = token || this.generateToken();
        return {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        };
    }

    static getAdminAuthHeaders(): any {
        const token = this.generateToken({
            userId: testFixtures.users.admin.id,
            role: 'admin'
        });
        return this.getAuthHeaders(token);
    }

    static getStaffAuthHeaders(): any {
        const token = this.generateToken({
            userId: testFixtures.users.staff.id,
            role: 'staff'
        });
        return this.getAuthHeaders(token);
    }
}

// Calendar integration test helpers
export class CalendarTestHelper {
    static generateGoogleCalendarResponse(overrides: any = {}): any {
        return {
            success: true,
            data: {
                connected: true,
                calendarId: 'primary',
                provider: 'google',
                accessToken: 'test_access_token',
                refreshToken: 'test_refresh_token',
                ...overrides
            },
            message: 'Calendar connected successfully'
        };
    }

    static generateOutlookCalendarResponse(overrides: any = {}): any {
        return {
            success: true,
            data: {
                connected: true,
                calendarId: 'outlook_primary',
                provider: 'microsoft',
                accessToken: 'test_outlook_access_token',
                refreshToken: 'test_outlook_refresh_token',
                ...overrides
            },
            message: 'Outlook Calendar connected successfully'
        };
    }

    static generateWebhookPayload(eventType: 'created' | 'updated' | 'deleted' = 'updated'): any {
        return {
            events: [
                {
                    id: this.generateId('event'),
                    type: eventType,
                    summary: `Test ${eventType} event`,
                    description: 'Test webhook event for calendar sync',
                    start: {
                        dateTime: '2026-01-15T14:00:00.000Z',
                        timeZone: 'Africa/Johannesburg'
                    },
                    end: {
                        dateTime: '2026-01-15T15:00:00.000Z',
                        timeZone: 'Africa/Johannesburg'
                    }
                }
            ]
        };
    }
}

// Performance testing helpers
export class PerformanceTestHelper {
    static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; executionTime: number }> {
        const startTime = Date.now();
        const result = await fn();
        const executionTime = Date.now() - startTime;

        return { result, executionTime };
    }

    static async measureConcurrentRequests(
        requestFn: () => Promise<any>,
        concurrentCount: number,
        duration: number = 5000
    ): Promise<{ totalRequests: number; successfulRequests: number; failedRequests: number; averageTime: number }> {
        const startTime = Date.now();
        const requests: Promise<any>[] = [];
        let successfulRequests = 0;
        let failedRequests = 0;
        let totalTime = 0;

        const endTime = startTime + duration;

        while (Date.now() < endTime) {
            // Create batch of concurrent requests
            const batchPromises = Array.from({ length: concurrentCount }, async () => {
                const requestStartTime = Date.now();

                try {
                    await requestFn();
                    successfulRequests++;
                } catch (error) {
                    failedRequests++;
                }

                totalTime += Date.now() - requestStartTime;
            });

            requests.push(...batchPromises);

            // Small delay between batches
            await TestUtils.sleep(100);
        }

        await Promise.all(requests);

        const totalRequests = successfulRequests + failedRequests;
        const averageTime = totalRequests > 0 ? totalTime / totalRequests : 0;

        return {
            totalRequests,
            successfulRequests,
            failedRequests,
            averageTime
        };
    }
}

// Error testing helpers
export class ErrorTestHelper {
    static createMaliciousInput(type: string): any {
        const maliciousInputs: Record<string, any> = {
            sqlInjection: "'; DROP TABLE appointments; --",
            xss: '<script>alert("XSS")</script>',
            pathTraversal: '../../../etc/passwd',
            commandInjection: '; rm -rf /;',
            nullByte: 'test%00.jpg',
            unicode: 'tëst üser námé',
            oversized: 'a'.repeat(10000),
            jsonInjection: '{"__proto__": {"admin": true}}'
        };

        return maliciousInputs[type] || 'test';
    }

    static createBoundaryValues(type: string): any {
        const boundaryValues: Record<string, any> = {
            emptyString: '',
            null: null,
            undefined: undefined,
            zero: 0,
            negative: -1,
            veryLarge: 999999999,
            specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            whitespace: '   ',
            newline: '\n',
            tab: '\t',
            emoji: '😀🎉🔥💯'
        };

        return boundaryValues[type] || 'test';
    }

    static createValidationError(field: string, message: string): any {
        return {
            success: false,
            error: 'Validation failed',
            details: [
                {
                    path: [field],
                    message,
                    code: 'invalid'
                }
            ]
        };
    }
}

// Test environment setup
export class TestEnvironment {
    static async initialize(): Promise<void> {
        console.log('Initializing test environment...');

        // Set test environment variables
        process.env.NODE_ENV = 'test';
        process.env.LOG_LEVEL = 'error'; // Reduce test noise
        process.env.DATABASE_URL = testConfig.database.url;
        process.env.REDIS_URL = testConfig.redis.url;
        process.env.JWT_SECRET = testConfig.security.jwtSecret;

        // Setup test database
        await DatabaseTestHelper.setupTestDatabase();
        await DatabaseTestHelper.seedTestData();

        console.log('Test environment initialized');
    }

    static async cleanup(): Promise<void> {
        console.log('Cleaning up test environment...');

        // Cleanup test database
        await DatabaseTestHelper.clearTestData();
        await DatabaseTestHelper.cleanupTestDatabase();

        console.log('Test environment cleaned up');
    }
}

// Mock external services
export class MockServices {
    static setupCalendarMocks(): void {
        // Mock Google Calendar API responses
        global.fetch = jest.fn().mockImplementation((url: string) => {
            if (url.includes('googleapis.com/calendar')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({
                        items: []
                    })
                } as Response);
            }
            return Promise.reject(new Error('Unknown endpoint'));
        });
    }

    static setupEmailMocks(): void {
        // Mock email service
        const originalSendEmail = require('../utils/notifications/email-service').EmailService.prototype.sendEmail;

        jest.fn().mockImplementation(async function () {
            console.log('Mock email sent:', this.to);
            return true;
        });
    }

    static setupPaymentMocks(): void {
        // Mock Stripe payment processing
        global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
            if (url.includes('stripe.com')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({
                        id: `pi_${Date.now()}`,
                        status: 'succeeded',
                        amount: 25000,
                        currency: 'usd'
                    })
                } as Response);
            }
            return Promise.reject(new Error('Unknown payment endpoint'));
        });
    }
}

// Test assertions and matchers
export const customMatchers = {
    toBeValidBooking(received: any) {
        const pass = received &&
            received.id &&
            received.customerId &&
            received.serviceId &&
            received.date &&
            received.time &&
            ['pending', 'confirmed', 'cancelled'].includes(received.status);

        return {
            pass,
            message: () => pass ?
                `Expected ${received} not to be a valid booking` :
                `Expected ${received} to be a valid booking with id, customerId, serviceId, date, time, and valid status`
        };
    },

    toBeValidApiResponse(received: any) {
        const pass = received &&
            typeof received.success === 'boolean' &&
            (received.data !== undefined || received.error !== undefined);

        return {
            pass,
            message: () => pass ?
                `Expected ${received} not to be a valid API response` :
                `Expected ${received} to be a valid API response with success boolean and data or error`
        };
    },

    toBeWithinTolerance(received: number, expected: number, tolerance: number = 0.1) {
        const pass = Math.abs(received - expected) <= tolerance;

        return {
            pass,
            message: () => pass ?
                `Expected ${received} not to be within ${tolerance} of ${expected}` :
                `Expected ${received} to be within ${tolerance} of ${expected}`
        };
    }
};

// Export all helpers
export {
    DatabaseTestHelper,
    ApiTestHelper,
    AuthTestHelper,
    CalendarTestHelper,
    PerformanceTestHelper,
    ErrorTestHelper,
    TestEnvironment,
    MockServices,
    customMatchers
};