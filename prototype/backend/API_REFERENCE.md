# API Reference

**Base URL:** `http://localhost:8000/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication.

**Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Auth Endpoints

### POST /auth/register
Create new user account.

**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "password123",
  "companyId": 1,
  "role": "admin"
}
```

### POST /auth/login
Login and get JWT token.

**Body:**
```json
{
  "email": "admin@marinemaroc.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/driver/login
Driver login for mobile app.

**Body:**
```json
{
  "phone": "+212600000001",
  "password": "password123"
}
```

### GET /auth/me
Get current authenticated user.

---

## Drivers

### GET /drivers
List all drivers (filtered by company).

**Query Params:** None

### GET /drivers/:id
Get single driver with details.

### POST /drivers
Create new driver.

**Body:**
```json
{
  "name": "Mohamed Ahmed",
  "phone": "+212600000001",
  "email": "mohamed@company.com",
  "password": "password123"
}
```

### PATCH /drivers/:id
Update driver.

**Body:**
```json
{
  "name": "Updated Name",
  "status": "available"
}
```

### DELETE /drivers/:id
Soft delete driver.

### GET /drivers/:id/location
Get driver's current location.

---

## Vehicles

### GET /vehicles
List all vehicles (filtered by company).

### GET /vehicles/:id
Get single vehicle with details.

### POST /vehicles
Create new vehicle.

**Body:**
```json
{
  "plateNumber": "A-12345",
  "make": "Mercedes",
  "model": "Actros",
  "year": 2020,
  "driverId": 1
}
```

### PATCH /vehicles/:id
Update vehicle.

### DELETE /vehicles/:id
Soft delete vehicle.

---

## Orders

### GET /orders
List all orders (filtered by company).

**Query Params:**
- `status` - Filter by status (new, assigned, in_progress, completed)

### GET /orders/:id
Get single order with full details.

### POST /orders
Create new order.

**Body:**
```json
{
  "pickupLocationId": 1,
  "deliveryLocationId": 2,
  "scheduledAt": "2025-11-07T10:00:00Z",
  "notes": "Handle with care",
  "metadata": {
    "cargo": "Heavy Equipment",
    "weight": "15 tons"
  }
}
```

### PATCH /orders/:id
Update order.

### DELETE /orders/:id
Soft delete order.

### POST /orders/:id/assign
Assign order to driver.

**Body:**
```json
{
  "driverId": 1,
  "vehicleId": 1
}
```

### POST /orders/:id/start
Start order (driver begins trip).

### POST /orders/:id/complete
Complete order (delivery finished).

---

## Locations

### GET /locations
List all locations (filtered by company).

### GET /locations/:id
Get single location.

### POST /locations
Create new location.

**Body:**
```json
{
  "name": "Casablanca Warehouse",
  "address": "Zone Industrielle, Casablanca",
  "latitude": 33.5731,
  "longitude": -7.5898,
  "type": "warehouse"
}
```

### PATCH /locations/:id
Update location.

### DELETE /locations/:id
Soft delete location.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## Multi-Tenancy

All endpoints automatically filter data by the authenticated user's company. You can only access data belonging to your company.

---

## Testing

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@marinemaroc.com","password":"password123"}' \
  | jq -r '.token')

# List drivers
curl http://localhost:8000/api/drivers \
  -H "Authorization: Bearer $TOKEN"

# Create driver
curl -X POST http://localhost:8000/api/drivers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Driver","phone":"+212600999999"}'
```

---

**Total Endpoints:** 30+  
**All Protected:** Yes (except auth)  
**Multi-Tenant:** Yes  
**Tested:** Yes ✅
