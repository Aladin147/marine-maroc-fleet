# Prototype Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Fleet Management Engine               │
│                     (White-Label SaaS)                   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Admin     │    │     API      │    │  Mobile App  │
│  Dashboard   │◄──►│   (Laravel)  │◄──►│(React Native)│
│   (React)    │    │              │    │   (Arabic)   │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │    Redis     │    │   Storage    │
│ (Multi-tenant)│    │ Cache/Queue  │    │     (S3)     │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Multi-Tenant Strategy

### Database Isolation

**Approach:** Single database with company_id foreign keys

```sql
-- Every table has company_id
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    -- ... other fields
    CONSTRAINT orders_company_fk FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE
);

-- Automatic filtering via Laravel global scopes
```

**Why this approach?**
- Simpler to manage (one database)
- Easier backups
- Lower infrastructure costs
- Good enough for 100+ clients

**Alternative (if needed later):**
- Schema-per-tenant (PostgreSQL schemas)
- Database-per-tenant (for enterprise clients)

### Company Settings

```json
{
  "id": 1,
  "name": "Marine Maroc",
  "subdomain": "marinemaroc",
  "settings": {
    "branding": {
      "name": "Marine Maroc Fleet",
      "logo_url": "https://cdn.../logo.png",
      "primary_color": "#0047AB",
      "accent_color": "#00CED1",
      "favicon_url": "https://cdn.../favicon.ico"
    },
    "features": {
      "voice_messages": true,
      "geofencing": false,
      "analytics": false,
      "fuel_tracking": false,
      "maintenance": false
    },
    "localization": {
      "default_language": "ar",
      "supported_languages": ["ar", "fr"],
      "timezone": "Africa/Casablanca",
      "currency": "MAD"
    },
    "limits": {
      "max_drivers": 100,
      "max_vehicles": 100,
      "max_orders_per_month": 1000
    }
  }
}
```

## Core Database Schema

### Companies & Users

```sql
-- Companies (tenants)
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (dispatchers, admins)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'dispatcher',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, email)
);
```

### Fleet Entities

```sql
-- Drivers
CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    current_location JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    plate_number VARCHAR(50) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    driver_id BIGINT REFERENCES drivers(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, plate_number)
);

-- Locations (places)
CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders (loads/shipments)
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    pickup_location_id BIGINT REFERENCES locations(id),
    delivery_location_id BIGINT REFERENCES locations(id),
    driver_id BIGINT REFERENCES drivers(id),
    vehicle_id BIGINT REFERENCES vehicles(id),
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tracking & Communication

```sql
-- GPS Tracking
CREATE TABLE tracking_points (
    id BIGSERIAL PRIMARY KEY,
    driver_id BIGINT NOT NULL REFERENCES drivers(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(8, 2),
    speed DECIMAL(8, 2),
    heading DECIMAL(5, 2),
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_tracking_driver_time ON tracking_points(driver_id, recorded_at DESC);

-- Proof of Delivery
CREATE TABLE proof_of_delivery (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    photos JSONB DEFAULT '[]',
    signature_url VARCHAR(500),
    notes TEXT,
    delivered_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (voice + text)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    from_user_id BIGINT REFERENCES users(id),
    to_user_id BIGINT REFERENCES users(id),
    from_driver_id BIGINT REFERENCES drivers(id),
    to_driver_id BIGINT REFERENCES drivers(id),
    type VARCHAR(50) DEFAULT 'text',
    content TEXT,
    audio_url VARCHAR(500),
    duration INTEGER,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Structure

### RESTful Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Orders:
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PATCH  /api/orders/{id}
DELETE /api/orders/{id}
POST   /api/orders/{id}/assign
POST   /api/orders/{id}/start
POST   /api/orders/{id}/complete

Drivers:
GET    /api/drivers
POST   /api/drivers
GET    /api/drivers/{id}
PATCH  /api/drivers/{id}
DELETE /api/drivers/{id}
GET    /api/drivers/{id}/location
GET    /api/drivers/{id}/history

Vehicles:
GET    /api/vehicles
POST   /api/vehicles
GET    /api/vehicles/{id}
PATCH  /api/vehicles/{id}
DELETE /api/vehicles/{id}

Locations:
GET    /api/locations
POST   /api/locations
GET    /api/locations/{id}
PATCH  /api/locations/{id}
DELETE /api/locations/{id}

Tracking:
POST   /api/tracking/location
GET    /api/tracking/live

Messages:
GET    /api/messages
POST   /api/messages
POST   /api/messages/voice
GET    /api/messages/{id}/audio

Proof of Delivery:
POST   /api/orders/{id}/proof
POST   /api/orders/{id}/proof/photo
POST   /api/orders/{id}/proof/signature
```

### Real-Time Events (WebSockets)

```javascript
// Channels
company.{company_id}              // Company-wide events
driver.{driver_id}                // Driver-specific events
order.{order_id}                  // Order-specific events

// Events
LocationUpdated                   // Driver location changed
OrderAssigned                     // Order assigned to driver
OrderStatusChanged                // Order status updated
MessageReceived                   // New message
```

## Frontend Architecture (React)

### Component Structure

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   ├── OrderCard.tsx
│   │   ├── OrderForm.tsx
│   │   └── OrderMap.tsx
│   ├── drivers/
│   │   ├── DriverList.tsx
│   │   ├── DriverCard.tsx
│   │   └── DriverForm.tsx
│   └── map/
│       ├── LiveMap.tsx
│       ├── VehicleMarker.tsx
│       └── RoutePolyline.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Orders.tsx
│   ├── Drivers.tsx
│   ├── Vehicles.tsx
│   ├── Locations.tsx
│   └── Map.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useDrivers.ts
│   └── useWebSocket.ts
├── lib/
│   ├── api.ts
│   ├── websocket.ts
│   └── utils.ts
└── App.tsx
```

### State Management

```typescript
// Using Zustand for simplicity
import create from 'zustand';

interface AppState {
  user: User | null;
  company: Company | null;
  orders: Order[];
  drivers: Driver[];
  setUser: (user: User) => void;
  setOrders: (orders: Order[]) => void;
  // ...
}

const useStore = create<AppState>((set) => ({
  user: null,
  company: null,
  orders: [],
  drivers: [],
  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
}));
```

## Mobile Architecture (React Native)

### Screen Structure

```
mobile/src/
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   ├── home/
│   │   └── HomeScreen.tsx          # 3 big buttons
│   ├── orders/
│   │   ├── OrdersScreen.tsx        # List of orders
│   │   ├── OrderDetailScreen.tsx   # Order details
│   │   └── ActiveTripScreen.tsx    # Map + arrived button
│   ├── proof/
│   │   └── ProofOfDeliveryScreen.tsx
│   └── messages/
│       └── MessagesScreen.tsx      # Voice messages
├── components/
│   ├── IconButton.tsx              # Large, icon-first button
│   ├── VoiceRecorder.tsx           # Hold-to-record
│   ├── CameraCapture.tsx           # Photo capture
│   └── SignaturePad.tsx            # Signature capture
├── services/
│   ├── api.ts
│   ├── location.ts                 # Background GPS
│   ├── audio.ts                    # Voice recording
│   └── storage.ts                  # Offline storage
└── navigation/
    └── AppNavigator.tsx
```

### Arabic-First UI Components

```typescript
// IconButton.tsx - Large, icon-first button
interface IconButtonProps {
  icon: string;
  label: string;
  labelAr: string;
  onPress: () => void;
  color?: string;
}

const IconButton = ({ icon, label, labelAr, onPress, color }) => (
  <TouchableOpacity 
    style={styles.button}
    onPress={onPress}
  >
    <Icon name={icon} size={48} color={color} />
    <Text style={styles.labelAr}>{labelAr}</Text>
    <Text style={styles.labelEn}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  labelAr: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  labelEn: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
```

## Deployment Architecture

### Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: fleet_dev
      POSTGRES_USER: fleet
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: postgres
      REDIS_HOST: redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Production (Later)

```
- Single VPS (DigitalOcean $48/mo)
- Docker Compose
- NGINX reverse proxy
- Let's Encrypt SSL
- Automated backups to S3
- Monitoring (Uptime Robot)
```

## Performance Considerations

### Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_orders_company_status ON orders(company_id, status);
CREATE INDEX idx_drivers_company_status ON drivers(company_id, status);
CREATE INDEX idx_tracking_driver_time ON tracking_points(driver_id, recorded_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_active_orders ON orders(company_id) WHERE status IN ('new', 'assigned', 'in_progress');
```

### Caching Strategy

```php
// Cache driver locations (30 seconds)
Cache::remember("driver.{$driverId}.location", 30, function() {
    return TrackingPoint::where('driver_id', $driverId)
        ->latest('recorded_at')
        ->first();
});

// Cache company settings (1 hour)
Cache::remember("company.{$companyId}.settings", 3600, function() {
    return Company::find($companyId)->settings;
});
```

### Real-Time Optimization

```javascript
// Throttle location updates (every 30 seconds)
const throttledLocationUpdate = throttle((location) => {
  api.post('/tracking/location', location);
}, 30000);

// Batch tracking points
const batchTrackingPoints = [];
setInterval(() => {
  if (batchTrackingPoints.length > 0) {
    api.post('/tracking/batch', batchTrackingPoints);
    batchTrackingPoints.length = 0;
  }
}, 60000); // Every minute
```

## Security

### Authentication

```php
// Laravel Sanctum for API tokens
// Mobile app gets token on login
$token = $user->createToken('mobile-app')->plainTextToken;

// Token included in all requests
Authorization: Bearer {token}
```

### Multi-Tenant Security

```php
// Global scope ensures company isolation
class CompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('company_id', auth()->user()->company_id);
    }
}

// Applied to all models
protected static function booted()
{
    static::addGlobalScope(new CompanyScope);
}
```

### Rate Limiting

```php
// API rate limits
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Tracking endpoint (higher limit)
RateLimiter::for('tracking', function (Request $request) {
    return Limit::perMinute(120)->by($request->user()?->id);
});
```

---

**This architecture is designed to be simple, scalable, and white-label ready from day 1.**
