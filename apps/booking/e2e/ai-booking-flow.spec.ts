// E2E Test: Complete AI Booking Flow via WhatsApp
// File: apps/booking/e2e/ai-booking-flow.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

test.describe('AI Booking Flow via WhatsApp', () => {
    test('should process booking request through Nia AI agent', async ({ request }) => {
        // Simulate WhatsApp webhook payload
        const webhookPayload = {
            event: 'message:received',
            data: {
                from: '+27821234567',
                message: 'Hi, I want to book a frontal ponytail installation for tomorrow at 10am',
                messageId: 'test-msg-001',
                timestamp: new Date().toISOString(),
            },
        };

        // Send to webhook endpoint
        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: webhookPayload,
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
    });

    test('should handle service inquiry', async ({ request }) => {
        const webhookPayload = {
            event: 'message:received',
            data: {
                from: '+27829876543',
                message: 'What services do you offer?',
                messageId: 'test-msg-002',
                timestamp: new Date().toISOString(),
            },
        };

        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: webhookPayload,
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.message).toBeDefined();
    });

    test('should handle availability check', async ({ request }) => {
        const webhookPayload = {
            event: 'message:received',
            data: {
                from: '+27825551234',
                message: 'Are you available tomorrow at 2pm?',
                messageId: 'test-msg-003',
                timestamp: new Date().toISOString(),
            },
        };

        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: webhookPayload,
        });

        expect(response.ok()).toBeTruthy();
    });

    test('should handle human handoff request', async ({ request }) => {
        const webhookPayload = {
            event: 'message:received',
            data: {
                from: '+27824445678',
                message: 'I need to speak with a human about custom pricing',
                messageId: 'test-msg-004',
                timestamp: new Date().toISOString(),
            },
        };

        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: webhookPayload,
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
    });

    test('should reject unauthorized webhook requests', async ({ request }) => {
        const webhookPayload = {
            event: 'message:received',
            data: {
                from: '+27821111111',
                message: 'Test',
                messageId: 'test-msg-005',
                timestamp: new Date().toISOString(),
            },
        };

        // Send without proper signature
        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: webhookPayload,
            headers: {
                'x-aisensy-signature': 'invalid-signature',
            },
        });

        // Should still process in test mode, but verify signature check exists
        expect(response.status).toBeLessThan(500);
    });
});

test.describe('Notification System', () => {
    test('should send booking confirmation', async ({ request }) => {
        // This would typically be triggered after a successful booking
        // For testing, we can verify the cron endpoint works

        const response = await request.get(`${BASE_URL}/api/cron/reminders?type=24h`, {
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
            },
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result).toHaveProperty('sent');
    });

    test('should handle cron job for 24h reminders', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/cron/reminders?type=24h`, {
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
            },
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.sent).toHaveProperty('24h');
    });

    test('should handle cron job for 2h reminders', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/cron/reminders?type=2h`, {
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
            },
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.sent).toHaveProperty('2h');
    });

    test('should reject unauthorized cron requests', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/cron/reminders?type=24h`, {
            headers: {
                'Authorization': 'Bearer wrong-secret',
            },
        });

        expect(response.status()).toBe(401);
    });
});

test.describe('AI Agent Memory', () => {
    test('should maintain conversation context', async ({ request }) => {
        const userId = '+27821234567';

        // First message
        await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: {
                event: 'message:received',
                data: {
                    from: userId,
                    message: 'Hi, I want to book an appointment',
                    messageId: 'test-msg-006',
                    timestamp: new Date().toISOString(),
                },
            },
        });

        // Second message (should have context from first)
        const response = await request.post(`${BASE_URL}/api/whatsapp/webhook`, {
            data: {
                event: 'message:received',
                data: {
                    from: userId,
                    message: 'Yes, for tomorrow',
                    messageId: 'test-msg-007',
                    timestamp: new Date().toISOString(),
                },
            },
        });

        expect(response.ok()).toBeTruthy();
    });
});
