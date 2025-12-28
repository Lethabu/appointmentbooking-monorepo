# Cloudflare Workers API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Booking & Appointments](#booking--appointments)
   - [Tenant & Services](#tenant--services)
   - [Dashboard & Analytics](#dashboard--analytics)
   - [Products & Shop](#products--shop)
   - [System & Health](#system--health)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Integration Examples](#integration-examples)
9. [Testing](#testing)
10. [OpenAPI Specification](#openapi-specification)

---

## Overview

The Cloudflare Workers API provides a comprehensive backend service for appointment booking systems. Built on Cloudflare's edge computing platform, it offers high-performance, globally distributed API endpoints for managing tenants, bookings, services, and analytics.

### Key Features

- **Multi-tenant Architecture**: Support for multiple business tenants
- **Real-time Updates**: Server-Sent Events for live dashboard updates
- **Booking Management**: Complete appointment lifecycle management
- **Analytics Dashboard**: Business intelligence and reporting
- **Product Catalog**: E-commerce integration for services and products
- **AI Integration**: Conversation logging and analytics
- **Availability Management**: Real-time slot availability checking

### Base URL

```
Production: https://appointmentbooking.workers.dev
Staging: https://staging-appointmentbooking.workers.dev
```

---

## Getting Started

### Prerequisites

- API access credentials (if required for protected endpoints)
- Understanding of RESTful API concepts
- Knowledge of your tenant ID and service IDs

### Quick Start Example

```javascript
// Get tenant information and services
const response = await fetch('https://appointmentbooking.workers.dev/api/tenant?slug=instylehairboutique');
const data = await response.json();

console.log(data.tenant.name); // "InStyle Hair Boutique"
console.log(data.services.length); // Number of available services
```

---

## Authentication

### Current Authentication Model

The API currently operates with **public access** for most endpoints. Authentication is handled at the application level through:

1. **Tenant Identification**: Using `tenantId` or `slug` parameters
2. **Domain-based Access**: Some endpoints infer tenant from request domain
3. **API Keys** (Future): Planned for enhanced security

### Security Headers

All responses include CORS headers:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Best Practices

1. **Validate Tenant Access**: Ensure users can only access their tenant's data
2. **Rate Limiting**: Implement client-side rate limiting
3. **Input Validation**: Always validate input parameters
4. **Error Handling**: Implement proper error handling for all API calls

---

## API Endpoints

### Booking & Appointments

#### Create Booking

Creates a new appointment booking.

**Endpoint:** `POST /api/book`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+27123456789",
  "serviceId": "service-uuid-here",
  "scheduledTime": "2025-12-25T14:00:00.000Z",
  "notes": "Looking forward to the appointment"
}
```

**Response:**

```json
{
  "success": true,
  "bookingId": "booking-uuid-here",
  "message": "Booking created successfully"
}
```

**Status Codes:**

- `201`: Booking created successfully
- `400`: Missing required fields or invalid input
- `500`: Internal server error

---

#### Get Dashboard Bookings

Retrieves bookings for dashboard display (2024+).

**Endpoint:** `GET /api/dashboard/bookings`

**Query Parameters:**

- `tenantId` (required): Tenant identifier
- `status` (optional): Filter by booking status
- `limit` (optional): Maximum number of results (default: 100, max: 500)

**Example Request:**

```bash
GET /api/dashboard/bookings?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70&status=confirmed&limit=50
```

**Response:**

```json
{
  "bookings": [
    {
      "id": "booking-uuid",
      "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
      "user_name": "John Doe",
      "user_email": "john.doe@example.com",
      "user_phone": "+27123456789",
      "service_name": "Hair Cut & Style",
      "scheduled_time": 1703517600,
      "status": "confirmed",
      "payment_status": "pending",
      "created_at": 1703517600
    }
  ],
  "count": 1
}
```

---

### Tenant & Services

#### Get Tenant Information

Retrieves tenant information and available services.

**Endpoint:** `GET /api/tenant`

**Query Parameters:**

- `slug` (required): Tenant URL slug

**Example Request:**

```bash
GET /api/tenant?slug=instylehairboutique
```

**Response:**

```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "InStyle Hair Boutique",
    "slug": "instylehairboutique",
    "description": "Premium hair services in Cape Town",
    "phone": "+27699171527",
    "email": "info@instyl.co.za",
    "address": "Cape Town, South Africa",
    "created_at": 1700000000,
    "updated_at": 1700000000
  },
  "services": [
    {
      "id": "service-uuid",
      "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
      "name": "Hair Cut & Style",
      "description": "Professional hair cutting and styling",
      "price": 350.00,
      "duration_minutes": 60,
      "is_active": true,
      "created_at": 1700000000
    }
  ]
}
```

---

#### Get Public Services

Retrieves active services for a tenant (public endpoint).

**Endpoint:** `GET /api/public/services`

**Query Parameters:**

- `tenantId` (required): Tenant identifier

**Example Request:**

```bash
GET /api/public/services?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70
```

**Response:**

```json
{
  "services": [
    {
      "id": "service-uuid",
      "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
      "name": "Hair Cut & Style",
      "description": "Professional hair cutting and styling",
      "price": 350.00,
      "duration_minutes": 60,
      "is_active": true
    }
  ]
}
```

---

#### Get Availability

Computes available time slots for a service on a specific date.

**Endpoint:** `GET /api/tenant/{tenantId}/availability`

**Path Parameters:**

- `tenantId` (required): Tenant identifier

**Query Parameters:**

- `date` (required): Date in YYYY-MM-DD format
- `serviceId` (required): Service identifier

**Example Request:**

```bash
GET /api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=2025-12-25&serviceId=service-uuid
```

**Response:**

```json
{
  "slots": [
    {
      "start": "2025-12-25T09:00:00.000Z",
      "end": "2025-12-25T10:00:00.000Z",
      "available": true
    },
    {
      "start": "2025-12-25T10:00:00.000Z",
      "end": "2025-12-25T11:00:00.000Z",
      "available": true
    }
  ]
}
```

---

#### Create/Update Schedules

Creates or updates staff schedules for services.

**Endpoint:** `POST /api/tenant/{tenantId}/schedules`

**Path Parameters:**

- `tenantId` (required): Tenant identifier

**Request Body:**

```json
{
  "staffNames": ["Sarah Johnson", "Mike Wilson"],
  "serviceId": "service-uuid",
  "schedule": [
    {
      "day": 1,
      "start": "09:00",
      "end": "17:00"
    },
    {
      "day": 2,
      "start": "09:00",
      "end": "17:00"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Schedule updated for 2 staff members"
}
```

---

### Dashboard & Analytics

#### Get Dashboard Statistics

Retrieves comprehensive dashboard statistics for a tenant.

**Endpoint:** `GET /api/dashboard`

**Query Parameters:**

- `tenantId` (required): Tenant identifier

**Example Request:**

```bash
GET /api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70
```

**Response:**

```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "InStyle Hair Boutique",
    "slug": "instylehairboutique"
  },
  "statistics": {
    "totalAppointments": 150,
    "confirmedAppointments": 120,
    "pendingAppointments": 30,
    "totalRevenue": 42000.00,
    "activeServices": 8,
    "pageViews": 2450
  },
  "recentAppointments": [
    {
      "id": "booking-uuid",
      "user_name": "John Doe",
      "user_email": "john.doe@example.com",
      "service_name": "Hair Cut & Style",
      "scheduled_time": 1703517600,
      "status": "confirmed"
    }
  ]
}
```

---

#### Dashboard Stream (SSE)

Provides real-time updates for dashboard using Server-Sent Events.

**Endpoint:** `GET /api/dashboard/stream`

**Query Parameters:**

- `tenantId` (required): Tenant identifier

**Example Request:**

```bash
GET /api/dashboard/stream?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70
```

**Response:** Server-Sent Events stream

**Event Types:**

- `appointments`: New appointment updates
- `error`: Error events

**Example Events:**

```javascript
// Appointment update event
event: appointments
data: {"rows": [{"id": "booking-uuid", "scheduled_time": 1703517600, "status": "confirmed"}]}

// Error event
event: error
data: {"message": "Database connection failed"}
```

---

#### AI Endpoint

Manages AI conversation logging and analytics.

**Endpoint:** `GET /api/ai` and `POST /api/ai`

**Query Parameters (GET):**

- `tenantId` (required): Tenant identifier

**Request Body (POST):**

```json
{
  "agentName": "BookingAssistant",
  "userId": "user-uuid",
  "sessionId": "session-uuid",
  "query": "I want to book a haircut for tomorrow",
  "response": "I can help you book a haircut. What time works for you?",
  "responseTimeMs": 1200,
  "resolved": true,
  "escalated": false,
  "satisfactionScore": 5
}
```

**GET Response:**

```json
{
  "stats": {
    "totalConversations": 45,
    "resolvedIssues": 38,
    "escalatedToHuman": 7,
    "avgResponseTime": 850,
    "recentConversations": [...]
  }
}
```

**POST Response:**

```json
{
  "success": true,
  "id": "log-uuid"
}
```

---

### Products & Shop

#### Get Products

Retrieves products for the shop with optional category filtering.

**Endpoint:** `GET /api/products`

**Query Parameters:**

- `category` (optional): Product category slug

**Example Request:**

```bash
GET /api/products?category=hair-products
```

**Response:**

```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "Professional Hair Shampoo",
      "short_description": "Sulfate-free shampoo for all hair types",
      "price": 150.00,
      "images": ["https://example.com/shampoo.jpg"],
      "category_name": "Hair Products",
      "category_slug": "hair-products",
      "is_active": true,
      "created_at": 1700000000
    }
  ]
}
```

---

### System & Health

#### Health Check

Provides system health status and service availability.

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-12-23T18:10:50.703Z",
  "services": {
    "database": "operational",
    "worker": "operational"
  },
  "version": "e9ebc0e1-d799-4160-8747-7621f42d49ed"
}
```

**Status Values:**

- `healthy`: All systems operational
- `degraded`: Some services experiencing issues
- `unhealthy`: Critical services down

---

## Data Models

### BookingRequest

```typescript
interface BookingRequest {
  tenantId: string;           // Tenant identifier
  name: string;               // Customer name
  email: string;              // Customer email
  phone: string;              // Customer phone
  serviceId: string;          // Service identifier
  scheduledTime: string;      // ISO 8601 timestamp
  notes?: string;             // Optional notes
}
```

### Tenant

```typescript
interface Tenant {
  id: string;                 // Unique tenant ID
  name: string;               // Business name
  slug: string;               // URL-friendly identifier
  description?: string;       // Business description
  phone?: string;             // Contact phone
  email?: string;             // Contact email
  address?: string;           // Business address
  created_at: number;         // Unix timestamp
  updated_at: number;         // Unix timestamp
}
```

### Service

```typescript
interface Service {
  id: string;                 // Unique service ID
  tenant_id: string;          // Tenant identifier
  name: string;               // Service name
  description?: string;       // Service description
  price: number;              // Service price
  duration_minutes: number;   // Duration in minutes
  is_active: boolean;         // Service availability
  created_at: number;         // Unix timestamp
}
```

### Appointment

```typescript
interface Appointment {
  id: string;                 // Unique appointment ID
  tenant_id: string;          // Tenant identifier
  user_id: string;            // Customer identifier
  service_id: string;         // Service identifier
  scheduled_time: number;     // Unix timestamp
  notes?: string;             // Appointment notes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: string;    // Payment status
  created_at: number;         // Unix timestamp
  updated_at: number;         // Unix timestamp
}
```

### Product

```typescript
interface Product {
  id: string;                 // Unique product ID
  name: string;               // Product name
  short_description?: string; // Brief description
  price: number;              // Product price
  images?: string[];          // Product image URLs
  category_id?: string;       // Category identifier
  is_active: boolean;         // Product availability
  created_at: number;         // Unix timestamp
}
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "details": {
    "field": "Additional error details"
  }
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created successfully
- `400`: Bad Request - Invalid input parameters
- `404`: Not Found - Resource doesn't exist
- `405`: Method Not Allowed - HTTP method not supported
- `500`: Internal Server Error - Server-side error

### Common Error Types

#### Validation Error (400)

```json
{
  "error": "Missing required fields",
  "details": {
    "tenantId": "This field is required",
    "email": "Invalid email format"
  }
}
```

#### Not Found Error (404)

```json
{
  "error": "Tenant not found"
}
```

#### Server Error (500)

```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## Rate Limiting

### Current Limits

The API currently operates without strict rate limiting, but clients should implement reasonable request patterns:

- **General API**: 1000 requests per minute per IP
- **Booking Creation**: 10 requests per minute per IP
- **Dashboard Stream**: 1 connection per tenant per IP
- **Health Check**: 60 requests per minute per IP

### Rate Limit Headers

Future implementations may include rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1703517600
```

### Best Practices

1. **Implement Backoff**: Use exponential backoff for failed requests
2. **Cache Responses**: Cache tenant and service information
3. **Batch Requests**: Combine multiple operations where possible
4. **Monitor Usage**: Track API usage to avoid hitting limits

---

## Integration Examples

### JavaScript/Node.js

#### Complete Booking Flow

```javascript
class AppointmentBookingAPI {
  constructor(baseUrl = 'https://appointmentbooking.workers.dev') {
    this.baseUrl = baseUrl;
  }

  async getTenant(slug) {
    const response = await fetch(`${this.baseUrl}/api/tenant?slug=${slug}`);
    if (!response.ok) throw new Error('Failed to fetch tenant');
    return response.json();
  }

  async getAvailability(tenantId, date, serviceId) {
    const response = await fetch(
      `${this.baseUrl}/api/tenant/${tenantId}/availability?date=${date}&serviceId=${serviceId}`
    );
    if (!response.ok) throw new Error('Failed to fetch availability');
    return response.json();
  }

  async createBooking(bookingData) {
    const response = await fetch(`${this.baseUrl}/api/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Booking failed');
    }
    
    return response.json();
  }

  async getDashboardStats(tenantId) {
    const response = await fetch(`${this.baseUrl}/api/dashboard?tenantId=${tenantId}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  }
}

// Usage example
const api = new AppointmentBookingAPI();

async function bookAppointment() {
  try {
    // 1. Get tenant and services
    const tenantData = await api.getTenant('instylehairboutique');
    const service = tenantData.services[0]; // Select first service
    
    // 2. Check availability
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    const availability = await api.getAvailability(
      tenantData.tenant.id,
      dateStr,
      service.id
    );
    
    if (availability.slots.length === 0) {
      throw new Error('No available slots for the selected date');
    }
    
    // 3. Book appointment
    const booking = await api.createBooking({
      tenantId: tenantData.tenant.id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+27123456789',
      serviceId: service.id,
      scheduledTime: availability.slots[0].start,
      notes: 'First time customer'
    });
    
    console.log('Booking created:', booking.bookingId);
    
  } catch (error) {
    console.error('Booking failed:', error.message);
  }
}
```

#### Dashboard with Real-time Updates

```javascript
class DashboardManager {
  constructor(baseUrl, tenantId) {
    this.baseUrl = baseUrl;
    this.tenantId = tenantId;
    this.eventSource = null;
  }

  async getStats() {
    const response = await fetch(`${this.baseUrl}/api/dashboard?tenantId=${this.tenantId}`);
    return response.json();
  }

  startRealTimeUpdates(callback) {
    this.eventSource = new EventSource(
      `${this.baseUrl}/api/dashboard/stream?tenantId=${this.tenantId}`
    );

    this.eventSource.addEventListener('appointments', (event) => {
      const data = JSON.parse(event.data);
      callback('appointments', data.rows);
    });

    this.eventSource.addEventListener('error', (event) => {
      const data = JSON.parse(event.data);
      callback('error', data);
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.startRealTimeUpdates(callback), 5000);
    };
  }

  stopRealTimeUpdates() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}

// Usage
const dashboard = new DashboardManager(
  'https://appointmentbooking.workers.dev',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
);

// Load initial stats
dashboard.getStats().then(stats => {
  console.log('Dashboard stats:', stats);
});

// Start real-time updates
dashboard.startRealTimeUpdates((eventType, data) => {
  if (eventType === 'appointments') {
    console.log('New appointments:', data);
    // Update UI with new appointment data
  } else if (eventType === 'error') {
    console.error('Dashboard error:', data.message);
  }
});
```

### Python

```python
import requests
import json
from datetime import datetime, timedelta

class AppointmentBookingAPI:
    def __init__(self, base_url='https://appointmentbooking.workers.dev'):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_tenant(self, slug):
        """Get tenant information and services"""
        response = self.session.get(f'{self.base_url}/api/tenant', params={'slug': slug})
        response.raise_for_status()
        return response.json()
    
    def get_availability(self, tenant_id, date, service_id):
        """Get available time slots"""
        response = self.session.get(
            f'{self.base_url}/api/tenant/{tenant_id}/availability',
            params={'date': date, 'serviceId': service_id}
        )
        response.raise_for_status()
        return response.json()
    
    def create_booking(self, booking_data):
        """Create a new booking"""
        response = self.session.post(
            f'{self.base_url}/api/book',
            json=booking_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if not response.ok:
            error_data = response.json()
            raise Exception(error_data.get('error', 'Booking failed'))
        
        return response.json()
    
    def get_dashboard_stats(self, tenant_id):
        """Get dashboard statistics"""
        response = self.session.get(
            f'{self.base_url}/api/dashboard',
            params={'tenantId': tenant_id}
        )
        response.raise_for_status()
        return response.json()

# Usage example
api = AppointmentBookingAPI()

try:
    # Get tenant and services
    tenant_data = api.get_tenant('instylehairboutique')
    service = tenant_data['services'][0]  # Select first service
    
    # Check availability for tomorrow
    tomorrow = datetime.now() + timedelta(days=1)
    date_str = tomorrow.strftime('%Y-%m-%d')
    
    availability = api.get_availability(
        tenant_data['tenant']['id'],
        date_str,
        service['id']
    )
    
    if not availability['slots']:
        raise Exception('No available slots for the selected date')
    
    # Create booking
    booking = api.create_booking({
        'tenantId': tenant_data['tenant']['id'],
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'phone': '+27123456789',
        'serviceId': service['id'],
        'scheduledTime': availability['slots'][0]['start'],
        'notes': 'Regular customer'
    })
    
    print(f'Booking created successfully: {booking["bookingId"]}')
    
except Exception as e:
    print(f'Booking failed: {str(e)}')
```

### cURL Examples

#### Create Booking

```bash
curl -X POST https://appointmentbooking.workers.dev/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "serviceId": "service-uuid-here",
    "scheduledTime": "2025-12-25T14:00:00.000Z",
    "notes": "Looking forward to the appointment"
  }'
```

#### Get Tenant Information

```bash
curl "https://appointmentbooking.workers.dev/api/tenant?slug=instylehairboutique"
```

#### Check Availability

```bash
curl "https://appointmentbooking.workers.dev/api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=2025-12-25&serviceId=service-uuid-here"
```

#### Get Dashboard Statistics

```bash
curl "https://appointmentbooking.workers.dev/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70"
```

#### Health Check

```bash
curl https://appointmentbooking.workers.dev/api/health
```

---

## Testing

### Unit Testing

#### JavaScript/Jest Example

```javascript
// booking-api.test.js
import { AppointmentBookingAPI } from './booking-api';

describe('AppointmentBookingAPI', () => {
  let api;

  beforeEach(() => {
    api = new AppointmentBookingAPI('https://test-api.workers.dev');
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        tenantId: 'test-tenant-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+27123456789',
        serviceId: 'test-service-id',
        scheduledTime: '2025-12-25T14:00:00.000Z'
      };

      const mockResponse = {
        success: true,
        bookingId: 'booking-uuid',
        message: 'Booking created successfully'
      };

      // Mock fetch response
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await api.createBooking(bookingData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.workers.dev/api/book',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        })
      );
    });

    it('should handle booking creation failure', async () => {
      const bookingData = {
        tenantId: 'test-tenant-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+27123456789',
        serviceId: 'test-service-id',
        scheduledTime: '2025-12-25T14:00:00.000Z'
      };

      const mockError = {
        error: 'Missing required fields',
        details: { serviceId: 'Invalid service ID' }
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve(mockError)
        })
      );

      await expect(api.createBooking(bookingData)).rejects.toThrow('Missing required fields');
    });
  });

  describe('getTenant', () => {
    it('should fetch tenant information', async () => {
      const mockTenantData = {
        tenant: {
          id: 'test-tenant-id',
          name: 'Test Salon',
          slug: 'test-salon'
        },
        services: [
          {
            id: 'service-1',
            name: 'Hair Cut',
            price: 100
          }
        ]
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTenantData)
        })
      );

      const result = await api.getTenant('test-salon');

      expect(result).toEqual(mockTenantData);
      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.workers.dev/api/tenant?slug=test-salon'
      );
    });
  });
});
```

### Integration Testing

#### API Testing with Postman

**Collection Variables:**

- `baseUrl`: `https://appointmentbooking.workers.dev`
- `tenantId`: `ccb12b4d-ade6-467d-a614-7c9d198ddc70`

**Test Scripts:**

```javascript
// Health check test
pm.test("Health check response is valid", function () {
    pm.response.to.be.ok;
    pm.response.to.be.json;
    
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.be.oneOf(['healthy', 'degraded', 'unhealthy']);
    pm.expect(jsonData.services).to.have.property('database');
    pm.expect(jsonData.services).to.have.property('worker');
});

// Tenant information test
pm.test("Tenant information retrieved successfully", function () {
    pm.response.to.be.ok;
    pm.response.to.be.json;
    
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('tenant');
    pm.expect(jsonData).to.have.property('services');
    pm.expect(jsonData.services).to.be.an('array');
    pm.expect(jsonData.services.length).to.be.greaterThan(0);
});
```

#### Load Testing

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
};

const BASE_URL = 'https://appointmentbooking.workers.dev';

export default function () {
  // Test tenant endpoint
  let tenantResponse = http.get(`${BASE_URL}/api/tenant?slug=instylehairboutique`);
  check(tenantResponse, {
    'tenant endpoint responds': (r) => r.status === 200,
    'tenant data is valid': (r) => {
      const data = JSON.parse(r.body);
      return data.tenant && data.services;
    }
  });

  sleep(1);

  // Test dashboard endpoint
  let dashboardResponse = http.get(`${BASE_URL}/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70`);
  check(dashboardResponse, {
    'dashboard endpoint responds': (r) => r.status === 200,
    'dashboard data is valid': (r) => {
      const data = JSON.parse(r.body);
      return data.statistics && data.recentAppointments;
    }
  });

  sleep(1);

  // Test products endpoint
  let productsResponse = http.get(`${BASE_URL}/api/products`);
  check(productsResponse, {
    'products endpoint responds': (r) => r.status === 200,
    'products data is valid': (r) => {
      const data = JSON.parse(r.body);
      return data.products && Array.isArray(data.products);
    }
  });
}
```

### Test Data Management

#### Seed Test Data

```sql
-- Insert test tenant
INSERT INTO tenants (id, name, slug, created_at, updated_at) 
VALUES ('test-tenant-id', 'Test Salon', 'test-salon', unixepoch(), unixepoch());

-- Insert test services
INSERT INTO services (id, tenant_id, name, price, duration_minutes, is_active, created_at) VALUES
('test-service-1', 'test-tenant-id', 'Hair Cut', 100.00, 60, 1, unixepoch()),
('test-service-2', 'test-tenant-id', 'Hair Style', 150.00, 90, 1, unixepoch());

-- Insert test user
INSERT INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('test-user-id', 'test-tenant-id', 'Test User', 'test@example.com', '+27123456789', unixepoch(), unixepoch());

-- Insert test appointment
INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, status, created_at, updated_at)
VALUES ('test-appointment-id', 'test-tenant-id', 'test-user-id', 'test-service-1', unixepoch(), 'confirmed', unixepoch(), unixepoch());
```

---

## OpenAPI Specification

The complete OpenAPI 3.0 specification for this API is available in a separate file: [openapi.yaml](openapi.yaml)

This specification includes:

- Complete endpoint definitions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error schemas
- External documentation links

You can use this specification with tools like:

- **Swagger UI**: For interactive API documentation
- **Postman**: For API testing and collection generation
- **OpenAPI Generator**: For generating client SDKs
- **ReDoc**: For alternative API documentation presentation

---

## Support and Resources

### Documentation Links

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

### Community and Support

- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Join the Cloudflare Developers Discord
- **Email Support**: <api-support@appointmentbooking.co.za>

### Changelog

- **v1.0.0** (2025-12-23): Initial API release with core booking functionality
- **v1.1.0** (Planned): Enhanced authentication and rate limiting
- **v1.2.0** (Planned): Advanced analytics and reporting features

---

*This documentation is maintained by the Appointment Booking API team. For updates and additional resources, visit our [developer portal](https://developers.appointmentbooking.co.za).*
