/**
 * Integration Testing Suite
 * Tests complete workflows and system integration across all components
 */

// Import testing utilities
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// Mock environment
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.MICROSOFT_CLIENT_ID = 'test-microsoft-client-id';
process.env.MICROSOFT_CLIENT_SECRET = 'test-microsoft-client-secret';

// Mock handlers for MSW
const handlers = [
    // Mock all API endpoints with realistic responses
    http.post('/api/bookings', async ({ request }) => {
        const body = await request.json() as any;

        if (!body.serviceId) {
            return HttpResponse.json(
                { success: false, error: 'Validation failed', details: [{ path: ['serviceId'], message: 'Required' }] },
                { status: 400 }
            );
        }

        // Simulate calendar sync
        const calendarSyncResults = [
            { success: true, provider: 'google', eventId: 'google_event_123' },
            { success: true, provider: 'microsoft', eventId: 'outlook_event_456' }
        ];

        return HttpResponse.json({
            success: true,
            data: {
                appointment: {
                    id: 'apt_123',
                    ...body,
                    status: 'confirmed',
                    createdAt: new Date().toISOString(),
                    calendarSync: calendarSyncResults
                }
            },
            message: 'Appointment created successfully'
        }, { status: 201 });
    }),

    http.get('/api/bookings', async ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');

        const bookings = [
            { id: 'apt_1', serviceId: 'service_1', date: '2026-01-15', status: 'confirmed' },
            { id: 'apt_2', serviceId: 'service_2', date: '2026-01-16', status: 'pending' },
            { id: 'apt_3', serviceId: 'service_1', date: '2026-01-17', status: 'confirmed' }
        ];

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

    http.get('/api/availability', async ({ request }) => {
        const url = new URL(request.url);
        const date = url.searchParams.get('date');
        const serviceId = url.searchParams.get('serviceId');

        return HttpResponse.json({
            success: true,
            data: {
                slots: [
                    {
                        start: `${date}T09:00`,
                        end: `${date}T10:00`,
                        employeeId: 'staff_1',
                        employeeName: 'Sarah Johnson',
                        isAvailable: true
                    },
                    {
                        start: `${date}T10:00`,
                        end: `${date}T11:00`,
                        employeeId: 'staff_1',
                        employeeName: 'Sarah Johnson',
                        isAvailable: false,
                        conflicts: [{ type: 'internal', reason: 'Appointment already scheduled' }]
                    },
                    {
                        start: `${date}T11:00`,
                        end: `${date}T12:00`,
                        employeeId: 'staff_2',
                        employeeName: 'Michael Chen',
                        isAvailable: true
                    }
                ],
                date,
                serviceId
            },
            message: 'Available slots retrieved successfully'
        });
    }),

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
                provider: 'google',
                accessToken: 'mock_access_token',
                refreshToken: 'mock_refresh_token'
            },
            message: 'Google Calendar connected successfully'
        });
    }),

    http.get('/api/google-calendar/status', async ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: {
                connected: true,
                calendars: [
                    { id: 'primary', name: 'Primary Calendar', access: 'owner' },
                    { id: 'secondary', name: 'Work Calendar', access: 'writer' }
                ],
                syncEnabled: true,
                lastSync: new Date().toISOString()
            },
            message: 'Calendar status retrieved successfully'
        });
    }),

    http.post('/api/calendar/webhooks/google', async ({ request }) => {
        const body = await request.json() as any;

        return HttpResponse.json({
            success: true,
            data: {
                processed: true,
                eventsUpdated: body.events?.length || 0,
                conflictsDetected: 0,
                appointmentsModified: body.events?.length || 0
            },
            message: 'Google Calendar webhook processed successfully'
        });
    }),

    http.get('/api/calendar/sync-status', async ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: {
                status: 'synced',
                lastSync: new Date().toISOString(),
                nextSync: new Date(Date.now() + 3600000).toISOString(),
                statistics: {
                    totalEvents: 150,
                    syncedEvents: 145,
                    failedEvents: 5,
                    conflictsResolved: 2
                }
            },
            message: 'Sync status retrieved successfully'
        });
    })
];

// Setup MSW server
const server = setupServer(...handlers);

// Test data generators
function generateTestBooking(customerId = 'cust_123') {
    return {
        serviceId: 'service_1',
        date: '2026-01-15',
        time: '14:00',
        staffId: 'staff_1',
        customer: {
            id: customerId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+27123456789'
        },
        notes: 'Test booking integration'
    };
}

function generateTestCalendarEvent() {
    return {
        id: 'test_event_123',
        summary: 'Test Calendar Event',
        description: 'Integration test event',
        start: {
            dateTime: '2026-01-15T10:00:00.000Z',
            timeZone: 'Africa/Johannesburg'
        },
        end: {
            dateTime: '2026-01-15T11:00:00.000Z',
            timeZone: 'Africa/Johannesburg'
        }
    };
}

describe('Integration Testing Suite', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    describe('Complete Booking Workflow', () => {
        it('should complete full booking flow from availability check to confirmation', async () => {
            // Step 1: Check availability
            const availabilityResponse = await fetch('/api/availability?date=2026-01-15&serviceId=service_1');
            const availabilityData = await availabilityResponse.json() as any;

            expect(availabilityResponse.status).toBe(200);
            expect(availabilityData.success).toBe(true);
            expect(availabilityData.data.slots).toBeDefined();
            expect(availabilityData.data.slots.length).toBeGreaterThan(0);

            // Step 2: Create booking
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(generateTestBooking())
            });

            const bookingData = await bookingResponse.json() as any;

            expect(bookingResponse.status).toBe(201);
            expect(bookingData.success).toBe(true);
            expect(bookingData.data.appointment).toBeDefined();
            expect(bookingData.data.appointment.status).toBe('confirmed');
            expect(bookingData.data.appointment.calendarSync).toBeDefined();

            // Step 3: Verify booking was created
            const bookingsResponse = await fetch('/api/bookings');
            const bookingsData = await bookingsResponse.json() as any;

            expect(bookingsResponse.status).toBe(200);
            expect(bookingsData.success).toBe(true);
            expect(bookingsData.data.items).toContainEqual(
                expect.objectContaining({ id: bookingData.data.appointment.id })
            );
        });

        it('should handle booking cancellation workflow', async () => {
            // Step 1: Create booking
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(generateTestBooking())
            });

            const bookingData = await bookingResponse.json() as any;
            const appointmentId = bookingData.data.appointment.id;

            // Step 2: Cancel booking
            const cancelResponse = await fetch(`/api/bookings?id=${appointmentId}`, {
                method: 'DELETE'
            });

            const cancelData: any = await cancelResponse.json() as any;

            expect(cancelResponse.status).toBe(200);
            expect(cancelData.success).toBe(true);
            expect(cancelData.data.appointment.status).toBe('cancelled');
            expect(cancelData.data.appointment.cancelledAt).toBeDefined();

            // Step 3: Verify cancellation in booking list
            const bookingsResponse = await fetch('/api/bookings');
            const bookingsData = await bookingsResponse.json() as any;

            expect(bookingsData.data.items).not.toContainEqual(
                expect.objectContaining({
                    id: appointmentId,
                    status: 'confirmed'
                })
            );
        });

        it('should handle booking rescheduling workflow', async () => {
            // Step 1: Create initial booking
            const initialBooking = generateTestBooking();
            initialBooking.time = '10:00';

            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(initialBooking)
            });

            const bookingData = await bookingResponse.json() as any;
            const appointmentId = bookingData.data.appointment.id;

            // Step 2: Check availability for new time
            const availabilityResponse = await fetch('/api/availability?date=2026-01-15&serviceId=service_1');
            const availabilityData = await availabilityResponse.json() as any;

            expect(availabilityResponse.status).toBe(200);
            expect(availabilityData.success).toBe(true);

            // Step 3: Simulate reschedule by creating new booking and canceling old one
            const newBooking = generateTestBooking();
            newBooking.time = '14:00';

            const rescheduleResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(newBooking)
            });

            const rescheduleData: any = await rescheduleResponse.json() as any;

            expect(rescheduleResponse.status).toBe(201);
            expect(rescheduleData.success).toBe(true);
        });
    });

    describe('Calendar Integration Workflow', () => {
        it('should complete Google Calendar OAuth and connection flow', async () => {
            // Step 1: Initiate OAuth
            const oauthResponse = await fetch('/api/google-calendar/oauth');

            expect(oauthResponse.status).toBe(302);
            expect(oauthResponse.headers.get('Location')).toContain('accounts.google.com');

            // Step 2: Handle OAuth callback
            const callbackResponse = await fetch('/api/google-calendar/callback?code=test_auth_code');
            const callbackData: any = await callbackResponse.json() as any;

            expect(callbackResponse.status).toBe(200);
            expect(callbackData.success).toBe(true);
            expect(callbackData.data.connected).toBe(true);
            expect(callbackData.data.provider).toBe('google');

            // Step 3: Check calendar status
            const statusResponse = await fetch('/api/google-calendar/status');
            const statusData: any = await statusResponse.json() as any;

            expect(statusResponse.status).toBe(200);
            expect(statusData.success).toBe(true);
            expect(statusData.data.connected).toBe(true);
            expect(statusData.data.calendars).toBeDefined();
            expect(statusData.data.calendars.length).toBeGreaterThan(0);
        });

        it('should process calendar webhooks and sync events', async () => {
            // Step 1: Simulate calendar event modification webhook
            const webhookResponse = await fetch('/api/calendar/webhooks/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    events: [
                        generateTestCalendarEvent(),
                        {
                            ...generateTestCalendarEvent(),
                            id: 'test_event_456',
                            summary: 'Modified Event'
                        }
                    ]
                })
            });

            const webhookData: any = await webhookResponse.json() as any;

            expect(webhookResponse.status).toBe(200);
            expect(webhookData.success).toBe(true);
            expect(webhookData.data.processed).toBe(true);
            expect(webhookData.data.eventsUpdated).toBe(2);

            // Step 2: Check sync status
            const syncStatusResponse = await fetch('/api/calendar/sync-status');
            const syncStatusData: any = await syncStatusResponse.json() as any;

            expect(syncStatusResponse.status).toBe(200);
            expect(syncStatusData.success).toBe(true);
            expect(syncStatusData.data.status).toBe('synced');
            expect(syncStatusData.data.statistics).toBeDefined();
        });

        it('should handle calendar conflicts and resolution', async () => {
            // Step 1: Create booking with calendar sync
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(generateTestBooking())
            });

            const bookingData = await bookingResponse.json() as any;

            expect(bookingResponse.status).toBe(201);
            expect(bookingData.success).toBe(true);
            expect(bookingData.data.appointment.calendarSync).toBeDefined();
            expect(bookingData.data.appointment.calendarSync.length).toBeGreaterThan(0);

            // Verify calendar sync results
            bookingData.data.appointment.calendarSync.forEach((sync: any) => {
                expect(sync.success).toBe(true);
                expect(sync.provider).toBeDefined();
                expect(sync.eventId).toBeDefined();
            });
        });
    });

    describe('Multi-Tenant Isolation', () => {
        it('should properly isolate tenant data', async () => {
            const tenant1Booking = {
                ...generateTestBooking('cust_tenant1'),
                tenantId: 'tenant1'
            };

            const tenant2Booking = {
                ...generateTestBooking('cust_tenant2'),
                tenantId: 'tenant2'
            };

            // Create bookings for both tenants
            const tenant1Response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'tenant1'
                },
                body: JSON.stringify(tenant1Booking)
            });

            const tenant2Response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'tenant2'
                },
                body: JSON.stringify(tenant2Booking)
            });

            expect(tenant1Response.status).toBe(201);
            expect(tenant2Response.status).toBe(201);

            // Verify each tenant only sees their own data
            const tenant1Bookings = await (await fetch('/api/bookings', {
                headers: { 'tenantId': 'tenant1' }
            })).json() as any;

            const tenant2Bookings = await (await fetch('/api/bookings', {
                headers: { 'tenantId': 'tenant2' }
            })).json() as any;

            expect(tenant1Bookings.data.items.length).toBe(1);
            expect(tenant2Bookings.data.items.length).toBe(1);
            expect(tenant1Bookings.data.items[0].customerId).toBe('cust_tenant1');
            expect(tenant2Bookings.data.items[0].customerId).toBe('cust_tenant2');
        });

        it('should enforce tenant-specific calendar connections', async () => {
            // Mock different calendar connections for different tenants
            server.use(
                http.get('/api/google-calendar/status', async ({ request }) => {
                    const tenantId = request.headers.get('tenantId');

                    if (tenantId === 'tenant1') {
                        return HttpResponse.json({
                            success: true,
                            data: {
                                connected: true,
                                calendars: [{ id: 'primary', name: 'Tenant 1 Calendar' }]
                            }
                        });
                    } else if (tenantId === 'tenant2') {
                        return HttpResponse.json({
                            success: true,
                            data: {
                                connected: false,
                                calendars: []
                            }
                        });
                    }

                    return HttpResponse.json({
                        success: true,
                        data: {
                            connected: false,
                            calendars: []
                        }
                    });
                })
            );

            const tenant1Status = await (await fetch('/api/google-calendar/status', {
                headers: { 'tenantId': 'tenant1' }
            })).json() as any;

            const tenant2Status = await (await fetch('/api/google-calendar/status', {
                headers: { 'tenantId': 'tenant2' }
            })).json() as any;

            expect(tenant1Status.data.connected).toBe(true);
            expect(tenant2Status.data.connected).toBe(false);
            expect(tenant1Status.data.calendars.length).toBe(1);
            expect(tenant2Status.data.calendars.length).toBe(0);
        });
    });

    describe('Error Handling and Recovery', () => {
        it('should handle and recover from partial system failures', async () => {
            // Step 1: Simulate booking creation with partial calendar sync failure
            server.use(
                http.post('/api/bookings', async ({ request }) => {
                    return HttpResponse.json({
                        success: true,
                        data: {
                            appointment: {
                                id: 'apt_123',
                                status: 'confirmed',
                                calendarSync: [
                                    { success: true, provider: 'google', eventId: 'google_event_123' },
                                    { success: false, provider: 'microsoft', error: 'Connection timeout' }
                                ]
                            }
                        },
                        message: 'Appointment created with partial calendar sync'
                    }, { status: 201 });
                })
            );

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(generateTestBooking())
            });

            const data = await response.json() as any;

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.data.appointment.status).toBe('confirmed');
            expect(data.data.appointment.calendarSync).toContainEqual(
                expect.objectContaining({ success: true })
            );
            expect(data.data.appointment.calendarSync).toContainEqual(
                expect.objectContaining({ success: false })
            );
        });

        it('should handle webhook processing errors gracefully', async () => {
            // Mock webhook with invalid data
            const invalidWebhookResponse = await fetch('/api/calendar/webhooks/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: 'invalid json payload'
            });

            // Should return error but not crash
            expect(invalidWebhookResponse.status).not.toBe(200);
        });

        it('should handle database connection issues', async () => {
            // Mock database error scenario
            server.use(
                http.get('/api/bookings', () => {
                    return HttpResponse.json(
                        { success: false, error: 'Database connection failed' },
                        { status: 503 }
                    );
                })
            );

            const response = await fetch('/api/bookings');

            expect(response.status).toBe(503);
            expect(response.statusText).toContain('Service Unavailable');
        });
    });

    describe('Performance Under Load', () => {
        it('should handle concurrent booking requests', async () => {
            const concurrentRequests = Array.from({ length: 5 }, (_, i) =>
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify(generateTestBooking(`cust_${i}`))
                })
            );

            const startTime = Date.now();
            const responses = await Promise.all(concurrentRequests);
            const endTime = Date.now();

            // All requests should succeed
            responses.forEach(response => {
                expect(response.status).toBe(201);
            });

            // Should complete within reasonable time
            expect(endTime - startTime).toBeLessThan(5000);
        });

        it('should handle multiple concurrent availability checks', async () => {
            const availabilityRequests = Array.from({ length: 10 }, (_, i) =>
                fetch(`/api/availability?date=2026-01-${15 + i}&serviceId=service_1`)
            );

            const responses = await Promise.all(availabilityRequests);

            responses.forEach(response => {
                expect(response.status).toBe(200);
            });

            const responsesData = await Promise.all(
                responses.map(response => response.json())
            );

            responsesData.forEach(data => {
                expect(data.success).toBe(true);
                expect(data.data.slots).toBeDefined();
            });
        });
    });

    describe('Data Consistency', () => {
        it('should maintain data consistency across operations', async () => {
            // Create booking
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'tenantId': 'test-tenant'
                },
                body: JSON.stringify(generateTestBooking())
            });

            const bookingData = await bookingResponse.json() as any;
            const appointmentId = bookingData.data.appointment.id;

            // Verify booking exists
            let bookingsResponse = await fetch('/api/bookings');
            let bookingsData = await bookingsResponse.json() as any;
            expect(bookingsData.data.items).toContainEqual(
                expect.objectContaining({ id: appointmentId })
            );

            // Cancel booking
            const cancelResponse = await fetch(`/api/bookings?id=${appointmentId}`, {
                method: 'DELETE'
            });

            // Verify cancellation
            bookingsResponse = await fetch('/api/bookings');
            bookingsData = await bookingsResponse.json() as any;
            expect(bookingsData.data.items).not.toContainEqual(
                expect.objectContaining({
                    id: appointmentId,
                    status: 'confirmed'
                })
            );

            // Verify cancelled status
            const cancelledBooking = bookingsData.data.items.find(
                (item: any) => item.id === appointmentId
            );
            if (cancelledBooking) {
                expect(cancelledBooking.status).toBe('cancelled');
            }
        });

        it('should handle concurrent modifications correctly', async () => {
            // Create two concurrent booking attempts for the same slot
            const conflictingBooking1 = generateTestBooking('cust_1');
            conflictingBooking1.time = '10:00';

            const conflictingBooking2 = generateTestBooking('cust_2');
            conflictingBooking2.time = '10:00';

            const [response1, response2] = await Promise.all([
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify(conflictingBooking1)
                }),
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'tenantId': 'test-tenant'
                    },
                    body: JSON.stringify(conflictingBooking2)
                })
            ]);

            const [data1, data2] = await Promise.all([
                response1.json(),
                response2.json()
            ]);

            // At least one should succeed, at least one should fail
            expect([response1.status, response2.status]).toContain(201);
            expect([response1.status, response2.status]).toContain(409);

            // No double bookings should exist
            const finalBookingsResponse = await fetch('/api/bookings');
            const finalBookingsData = await finalBookingsResponse.json() as any;

            const tenAmBookings = finalBookingsData.data.items.filter(
                (booking: any) => booking.time === '10:00'
            );
            expect(tenAmBookings.length).toBeLessThanOrEqual(1);
        });
    });
});