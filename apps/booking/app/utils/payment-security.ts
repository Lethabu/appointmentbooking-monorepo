/**
 * Payment Security Utilities (PCI-DSS Compliance)
 * Ensures secure handling of payment data and sensitive information
 */

import { z } from 'zod';

// ============================================================================
// PCI-DSS Constants
// ============================================================================

// Masks for sensitive data logging
const CREDIT_CARD_MASK = /\b(?:\d[ -]*?){13,16}\b/g;
const CVV_MASK = /\b\d{3,4}\b/g;
const EMAIL_MASK = /(^.{2})[^@]+(@.+$)/;

/**
 * Sanitizes logs to remove sensitive PCI data
 * NEVER log full credit card numbers or CVVs
 */
export function sanitizeLogData(data: any): any {
    if (typeof data === 'string') {
        return data
            .replace(CREDIT_CARD_MASK, '************####')
            .replace(CVV_MASK, '***');
    }

    if (typeof data === 'object' && data !== null) {
        const sanitized: any = Array.isArray(data) ? [] : {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Redact specific sensitive keys immediately
                if (['cvv', 'cvc', 'password', 'token', 'secret', 'creditCard', 'cardNumber'].includes(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = sanitizeLogData(data[key]);
                }
            }
        }
        return sanitized;
    }

    return data;
}

/**
 * Validates that no sensitive card data is passing through our server
 * We should only handle tokens, never raw PANs (Primary Account Numbers)
 */
export const PaymentTokenSchema = z.object({
    id: z.string().startsWith('tok_').or(z.string().startsWith('pm_')), // Stripe token format
    amount: z.number().positive(),
    currency: z.string().length(3),
    description: z.string().optional(),
});

/**
 * Verifies the integrity of a payment request
 * Ensures amounts match expected values and currency is correct
 */
export function verifyPaymentIntegrity(
    requestAmount: number,
    expectedAmount: number,
    currency: string
): boolean {
    // Allow for small floating point differences if needed, but strict equality is better for currency
    const epsilon = 0.01;
    if (Math.abs(requestAmount - expectedAmount) > epsilon) {
        console.error(`Payment integrity failure: Expected ${expectedAmount}, got ${requestAmount}`);
        return false;
    }

    if (currency.toUpperCase() !== 'ZAR') { // Enforce ZAR for this region
        console.error(`Payment currency failure: Expected ZAR, got ${currency}`);
        return false;
    }

    return true;
}

/**
 * Generates a secure idempotency key for payment requests
 * Prevents double-charging on network retries
 */
export function generateIdempotencyKey(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// ============================================================================
// Security Headers for Payment Pages
// ============================================================================

export const PaymentSecurityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://js.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;",
    'Permissions-Policy': 'payment=(self "https://js.stripe.com")',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};
