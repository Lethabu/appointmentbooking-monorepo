/**
 * Scheduling Engine with Conflict Resolution
 * Smart appointment scheduling with double-booking prevention
 */

export interface TenantConfig {
    businessHoursConfig: {
        businessHours: {
            [key: string]: { open: string; close: string; closed?: boolean };
        };
        publicHolidays: string[];
    };
    timezone: string;
    bufferTime: number;
    maxAdvanceBookingDays: number;
    minBookingNotice: number; // in minutes
    cancellationPolicy: {
        advanceNotice: number; // in hours
        feePercentage: number;
    };
}

export interface StaffMember {
    id: string;
    name: string;
    specialties: string[];
    workingHours: {
        [key: string]: { open: string; close: string; closed?: boolean };
    };
    unavailableDates: string[];
    appointments: AppointmentSlot[];
}

export interface ServiceInfo {
    id: string;
    name: string;
    duration: number; // in minutes
    bufferTime?: number;
    requiresSpecialist?: boolean;
    specialtiesRequired?: string[];
}

export interface AppointmentSlot {
    startTime: Date;
    endTime: Date;
    serviceId: string;
}

export interface BookingRequest {
    serviceId: string;
    serviceDuration: number;
    requestedDate: string;
    requestedTime: string;
    staffId?: string;
    customerId: string;
    tenantId: string;
    timezone: string;
    bufferTime?: number;
}

export interface AvailabilityCheck {
    isAvailable: boolean;
    conflicts?: AppointmentSlot[];
    suggestedSlots?: TimeSlot[];
    reason?: string;
}

export interface TimeSlot {
    start: string;
    end: string;
    employeeId?: string;
    employeeName?: string;
}

export class SchedulingEngine {
    constructor(
        private config: TenantConfig,
        private staffMembers: StaffMember[],
        private services: ServiceInfo[]
    ) { }

    /**
     * Check if a requested time slot is available
     */
    async checkAvailability(request: BookingRequest): Promise<AvailabilityCheck> {
        const { requestedDate, requestedTime, staffId, serviceDuration, bufferTime } = request;

        // Check if date is within booking window
        const requestDate = new Date(`${requestedDate}T${requestedTime}`);
        const now = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + this.config.maxAdvanceBookingDays);

        if (requestDate < now) {
            return {
                isAvailable: false,
                reason: 'Cannot book appointments in the past',
            };
        }

        if (requestDate > maxDate) {
            return {
                isAvailable: false,
                reason: `Cannot book more than ${this.config.maxAdvanceBookingDays} days in advance`,
            };
        }

        // Check minimum booking notice
        const minutesUntilAppointment = (requestDate.getTime() - now.getTime()) / (1000 * 60);
        if (minutesUntilAppointment < this.config.minBookingNotice) {
            return {
                isAvailable: false,
                reason: `Appointments must be booked at least ${this.config.minBookingNotice} minutes in advance`,
            };
        }

        // Check if it's a public holiday
        if (this.config.businessHoursConfig.publicHolidays.includes(requestedDate)) {
            return {
                isAvailable: false,
                reason: 'This date is a public holiday',
            };
        }

        // Check business hours
        const dayOfWeek = this.getDayOfWeek(requestDate);
        const businessHours = this.config.businessHoursConfig.businessHours[dayOfWeek];

        if (businessHours?.closed) {
            return {
                isAvailable: false,
                reason: 'Business is closed on this day',
            };
        }

        if (!this.isWithinBusinessHours(requestedTime, serviceDuration, businessHours)) {
            return {
                isAvailable: false,
                reason: 'Requested time is outside business hours',
            };
        }

        // Check staff availability
        const staff = staffId
            ? this.staffMembers.find(s => s.id === staffId)
            : this.findAvailableStaff(request);

        if (!staff) {
            const suggestedSlots = await this.getSuggestedSlots(request);
            return {
                isAvailable: false,
                reason: 'No staff member available for this time',
                suggestedSlots,
            };
        }

        // Check staff working hours
        const staffHours = staff.workingHours[dayOfWeek];
        if (staffHours?.closed) {
            return {
                isAvailable: false,
                reason: `${staff.name} is not working on this day`,
            };
        }

        if (!this.isWithinBusinessHours(requestedTime, serviceDuration, staffHours)) {
            return {
                isAvailable: false,
                reason: `Requested time is outside ${staff.name}'s working hours`,
            };
        }

        // Check for unavailable dates
        if (staff.unavailableDates.includes(requestedDate)) {
            return {
                isAvailable: false,
                reason: `${staff.name} is unavailable on this date`,
            };
        }

        // Check for conflicts with existing appointments
        const conflicts = this.findConflicts(
            staff,
            requestDate,
            serviceDuration,
            bufferTime || this.config.bufferTime
        );

        if (conflicts.length > 0) {
            const suggestedSlots = await this.getSuggestedSlots(request);
            return {
                isAvailable: false,
                conflicts,
                suggestedSlots,
                reason: 'Time slot conflicts with existing appointment',
            };
        }

        return {
            isAvailable: true,
        };
    }

    /**
     * Find conflicts with existing appointments
     */
    private findConflicts(
        staff: StaffMember,
        requestedStart: Date,
        duration: number,
        bufferTime: number
    ): AppointmentSlot[] {
        const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);
        const requestedEndWithBuffer = new Date(requestedEnd.getTime() + bufferTime * 60000);

        return staff.appointments.filter(apt => {
            const aptEndWithBuffer = new Date(apt.endTime.getTime() + bufferTime * 60000);

            // Check for overlap
            return (
                (requestedStart >= apt.startTime && requestedStart < aptEndWithBuffer) ||
                (requestedEndWithBuffer > apt.startTime && requestedEndWithBuffer <= aptEndWithBuffer) ||
                (requestedStart <= apt.startTime && requestedEndWithBuffer >= aptEndWithBuffer)
            );
        });
    }

    /**
     * Find staff member with required specialties
     */
    private findAvailableStaff(request: BookingRequest): StaffMember | undefined {
        const service = this.services.find(s => s.id === request.serviceId);

        if (!service) return undefined;

        // Filter staff by specialty requirements
        let eligibleStaff = this.staffMembers;

        if (service.requiresSpecialist && service.specialtiesRequired) {
            eligibleStaff = this.staffMembers.filter(staff =>
                service.specialtiesRequired!.some(specialty => staff.specialties.includes(specialty))
            );
        }

        // Find first available staff member
        const requestDate = new Date(`${request.requestedDate}T${request.requestedTime}`);

        for (const staff of eligibleStaff) {
            const conflicts = this.findConflicts(
                staff,
                requestDate,
                request.serviceDuration,
                request.bufferTime || this.config.bufferTime
            );

            if (conflicts.length === 0) {
                return staff;
            }
        }

        return undefined;
    }

    /**
     * Get suggested alternative time slots
     */
    private async getSuggestedSlots(request: BookingRequest, maxSuggestions = 5): Promise<TimeSlot[]> {
        const slots: TimeSlot[] = [];
        const requestDate = new Date(`${request.requestedDate}T00:00:00`);

        // Try next 7 days
        for (let dayOffset = 0; dayOffset < 7 && slots.length < maxSuggestions; dayOffset++) {
            const checkDate = new Date(requestDate);
            checkDate.setDate(checkDate.getDate() + dayOffset);

            const dateStr = checkDate.toISOString().split('T')[0];
            const dayOfWeek = this.getDayOfWeek(checkDate);
            const businessHours = this.config.businessHoursConfig.businessHours[dayOfWeek];

            if (businessHours?.closed) continue;

            // Generate time slots
            const timeSlots = this.generateTimeSlots(businessHours.open, businessHours.close);

            for (const timeSlot of timeSlots) {
                if (slots.length >= maxSuggestions) break;

                const checkRequest = { ...request, requestedDate: dateStr, requestedTime: timeSlot };
                const availability = this.checkAvailability(checkRequest);

                if ((await availability).isAvailable) {
                    const staff = this.findAvailableStaff(checkRequest);
                    slots.push({
                        start: `${dateStr}T${timeSlot}`,
                        end: `${dateStr}T${this.addMinutes(timeSlot, request.serviceDuration)}`,
                        employeeId: staff?.id,
                        employeeName: staff?.name,
                    });
                }
            }
        }

        return slots;
    }

    /**
     * Generate time slots for a given time range
     */
    private generateTimeSlots(start: string, end: string, interval = 30): string[] {
        const slots: string[] = [];
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute < endMinute)
        ) {
            slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);

            currentMinute += interval;
            if (currentMinute >= 60) {
                currentMinute -= 60;
                currentHour += 1;
            }
        }

        return slots;
    }

    /**
     * Check if time is within business hours
     */
    private isWithinBusinessHours(
        time: string,
        duration: number,
        hours: { open: string; close: string }
    ): boolean {
        const [reqHour, reqMinute] = time.split(':').map(Number);
        const [openHour, openMinute] = hours.open.split(':').map(Number);
        const [closeHour, closeMinute] = hours.close.split(':').map(Number);

        const requestMinutes = reqHour * 60 + reqMinute;
        const openMinutes = openHour * 60 + openMinute;
        const closeMinutes = closeHour * 60 + closeMinute;
        const endMinutes = requestMinutes + duration;

        return requestMinutes >= openMinutes && endMinutes <= closeMinutes;
    }

    /**
     * Get day of week as string
     */
    private getDayOfWeek(date: Date): string {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }

    /**
     * Add minutes to a time string
     */
    private addMinutes(time: string, minutes: number): string {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute + minutes;
        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = totalMinutes % 60;
        return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    }
}
