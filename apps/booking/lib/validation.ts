import { z } from 'zod';

// Common validation schemas
export const phoneNumberSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits');

export const emailSchema = z.string()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const timeSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)');

export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');

// Booking-related schemas
export const customerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema.optional(),
  phone: phoneNumberSchema,
  dateOfBirth: dateSchema.optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  preferences: z.object({
    preferredStylist: z.string().optional(),
    preferredTime: timeSchema.optional(),
    specialRequests: z.string().max(200, 'Special requests must be less than 200 characters').optional()
  }).optional()
});

export const serviceSchema = z.object({
  id: z.string().min(1, 'Service ID is required'),
  name: z.string().min(1, 'Service name is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration must be less than 8 hours'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
  bufferTime: z.number().min(0, 'Buffer time must be positive').default(15),
  requiresSpecialist: z.boolean().default(false),
  specialtiesRequired: z.array(z.string()).optional()
});

export const appointmentSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().optional(),
  serviceId: z.string().min(1, 'Service ID is required'),
  staffId: z.string().optional(),
  date: dateSchema,
  time: timeSchema,
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).default('pending'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  depositAmount: z.number().min(0, 'Deposit amount must be positive').optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']).default('pending'),
  reminderSent: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const availabilitySlotSchema = z.object({
  start: z.date(),
  end: z.date(),
  isAvailable: z.boolean(),
  staffIds: z.array(z.string()),
  bufferTime: z.number().optional(),
  serviceIds: z.array(z.string()).optional()
});

export const staffMemberSchema = z.object({
  id: z.string(),
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneNumberSchema.optional(),
  role: z.enum(['stylist', 'therapist', 'consultant', 'specialist', 'receptionist']),
  specialties: z.array(z.string()),
  workingHours: z.object({
    monday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    tuesday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    wednesday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    thursday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    friday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    saturday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional(),
    sunday: z.object({ open: timeSchema, close: timeSchema, closed: z.boolean().optional() }).optional()
  }),
  unavailableDates: z.array(dateSchema),
  isActive: z.boolean().default(true),
  maxAdvanceBooking: z.number().min(1).max(365).default(90),
  minBookingNotice: z.number().min(0).max(1440).default(60) // minutes
});

// API Request/Response schemas
export const createBookingRequestSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  staffId: z.string().optional(),
  date: dateSchema,
  time: timeSchema,
  customer: customerSchema,
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  paymentMethod: z.enum(['deposit', 'full', 'none']).default('deposit'),
  specialRequests: z.string().max(200, 'Special requests must be less than 200 characters').optional()
});

export const updateBookingRequestSchema = z.object({
  date: dateSchema.optional(),
  time: timeSchema.optional(),
  staffId: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']).optional()
});

export const checkAvailabilityRequestSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  date: dateSchema,
  staffId: z.string().optional(),
  duration: z.number().optional()
});

export const getAvailabilityRequestSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  timezone: z.string().default('Africa/Johannesburg')
});

// Response schemas
export const bookingResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    appointment: appointmentSchema,
    customer: customerSchema.optional(),
    service: serviceSchema.optional()
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export const availabilityResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    slots: z.array(availabilitySlotSchema),
    date: dateSchema,
    timezone: z.string()
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export const staffListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(staffMemberSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export const serviceListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(serviceSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(z.any()),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Analytics schemas
export const analyticsRequestSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  metrics: z.array(z.enum(['bookings', 'revenue', 'cancellation_rate', 'no_show_rate', 'average_booking_value'])).optional(),
  groupBy: z.enum(['day', 'week', 'month', 'service', 'staff']).optional(),
  staffId: z.string().optional(),
  serviceId: z.string().optional()
});

export const analyticsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: z.object({
      totalBookings: z.number(),
      totalRevenue: z.number(),
      cancellationRate: z.number(),
      noShowRate: z.number(),
      averageBookingValue: z.number()
    }),
    trends: z.array(z.object({
      date: z.string(),
      value: z.number(),
      metric: z.string()
    })).optional(),
    breakdown: z.array(z.object({
      label: z.string(),
      value: z.number(),
      percentage: z.number()
    })).optional()
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Notification schemas
export const notificationRequestSchema = z.object({
  type: z.enum(['booking_confirmation', 'reminder', 'cancellation', 'reschedule', 'follow_up']),
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  customerId: z.string().optional(),
  method: z.enum(['email', 'sms', 'whatsapp', 'push']),
  scheduledFor: z.date().optional(),
  customMessage: z.string().max(500, 'Custom message must be less than 500 characters').optional()
});

export const notificationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    type: z.string(),
    status: z.string(),
    scheduledFor: z.date().optional(),
    sentAt: z.date().optional()
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Error handling schemas
export const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.date().default(() => new Date())
});

// Validation helper functions
export const validateBookingData = (data: unknown) => {
  return createBookingRequestSchema.safeParse(data);
};

export const validateUpdateBookingData = (data: unknown) => {
  return updateBookingRequestSchema.safeParse(data);
};

export const validateAvailabilityCheck = (data: unknown) => {
  return checkAvailabilityRequestSchema.safeParse(data);
};

export const validateCustomerData = (data: unknown) => {
  return customerSchema.safeParse(data);
};

export const validateServiceData = (data: unknown) => {
  return serviceSchema.safeParse(data);
};

export const validateStaffData = (data: unknown) => {
  return staffMemberSchema.safeParse(data);
};

// Type exports for TypeScript
export type Customer = z.infer<typeof customerSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;
export type StaffMember = z.infer<typeof staffMemberSchema>;
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
export type UpdateBookingRequest = z.infer<typeof updateBookingRequestSchema>;
export type CheckAvailabilityRequest = z.infer<typeof checkAvailabilityRequestSchema>;
export type NotificationRequest = z.infer<typeof notificationRequestSchema>;
export type AnalyticsRequest = z.infer<typeof analyticsRequestSchema>;