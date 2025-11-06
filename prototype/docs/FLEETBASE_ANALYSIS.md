# Fleetbase Analysis - What to Extract

## Overview

This document analyzes Fleetbase to identify reusable patterns, code, and concepts we can extract to accelerate our own engine development.

## What Fleetbase Does Well (Extract These)

### 1. Multi-Tenant Architecture Pattern

**Location:** `fleetbase/api/app/Models/`

**Key Concept:**
```php
// Global scope for company isolation
trait HasCompany {
    protected static function bootHasCompany() {
        static::addGlobalScope(new CompanyScope);
    }
}

// Every model uses this trait
class Order extends Model {
    use HasCompany;
}
```

**Extract:** The pattern, not the code. Implement our own version.

### 2. Real-Time Location Tracking

**Location:** `fleetbase/api/app/Http/Controllers/TrackingController.php`

**Key Concepts:**
- GPS point storage structure
- Location update throttling
- WebSocket broadcasting pattern
- Efficient querying of recent locations

**Extract:** Database schema design, API endpoint structure

### 3. Order Workflow System

**Location:** `fleetbase/fleetops/server/src/models/order.js`

**Key Concepts:**
- Status transitions (new → assigned → in_progress → completed)
- Workflow validation
- Event hooks on status change

**Extract:** State machine pattern, not the complex workflow builder

### 4. Map Integration

**Location:** `fleetbase/console/app/components/map/`

**Key Concepts:**
- Vehicle markers with real-time updates
- Route polylines
- Clustering for many vehicles
- Map controls and interactions

**Extract:** Component structure, not Ember-specific code

### 5. File Upload Handling

**Location:** `fleetbase/api/app/Http/Controllers/FileController.php`

**Key Concepts:**
- S3 integration
- Image optimization
- Secure URL generation
- File type validation

**Extract:** Upload flow, security patterns

## What to Skip (Too Complex for MVP)

### 1. Complex Workflow Builder
- Visual workflow designer
- Custom status definitions
- Conditional transitions
- **Skip:** Use fixed 4-stage workflow

### 2. Advanced Routing Engine
- Multi-stop optimization
- Route calculation algorithms
- ETA predictions
- **Skip:** Use Google Maps Directions API

### 3. Telematics Integration
- Hardware device protocols
- OBD-II parsing
- Sensor data processing
- **Skip:** Not needed for MVP

### 4. Analytics Engine
- Custom report builder
- Data aggregation pipelines
- Chart generation
- **Skip:** Phase 2 feature

### 5. Service Rate Management
- Complex pricing rules
- Rate calculations
- Invoice generation
- **Skip:** Not needed for fleet tracking

## Database Schema to Extract

### Core Tables (Simplify These)

```sql
-- From Fleetbase, extract the structure:

companies (
    id, name, subdomain, settings, created_at
)

users (
    id, company_id, name, email, password, role
)

drivers (
    id, company_id, name, phone, status, current_location
)

vehicles (
    id, company_id, plate_number, make, model, driver_id
)

orders (
    id, company_id, status, pickup_location, delivery_location,
    driver_id, vehicle_id, scheduled_at, started_at, completed_at
)

tracking_statuses (
    id, driver_id, latitude, longitude, recorded_at
)

places (
    id, company_id, name, address, latitude, longitude
)
```

**Simplifications:**
- Remove unused fields
- Flatten nested relationships
- Use JSONB for flexible data instead of many tables

## API Patterns to Extract

### RESTful Structure

```
Fleetbase uses:
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/{id}
PATCH  /api/v1/orders/{id}
DELETE /api/v1/orders/{id}

Extract: Clean REST conventions
```

### Authentication Flow

```
Fleetbase uses:
1. Login → JWT token
2. Token in Authorization header
3. Token refresh mechanism

Extract: Same pattern with Laravel Sanctum
```

### Real-Time Events

```
Fleetbase uses SocketCluster:
- Channel per company
- Channel per driver
- Channel per order

Extract: Same channel structure with Laravel Reverb
```

## Mobile App Patterns to Extract

### Location Tracking

**From:** `navigator-app/src/services/location.js`

**Extract:**
- Background location configuration
- Battery optimization strategies
- Offline queue for location points
- Sync when connection restored

### Offline Support

**From:** `navigator-app/src/services/storage.js`

**Extract:**
- Local storage structure
- Sync queue management
- Conflict resolution strategy

### Push Notifications

**From:** `navigator-app/src/services/notifications.js`

**Extract:**
- Notification handling
- Deep linking to orders
- Badge count management

## Code We Can Directly Reuse

### 1. Database Migrations Pattern

```php
// Fleetbase migration structure is clean
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('company_id')->constrained();
    $table->string('status');
    $table->timestamps();
});
```

**Reuse:** Migration structure, foreign key patterns

### 2. API Resource Transformers

```php
// Fleetbase uses clean resource transformers
class OrderResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'driver' => new DriverResource($this->driver),
        ];
    }
}
```

**Reuse:** Resource pattern for API responses

### 3. Validation Rules

```php
// Fleetbase has good validation
$request->validate([
    'pickup_location' => 'required|exists:places,id',
    'delivery_location' => 'required|exists:places,id',
    'driver_id' => 'nullable|exists:drivers,id',
]);
```

**Reuse:** Validation patterns

## What NOT to Extract

### 1. Ember.js Frontend
- Too complex
- Outdated patterns
- **Replace with:** Modern React

### 2. SocketCluster
- Extra dependency
- Complex setup
- **Replace with:** Laravel Reverb (simpler)

### 3. Complex Extension System
- Over-engineered for our needs
- **Replace with:** Simple feature flags

### 4. Multi-Database Support
- Unnecessary complexity
- **Use:** PostgreSQL only

## Extraction Strategy

### Phase 1: Study (1-2 days)
1. Clone Fleetbase locally
2. Run it and explore features
3. Read key files (models, controllers, migrations)
4. Document patterns we like

### Phase 2: Design (1 day)
1. Design our simplified schema
2. Plan API endpoints
3. Sketch component structure
4. Document differences from Fleetbase

### Phase 3: Build (2-3 weeks)
1. Implement backend from scratch (inspired by Fleetbase)
2. Build React frontend (new approach)
3. Create mobile app (Arabic-first)
4. Test and iterate

## Key Takeaways

**Extract:**
- ✅ Multi-tenant patterns
- ✅ Database schema structure
- ✅ API endpoint conventions
- ✅ Real-time event patterns
- ✅ Location tracking approach

**Don't Extract:**
- ❌ Complex workflow builder
- ❌ Ember.js frontend
- ❌ SocketCluster
- ❌ Extension system
- ❌ Advanced features we don't need

**Build Fresh:**
- React admin dashboard
- Arabic-first mobile UI
- Simplified workflow
- Modern WebSocket (Laravel Reverb)
- Clean, minimal codebase

---

**Goal:** Learn from Fleetbase, but build something simpler and better suited to our white-label needs.
