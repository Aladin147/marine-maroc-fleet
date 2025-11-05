# Marine Maroc Fleet Management - System Architecture

## Overview

This document describes the technical architecture of the Marine Maroc fleet management system, built on Fleetbase open-source infrastructure.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Marine Maroc Fleet                       │
│                  fleet.marinemaroc.com                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Console    │      │     API      │     │  Mobile App  │
│  (Ember.js)  │◄────►│  (Laravel)   │◄───►│(React Native)│
│   Port 4200  │      │  Port 8000   │     │  iOS/Android │
└──────────────┘      └──────────────┘     └──────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│    MySQL     │      │    Redis     │     │SocketCluster │
│   Database   │      │ Cache/Queue  │     │  WebSockets  │
│   Port 3306  │      │  Port 6379   │     │  Port 38000  │
└──────────────┘      └──────────────┘     └──────────────┘
```

---

## Component Architecture

### 1. Frontend Console (Ember.js)

**Purpose:** Web-based admin dashboard for dispatchers and managers

**Technology:**
- Ember.js 5.4 (JavaScript framework)
- Ember Engines (modular architecture)
- Tailwind CSS (styling)
- MapLibre (mapping)
- Leaflet (map interactions)

**Key Features:**
- Real-time map tracking
- Load management (Kanban board)
- Driver/vehicle management
- Location management
- Chat interface

**File Structure:**
```
console/
├── app/                    # Main application
├── config/                 # Configuration
│   └── environment.js     # Environment settings
├── public/                # Static assets
│   ├── images/           # Marine Maroc logos
│   └── favicon.ico       # Favicon
├── translations/          # i18n translations
│   └── fr-fr.yaml        # French translations
└── fleetbase.config.json # Fleetbase configuration
```

**Customization Points:**
- Branding: `public/images/`, `public/favicon.ico`
- Colors: `app/styles/custom.css`
- Config: `config/environment.js`
- Translations: `translations/fr-fr.yaml`

---

### 2. Backend API (Laravel)

**Purpose:** RESTful API and business logic

**Technology:**
- PHP 8.0+
- Laravel 10 (PHP framework)
- Fleetbase Core API
- FleetOps API extension

**Key Features:**
- RESTful API endpoints
- Authentication & authorization
- Real-time location processing
- Order workflow management
- WebSocket broadcasting
- Queue job processing

**File Structure:**
```
api/
├── app/                   # Application code
│   ├── Http/             # Controllers, middleware
│   ├── Models/           # Database models
│   └── Services/         # Business logic
├── config/               # Configuration
├── database/             # Migrations, seeders
├── routes/               # API routes
│   └── api.php          # API endpoints
├── storage/              # Logs, cache, uploads
└── .env                  # Environment variables
```

**Key Endpoints:**
```
POST   /api/v1/auth/login
GET    /api/v1/orders
POST   /api/v1/orders
PATCH  /api/v1/orders/{id}
GET    /api/v1/drivers
POST   /api/v1/tracking/location
GET    /api/v1/places
```

**Customization Points:**
- Environment: `.env`
- Extensions: `composer.json`
- Routes: `routes/api.php`

---

### 3. Mobile App (React Native)

**Purpose:** Driver-facing mobile application

**Technology:**
- React Native 0.77
- React Navigation 7
- Background geolocation
- Offline storage (MMKV)
- Push notifications

**Key Features:**
- Background GPS tracking
- Offline-capable
- Photo capture
- Signature capture
- Push notifications
- Chat

**File Structure:**
```
navigator-app/
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation config
│   ├── utils/            # Utilities
│   └── contexts/         # React contexts
├── android/              # Android native code
├── ios/                  # iOS native code
├── assets/               # Images, fonts
│   └── app-icon.png     # Marine Maroc icon
├── translations/         # i18n
│   └── fr.json          # French translations
└── .env                  # Configuration
```

**Customization Points:**
- Branding: `assets/app-icon.png`, `assets/splash-screen.png`
- Config: `.env`
- Translations: `translations/fr.json`
- App name: `android/app/src/main/res/values/strings.xml`

---

### 4. Database (MySQL)

**Purpose:** Persistent data storage

**Technology:**
- MySQL 8.0
- InnoDB storage engine

**Key Tables:**
```
orders              # Loads/shipments
order_configs       # Workflow configurations
drivers             # Driver profiles
vehicles            # Vehicle information
places              # Locations
contacts            # Customers, receivers
tracking_statuses   # GPS location history
users               # System users
companies           # Organizations
```

**Relationships:**
- Orders → Drivers (many-to-one)
- Orders → Vehicles (many-to-one)
- Orders → Places (many-to-many via waypoints)
- Drivers → Vehicles (one-to-one)
- Tracking → Drivers (many-to-one)

---

### 5. Cache & Queue (Redis)

**Purpose:** Caching and background job processing

**Technology:**
- Redis 4.0

**Use Cases:**
- Session storage
- API response caching
- Real-time location caching
- Queue for background jobs
- WebSocket pub/sub

**Key Queues:**
- `default` - General background jobs
- `notifications` - Push notifications
- `tracking` - Location processing
- `webhooks` - External integrations

---

### 6. WebSocket Server (SocketCluster)

**Purpose:** Real-time bidirectional communication

**Technology:**
- SocketCluster v17.4.0
- Node.js

**Use Cases:**
- Real-time location updates
- Live order status changes
- Chat messages
- Notifications

**Channels:**
- `tracking.{driver_id}` - Driver location updates
- `order.{order_id}` - Order status updates
- `chat.{channel_id}` - Chat messages

---

## Data Flow

### 1. Driver Location Update Flow

```
┌──────────────┐
│ Mobile App   │
│ (Background) │
└──────┬───────┘
       │ 1. GPS location captured
       │
       ▼
┌──────────────┐
│     API      │
│ POST /track  │
└──────┬───────┘
       │ 2. Validate & store
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────┐   ┌──────────┐
│  MySQL   │   │  Redis   │
│  (Store) │   │ (Cache)  │
└──────────┘   └────┬─────┘
                    │ 3. Broadcast
                    │
                    ▼
             ┌──────────────┐
             │SocketCluster │
             │  (Broadcast) │
             └──────┬───────┘
                    │ 4. Push to clients
                    │
                    ▼
             ┌──────────────┐
             │   Console    │
             │ (Map Update) │
             └──────────────┘
```

### 2. Order Assignment Flow

```
┌──────────────┐
│  Dispatcher  │
│  (Console)   │
└──────┬───────┘
       │ 1. Assign order to driver
       │
       ▼
┌──────────────┐
│     API      │
│ PATCH /order │
└──────┬───────┘
       │ 2. Update database
       │
       ▼
┌──────────────┐
│    MySQL     │
└──────┬───────┘
       │ 3. Queue notification
       │
       ▼
┌──────────────┐
│    Redis     │
│   (Queue)    │
└──────┬───────┘
       │ 4. Process job
       │
       ▼
┌──────────────┐
│ Push Service │
│   (FCM/APNs) │
└──────┬───────┘
       │ 5. Send notification
       │
       ▼
┌──────────────┐
│ Mobile App   │
│ (Driver)     │
└──────────────┘
```

### 3. Proof of Delivery Flow

```
┌──────────────┐
│ Mobile App   │
│  (Driver)    │
└──────┬───────┘
       │ 1. Capture photo + signature
       │
       ▼
┌──────────────┐
│     API      │
│ POST /proof  │
└──────┬───────┘
       │ 2. Upload to S3/storage
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────┐   ┌──────────┐
│  Storage │   │  MySQL   │
│ (S3/Local)│   │ (Metadata)│
└──────────┘   └────┬─────┘
                    │ 3. Update order status
                    │
                    ▼
             ┌──────────────┐
             │SocketCluster │
             │  (Broadcast) │
             └──────┬───────┘
                    │ 4. Notify console
                    │
                    ▼
             ┌──────────────┐
             │   Console    │
             │ (Status Update)│
             └──────────────┘
```

---

## Deployment Architecture

### Docker Compose Services

```yaml
services:
  application:    # Laravel API (FrankenPHP)
  httpd:          # NGINX reverse proxy
  console:        # Ember.js static files
  database:       # MySQL 8.0
  cache:          # Redis 4.0
  queue:          # Laravel queue worker
  scheduler:      # Cron jobs
  socket:         # SocketCluster
```

### Network Architecture

```
                    Internet
                       │
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              │   (NGINX/ALB)  │
              └────────┬───────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌────────┐   ┌────────┐   ┌────────┐
    │Console │   │  API   │   │ Socket │
    │ :4200  │   │ :8000  │   │ :38000 │
    └────────┘   └───┬────┘   └────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ MySQL  │  │ Redis  │  │ Queue  │
    │ :3306  │  │ :6379  │  │ Worker │
    └────────┘  └────────┘  └────────┘
```

---

## Security Architecture

### Authentication Flow

```
1. User Login
   ↓
2. API validates credentials
   ↓
3. Generate JWT token
   ↓
4. Return token to client
   ↓
5. Client stores token (localStorage/Keychain)
   ↓
6. Include token in API requests (Authorization header)
   ↓
7. API validates token on each request
```

### Security Layers

**Transport Security:**
- HTTPS/TLS 1.3 (Let's Encrypt)
- Certificate pinning (mobile app)
- Secure WebSocket (WSS)

**Authentication:**
- JWT tokens (24-hour expiry)
- Refresh tokens (30-day expiry)
- Password hashing (bcrypt)

**Authorization:**
- Role-based access control (RBAC)
- Permission-based actions
- Company-level data isolation

**Data Security:**
- Database encryption at rest
- Encrypted backups
- Secure environment variables
- API rate limiting

---

## Scalability Considerations

### Current Capacity (MVP)
- 50 concurrent drivers
- 100 active orders
- 1000 location updates/minute
- 10 concurrent dispatchers

### Scaling Strategy

**Horizontal Scaling:**
- Add more API containers (Docker/ECS)
- Load balancer distribution
- Redis cluster for cache
- MySQL read replicas

**Vertical Scaling:**
- Increase server resources
- Optimize database queries
- Add database indexes
- Implement caching layers

**Performance Optimization:**
- CDN for static assets (CloudFront)
- Database query optimization
- Redis caching strategy
- Background job processing

---

## Monitoring & Logging

### Metrics to Track

**Application:**
- API response times
- Error rates
- Queue job processing time
- WebSocket connection count

**Infrastructure:**
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth

**Business:**
- Active drivers
- Orders per day
- Average delivery time
- Location update frequency

### Logging Strategy

**Application Logs:**
- Laravel logs → `storage/logs/`
- Log level: INFO (production)
- Rotation: Daily, keep 14 days

**Access Logs:**
- NGINX access logs
- API request logs
- WebSocket connection logs

**Error Tracking:**
- Laravel error handler
- Sentry integration (optional)
- Email alerts for critical errors

---

## Backup Strategy

### Database Backups
- Frequency: Daily at 2 AM
- Retention: 30 days
- Storage: S3 or local storage
- Encryption: AES-256

### File Backups
- Proof of delivery photos
- User uploads
- Configuration files

### Disaster Recovery
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 24 hours
- Backup restoration testing: Monthly

---

## Technology Decisions

### Why Fleetbase?
- ✅ Open-source (AGPL-3.0)
- ✅ Proven fleet management features
- ✅ Modular architecture
- ✅ Active development
- ✅ Good documentation

### Why Laravel?
- ✅ Mature PHP framework
- ✅ Excellent ORM (Eloquent)
- ✅ Built-in queue system
- ✅ Large ecosystem
- ✅ Good performance

### Why Ember.js?
- ✅ Fleetbase uses it
- ✅ Convention over configuration
- ✅ Ember Engines (modularity)
- ✅ Stable releases

### Why React Native?
- ✅ Cross-platform (iOS + Android)
- ✅ Single codebase
- ✅ Native performance
- ✅ Large community
- ✅ Background geolocation support

### Why Docker?
- ✅ Consistent environments
- ✅ Easy deployment
- ✅ Service isolation
- ✅ Scalability
- ✅ Portability

---

## Future Architecture Considerations

### Phase 2 Enhancements

**Microservices:**
- Separate tracking service
- Notification service
- Analytics service

**Advanced Features:**
- Elasticsearch for search
- TimescaleDB for time-series data
- Message queue (RabbitMQ/SQS)
- CDN for global distribution

**Multi-Tenancy:**
- Separate databases per client
- Shared infrastructure
- White-label deployment automation

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Active
