// South African payment gateways stub
export const paystack = {
  createPayment: () => Promise.resolve({ url: 'https://paystack.com/pay/test' })
};

export const yoco = {
  createPayment: () => Promise.resolve({ url: 'https://yoco.com/pay/test' })
};

export const ozow = {
  createPayment: () => Promise.resolve({ url: 'https://ozow.com/pay/test' })
};

export const createPaystackPayment = (amount: number, email: string) => 
  Promise.resolve({ url: 'https://paystack.com/pay/test', reference: 'test_ref' });

export const MultiGatewayProcessor = {
  process: (gateway: string, amount: number) => Promise.resolve({ success: true })
};

export const PaymentGatewayFactory = {
  create: (type: string) => ({ process: () => Promise.resolve({ success: true }) })
};

export const PayFastGateway = {
  createPayment: () => Promise.resolve({ url: 'https://payfast.com/pay/test' })
};