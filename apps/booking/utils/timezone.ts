/**
 * Timezone Management Utilities
 * Handles timezone conversions, DST adjustments, and local display
 */

/**
 * Convert a date and time from a specific timezone to UTC
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:MM format
 * @param timezone - IANA timezone identifier (e.g., 'Africa/Johannesburg')
 * @returns Date object in UTC
 */
export function toUTC(date: string, time: string, timezone: string): Date {
    const dateTimeString = `${date}T${time}:00`;

    // Create a date in the specified timezone
    // Note: This approach works for modern browsers with Intl support
    const localDate = new Date(dateTimeString);

    // Get the offset for the timezone
    const offset = getTimezoneOffset(dateTimeString, timezone);

    // Adjust for timezone offset
    const utcDate = new Date(localDate.getTime() - offset);

    return utcDate;
}

/**
 * Convert a UTC date to a specific timezone
 * @param utcDate - Date object in UTC
 * @param timezone - IANA timezone identifier
 * @returns Object with date and time strings in the target timezone
 */
export function fromUTC(utcDate: Date, timezone: string): { date: string; time: string } {
    // Format the date in the target timezone
    const formatter = new Intl.DateTimeFormat('en-ZA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const dateObj: Record<string, string> = {};
    parts.forEach(({ type, value }) => {
        dateObj[type] = value;
    });

    const date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    const time = `${dateObj.hour}:${dateObj.minute}`;

    return { date, time };
}

/**
 * Get the timezone offset in milliseconds for a specific date/time in a timezone
 * Handles DST transitions automatically
 */
function getTimezoneOffset(dateTimeString: string, timezone: string): number {
    const date = new Date(dateTimeString);

    // Get the time in UTC
    const utcTime = date.getTime();

    // Format the date in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const formatted = formatter.format(date);
    const tzDate = new Date(formatted);

    // Calculate the offset
    return utcTime - tzDate.getTime();
}

/**
 * Format a date for display in a specific timezone
 * @param date - Date object
 * @param timezone - IANA timezone identifier
 * @param format - Display format ('short', 'long', 'full')
 * @returns Formatted date string
 */
export function formatDateInTimezone(
    date: Date,
    timezone: string,
    format: 'short' | 'long' | 'full' = 'short'
): string {
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
    };

    switch (format) {
        case 'short':
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
            break;
        case 'long':
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            options.weekday = 'long';
            break;
        case 'full':
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            options.weekday = 'long';
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.timeZoneName = 'short';
            break;
    }

    return new Intl.DateTimeFormat('en-ZA', options).format(date);
}

/**
 * Check if a timezone observes DST for a given date
 * @param timezone - IANA timezone identifier
 * @param date - Date to check
 * @returns Boolean indicating if DST is active
 */
export function isDST(timezone: string, date: Date): boolean {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);

    const janOffset = getTimezoneOffset(jan.toISOString(), timezone);
    const julOffset = getTimezoneOffset(jul.toISOString(), timezone);
    const dateOffset = getTimezoneOffset(date.toISOString(), timezone);

    return dateOffset !== Math.max(janOffset, julOffset);
}

/**
 * Validate if a timezone identifier is valid
 * @param timezone - IANA timezone identifier to validate
 * @returns Boolean indicating if the timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: timezone });
        return true;
    } catch {
        return false;
    }
}

/**
 * Get the current time in a specific timezone
 * @param timezone - IANA timezone identifier
 * @returns Object with date and time strings
 */
export function getCurrentTimeInTimezone(timezone: string): { date: string; time: string } {
    return fromUTC(new Date(), timezone);
}

/**
 * Calculate business hours in a specific timezone
 * @param businessHours - Business hours in format { open: 'HH:MM', close: 'HH:MM' }
 * @param timezone - IANA timezone identifier
 * @param date - Date to calculate for
 * @returns Array of time slots in 30-minute intervals
 */
export function calculateBusinessHoursSlots(
    businessHours: { open: string; close: string },
    timezone: string,
    date: string
): string[] {
    const slots: string[] = [];

    const [openHour, openMinute] = businessHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = businessHours.close.split(':').map(Number);

    let currentHour = openHour;
    let currentMinute = openMinute;

    while (
        currentHour < closeHour ||
        (currentHour === closeHour && currentMinute < closeMinute)
    ) {
        const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        slots.push(timeSlot);

        // Increment by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
            currentMinute -= 60;
            currentHour += 1;
        }
    }

    return slots;
}

/**
 * TimezoneManager class for managing timezone operations
 */
export class TimezoneManager {
    constructor(private defaultTimezone: string = 'Africa/Johannesburg') {
        if (!isValidTimezone(defaultTimezone)) {
            throw new Error(`Invalid timezone: ${defaultTimezone}`);
        }
    }

    /**
     * Convert appointment time to UTC for storage
     */
    toUTC(date: string, time: string, timezone?: string): Date {
        return toUTC(date, time, timezone || this.defaultTimezone);
    }

    /**
     * Convert UTC appointment time to local display
     */
    fromUTC(utcDate: Date, timezone?: string): { date: string; time: string } {
        return fromUTC(utcDate, timezone || this.defaultTimezone);
    }

    /**
     * Format date for display
     */
    format(date: Date, format?: 'short' | 'long' | 'full', timezone?: string): string {
        return formatDateInTimezone(date, timezone || this.defaultTimezone, format);
    }

    /**
     * Get current time in managed timezone
     */
    now(): { date: string; time: string } {
        return getCurrentTimeInTimezone(this.defaultTimezone);
    }
}
