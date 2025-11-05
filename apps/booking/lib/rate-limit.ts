// Rate limiting stub
export const rateLimit = {
  check: () => Promise.resolve({ success: true, remaining: 100 }),
  reset: () => Promise.resolve()
};

export const createRateLimiter = (options: any) => rateLimit;
export const getRateLimit = (key: string) => Promise.resolve({ allowed: true, remaining: 100 });