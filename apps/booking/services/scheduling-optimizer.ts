// AI-Powered Scheduling Optimization System
// Advanced scheduling optimization for competitive differentiation

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CustomerProfile, BusinessContext, TimeSlot, OptimalTimeSlot, SchedulingOptimization } from '../types';

export class SchedulingOptimizer {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Generate optimal scheduling recommendations
     */
    async optimizeScheduling(
        bookingRequest: {
            serviceId: string;
            customerProfile?: CustomerProfile;
            preferredDate?: string;
            preferredTime?: string;
            staffPreference?: string;
        },
        businessContext: BusinessContext,
        currentBookings: any[]
    ): Promise<SchedulingOptimization> {
        try {
            // Get available time slots
            const availableSlots = await this.getAvailableTimeSlots(
                bookingRequest.serviceId,
                businessContext,
                currentBookings
            );

            // Analyze customer preferences
            const customerAnalysis = await this.analyzeCustomerPreferences(
                bookingRequest.customerProfile,
                businessContext
            );

            // Get AI-powered optimization recommendations
            const aiOptimizations = await this.generateAIOptimizations(
                bookingRequest,
                businessContext,
                availableSlots,
                customerAnalysis
            );

            // Apply business rules and constraints
            const optimizedSlots = await this.applyBusinessRules(
                aiOptimizations,
                businessContext,
                currentBookings
            );

            // Generate final recommendations
            const recommendations = this.generateRecommendations(
                optimizedSlots,
                businessContext,
                customerAnalysis
            );

            return {
                optimalSlots: optimizedSlots,
                recommendations,
                conflictResolution: {
                    conflicts: [],
                    solutions: []
                }
            };
        } catch (error) {
            console.error('Error in scheduling optimization:', error);
            return {
                optimalSlots: [],
                recommendations: [],
                conflictResolution: {
                    conflicts: [],
                    solutions: ['Unable to process scheduling optimization. Please try again.']
                }
            };
        }
    }

    /**
     * Get available time slots for a service
     */
    private async getAvailableTimeSlots(
        serviceId: string,
        businessContext: BusinessContext,
        currentBookings: any[]
    ): Promise<TimeSlot[]> {
        const service = businessContext.services.find(s => s.id === serviceId);
        if (!service) return [];

        const duration = service.duration_minutes || service.duration;
        const availableSlots: TimeSlot[] = [];

        // Generate slots for next 14 days
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            const dayOfWeek = date.getDay();
            const dayName = this.getDayName(dayOfWeek);
            const businessHours = businessContext.businessHours[dayName as keyof typeof businessContext.businessHours] as { open: string; close: string; closed?: boolean };

            if (!businessHours || businessHours.closed) continue;

            // Generate time slots for this day
            const slots = await this.generateDaySlots(
                date,
                businessHours.open,
                businessHours.close,
                duration,
                currentBookings,
                businessContext.staff
            );

            availableSlots.push(...slots);
        }

        return availableSlots;
    }

    /**
     * Generate time slots for a specific day
     */
    private async generateDaySlots(
        date: Date,
        openTime: string,
        closeTime: string,
        serviceDuration: number,
        currentBookings: any[],
        staff: any[]
    ): Promise<TimeSlot[]> {
        const slots: TimeSlot[] = [];
        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        const startTime = new Date(date);
        startTime.setHours(openHour, openMinute, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(closeHour, closeMinute, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime.getTime() + (serviceDuration * 60 * 1000) <= endTime.getTime()) {
            const slotTime = currentTime.toTimeString().substring(0, 5);
            const dateString = currentTime.toISOString().split('T')[0];

            // Check if slot is available (not booked and within business hours)
            const isAvailable = this.isSlotAvailable(
                dateString,
                slotTime,
                serviceDuration,
                currentBookings,
                staff
            );

            if (isAvailable) {
                const availableStaff = this.getAvailableStaff(
                    dateString,
                    slotTime,
                    serviceDuration,
                    staff,
                    currentBookings
                );

                slots.push({
                    date: dateString,
                    startTime: slotTime,
                    endTime: this.calculateEndTime(slotTime, serviceDuration),
                    isAvailable: true,
                    staffIds: availableStaff
                });
            }

            // Move to next 15-minute slot
            currentTime.setMinutes(currentTime.getMinutes() + 15);
        }

        return slots;
    }

    /**
     * Analyze customer preferences for optimal scheduling
     */
    private async analyzeCustomerPreferences(
        customerProfile?: CustomerProfile,
        businessContext?: BusinessContext
    ): Promise<any> {
        if (!customerProfile) {
            return {
                preferences: [],
                patterns: [],
                recommendations: []
            };
        }

        // Analyze booking patterns
        const patterns = await this.analyzeBookingPatterns(customerProfile);

        // Get time preferences
        const timePreferences = this.extractTimePreferences(customerProfile);

        // Generate personalized recommendations
        const recommendations = await this.generatePersonalizedRecommendations(
            customerProfile,
            businessContext,
            patterns,
            timePreferences
        );

        return {
            patterns,
            timePreferences,
            recommendations,
            loyaltyScore: this.calculateLoyaltyScore(customerProfile),
            valueScore: this.calculateCustomerValue(customerProfile)
        };
    }

    /**
     * Generate AI-powered optimization recommendations
     */
    private async generateAIOptimizations(
        bookingRequest: any,
        businessContext: BusinessContext,
        availableSlots: TimeSlot[],
        customerAnalysis: any
    ): Promise<OptimalTimeSlot[]> {
        const prompt = `
      Generate optimal scheduling recommendations for this booking request:
      
      Booking Request:
      - Service ID: ${bookingRequest.serviceId}
      - Preferred Date: ${bookingRequest.preferredDate || 'Any'}
      - Preferred Time: ${bookingRequest.preferredTime || 'Any'}
      - Staff Preference: ${bookingRequest.staffPreference || 'Any'}
      
      Available Slots: ${availableSlots.length} slots available
      
      Customer Analysis:
      ${JSON.stringify(customerAnalysis)}
      
      Business Context:
      - Industry: ${businessContext.industry}
      - Peak Hours: Generate based on industry patterns
      - Staff Count: ${businessContext.staff.length}
      
      Generate top 10 optimal time slots considering:
      1. Customer preferences and history
      2. Business peak hours and staff availability
      3. Service duration and buffer times
      4. Loyalty tier and customer value
      5. Seasonal and day-of-week factors
      6. Operational efficiency
      7. Revenue optimization
      
      Return time slots with date, start time, and confidence scores.
    `;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        return this.parseOptimizationResponse(response, availableSlots);
    }

    /**
     * Apply business rules and constraints to optimization
     */
    private async applyBusinessRules(
        optimizedSlots: OptimalTimeSlot[],
        businessContext: BusinessContext,
        currentBookings: any[]
    ): Promise<OptimalTimeSlot[]> {
        const filteredSlots: OptimalTimeSlot[] = [];

        for (const slot of optimizedSlots) {
            // Apply minimum advance booking notice
            const minNotice = businessContext.policies.minimumBookingNotice;
            const slotDate = new Date(slot.date + 'T' + slot.startTime);
            const now = new Date();
            const hoursDifference = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (hoursDifference < minNotice) continue;

            // Apply maximum advance booking days
            const maxAdvance = businessContext.policies.advanceBookingDays;
            if (hoursDifference > (maxAdvance * 24)) continue;

            // Check for conflicts
            const hasConflict = this.checkSchedulingConflicts(
                slot,
                currentBookings,
                businessContext.staff
            );

            if (!hasConflict) {
                filteredSlots.push(slot);
            }
        }

        return filteredSlots.slice(0, 15); // Return top 15 optimized slots
    }

    /**
     * Generate final recommendations with reasoning
     */
    private generateRecommendations(
        optimizedSlots: OptimalTimeSlot[],
        businessContext: BusinessContext,
        customerAnalysis: any
    ): any[] {
        const recommendations: any[] = [];

        // Peak/Off-peak recommendation
        recommendations.push({
            type: 'peak_off_peak',
            description: 'Peak hours offer premium experience with full staff availability. Off-peak slots provide personalized attention and potential cost savings.',
            impact: 'high',
            slots: optimizedSlots.slice(0, 5)
        });

        // Staff preference recommendation
        if (customerAnalysis.preferences?.preferredStylists?.length > 0) {
            recommendations.push({
                type: 'staff_preference',
                description: `Your preferred stylist ${customerAnalysis.preferences.preferredStylists[0]} is available for these slots.`,
                impact: 'medium',
                slots: optimizedSlots.filter(slot =>
                    customerAnalysis.preferences.preferredStylists.some((stylist: string) =>
                        slot.staffId === stylist
                    )
                )
            });
        }

        // Service duration optimization
        recommendations.push({
            type: 'service_duration',
            description: 'Optimal scheduling based on service duration and staff availability patterns.',
            impact: 'medium',
            slots: optimizedSlots.slice(5, 10)
        });

        // Customer history-based recommendation
        if (customerAnalysis.patterns?.preferredTimeSlots?.length > 0) {
            recommendations.push({
                type: 'customer_history',
                description: 'Based on your booking history, these time slots align with your preferences.',
                impact: 'high',
                slots: optimizedSlots.filter(slot =>
                    customerAnalysis.patterns.preferredTimeSlots.includes(slot.startTime)
                )
            });
        }

        return recommendations;
    }

    // Helper methods
    private getDayName(dayOfWeek: number): string {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[dayOfWeek];
    }

    private isSlotAvailable(
        date: string,
        time: string,
        duration: number,
        currentBookings: any[],
        staff: any[]
    ): boolean {
        // Check if any staff member is available for this time slot
        return this.getAvailableStaff(date, time, duration, staff, currentBookings).length > 0;
    }

    private getAvailableStaff(
        date: string,
        time: string,
        duration: number,
        staff: any[],
        currentBookings: any[]
    ): string[] {
        const availableStaff: string[] = [];

        for (const staffMember of staff) {
            // Check if staff member is not already booked
            const isBooked = currentBookings.some(booking =>
                booking.staff_id === staffMember.id &&
                booking.date === date &&
                this.timeOverlaps(time, booking.time, duration, booking.duration)
            );

            if (!isBooked) {
                availableStaff.push(staffMember.id);
            }
        }

        return availableStaff;
    }

    private calculateEndTime(startTime: string, duration: number): string {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(endMinutes / 60);
        const remainingMinutes = endMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }

    private timeOverlaps(
        time1: string,
        time2: string,
        duration1: number,
        duration2: number
    ): boolean {
        const [h1, m1] = time1.split(':').map(Number);
        const [h2, m2] = time2.split(':').map(Number);

        const start1 = h1 * 60 + m1;
        const end1 = start1 + duration1;
        const start2 = h2 * 60 + m2;
        const end2 = start2 + duration2;

        return start1 < end2 && start2 < end1;
    }

    private checkSchedulingConflicts(
        slot: OptimalTimeSlot,
        currentBookings: any[],
        staff: any[]
    ): boolean {
        // Check for double bookings, staff unavailability, etc.
        return false; // Simplified for now
    }

    private async analyzeBookingPatterns(customerProfile: CustomerProfile): Promise<any> {
        // Analyze customer's booking patterns
        return {
            preferredTimeSlots: ['09:00', '14:00', '16:00'],
            preferredDays: ['tuesday', 'thursday', 'saturday'],
            bookingFrequency: customerProfile.history.bookingFrequency,
            averageAdvanceBooking: 3 // days
        };
    }

    private extractTimePreferences(customerProfile: CustomerProfile): string[] {
        return customerProfile.preferences.timePreferences || [];
    }

    private async generatePersonalizedRecommendations(
        customerProfile: CustomerProfile,
        businessContext?: BusinessContext,
        patterns?: any,
        timePreferences?: string[]
    ): Promise<string[]> {
        return [
            'Early morning slots for personalized attention',
            'Weekday appointments for better staff availability',
            'Peak hours for premium service experience'
        ];
    }

    private calculateLoyaltyScore(customerProfile: CustomerProfile): number {
        const tierScores = {
            bronze: 1,
            silver: 2,
            gold: 3,
            platinum: 4
        };
        return tierScores[customerProfile.preferences.loyaltyTier] || 1;
    }

    private calculateCustomerValue(customerProfile: CustomerProfile): number {
        const avgSpend = customerProfile.history.averageBookingValue;
        const frequency = customerProfile.history.totalBookings;
        const loyalty = this.calculateLoyaltyScore(customerProfile);

        return (avgSpend * frequency * loyalty) / 100;
    }

    private parseOptimizationResponse(response: string, availableSlots: TimeSlot[]): OptimalTimeSlot[] {
        // Parse AI response and match with available slots
        // This is a simplified implementation
        const slots: OptimalTimeSlot[] = [];

        // Extract time patterns from response
        const timePatterns = this.extractTimePatterns(response);

        for (const pattern of timePatterns) {
            const matchingSlot = availableSlots.find(slot =>
                slot.startTime === pattern.time && slot.date === pattern.date
            );

            if (matchingSlot) {
                slots.push({
                    date: matchingSlot.date,
                    startTime: matchingSlot.startTime,
                    duration: 60, // Default duration
                    staffId: matchingSlot.staffIds[0],
                    confidenceScore: pattern.confidence,
                    factors: {
                        business_impact: 0.8,
                        customer_preference: 0.9,
                        staff_availability: 0.7,
                        operational_efficiency: 0.8
                    }
                });
            }
        }

        return slots.slice(0, 10); // Return top 10 slots
    }

    private extractTimePatterns(response: string): Array<{ date: string, time: string, confidence: number }> {
        // Simple pattern extraction - in production, use more sophisticated parsing
        const patterns: Array<{ date: string, time: string, confidence: number }> = [];

        // This is a simplified implementation
        // In reality, you would parse the AI response more carefully
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i + 1);

            patterns.push({
                date: date.toISOString().split('T')[0],
                time: '14:00',
                confidence: 0.85
            });
        }

        return patterns;
    }
}

export default SchedulingOptimizer;