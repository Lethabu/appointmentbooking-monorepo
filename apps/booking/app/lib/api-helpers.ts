// API helpers stub
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  return { error: 'Internal server error' };
};

export const validateRequest = (req: any, schema: any) => {
  return { isValid: true, data: req.body };
};

export const createResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const getSessionAndSalon = (req: any) => Promise.resolve({ 
  session: { user: { id: 'test' } }, 
  salon: { id: 'test', name: 'Test Salon' } 
});