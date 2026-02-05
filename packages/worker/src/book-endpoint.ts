// packages/worker/src/book-endpoint.ts

import { ApiError } from './errors';
import { logger } from './logger';
import type { BookingRequest } from './types';

export async function handleBookEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const bodyData = await request.json();
    const body = bodyData as BookingRequest;
    const { tenantId, name, email, phone, serviceId, scheduledTime, notes } = body;

    // Validate required fields
    if (!tenantId || !name || !email || !phone || !serviceId || !scheduledTime) {
        throw new ApiError(400, 'Missing required fields');
    }

    const now = Math.floor(Date.now() / 1000);
    let userId = crypto.randomUUID();

    try {
        // 1. Check if user exists (by email) or create new
        const existingUser = await env.DB.prepare(
            'SELECT id FROM users WHERE tenant_id = ? AND email = ?'
        ).bind(tenantId, email).first();

        if (existingUser) {
            userId = existingUser.id;
            // Optional: Update phone/name if changed? keeping simple for now
        } else {
            // Create new user
            await env.DB.prepare(`
                INSERT INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(userId, tenantId, name, email, phone, now, now).run();
        }

        // 2. Create appointment
        const bookingId = crypto.randomUUID();

        // Convert ISO time to unix timestamp if needed, or store as is if schema allows
        // Schema says scheduled_time is INTEGER (unix timestamp)
        const scheduledTimestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);

        await env.DB.prepare(`
            INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, notes, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        `).bind(
            bookingId,
            tenantId,
            userId,
            serviceId,
            scheduledTimestamp,
            notes || '',
            now,
            now
        ).run();

        return new Response(JSON.stringify({
            success: true,
            bookingId,
            message: 'Booking created successfully'
        }), {
            headers: corsHeaders
        });

    } catch (err) {
        logger.error('Booking error', { error: err });
        throw new ApiError(500, 'Failed to create booking', err);
    }
}
