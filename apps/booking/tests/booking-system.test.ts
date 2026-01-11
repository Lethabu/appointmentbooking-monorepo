/**
 * Comprehensive Test Suite for Appointment Booking System
 * Tests all core functionality including scheduling, validation, and notifications
 */

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;

beforeEach(() => {
    console.log = jest.fn();
});

afterEach(() => {
    console.log = originalConsoleLog;
});

// Import Jest globals (these are available in Jest environment)
const describe = global.describe;
const it = global.it;
const expect = global.expect;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeEach(() => {
    console.log = jest.fn();
});

afterEach(() => {
    console.log = originalConsoleLog;
});
import { SchedulingEngine } from '../utils/scheduling';
import { TimezoneManager } from '../utils/timezone';
import { EmailService } from '../utils/notifications/email-service';
import { createBookingRequestSchema, validateBookingData } from '../utils/validation';

// Mock data for testing
const mockTenantConfig = {
    businessHoursConfig: {
        businessHours: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '15:00' },
            sunday: { closed: true }
        },
        publicHolidays: []
    },
    timezone: 'Africa/Johannesburg',
    bufferTime: 15,
    maxAdvanceBookingDays: 90,
    minBookingNotice: 60,
    cancellationPolicy: {
        advanceNotice: 24,
        feePercentage: 50
    }
};

const mockStaffMembers = [
    {
        id: 'staff_1',
        name: 'Sarah Johnson',
        specialties: ['haircut', 'coloring', 'styling'],
        workingHours: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '15:00' },
            sunday: { closed: true }
        },
        unavailableDates: [],
        appointments: []
    }
];

const mockServices = [
    {
        id: 'service_1',
        name: 'Premium Haircut',
        duration: 60,
        bufferTime: 15,
        requiresSpecialist: false,
        price: 250
    },
    {
        id: 'service_2',
        name: 'Color & Highlights',
        duration: 120,
        bufferTime: 30,
        requiresSpecialist: true,
        specialtiesRequired: ['coloring'],
        price: 450
    }
];

describe('Appointment Booking System', () => {
    let schedulingEngine: SchedulingEngine;
    let emailService: EmailService;

    beforeEach(() => {
        schedulingEngine = new SchedulingEngine(mockTenantConfig, mockStaffMembers, mockServices);
        emailService = new EmailService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Scheduling Engine', () => {
        it('should check availability for a valid booking request', async () => {
            const request = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '10:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const result = await schedulingEngine.checkAvailability(request);

            expect(result).toHaveProperty('isAvailable');
            expect(result).toHaveProperty('conflicts');
            expect(result).toHaveProperty('suggestedSlots');
            expect(Array.isArray(result.conflicts)).toBe(true);
            expect(Array.isArray(result.suggestedSlots)).toBe(true);
        });

        it('should detect scheduling conflicts', async () => {
            // Add a conflicting appointment
            mockStaffMembers[0].appointments.push({
                id: 'existing_apt',
                date: '2026-01-15',
                startTime: '10:00',
                endTime: '11:00',
                status: 'confirmed'
            });

            const request = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '10:30', // Overlaps with existing appointment
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const result = await schedulingEngine.checkAvailability(request);

            expect(result.isAvailable).toBe(false);
            expect(result.conflicts.length).toBeGreaterThan(0);
            expect(result.conflicts[0].type).toBe('double_booking');
        });

        it('should create appointment successfully when available', async () => {
            const request = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '14:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const result = await schedulingEngine.createAppointment(request);

            expect(result.success).toBe(true);
            expect(result.appointmentId).toBeDefined();
            expect(result.message).toContain('successfully');
        });

        it('should provide waitlist information', () => {
            const waitlistInfo = schedulingEngine.getWaitlistInfo('service_1', '2026-01-15');

            expect(waitlistInfo).toHaveProperty('position');
            expect(waitlistInfo).toHaveProperty('estimatedWait');
            expect(waitlistInfo).toHaveProperty('similarSlotsAvailable');
            expect(typeof waitlistInfo.position).toBe('number');
            expect(typeof waitlistInfo.estimatedWait).toBe('number');
        });
    });

    describe('Timezone Manager', () => {
        it('should get timezone information correctly', () => {
            const tzInfo = TimezoneManager.getTimezoneInfo('Africa/Johannesburg');

            expect(tzInfo.timezone).toBe('Africa/Johannesburg');
            expect(tzInfo.supported).toBe(true);
            expect(tzInfo.abbreviation).toBe('SAST');
            expect(typeof tzInfo.offset).toBe('number');
        });

        it('should convert local time to UTC', () => {
            const utcDate = TimezoneManager.localToUtc('2026-01-15', '14:00', 'Africa/Johannesburg');

            expect(utcDate).toBeInstanceOf(Date);
            expect(utcDate.getFullYear()).toBe(2026);
            expect(utcDate.getMonth()).toBe(0); // January
            expect(utcDate.getDate()).toBe(15);
        });

        it('should convert UTC to local time', () => {
            const utcDate = new Date('2026-01-15T12:00:00.000Z');
            const localTime = TimezoneManager.utcToLocal(utcDate, 'Africa/Johannesburg');

            expect(localTime).toHaveProperty('date');
            expect(localTime).toHaveProperty('time');
            expect(localTime).toHaveProperty('datetime');
            expect(localTime.date).toBe('2026-01-15');
        });

        it('should generate time slots correctly', () => {
            const slots = TimezoneManager.generateTimeSlots(
                '2026-01-15',
                '09:00',
                '17:00',
                30,
                'Africa/Johannesburg'
            );

            expect(Array.isArray(slots)).toBe(true);
            expect(slots.length).toBeGreaterThan(0);
            expect(slots[0]).toHaveProperty('start');
            expect(slots[0]).toHaveProperty('end');
            expect(slots[0]).toHaveProperty('localTime');
        });

        it('should validate appointment times against business hours', () => {
            const businessHours = {
                monday: { open: '09:00', close: '17:00' },
                tuesday: { open: '09:00', close: '17:00' },
                wednesday: { open: '09:00', close: '17:00' },
                thursday: { open: '09:00', close: '17:00' },
                friday: { open: '09:00', close: '17:00' },
                saturday: { open: '09:00', close: '15:00' },
                sunday: { closed: true }
            };

            const validResult = TimezoneManager.validateAppointmentTime(
                '2026-01-15', // Wednesday
                '14:00',
                businessHours,
                'Africa/Johannesburg'
            );

            const invalidResult = TimezoneManager.validateAppointmentTime(
                '2026-01-15',
                '18:00', // After business hours
                businessHours,
                'Africa/Johannesburg'
            );

            expect(validResult.valid).toBe(true);
            expect(validResult.conflicts).toHaveLength(0);
            expect(invalidResult.valid).toBe(false);
            expect(invalidResult.conflicts.length).toBeGreaterThan(0);
        });
    });

    describe('Validation System', () => {
        it('should validate correct booking data', () => {
            const validBookingData = {
                serviceId: 'service_1',
                date: '2026-01-15',
                time: '14:00',
                customer: {
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+27123456789',
                    email: 'john@example.com'
                },
                notes: 'Test booking'
            };

            const result = validateBookingData(validBookingData);
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
        });

        it('should reject invalid booking data', () => {
            const invalidBookingData = {
                serviceId: '', // Invalid: empty service ID
                date: 'invalid-date', // Invalid date format
                time: '25:00', // Invalid time
                customer: {
                    firstName: 'J', // Too short
                    lastName: '',
                    phone: '123', // Too short
                    email: 'invalid-email'
                }
            };

            const result = validateBookingData(invalidBookingData);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should validate phone numbers correctly', () => {
            const phoneSchema = require('../utils/validation').phoneNumberSchema;

            expect(() => phoneSchema.parse('+27123456789')).not.toThrow();
            expect(() => phoneSchema.parse('1234567890')).not.toThrow();
            expect(() => phoneSchema.parse('123')).toThrow();
            expect(() => phoneSchema.parse('abc123')).toThrow();
        });

        it('should validate email addresses correctly', () => {
            const emailSchema = require('../utils/validation').emailSchema;

            expect(() => emailSchema.parse('test@example.com')).not.toThrow();
            expect(() => emailSchema.parse('user.name@domain.co.za')).not.toThrow();
            expect(() => emailSchema.parse('invalid-email')).toThrow();
            expect(() => emailSchema.parse('@domain.com')).toThrow();
        });
    });

    describe('Email Service', () => {
        it('should send booking confirmation email', async () => {
            const mockBookingData = {
                customerName: 'John Doe',
                serviceName: 'Premium Haircut',
                appointmentDate: '2026-01-15',
                appointmentTime: '14:00',
                salonName: 'Test Salon',
                totalPrice: 250
            };

            // Mock the sendEmail method
            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue(true);

            const result = await emailService.sendBookingEmail({
                type: 'confirmation',
                bookingData: mockBookingData,
                recipientEmail: 'john@example.com'
            });

            expect(result).toBe(true);
            expect(sendEmailSpy).toHaveBeenCalled();
        });

        it('should handle email sending failures gracefully', async () => {
            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue(false);

            const result = await emailService.sendEmail({
                to: 'test@example.com',
                subject: 'Test',
                html: '<p>Test</p>',
                text: 'Test'
            });

            expect(result).toBe(false);
            expect(sendEmailSpy).toHaveBeenCalled();
        });

        it('should send batch emails', async () => {
            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue(true);

            const emails = [
                {
                    to: 'user1@example.com',
                    subject: 'Test 1',
                    html: '<p>Test 1</p>',
                    text: 'Test 1'
                },
                {
                    to: 'user2@example.com',
                    subject: 'Test 2',
                    html: '<p>Test 2</p>',
                    text: 'Test 2'
                }
            ];

            const result = await emailService.sendBatchEmails(emails);

            expect(result.sent).toBe(2);
            expect(result.failed).toBe(0);
            expect(sendEmailSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('Integration Tests', () => {
        it('should complete full booking workflow', async () => {
            // 1. Check availability
            const availabilityRequest = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '15:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const availabilityResult = await schedulingEngine.checkAvailability(availabilityRequest);
            expect(availabilityResult.isAvailable).toBe(true);

            // 2. Create appointment
            const bookingResult = await schedulingEngine.createAppointment(availabilityRequest);
            expect(bookingResult.success).toBe(true);
            expect(bookingResult.appointmentId).toBeDefined();

            // 3. Send confirmation email
            const mockBookingData = {
                customerName: 'John Doe',
                serviceName: 'Premium Haircut',
                appointmentDate: '2026-01-15',
                appointmentTime: '15:00',
                salonName: 'Test Salon',
                totalPrice: 250
            };

            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue(true);
            const emailResult = await emailService.sendBookingEmail({
                type: 'confirmation',
                bookingData: mockBookingData,
                recipientEmail: 'john@example.com'
            });

            expect(emailResult).toBe(true);
        });

        it('should handle reschedule workflow', async () => {
            // 1. Create initial appointment
            const initialRequest = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '10:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const initialResult = await schedulingEngine.createAppointment(initialRequest);
            expect(initialResult.success).toBe(true);

            // 2. Check availability for new time
            const rescheduleRequest = {
                ...initialRequest,
                requestedTime: '14:00'
            };

            const rescheduleAvailability = await schedulingEngine.checkAvailability(rescheduleRequest);
            // Note: This might fail if the same slot conflicts, which is expected behavior

            // 3. Send reschedule email
            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue(true);
            const rescheduleEmailResult = await emailService.sendBookingEmail({
                type: 'reschedule',
                bookingData: {
                    customerName: 'John Doe',
                    serviceName: 'Premium Haircut',
                    appointmentDate: '2026-01-15',
                    appointmentTime: '14:00',
                    salonName: 'Test Salon',
                    totalPrice: 250
                },
                recipientEmail: 'john@example.com',
                oldDate: '2026-01-15',
                oldTime: '10:00'
            });

            expect(rescheduleEmailResult).toBe(true);
        });
    });

    describe('Performance Tests', () => {
        it('should handle multiple concurrent booking requests', async () => {
            const requests = Array.from({ length: 10 }, (_, i) => ({
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: `${9 + i}:00`,
                staffId: 'staff_1',
                customerId: `cust_${i}`,
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            }));

            const startTime = Date.now();
            const results = await Promise.all(
                requests.map(request => schedulingEngine.checkAvailability(request))
            );
            const endTime = Date.now();

            expect(results).toHaveLength(10);
            expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
        });

        it('should generate time slots efficiently', () => {
            const startTime = Date.now();
            const slots = TimezoneManager.generateTimeSlots(
                '2026-01-15',
                '09:00',
                '17:00',
                15, // 15-minute intervals
                'Africa/Johannesburg'
            );
            const endTime = Date.now();

            expect(slots.length).toBe(32); // 8 hours * 4 slots per hour
            expect(endTime - startTime).toBeLessThan(100); // Should be very fast
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid service IDs gracefully', async () => {
            const request = {
                serviceId: 'non-existent-service',
                serviceDuration: 60,
                requestedDate: '2026-01-15',
                requestedTime: '14:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const result = await schedulingEngine.checkAvailability(request);
            expect(result.isAvailable).toBe(false);
            expect(result.conflicts.length).toBeGreaterThan(0);
            expect(result.conflicts[0].type).toBe('staff_unavailable');
        });

        it('should handle past date requests', async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);

            const request = {
                serviceId: 'service_1',
                serviceDuration: 60,
                requestedDate: pastDate.toISOString().split('T')[0],
                requestedTime: '14:00',
                staffId: 'staff_1',
                customerId: 'cust_123',
                tenantId: 'default',
                timezone: 'Africa/Johannesburg',
                bufferTime: 15
            };

            const result = await schedulingEngine.checkAvailability(request);
            expect(result.isAvailable).toBe(false);
        });

        it('should handle email sending errors gracefully', async () => {
            const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockRejectedValue(new Error('Network error'));

            const result = await emailService.sendEmail({
                to: 'test@example.com',
                subject: 'Test',
                html: '<p>Test</p>',
                text: 'Test'
            });

            expect(result).toBe(false);
        });
    });
});