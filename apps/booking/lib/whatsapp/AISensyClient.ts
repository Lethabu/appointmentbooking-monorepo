// AISensy WhatsApp Client
// File: apps/booking/lib/whatsapp/AISensyClient.ts

import axios, { AxiosInstance } from 'axios';

// Types
export interface WhatsAppMessage {
    phone: string;
    message: string;
    mediaUrl?: string;
}

export interface WhatsAppTemplate {
    phone: string;
    templateName: string;
    params: Record<string, string>;
}

export interface WebhookPayload {
    event: string;
    data: {
        from: string;
        message: string;
        timestamp: string;
        messageId: string;
    };
}

export interface MessageStatus {
    messageId: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
}

// AISensy Client Class
export class AISensyClient {
    private client: AxiosInstance;
    private apiKey: string;
    private campaignName: string;

    constructor() {
        this.apiKey = process.env.AISENSY_API_KEY || '';
        this.campaignName = process.env.AISENSY_CAMPAIGN_NAME || 'instyle-bookings';

        if (!this.apiKey) {
            console.warn('AISENSY_API_KEY not configured');
        }

        this.client = axios.create({
            baseURL: 'https://backend.aisensy.com/campaign/t1/api/v2',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });
    }

    /**
     * Send a text message via WhatsApp
     */
    async sendMessage(message: WhatsAppMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }> {
        try {
            // Format phone number (remove + if present)
            const phone = message.phone.replace(/^\+/, '');

            const response = await this.client.post('/send-message', {
                apiKey: this.apiKey,
                campaignName: this.campaignName,
                destination: phone,
                userName: 'Instyle Hair Boutique',
                message: message.message,
                media: message.mediaUrl
                    ? {
                        url: message.mediaUrl,
                        filename: 'image.jpg',
                    }
                    : undefined,
            });

            if (response.data.status === 'success') {
                return {
                    success: true,
                    messageId: response.data.messageId,
                };
            }

            return {
                success: false,
                error: response.data.message || 'Unknown error',
            };
        } catch (error) {
            console.error('Send message error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send message',
            };
        }
    }

    /**
     * Send a template message (for automated notifications)
     */
    async sendTemplate(template: WhatsAppTemplate): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }> {
        try {
            const phone = template.phone.replace(/^\+/, '');

            const response = await this.client.post('/send-template', {
                apiKey: this.apiKey,
                campaignName: this.campaignName,
                destination: phone,
                userName: 'Instyle Hair Boutique',
                templateName: template.templateName,
                templateParams: Object.values(template.params),
            });

            if (response.data.status === 'success') {
                return {
                    success: true,
                    messageId: response.data.messageId,
                };
            }

            return {
                success: false,
                error: response.data.message || 'Unknown error',
            };
        } catch (error) {
            console.error('Send template error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send template',
            };
        }
    }

    /**
     * Handle incoming webhook from AISensy
     */
    async handleWebhook(payload: WebhookPayload): Promise<{
        success: boolean;
        response?: string;
        error?: string;
    }> {
        try {
            // Validate webhook payload
            if (!payload.data || !payload.data.from || !payload.data.message) {
                return {
                    success: false,
                    error: 'Invalid webhook payload',
                };
            }

            // Process the message (will be handled by agent router)
            return {
                success: true,
                response: 'Webhook received',
            };
        } catch (error) {
            console.error('Webhook handling error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Webhook processing failed',
            };
        }
    }

    /**
     * Get message delivery status
     */
    async getMessageStatus(messageId: string): Promise<MessageStatus | null> {
        try {
            const response = await this.client.get('/message-status', {
                params: {
                    apiKey: this.apiKey,
                    messageId,
                },
            });

            if (response.data.status === 'success') {
                return {
                    messageId,
                    status: response.data.data.status,
                    timestamp: response.data.data.timestamp,
                };
            }

            return null;
        } catch (error) {
            console.error('Get message status error:', error);
            return null;
        }
    }

    /**
     * Verify webhook signature (for security)
     */
    verifyWebhookSignature(
        payload: string,
        signature: string,
        secret: string
    ): boolean {
        try {
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(payload);
            const calculatedSignature = hmac.digest('hex');

            return calculatedSignature === signature;
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }
}

// Message Templates
export const WhatsAppTemplates = {
    /**
     * Booking confirmation template
     */
    bookingConfirmation: (params: {
        customerName: string;
        serviceName: string;
        date: string;
        time: string;
        price: string;
    }) => ({
        templateName: 'booking_confirmation',
        params: {
            '1': params.customerName,
            '2': params.serviceName,
            '3': params.date,
            '4': params.time,
            '5': params.price,
        },
    }),

    /**
     * 24-hour reminder template
     */
    reminder24h: (params: {
        customerName: string;
        serviceName: string;
        date: string;
        time: string;
    }) => ({
        templateName: 'reminder_24h',
        params: {
            '1': params.customerName,
            '2': params.serviceName,
            '3': params.date,
            '4': params.time,
        },
    }),

    /**
     * 2-hour reminder template
     */
    reminder2h: (params: {
        customerName: string;
        serviceName: string;
        time: string;
    }) => ({
        templateName: 'reminder_2h',
        params: {
            '1': params.customerName,
            '2': params.serviceName,
            '3': params.time,
        },
    }),

    /**
     * Cancellation confirmation template
     */
    cancellationConfirmation: (params: {
        customerName: string;
        serviceName: string;
        date: string;
    }) => ({
        templateName: 'cancellation_confirmation',
        params: {
            '1': params.customerName,
            '2': params.serviceName,
            '3': params.date,
        },
    }),

    /**
     * Rescheduling confirmation template
     */
    reschedulingConfirmation: (params: {
        customerName: string;
        serviceName: string;
        oldDate: string;
        newDate: string;
        newTime: string;
    }) => ({
        templateName: 'rescheduling_confirmation',
        params: {
            '1': params.customerName,
            '2': params.serviceName,
            '3': params.oldDate,
            '4': params.newDate,
            '5': params.newTime,
        },
    }),
};

// Export singleton instance
export const whatsappClient = new AISensyClient();
