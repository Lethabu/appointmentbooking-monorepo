// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// WhatsApp Business API Integration for appointment booking
interface WhatsAppMessage {
    id: string;
    from: string;
    to: string;
    timestamp: string;
    type: 'text' | 'interactive' | 'template';
    content: {
        text?: string;
        interactive?: any;
        template?: any;
    };
}

interface BookingFlow {
    currentStep: number;
    customerInfo: {
        name?: string;
        phone?: string;
        email?: string;
    };
    selectedService?: string;
    selectedDate?: string;
    selectedTime?: string;
    specialRequests?: string;
}

interface WhatsAppBookingBot {
    businessPhoneNumberId: string;
    accessToken: string;
    webhookVerifyToken: string;
    baseUrl: string;
}

// WhatsApp Business API Configuration
const WHATSAPP_CONFIG: WhatsAppBookingBot = {
    businessPhoneNumberId: process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
    baseUrl: 'https://graph.facebook.com/v17.0'
};

// Service definitions for WhatsApp booking
const BOOKING_SERVICES = [
    {
        id: 'haircut',
        name: 'Haircut & Styling',
        duration: '60 minutes',
        price: 250,
        description: 'Professional haircut with styling',
        categories: ['standard'],
        availability: ['weekdays', 'weekends']
    },
    {
        id: 'color_highlights',
        name: 'Color & Highlights',
        duration: '120 minutes',
        price: 450,
        description: 'Full color service with highlights',
        categories: ['premium'],
        availability: ['weekdays']
    },
    {
        id: 'keratin_treatment',
        name: 'Keratin Treatment',
        duration: '150 minutes',
        price: 380,
        description: 'Smoothing treatment',
        categories: ['premium'],
        availability: ['weekdays', 'weekends']
    },
    {
        id: 'facial',
        name: 'Facial Treatment',
        duration: '90 minutes',
        price: 320,
        description: 'Deep cleansing facial treatment',
        categories: ['standard'],
        availability: ['weekdays', 'weekends']
    }
];

// Time slots for bookings
const AVAILABLE_TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// Active booking flows by customer phone
const activeBookingFlows = new Map<string, BookingFlow>();

// Send WhatsApp message
async function sendWhatsAppMessage(phoneNumber: string, message: any): Promise<boolean> {
    try {
        const response = await fetch(`${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.businessPhoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: 'interactive',
                interactive: message
            })
        });

        const result = await response.json();
        return response.ok;
    } catch (error) {
        console.error('WhatsApp message sending error:', error);
        return false;
    }
}

// Send text message
async function sendTextMessage(phoneNumber: string, text: string): Promise<boolean> {
    return sendWhatsAppMessage(phoneNumber, {
        type: 'button',
        body: { text },
        action: {
            buttons: []
        }
    });
}

// Send service selection message
async function sendServiceSelection(phoneNumber: string): Promise<boolean> {
    const services = BOOKING_SERVICES.slice(0, 3); // WhatsApp allows max 3 buttons

    const message = {
        type: 'list',
        body: { text: 'Please select a service to book:' },
        action: {
            button: 'Choose Service',
            sections: [{
                title: 'Available Services',
                rows: services.map(service => ({
                    id: service.id,
                    title: service.name,
                    description: `${service.duration} - R${service.price}`
                }))
            }]
        }
    };

    return sendWhatsAppMessage(phoneNumber, message);
}

// Send date selection message
async function sendDateSelection(phoneNumber: string, serviceName: string): Promise<boolean> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(tomorrow);
        date.setDate(tomorrow.getDate() + i);
        dates.push({
            id: date.toISOString().split('T')[0],
            title: date.toLocaleDateString('en-ZA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            description: 'Available'
        });
    }

    const message = {
        type: 'list',
        body: { text: `Perfect! Now select a date for your ${serviceName}:` },
        action: {
            button: 'Choose Date',
            sections: [{
                title: 'Available Dates',
                rows: dates
            }]
        }
    };

    return sendWhatsAppMessage(phoneNumber, message);
}

// Send time selection message
async function sendTimeSelection(phoneNumber: string, date: string, serviceName: string): Promise<boolean> {
    const times = AVAILABLE_TIME_SLOTS.map(time => ({
        id: time,
        title: time,
        description: 'Available'
    }));

    const message = {
        type: 'list',
        body: { text: `Great! Now select a time for ${serviceName} on ${new Date(date).toLocaleDateString('en-ZA')}:` },
        action: {
            button: 'Choose Time',
            sections: [{
                title: 'Available Times',
                rows: times
            }]
        }
    };

    return sendWhatsAppMessage(phoneNumber, message);
}

// Send customer details form
async function sendCustomerDetailsForm(phoneNumber: string, serviceName: string, date: string, time: string): Promise<boolean> {
    const message = {
        type: 'button',
        body: {
            text: `Perfect! Your booking summary:\n\nService: ${serviceName}\nDate: ${new Date(date).toLocaleDateString('en-ZA')}\nTime: ${time}\n\nPlease confirm your details to complete the booking:`
        },
        action: {
            buttons: [
                {
                    type: 'reply',
                    reply: {
                        id: 'confirm_booking',
                        title: 'Confirm Booking'
                    }
                }
            ]
        }
    };

    return sendWhatsAppMessage(phoneNumber, message);
}

// Send booking confirmation
async function sendBookingConfirmation(phoneNumber: string, booking: BookingFlow): Promise<boolean> {
    const service = BOOKING_SERVICES.find(s => s.id === booking.selectedService);
    const price = service ? service.price : 0;

    const message = {
        type: 'template',
        template: {
            name: 'booking_confirmation',
            language: { code: 'en_ZA' },
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: booking.customerInfo.name || 'Customer' },
                        { type: 'text', text: service?.name || 'Service' },
                        { type: 'text', text: new Date(booking.selectedDate!).toLocaleDateString('en-ZA') },
                        { type: 'text', text: booking.selectedTime || '' },
                        { type: 'text', text: `R${price}` }
                    ]
                }
            ]
        }
    };

    return sendWhatsAppMessage(phoneNumber, message);
}

// Handle incoming WhatsApp messages
async function handleIncomingMessage(phoneNumber: string, message: WhatsAppMessage): Promise<void> {
    const flow = activeBookingFlows.get(phoneNumber) || { currentStep: 0, customerInfo: {} };

    // Store customer phone number
    flow.customerInfo.phone = phoneNumber;

    try {
        switch (flow.currentStep) {
            case 0: // Start booking flow
                await sendTextMessage(phoneNumber, 'Welcome to InStyle Hair Boutique! 💇‍♀️\n\nI can help you book an appointment quickly. What service would you like?');
                flow.currentStep = 1;
                await sendServiceSelection(phoneNumber);
                break;

            case 1: // Service selection
                if (message.type === 'interactive' && message.content.interactive?.type === 'list_selection') {
                    flow.selectedService = message.content.interactive.selected_row_id;
                    flow.currentStep = 2;

                    const service = BOOKING_SERVICES.find(s => s.id === flow.selectedService);
                    await sendDateSelection(phoneNumber, service?.name || 'Service');
                }
                break;

            case 2: // Date selection
                if (message.type === 'interactive' && message.content.interactive?.type === 'list_selection') {
                    flow.selectedDate = message.content.interactive.selected_row_id;
                    flow.currentStep = 3;

                    const service = BOOKING_SERVICES.find(s => s.id === flow.selectedService);
                    await sendTimeSelection(phoneNumber, flow.selectedDate!, service?.name || 'Service');
                }
                break;

            case 3: // Time selection
                if (message.type === 'interactive' && message.content.interactive?.type === 'list_selection') {
                    flow.selectedTime = message.content.interactive.selected_row_id;
                    flow.currentStep = 4;

                    const service = BOOKING_SERVICES.find(s => s.id === flow.selectedService);
                    await sendCustomerDetailsForm(phoneNumber, service?.name || 'Service', flow.selectedDate!, flow.selectedTime!);
                }
                break;

            case 4: // Customer details collection
                if (message.type === 'interactive' && message.content.interactive?.type === 'button_reply') {
                    if (message.content.interactive.button_reply.id === 'confirm_booking') {
                        flow.currentStep = 5;

                        await sendTextMessage(phoneNumber, 'Please provide your details:\n\n1. Your full name\n2. Email address (optional)\n\nJust type them in your next message!');
                    }
                } else if (message.type === 'text') {
                    // Parse customer details from text
                    const text = message.content.text || '';
                    const lines = text.split('\n');
                    if (lines.length >= 1) {
                        flow.customerInfo.name = lines[0].trim();
                        if (lines[1]) {
                            flow.customerInfo.email = lines[1].trim();
                        }

                        // Create booking
                        const booking = await createBooking(flow);

                        await sendBookingConfirmation(phoneNumber, flow);

                        // Clear the flow
                        activeBookingFlows.delete(phoneNumber);
                    }
                }
                break;

            default:
                // Handle general queries
                if (message.type === 'text') {
                    const text = (message.content.text || '').toLowerCase();
                    if (text.includes('book') || text.includes('appointment')) {
                        flow.currentStep = 0;
                        await handleIncomingMessage(phoneNumber, message);
                    } else if (text.includes('price') || text.includes('cost')) {
                        await sendTextMessage(phoneNumber, 'Our services:\n\n💇‍♀️ Haircut & Styling: R250\n🎨 Color & Highlights: R450\n✨ Keratin Treatment: R380\n\nTo book, just say "book"!');
                    } else if (text.includes('hours') || text.includes('open')) {
                        await sendTextMessage(phoneNumber, 'We are open:\n\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed\n\nBook anytime via WhatsApp!');
                    } else {
                        await sendTextMessage(phoneNumber, 'Hi! How can I help you today?\n\n💇‍♀️ Book an appointment\n💰 Check prices\n🕐 View hours\n📞 Call us\n\nJust let me know what you need!');
                    }
                }
        }

        // Save updated flow
        activeBookingFlows.set(phoneNumber, flow);

    } catch (error) {
        console.error('WhatsApp message handling error:', error);
        await sendTextMessage(phoneNumber, 'Sorry, I encountered an error. Please try again or call us directly.');
    }
}

// Create booking in database
async function createBooking(flow: BookingFlow): Promise<any> {
    // This would integrate with your actual booking database
    const service = BOOKING_SERVICES.find(s => s.id === flow.selectedService);

    const booking = {
        id: `booking_${Date.now()}`,
        customerName: flow.customerInfo.name,
        customerPhone: flow.customerInfo.phone,
        customerEmail: flow.customerInfo.email,
        serviceId: flow.selectedService,
        serviceName: service?.name,
        servicePrice: service?.price,
        date: flow.selectedDate,
        time: flow.selectedTime,
        status: 'confirmed',
        source: 'whatsapp',
        createdAt: new Date(),
        specialRequests: flow.specialRequests
    };

    // Store in database (mock implementation)
    console.log('Creating booking:', booking);

    return booking;
}

// WhatsApp webhook verification
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === WHATSAPP_CONFIG.webhookVerifyToken) {
        return new Response(challenge, { status: 200 });
    }

    return new Response('Forbidden', { status: 403 });
}

// Handle incoming WhatsApp webhook
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as any;

        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    if (change.field === 'messages') {
                        const messages = change.value.messages;

                        for (const message of messages) {
                            const phoneNumber = message.from;
                            const messageType = message.type;

                            let processedMessage: WhatsAppMessage;

                            if (messageType === 'text') {
                                processedMessage = {
                                    id: message.id,
                                    from: phoneNumber,
                                    to: message.to,
                                    timestamp: message.timestamp,
                                    type: 'text',
                                    content: { text: message.text.body }
                                };
                            } else if (messageType === 'interactive') {
                                processedMessage = {
                                    id: message.id,
                                    from: phoneNumber,
                                    to: message.to,
                                    timestamp: message.timestamp,
                                    type: 'interactive',
                                    content: { interactive: message.interactive }
                                };
                            } else {
                                continue; // Skip unsupported message types
                            }

                            await handleIncomingMessage(phoneNumber, processedMessage);
                        }
                    }
                }
            }

            return new Response('OK', { status: 200 });
        }

        return new Response('Bad Request', { status: 400 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// Send booking reminder via WhatsApp
async function sendBookingReminder(bookingId: string): Promise<boolean> {
    // This would fetch booking details from database
    // For now, mock implementation
    const booking = {
        customerPhone: '+27123456789',
        customerName: 'John Doe',
        serviceName: 'Haircut & Styling',
        date: new Date(),
        time: '10:00',
        salonName: 'InStyle Hair Boutique'
    };

    const message = {
        type: 'template',
        template: {
            name: 'booking_reminder',
            language: { code: 'en_ZA' },
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: booking.customerName },
                        { type: 'text', text: booking.serviceName },
                        { type: 'text', text: booking.date.toLocaleDateString('en-ZA') },
                        { type: 'text', text: booking.time },
                        { type: 'text', text: booking.salonName }
                    ]
                }
            ]
        }
    };

    return sendWhatsAppMessage(booking.customerPhone, message);
}

// Send payment link via WhatsApp
async function sendPaymentLink(phoneNumber: string, bookingId: string, amount: number): Promise<boolean> {
    const paymentUrl = `https://appointmentbooking.co.za/pay/${bookingId}`;

    const text = `💳 Payment Required\n\nBooking: ${bookingId}\nAmount: R${amount}\n\nPlease complete your payment here: ${paymentUrl}\n\nThis link expires in 30 minutes.`;

    return sendTextMessage(phoneNumber, text);
}