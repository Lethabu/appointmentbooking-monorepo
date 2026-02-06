/**
 * Validation Schemas Module
 * Provides Zod schemas for input validation
 */

import { z } from 'zod';

// User validation schemas
export const userEmailSchema = z.string().email();
export const userNameSchema = z.string().min(2).max(100);
export const userPhoneSchema = z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/);

export const userRegistrationSchema = z.object({
  email: userEmailSchema,
  name: userNameSchema,
  phone: userPhoneSchema.optional(),
  password: z.string().min(8).max(100),
});

export const userLoginSchema = z.object({
  email: userEmailSchema,
  password: z.string().min(1),
});

// Booking validation schemas
export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  date: z.string().datetime(),
  customerId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

// Tenant validation schemas
export const tenantSchema = z.object({
  name: z.string().min(2).max(200),
  email: userEmailSchema,
  phone: userPhoneSchema.optional(),
  domain: z.string().optional(),
});

// Service validation schemas
export const serviceSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  duration: z.number().int().positive(),
  price: z.number().positive(),
  categoryId: z.string().uuid().optional(),
});

// Staff validation schemas
export const staffSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  phone: userPhoneSchema.optional(),
  role: z.enum(['admin', 'staff', 'manager']),
});

// Payment validation schemas
export const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  method: z.enum(['card', 'cash', 'transfer', 'other']),
  bookingId: z.string().uuid(),
});

// Generic ID validation
export const uuidSchema = z.string().uuid();
export const idSchema = z.union([uuidSchema, z.string().min(1)]);

// API request validation helpers
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

export type ValidationResult<T> = ReturnType<typeof validateRequest<T>>;
