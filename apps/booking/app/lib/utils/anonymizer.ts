// Data anonymizer stub
export const anonymizeUser = (userData: any) => ({
  ...userData,
  email: 'user@example.com',
  phone: '+1234567890',
  name: 'Anonymous User'
});

export const anonymizeBooking = (booking: any) => ({
  ...booking,
  clientName: 'Anonymous Client',
  clientEmail: 'client@example.com'
});

export const anonymizeData = (data: any) => ({
  ...data,
  anonymized: true,
  timestamp: new Date().toISOString()
});