// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityQueries } from '@/utils/database/availability-queries';
import { EnhancedAvailabilityQueries } from '@/utils/database/enhanced-availability-queries';
import { validateAvailabilityRequest } from '@/utils/validation';
import { withBookingSecurity } from '@/utils/security/enterprise-security-middleware';

/**
 * GET /api/availability
 * Get available time slots for booking
 * Query params: date, serviceId, employeeId (optional), tenantId
 */
export const GET = withBookingSecurity(async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract and validate query parameters
        const date = searchParams.get('date');
        const serviceId = searchParams.get('serviceId');
        const employeeId = searchParams.get('employeeId') || undefined;
        const tenantId = searchParams.get('tenantId') || request.headers.get('tenantId') || 'default';
        const timezone = searchParams.get('timezone') || 'Africa/Johannesburg';

        // Validate request
        const validation = validateAvailabilityRequest({
            date,
            serviceId,
            employeeId,
            timezone,
        });

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

        // Get service duration from database
        // For now, using a default duration - should be fetched from services table
        const serviceDuration = 60; // TODO: Fetch from database

        // Check if D1 database is available in the environment
        const env = process.env as any;
        if (!env.DB && !(global as any).DB) {
            // Fallback for development - return mock data
            console.warn('D1 database not available, returning mock availability data');
            return NextResponse.json({
                success: true,
                data: {
                    slots: generateMockSlots(date!, employeeId),
                },
                message: 'Available slots retrieved successfully (mock data)',
            });
        }

        // Initialize availability queries with D1 database
        const db = env.DB || (global as any).DB;
        const availabilityQueries = new AvailabilityQueries(db);

        // Get available slots
        const slots = await availabilityQueries.getAvailableSlots({
            date: date!,
            serviceId: serviceId!,
            serviceDuration,
            employeeId,
            tenantId,
            bufferTime: 15,
        });

        return NextResponse.json({
            success: true,
            data: {
                slots,
                date: date,
                serviceId: serviceId,
                timezone: timezone,
            },
            message: 'Available slots retrieved successfully',
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch availability',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
});

/**
 * Generate mock availability slots for development/testing
 */
function generateMockSlots(date: string, employeeId?: string): any[] {
    const slots = [];
    const baseDate = new Date(date);

    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const endHour = minute === 30 ? hour + 1 : hour;
            const endMinute = minute === 30 ? 0 : 30;
            const end = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

            slots.push({
                start: `${date}T${start}`,
                end: `${date}T${end}`,
                employeeId: employeeId || 'staff_1',
                employeeName: employeeId ? 'Staff Member' : 'Sarah Johnson',
            });
        }
    }

    return slots;
}
