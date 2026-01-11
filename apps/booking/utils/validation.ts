import { z } from 'zod';

/**
 * Booking Validation Schemas
 * Production-ready validation for appointment booking system
 */

// Customer information schema
export const customerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    notes: z.string().optional(),
});

// Create booking request schema
export const createBookingRequestSchema = z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    staffId: z.string().min(1, 'Staff ID is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    customer: customerSchema,
    notes: z.string().optional(),
    timezone: z.string().optional().default('Africa/Johannesburg'),
});

// Update booking request schema (partial updates)
export const updateBookingRequestSchema = z.object({
    serviceId: z.string().optional(),
    staffId: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
    notes: z.string().optional(),
    version: z.number().optional(), // For optimistic locking
});

// Booking response schema
export const bookingResponseSchema = z.object({
    id: z.string(),
    serviceId: z.string(),
    staffId: z.string(),
    customerId: z.string(),
    date: z.string(),
    time: z.string(),
    duration: z.number(),
    status: z.string(),
    totalPrice: z.number(),
    depositAmount: z.number(),
    notes: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Availability request schema
export const availabilityRequestSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    serviceId: z.string().min(1, 'Service ID is required'),
    employeeId: z.string().optional(),
    timezone: z.string().optional().default('Africa/Johannesburg'),
});

// Time slot schema
export const timeSlotSchema = z.object({
    start: z.string(),
    end: z.string(),
    available: z.boolean(),
    employeeId: z.string().optional(),
    employeeName: z.string().optional(),
});

// Validation helper functions
export function validateBookingData(data: unknown) {
    return createBookingRequestSchema.safeParse(data);
}

export function validateUpdateBookingData(data: unknown) {
    return updateBookingRequestSchema.safeParse(data);
}

export function validateAvailabilityRequest(data: unknown) {
    return availabilityRequestSchema.safeParse(data);
}

// Types derived from schemas
export type CustomerData = z.infer<typeof customerSchema>;
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
export type UpdateBookingRequest = z.infer<typeof updateBookingRequestSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type AvailabilityRequest = z.infer<typeof availabilityRequestSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
