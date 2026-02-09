// Nia - AI Booking Assistant
// File: apps/booking/lib/ai/agents/NiaAgent.ts

import { BaseAgent, AgentConfig, AgentResponse } from '../BaseAgent';

// Types
interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
}

interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
}

interface BookingDetails {
    serviceId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    notes?: string;
}

interface BookingResponse {
    success: boolean;
    bookingId?: string;
    message: string;
    error?: string;
}

// Nia Agent Configuration
const NIA_CONFIG: AgentConfig = {
    name: 'Nia',
    role: 'Booking Assistant',
    personality: 'Friendly, professional, and helpful',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: `You are Nia, the friendly AI booking assistant for Instyle Hair Boutique in Cape Town, South Africa.

**Your Role:**
- Help customers book hair appointments via WhatsApp
- Recommend services based on customer needs
- Check availability and suggest suitable times
- Confirm bookings and provide details
- Answer questions about services and pricing

**Services Available:**
1. Middle & Side Installation - R300 (60 minutes)
   - Professional hair installation for middle and side parts
   
2. Maphondo & Lines Installation - R350 (60 minutes)
   - Traditional African hairstyling with intricate patterns
   
3. Soft Glam Makeup - R450 (120 minutes)
   - Professional makeup application service
   
4. Gel Maphondo Styling - R350 (120 minutes)
   - Gel-based traditional styling service
   
5. Frontal Ponytail Installation - R950 (120 minutes)
   - Premium frontal ponytail installation service

**Business Hours:**
- Monday to Friday: 09:00 - 17:00
- Saturday: 08:00 - 16:00
- Sunday: Closed

**Location:**
Instyle Hair Boutique, Cape Town, South Africa

**Booking Process:**
1. Greet the customer warmly
2. Ask what service they're interested in
3. Suggest a service if they're unsure
4. Check their preferred date and time
5. Verify availability
6. Collect their details (name, email, phone)
7. Confirm the booking
8. Provide booking reference and details

**Important Guidelines:**
- Always be friendly and professional
- Use South African English
- Prices are in South African Rand (R)
- If you can't help, offer to connect them with a human
- Always confirm details before booking
- Remind customers about the booking fee (20% upfront)

**Action Commands:**
When you need to perform an action, use this format:
[ACTION:type:{"param":"value"}]

Available actions:
- CHECK_AVAILABILITY: Check if a time slot is available
  Example: [ACTION:CHECK_AVAILABILITY:{"date":"2024-12-15","serviceId":"service-id"}]
  
- CREATE_BOOKING: Create a new booking
  Example: [ACTION:CREATE_BOOKING:{"serviceId":"id","name":"John","email":"john@example.com","phone":"0821234567","date":"2024-12-15","time":"10:00"}]
  
- GET_SERVICES: Get list of all services
  Example: [ACTION:GET_SERVICES:{}]

**Response Format:**
- Keep responses concise and friendly
- Use emojis sparingly (✨, 💇‍♀️, 📅, ⏰)
- Always end with a clear next step or question
- If booking is complete, provide summary and confirmation

Remember: You're representing Instyle Hair Boutique, so maintain a premium, professional image while being warm and approachable!`,
};

// Nia Agent Class
export class NiaAgent extends BaseAgent {
    private tenantId: string;

    constructor(tenantId: string = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70') {
        super(NIA_CONFIG);
        this.tenantId = tenantId;
    }

    /**
     * Handle booking intent from customer message
     */
    async handleBookingIntent(
        userId: string,
        message: string,
        context?: {
            lastAppointment?: any;
            customerInfo?: any;
        }
    ): Promise<AgentResponse> {
        // Add booking-specific context
        const enhancedContext = {
            ...context,
            tenantId: this.tenantId,
            currentDate: new Date().toISOString().split('T')[0],
            currentTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        };

        return this.chat(userId, message, enhancedContext);
    }

    /**
     * Check availability for a specific date and service
     */
    async checkAvailability(
        date: string,
        serviceId: string
    ): Promise<TimeSlot[]> {
        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: this.tenantId,
                    serviceId,
                    date,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to check availability');
            }

            const data = await response.json();
            return (data as { availableSlots: TimeSlot[] }).availableSlots || [];
        } catch (error) {
            console.error('Check availability error:', error);
            return [];
        }
    }

    /**
     * Create a booking
     */
    async createBooking(details: BookingDetails): Promise<BookingResponse> {
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: this.tenantId,
                    serviceId: details.serviceId,
                    customer: {
                        name: details.customerName,
                        email: details.customerEmail,
                        phone: details.customerPhone,
                    },
                    scheduledTime: `${details.date}T${details.time}:00Z`,
                    notes: details.notes || '',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: 'Failed to create booking',
                    error: (errorData as { error?: { message: string } }).error?.message || 'Unknown error',
                };
            }

            const data = await response.json();

            return {
                success: true,
                bookingId: (data as { booking: { id: string } }).booking.id,
                message: 'Booking created successfully',
            };
        } catch (error) {
            console.error('Create booking error:', error);
            return {
                success: false,
                message: 'Failed to create booking',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get all available services
     */
    async getServices(): Promise<Service[]> {
        try {
            const response = await fetch(
                `/api/public/services?tenantId=${this.tenantId}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const data = await response.json();
            return (data as { services: Service[] }).services || [];
        } catch (error) {
            console.error('Get services error:', error);
            return [];
        }
    }

    /**
     * Execute actions requested by the AI
     */
    async executeAction(action: string, params: any): Promise<any> {
        switch (action) {
            case 'CHECK_AVAILABILITY':
                return this.checkAvailability(params.date, params.serviceId);

            case 'CREATE_BOOKING':
                return this.createBooking({
                    serviceId: params.serviceId,
                    customerName: params.name,
                    customerEmail: params.email,
                    customerPhone: params.phone,
                    date: params.date,
                    time: params.time,
                    notes: params.notes,
                });

            case 'GET_SERVICES':
                return this.getServices();

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    /**
     * Format booking confirmation message
     */
    formatConfirmation(booking: {
        id: string;
        serviceName: string;
        date: string;
        time: string;
        price: number;
        customerName: string;
    }): string {
        return `
✅ Booking Confirmed!

📋 Booking Reference: ${booking.id.substring(0, 8).toUpperCase()}
👤 Name: ${booking.customerName}
💇‍♀️ Service: ${booking.serviceName}
📅 Date: ${new Date(booking.date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}
⏰ Time: ${booking.time}
💰 Price: R${(booking.price / 100).toFixed(2)}

📍 Location: Instyle Hair Boutique, Cape Town

⚠️ Please note:
- Booking fee (20%) is required to secure your appointment
- Remaining balance payable at the salon
- Cancellations must be made 24 hours in advance

We look forward to seeing you! 💖
    `.trim();
    }

    /**
     * Handle handoff to human
     */
    async handoffToHuman(
        userId: string,
        reason: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            // Log handoff request
            await this.supabase.from('ai_handoffs').insert({
                user_id: userId,
                agent_name: this.config.name,
                reason,
                created_at: new Date().toISOString(),
            } as any);

            return {
                success: true,
                message:
                    "I'll connect you with one of our team members who can better assist you. Someone will be in touch shortly! 😊",
            };
        } catch (error) {
            console.error('Handoff error:', error);
            return {
                success: false,
                message:
                    "I'm having trouble connecting you right now. Please call us at +27 69 917 1527 or visit our website.",
            };
        }
    }

    /**
     * Get booking statistics
     */
    async getBookingStats(startDate?: Date, endDate?: Date): Promise<{
        totalBookings: number;
        successRate: number;
        avgResponseTime: number;
        popularServices: Array<{ serviceName: string; count: number }>;
    }> {
        // TODO: Implement booking statistics
        return {
            totalBookings: 0,
            successRate: 0,
            avgResponseTime: 0,
            popularServices: [],
        };
    }
}

// Lazy initialization to avoid build-time environment variable issues
let _niaAgentInstance: NiaAgent | null = null;

export function getNiaAgent(tenantId?: string): NiaAgent {
    if (!_niaAgentInstance) {
        _niaAgentInstance = new NiaAgent(tenantId);
    }
    return _niaAgentInstance;
}

// Export the getter function as niaAgent for backwards compatibility
export const niaAgent = {
    handleBookingIntent: async (userId: string, message: string, context?: any) => {
        return getNiaAgent().handleBookingIntent(userId, message, context);
    },
    checkAvailability: async (date: string, serviceId: string) => {
        return getNiaAgent().checkAvailability(date, serviceId);
    },
    createBooking: async (details: BookingDetails) => {
        return getNiaAgent().createBooking(details);
    },
    getServices: async () => {
        return getNiaAgent().getServices();
    },
};
