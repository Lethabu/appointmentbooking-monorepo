/**
 * API Endpoints Testing Suite
 * Tests all API routes with comprehensive validation and error handling
 */

// Import testing utilities
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock environment
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// Mock handlers for MSW
const handlers = [
    // Mock booking creation
    http.post('/api/bookings', async ({ request }) => {
        const body = await request.json() as any;

        // Test validation scenarios
        if (!body.serviceId) {
            return HttpResponse.json(
                { success: false, error: 'Validation failed', details: [{ path: ['serviceId'], message: 'Required' }] },
                { status: 400 }
            );
        }

        // Test duplicate booking scenario
        if (body.serviceId === 'duplicate') {
            return HttpResponse.json(
                { success: false, error: 'Appointment slot not available', conflicts: [{ type: 'double_booking' }] },
                { status: 409 }
            );
        }

        // Success response
        return HttpResponse.json({
            success: true,
            data: {
                appointment: {
                    id: 'apt_123',
                    ...body,
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                }
            },
            message: 'Appointment created successfully'
        }, { status: 201 });
    }),

    // Mock booking retrieval
    http.get('/api/bookings', async ({ request }) => {
        const url = new URL(request.url);
        const customerId = url.searchParams.get('customerId');
        const date = url.searchParams.get('date');

        // Test pagination
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');

        let bookings = [
            { id: 'apt_1', customerId: 'cust_1', date: '2026-01-15', serviceId: 'service_1' },
            { id: 'apt_2', customerId: 'cust_1', date: '2026-01-16', serviceId: 'service_2' }
        ];

        // Filter by customer
        if (customerId) {
            bookings = bookings.filter(apt => apt.customerId === customerId);
        }

        // Filter by date
        if (date) {
            bookings = bookings.filter(apt => apt.date === date);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedBookings = bookings.slice(startIndex, startIndex + limit);

        return HttpResponse.json({
            success: true,
            data: {
                items: paginatedBookings,
                pagination: {
                    page,
                    limit,
                    total: bookings.length,
                    pages: Math.ceil(bookings.length / limit),
                    hasNext: startIndex + limit < bookings.length,
                    hasPrev: page > 1
                }
            },
            message: 'Appointments retrieved successfully'
        });
    }),

    // Mock booking cancellation
    http.delete('/api/bookings', async ({ request }) => {
        const url = new URL(request.url);
        const appointmentId = url.searchParams.get('id');

        if (!appointmentId) {
            return HttpResponse.json(
                { success: false, error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

        if (appointmentId === 'not-found') {
            return HttpResponse.json(
                { success: false, error: 'Appointment not found' },
                { status: 404 }
            );
        }

        return HttpResponse.json({
            success: true,
            data: {
                appointment: {
                    id: appointmentId,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString()
                }
            },
            message: 'Appointment cancelled successfully'
        });
    }),

    // Mock availability endpoint
    http.get('/api/availability', async ({ request }) => {
        const url = new URL(request.url);
        const date = url.searchParams.get('date');
        const serviceId = url.searchParams.get('serviceId');

        if (!date || !serviceId) {
            return HttpResponse.json(
                { success: false, error: 'Validation failed', details: [] },
                { status: 400 }
            );
        }

        return HttpResponse.json({
            success: true,
            data: {
                slots: [
                    { start: `${date}T09:00`, end: `${date}T10:00`, employeeId: 'staff_1', isAvailable: true },
                    { start: `${date}T10:00`, end: `${date}T11:00`, employeeId: 'staff_1', isAvailable: false },
                    { start: `${date}T11:00`, end: `${date}T12:00`, employeeId: 'staff_2', isAvailable: true }
                ],
                date,
                serviceId
            },
            message: 'Available slots retrieved successfully'
        });
    }),

    // Mock calendar OAuth endpoints
    http.get('/api/google-calendar/oauth', () => {
        return HttpResponse.redirect('https://accounts.google.com/oauth/authorize?client_id=test');
    }),

    http.get('/api/google-calendar/callback', async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');

        if (!code) {
            return HttpResponse.json(
                { success: false, error: 'Authorization code missing' },
                { status: 400 }
            );
        }

        return HttpResponse.json({
            success: true,
            data: {
                connected: true,
                calendarId: 'primary',
                provider: 'google'
            },
            message: 'Google Calendar connected successfully'
        });
    }),

    // Mock calendar webhooks
    http.post('/api/calendar/webhooks/google', async ({ request }) => {
        const body = await request.json() as any;

        return HttpResponse.json({
            success: true,
            data: {
                processed: true,
                eventsUpdated: body.events?.length || 0
            },
            message: 'Google Calendar webhook processed successfully'
        });
    }),

    http.post('/api/calendar/webhooks/outlook', async ({ request }) => {
        const body = await request.json() as any;

        return HttpResponse.json({
            success: true,
            data: {
                processed: true,
                eventsUpdated: body.events?.length || 0
            },
            message: 'Outlook Calendar webhook processed successfully'
        });
    })
];

// Setup MSW server
const server = setupServer(...handlers);

describe('API Endpoints Testing Suite', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    describe('Bookings API', () => {
        describe('POST /api/bookings', () => {
            it('should create a booking successfully', async () => {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify({
                        serviceId: 'service_1',
                        date: '2026-01-15',
                        time: '14:00',
                        staffId: 'staff_1',
                        customer: {
                            firstName: 'John',
                            lastName: 'Doe',
                            email: 'john@example.com',
                            phone: '+27123456789'
                        }
                    })
                });

                const data = await response.json() as any;

                expect(response.status).toBe(201);
                expect(data.success).toBe(true);
                expect(data.data.appointment).toBeDefined();
                expect(data.data.appointment.id).toBe('apt_123');
                expect(data.data.appointment.status).toBe('confirmed');
            });

            it('should reject invalid booking data', async () => {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify({
                        // Missing serviceId
                        date: '2026-01-15',
                        time: '14:00'
                    })
                });

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Validation failed');
                expect(data.details).toBeDefined();
            });

            it('should handle duplicate booking conflicts', async () => {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify({
                        serviceId: 'duplicate',
                        date: '2026-01-15',
                        time: '14:00',
                        staffId: 'staff_1'
                    })
                });

                const data = await response.json() as any;

                expect(response.status).toBe(409);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Appointment slot not available');
                expect(data.conflicts).toBeDefined();
            });

            it('should handle server errors gracefully', async () => {
                // Mock server error
                server.use(
                    http.post('/api/bookings', () => {
                        return HttpResponse.json(
                            { success: false, error: 'Internal server error' },
                            { status: 500 }
                        );
                    })
                );

                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify({
                        serviceId: 'service_1',
                        date: '2026-01-15',
                        time: '14:00'
                    })
                });

                expect(response.status).toBe(500);
            });
        });

        describe('GET /api/bookings', () => {
            it('should retrieve bookings with pagination', async () => {
                const response = await fetch('/api/bookings?page=1&limit=10');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.items).toBeDefined();
                expect(data.data.pagination).toBeDefined();
                expect(data.data.pagination.page).toBe(1);
                expect(data.data.pagination.limit).toBe(10);
            });

            it('should filter bookings by customer ID', async () => {
                const response = await fetch('/api/bookings?customerId=cust_1');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.items.every(apt => apt.customerId === 'cust_1')).toBe(true);
            });

            it('should filter bookings by date', async () => {
                const response = await fetch('/api/bookings?date=2026-01-15');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.items.every(apt => apt.date === '2026-01-15')).toBe(true);
            });

            it('should handle invalid pagination parameters', async () => {
                const response = await fetch('/api/bookings?page=invalid&limit=invalid');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
            });
        });

        describe('DELETE /api/bookings', () => {
            it('should cancel appointment successfully', async () => {
                const response = await fetch('/api/bookings?id=apt_123');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.appointment.status).toBe('cancelled');
                expect(data.data.appointment.cancelledAt).toBeDefined();
            });

            it('should require appointment ID', async () => {
                const response = await fetch('/api/bookings');

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Appointment ID is required');
            });

            it('should handle non-existent appointment', async () => {
                const response = await fetch('/api/bookings?id=not-found');

                const data = await response.json() as any;

                expect(response.status).toBe(404);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Appointment not found');
            });
        });
    });

    describe('Availability API', () => {
        describe('GET /api/availability', () => {
            it('should retrieve available slots successfully', async () => {
                const response = await fetch('/api/availability?date=2026-01-15&serviceId=service_1');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.slots).toBeDefined();
                expect(Array.isArray(data.data.slots)).toBe(true);
                expect(data.data.date).toBe('2026-01-15');
                expect(data.data.serviceId).toBe('service_1');
            });

            it('should validate required parameters', async () => {
                const response = await fetch('/api/availability');

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Validation failed');
            });

            it('should handle missing date parameter', async () => {
                const response = await fetch('/api/availability?serviceId=service_1');

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
            });

            it('should handle missing service ID parameter', async () => {
                const response = await fetch('/api/availability?date=2026-01-15');

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
            });

            it('should include employee information in slots', async () => {
                const response = await fetch('/api/availability?date=2026-01-15&serviceId=service_1');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.data.slots[0]).toHaveProperty('employeeId');
                expect(data.data.slots[0]).toHaveProperty('start');
                expect(data.data.slots[0]).toHaveProperty('end');
            });
        });
    });

    describe('Calendar Integration APIs', () => {
        describe('Google Calendar OAuth', () => {
            it('should redirect to Google OAuth', async () => {
                const response = await fetch('/api/google-calendar/oauth');

                expect(response.status).toBe(302);
                expect(response.headers.get('Location')).toContain('accounts.google.com');
            });

            it('should handle OAuth callback with valid code', async () => {
                const response = await fetch('/api/google-calendar/callback?code=test_auth_code');

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.connected).toBe(true);
                expect(data.data.provider).toBe('google');
            });

            it('should reject OAuth callback without code', async () => {
                const response = await fetch('/api/google-calendar/callback');

                const data = await response.json() as any;

                expect(response.status).toBe(400);
                expect(data.success).toBe(false);
                expect(data.error).toBe('Authorization code missing');
            });
        });

        describe('Calendar Webhooks', () => {
            it('should process Google Calendar webhook', async () => {
                const response = await fetch('/api/calendar/webhooks/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        events: [
                            {
                                id: 'event_1',
                                type: 'modified',
                                resource: { summary: 'Test Event' }
                            }
                        ]
                    })
                });

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.processed).toBe(true);
                expect(data.data.eventsUpdated).toBe(1);
            });

            it('should process Outlook Calendar webhook', async () => {
                const response = await fetch('/api/calendar/webhooks/outlook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        events: [
                            {
                                id: 'event_1',
                                type: 'created',
                                subject: 'Test Outlook Event'
                            }
                        ]
                    })
                });

                const data = await response.json() as any;

                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.data.processed).toBe(true);
            });

            it('should handle webhook processing errors', async () => {
                const response = await fetch('/api/calendar/webhooks/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: 'invalid json'
                });

                expect(response.status).not.toBe(200);
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle JSON parsing errors', async () => {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: 'invalid json'
            });

            expect(response.status).toBe(400);
        });

        it('should handle missing Content-Type header', async () => {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                body: JSON.stringify({ serviceId: 'service_1' })
            });

            // Should still process but log warning
            expect(response.status).toBe(201);
        });

        it('should handle CORS preflight requests', async () => {
            const response = await fetch('/api/bookings', {
                method: 'OPTIONS',
                headers: {
                    'Origin': 'https://example.com',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });

            expect(response.status).toBe(200);
        });

        it('should handle rate limiting', async () => {
            // Mock rate limiting response
            server.use(
                http.post('/api/bookings', () => {
                    return HttpResponse.json(
                        { success: false, error: 'Rate limit exceeded' },
                        { status: 429 }
                    );
                })
            );

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: 'service_1' })
            });

            expect(response.status).toBe(429);
        });
    });

    describe('Security Headers', () => {
        it('should include security headers in responses', async () => {
            const response = await fetch('/api/bookings');

            expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
            expect(response.headers.get('X-Frame-Options')).toBe('DENY');
            expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
        });

        it('should set appropriate cache headers', async () => {
            const response = await fetch('/api/bookings');

            // API endpoints should not be cached
            expect(response.headers.get('Cache-Control')).not.toContain('public');
        });
    });

    describe('Performance Tests', () => {
        it('should respond within acceptable time limits', async () => {
            const startTime = Date.now();

            const response = await fetch('/api/bookings');

            const responseTime = Date.now() - startTime;

            expect(response.status).toBe(200);
            expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
        });

        it('should handle concurrent requests', async () => {
            const requests = Array.from({ length: 10 }, () =>
                fetch('/api/bookings')
            );

            const responses = await Promise.all(requests);

            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });
});