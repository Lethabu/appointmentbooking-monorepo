/**
 * Email Delivery Service
 * Handles sending emails via Resend or other email providers
 */

import {
    confirmationEmailTemplate,
    reminderEmailTemplate,
    cancellationEmailTemplate,
    rescheduleEmailTemplate,
    type BookingEmailData,
} from './email-templates';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}

export interface SendBookingEmailOptions {
    type: 'confirmation' | 'reminder' | 'cancellation' | 'reschedule';
    bookingData: BookingEmailData;
    recipientEmail: string;
    hoursBeforeremaining?: number; // For reminders
    oldDate?: string; // For rescheduling
    oldTime?: string; // For rescheduling
}

/**
 * Email service class
 */
export class EmailService {
    private fromEmail: string;
    private resendApiKey: string | undefined;

    constructor(fromEmail: string = 'bookings@appointmentbooking.co.za') {
        this.fromEmail = fromEmail;
        this.resendApiKey = process.env.RESEND_API_KEY;
    }

    /**
     * Send a booking-related email
     */
    async sendBookingEmail(options: SendBookingEmailOptions): Promise<boolean> {
        const { type, bookingData, recipientEmail, hoursBeforeremaining, oldDate, oldTime } = options;

        let emailTemplate: { subject: string; html: string; text: string };

        switch (type) {
            case 'confirmation':
                emailTemplate = confirmationEmailTemplate(bookingData);
                break;
            case 'reminder':
                emailTemplate = reminderEmailTemplate(bookingData, hoursBeforeremaining || 24);
                break;
            case 'cancellation':
                emailTemplate = cancellationEmailTemplate(bookingData);
                break;
            case 'reschedule':
                emailTemplate = rescheduleEmailTemplate(bookingData, oldDate || '', oldTime || '');
                break;
            default:
                throw new Error(`Unknown email type: ${type}`);
        }

        return await this.sendEmail({
            to: recipientEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
    }

    /**
     * Send an email using the configured email provider
     */
    async sendEmail(options: EmailOptions): Promise<boolean> {
        const { to, subject, html, text, from } = options;

        // In development, log emails instead of sending
        if (process.env.NODE_ENV === 'development' || !this.resendApiKey) {
            console.log('📧 [DEV] Email would be sent:');
            console.log('To:', to);
            console.log('Subject:', subject);
            console.log('From:', from || this.fromEmail);
            console.log('---');
            return true;
        }

        try {
            // Using Resend API
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: from || this.fromEmail,
                    to: [to],
                    subject,
                    html,
                    text,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Failed to send email:', error);
                throw new Error(`Email send failed: ${(error as any).message || response.statusText}`);
            }

            const result = await response.json();
            console.log('Email sent successfully:', (result as any).id);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    /**
     * Send a test email to verify configuration
     */
    async sendTestEmail(toEmail: string): Promise<boolean> {
        return await this.sendEmail({
            to: toEmail,
            subject: 'Test Email - Appointment Booking System',
            html: '<h1>Test Email</h1><p>Your email configuration is working correctly!</p>',
            text: 'Test Email\n\nYour email configuration is working correctly!',
        });
    }

    /**
     * Queue an email for sending (for production use with job queue)
     */
    async queueEmail(options: EmailOptions): Promise<{ id: string; queued: boolean }> {
        // In a production environment, this would add the email to a job queue
        // For now, we'll send it immediately
        const sent = await this.sendEmail(options);

        return {
            id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            queued: sent,
        };
    }

    /**
     * Send batch emails (useful for marketing campaigns)
     */
    async sendBatchEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number }> {
        let sent = 0;
        let failed = 0;

        for (const email of emails) {
            try {
                const result = await this.sendEmail(email);
                if (result) {
                    sent++;
                } else {
                    failed++;
                }
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                failed++;
                console.error(`Failed to send email to ${email.to}:`, error);
            }
        }

        return { sent, failed };
    }
}

/**
 * Factory function to create email service instance
 */
export function createEmailService(fromEmail?: string): EmailService {
    return new EmailService(fromEmail);
}

/**
 * Helper function to send a booking confirmation email
 */
export async function sendBookingConfirmation(
    bookingData: BookingEmailData,
    recipientEmail: string
): Promise<boolean> {
    const emailService = createEmailService();
    return await emailService.sendBookingEmail({
        type: 'confirmation',
        bookingData,
        recipientEmail,
    });
}

/**
 * Helper function to send a booking reminder email
 */
export async function sendBookingReminder(
    bookingData: BookingEmailData,
    recipientEmail: string,
    hoursBeforeremaining: number = 24
): Promise<boolean> {
    const emailService = createEmailService();
    return await emailService.sendBookingEmail({
        type: 'reminder',
        bookingData,
        recipientEmail,
        hoursBeforeremaining,
    });
}

/**
 * Helper function to send a cancellation email
 */
export async function sendCancellationEmail(
    bookingData: BookingEmailData,
    recipientEmail: string
): Promise<boolean> {
    const emailService = createEmailService();
    return await emailService.sendBookingEmail({
        type: 'cancellation',
        bookingData,
        recipientEmail,
    });
}

/**
 * Helper function to send a reschedule confirmation email
 */
export async function sendRescheduleEmail(
    bookingData: BookingEmailData,
    recipientEmail: string,
    oldDate: string,
    oldTime: string
): Promise<boolean> {
    const emailService = createEmailService();
    return await emailService.sendBookingEmail({
        type: 'reschedule',
        bookingData,
        recipientEmail,
        oldDate,
        oldTime,
    });
}
