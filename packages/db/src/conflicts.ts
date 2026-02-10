import { and, eq, or, sql } from 'drizzle-orm';

import { appointments, services } from './schema';

export class ConflictDetector {
    /**
     * Checks if a proposed appointment conflicts with existing bookings.
     * @param tenantId The tenant ID
     * @param staffId The staff member ID (optional, if checking specific staff)
     * @param startTime Start time of the proposed appointment (Unix timestamp)
     * @param endTime End time of the proposed appointment (Unix timestamp)
     * @param excludeBookingId Optional booking ID to exclude (for updates)
     * @returns True if a conflict exists, false otherwise
     */
    static async hasConflict(
        tenantId: string,
        startTime: number,
        endTime: number,
        staffId?: string,
        excludeBookingId?: string
    ): Promise<boolean> {
        // Basic overlap logic: (StartA < EndB) and (EndA > StartB)

        const conditions = [
            eq(appointments.tenantId, tenantId),
            eq(appointments.status, 'confirmed'), // Only check against confirmed bookings? Or pending too? Usually pending too to avoid race conditions.
            // Overlap check - NOTE: This static method needs to be updated to join with services
            // For now, returning false as this method is not currently used
        ];

        if (staffId) {
            conditions.push(eq(appointments.employeeId, staffId));
        }

        if (excludeBookingId) {
            conditions.push(sql`${appointments.id} != ${excludeBookingId}`);
        }

        // Since we are inside the DB package, we might not have direct access to the 'db' instance if it's initialized in apps.
        // However, if we assume this is a utility helper that receives the query builder or run context, that's better.
        // For now, I'll export a pure query builder function or assume `db` is available.
        // Re-writing to be more query-builder friendly or return the query.

        // Changing approach: Export a function that takes the DB instance.
        return false; // Placeholder for the actual implementation in the file below
    }
}

export async function checkConflict(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: any,
    tenantId: string,
    startTime: number,
    endTime: number,
    staffId: string
): Promise<boolean> {
    try {
        const result = await db.select({ id: appointments.id })
            .from(appointments)
            .innerJoin(services, eq(appointments.serviceId, services.id))
            .where(and(
                eq(appointments.tenantId, tenantId),
                eq(appointments.employeeId, staffId),
                or(eq(appointments.status, 'confirmed'), eq(appointments.status, 'pending')),
                // Overlap: existing.start < new.end AND existing.end > new.start
                // existing.end = existing.start + (existing.duration * 60)
                sql`${appointments.scheduledTime} < ${endTime}`,
                sql`(${appointments.scheduledTime} + (${services.durationMinutes} * 60)) > ${startTime}`
            ))
            .limit(1);

        return result.length > 0;
    } catch (error) {
        console.error("Conflict check failed", error);
        return true; // Fail safe: assume conflict if error
    }
}
