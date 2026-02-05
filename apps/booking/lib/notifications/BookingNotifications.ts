// Booking Notifications Service
// File: apps/booking/lib/notifications/BookingNotifications.ts

import { createClient } from '@supabase/supabase-js';

import { whatsappClient, WhatsAppTemplates } from '../whatsapp/AISensyClient';

// Types
export interface Booking {
    id: string;
    tenantId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    serviceName: string;
    scheduledTime: Date;
    duration: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
}

export interface NotificationResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Booking Notifications Class
export class BookingNotifications {
    private supabase: ReturnType<typeof createClient>;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    /**
     * Send immediate booking confirmation
     */
    async sendBookingConfirmation(booking: Booking): Promise<NotificationResult> {
        try {
            const template = WhatsAppTemplates.bookingConfirmation({
                customerName: booking.customerName,
                serviceName: booking.serviceName,
                date: this.formatDate(booking.scheduledTime),
                time: this.formatTime(booking.scheduledTime),
                price: this.formatPrice(booking.totalPrice),
            });

            const result = await whatsappClient.sendTemplate({
                phone: booking.customerPhone,
                ...template,
            });

            // Log notification
            await this.logNotification({
                bookingId: booking.id,
                type: 'booking_confirmation',
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            });

            return result;
        } catch (error) {
            console.error('Booking confirmation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Send 24-hour reminder
     */
    async send24hReminder(booking: Booking): Promise<NotificationResult> {
        try {
            const template = WhatsAppTemplates.reminder24h({
                customerName: booking.customerName,
                serviceName: booking.serviceName,
                date: this.formatDate(booking.scheduledTime),
                time: this.formatTime(booking.scheduledTime),
            });

            const result = await whatsappClient.sendTemplate({
                phone: booking.customerPhone,
                ...template,
            });

            // Log notification
            await this.logNotification({
                bookingId: booking.id,
                type: 'reminder_24h',
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            });

            return result;
        } catch (error) {
            console.error('24h reminder error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Send 2-hour reminder
     */
    async send2hReminder(booking: Booking): Promise<NotificationResult> {
        try {
            const template = WhatsAppTemplates.reminder2h({
                customerName: booking.customerName,
                serviceName: booking.serviceName,
                time: this.formatTime(booking.scheduledTime),
            });

            const result = await whatsappClient.sendTemplate({
                phone: booking.customerPhone,
                ...template,
            });

            // Log notification
            await this.logNotification({
                bookingId: booking.id,
                type: 'reminder_2h',
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            });

            return result;
        } catch (error) {
            console.error('2h reminder error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Send cancellation confirmation
     */
    async sendCancellationConfirmation(booking: Booking): Promise<NotificationResult> {
        try {
            const template = WhatsAppTemplates.cancellationConfirmation({
                customerName: booking.customerName,
                serviceName: booking.serviceName,
                date: this.formatDate(booking.scheduledTime),
            });

            const result = await whatsappClient.sendTemplate({
                phone: booking.customerPhone,
                ...template,
            });

            // Log notification
            await this.logNotification({
                bookingId: booking.id,
                type: 'cancellation_confirmation',
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            });

            return result;
        } catch (error) {
            console.error('Cancellation confirmation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get bookings for tomorrow (24h reminders)
     */
    async getBookingsForTomorrow(tenantId: string): Promise<Booking[]> {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);

            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('tenant_id', tenantId)
                .eq('status', 'confirmed')
                .gte('scheduled_time', tomorrow.toISOString())
                .lt('scheduled_time', dayAfter.toISOString());

            if (error) throw error;

            return this.mapToBookings(data || []);
        } catch (error) {
            console.error('Get bookings for tomorrow error:', error);
            return [];
        }
    }

    /**
     * Get bookings in 2 hours
     */
    async getBookingsIn2Hours(tenantId: string): Promise<Booking[]> {
        try {
            const now = new Date();
            const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            const twoHoursThirtyLater = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);

            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('tenant_id', tenantId)
                .eq('status', 'confirmed')
                .gte('scheduled_time', twoHoursLater.toISOString())
                .lt('scheduled_time', twoHoursThirtyLater.toISOString());

            if (error) throw error;

            return this.mapToBookings(data || []);
        } catch (error) {
            console.error('Get bookings in 2 hours error:', error);
            return [];
        }
    }

    /**
     * Log notification to database
     */
    private async logNotification(log: {
        bookingId: string;
        type: string;
        status: string;
        messageId?: string;
        error?: string;
    }): Promise<void> {
        try {
            await this.supabase.from('notification_logs').insert({
                booking_id: log.bookingId,
                notification_type: log.type,
                status: log.status,
                message_id: log.messageId,
                error_message: log.error,
                sent_at: new Date().toISOString(),
            } as any);
        } catch (error) {
            console.error('Log notification error:', error);
            // Don't throw - logging failure shouldn't break notification
        }
    }

    /**
     * Format date for display
     */
    private formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    /**
     * Format time for display
     */
    private formatTime(date: Date): string {
        return new Date(date).toLocaleTimeString('en-ZA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    /**
     * Format price for display
     */
    private formatPrice(priceInCents: number): string {
        return `R${(priceInCents / 100).toFixed(2)}`;
    }

    /**
     * Map database records to Booking type
     */
    private mapToBookings(records: any[]): Booking[] {
        return records.map((record) => ({
            id: record.id,
            tenantId: record.tenant_id,
            customerId: record.customer_id,
            customerName: record.customer_name,
            customerEmail: record.customer_email,
            customerPhone: record.customer_phone,
            serviceId: record.service_id,
            serviceName: record.service_name,
            scheduledTime: new Date(record.scheduled_time),
            duration: record.duration,
            totalPrice: record.total_price,
            status: record.status,
            createdAt: new Date(record.created_at),
        }));
    }
}

// Export singleton instance
export const bookingNotifications = new BookingNotifications();
