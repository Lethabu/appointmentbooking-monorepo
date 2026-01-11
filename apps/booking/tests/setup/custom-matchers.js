/**
 * Custom Jest Matchers
 * Extended matchers for appointment booking system testing
 */

expect.extend({
    toBeValidDate(received) {
        const pass = received instanceof Date && !isNaN(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid date`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid date`,
                pass: false,
            };
        }
    },

    toBeValidEmail(received) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pass = emailRegex.test(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid email`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid email`,
                pass: false,
            };
        }
    },

    toBeValidPhoneNumber(received) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const pass = phoneRegex.test(received.replace(/[\s\-\(\)]/g, ''));
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid phone number`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid phone number`,
                pass: false,
            };
        }
    },

    toHaveValidAppointmentSlots(received) {
        const pass = Array.isArray(received) &&
            received.every(slot =>
                slot.start &&
                slot.end &&
                typeof slot.isAvailable === 'boolean'
            );
        if (pass) {
            return {
                message: () => `expected ${received} not to have valid appointment slots`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to have valid appointment slots`,
                pass: false,
            };
        }
    },

    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    }
});