import { calendarConnections, calendarSyncEvents, appointments } from '@repo/db';
import { getDb } from '@repo/db';
import { eq, and, sql } from 'drizzle-orm';
import { createCalendarEvent as createGoogleEvent, updateCalendarEvent as updateGoogleEvent, deleteCalendarEvent as deleteGoogleEvent } from './google-calendar';
import { createCalendarEvent as createOutlookEvent, updateCalendarEvent as updateOutlookEvent, deleteCalendarEvent as deleteOutlookEvent } from './outlook-calendar';
import { BookingQueries } from '@/utils/database/booking-queries';

export interface CalendarEventData {
    summary: string;
    description?: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location?: string;
    attendees?: Array<{
        email: string;
        displayName?: string;
    }>;
}

export interface SyncResult {
    success: boolean;
    eventId?: string;
    error?: string;
    syncStatus: 'created' | 'updated' | 'failed' | 'deleted';
}

export interface SyncOptions {
    createOnly?: boolean;
    updateOnly?: boolean;
    deleteOnly?: boolean;
}

/**
 * Calendar Synchronization Service
 * Handles bidirectional sync between booking system and external calendars
 */
export class CalendarSyncService {
    private db: ReturnType<typeof getDb>;
    private bookingQueries: BookingQueries;

    constructor(env: { DB: any }) {
        this.db = getDb(env);
        this.bookingQueries = new BookingQueries(env.DB);
    }

    /**
     * Sync appointment to external calendar
     */
    async syncAppointmentToCalendar(
        appointmentId: string,
        tenantId: string,
        operation: 'create' | 'update' | 'delete' = 'create'
    ): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        try {
            // Get appointment details
            const appointment = await this.bookingQueries.getAppointment(appointmentId, tenantId);
            if (!appointment) {
                return [{
                    success: false,
                    error: 'Appointment not found',
                    syncStatus: 'failed'
                }];
            }

            // Get service and employee details
            const service = await this.bookingQueries.getService(appointment.serviceId, tenantId);
            const employee = appointment.employeeId ? await this.bookingQueries.getEmployee(appointment.employeeId, tenantId) : null;

            // Format appointment data for calendar
            const eventData = await this.formatAppointmentForCalendar(appointment, service, employee);

            // Get calendar connections
            const connections = await this.db
                .select()
                .from(calendarConnections)
                .where(eq(calendarConnections.tenantId, tenantId));

            // Sync to each connected calendar
            for (const connection of connections) {
                if (!connection.isActive || !connection.accessToken) continue;

                const provider = connection.syncSettings?.provider || 'google';

                try {
                    let result: SyncResult;

                    if (operation === 'create') {
                        result = await this.createCalendarEvent(connection, eventData, tenantId, appointmentId);
                    } else if (operation === 'update') {
                        result = await this.updateCalendarEvent(connection, eventData, tenantId, appointmentId);
                    } else {
                        result = await this.deleteCalendarEvent(connection, tenantId, appointmentId);
                    }

                    results.push(result);
                } catch (error) {
                    console.error(`Failed to sync to ${provider} calendar:`, error);
                    results.push({
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                        syncStatus: 'failed'
                    });
                }
            }

            return results;
        } catch (error) {
            console.error('Calendar sync error:', error);
            return [{
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                syncStatus: 'failed'
            }];
        }
    }

    /**
     * Create event in external calendar
     */
    private async createCalendarEvent(
        connection: any,
        eventData: CalendarEventData,
        tenantId: string,
        appointmentId: string
    ): Promise<SyncResult> {
        const provider = connection.syncSettings?.provider || 'google';

        try {
            let eventId: string | null = null;

            if (provider === 'google') {
                const result = await createGoogleEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    {
                        summary: eventData.summary,
                        description: eventData.description,
                        start: eventData.start,
                        end: eventData.end,
                        location: eventData.location,
                        attendees: eventData.attendees
                    }
                );
                eventId = result?.eventId || null;
            } else if (provider === 'microsoft') {
                const result = await createOutlookEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    connection.googleCalendarId,
                    {
                        subject: eventData.summary,
                        body: eventData.description ? {
                            contentType: 'text',
                            content: eventData.description
                        } : undefined,
                        start: eventData.start,
                        end: eventData.end,
                        location: eventData.location ? {
                            displayName: eventData.location
                        } : undefined,
                        attendees: eventData.attendees?.map(att => ({
                            emailAddress: {
                                address: att.email,
                                name: att.displayName
                            },
                            type: 'required'
                        }))
                    }
                );
                eventId = result?.eventId || null;
            }

            if (eventId) {
                // Record successful sync
                await this.recordSyncEvent(tenantId, appointmentId, eventId, 'created', null);

                return {
                    success: true,
                    eventId,
                    syncStatus: 'created'
                };
            } else {
                throw new Error('Failed to create calendar event');
            }
        } catch (error) {
            await this.recordSyncEvent(tenantId, appointmentId, null, 'failed', error instanceof Error ? error.message : null);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                syncStatus: 'failed'
            };
        }
    }

    /**
     * Update event in external calendar
     */
    private async updateCalendarEvent(
        connection: any,
        eventData: CalendarEventData,
        tenantId: string,
        appointmentId: string
    ): Promise<SyncResult> {
        const provider = connection.syncSettings?.provider || 'google';

        try {
            // Get existing sync event to find the calendar event ID
            const existingSync = await this.db
                .select()
                .from(calendarSyncEvents)
                .where(and(
                    eq(calendarSyncEvents.bookingId, appointmentId),
                    eq(calendarSyncEvents.tenantId, tenantId)
                ))
                .limit(1);

            if (existingSync.length === 0 || !existingSync[0].googleEventId) {
                // No existing sync, create new event instead
                return this.createCalendarEvent(connection, eventData, tenantId, appointmentId);
            }

            const eventId = existingSync[0].googleEventId;
            let success = false;

            if (provider === 'google') {
                success = await updateGoogleEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    eventId,
                    {
                        summary: eventData.summary,
                        description: eventData.description,
                        start: eventData.start,
                        end: eventData.end,
                        location: eventData.location,
                        attendees: eventData.attendees
                    }
                );
            } else if (provider === 'microsoft') {
                success = await updateOutlookEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    connection.googleCalendarId,
                    eventId,
                    {
                        subject: eventData.summary,
                        body: eventData.description ? {
                            contentType: 'text',
                            content: eventData.description
                        } : undefined,
                        start: eventData.start,
                        end: eventData.end,
                        location: eventData.location ? {
                            displayName: eventData.location
                        } : undefined,
                        attendees: eventData.attendees?.map(att => ({
                            emailAddress: {
                                address: att.email,
                                name: att.displayName
                            },
                            type: 'required'
                        }))
                    }
                );
            }

            if (success) {
                await this.recordSyncEvent(tenantId, appointmentId, eventId, 'updated', null);

                return {
                    success: true,
                    eventId,
                    syncStatus: 'updated'
                };
            } else {
                throw new Error('Failed to update calendar event');
            }
        } catch (error) {
            await this.recordSyncEvent(tenantId, appointmentId, null, 'failed', error instanceof Error ? error.message : null);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                syncStatus: 'failed'
            };
        }
    }

    /**
     * Delete event from external calendar
     */
    private async deleteCalendarEvent(
        connection: any,
        tenantId: string,
        appointmentId: string
    ): Promise<SyncResult> {
        const provider = connection.syncSettings?.provider || 'google';

        try {
            // Get existing sync event to find the calendar event ID
            const existingSync = await this.db
                .select()
                .from(calendarSyncEvents)
                .where(and(
                    eq(calendarSyncEvents.bookingId, appointmentId),
                    eq(calendarSyncEvents.tenantId, tenantId)
                ))
                .limit(1);

            if (existingSync.length === 0 || !existingSync[0].googleEventId) {
                // No existing sync, nothing to delete
                return {
                    success: true,
                    syncStatus: 'deleted'
                };
            }

            const eventId = existingSync[0].googleEventId;
            let success = false;

            if (provider === 'google') {
                success = await deleteGoogleEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    eventId
                );
            } else if (provider === 'microsoft') {
                success = await deleteOutlookEvent(
                    { DB: (this.db as any).db },
                    tenantId,
                    connection.googleCalendarId,
                    eventId
                );
            }

            if (success) {
                // Delete sync event record
                await this.db
                    .delete(calendarSyncEvents)
                    .where(eq(calendarSyncEvents.id, existingSync[0].id));

                return {
                    success: true,
                    eventId,
                    syncStatus: 'deleted'
                };
            } else {
                throw new Error('Failed to delete calendar event');
            }
        } catch (error) {
            await this.recordSyncEvent(tenantId, appointmentId, null, 'failed', error instanceof Error ? error.message : null);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                syncStatus: 'failed'
            };
        }
    }

    /**
     * Format appointment data for calendar event
     */
    private async formatAppointmentForCalendar(
        appointment: any,
        service: any,
        employee: any
    ): Promise<CalendarEventData> {
        const startTime = new Date(appointment.scheduledTime * 1000);
        const endTime = new Date(startTime.getTime() + (service?.durationMinutes || 60) * 60000);

        return {
            summary: `${service?.name || 'Appointment'} with ${employee?.name || 'Staff'}`,
            description: `Service: ${service?.name || 'Appointment'}\nDuration: ${service?.durationMinutes || 60} minutes\nStaff: ${employee?.name || 'Staff Member'}\n\nAppointment ID: ${appointment.id}`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'Africa/Johannesburg' // TODO: Get from tenant config
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'Africa/Johannesburg' // TODO: Get from tenant config
            },
            attendees: [
                {
                    email: 'customer@example.com', // TODO: Get customer email
                    displayName: 'Customer'
                }
            ]
        };
    }

    /**
     * Record sync event in database
     */
    private async recordSyncEvent(
        tenantId: string,
        bookingId: string,
        googleEventId: string | null,
        syncStatus: string,
        errorMessage: string | null
    ): Promise<void> {
        const id = crypto.randomUUID();

        await this.db.insert(calendarSyncEvents).values({
            id,
            tenantId,
            bookingId,
            googleEventId,
            syncStatus,
            errorMessage,
            createdAt: new Date()
        });
    }

    /**
     * Get sync status for an appointment
     */
    async getAppointmentSyncStatus(appointmentId: string, tenantId: string) {
        const syncEvents = await this.db
            .select()
            .from(calendarSyncEvents)
            .where(and(
                eq(calendarSyncEvents.bookingId, appointmentId),
                eq(calendarSyncEvents.tenantId, tenantId)
            ));

        return {
            synced: syncEvents.length > 0,
            events: syncEvents,
            hasErrors: syncEvents.some(event => event.syncStatus === 'failed'),
            lastSync: syncEvents.length > 0 ? syncEvents[0].createdAt : null
        };
    }

    /**
     * Retry failed sync events
     */
    async retryFailedSyncs(tenantId: string, appointmentId?: string): Promise<SyncResult[]> {
        const results: SyncResult[] = [];

        try {
            // TODO: Implement retry logic for failed sync events
            // This is a placeholder implementation
            console.log('Retry functionality not yet implemented');

            return [{
                success: true,
                syncStatus: 'updated'
            }];
        } catch (error) {
            console.error('Error retrying failed syncs:', error);
            return [{
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                syncStatus: 'failed'
            }];
        }
    }
}