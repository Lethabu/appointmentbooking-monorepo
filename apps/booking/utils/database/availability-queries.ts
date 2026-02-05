/**
 * Availability Query Utilities
 * Calculate available time slots considering employee schedules, holidays, and blocked slots
 */

import {
    employees,
    employeeSchedules,
    holidays,
    blockedSlots,
    appointments,
} from '@repo/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

export interface AvailabilityOptions {
    date: string;
    serviceId: string;
    serviceDuration: number;
    employeeId?: string;
    tenantId: string;
    bufferTime?: number;
}

export interface TimeSlot {
    start: string;
    end: string;
    employeeId: string;
    employeeName: string;
}

/**
 * Availability query class
 */
export class AvailabilityQueries {
    private db: ReturnType<typeof drizzle>;

    constructor(d1Database: D1Database) {
        this.db = drizzle(d1Database);
    }

    /**
     * Get available time slots for a given date and service
     */
    async getAvailableSlots(options: AvailabilityOptions): Promise<TimeSlot[]> {
        const { date, serviceId, serviceDuration, employeeId, tenantId, bufferTime = 15 } = options;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // Check if date is a holiday
        const isHoliday = await this.isHoliday(date, tenantId);
        if (isHoliday) {
            return [];
        }

        // Get eligible employees
        const eligibleEmployees = employeeId
            ? await this.getEmployee(employeeId, tenantId)
            : await this.getActiveEmployees(tenantId);

        if (!eligibleEmployees) {
            return [];
        }

        const employees = Array.isArray(eligibleEmployees) ? eligibleEmployees : [eligibleEmployees];

        if (employees.length === 0) {
            return [];
        }
        const availableSlots: TimeSlot[] = [];

        // For each employee, get their available slots
        for (const employee of employees) {
            const slots = await this.getEmployeeAvailableSlots(
                employee,
                date,
                serviceDuration,
                bufferTime,
                tenantId
            );
            availableSlots.push(...slots);
        }

        // Sort by time
        availableSlots.sort((a, b) => a.start.localeCompare(b.start));

        return availableSlots;
    }

    /**
     * Get available slots for a specific employee
     */
    private async getEmployeeAvailableSlots(
        employee: any,
        date: string,
        serviceDuration: number,
        bufferTime: number,
        tenantId: string
    ): Promise<TimeSlot[]> {
        // Get day of week
        const dayOfWeek = new Date(date).getDay();

        // Get employee schedule for this day
        const schedule = await this.getEmployeeSchedule(employee.id, dayOfWeek);

        if (!schedule || !schedule.isActive) {
            return [];
        }

        // Generate potential time slots
        const potentialSlots = this.generateTimeSlots(
            schedule.startTime,
            schedule.endTime,
            schedule.breakStart,
            schedule.breakEnd,
            serviceDuration,
            30 // 30-minute intervals
        );

        // Get existing appointments for this employee on this date
        const existingAppointments = await this.getEmployeeAppointments(employee.id, date, tenantId);

        // Get blocked slots for this employee on this date
        const blockedTimeSlots = await this.getBlockedSlots(employee.id, date, tenantId);

        // Filter out unavailable slots
        const availableSlots: TimeSlot[] = [];

        for (const slot of potentialSlots) {
            if (this.isSlotAvailable(slot, existingAppointments, blockedTimeSlots, serviceDuration, bufferTime)) {
                availableSlots.push({
                    start: `${date}T${slot.start}`,
                    end: `${date}T${slot.end}`,
                    employeeId: employee.id,
                    employeeName: employee.name,
                });
            }
        }

        return availableSlots;
    }

    /**
     * Check if a time slot is available
     */
    private isSlotAvailable(
        slot: { start: string; end: string },
        appointments: any[],
        blockedSlots: any[],
        serviceDuration: number,
        bufferTime: number
    ): boolean {
        const slotStart = this.timeToMinutes(slot.start);
        const slotEnd = slotStart + serviceDuration;

        // Check against existing appointments
        for (const apt of appointments) {
            const aptStart = apt.scheduledTime;
            const aptEnd = aptStart + serviceDuration + bufferTime;

            if (this.hasOverlap(slotStart, slotEnd, aptStart, aptEnd)) {
                return false;
            }
        }

        // Check against blocked slots
        for (const blocked of blockedSlots) {
            const blockedStart = this.timeToMinutes(blocked.startTime);
            const blockedEnd = this.timeToMinutes(blocked.endTime);

            if (this.hasOverlap(slotStart, slotEnd, blockedStart, blockedEnd)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if two time ranges overlap
     */
    private hasOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
        return start1 < end2 && end1 > start2;
    }

    /**
     * Convert time string (HH:MM) to minutes since midnight
     */
    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Generate time slots between start and end time
     */
    private generateTimeSlots(
        startTime: string,
        endTime: string,
        breakStart: string | null,
        breakEnd: string | null,
        serviceDuration: number,
        interval: number
    ): { start: string; end: string }[] {
        const slots: { start: string; end: string }[] = [];

        let currentMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);
        const breakStartMinutes = breakStart ? this.timeToMinutes(breakStart) : null;
        const breakEndMinutes = breakEnd ? this.timeToMinutes(breakEnd) : null;

        while (currentMinutes + serviceDuration <= endMinutes) {
            // Skip break time
            if (
                breakStartMinutes !== null &&
                breakEndMinutes !== null &&
                this.hasOverlap(currentMinutes, currentMinutes + serviceDuration, breakStartMinutes, breakEndMinutes)
            ) {
                currentMinutes = breakEndMinutes;
                continue;
            }

            const start = this.minutesToTime(currentMinutes);
            const end = this.minutesToTime(currentMinutes + serviceDuration);

            slots.push({ start, end });
            currentMinutes += interval;
        }

        return slots;
    }

    /**
     * Convert minutes since midnight to time string (HH:MM)
     */
    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    /**
     * Check if a date is a holiday
     */
    private async isHoliday(date: string, tenantId: string): Promise<boolean> {
        const result = await this.db
            .select()
            .from(holidays)
            .where(and(eq(holidays.tenantId, tenantId), eq(holidays.date, date)))
            .limit(1);

        return result.length > 0;
    }

    /**
     * Get employee schedule for a specific day
     */
    private async getEmployeeSchedule(employeeId: string, dayOfWeek: number) {
        const result = await this.db
            .select()
            .from(employeeSchedules)
            .where(
                and(
                    eq(employeeSchedules.employeeId, employeeId),
                    eq(employeeSchedules.dayOfWeek, dayOfWeek),
                    eq(employeeSchedules.isActive, true)
                )
            )
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get employee appointments for a specific date
     */
    private async getEmployeeAppointments(employeeId: string, date: string, tenantId: string) {
        const startOfDay = new Date(`${date}T00:00:00Z`);
        const endOfDay = new Date(`${date}T23:59:59Z`);

        return await this.db
            .select()
            .from(appointments)
            .where(
                and(
                    eq(appointments.employeeId, employeeId),
                    eq(appointments.tenantId, tenantId),
                    sql`${appointments.status} != 'cancelled'`,
                    gte(appointments.scheduledTime, sql`${startOfDay.getTime()}`),
                    lte(appointments.scheduledTime, sql`${endOfDay.getTime()}`)
                )
            );
    }

    /**
     * Get blocked slots for an employee on a specific date
     */
    private async getBlockedSlots(employeeId: string, date: string, tenantId: string) {
        const startOfDay = new Date(`${date}T00:00:00Z`);
        const endOfDay = new Date(`${date}T23:59:59Z`);

        return await this.db
            .select()
            .from(blockedSlots)
            .where(
                and(
                    eq(blockedSlots.tenantId, tenantId),
                    eq(blockedSlots.isActive, true),
                    sql`(${blockedSlots.employeeId} = ${employeeId} OR ${blockedSlots.employeeId} IS NULL)`,
                    gte(blockedSlots.startTime, sql`${startOfDay.getTime()}`),
                    lte(blockedSlots.endTime, sql`${endOfDay.getTime()}`)
                )
            );
    }

    /**
     * Get a single employee
     */
    private async getEmployee(employeeId: string, tenantId: string) {
        const result = await this.db
            .select()
            .from(employees)
            .where(and(eq(employees.id, employeeId), eq(employees.tenantId, tenantId), eq(employees.isActive, true)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get all active employees for a tenant
     */
    private async getActiveEmployees(tenantId: string) {
        return await this.db
            .select()
            .from(employees)
            .where(and(eq(employees.tenantId, tenantId), eq(employees.isActive, true)));
    }

    /**
     * Get employee schedules for multiple employees
     */
    async getEmployeeSchedules(employeeIds: string[]) {
        return await this.db
            .select()
            .from(employeeSchedules)
            .where(
                and(
                    sql`${employeeSchedules.employeeId} IN (${employeeIds.join(',')})`,
                    eq(employeeSchedules.isActive, true)
                )
            );
    }

    /**
     * Get holidays for a date range
     */
    async getHolidays(tenantId: string, startDate: string, endDate: string) {
        return await this.db
            .select()
            .from(holidays)
            .where(
                and(
                    eq(holidays.tenantId, tenantId),
                    gte(holidays.date, startDate),
                    lte(holidays.date, endDate)
                )
            );
    }
}
