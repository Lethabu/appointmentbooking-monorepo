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
  isPopular?: boolean;
  isPremium?: boolean;
  prerequisites?: string[];
  recommendedAddOns?: string[];
  seasonalAvailability?: {
    start: Date;
    end: Date;
  };
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

// Enhanced AI Agent Types for Competitive Differentiation
export interface EnhancedAIAgent {
  id: string;
  name: string;
  type: 'booking' | 'recommendation' | 'scheduling' | 'upselling';
  capabilities: {
    naturalLanguageUnderstanding: boolean;
    intentRecognition: boolean;
    entityExtraction: boolean;
    sentimentAnalysis: boolean;
    contextAwareness: boolean;
    learningCapability: boolean;
  };
  intelligence: {
    conversationHistory: ConversationMessage[];
    userProfile?: CustomerProfile;
    businessContext: BusinessContext;
    recommendations: ServiceRecommendation[];
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  intent?: string;
  entities?: ExtractedEntity[];
  confidence?: number;
  timestamp: Date;
  metadata?: {
    sessionId: string;
    tenantId: string;
    channel: 'web' | 'whatsapp' | 'mobile';
  };
}

export interface ExtractedEntity {
  type: 'service' | 'date' | 'time' | 'stylist' | 'price' | 'preference' | 'location';
  value: string;
  confidence: number;
  context?: string;
}

export interface CustomerProfile {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  tenantId: string;
  demographics: {
    ageRange?: string;
    location?: string;
    language: 'en' | 'af' | 'zu' | 'xh';
    preferredContact: 'whatsapp' | 'sms' | 'email' | 'phone';
  };
  preferences: {
    preferredServices: string[];
    preferredStylists: string[];
    timePreferences: string[];
    priceSensitivity: 'low' | 'medium' | 'high';
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    specialRequests: string[];
  };
  history: {
    totalBookings: number;
    totalSpent: number;
    averageBookingValue: number;
    lastVisit: Date;
    favoriteServices: string[];
    bookingFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  };
  aiInsights: {
    predictedNeeds: string[];
    churnRisk: number; // 0-1 scale
    lifetimeValue: number;
    nextVisitPrediction: Date;
    recommendedServices: string[];
    optimalBookingTimes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessContext {
  tenantId: string;
  tenantName: string;
  industry: 'beauty' | 'healthcare' | 'fitness' | 'professional' | 'automotive';
  services: Service[];
  staff: StaffMember[];
  businessHours: BusinessHours;
  policies: {
    cancellationPolicy: string;
    advanceBookingDays: number;
    minimumBookingNotice: number;
  };
  localizations: {
    currency: string;
    language: string;
    culturalConsiderations: string[];
  };
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'stylist' | 'therapist' | 'consultant' | 'specialist';
  specialties: string[];
  availability: TimeSlot[];
  rating: number;
  experience: number; // years
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  staffIds: string[];
}

export interface BusinessHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
  publicHolidays: string[];
  [key: string]: any;
}

export interface ServiceRecommendation {
  serviceId: string;
  confidenceScore: number;
  reasoning: string;
  matchFactors: string[];
  priceRange: {
    min: number;
    max: number;
  };
  urgency: 'low' | 'medium' | 'high';
  seasonalRelevance: number;
  customerAffinity: number;
}

export interface AIResponse {
  message: string;
  actions?: {
    type: 'book_appointment' | 'show_services' | 'provide_info' | 'transfer_to_human' | 'schedule_callback';
    data?: any;
  }[];
  recommendations?: ServiceRecommendation[];
  confidence: number;
  followUpQuestions?: string[];
  metadata?: {
    processingTime: number;
    modelVersion: string;
    tenantId: string;
  };
}

export interface SchedulingOptimization {
  optimalSlots: OptimalTimeSlot[];
  recommendations: {
    type: 'peak_off_peak' | 'staff_preference' | 'service_duration' | 'customer_history';
    description: string;
    impact: 'high' | 'medium' | 'low';
    slots?: OptimalTimeSlot[];
  }[];
  conflictResolution: {
    conflicts: SchedulingConflict[];
    solutions: string[];
  };
}

export interface OptimalTimeSlot {
  date: string;
  startTime: string;
  duration: number;
  staffId?: string;
  confidenceScore: number;
  factors: {
    business_impact: number;
    customer_preference: number;
    staff_availability: number;
    operational_efficiency: number;
  };
}

export interface SchedulingConflict {
  type: 'double_booking' | 'staff_unavailable' | 'service_too_long' | 'outside_business_hours';
  description: string;
  severity: 'high' | 'medium' | 'low';
}
