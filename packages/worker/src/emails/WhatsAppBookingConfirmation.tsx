import * as React from "react";

interface WhatsAppBookingConfirmationProps {
  name: string;
  scheduledTime: string;
  serviceName: string;
  tenantName: string;
  tenantWebsite?: string;
}

export const WhatsAppBookingConfirmation = ({
  name,
  scheduledTime,
  serviceName,
  tenantName,
  tenantWebsite,
}: WhatsAppBookingConfirmationProps) => {
  const formattedDate = new Date(scheduledTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `
*Booking Confirmation for ${tenantName}*

Hi ${name}! 👋

Your booking has been confirmed! Here are the details:

📅 *Service:* ${serviceName}
🗓️ *Date:* ${formattedDate}
🏢 *Location:* ${tenantName}

If you need to reschedule or have any questions, please contact us directly.

Thank you for choosing ${tenantName}! We look forward to seeing you.

${tenantWebsite ? `Visit us: ${tenantWebsite}` : ''}

Best regards,
The ${tenantName} Team
  `.trim();

  return message;
};

export default WhatsAppBookingConfirmation;