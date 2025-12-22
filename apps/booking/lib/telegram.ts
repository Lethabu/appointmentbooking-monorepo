// Telegram Bot API Integration
// Provides messaging capabilities for appointment booking system

interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
  replyMarkup?: any;
}

interface InlineKeyboard {
  text: string;
  callbackData?: string;
  url?: string;
}

export class TelegramBot {
  private botToken: string;
  private apiUrl: string;

  constructor(config: TelegramConfig) {
    this.botToken = config.botToken;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  // Send text message
  async sendMessage(chatId: string, text: string, options?: {
    parseMode?: 'HTML' | 'Markdown';
    replyMarkup?: any;
  }): Promise<{ success: boolean; messageId?: number }> {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: options?.parseMode,
          reply_markup: options?.replyMarkup
        })
      });

      const result: { ok: boolean; result?: { message_id: number } } = await response.json();
      return {
        success: result.ok,
        messageId: result.result?.message_id
      };
    } catch (error) {
      console.error('Telegram sendMessage error:', error);
      return { success: false };
    }
  }

  // Send photo with caption
  async sendPhoto(chatId: string, photo: string, caption?: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.apiUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo,
          caption
        })
      });

      const result: { ok: boolean } = await response.json();
      return { success: result.ok };
    } catch (error) {
      console.error('Telegram sendPhoto error:', error);
      return { success: false };
    }
  }

  // Create inline keyboard
  createInlineKeyboard(buttons: InlineKeyboard[][]): any {
    return {
      inline_keyboard: buttons.map(row =>
        row.map(button => ({
          text: button.text,
          callback_data: button.callbackData,
          url: button.url
        }))
      )
    };
  }

  // Send booking confirmation with action buttons
  async sendBookingConfirmation(chatId: string, bookingData: {
    service: string;
    date: string;
    time: string;
    price: number;
    businessName: string;
    bookingId: string;
  }): Promise<{ success: boolean }> {
    const message = `🎉 *Booking Confirmed!*

📋 *Service:* ${bookingData.service}
📅 *Date:* ${bookingData.date}
⏰ *Time:* ${bookingData.time}
💰 *Price:* R${(bookingData.price / 100).toFixed(2)}

Thank you for choosing ${bookingData.businessName}!
We look forward to seeing you.`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '📅 Reschedule', callbackData: `reschedule_${bookingData.bookingId}` },
        { text: '❌ Cancel', callbackData: `cancel_${bookingData.bookingId}` }
      ],
      [
        { text: '📍 Get Directions', url: 'https://maps.google.com' },
        { text: '📞 Contact Us', callbackData: `contact_${bookingData.bookingId}` }
      ]
    ]);

    return this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }

  // Send appointment reminder
  async sendAppointmentReminder(chatId: string, reminderData: {
    service: string;
    date: string;
    time: string;
    businessName: string;
    address: string;
    bookingId: string;
  }): Promise<{ success: boolean }> {
    const message = `⏰ *Appointment Reminder*

Your appointment is coming up tomorrow!

📋 *Service:* ${reminderData.service}
📅 *Date:* ${reminderData.date}
⏰ *Time:* ${reminderData.time}
📍 *Location:* ${reminderData.address}

Please arrive 10 minutes early.
- ${reminderData.businessName}`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '✅ Confirm Attendance', callbackData: `confirm_${reminderData.bookingId}` },
        { text: '📅 Reschedule', callbackData: `reschedule_${reminderData.bookingId}` }
      ],
      [
        { text: '📍 Get Directions', url: 'https://maps.google.com' }
      ]
    ]);

    return this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }

  // Handle webhook updates
  async processUpdate(update: any): Promise<void> {
    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  private async handleMessage(message: any): Promise<void> {
    const chatId = message.chat.id.toString();
    const text = message.text;

    if (text === '/start') {
      await this.sendWelcomeMessage(chatId);
    } else if (text === '/book') {
      await this.sendBookingOptions(chatId);
    } else if (text === '/help') {
      await this.sendHelpMessage(chatId);
    }
  }

  private async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id.toString();
    const data = callbackQuery.data;

    if (data.startsWith('confirm_')) {
      const bookingId = data.replace('confirm_', '');
      await this.confirmAppointment(chatId, bookingId);
    } else if (data.startsWith('reschedule_')) {
      const bookingId = data.replace('reschedule_', '');
      await this.initiateReschedule(chatId, bookingId);
    } else if (data.startsWith('cancel_')) {
      const bookingId = data.replace('cancel_', '');
      await this.initiateCancellation(chatId, bookingId);
    }
  }

  private async sendWelcomeMessage(chatId: string): Promise<void> {
    const message = `👋 Welcome to Instyle Hair Boutique!

I'm your booking assistant. I can help you:
• 📅 Book appointments
• ⏰ Get reminders
• 📍 Find our location
• 💬 Answer questions

Use /book to start booking or /help for more options.`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '📅 Book Now', callbackData: 'book_appointment' },
        { text: '📍 Location', url: 'https://maps.google.com' }
      ],
      [
        { text: '📞 Contact', callbackData: 'contact_info' },
        { text: '💰 Prices', callbackData: 'view_prices' }
      ]
    ]);

    await this.sendMessage(chatId, message, { replyMarkup: keyboard });
  }

  private async sendBookingOptions(chatId: string): Promise<void> {
    const message = `📅 *Book Your Appointment*

Choose a service to get started:`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '💇‍♀️ Middle & Side Installation - R300', callbackData: 'service_1' }
      ],
      [
        { text: '✨ Maphondo & Lines Installation - R350', callbackData: 'service_2' }
      ],
      [
        { text: '💄 Soft Glam Makeup - R450', callbackData: 'service_3' }
      ],
      [
        { text: '🎨 Gel Maphondo Styling - R350', callbackData: 'service_4' }
      ],
      [
        { text: '👑 Frontal Ponytail Installation - R950', callbackData: 'service_5' }
      ]
    ]);

    await this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }

  private async sendHelpMessage(chatId: string): Promise<void> {
    const message = `🆘 *Help & Commands*

*Available Commands:*
/start - Welcome message
/book - Start booking process
/help - Show this help

*Quick Actions:*
• Book appointments
• View services & prices
• Get location & contact info
• Manage existing bookings

*Business Hours:*
Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 9:00 AM - 4:00 PM
Sunday: Closed

Need human assistance? Use the contact button below.`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '📞 Call Us', url: 'tel:+27123456789' },
        { text: '💬 WhatsApp', url: 'https://wa.me/27123456789' }
      ]
    ]);

    await this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }

  private async confirmAppointment(chatId: string, bookingId: string): Promise<void> {
    await this.sendMessage(chatId, '✅ Thank you! Your attendance has been confirmed. See you soon!');
  }

  private async initiateReschedule(chatId: string, bookingId: string): Promise<void> {
    const message = `📅 *Reschedule Appointment*

Please visit our website to select a new date and time:`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '🌐 Open Booking Website', url: 'https://www.instylehairboutique.co.za/book' }
      ]
    ]);

    await this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }

  private async initiateCancellation(chatId: string, bookingId: string): Promise<void> {
    const message = `❌ *Cancel Appointment*

Are you sure you want to cancel your appointment?
This action cannot be undone.`;

    const keyboard = this.createInlineKeyboard([
      [
        { text: '✅ Yes, Cancel', callbackData: `confirm_cancel_${bookingId}` },
        { text: '❌ No, Keep It', callbackData: 'keep_appointment' }
      ]
    ]);

    await this.sendMessage(chatId, message, {
      parseMode: 'Markdown',
      replyMarkup: keyboard
    });
  }
}

// Initialize Telegram bot instance
export const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || 'your_bot_token_here'
});

// Export for use in other parts of the application
export default telegramBot;