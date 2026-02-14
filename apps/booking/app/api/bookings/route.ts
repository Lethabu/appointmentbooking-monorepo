// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { CalendarSyncService } from '@/services/calendar-sync';
import { BookingQueries } from '@/utils/database/booking-queries';
import { SchedulingEngine, TenantConfig, StaffMember, ServiceInfo } from '@/utils/scheduling';
import { withBookingSecurity } from '@/utils/security/enterprise-security-middleware';
import { TimezoneManager } from '@/utils/timezone';
import {
    createBookingRequestSchema,
    updateBookingRequestSchema,
    bookingResponseSchema,
    validateBookingData,
    validateUpdateBookingData
} from '@/utils/validation';

// Mock database - in production, replace with actual database operations
class MockDatabase {
    private static appointments: any[] = [];
    private static customers: any[] = [];
    private static tenantConfigs: Map<string, TenantConfig> = new Map();
    private static staffMembers: Map<string, StaffMember[]> = new Map();
    private static services: Map<string, (ServiceInfo & { price: number })[]> = new Map();

    static async createAppointment(data: any) {
        const appointment = {
            id: `apt_${Date.now()}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'pending',
            paymentStatus: 'pending'
        };
        this.appointments.push(appointment);
        return appointment;
    }

    static async updateAppointment(id: string, data: any) {
        const index = this.appointments.findIndex(apt => apt.id === id);
        if (index !== -1) {
            this.appointments[index] = { ...this.appointments[index], ...data, updatedAt: new Date() };
            return this.appointments[index];
        }
        return null;
    }

    static async getAppointment(id: string) {
        return this.appointments.find(apt => apt.id === id);
    }

    static async getAppointments(filters: any = {}) {
        let filtered = [...this.appointments];

        if (filters.customerId) {
            filtered = filtered.filter(apt => apt.customerId === filters.customerId);
        }
        if (filters.date) {
            filtered = filtered.filter(apt => apt.date === filters.date);
        }
        if (filters.status) {
            filtered = filtered.filter(apt => apt.status === filters.status);
        }

        return filtered;
    }

    static async createCustomer(data: any) {
        const customer = {
            id: `cust_${Date.now()}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.customers.push(customer);
        return customer;
    }

    static async getCustomer(id: string) {
        return this.customers.find(cust => cust.id === id);
    }

    static async getTenantConfig(tenantId: string): Promise<TenantConfig> {
        if (!this.tenantConfigs.has(tenantId)) {
            this.tenantConfigs.set(tenantId, {
                businessHoursConfig: {
                    businessHours: {
                        monday: { open: '09:00', close: '17:00' },
                        tuesday: { open: '09:00', close: '17:00' },
                        wednesday: { open: '09:00', close: '17:00' },
                        thursday: { open: '09:00', close: '17:00' },
                        friday: { open: '09:00', close: '17:00' },
                        saturday: { open: '09:00', close: '15:00' },
                        sunday: { open: '00:00', close: '00:00', closed: true }
                    },
                    publicHolidays: []
                },
                timezone: 'Africa/Johannesburg',
                bufferTime: 15,
                maxAdvanceBookingDays: 90,
                minBookingNotice: 60,
                cancellationPolicy: {
                    advanceNotice: 24,
                    feePercentage: 50
                }
            });
        }
        return this.tenantConfigs.get(tenantId)!;
    }

    static async getStaffMembers(tenantId: string): Promise<StaffMember[]> {
        if (!this.staffMembers.has(tenantId)) {
            this.staffMembers.set(tenantId, [
                {
                    id: 'staff_1',
                    name: 'Sarah Johnson',
                    specialties: ['haircut', 'coloring', 'styling'],
                    workingHours: {
                        monday: { open: '09:00', close: '17:00' },
                        tuesday: { open: '09:00', close: '17:00' },
                        wednesday: { open: '09:00', close: '17:00' },
                        thursday: { open: '09:00', close: '17:00' },
                        friday: { open: '09:00', close: '17:00' },
                        saturday: { open: '09:00', close: '15:00' },
                        sunday: { open: '00:00', close: '00:00', closed: true }
                    },
                    unavailableDates: [],
                    appointments: []
                },
                {
                    id: 'staff_2',
                    name: 'Michael Chen',
                    specialties: ['haircut', 'beard_trim', 'styling'],
                    workingHours: {
                        monday: { open: '10:00', close: '18:00' },
                        tuesday: { open: '10:00', close: '18:00' },
                        wednesday: { open: '10:00', close: '18:00' },
                        thursday: { open: '10:00', close: '18:00' },
                        friday: { open: '10:00', close: '18:00' },
                        saturday: { open: '00:00', close: '00:00', closed: true },
                        sunday: { open: '00:00', close: '00:00', closed: true }
                    },
                    unavailableDates: [],
                    appointments: []
                }
            ]);
        }
        return this.staffMembers.get(tenantId)!;
    }

    static async getServices(tenantId: string): Promise<(ServiceInfo & { price: number })[]> {
        if (!this.services.has(tenantId)) {
            this.services.set(tenantId, [
                {
                    id: 'service_1',
                    name: 'Premium Haircut',
                    duration: 60,
                    bufferTime: 15,
                    requiresSpecialist: false,
                    price: 250
                },
                {
                    id: 'service_2',
                    name: 'Color & Highlights',
                    duration: 120,
                    bufferTime: 30,
                    requiresSpecialist: true,
                    specialtiesRequired: ['coloring'],
                    price: 450
                },
                {
                    id: 'service_3',
                    name: 'Keratin Treatment',
                    duration: 180,
                    bufferTime: 30,
                    requiresSpecialist: true,
                    specialtiesRequired: ['keratin_treatment'],
                    price: 380
                }
            ]);
        }
        return this.services.get(tenantId)!;
    }
}

// GET /api/bookings - Get appointments
export const GET = withBookingSecurity(async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId') || 'default';
        const customerId = searchParams.get('customerId') || null;
        const date = searchParams.get('date') || null;
        const status = searchParams.get('status') || null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const filters = { customerId, date, status };
        const appointments = await MockDatabase.getAppointments(filters);

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAppointments = appointments.slice(startIndex, endIndex);

        const response = {
            success: true,
            data: {
                items: paginatedAppointments,
                pagination: {
                    page,
                    limit,
                    total: appointments.length,
                    pages: Math.ceil(appointments.length / limit),
                    hasNext: endIndex < appointments.length,
                    hasPrev: page > 1
                }
            },
            message: 'Appointments retrieved successfully'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch appointments' },
            { status: 500 }
        );
    }
});

// POST /api/bookings - Create new appointment
export const POST = withBookingSecurity(async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const tenantId = request.headers.get('tenantId') || 'default';
        const timezone = request.headers.get('timezone') || 'Africa/Johannesburg';

        // Validate input data
        const validation = validateBookingData(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        const bookingData = validation.data;

        // Get required data for scheduling engine
        const [tenantConfig, staffMembers, services] = await Promise.all([
            MockDatabase.getTenantConfig(tenantId),
            MockDatabase.getStaffMembers(tenantId),
            MockDatabase.getServices(tenantId)
        ]);

        // Initialize scheduling engine
        const schedulingEngine = new SchedulingEngine(tenantConfig, staffMembers, services);

        // Create booking request for scheduling engine
        const service = services.find(s => s.id === bookingData.serviceId);
        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        const schedulingRequest = {
            serviceId: bookingData.serviceId,
            serviceDuration: service.duration,
            requestedDate: bookingData.date,
            requestedTime: bookingData.time,
            staffId: bookingData.staffId,
            customerId: 'temp_customer', // Will be replaced with actual customer ID
            tenantId,
            timezone,
            bufferTime: service.bufferTime
        };

        // Check availability
        const availabilityCheck = await schedulingEngine.checkAvailability(schedulingRequest);

        if (!availabilityCheck.isAvailable) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Appointment slot not available',
                    conflicts: availabilityCheck.conflicts,
                    suggestedSlots: availabilityCheck.suggestedSlots
                },
                { status: 409 }
            );
        }

        // Create customer if not exists
        let customerId = bookingData.customer?.id;
        if (!customerId) {
            const customer = await MockDatabase.createCustomer({
                ...bookingData.customer,
                tenantId
            });
            customerId = customer.id;
        }

        // Calculate pricing (mock implementation)
        const totalPrice = service.price || 0;
        const depositAmount = totalPrice * 0.3; // 30% deposit

        // Create appointment
        const appointment = await MockDatabase.createAppointment({
            customerId,
            serviceId: bookingData.serviceId,
            staffId: bookingData.staffId,
            date: bookingData.date,
            time: bookingData.time,
            duration: service.duration,
            totalPrice,
            depositAmount,
            notes: bookingData.notes,
            tenantId,
            timezone
        });

        // Sync to external calendars if database is available
        const env = process.env as any;
        let calendarSyncResults: any[] = [];

        if (env.DB || (global as any).DB) {
            try {
                const calendarSync = new CalendarSyncService({ DB: env.DB || (global as any).DB });
                calendarSyncResults = await calendarSync.syncAppointmentToCalendar(
                    appointment.id,
                    tenantId,
                    'create'
                );
            } catch (error) {
                console.error('Calendar sync error:', error);
                // Continue without failing the booking creation
            }
        }

        const response = {
            success: true,
            data: {
                appointment,
                customer: await MockDatabase.getCustomer(customerId!),
                service,
                calendarSync: calendarSyncResults
            },
            message: 'Appointment created successfully'
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create appointment' },
            { status: 500 }
        );
    }
});

// PUT /api/bookings - Update appointment (bulk operations)
export const PUT = withBookingSecurity(async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const tenantId = request.headers.get('tenantId') || 'default';

        // Handle bulk operations
        if ((body as any).operation === 'bulk_update') {
            const { appointmentIds, updates } = body as any;

            if (!Array.isArray(appointmentIds) || !updates) {
                return NextResponse.json(
                    { success: false, error: 'Invalid bulk update request' },
                    { status: 400 }
                );
            }

            const validation = validateUpdateBookingData(updates);
            if (!validation.success) {
                return NextResponse.json(
                    { success: false, error: 'Validation failed', details: validation.error.errors },
                    { status: 400 }
                );
            }

            const updatedAppointments = [];
            for (const appointmentId of appointmentIds) {
                const updated = await MockDatabase.updateAppointment(appointmentId, validation.data);
                if (updated) {
                    updatedAppointments.push(updated);
                }
            }

            return NextResponse.json({
                success: true,
                data: { updatedAppointments },
                message: `${updatedAppointments.length} appointments updated successfully`
            });
        }

        return NextResponse.json(
            { success: false, error: 'Unsupported operation' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error updating appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update appointments' },
            { status: 500 }
        );
    }
});

// DELETE /api/bookings - Delete appointment (soft delete)
export const DELETE = withBookingSecurity(async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get('id');
        const tenantId = searchParams.get('tenantId') || 'default';

        if (!appointmentId) {
            return NextResponse.json(
                { success: false, error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

        // Soft delete - update status to cancelled
        const updated = await MockDatabase.updateAppointment(appointmentId, {
            status: 'cancelled',
            cancelledAt: new Date(),
            tenantId
        });

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Appointment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { appointment: updated },
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to cancel appointment' },
            { status: 500 }
        );
    }
});
