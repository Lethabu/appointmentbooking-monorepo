// packages/worker/src/notifications.ts
import { logger } from './logger';
// import { Resend } from 'resend';
// import { render } from 'react-email';
// import { BookingConfirmationEmail } from './emails/BookingConfirmation';

interface BookingConfirmationPayload {
    id?: string; // Optional notification ID from DB
    type: 'booking_confirmation';
    data: {
        to: string;
        name: string;
        scheduledTime: string;
        serviceName: string;
        tenantName: string;
        from: string; // The "from" email address, e.g. 'InStyle <noreply@instyle.com>'
    }
}

type NotificationPayload = BookingConfirmationPayload;

export async function handleNotification(message: Message<NotificationPayload>, env: any) {
    // Email functionality temporarily disabled for deployment
    // const resend = new Resend(env.RESEND_API_KEY);

    try {
        const payload = message.body;
        logger.info('Processing notification', { type: payload.type, id: payload.id });

        // Route notification based on its type
        switch (payload.type) {
            case 'booking_confirmation':
                {
                    const { to, name, scheduledTime, serviceName, tenantName, from } = payload.data;

                    // Email functionality temporarily disabled for deployment
                    // Render the React Email template to an HTML string
                    // const emailHtml = render(BookingConfirmationEmail({
                    //     name,
                    //     scheduledTime,
                    //     serviceName,
                    //     tenantName
                    // }));

                    // Send the email using Resend
                    // await resend.emails.send({
                    //     from: from,
                    //     to: [to],
                    //     subject: `Your booking for ${serviceName} is confirmed!`,
                    //     html: emailHtml,
                    // });

                    logger.info(`Booking confirmation would be sent to ${to} (email disabled)`, { to });
                    break;
                }

            default:
                // Log unhandled notification types
                logger.warn('Unknown notification type', { type: (payload as any).type });
                break;
        }

        // If the notification had a DB id, mark it as sent
        if (payload.id && env.DB) {
            await env.DB.prepare(`
                UPDATE notifications 
                SET status = 'sent', sent_at = ? 
                WHERE id = ?
            `).bind(Math.floor(Date.now() / 1000), payload.id).run();
        }

        // Acknowledge the message was processed successfully
        message.ack();
    } catch (error) {
        logger.error('Notification failed', { error });
        // Retry the message on failure
        message.retry();
    }
}
