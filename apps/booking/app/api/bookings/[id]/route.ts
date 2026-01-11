// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { BookingQueries } from '@/utils/database/booking-queries';
import { validateUpdateBookingData } from '@/utils/validation';

/**
 * GET /api/bookings/[id]
 * Get a specific booking by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookingId = params.id;
        const tenantId = request.headers.get('tenantId') || 'default';

        // Check if D1 database is available
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            console.warn('D1 database not available, returning mock booking data');
            return NextResponse.json({
                success: true,
                data: {
                    id: bookingId,
                    serviceId: 'service_1',
                    staffId: 'staff_1',
                    customerId: 'cust_123',
                    date: '2026-01-15',
                    time: '10:00',
                    duration: 60,
                    status: 'confirmed',
                    totalPrice: 25000, // in cents
                    depositAmount: 7500,
                    notes: 'Test booking',
                },
                message: 'Booking retrieved successfully (mock data)',
            });
        }

        // Initialize booking queries
        const db = env.DB || (global as any).DB;
        const bookingQueries = new BookingQueries(db);

        // Get booking
        const booking = await bookingQueries.getAppointment(bookingId, tenantId);

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking,
            message: 'Booking retrieved successfully',
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch booking',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/bookings/[id]
 * Update a booking (reschedule or modify)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookingId = params.id;
        const tenantId = request.headers.get('tenantId') || 'default';
        const body = await request.json();

        // Validate update data
        const validation = validateUpdateBookingData(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const updateData = validation.data;

        // Check if D1 database is available
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            console.warn('D1 database not available, returning mock update response');
            return NextResponse.json({
                success: true,
                data: {
                    id: bookingId,
                    ...updateData,
                    updatedAt: new Date(),
                },
                message: 'Booking updated successfully (mock data)',
            });
        }

        // Initialize booking queries
        const db = env.DB || (global as any).DB;
        const bookingQueries = new BookingQueries(db);

        // Prepare update data with proper typing
        const updatePayload: any = {
            version: updateData.version || 1,
        };

        if (updateData.serviceId) updatePayload.serviceId = updateData.serviceId;
        if (updateData.staffId) updatePayload.staffId = updateData.staffId;
        if (updateData.status) updatePayload.status = updateData.status;
        if (updateData.notes !== undefined) updatePayload.notes = updateData.notes;

        // Handle date/time update - convert to scheduledTime
        if (updateData.date && updateData.time) {
            const scheduledTime = new Date(`${updateData.date}T${updateData.time}:00Z`);
            updatePayload.scheduledTime = scheduledTime;
        }

        // Update booking
        const updatedBooking = await bookingQueries.updateAppointment(
            bookingId,
            tenantId,
            updatePayload
        );

        if (!updatedBooking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found or update failed' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedBooking,
            message: 'Booking updated successfully',
        });
    } catch (error) {
        console.error('Error updating booking:', error);

        // Handle optimistic locking errors
        if (error instanceof Error && error.message.includes('modified by another user')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Booking has been modified by another user',
                    code: 'CONFLICT',
                },
                { status: 409 }
            );
        }

        // Handle conflict errors
        if (error instanceof Error && error.message.includes('conflicts with existing')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Time slot conflicts with existing booking',
                    code: 'CONFLICT',
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update booking',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel a booking (soft delete)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookingId = params.id;
        const tenantId = request.headers.get('tenantId') || 'default';

        // Check if D1 database is available
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            console.warn('D1 database not available, returning mock cancellation response');
            return NextResponse.json({
                success: true,
                data: {
                    id: bookingId,
                    status: 'cancelled',
                    updatedAt: new Date(),
                },
                message: 'Booking cancelled successfully (mock data)',
            });
        }

        // Initialize booking queries
        const db = env.DB || (global as any).DB;
        const bookingQueries = new BookingQueries(db);

        // Cancel booking
        const cancelledBooking = await bookingQueries.cancelAppointment(bookingId, tenantId);

        if (!cancelledBooking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        // TODO: Send cancellation notification email

        return NextResponse.json({
            success: true,
            data: cancelledBooking,
            message: 'Booking cancelled successfully',
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to cancel booking',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
