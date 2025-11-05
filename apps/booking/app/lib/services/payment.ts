// Payment service stub
export const createPayment = (amount: number, currency = 'ZAR') => ({
  id: 'pay_' + Math.random().toString(36).substr(2, 9),
  amount,
  currency,
  status: 'pending',
  url: 'https://payment.example.com/pay'
});

export const verifyPayment = (paymentId: string) => ({
  id: paymentId,
  status: 'completed',
  verified: true
});

export const createPaystackPayment = (amount: number, email: string) => ({
  id: 'pay_' + Math.random().toString(36).substr(2, 9),
  amount,
  email,
  status: 'pending',
  url: 'https://paystack.com/pay/test'
});