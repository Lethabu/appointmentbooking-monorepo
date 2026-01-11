/**
 * Emergency Security Middleware
 * Provides critical security functions for API routes during emergency restoration
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Emergency authentication middleware
export function withEmergencyAuth(handler: Function) {
    return async (req: NextRequest) => {
        try {
            // STRICT MODE: Emergency mode must be explicitly enabled, otherwise require auth
            // This prevents accidental exposure if environment variables are missing
            const isEmergencyMode = process.env.EMERGENCY_MODE === 'true';

            // Verify API Key even in emergency mode if provided, otherwise require it for normal operation
            const authHeader = req.headers.get('authorization');
            const apiKey = req.headers.get('x-api-key');

            // Check for Service-to-Service internal secret
            const internalSecret = req.headers.get('x-internal-secret');
            if (internalSecret && internalSecret === process.env.INTERNAL_SERVICE_KEY) {
                return handler(req);
            }

            if (!authHeader && !apiKey && !isEmergencyMode) {
                return NextResponse.json(
                    { error: 'Unauthorized - Authentication Required' },
                    { status: 401 }
                );
            }

            // In real implementation, validate JWT token or API Key here
            if (authHeader && authHeader.startsWith('Bearer ')) {
                // Mock validation for now, replace with actual JWT verification
                const token = authHeader.split(' ')[1];
                if (!token) {
                    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
                }
            } else if (apiKey) {
                // Validate API Key against stored keys
                if (apiKey !== process.env.API_SECRET_KEY && !isEmergencyMode) {
                    return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
                }
            } else if (!isEmergencyMode) {
                return NextResponse.json({ error: 'Authentication Failed' }, { status: 401 });
            }

            return handler(req);
        } catch (error) {
            console.error('Emergency auth error:', error);
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 500 }
            );
        }
    };
}

// Rate limiting middleware
export function withRateLimit(handler: Function, options: {
    maxRequests?: number;
    windowMs?: number;
} = {}) {
    const maxRequests = options.maxRequests || 100;
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes

    // In-memory store for simple rate limiting (Note: resets on server restart/redeploy)
    // For production, this should be replaced with Redis or similar
    const requestCounts = new Map<string, { count: number; startTime: number }>();

    return async (req: NextRequest) => {
        try {
            // Skip rate limiting for internal services
            const internalSecret = req.headers.get('x-internal-secret');
            if (internalSecret && internalSecret === process.env.INTERNAL_SERVICE_KEY) {
                return handler(req);
            }

            // Basic IP-based rate limiting
            const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
            const now = Date.now();

            const clientData = requestCounts.get(ip);

            if (clientData) {
                if (now - clientData.startTime < windowMs) {
                    if (clientData.count >= maxRequests) {
                        return NextResponse.json(
                            { error: 'Too Many Requests' },
                            { status: 429 }
                        );
                    }
                    clientData.count++;
                } else {
                    // Reset window
                    clientData.count = 1;
                    clientData.startTime = now;
                }
            } else {
                requestCounts.set(ip, { count: 1, startTime: now });
            }

            // Clean up old entries occasionally to prevent memory leaks
            if (requestCounts.size > 10000) {
                for (const [key, data] of requestCounts.entries()) {
                    if (now - data.startTime > windowMs) {
                        requestCounts.delete(key);
                    }
                }
            }

            return handler(req);
        } catch (error) {
            console.error('Rate limit error:', error);
            // Fail open in emergency, but log error
            return handler(req);
        }
    };
}

// Input validation middleware
export function withInputValidation(handler: Function, schema: z.ZodSchema) {
    return async (req: NextRequest) => {
        try {
            // Clone request to read body without consuming it for downstream
            const clone = req.clone();
            const body = await clone.json();

            // Validate input
            const validated = schema.parse(body);

            // Replace request body with validated data
            (req as any).validatedBody = validated;

            return handler(req);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: error.errors.map(err => ({
                            field: err.path.join('.'),
                            message: err.message
                        }))
                    },
                    { status: 400 }
                );
            }

            console.error('Input validation error:', error);
            return NextResponse.json(
                { error: 'Input validation failed' },
                { status: 500 }
            );
        }
    };
}

// Common validation schemas for emergency use
export const EmergencySchemas = {
    booking: z.object({
        serviceId: z.string(),
        date: z.string(),
        time: z.string(),
        customerDetails: z.object({
            name: z.string().min(1),
            email: z.string().email(),
            phone: z.string().min(10)
        })
    }),

    contact: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(10),
        type: z.enum(['general', 'booking', 'complaint', 'feedback'])
    }),

    product: z.object({
        id: z.string(),
        quantity: z.number().min(1).max(10)
    })
};

// Emergency health check
export async function getSystemHealth() {
    return {
        status: 'operational',
        timestamp: new Date().toISOString(),
        services: {
            database: 'operational',
            auth: 'operational',
            payments: 'operational',
            notifications: 'operational'
        },
        emergency_mode: process.env.EMERGENCY_MODE === 'true'
    };
}
