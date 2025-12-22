export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  price_cents?: number;
  duration: number;
  duration_minutes?: number;
  category?: string;
  isActive?: boolean;
  tenantId?: string;
  service_categories?: { name: string };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  price_cents?: number;
  image_url?: string;
  image_urls?: string[];
  stock_quantity?: number;
  category?: string;
  is_active?: boolean;
  tenant_id?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  tenantId: string;
  scheduledTime: string;
  datetime?: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  client_name?: string;
  client_phone?: string;
  service_name?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingFormData {
  full_name: string;
  phone_number: string;
  email?: string;
  selected_services: string[];
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  config?: {
    primaryColor?: string;
    logoUrl?: string;
  };
  branding?: {
    primary_color?: string;
    logo_url?: string;
    theme?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  tenant_id?: string;
}

export interface ChatMessage {
  id: string;
  role?: 'user' | 'agent';
  message?: string;
  content?: string;
  agent_name?: string;
  agent_id?: string;
  sender?: 'user' | 'ai';
  timestamp?: Date | string;
  created_at?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  type?: string;
  description?: string;
  avatar_url?: string;
  capabilities?: string[];
}

export interface ChatResponse {
  reply: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart {
  id: string;
  tenant_id: string;
  customer_phone: string;
  items: CartItem[];
  total_amount: number;
  status: 'active' | 'abandoned' | 'converted';
  created_at: string;
  abandoned_at?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}
