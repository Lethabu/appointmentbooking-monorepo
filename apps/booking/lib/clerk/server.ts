// Clerk server stub
export const clerkMiddleware = (handler?: any) => {
  return (req: any, res: any, next: any) => {
    // Mock Clerk middleware
    req.auth = { userId: null, user: null };
    if (handler) return handler(req, res, next);
    if (next) next();
  };
};