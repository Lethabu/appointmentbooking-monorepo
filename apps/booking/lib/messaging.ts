// Multi-channel messaging service
// Integrates WhatsApp, Telegram, and future messaging platforms

import { aisensy } from './aisensy';
import { telegramBot } from './telegram';

export type MessageChannel = 'whatsapp' | 'telegram' | 'sms' | 'email';

export interface CustomerContact {
  phone?: string;
  telegramChatId?: string;
  email?: string;
  preferredChannel?: MessageChannel;
}

export interface BookingNotification {
  service: string;
  date: string;
  time: string;
  price: number;
  businessName: string;
  bookingId: string;
  customerName: string;
}

export interface ReminderNotification {
  service: string;
  date: string;
  time: string;
  businessName: string;
  address: string;
  bookingId: string;
  customerName: string;
}

export class MultiChannelMessaging {
  
  // Send booking confirmation across preferred channels
  async sendBookingConfirmation(
    contact: CustomerContact, 
    booking: BookingNotification
  ): Promise<{ success: boolean; channels: string[] }> {
    const results: { channel: string; success: boolean }[] = [];
    
    // Try Telegram first if available
    if (contact.telegramChatId) {
      try {
        const result = await telegramBot.sendBookingConfirmation(contact.telegramChatId, {
          service: booking.service,
          date: booking.date,
          time: booking.time,
          price: booking.price,
          businessName: booking.businessName,
          bookingId: booking.bookingId
        });
        results.push({ channel: 'telegram', success: result.success });
      } catch (error) {
        console.error('Telegram booking confirmation failed:', error);
        results.push({ channel: 'telegram', success: false });
      }
    }
    
    // Fallback to WhatsApp if Telegram fails or unavailable
    if (contact.phone && (!contact.telegramChatId || !results.find(r => r.channel === 'telegram')?.success)) {
      try {
        const message = `🎉 Booking Confirmed!

Service: ${booking.service}
Date: ${booking.date}
Time: ${booking.time}
Price: R${(booking.price / 100).toFixed(2)}

Thank you for choosing ${booking.businessName}!
We look forward to seeing you.`;

        const result = await aisensy.sendWhatsAppMessage(contact.phone, message);
        results.push({ channel: 'whatsapp', success: result.success });
      } catch (error) {
        console.error('WhatsApp booking confirmation failed:', error);
        results.push({ channel: 'whatsapp', success: false });
      }
    }

    const successfulChannels = results.filter(r => r.success).map(r => r.channel);
    return {
      success: successfulChannels.length > 0,
      channels: successfulChannels
    };
  }

  // Send appointment reminder across channels
  async sendAppointmentReminder(
    contact: CustomerContact,
    reminder: ReminderNotification
  ): Promise<{ success: boolean; channels: string[] }> {
    const results: { channel: string; success: boolean }[] = [];
    
    // Try Telegram first if available
    if (contact.telegramChatId) {
      try {
        const result = await telegramBot.sendAppointmentReminder(contact.telegramChatId, {
          service: reminder.service,
          date: reminder.date,
          time: reminder.time,
          businessName: reminder.businessName,
          address: reminder.address,
          bookingId: reminder.bookingId
        });
        results.push({ channel: 'telegram', success: result.success });
      } catch (error) {
        console.error('Telegram reminder failed:', error);
        results.push({ channel: 'telegram', success: false });
      }
    }
    
    // Fallback to WhatsApp
    if (contact.phone && (!contact.telegramChatId || !results.find(r => r.channel === 'telegram')?.success)) {
      try {
        const message = `⏰ Appointment Reminder

Your appointment is coming up tomorrow!

Service: ${reminder.service}
Date: ${reminder.date}
Time: ${reminder.time}
Location: ${reminder.address}

Please arrive 10 minutes early.
- ${reminder.businessName}`;

        const result = await aisensy.sendWhatsAppMessage(contact.phone, message);
        results.push({ channel: 'whatsapp', success: result.success });
      } catch (error) {
        console.error('WhatsApp reminder failed:', error);
        results.push({ channel: 'whatsapp', success: false });
      }
    }

    const successfulChannels = results.filter(r => r.success).map(r => r.channel);
    return {
      success: successfulChannels.length > 0,
      channels: successfulChannels
    };
  }

  // Send custom message to preferred channel
  async sendCustomMessage(
    contact: CustomerContact,
    message: string,
    options?: { 
      preferredChannel?: MessageChannel;
      fallbackChannels?: MessageChannel[];
    }
  ): Promise<{ success: boolean; channel?: string }> {
    
    const tryChannel = async (channel: MessageChannel): Promise<boolean> => {
      switch (channel) {
        case 'telegram':
          if (contact.telegramChatId) {
            const result = await telegramBot.sendMessage(contact.telegramChatId, message);
            return result.success;
          }
          return false;
          
        case 'whatsapp':
          if (contact.phone) {
            const result = await aisensy.sendWhatsAppMessage(contact.phone, message);
            return result.success;
          }
          return false;
          
        default:
          return false;
      }
    };

    // Try preferred channel first
    const preferredChannel = options?.preferredChannel || contact.preferredChannel || 'whatsapp';
    const success = await tryChannel(preferredChannel);
    
    if (success) {
      return { success: true, channel: preferredChannel };
    }

    // Try fallback channels
    const fallbackChannels = options?.fallbackChannels || ['telegram', 'whatsapp'];
    for (const channel of fallbackChannels) {
      if (channel !== preferredChannel) {
        const fallbackSuccess = await tryChannel(channel);
        if (fallbackSuccess) {
          return { success: true, channel };
        }
      }
    }

    return { success: false };
  }

  // Get available channels for a contact
  getAvailableChannels(contact: CustomerContact): MessageChannel[] {
    const channels: MessageChannel[] = [];
    
    if (contact.telegramChatId) channels.push('telegram');
    if (contact.phone) channels.push('whatsapp');
    if (contact.email) channels.push('email');
    
    return channels;
  }

  // Check if contact has any messaging channels
  hasMessagingChannel(contact: CustomerContact): boolean {
    return !!(contact.telegramChatId || contact.phone || contact.email);
  }
}

// Export singleton instance
export const messaging = new MultiChannelMessaging();

// Export for use in booking flows
export default messaging;