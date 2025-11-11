# 📚 API Documentation - Instyle Hair Boutique

## Base URL
```
Production: https://www.instylehairboutique.co.za
Development: https://appointmentbooking-monorepo.houseofgr8ness.workers.dev
```

---

## 🏢 Tenant API

### GET /api/tenant
Retrieve tenant information and services.

**Parameters:**
- `slug` (required): Tenant identifier

**Example:**
```bash
curl "https://www.instylehairboutique.co.za/api/tenant?slug=instylehairboutique"
```

**Response:**
```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "slug": "instylehairboutique",
    "name": "InStyle Hair Boutique",
    "config": "{\"branding\":{\"primary_color\":\"#8B4513\"}}"
  },
  "services": [
    {
      "id": "deab9cc75a72cec17158fe6fdbe0b860",
      "name": "Middle & Side Installation",
      "price": 45000,
      "duration_minutes": 180
    }
  ]
}
```

---

## 📅 Booking API

### POST /api/book
Create a new appointment booking.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "phone": "+27123456789",
  "serviceId": "deab9cc75a72cec17158fe6fdbe0b860",
  "scheduledTime": "2025-11-15T10:00:00Z",
  "notes": "First time client"
}
```

**Example:**
```bash
curl -X POST "https://www.instylehairboutique.co.za/api/book" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "+27123456789",
    "serviceId": "deab9cc75a72cec17158fe6fdbe0b860",
    "scheduledTime": "2025-11-15T10:00:00Z",
    "notes": "First time client"
  }'
```

**Response:**
```json
{
  "success": true,
  "appointmentId": "373c6ca8-60c1-47ab-ab1a-881e420e26ac",
  "message": "Booking created successfully"
}
```

---

## 📊 Dashboard API

### GET /api/dashboard
Retrieve appointment statistics and recent bookings.

**Parameters:**
- `tenantId` (required): Tenant identifier

**Example:**
```bash
curl "https://www.instylehairboutique.co.za/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70"
```

**Response:**
```json
{
  "stats": {
    "totalAppointments": 2,
    "confirmedAppointments": 2,
    "pendingAppointments": 0,
    "totalRevenue": 600
  },
  "appointments": [
    {
      "id": "373c6ca8-60c1-47ab-ab1a-881e420e26ac",
      "clientName": "Sarah Johnson",
      "service": "Middle & Side Installation",
      "time": "10:00",
      "duration": "180min",
      "status": "confirmed",
      "price": 450
    }
  ]
}
```

---

## 🔧 Service IDs Reference

| Service Name | Service ID | Price (ZAR) | Duration |
|--------------|------------|-------------|----------|
| Middle & Side Installation | `deab9cc75a72cec17158fe6fdbe0b860` | R450 | 180min |
| Maphondo & Lines | `c10900f5b3eb9654775864889ecbfa3b` | R350 | 120min |
| Hair Treatment | `d0793ce9a45bcaaf9d60845a239f2bef` | R250 | 90min |
| Hair Coloring | `8cb9037f3534e908fdaa9d6115285c58` | R550 | 150min |
| Hair Extensions | `8714f61343ed2666d1034842b298c721` | R650 | 240min |
| Wash & Style | `1429b48d6e3bca20b54d9c1e89d964a7` | R150 | 60min |

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "error": "Tenant ID is required"
}
```

### 404 Not Found
```json
{
  "error": "Tenant not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

---

## 🔒 Authentication

Currently, the API uses tenant-based isolation. Future versions will include:
- API key authentication
- Rate limiting per client
- OAuth integration

---

## 📈 Rate Limits

- **Booking API**: 10 requests per minute per IP
- **Tenant API**: 100 requests per minute per IP  
- **Dashboard API**: 50 requests per minute per IP

---

## 🔄 SuperSaaS Integration

All bookings created via `/api/book` are automatically synchronized with SuperSaaS:
- **Schedule**: "Instyle Hair Boutique"
- **Sync Method**: Real-time API calls
- **Fallback**: Local storage if SuperSaaS unavailable

---

## 🧪 Testing

### Test Tenant
- **Slug**: `instylehairboutique`
- **ID**: `ccb12b4d-ade6-467d-a614-7c9d198ddc70`

### Sample Booking
```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "name": "Test Client",
  "email": "test@example.com", 
  "phone": "+27123456789",
  "serviceId": "1429b48d6e3bca20b54d9c1e89d964a7",
  "scheduledTime": "2025-11-15T14:00:00Z",
  "notes": "Test booking"
}
```

---

## 📞 Support

For API issues or questions:
- **Technical**: Check Cloudflare Worker logs
- **Business Logic**: Review SuperSaaS integration
- **Database**: Query D1 directly via Wrangler CLI