# Phase 1: Foundation - Design Document

## Overview

This document outlines the technical design for Phase 1 of the Marine Maroc fleet management system. Phase 1 focuses on establishing a clean, working development environment with unnecessary features removed and basic branding applied.

## Architecture

### High-Level Architecture

```
Development Environment
├── Fleetbase Core (Docker)
│   ├── API (Laravel) - Port 8000
│   ├── Console (Ember.js) - Port 4200
│   ├── MySQL - Port 3306
│   ├── Redis - Port 6379
│   ├── SocketCluster - Port 38000
│   ├── Queue Worker
│   └── Scheduler
├── FleetOps Extension
│   ├── Backend (PHP)
│   └── Frontend (Ember Engine)
└── Navigator App (React Native)
    ├── iOS
    └── Android
```

### Directory Structure

```
marine-maroc-fleet/
├── fleetbase/
│   ├── api/                    # Laravel backend
│   │   ├── app/
│   │   ├── config/
│   │   ├── database/
│   │   ├── routes/
│   │   └── .env               # Environment config
│   ├── console/               # Ember.js frontend
│   │   ├── app/
│   │   ├── config/
│   │   ├── public/
│   │   │   └── images/       # Marine Maroc logos
│   │   └── translations/
│   └── docker-compose.yml
├── fleetops/                  # Fleet operations extension
│   ├── addon/                # Frontend
│   └── server/               # Backend
├── navigator-app/            # Mobile app
│   ├── src/
│   ├── android/
│   └── ios/
├── assets/                   # Branding assets
│   └── logo-footer.png
└── docs/                     # Documentation
```

## Components and Interfaces

### 1. Docker Environment

**Purpose:** Containerized development environment for consistent setup across machines.

**Services:**
- **application**: Laravel API (FrankenPHP)
- **httpd**: NGINX reverse proxy
- **console**: Ember.js static files
- **database**: MySQL 8.0
- **cache**: Redis 4.0
- **queue**: Laravel queue worker
- **scheduler**: Cron job scheduler
- **socket**: SocketCluster WebSocket server

**Configuration:**
```yaml
# docker-compose.yml (simplified)
services:
  database:
    image: mysql:8.0-oracle
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"
      MYSQL_DATABASE: "fleetbase"
    ports:
      - "3306:3306"
  
  cache:
    image: redis:4-alpine
    
  application:
    image: fleetbase/fleetbase-api:latest
    environment:
      DATABASE_URL: "mysql://root@database/fleetbase"
      REDIS_URL: "tcp://cache"
    depends_on:
      - database
      - cache
```

### 2. Feature Removal System

**Approach:** Route-based and configuration-based feature disabling.

**Implementation Strategy:**

**Backend (Laravel):**
```php
// config/fleetbase.php
return [
    'disabled_extensions' => [
        'storefront',
        'maintenance',
        'analytics',
    ],
    'disabled_features' => [
        'service_rates',
        'telematics',
        'vendors',
    ],
];
```

**Frontend (Ember.js):**
```javascript
// console/config/environment.js
ENV.APP.disabledFeatures = [
    'storefront',
    'maintenance',
    'analytics',
    'service-rates',
    'telematics',
    'vendors',
];
```

**Route Filtering:**
```javascript
// console/app/routes/application.js
beforeModel() {
    const disabledFeatures = config.APP.disabledFeatures;
    const currentRoute = this.router.currentRouteName;
    
    if (disabledFeatures.some(feature => currentRoute.includes(feature))) {
        this.transitionTo('index');
    }
}
```

### 3. Navigation Simplification

**Design:** Replace complex multi-level navigation with flat, focused menu.

**Before (Fleetbase Default):**
```
Operations
├── Orders
├── Service Rates
├── Scheduler
└── Routes

Management
├── Fleets
├── Drivers
├── Vehicles
├── Places
├── Contacts
├── Vendors
├── Fuel Reports
└── Issues

Connectivity
├── Telematics
├── Devices
└── Tracking

Maintenance
├── Work Orders
├── Equipment
└── Parts

Analytics
└── Reports
```

**After (Marine Maroc MVP):**
```
Chargements (Orders/Loads)
Chauffeurs (Drivers)
Véhicules (Vehicles)
Lieux (Places)
Carte (Map)
```

**Implementation:**
```javascript
// console/app/templates/components/main-navigation.hbs
<nav class="main-navigation">
    <LinkTo @route="operations.orders">
        <FaIcon @icon="box" />
        <span>Chargements</span>
    </LinkTo>
    
    <LinkTo @route="management.drivers">
        <FaIcon @icon="user" />
        <span>Chauffeurs</span>
    </LinkTo>
    
    <LinkTo @route="management.vehicles">
        <FaIcon @icon="truck" />
        <span>Véhicules</span>
    </LinkTo>
    
    <LinkTo @route="management.places">
        <FaIcon @icon="map-marker" />
        <span>Lieux</span>
    </LinkTo>
    
    <LinkTo @route="operations.map">
        <FaIcon @icon="map" />
        <span>Carte</span>
    </LinkTo>
</nav>
```

### 4. Basic Branding System

**Approach:** Asset replacement and configuration updates.

**Logo Placement:**
```
console/public/images/
├── logo-header.png      # 180x50px - Header navigation
├── logo-login.png       # 300x100px - Login page
├── logo-footer.png      # 150x40px - Footer
└── favicon.ico          # 32x32px - Browser tab
```

**Configuration Updates:**
```javascript
// console/config/environment.js
ENV.APP = {
    name: 'Marine Maroc Fleet',
    title: 'Gestion de Flotte Marine Maroc',
    logo: '/images/logo-header.png',
    favicon: '/favicon.ico',
};
```

**Template Updates:**
```handlebars
{{!-- console/app/templates/application.hbs --}}
<header class="app-header">
    <img src={{config.APP.logo}} alt={{config.APP.name}} />
    <h1>{{config.APP.title}}</h1>
</header>
```

**Remove Fleetbase Branding:**
```handlebars
{{!-- console/app/templates/components/footer.hbs --}}
{{!-- Remove or comment out: --}}
{{!-- <div class="powered-by">Powered by Fleetbase</div> --}}

<footer class="app-footer">
    <p>&copy; 2025 Marine Maroc. Tous droits réservés.</p>
</footer>
```

## Data Models

### Database Schema (Existing - No Changes in Phase 1)

**Core Tables:**
- `users` - System users (dispatchers, admins)
- `companies` - Organizations (Marine Maroc)
- `drivers` - Driver profiles
- `vehicles` - Vehicle information
- `orders` - Loads/shipments
- `places` - Locations (pickup/delivery)
- `contacts` - Customers, receivers
- `tracking_statuses` - GPS location history

**Phase 1 Focus:** Ensure all tables are created and accessible, no schema modifications.

## Error Handling

### Docker Service Failures

**Scenario:** Database container fails to start

**Handling:**
```bash
# Check logs
docker-compose logs database

# Common issues:
# 1. Port 3306 already in use
# 2. Insufficient disk space
# 3. Corrupted data directory

# Resolution:
docker-compose down
docker-compose up -d database
```

### Missing Dependencies

**Scenario:** Node modules not installed

**Handling:**
```bash
# Console
cd fleetbase/console
pnpm install

# Mobile app
cd navigator-app
yarn install
```

### Configuration Errors

**Scenario:** Missing environment variables

**Handling:**
```bash
# Check .env file exists
ls -la fleetbase/api/.env

# Copy from example if missing
cp fleetbase/api/.env.example fleetbase/api/.env

# Generate application key
docker-compose exec application php artisan key:generate
```

## Testing Strategy

### Unit Tests

**Not required for Phase 1** - Focus on integration and manual testing.

### Integration Tests

**Database Connectivity:**
```bash
# Test MySQL connection
docker-compose exec database mysql -u root -e "SELECT 1"

# Test Redis connection
docker-compose exec cache redis-cli ping
```

**API Health Check:**
```bash
# Test API is responding
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","timestamp":"2025-11-05T10:00:00Z"}
```

**Console Loading:**
```bash
# Test console loads
curl -I http://localhost:4200

# Expected: HTTP 200 OK
```

### Manual Testing Checklist

**Environment Setup:**
- [ ] All Docker containers start successfully
- [ ] Console loads at http://localhost:4200
- [ ] API responds at http://localhost:8000
- [ ] Database accepts connections
- [ ] Redis accepts connections

**Feature Removal:**
- [ ] Storefront menu items not visible
- [ ] Maintenance section not accessible
- [ ] Analytics dashboard not shown
- [ ] Telematics features hidden
- [ ] Service rates not displayed

**Navigation:**
- [ ] Only 5 main menu items visible
- [ ] Chargements page loads
- [ ] Chauffeurs page loads
- [ ] Véhicules page loads
- [ ] Lieux page loads
- [ ] Carte page loads

**Branding:**
- [ ] Marine Maroc logo in header
- [ ] Marine Maroc logo on login page
- [ ] Favicon shows Marine Maroc icon
- [ ] App name shows "Marine Maroc Fleet"
- [ ] No "Powered by Fleetbase" text

**Database:**
- [ ] Admin account can be created
- [ ] Login works with admin account
- [ ] Database tables exist
- [ ] CRUD operations work

### Performance Testing

**Not required for Phase 1** - Focus on functionality.

## Implementation Notes

### Development Workflow

1. **Clone Repositories**
   ```bash
   git clone https://github.com/fleetbase/fleetbase.git
   git clone https://github.com/fleetbase/fleetops.git
   git clone https://github.com/fleetbase/navigator-app.git
   ```

2. **Start Services**
   ```bash
   cd fleetbase
   ./scripts/docker-install.sh
   ```

3. **Remove Features**
   - Update configuration files
   - Comment out routes
   - Hide UI components

4. **Apply Branding**
   - Copy logo files
   - Update configurations
   - Modify templates

5. **Test Everything**
   - Manual testing checklist
   - Integration tests
   - Document issues

### Code Organization

**Configuration Files:**
- `fleetbase/api/.env` - Backend environment
- `fleetbase/console/config/environment.js` - Frontend config
- `fleetbase/docker-compose.yml` - Docker services

**Branding Files:**
- `fleetbase/console/public/images/` - Logo assets
- `fleetbase/console/app/styles/custom.css` - Custom styles
- `fleetbase/console/app/templates/` - Template modifications

**Documentation:**
- `docs/setup.md` - Setup instructions
- `docs/architecture.md` - Technical architecture
- `README.md` - Project overview

### Dependencies

**Backend:**
- PHP 8.0+
- Composer
- Laravel 10

**Frontend:**
- Node.js 18+
- pnpm or npm
- Ember.js 5.4

**Mobile:**
- Node.js 18+
- Yarn
- React Native 0.77
- Xcode (iOS)
- Android Studio (Android)

**Infrastructure:**
- Docker 20.10+
- Docker Compose 2.0+

## Security Considerations

### Phase 1 Security (Development Only)

**Not Production-Ready:**
- Default passwords acceptable
- HTTP (not HTTPS) acceptable
- Debug mode enabled
- Detailed error messages shown

**Basic Security:**
- Password hashing (bcrypt)
- Session management
- CSRF protection (Laravel default)
- SQL injection prevention (Eloquent ORM)

**Production Security:** Addressed in Phase 4 (Deployment)

## Scalability Considerations

**Not Applicable for Phase 1** - Development environment only.

Focus: Single developer machine, not production scale.

## Deployment Considerations

**Not Applicable for Phase 1** - Local development only.

Deployment covered in Phase 4.

## Risks and Mitigations

### Risk 1: Docker Installation Issues

**Probability:** Medium  
**Impact:** High (blocks development)

**Mitigation:**
- Provide detailed installation guide
- Document common issues
- Offer alternative: manual installation without Docker

### Risk 2: Port Conflicts

**Probability:** Medium  
**Impact:** Medium (services won't start)

**Mitigation:**
- Document how to check for port conflicts
- Provide instructions to change ports
- Use non-standard ports if needed

### Risk 3: Incomplete Feature Removal

**Probability:** Low  
**Impact:** Medium (confusing UI)

**Mitigation:**
- Thorough testing of all navigation
- Document all removed features
- Code review before completion

### Risk 4: Branding Asset Quality

**Probability:** Low  
**Impact:** Low (visual only)

**Mitigation:**
- Use existing logo from assets/
- Document required logo variations
- Placeholder acceptable for Phase 1

## Future Considerations

### Phase 2 Preparation

**French Localization:**
- Verify translation files exist
- Identify missing translations
- Prepare for full French implementation

**Workflow Configuration:**
- Understand current workflow system
- Plan simplified workflow
- Identify configuration points

### Phase 3 Preparation

**Mobile App:**
- Verify build process works
- Test on simulators
- Identify branding points

**UI Simplification:**
- Document current UI complexity
- Plan simplification approach
- Identify components to modify

### Phase 4 Preparation

**Deployment:**
- Document production requirements
- Plan server specifications
- Identify deployment steps

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for Implementation
