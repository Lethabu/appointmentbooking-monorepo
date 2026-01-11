/**
 * Email Template Engine
 * Professional email templates for booking notifications
 */

export interface BookingEmailData {
  customerName: string;
  serviceName: string;
  employeeName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  depositAmount?: number;
  bookingId: string;
  tenantName: string;
  tenantAddress?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  cancellationUrl?: string;
  rescheduleUrl?: string;
}

/**
 * Booking confirmation email template
 */
export function confirmationEmailTemplate(data: BookingEmailData): { subject: string; html: string; text: string } {
  const subject = `Booking Confirmation - ${data.serviceName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #667eea; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .button:hover { background: #5568d3; }
    .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Booking Confirmed!</h1>
      <p>Your appointment has been successfully booked</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.customerName},</p>
      
      <p>Thank you for booking with ${data.tenantName}. Your appointment has been confirmed!</p>
      
      <div class="booking-details">
        <h3 style="margin-top: 0; color: #667eea;">Booking Details</h3>
        
        <div class="detail-row">
          <span class="detail-label">Service:</span>
          <span>${data.serviceName}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span>${data.date}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span>${data.time}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Duration:</span>
          <span>${data.duration} minutes</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Stylist:</span>
          <span>${data.employeeName}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Total Price:</span>
          <span>R ${(data.price / 100).toFixed(2)}</span>
        </div>
        
        ${data.depositAmount ? `
        <div class="detail-row">
          <span class="detail-label">Deposit Required:</span>
          <span>R ${(data.depositAmount / 100).toFixed(2)}</span>
        </div>
        ` : ''}
        
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Booking Reference:</span>
          <span>${data.bookingId}</span>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        ${data.rescheduleUrl ? `<a href="${data.rescheduleUrl}" class="button">Reschedule</a>` : ''}
        ${data.cancellationUrl ? `<a href="${data.cancellationUrl}" class="button">Cancel Booking</a>` : ''}
      </div>
      
      <p><strong>Location:</strong><br>${data.tenantAddress || 'See website for directions'}</p>
      
      ${data.tenantPhone ? `<p><strong>Contact:</strong> ${data.tenantPhone}</p>` : ''}
      
      <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>Important:</strong> Please arrive 5 minutes early. Cancellations must be made at least 24 hours in advance to avoid fees.
      </p>
      
      <div class="footer">
        <p>This is an automated confirmation email from ${data.tenantName}</p>
        <p>Please add this event to your calendar to receive reminders</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
BOOKING CONFIRMED

Dear ${data.customerName},

Your appointment has been successfully booked with ${data.tenantName}.

BOOKING DETAILS:
Service: ${data.serviceName}
Date: ${data.date}
Time: ${data.time}
Duration: ${data.duration} minutes
Stylist: ${data.employeeName}
Total Price: R ${(data.price / 100).toFixed(2)}
${data.depositAmount ? `Deposit Required: R ${(data.depositAmount / 100).toFixed(2)}` : ''}
Booking Reference: ${data.bookingId}

Location: ${data.tenantAddress || 'See website for directions'}
${data.tenantPhone ? `Contact: ${data.tenantPhone}` : ''}

IMPORTANT: Please arrive 5 minutes early. Cancellations must be made at least 24 hours in advance to avoid fees.

${data.rescheduleUrl ? `Reschedule: ${data.rescheduleUrl}` : ''}
${data.cancellationUrl ? `Cancel: ${data.cancellationUrl}` : ''}

Thank you for booking with ${data.tenantName}!
  `;

  return { subject, html, text };
}

/**
 * Reminder email template (24 hours before)
 */
export function reminderEmailTemplate(data: BookingEmailData, hoursBeforeremaining: number): { subject: string; html: string; text: string } {
  const subject = `Reminder: Your appointment is in ${hoursBeforeremaining} hours`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .booking-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .highlight { font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Appointment Reminder</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.customerName},</p>
      
      <div class="highlight">
        Your appointment is in ${hoursBeforeremaining} hours!
      </div>
      
      <div class="booking-summary">
        <p><strong>Service:</strong> ${data.serviceName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Stylist:</strong> ${data.employeeName}</p>
        <p><strong>Location:</strong> ${data.tenantAddress || 'See confirmation email'}</p>
      </div>
      
      <p>We look forward to seeing you soon!</p>
      
      <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        Need to reschedule or cancel? Please contact us at least 24 hours in advance.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
APPOINTMENT REMINDER

Hi ${data.customerName},

Your appointment is in ${hoursBeforeremaining} hours!

Service: ${data.serviceName}
Date: ${data.date}
Time: ${data.time}
Stylist: ${data.employeeName}
Location: ${data.tenantAddress || 'See confirmation email'}

We look forward to seeing you soon!

Need to reschedule or cancel? Please contact us at least 24 hours in advance.
  `;

  return { subject, html, text };
}

/**
 * Cancellation email template
 */
export function cancellationEmailTemplate(data: BookingEmailData): { subject: string; html: string; text: string } {
  const subject = `Booking Cancelled - ${data.serviceName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Cancelled</h1>
    </div>
    
    <div class="content">
      <p>Dear ${data.customerName},</p>
      
      <p>Your appointment has been cancelled as requested.</p>
      
      <p><strong>Cancelled Booking:</strong></p>
      <ul>
        <li>Service: ${data.serviceName}</li>
        <li>Date: ${data.date}</li>
        <li>Time: ${data.time}</li>
        <li>Reference: ${data.bookingId}</li>
      </ul>
      
      <p>We're sorry to see you go, but we hope to serve you again in the future!</p>
      
      <div style="text-align: center;">
        <a href="${data.tenantEmail ? `mailto:${data.tenantEmail}` : '#'}" class="button">Book Again</a>
      </div>
      
      <p style="margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
        If you didn't request this cancellation, please contact us immediately.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
BOOKING CANCELLED

Dear ${data.customerName},

Your appointment has been cancelled as requested.

Cancelled Booking:
- Service: ${data.serviceName}
- Date: ${data.date}
- Time: ${data.time}
- Reference: ${data.bookingId}

We're sorry to see you go, but we hope to serve you again in the future!

If you didn't request this cancellation, please contact us immediately.
  `;

  return { subject, html, text };
}

/**
 * Rescheduling confirmation email template
 */
export function rescheduleEmailTemplate(
  data: BookingEmailData,
  oldDate: string,
  oldTime: string
): { subject: string; html: string; text: string } {
  const subject = `Appointment Rescheduled - ${data.serviceName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2196F3; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .comparison { display: flex; justify-content: space-around; margin: 20px 0; }
    .old-time { background: #ffebee; padding: 15px; border-radius: 8px; flex: 1; margin-right: 10px; }
    .new-time { background: #e8f5e9; padding: 15px; border-radius: 8px; flex: 1; margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Appointment Rescheduled</h1>
    </div>
    
    <div class="content">
      <p>Dear ${data.customerName},</p>
      
      <p>Your appointment has been successfully rescheduled.</p>
      
      <div class="comparison">
        <div class="old-time">
          <h4>Original Time</h4>
          <p>${oldDate} at ${oldTime}</p>
        </div>
        <div class="new-time">
          <h4>New Time</h4>
          <p>${data.date} at ${data.time}</p>
        </div>
      </div>
      
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Service: ${data.serviceName}</li>
        <li>Stylist: ${data.employeeName}</li>
        <li>Duration: ${data.duration} minutes</li>
        <li>Reference: ${data.bookingId}</li>
      </ul>
      
      <p>We look forward to seeing you at your new appointment time!</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
APPOINTMENT RESCHEDULED

Dear ${data.customerName},

Your appointment has been successfully rescheduled.

Original Time: ${oldDate} at ${oldTime}
New Time: ${data.date} at ${data.time}

Booking Details:
- Service: ${data.serviceName}
- Stylist: ${data.employeeName}
- Duration: ${data.duration} minutes
- Reference: ${data.bookingId}

We look forward to seeing you at your new appointment time!
  `;

  return { subject, html, text };
}
