# Marine Maroc Fleet Management - MVP Scope

## 🎯 Critical Insight (Read This First!)

**From Marine Maroc Collaborators:** 
> "The majority of our truck drivers have low literacy in both French and Arabic. Many can recognize basic Arabic letters but struggle with reading full sentences."

**Our Strategic Response:**
We've pivoted to make **Arabic-first, icon-heavy UX** the core of our MVP. This is not just a feature - it's our competitive advantage.

**Why This Wins:**
- Traditional fleet apps fail because drivers can't/won't use them (50-60% adoption)
- Our Arabic-first, icon-heavy design targets 95%+ adoption
- Voice messages eliminate typing barrier
- First mover advantage in Arabic-first fleet management

**See:** [Arabic UX Strategy](arabic-ux-strategy.md) | [Competitive Advantage](../COMPETITIVE_ADVANTAGE.md)

---

## Overview

This document defines the Minimum Viable Product (MVP) scope for Marine Maroc's fleet management system. The MVP focuses on core functionality needed for the 2-week pilot with 5 drivers, with special emphasis on low-literacy, Arabic-first mobile UX.

---

## MVP Timeline: 4 Weeks

**Goal:** Deliver a working system with essential features for real-world testing.

---

## Core Features (MUST HAVE)

### 1. Operations Management

#### Load/Shipment Management
- Create new loads with pickup and delivery locations
- Assign loads to drivers
- Track load status through workflow stages
- View all loads on Kanban board
- Search and filter loads

**Workflow Stages:**
1. Nouveau (New)
2. Assigné (Assigned)
3. En Route (In Progress)
4. Livré (Delivered)

#### Real-Time Tracking
- View all active vehicles on live map
- See driver locations updated every 30 seconds
- Click vehicle to see driver and load details
- Track route history

### 2. Management Module

#### Driver Management
- Add/edit/delete drivers
- Driver profiles (name, phone, email, license)
- Assign drivers to vehicles
- View driver location history
- Driver status (available, on trip, offline)

#### Vehicle Management
- Add/edit/delete vehicles
- Basic vehicle info (make, model, plate number, year)
- Assign vehicles to drivers
- View vehicle location history

#### Places (Locations)
- Add/edit/delete locations
- Location details (name, address, coordinates)
- Use as pickup/delivery points
- Search locations

#### Contacts
- Add/edit/delete contacts
- Contact types: customers, receivers
- Contact info (name, phone, email, company)
- Link contacts to loads

### 3. Driver Mobile App

#### Authentication
- Login with phone number or email
- Password authentication
- Remember login

#### Load Management
- View assigned loads
- See load details (pickup, delivery, items)
- Start trip (marks load as "En Route")
- Complete delivery (marks load as "Livré")

#### GPS Tracking
- Background location tracking
- Works offline (syncs when online)
- Battery-optimized (adaptive polling)
- Automatic tracking when trip starts

#### Proof of Delivery
- Take photos (multiple per delivery)
- Capture signature
- Add delivery notes
- Submit proof of delivery

#### Communication
- Chat with dispatch
- Receive notifications for new loads
- Send messages to operations team

### 4. Infrastructure

#### Deployment
- Docker-based deployment
- MySQL database
- Redis cache and queue
- SocketCluster for real-time updates

#### Security
- SSL certificate (Let's Encrypt)
- Secure API authentication
- Role-based access control
- Data encryption at rest

#### Reliability
- Automated daily backups
- Database backup to S3 or local storage
- 99% uptime target
- Error logging and monitoring

---

## Features EXCLUDED from MVP

### Phase 2A: Advanced Tracking & Alerts (+40K MAD)
- Geofencing (enter/exit zone alerts)
- Automated SMS/email notifications
- Idle time alerts
- Route deviation alerts
- ETA calculations
- Speed limit alerts

### Phase 2B: Fuel & Maintenance (+35K MAD)
- Fuel report management
- Issue/incident reporting
- Maintenance scheduling
- Vehicle inspection checklists
- Service history tracking

### Phase 2C: Analytics & Reporting (+45K MAD)
- Custom report builder
- Driver performance metrics
- Delivery time analytics
- Route efficiency reports
- Export to Excel/PDF
- Dashboard widgets

### Phase 2D: Advanced Operations (+50K MAD)
- Multi-stop route optimization
- Scheduler/calendar view
- Service rate management
- Vendor/subcontractor management
- Custom workflow builder
- Load templates

### Phase 2E: Telematics Integration (+60K MAD)
- Hardware GPS device integration
- Fuel sensor integration
- Temperature sensors
- Vehicle diagnostics (OBD-II)
- Engine hours tracking

### ~~Phase 2F: Localization~~ (NOW INCLUDED IN MVP!)
- ✅ Arabic language support (INCLUDED)
- ✅ Right-to-left (RTL) UI (INCLUDED)
- ✅ Arabic translations for mobile app (INCLUDED)
- ✅ Icon-heavy design for low literacy (INCLUDED)
- ✅ Voice messages (INCLUDED)

**Optional Enhancement (+15K MAD):**
- Voice guidance system (audio instructions)
- Offline voice files
- Advanced voice commands

---

## UI Simplification

### Console Navigation (Simplified)

**Before (Fleetbase default):**
```
Operations | Management | Connectivity | Maintenance | Analytics | Settings
```

**After (Marine Maroc MVP):**
```
Chargements | Chauffeurs | Véhicules | Lieux | Carte
(Loads)     | (Drivers)  | (Vehicles)| (Places) | (Map)
```

### Removed Sections
- ❌ Connectivity (telematics)
- ❌ Maintenance
- ❌ Analytics
- ❌ Service Rates
- ❌ Scheduler
- ❌ Vendors
- ❌ Fuel Reports
- ❌ Issues

### Mobile App Screens (Simplified - Arabic-First)

**Included:**
- Login (Arabic interface)
- Dashboard (3 big icon buttons)
- Load details (icons + minimal Arabic text)
- Start trip (big green button)
- Proof of delivery (camera + signature icons)
- Voice messages (hold-to-record, no typing)

**Design Principles:**
- ✅ Arabic as primary language
- ✅ Icons first, text second
- ✅ 3-4 buttons max per screen
- ✅ Large touch targets (80x80pt minimum)
- ✅ Voice messages (no typing required)
- ✅ Designed for low-literacy users

**Removed:**
- ❌ Fuel reports
- ❌ Issue reporting
- ❌ Fleet overview
- ❌ Vehicle details
- ❌ Driver reports
- ❌ Text-based chat (replaced with voice)

---

## Technical Specifications

### Performance Targets
- Dashboard load time: <2 seconds
- Location update latency: <30 seconds
- Mobile app battery drain: <15% per 8-hour shift
- API response time: <500ms (95th percentile)
- System uptime: 99%+

### Scalability
- Support 50 concurrent drivers
- Handle 100 active loads
- Store 6 months of location history
- Process 1000 location updates/minute

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS 13+
- Android 8.0+

---

## Data Model (Simplified)

### Core Entities

**Load/Order:**
- ID, status, workflow stage
- Pickup location, delivery location
- Assigned driver, assigned vehicle
- Customer contact, receiver contact
- Created date, scheduled date, completed date
- Proof of delivery (photos, signature, notes)

**Driver:**
- ID, name, phone, email
- License number, license expiry
- Status (available, on trip, offline)
- Assigned vehicle
- Current location

**Vehicle:**
- ID, make, model, year
- Plate number, VIN
- Assigned driver
- Current location

**Place:**
- ID, name, address
- Latitude, longitude
- Type (warehouse, customer site, etc.)

**Contact:**
- ID, name, phone, email
- Company name
- Type (customer, receiver)

---

## User Roles

### Admin
- Full access to all features
- Manage users, drivers, vehicles
- Configure system settings

### Dispatcher
- Create and assign loads
- View tracking map
- Communicate with drivers
- View reports

### Driver (Mobile App)
- View assigned loads
- Update load status
- Submit proof of delivery
- Chat with dispatch

---

## Success Criteria for Pilot

### Must Achieve:
- ✅ 95%+ driver adoption (5/5 drivers using app)
- ✅ <30 second location update latency
- ✅ 99%+ uptime during 2-week pilot
- ✅ <5 support tickets per week
- ✅ Positive feedback from dispatchers
- ✅ Zero data loss incidents

### Nice to Have:
- <15% battery drain per 8-hour shift
- <2 second dashboard load time
- Zero app crashes

---

## Acceptance Criteria

### For MVP Completion:

**Backend:**
- [ ] All API endpoints functional
- [ ] Database migrations complete
- [ ] Queue workers running
- [ ] WebSocket connections stable
- [ ] Authentication working

**Console:**
- [ ] Marine Maroc branding applied
- [ ] French translations complete
- [ ] All MVP features accessible
- [ ] Removed features hidden
- [ ] Map tracking functional

**Mobile App:**
- [ ] Marine Maroc branding applied
- [ ] French translations complete
- [ ] GPS tracking working offline
- [ ] Photo/signature capture working
- [ ] Push notifications working

**Infrastructure:**
- [ ] Production server deployed
- [ ] Domain configured with SSL
- [ ] Backups automated
- [ ] Monitoring configured
- [ ] Documentation complete

---

## Out of Scope

### Explicitly NOT Included:
- Integration with existing Marine Maroc systems (ERP, TMS)
- Custom hardware procurement
- Driver phone procurement
- Internet connectivity for drivers
- Training beyond initial 2-day session
- On-site support beyond pilot phase
- Data migration from existing systems
- Custom reporting beyond standard views
- White-label mobile app store submission
- Voice guidance system (optional Phase 2 enhancement)
- Professional voice actor recordings (using text-to-speech for MVP)

---

## Assumptions

1. Marine Maroc provides:
   - Production server or cloud hosting budget
   - Domain name (fleet.marinemaroc.com)
   - Google Maps API key
   - Driver phone numbers for accounts
   - 5 drivers for pilot phase

2. Drivers have:
   - Android or iOS smartphones
   - Mobile data plans
   - Basic smartphone literacy

3. Dispatchers have:
   - Desktop computers with modern browsers
   - Stable internet connection
   - Basic computer literacy

---

## Risk Mitigation

### Technical Risks:
1. **GPS accuracy issues**
   - Mitigation: Use Google Maps + OSRM, test in Morocco
   
2. **Offline sync conflicts**
   - Mitigation: Fleetbase handles this, extensive testing

3. **Battery drain**
   - Mitigation: Adaptive polling, background optimization

### Business Risks:
1. **Scope creep**
   - Mitigation: Fixed MVP scope, change requests quoted separately

2. **Pilot failure**
   - Mitigation: 2-week pilot before full rollout, money-back guarantee

3. **Driver resistance**
   - Mitigation: Simple UI, French language, hands-on training

---

## Next Steps

1. Review and approve this scope
2. Create detailed technical specification
3. Set up development environment
4. Begin Week 1: Foundation phase

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Draft - Pending Approval
