import {
    appointments,
    employees,
    employeeSchedules,
    holidays,
    blockedSlots,
    availabilityOverrides,
    calendarConnections,
    calendarSyncEvents
} from '@repo/db/schema';
import { eq, and, gte, lte, sql, or, not } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

/**
 * Enhanced Availability Queries
 * Combines internal bookings with external calendar events for comprehensive availability
 */
export interface AvailabilityOptions {
    date: string;
    serviceId: string;
    serviceDuration: number;
    employeeId?: string;
    tenantId: string;
    bufferTime: number;
    timezone: string;
    includeExternalCalendars: boolean;
}

export interface AvailabilitySlot {
    start: string;
    end: string;
    employeeId: string;
    employeeName: string;
    isAvailable: boolean;
    conflicts?: Array<{
        type: 'internal' | 'google' | 'outlook';
        reason: string;
        details?: any;
    }>;
}

export interface CalendarConflict {
    id: string;
    start: Date;
    end: Date;
    summary: string;
    source: 'google' | 'outlook';
    location?: string;
}

export class EnhancedAvailabilityQueries {
    private db: ReturnType<typeof drizzle>;

    constructor(d1Database: D1Database) {
        this.db = drizzle(d1Database);
    }

    /**
     * Get comprehensive available slots combining internal and external calendar data
     */
    async getAvailableSlots(options: AvailabilityOptions): Promise<AvailabilitySlot[]> {
        const {
            date,
            serviceId,
            serviceDuration,
            employeeId,
            tenantId,
            bufferTime,
            timezone,
            includeExternalCalendars = true
        } = options;

        // Get employees for the tenant
        const employeesList = await this.db
            .select()
            .from(employees)
            .where(and(eq(employees.tenantId, tenantId), eq(employees.isActive, true)));

        // Filter by employeeId if specified
        const filteredEmployees = employeesList.filter(emp => !employeeId || emp.id === employeeId);
        const availableSlots: AvailabilitySlot[] = [];

        for (const employee of filteredEmployees) {
            // Check for date-specific overrides first
            const override = await this.db
                .select()
                .from(availabilityOverrides)
                .where(and(
                    eq(availabilityOverrides.employeeId, employee.id),
                    eq(availabilityOverrides.date, date)
                ))
                .limit(1);

            let workSchedule;

            if (override.length > 0) {
                const dayOverride = override[0];
                if (!dayOverride.isWorking || !dayOverride.startTime || !dayOverride.endTime) {
                    continue; // Employee is not working on this specific date
                }
                workSchedule = dayOverride;
            } else {
                // Get employee's standard working schedule for the day
                const dayOfWeek = new Date(date).getDay();
                const schedule = await this.db
                    .select()
                    .from(employeeSchedules)
                    .where(and(
                        eq(employeeSchedules.employeeId, employee.id),
                        eq(employeeSchedules.dayOfWeek, dayOfWeek),
                        eq(employeeSchedules.isActive, true)
                    ))
                    .limit(1);

                if (schedule.length === 0) continue;
                workSchedule = schedule[0];
                if (!workSchedule.startTime || !workSchedule.endTime) continue;
            }

            // Generate potential time slots
            const potentialSlots = this.generateTimeSlots(
                workSchedule.startTime as string,
                workSchedule.endTime as string,
                serviceDuration,
                bufferTime
            );

            // Check each potential slot
            for (const slot of potentialSlots) {
                const slotStart = new Date(`${date}T${slot.start}:00`);
                const slotEnd = new Date(`${date}T${slot.end}:00`);

                // Check for conflicts
                const conflicts = await this.checkSlotConflicts(
                    slotStart,
                    slotEnd,
                    employee.id,
                    tenantId,
                    includeExternalCalendars
                );

                if (conflicts.length === 0) {
                    availableSlots.push({
                        start: slotStart.toISOString(),
                        end: slotEnd.toISOString(),
                        employeeId: employee.id,
                        employeeName: employee.name,
                        isAvailable: true
                    });
                } else {
                    availableSlots.push({
                        start: slotStart.toISOString(),
                        end: slotEnd.toISOString(),
                        employeeId: employee.id,
                        employeeName: employee.name,
                        isAvailable: false,
                        conflicts: conflicts.filter(conflict =>
                            ['internal', 'google', 'outlook'].includes(conflict.type)
                        ) as Array<{
                            type: 'internal' | 'google' | 'outlook';
                            reason: string;
                            details?: any;
                        }>
                    });
                }
            }
        }

        return availableSlots.sort((a, b) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );
    }

    /**
     * Check for conflicts in a specific time slot
     */
    private async checkSlotConflicts(
        slotStart: Date,
        slotEnd: Date,
        employeeId: string,
        tenantId: string,
        includeExternalCalendars: boolean
    ): Promise<Array<{ type: 'internal' | 'google' | 'outlook' | 'blocked' | 'holiday'; reason: string; details?: any }>> {
        const conflicts: Array<{ type: 'internal' | 'google' | 'outlook' | 'blocked' | 'holiday'; reason: string; details?: any }> = [];

        // Check internal appointment conflicts
        const internalConflicts = await this.checkInternalConflicts(
            slotStart,
            slotEnd,
            employeeId,
            tenantId
        );

        if (internalConflicts.length > 0) {
            conflicts.push(...internalConflicts.map(conflict => ({
                type: 'internal' as const,
                reason: conflict.reason,
                details: conflict
            })));
        }

        // Check external calendar conflicts if enabled
        if (includeExternalCalendars) {
            const externalConflicts = await this.checkExternalCalendarConflicts(
                slotStart,
                slotEnd,
                tenantId
            );

            conflicts.push(...externalConflicts);
        }

        // Check blocked slots
        const blockedConflicts = await this.checkBlockedSlots(
            slotStart,
            slotEnd,
            employeeId,
            tenantId
        );

        conflicts.push(...blockedConflicts);

        // Check holidays
        const holidayConflicts = await this.checkHolidayConflicts(
            slotStart,
            employeeId,
            tenantId
        );

        conflicts.push(...holidayConflicts);

        return conflicts;
    }

    /**
     * Check for internal appointment conflicts
     */
    private async checkInternalConflicts(
        slotStart: Date,
        slotEnd: Date,
        employeeId: string,
        tenantId: string
    ): Promise<Array<{ reason: string; appointment: any }>> {
        const conflicts = [];

        const slotStartTimestamp = Math.floor(slotStart.getTime() / 1000);
        const slotEndTimestamp = Math.floor(slotEnd.getTime() / 1000);

        // Query for overlapping appointments
        const overlappingAppointments = await this.db
            .select()
            .from(appointments)
            .where(and(
                eq(appointments.employeeId, employeeId),
                eq(appointments.tenantId, tenantId),
                not(eq(appointments.status, 'cancelled')),
                sql`(
                    (${appointments.scheduledTime} >= ${slotStartTimestamp} AND ${appointments.scheduledTime} < ${slotEndTimestamp})
                    OR (${appointments.scheduledTime} < ${slotStartTimestamp} AND ${appointments.scheduledTime} + (
                        SELECT duration_minutes FROM services WHERE id = ${appointments.serviceId}
                    ) * 60 > ${slotStartTimestamp})
                )`
            ));

        for (const appointment of overlappingAppointments) {
            conflicts.push({
                reason: 'Appointment already scheduled',
                appointment
            });
        }

        return conflicts;
    }

    /**
     * Check for external calendar conflicts
     */
    private async checkExternalCalendarConflicts(
        slotStart: Date,
        slotEnd: Date,
        tenantId: string
    ): Promise<Array<{ type: 'google' | 'outlook'; reason: string; details?: any }>> {
        const conflicts: Array<{ type: 'google' | 'outlook'; reason: string; details?: any }> = [];

        try {
            // Get calendar connections
            const connections = await this.db
                .select()
                .from(calendarConnections)
                .where(and(
                    eq(calendarConnections.tenantId, tenantId),
                    eq(calendarConnections.isActive, true)
                ));

            for (const connection of connections) {
                const provider = connection.syncSettings?.provider || 'google';

                // Fetch events from external calendar
                const externalEvents = await this.fetchCalendarEvents(
                    provider,
                    connection,
                    slotStart,
                    slotEnd
                );

                for (const event of externalEvents) {
                    conflicts.push({
                        type: provider as 'google' | 'outlook',
                        reason: `External calendar event: ${event.summary}`,
                        details: event
                    });
                }
            }
        } catch (error) {
            console.error('Error checking external calendar conflicts:', error);
            // Don't fail the entire availability check for calendar errors
        }

        return conflicts;
    }

    /**
     * Fetch events from external calendar
     */
    private async fetchCalendarEvents(
        provider: string,
        connection: any,
        startTime: Date,
        endTime: Date
    ): Promise<CalendarConflict[]> {
        const events: CalendarConflict[] = [];

        try {
            if (provider === 'google') {
                // Fetch Google Calendar events
                const googleEvents = await this.fetchGoogleCalendarEvents(
                    connection.accessToken,
                    startTime,
                    endTime
                );

                for (const event of googleEvents) {
                    events.push({
                        id: event.id,
                        start: new Date(event.start.dateTime || event.start.date),
                        end: new Date(event.end.dateTime || event.end.date),
                        summary: event.summary,
                        source: 'google',
                        location: event.location
                    });
                }
            } else if (provider === 'microsoft') {
                // Fetch Outlook Calendar events
                const outlookEvents = await this.fetchOutlookCalendarEvents(
                    connection.accessToken,
                    startTime,
                    endTime
                );

                for (const event of outlookEvents) {
                    events.push({
                        id: event.id,
                        start: new Date(event.start.dateTime),
                        end: new Date(event.end.dateTime),
                        summary: event.subject,
                        source: 'outlook',
                        location: event.location?.displayName
                    });
                }
            } else if (provider === 'apple') {
                // Fetch Apple Calendar events (CalDAV)
                const appleEvents = await this.fetchAppleCalendarEvents(
                    connection,
                    startTime,
                    endTime
                );

                for (const event of appleEvents) {
                    events.push({
                        id: event.id,
                        start: event.start,
                        end: event.end,
                        summary: event.summary,
                        source: 'apple' as any,
                        location: event.location
                    });
                }
            }
        } catch (error) {
            console.error(`Error fetching ${provider} calendar events:`, error);
        }

        return events;
    }

    /**
     * Fetch Apple Calendar events (CalDAV)
     */
    private async fetchAppleCalendarEvents(
        connection: any,
        startTime: Date,
        endTime: Date
    ): Promise<CalendarConflict[]> {
        // CalDAV implementation would go here
        // For Phase 3, we provide the architectural hook
        console.log('Apple Calendar Sync (CalDAV) hook triggered');
        return [];
    }

    /**
     * Fetch Google Calendar events
     */
    private async fetchGoogleCalendarEvents(
        accessToken: string,
        startTime: Date,
        endTime: Date
    ): Promise<any[]> {
        const params = new URLSearchParams({
            timeMin: startTime.toISOString(),
            timeMax: endTime.toISOString(),
            singleEvents: 'true',
            orderBy: 'startTime'
        });

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Google Calendar API error: ${response.status}`);
        }

        const data = await response.json() as any;
        return data.items || [];
    }

    /**
     * Fetch Outlook Calendar events
     */
    private async fetchOutlookCalendarEvents(
        accessToken: string,
        startTime: Date,
        endTime: Date
    ): Promise<any[]> {
        const params = new URLSearchParams({
            startDateTime: startTime.toISOString(),
            endDateTime: endTime.toISOString()
        });

        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/calendar/events?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Outlook Calendar API error: ${response.status}`);
        }

        const data = await response.json() as any;
        return data.value || [];
    }

    /**
     * Check for blocked time slots
     */
    private async checkBlockedSlots(
        slotStart: Date,
        slotEnd: Date,
        employeeId: string,
        tenantId: string
    ): Promise<Array<{ type: 'blocked'; reason: string; details?: any }>> {
        const conflicts: Array<{ type: 'blocked'; reason: string; details?: any }> = [];

        const slotStartTimestamp = Math.floor(slotStart.getTime() / 1000);
        const slotEndTimestamp = Math.floor(slotEnd.getTime() / 1000);

        // Check for blocked slots (both employee-specific and general)
        const blockedSlotsData = await this.db
            .select()
            .from(blockedSlots)
            .where(and(
                eq(blockedSlots.tenantId, tenantId),
                eq(blockedSlots.isActive, true),
                or(
                    eq(blockedSlots.employeeId, employeeId),
                    sql`${blockedSlots.employeeId} IS NULL`
                ),
                sql`(
                    (${blockedSlots.startTime} <= ${slotEndTimestamp} AND ${blockedSlots.endTime} >= ${slotStartTimestamp})
                )`
            ));

        for (const blockedSlot of blockedSlotsData) {
            conflicts.push({
                type: 'blocked' as const,
                reason: `Blocked time: ${blockedSlot.reason}`,
                details: blockedSlot
            });
        }

        return conflicts;
    }

    /**
     * Check for holiday conflicts
     */
    private async checkHolidayConflicts(
        slotStart: Date,
        employeeId: string,
        tenantId: string
    ): Promise<Array<{ type: 'holiday'; reason: string; details?: any }>> {
        const conflicts: Array<{ type: 'holiday'; reason: string; details?: any }> = [];

        const dateStr = slotStart.toISOString().split('T')[0];

        // Check for holidays affecting this employee or all employees
        const holidaysData = await this.db
            .select()
            .from(holidays)
            .where(and(
                eq(holidays.tenantId, tenantId),
                eq(holidays.date, dateStr),
                sql`(
                    ${holidays.affectsAllEmployees} = 1 OR 
                    JSON_EXTRACT(${holidays.affectedEmployeeIds}, '$') LIKE '%' || ${employeeId} || '%'
                )`
            ));

        for (const holiday of holidaysData) {
            conflicts.push({
                type: 'holiday' as const,
                reason: `Holiday: ${holiday.name}`,
                details: holiday
            });
        }

        return conflicts;
    }

    /**
     * Generate potential time slots within working hours
     */
    private generateTimeSlots(
        startTime: string,
        endTime: string,
        serviceDuration: number,
        bufferTime: number
    ): Array<{ start: string; end: string }> {
        const slots = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        const totalSlotDuration = serviceDuration + bufferTime;

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute + totalSlotDuration <= endMinute)
        ) {
            const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

            const endMinutes = currentHour * 60 + currentMinute + serviceDuration;
            const endSlotHour = Math.floor(endMinutes / 60);
            const endSlotMinute = endMinutes % 60;

            const slotEnd = `${String(endSlotHour).padStart(2, '0')}:${String(endSlotMinute).padStart(2, '0')}`;

            slots.push({ start: slotStart, end: slotEnd });

            // Move to next slot (every 30 minutes)
            currentMinute += 30;
            if (currentMinute >= 60) {
                currentMinute -= 60;
                currentHour += 1;
            }
        }

        return slots;
    }

    /**
     * Get employee's schedule for a specific date
     */
    async getEmployeeSchedule(employeeId: string, date: string) {
        const dayOfWeek = new Date(date).getDay();

        const schedule = await this.db
            .select()
            .from(employeeSchedules)
            .where(and(
                eq(employeeSchedules.employeeId, employeeId),
                eq(employeeSchedules.dayOfWeek, dayOfWeek),
                eq(employeeSchedules.isActive, true)
            ))
            .limit(1);

        return schedule[0] || null;
    }

    /**
     * Check if a specific slot is available
     */
    async isSlotAvailable(
        date: string,
        time: string,
        employeeId: string,
        serviceDuration: number,
        tenantId: string,
        includeExternalCalendars: boolean = true
    ): Promise<{ available: boolean; conflicts: Array<{ type: 'internal' | 'google' | 'outlook' | 'blocked' | 'holiday'; reason: string; details?: any }> }> {
        const slotStart = new Date(`${date}T${time}:00`);
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

        const conflicts = await this.checkSlotConflicts(
            slotStart,
            slotEnd,
            employeeId,
            tenantId,
            includeExternalCalendars
        );

        return {
            available: conflicts.length === 0,
            conflicts
        };
    }
}