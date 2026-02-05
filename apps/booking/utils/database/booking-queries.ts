/**
 * Database Query Utilities for Bookings
 * Centralized database operations with D1/Drizzle ORM integration
 */

import {
    appointments,
    users,
    services,
    employees,
    employeeSchedules,
    holidays,
    blockedSlots,
    notifications,
} from '@repo/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

export interface CreateAppointmentData {
    customerId: string;
    serviceId: string;
    staffId: string;
    date: string;
    time: string;
    duration: number;
    totalPrice: number;
    depositAmount: number;
    notes?: string;
    tenantId: string;
    timezone: string;
    scheduledTime: Date;
}

export interface UpdateAppointmentData {
    serviceId?: string;
    staffId?: string;
    scheduledTime?: Date;
    status?: string;
    notes?: string;
    version: number; // For optimistic locking
}

export interface AppointmentFilters {
    customerId?: string;
    date?: string;
    status?: string;
    employeeId?: string;
    tenantId: string;
}

/**
 * Booking database operations class
 */
export class BookingQueries {
    private db: ReturnType<typeof drizzle>;

    constructor(d1Database: D1Database) {
        this.db = drizzle(d1Database);
    }

    /**
     * Create a new appointment with conflict checking
     */
    async createAppointment(data: CreateAppointmentData) {
        // Check for conflicts before creating
        const conflicts = await this.checkConflicts(
            data.staffId,
            data.scheduledTime,
            data.duration,
            data.tenantId
        );

        if (conflicts.length > 0) {
            throw new Error('Appointment slot conflicts with existing booking');
        }

        // Create appointment
        const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await this.db.insert(appointments).values(
            {
                id: appointmentId,
                userId: data.customerId,
                serviceId: data.serviceId,
                employeeId: data.staffId,
                scheduledTime: sql`${Math.floor(data.scheduledTime.getTime() / 1000)}`,
                status: 'pending',
                notes: data.notes,
                tenantId: data.tenantId,
            }
        );

        return this.getAppointment(appointmentId, data.tenantId);
    }

    /**
     * Get a single appointment by ID
     */
    async getAppointment(appointmentId: string, tenantId: string) {
        const result = await this.db
            .select()
            .from(appointments)
            .where(and(eq(appointments.id, appointmentId), eq(appointments.tenantId, tenantId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Update an appointment with optimistic locking
     */
    async updateAppointment(
        appointmentId: string,
        tenantId: string,
        updates: UpdateAppointmentData
    ) {
        // Get current appointment
        const current = await this.getAppointment(appointmentId, tenantId);

        if (!current) {
            throw new Error('Appointment not found');
        }

        // Check version for optimistic locking
        if (current.version !== updates.version) {
            throw new Error('Appointment has been modified by another user. Please refresh and try again.');
        }

        // If rescheduling, check for conflicts
        if (updates.scheduledTime && updates.staffId) {
            const service = await this.getService(current.serviceId, tenantId);
            if (service) {
                const conflicts = await this.checkConflicts(
                    updates.staffId,
                    new Date(updates.scheduledTime),
                    service.durationMinutes,
                    tenantId,
                    appointmentId // Exclude current appointment
                );

                if (conflicts.length > 0) {
                    throw new Error('New time slot conflicts with existing booking');
                }
            }
        }

        // Prepare update data
        const updateData: any = {
            version: current.version + 1,
        };

        if (updates.serviceId) updateData.serviceId = updates.serviceId;
        if (updates.staffId) updateData.employeeId = updates.staffId;
        if (updates.scheduledTime) updateData.scheduledTime = Math.floor(updates.scheduledTime.getTime() / 1000);
        if (updates.status) updateData.status = updates.status;
        if (updates.notes !== undefined) updateData.notes = updates.notes;

        // Update appointment
        await this.db
            .update(appointments)
            .set(updateData)
            .where(
                and(
                    eq(appointments.id, appointmentId),
                    eq(appointments.tenantId, tenantId),
                    eq(appointments.version, current.version)
                )
            );

        return this.getAppointment(appointmentId, tenantId);
    }

    /**
     * Cancel an appointment (soft delete)
     */
    async cancelAppointment(appointmentId: string, tenantId: string) {
        await this.db
            .update(appointments)
            .set({
                status: 'cancelled',
            })
            .where(and(eq(appointments.id, appointmentId), eq(appointments.tenantId, tenantId)));

        return this.getAppointment(appointmentId, tenantId);
    }

    /**
     * Get appointments with filters
     */
    async getAppointments(filters: AppointmentFilters, page = 1, limit = 20) {
        const conditions = [eq(appointments.tenantId, filters.tenantId)];

        if (filters.customerId) {
            conditions.push(eq(appointments.userId, filters.customerId));
        }

        if (filters.status) {
            conditions.push(eq(appointments.status, filters.status));
        }

        if (filters.employeeId) {
            conditions.push(eq(appointments.employeeId, filters.employeeId));
        }

        if (filters.date) {
            const startOfDay = new Date(`${filters.date}T00:00:00Z`);
            const endOfDay = new Date(`${filters.date}T23:59:59Z`);
            conditions.push(
                gte(appointments.scheduledTime, sql`${Math.floor(startOfDay.getTime() / 1000)}`),
                lte(appointments.scheduledTime, sql`${Math.floor(endOfDay.getTime() / 1000)}`)
            );
        }

        const offset = (page - 1) * limit;

        const results = await this.db
            .select()
            .from(appointments)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset);

        // Get total count
        const countResult = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(appointments)
            .where(and(...conditions));

        const total = countResult[0]?.count || 0;

        return {
            items: results,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: offset + results.length < total,
                hasPrev: page > 1,
            },
        };
    }

    /**
     * Check for scheduling conflicts
     */
    async checkConflicts(
        employeeId: string,
        startTime: Date,
        duration: number,
        tenantId: string,
        excludeAppointmentId?: string
    ) {
        const startTimestamp = Math.floor(startTime.getTime() / 1000);
        const endTimestamp = Math.floor((startTime.getTime() + duration * 60000) / 1000);

        const conditions = [
            eq(appointments.tenantId, tenantId),
            eq(appointments.employeeId, employeeId),
            // Not cancelled
            sql`${appointments.status} != 'cancelled'`,
            // Overlapping time range
            sql`(
        (${appointments.scheduledTime} >= ${startTimestamp} AND ${appointments.scheduledTime} < ${endTimestamp})
        OR (${appointments.scheduledTime} < ${startTimestamp} AND ${appointments.scheduledTime} + ${duration} * 60 > ${startTimestamp})
      )`,
        ];

        if (excludeAppointmentId) {
            conditions.push(sql`${appointments.id} != ${excludeAppointmentId}`);
        }

        return await this.db
            .select()
            .from(appointments)
            .where(and(...conditions));
    }

    /**
     * Get service details
     */
    async getService(serviceId: string, tenantId: string) {
        const result = await this.db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.tenantId, tenantId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get employee details
     */
    async getEmployee(employeeId: string, tenantId: string) {
        const result = await this.db
            .select()
            .from(employees)
            .where(and(eq(employees.id, employeeId), eq(employees.tenantId, tenantId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get all active employees for a tenant
     */
    async getEmployees(tenantId: string) {
        return await this.db
            .select()
            .from(employees)
            .where(and(eq(employees.tenantId, tenantId), eq(employees.isActive, true)));
    }

    /**
     * Get all active services for a tenant
     */
    async getServices(tenantId: string) {
        return await this.db
            .select()
            .from(services)
            .where(and(eq(services.tenantId, tenantId), eq(services.isActive, true)));
    }

    /**
     * Create a customer (user)
     */
    async createCustomer(data: {
        email: string;
        name: string;
        tenantId: string;
        phone?: string;
    }) {
        const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await this.db.insert(users).values({
            id: customerId,
            email: data.email,
            name: data.name,
            tenantId: data.tenantId,
            role: 'user',
        });

        return customerId;
    }

    /**
     * Get or create a customer by email
     */
    async getOrCreateCustomer(data: {
        email: string;
        name: string;
        tenantId: string;
    }) {
        // Try to find existing customer
        const existing = await this.db
            .select()
            .from(users)
            .where(and(eq(users.email, data.email), eq(users.tenantId, data.tenantId)))
            .limit(1);

        if (existing[0]) {
            return existing[0].id;
        }

        // Create new customer
        return await this.createCustomer(data);
    }

    /**
     * Create a notification record
     */
    async createNotification(data: {
        tenantId: string;
        userId: string;
        appointmentId: string;
        type: string;
        channel: string;
        recipient: string;
        message: string;
    }) {
        const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await this.db.insert(notifications).values({
            id: notificationId,
            tenantId: data.tenantId,
            userId: data.userId,
            appointmentId: data.appointmentId,
            type: data.type,
            channel: data.channel,
            recipient: data.recipient,
            message: data.message,
            status: 'pending',
        });

        return notificationId;
    }
}
