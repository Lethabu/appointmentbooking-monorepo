import type { ChatResponse } from '@/types';

// API utility functions
export const api = {
  get: async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  post: async (url: string, data?: any, options?: RequestInit) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  put: async (url: string, data?: any, options?: RequestInit) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  delete: async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  // Specific API methods
  getServices: async (tenantId?: string) => {
    return api.get(`/api/services${tenantId ? `?tenantId=${tenantId}` : ''}`);
  },

  getProducts: async (tenantId?: string) => {
    return api.get(`/api/products${tenantId ? `?tenantId=${tenantId}` : ''}`);
  },

  createBooking: async (bookingData: any) => {
    return api.post('/api/book-appointment', bookingData);
  },

  sendChatMessage: async (message: string, agent: string, tenantId?: string): Promise<ChatResponse> => {
    return api.post('/api/agent', { input: message, agent, tenantId }) as Promise<ChatResponse>;
  },
};