/**
 * Input Sanitization Module
 * Provides utilities for sanitizing user input to prevent XSS and injection attacks
 */

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripScripts?: boolean;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string, options?: SanitizationOptions): string {
  // Stub implementation - basic HTML escaping
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  // Stub implementation
  return input.trim();
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  // Stub implementation
  return email.toLowerCase().trim();
}

/**
 * Sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  // Stub implementation - remove non-numeric characters
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  // Stub implementation
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  // Stub implementation
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}
