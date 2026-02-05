// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { CalendarSyncService } from '@/services/calendar-sync';
import { BookingQueries } from '@/utils/database/booking-queries';
import { EnhancedAvailabilityQueries } from '@/utils/database/enhanced-availability-queries';
import { validateUpdateBookingData } from '@/utils/validation';


/**
 * Booking Rescheduling Endpoint
 * Handles appointment rescheduling with conflict detection and calendar sync
 */

// Interface for the booking object return from database
interface AppointmentRecord {
    id: string;
    status: string;
    serviceId: string;
    employeeId: string | null;
    userId: string;
    scheduledTime: Date | number;
    version: number;
    notes?: string | null;
    tenantId: string;
    createdAt?: Date | number;
    updatedAt?: Date | number;
}

// Rescheduling request validation schema
const rescheduleRequestSchema = z.object({
    newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    newTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    employeeId: z.string().optional(), // Allow changing employee
    reason: z.string().optional(),
    notifyCustomer: z.boolean().default(true),
    findAlternatives: z.boolean().default(false), // If true, find alternative slots
    maxAlternatives: z.number().min(1).max(10).default(5)
});

// Alternative slot suggestion interface
interface AlternativeSlot {
    date: string;
    time: string;
    employeeId: string;
    employeeName: string;
    start: string;
    end: string;
    availabilityScore?: number; // How good this alternative is
}

/**
 * POST /api/bookings/[id]/reschedule
 * Reschedule an appointment with conflict detection
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookingId = params.id;
        const tenantId = request.headers.get('tenantId') || 'default';
        const body = await request.json();

        // Validate request data
        const validation = rescheduleRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        const {
            newDate,
            newTime,
            employeeId,
            reason,
            notifyCustomer = true,
            findAlternatives = false,
            maxAlternatives = 5
        } = validation.data;

        // Check if D1 database is available
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            console.warn('D1 database not available, returning mock reschedule response');
            return NextResponse.json({
                success: true,
                data: {
                    id: bookingId,
                    originalDate: '2026-01-15',
                    newDate,
                    newTime,
                    status: 'rescheduled',
                    calendarSyncCompleted: true,
                    notificationsSent: notifyCustomer
                },
                message: 'Booking rescheduled successfully (mock data)'
            });
        }

        // Initialize services
        const db = env.DB || (global as any).DB;
        const bookingQueries = new BookingQueries(db);
        const calendarSync = new CalendarSyncService({ DB: db });
        const availabilityQueries = new EnhancedAvailabilityQueries(db);

        // Get current booking
        const booking = await bookingQueries.getAppointment(bookingId, tenantId) as AppointmentRecord | null;
        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if booking can be rescheduled
        if (booking.status === 'cancelled') {
            return NextResponse.json(
                { success: false, error: 'Cannot reschedule a cancelled booking' },
                { status: 400 }
            );
        }

        if (booking.status === 'completed') {
            return NextResponse.json(
                { success: false, error: 'Cannot reschedule a completed booking' },
                { status: 400 }
            );
        }

        // Get service details for duration
        const service = await bookingQueries.getService(booking.serviceId, tenantId);
        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        const targetEmployeeId = employeeId || booking.employeeId || '';
        const newDateTime = new Date(`${newDate}T${newTime}:00`);

        // Check if the new slot is available
        const slotAvailability = await availabilityQueries.isSlotAvailable(
            newDate,
            newTime,
            targetEmployeeId,
            service.durationMinutes,
            tenantId,
            true // Include external calendars
        );

        if (!slotAvailability.available) {
            // If alternative slots requested, find them
            if (findAlternatives) {
                const alternativeSlots = await findAlternativeSlots(
                    availabilityQueries,
                    newDate,
                    service,
                    targetEmployeeId,
                    tenantId,
                    maxAlternatives
                );

                return NextResponse.json({
                    success: false,
                    error: 'Requested time slot is not available',
                    code: 'SLOT_NOT_AVAILABLE',
                    alternativeSlots,
                    conflicts: slotAvailability.conflicts
                }, { status: 409 });
            }

            return NextResponse.json({
                success: false,
                error: 'Requested time slot is not available',
                code: 'SLOT_NOT_AVAILABLE',
                conflicts: slotAvailability.conflicts
            }, { status: 409 });
        }

        // Prepare update data
        const updateData = {
            scheduledTime: newDateTime,
            staffId: targetEmployeeId || undefined,
            version: booking.version // Use current version for optimistic locking
        };

        // Update the booking
        const updatedBooking = await bookingQueries.updateAppointment(
            bookingId,
            tenantId,
            updateData
        );

        // Sync reschedule to external calendars
        let calendarSyncResults: any[] = [];
        try {
            calendarSyncResults = await calendarSync.syncAppointmentToCalendar(
                bookingId,
                tenantId,
                'update'
            );
        } catch (error) {
            console.error('Calendar sync error during reschedule:', error);
            // Continue with reschedule even if calendar sync fails
        }

        // Create notification record if customer notification is requested
        let notificationId = null;
        if (notifyCustomer) {
            try {
                notificationId = await bookingQueries.createNotification({
                    tenantId,
                    userId: booking.userId,
                    appointmentId: bookingId,
                    type: 'reschedule',
                    channel: 'email',
                    recipient: 'customer@example.com', // TODO: Get actual customer email
                    message: `Your appointment has been rescheduled to ${newDate} at ${newTime}. ${reason ? `Reason: ${reason}` : ''}`
                });
            } catch (error) {
                console.error('Error creating reschedule notification:', error);
            }
        }

        // Log reschedule analytics event
        try {
            // Mock analytics logging for now
            console.log('Analytics event logged:', {
                eventName: 'appointment_rescheduled',
                bookingId,
                tenantId,
                originalDate: new Date(Number(booking.scheduledTime) * 1000).toISOString().split('T')[0],
                originalTime: new Date(Number(booking.scheduledTime) * 1000).toTimeString().split(' ')[0],
                newDate,
                newTime,
                employeeId: targetEmployeeId,
                reason: reason || 'rescheduled_by_customer',
                calendarSyncResults
            });
        } catch (error) {
            console.error('Error logging reschedule analytics:', error);
        }

        return NextResponse.json({
            success: true,
            data: {
                id: bookingId,
                originalDate: new Date(Number(booking.scheduledTime) * 1000).toISOString().split('T')[0],
                originalTime: new Date(Number(booking.scheduledTime) * 1000).toTimeString().split(' ')[0],
                newDate,
                newTime,
                employeeId: targetEmployeeId,
                status: 'rescheduled',
                calendarSyncResults,
                notificationsSent: notifyCustomer,
                notificationId
            },
            message: 'Booking rescheduled successfully'
        });
    } catch (error) {
        console.error('Error rescheduling booking:', error);

        // Handle optimistic locking errors
        if (error instanceof Error && error.message.includes('modified by another user')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Booking has been modified by another user',
                    code: 'VERSION_CONFLICT'
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to reschedule booking',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/bookings/[id]/reschedule/alternatives
 * Get alternative available slots for rescheduling
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookingId = params.id;
        const tenantId = request.headers.get('tenantId') || 'default';
        const { searchParams } = new URL(request.url);

        const date = searchParams.get('date'); // Base date to search from
        const maxAlternatives = parseInt(searchParams.get('maxAlternatives') || '5');

        if (!date) {
            return NextResponse.json(
                { success: false, error: 'Date parameter is required' },
                { status: 400 }
            );
        }

        // Check if D1 database is available
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            // Return mock alternative slots
            const mockAlternatives: AlternativeSlot[] = [
                {
                    date,
                    time: '14:00',
                    employeeId: 'staff_1',
                    employeeName: 'Sarah Johnson',
                    start: `${date}T14:00:00`,
                    end: `${date}T15:00:00`,
                    availabilityScore: 0.9
                },
                {
                    date,
                    time: '15:30',
                    employeeId: 'staff_2',
                    employeeName: 'Michael Chen',
                    start: `${date}T15:30:00`,
                    end: `${date}T16:30:00`,
                    availabilityScore: 0.8
                }
            ];

            return NextResponse.json({
                success: true,
                data: {
                    alternatives: mockAlternatives,
                    baseDate: date
                },
                message: 'Alternative slots retrieved successfully (mock data)'
            });
        }

        // Initialize services
        const db = env.DB || (global as any).DB;
        const bookingQueries = new BookingQueries(db);
        const availabilityQueries = new EnhancedAvailabilityQueries(db);

        // Get current booking
        const booking = await bookingQueries.getAppointment(bookingId, tenantId) as AppointmentRecord | null;
        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Get service details
        const service = await bookingQueries.getService(booking.serviceId, tenantId);
        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        // Find alternative slots
        const alternativeSlots = await findAlternativeSlots(
            availabilityQueries,
            date,
            service,
            booking.employeeId || 'default',
            tenantId,
            maxAlternatives
        );

        return NextResponse.json({
            success: true,
            data: {
                alternatives: alternativeSlots,
                baseDate: date,
                serviceDuration: service.durationMinutes
            },
            message: 'Alternative slots retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting alternative slots:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get alternative slots',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * Find alternative available slots for rescheduling
 */
async function findAlternativeSlots(
    availabilityQueries: EnhancedAvailabilityQueries,
    baseDate: string,
    service: any,
    employeeId: string,
    tenantId: string,
    maxAlternatives: number
): Promise<AlternativeSlot[]> {
    const alternatives: AlternativeSlot[] = [];

    // Search for available slots in the next 14 days
    const searchDays = 14;
    const baseDateTime = new Date(baseDate);

    for (let dayOffset = 0; dayOffset < searchDays && alternatives.length < maxAlternatives; dayOffset++) {
        const searchDate = new Date(baseDateTime);
        searchDate.setDate(searchDate.getDate() + dayOffset);

        const dateStr = searchDate.toISOString().split('T')[0];

        try {
            // Get available slots for this date
            const availableSlots = await availabilityQueries.getAvailableSlots({
                date: dateStr,
                serviceId: service.id,
                serviceDuration: service.durationMinutes,
                employeeId,
                tenantId,
                bufferTime: 15,
                timezone: 'Africa/Johannesburg',
                includeExternalCalendars: true
            });

            // Filter for available slots and convert to alternatives
            for (const slot of availableSlots) {
                if (slot.isAvailable && alternatives.length < maxAlternatives) {
                    const startTime = new Date(slot.start);
                    const timeStr = startTime.toTimeString().split(' ')[0].substring(0, 5);

                    alternatives.push({
                        date: dateStr,
                        time: timeStr,
                        employeeId: slot.employeeId,
                        employeeName: slot.employeeName,
                        start: slot.start,
                        end: slot.end,
                        availabilityScore: calculateAvailabilityScore(
                            dayOffset,
                            startTime.getHours()
                        )
                    });
                }
            }
        } catch (error) {
            console.error(`Error checking availability for ${dateStr}:`, error);
            // Continue with other dates
        }
    }

    // Sort by availability score (higher is better)
    return alternatives.sort((a, b) => (b.availabilityScore || 0) - (a.availabilityScore || 0));
}

/**
 * Calculate availability score for alternative slots
 * Earlier dates and business hours get higher scores
 */
function calculateAvailabilityScore(dayOffset: number, hour: number): number {
    let score = 1.0;

    // Prefer sooner dates
    score -= dayOffset * 0.1;

    // Prefer business hours (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17) {
        score += 0.2;
    }

    // Prefer mid-morning and mid-afternoon slots
    if ((hour >= 10 && hour <= 11) || (hour >= 14 && hour <= 16)) {
        score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
}