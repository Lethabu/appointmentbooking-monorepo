// Validation utilities stub
export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const validatePhone = (phone: string) => /^\+?[\d\s-()]+$/.test(phone);
export const validateBookingData = (data: any) => ({ isValid: true, errors: [] });
export const validateAndSanitize = (data: any, schema: any) => {
  const validation = schema.validate(data);
  return { ...validation, sanitized: validation.success ? validation.data : data };
};
export const demoRequestSchema = { validate: (data: any) => ({ success: true, data }) };