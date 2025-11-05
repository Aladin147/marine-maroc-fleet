# Phase 2: Backend Customization - Design Document

## Overview

This document outlines the technical design for Phase 2 of the Marine Maroc fleet management system. Phase 2 focuses on backend customization including multi-language support (French + Arabic), simplified order workflows, external service integration, and API optimization.

## Architecture

### High-Level Architecture

```
Backend Services (Phase 2 Focus)
├── Laravel API
│   ├── Multi-Language Support
│   │   ├── French (Console)
│   │   └── Arabic (Mobile App)
│   ├── Simplified Workflow Engine
│   │   └── 4-Stage Workflow
│   ├── External Services
│   │   ├── Google Maps API
│   │   ├── OSRM Routing
│   │   └── SMTP Email
│   └── Performance Optimization
│       ├── Redis Caching
│       ├── Query Optimization
│       └── API Response Time
└── Database
    ├── UTF-8 Encoding (Arabic support)
    ├── Workflow Configuration
    └── Translation Tables
```

## Components and Interfaces

### 1. Multi-Language System

**Approach:** Laravel's built-in localization with custom translation files.

**Implementation:**

**Translation Files Structure:**
```
api/resources/lang/
├── fr/                    # French (Console)
│   ├── messages.php
│   ├── validation.php
│   └── orders.php
└── ar/                    # Arabic (Mobile App)
    ├── messages.php
    ├── validation.php
    └── orders.php
```

**Order Status Translations:**
```php
// resources/lang/fr/orders.php
return [
    'status' => [
        'new' => 'Nouveau',
        'assigned' => 'Assigné',
        'in_progress' => 'En Route',
        'delivered' => 'Livré',
    ],
];

// resources/lang/ar/orders.php
return [
    'status' => [
        'new' => 'جديد',
        'assigned' => 'مُعيّن',
        'in_progress' => 'في الطريق',
        'delivered' => 'تم التسليم',
    ],
];
```

**API Language Detection:**
```php
// app/Http/Middleware/SetLocale.php
public function handle($request, Closure $next)
{
    $locale = $request->header('Accept-Language', 'fr');
    
    // Mobile app sends 'ar', Console sends 'fr'
    if (in_array($locale, ['fr', 'ar'])) {
        app()->setLocale($locale);
    }
    
    return $next($request);
}
```

**API Response with Translations:**
```php
// app/Http/Controllers/OrderController.php
public function show($id)
{
    $order = Order::find($id);
    
    return response()->json([
        'id' => $order->id,
        'status' => $order->status,
        'status_label' => __('orders.status.' . $order->status),
        // Returns 'Nouveau' for French, 'جديد' for Arabic
    ]);
}
```

### 2. Simplified Workflow System

**Approach:** Pre-configured 4-stage workflow, disable workflow builder.

**Workflow Stages:**
1. **new** (Nouveau / جديد)
2. **assigned** (Assigné / مُعيّن)
3. **in_progress** (En Route / في الطريق)
4. **delivered** (Livré / تم التسليم)

**Database Schema:**
```sql
-- Workflow configuration (pre-seeded)
CREATE TABLE order_workflows (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    stages JSON,  -- ['new', 'assigned', 'in_progress', 'delivered']
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Order status tracking
ALTER TABLE orders ADD COLUMN status ENUM('new', 'assigned', 'in_progress', 'delivered') DEFAULT 'new';
ALTER TABLE orders ADD COLUMN status_updated_at TIMESTAMP;
```

**Workflow Seeder:**
```php
// database/seeders/WorkflowSeeder.php
public function run()
{
    DB::table('order_workflows')->insert([
        'name' => 'Marine Maroc Default Workflow',
        'stages' => json_encode([
            ['key' => 'new', 'color' => '#718096'],
            ['key' => 'assigned', 'color' => '#00CED1'],
            ['key' => 'in_progress', 'color' => '#ED8936'],
            ['key' => 'delivered', 'color' => '#48BB78'],
        ]),
        'is_default' => true,
    ]);
}
```

**Workflow Transition Logic:**
```php
// app/Services/OrderWorkflowService.php
class OrderWorkflowService
{
    private $allowedTransitions = [
        'new' => ['assigned'],
        'assigned' => ['in_progress'],
        'in_progress' => ['delivered'],
        'delivered' => [], // Final state
    ];
    
    public function transitionTo(Order $order, string $newStatus)
    {
        $currentStatus = $order->status;
        
        if (!in_array($newStatus, $this->allowedTransitions[$currentStatus])) {
            throw new InvalidWorkflowTransitionException();
        }
        
        $order->update([
            'status' => $newStatus,
            'status_updated_at' => now(),
        ]);
        
        // Trigger events (notifications, etc.)
        event(new OrderStatusChanged($order, $currentStatus, $newStatus));
    }
}
```

### 3. Google Maps Integration

**Configuration:**
```php
// config/services.php
return [
    'google_maps' => [
        'api_key' => env('GOOGLE_MAPS_API_KEY'),
        'locale' => env('GOOGLE_MAPS_LOCALE', 'fr'),
    ],
];
```

**Geocoding Service:**
```php
// app/Services/GeocodingService.php
class GeocodingService
{
    public function geocode(string $address): array
    {
        $apiKey = config('services.google_maps.api_key');
        $locale = config('services.google_maps.locale');
        
        $url = "https://maps.googleapis.com/maps/api/geocode/json";
        $params = [
            'address' => $address,
            'key' => $apiKey,
            'language' => $locale,
        ];
        
        $response = Http::get($url, $params);
        $data = $response->json();
        
        if ($data['status'] === 'OK') {
            $location = $data['results'][0]['geometry']['location'];
            return [
                'lat' => $location['lat'],
                'lng' => $location['lng'],
            ];
        }
        
        throw new GeocodingException('Failed to geocode address');
    }
}
```

### 4. OSRM Routing Integration

**Configuration:**
```php
// config/services.php
return [
    'osrm' => [
        'host' => env('OSRM_HOST', 'https://router.project-osrm.org'),
    ],
];
```

**Routing Service:**
```php
// app/Services/RoutingService.php
class RoutingService
{
    public function calculateRoute(array $from, array $to): array
    {
        $host = config('services.osrm.host');
        $url = "{$host}/route/v1/driving/{$from['lng']},{$from['lat']};{$to['lng']},{$to['lat']}";
        
        $params = [
            'overview' => 'full',
            'geometries' => 'geojson',
        ];
        
        try {
            $response = Http::get($url, $params);
            $data = $response->json();
            
            if ($data['code'] === 'Ok') {
                $route = $data['routes'][0];
                return [
                    'distance' => $route['distance'] / 1000, // Convert to km
                    'duration' => $route['duration'] / 60,   // Convert to minutes
                    'geometry' => $route['geometry'],
                ];
            }
        } catch (\Exception $e) {
            // Fallback to straight-line distance
            return $this->calculateStraightLine($from, $to);
        }
        
        throw new RoutingException('Failed to calculate route');
    }
    
    private function calculateStraightLine(array $from, array $to): array
    {
        // Haversine formula for straight-line distance
        $earthRadius = 6371; // km
        
        $latFrom = deg2rad($from['lat']);
        $lonFrom = deg2rad($from['lng']);
        $latTo = deg2rad($to['lat']);
        $lonTo = deg2rad($to['lng']);
        
        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;
        
        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos($latFrom) * cos($latTo) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        
        $distance = $earthRadius * $c;
        
        return [
            'distance' => $distance,
            'duration' => $distance / 80 * 60, // Assume 80 km/h average speed
            'geometry' => null, // No route geometry for straight line
        ];
    }
}
```

### 5. Email Service Configuration

**Configuration:**
```php
// config/mail.php
return [
    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.gmail.com'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
        ],
    ],
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@marinemaroc.com'),
        'name' => env('MAIL_FROM_NAME', 'Marine Maroc Fleet'),
    ],
];
```

**Email Templates (French):**
```php
// resources/views/emails/order-assigned.blade.php
@component('mail::message')
# Nouvelle Affectation

Bonjour {{ $driver->name }},

Un nouveau chargement vous a été assigné:

**De:** {{ $order->pickup_location }}  
**À:** {{ $order->delivery_location }}  
**Client:** {{ $order->customer_name }}

@component('mail::button', ['url' => $appUrl])
Voir le Chargement
@endcomponent

Merci,  
{{ config('app.name') }}
@endcomponent
```

**Notification Job:**
```php
// app/Jobs/SendOrderAssignedNotification.php
class SendOrderAssignedNotification implements ShouldQueue
{
    public function handle()
    {
        Mail::to($this->driver->email)
            ->send(new OrderAssigned($this->order, $this->driver));
    }
}
```

### 6. API Performance Optimization

**Redis Caching Strategy:**
```php
// app/Services/CacheService.php
class CacheService
{
    public function cacheDriverLocations(Driver $driver, array $location)
    {
        $key = "driver:{$driver->id}:location";
        Cache::put($key, $location, now()->addMinutes(5));
    }
    
    public function getDriverLocation(Driver $driver): ?array
    {
        $key = "driver:{$driver->id}:location";
        return Cache::get($key);
    }
    
    public function cacheActiveOrders()
    {
        $key = "orders:active";
        return Cache::remember($key, now()->addMinutes(2), function () {
            return Order::whereIn('status', ['assigned', 'in_progress'])
                ->with(['driver', 'vehicle'])
                ->get();
        });
    }
}
```

**Database Query Optimization:**
```php
// Add indexes for frequently queried columns
Schema::table('orders', function (Blueprint $table) {
    $table->index('status');
    $table->index('driver_id');
    $table->index('created_at');
    $table->index(['status', 'driver_id']); // Composite index
});

Schema::table('tracking_statuses', function (Blueprint $table) {
    $table->index('driver_id');
    $table->index('created_at');
    $table->index(['driver_id', 'created_at']); // Composite index
});
```

**Eager Loading to Prevent N+1:**
```php
// app/Http/Controllers/OrderController.php
public function index()
{
    $orders = Order::with([
        'driver',
        'vehicle',
        'pickup_place',
        'delivery_place',
        'customer',
    ])->paginate(20);
    
    return response()->json($orders);
}
```

**API Response Caching:**
```php
// app/Http/Middleware/CacheResponse.php
public function handle($request, Closure $next)
{
    if ($request->method() === 'GET') {
        $key = 'api:' . md5($request->fullUrl());
        
        return Cache::remember($key, now()->addMinutes(1), function () use ($request, $next) {
            return $next($request);
        });
    }
    
    return $next($request);
}
```

## Data Models

### Translation Storage

**Option 1: JSON Columns (Recommended)**
```php
// Migration
Schema::table('orders', function (Blueprint $table) {
    $table->json('status_translations')->nullable();
});

// Model
class Order extends Model
{
    protected $casts = [
        'status_translations' => 'array',
    ];
    
    public function getStatusLabelAttribute()
    {
        $locale = app()->getLocale();
        return $this->status_translations[$locale] ?? $this->status;
    }
}
```

**Option 2: Separate Translation Table**
```sql
CREATE TABLE translations (
    id INT PRIMARY KEY,
    translatable_type VARCHAR(255),
    translatable_id INT,
    locale VARCHAR(5),
    key VARCHAR(255),
    value TEXT,
    INDEX(translatable_type, translatable_id, locale)
);
```

## Error Handling

### Multi-Language Error Messages

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($exception instanceof ValidationException) {
        $locale = $request->header('Accept-Language', 'fr');
        app()->setLocale($locale);
        
        return response()->json([
            'message' => __('validation.failed'),
            'errors' => $exception->errors(),
        ], 422);
    }
    
    return parent::render($request, $exception);
}
```

### Graceful Degradation

```php
// If Google Maps fails, use OSRM
// If OSRM fails, use straight-line distance
// If email fails, queue for retry
// If Redis fails, skip caching
```

## Testing Strategy

### Unit Tests

**Translation Tests:**
```php
// tests/Unit/TranslationTest.php
public function test_order_status_translates_to_french()
{
    app()->setLocale('fr');
    $this->assertEquals('Nouveau', __('orders.status.new'));
}

public function test_order_status_translates_to_arabic()
{
    app()->setLocale('ar');
    $this->assertEquals('جديد', __('orders.status.new'));
}
```

**Workflow Tests:**
```php
// tests/Unit/WorkflowTest.php
public function test_order_can_transition_from_new_to_assigned()
{
    $order = Order::factory()->create(['status' => 'new']);
    $service = new OrderWorkflowService();
    
    $service->transitionTo($order, 'assigned');
    
    $this->assertEquals('assigned', $order->fresh()->status);
}

public function test_order_cannot_skip_workflow_stages()
{
    $order = Order::factory()->create(['status' => 'new']);
    $service = new OrderWorkflowService();
    
    $this->expectException(InvalidWorkflowTransitionException::class);
    $service->transitionTo($order, 'delivered'); // Skip stages
}
```

### Integration Tests

**External Services:**
```php
// tests/Integration/GeocodingTest.php
public function test_geocoding_service_returns_coordinates()
{
    $service = new GeocodingService();
    $result = $service->geocode('Casablanca, Morocco');
    
    $this->assertArrayHasKey('lat', $result);
    $this->assertArrayHasKey('lng', $result);
}
```

## Performance Targets

- API response time: <500ms (95th percentile)
- Database query time: <100ms
- Cache hit rate: >80%
- Email delivery: <5 seconds (queued)
- Geocoding: <2 seconds
- Routing calculation: <3 seconds

## Security Considerations

### API Rate Limiting

```php
// config/api.php
'throttle' => [
    'api' => [
        'limit' => 60,
        'per_minute' => 1,
    ],
];
```

### Input Validation

```php
// app/Http/Requests/CreateOrderRequest.php
public function rules()
{
    return [
        'pickup_location' => 'required|string|max:255',
        'delivery_location' => 'required|string|max:255',
        'customer_id' => 'required|exists:contacts,id',
        'driver_id' => 'nullable|exists:drivers,id',
    ];
}
```

## Deployment Considerations

### Environment Variables

```bash
# .env
APP_LOCALE=fr
FALLBACK_LOCALE=fr
SUPPORTED_LOCALES=fr,ar

GOOGLE_MAPS_API_KEY=your_key_here
GOOGLE_MAPS_LOCALE=fr

OSRM_HOST=https://router.project-osrm.org

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@marinemaroc.com
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@marinemaroc.com
MAIL_FROM_NAME="Marine Maroc Fleet"

REDIS_HOST=cache
REDIS_PORT=6379
```

### Database Migrations

```bash
# Run migrations
php artisan migrate

# Seed workflow
php artisan db:seed --class=WorkflowSeeder

# Seed translations
php artisan db:seed --class=TranslationSeeder
```

## Future Considerations

### Phase 3 Preparation

- Arabic font selection for mobile app
- RTL layout considerations
- Icon library for mobile app
- Voice message storage strategy

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for Implementation
