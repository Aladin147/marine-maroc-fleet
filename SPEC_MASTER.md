# Marine Maroc Fleet Management - Master Specification

## Executive Summary

This document provides a comprehensive overview of all specifications for the Marine Maroc Fleet Management System. The project delivers a white-label fleet management platform built on Fleetbase open-source infrastructure, customized for Marine Maroc's transport operations.

**Project Duration:** 4 weeks development + 2 weeks pilot  
**Total Investment:** 200,000 MAD + 2,000 MAD/month  
**Delivery Model:** Fixed-scope MVP with Phase 2 upsell opportunities  

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [MVP Scope](#mvp-scope)
3. [Phase Breakdown](#phase-breakdown)
4. [Requirements Summary](#requirements-summary)
5. [Technical Architecture](#technical-architecture)
6. [Deliverables](#deliverables)
7. [Success Criteria](#success-criteria)
8. [Risk Management](#risk-management)
9. [Phase 2 Opportunities](#phase-2-opportunities)

---

## Project Overview

### Business Context

Marine Maroc requires a fleet management system to track heavy equipment transport operations across Morocco. The system must provide real-time GPS tracking, driver management, and load assignment capabilities.

**Key Business Drivers:**
- Real-time visibility into fleet operations
- Improved dispatcher efficiency
- Proof of delivery documentation
- Driver accountability
- Cost savings vs SaaS alternatives (74% cheaper over 3 years)

### Solution Approach

Build a customized fleet management system using Fleetbase open-source platform as the foundation, with:
- Simplified UI focused on core features
- Marine Maroc branding throughout
- French language interface
- Standalone system (no integration with existing systems)

### Technology Stack

**Backend:**
- PHP 8.0+ (Laravel 10)
- MySQL 8.0
- Redis 4.0
- SocketCluster (WebSockets)

**Frontend:**
- Ember.js 5.4 (Console)
- React Native 0.77 (Mobile)
- Tailwind CSS

**Infrastructure:**
- Docker Compose
- NGINX
- Let's Encrypt SSL

---

## MVP Scope

### Included Features

**Operations:**
- ✅ Load/shipment creation and management
- ✅ Real-time GPS tracking on map
- ✅ Order status workflow (4 stages)
- ✅ Driver assignment to loads
- ✅ Kanban board view

**Management:**
- ✅ Driver management (profiles, status)
- ✅ Vehicle management (basic info)
- ✅ Places (pickup/delivery locations)
- ✅ Contacts (customers, receivers)

**Mobile App:**
- ✅ View assigned loads
- ✅ Start/complete trips
- ✅ Background GPS tracking
- ✅ Proof of delivery (photo + signature)
- ✅ Chat with dispatch

**Infrastructure:**
- ✅ Docker deployment
- ✅ MySQL + Redis
- ✅ SSL certificate
- ✅ Automated backups
- ✅ Monitoring

### Excluded Features (Phase 2)

**Advanced Tracking (+40K MAD):**
- Geofencing alerts
- Automated notifications
- Idle time alerts
- Route deviation alerts
- ETA calculations

**Fuel & Maintenance (+35K MAD):**
- Fuel report management
- Issue/incident reporting
- Maintenance scheduling
- Vehicle inspections

**Analytics & Reporting (+45K MAD):**
- Custom report builder
- Performance metrics
- Delivery analytics
- Export to Excel/PDF

**Advanced Operations (+50K MAD):**
- Multi-stop route optimization
- Scheduler/calendar view
- Service rate management
- Vendor management

**Telematics (+60K MAD):**
- Hardware GPS integration
- Fuel sensors
- Temperature sensors
- Vehicle diagnostics

**Arabic Language (+20K MAD):**
- Arabic translations
- RTL (right-to-left) UI
- Localized formats

---

## Phase Breakdown

### Phase 1: Foundation (Week 1)

**Duration:** 5 days  
**Goal:** Establish clean development environment with basic branding

**Key Deliverables:**
- Working local development environment
- All Docker services running
- Unused features removed
- Simplified navigation (5 items)
- Marine Maroc logo applied
- Admin account created

**Requirements:** 10 requirements, 40+ tasks  
**Milestone Payment:** 40,000 MAD (20%)

### Phase 2: Backend Customization (Week 2)

**Duration:** 5 days  
**Goal:** Configure backend for French locale and simplified workflows

**Key Deliverables:**
- Complete French localization
- Simplified 4-stage workflow
- Google Maps integration
- OSRM routing configured
- Email service configured
- API optimized

**Requirements:** 15 requirements  
**Milestone Payment:** 80,000 MAD (40%)

### Phase 3: Frontend & Mobile (Week 3)

**Duration:** 5 days  
**Goal:** Polish UI and brand mobile app

**Key Deliverables:**
- Simplified console UI
- Marine Maroc themed console
- Branded mobile app
- French translations complete
- GPS tracking working
- Proof of delivery functional
- End-to-end testing passed

**Requirements:** 25 requirements  
**Milestone Payment:** 40,000 MAD (20%)

### Phase 4: Deployment (Week 4)

**Duration:** 5 days  
**Goal:** Deploy to production and prepare for pilot

**Key Deliverables:**
- Production server deployed
- Domain configured (fleet.marinemaroc.com)
- SSL certificate installed
- Backups automated
- Monitoring configured
- Performance optimized
- Documentation complete

**Requirements:** 25 requirements  
**Milestone Payment:** 40,000 MAD (20%)

---

## Requirements Summary

### Total Requirements: 75

**By Category:**

**Infrastructure & Setup (15 requirements):**
- Environment setup
- Repository configuration
- Docker deployment
- Server provisioning
- Database configuration

**Feature Development (25 requirements):**
- Order management
- Driver management
- Vehicle management
- GPS tracking
- Proof of delivery
- Chat functionality

**Localization (8 requirements):**
- French translations (console)
- French translations (mobile)
- Date/number formatting
- Email templates

**Configuration (12 requirements):**
- Workflow configuration
- Google Maps integration
- OSRM routing
- Email service
- WebSocket configuration

**Quality & Testing (15 requirements):**
- End-to-end testing
- Performance testing
- Security testing
- Load testing
- User acceptance testing

### Requirements by Phase

| Phase | Requirements | Complexity |
|-------|-------------|------------|
| Phase 1 | 10 | Low-Medium |
| Phase 2 | 15 | Medium |
| Phase 3 | 25 | Medium-High |
| Phase 4 | 25 | Medium |

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────┐
│         Marine Maroc Fleet              │
│      fleet.marinemaroc.com              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
    Console     API    Mobile App
   (Ember.js) (Laravel) (React Native)
        │         │         │
        └─────────┼─────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
     MySQL     Redis   SocketCluster
```

### Data Flow

**Location Update Flow:**
1. Mobile app captures GPS location
2. API receives and validates location
3. Store in MySQL, cache in Redis
4. Broadcast via WebSocket
5. Console updates map in real-time

**Order Assignment Flow:**
1. Dispatcher assigns order in console
2. API updates database
3. Queue notification job
4. Send push notification to driver
5. Driver receives notification in mobile app

### Security Architecture

**Transport Security:**
- HTTPS/TLS 1.3
- Certificate pinning (mobile)
- Secure WebSocket (WSS)

**Authentication:**
- JWT tokens (24-hour expiry)
- Password hashing (bcrypt)
- Role-based access control

**Data Security:**
- Database encryption at rest
- Encrypted backups
- Secure environment variables

---

## Deliverables

### Phase 1 Deliverables

**Code:**
- [ ] Fleetbase core configured
- [ ] FleetOps extension configured
- [ ] Navigator app configured
- [ ] Docker environment working
- [ ] Unused features removed

**Documentation:**
- [ ] Setup guide updated
- [ ] Removed features documented
- [ ] Environment variables documented

**Testing:**
- [ ] All services running
- [ ] Console loads correctly
- [ ] API responds correctly

### Phase 2 Deliverables

**Code:**
- [ ] French translations complete
- [ ] Simplified workflow configured
- [ ] Google Maps integrated
- [ ] OSRM routing configured
- [ ] Email service configured

**Documentation:**
- [ ] API endpoints documented
- [ ] Workflow configuration documented
- [ ] External services documented

**Testing:**
- [ ] All text in French
- [ ] Workflow transitions work
- [ ] External services connected

### Phase 3 Deliverables

**Code:**
- [ ] Console UI simplified
- [ ] Marine Maroc theme applied
- [ ] Mobile app branded
- [ ] GPS tracking working
- [ ] Proof of delivery working
- [ ] Chat functional

**Documentation:**
- [ ] User guides (French)
- [ ] Mobile app setup guide
- [ ] Feature documentation

**Testing:**
- [ ] End-to-end tests passed
- [ ] Mobile app tested on iOS/Android
- [ ] Performance targets met

### Phase 4 Deliverables

**Infrastructure:**
- [ ] Production server deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Backups automated
- [ ] Monitoring configured

**Documentation:**
- [ ] Deployment guide
- [ ] Disaster recovery plan
- [ ] Training materials
- [ ] Support procedures

**Testing:**
- [ ] Load testing completed
- [ ] Security testing completed
- [ ] UAT completed
- [ ] Production checklist verified

---

## Success Criteria

### MVP Completion (Week 4)

**Technical:**
- ✅ All 75 requirements met
- ✅ All core features functional
- ✅ French translations complete
- ✅ Marine Maroc branding applied
- ✅ Deployed to production
- ✅ SSL configured
- ✅ Backups running

**Performance:**
- ✅ Console loads in <3 seconds
- ✅ API responds in <500ms (95th percentile)
- ✅ Map loads in <2 seconds
- ✅ Mobile app launches in <3 seconds

**Quality:**
- ✅ Zero critical bugs
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Code reviewed

### Pilot Success (Week 6)

**Adoption:**
- ✅ 95%+ driver adoption (5/5 drivers)
- ✅ Dispatchers using system daily
- ✅ All core workflows tested

**Performance:**
- ✅ <30 second location updates
- ✅ 99%+ uptime
- ✅ <5 support tickets/week

**Satisfaction:**
- ✅ Positive feedback from Marine Maroc
- ✅ No major feature gaps identified
- ✅ Approval for full rollout

### 3-Month Success

**Operations:**
- 100% driver adoption (full fleet)
- System running smoothly
- <3 support tickets/week

**Business:**
- Marine Maroc requests Phase 2 features
- Referral to other companies
- Case study published

---

## Risk Management

### Technical Risks

**Risk 1: Docker Installation Issues**
- **Probability:** Medium
- **Impact:** High (blocks development)
- **Mitigation:** Detailed installation guide, common issues documented
- **Contingency:** Manual installation without Docker

**Risk 2: GPS Accuracy in Morocco**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:** Test during pilot, use Google Maps + OSRM
- **Contingency:** Adjust polling frequency, use alternative providers

**Risk 3: Performance Issues**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:** Load testing, performance optimization
- **Contingency:** Scale infrastructure, optimize queries

**Risk 4: Fleetbase Updates Breaking Changes**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:** Pin to stable version, test updates in staging
- **Contingency:** Fork repository, maintain our own version

### Business Risks

**Risk 1: Scope Creep**
- **Probability:** Medium
- **Impact:** High (delays, budget overrun)
- **Mitigation:** Fixed MVP scope document, change requests quoted separately
- **Contingency:** Prioritize features, defer to Phase 2

**Risk 2: Driver Resistance**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:** Simple UI, French language, hands-on training
- **Contingency:** Incentive program, additional training

**Risk 3: Pilot Failure**
- **Probability:** Low
- **Impact:** High
- **Mitigation:** Extensive testing, 2-week pilot before full rollout
- **Contingency:** Money-back guarantee, fix issues before rollout

**Risk 4: Client Discovers Fleetbase is Open Source**
- **Probability:** Medium
- **Impact:** Low
- **Mitigation:** Honest positioning: "We use proven components, our value is integration and customization"
- **Contingency:** Emphasize our IP (deployment, customization, support)

### Mitigation Strategies

**Technical:**
- Comprehensive testing at each phase
- Performance monitoring from day 1
- Regular backups and disaster recovery plan
- Documentation of all configurations

**Business:**
- Clear communication of scope
- Regular demos and feedback sessions
- Transparent pricing for changes
- Strong support during pilot

---

## Phase 2 Opportunities

### Upsell Strategy

**Timing:** After successful pilot (Week 7+)

**Approach:**
1. Demonstrate MVP success
2. Identify pain points or feature requests
3. Present Phase 2 options
4. Quote based on priority

### Phase 2 Features & Pricing

**Phase 2A: Advanced Tracking & Alerts**
- **Price:** +40,000 MAD
- **Duration:** 2-3 weeks
- **Features:** Geofencing, automated notifications, idle alerts, route deviation, ETA

**Phase 2B: Fuel & Maintenance**
- **Price:** +35,000 MAD
- **Duration:** 2-3 weeks
- **Features:** Fuel reports, issue reporting, maintenance scheduling, inspections

**Phase 2C: Analytics & Reporting**
- **Price:** +45,000 MAD
- **Duration:** 3-4 weeks
- **Features:** Custom reports, performance metrics, analytics, Excel/PDF export

**Phase 2D: Advanced Operations**
- **Price:** +50,000 MAD
- **Duration:** 3-4 weeks
- **Features:** Multi-stop optimization, scheduler, service rates, vendor management

**Phase 2E: Telematics Integration**
- **Price:** +60,000 MAD
- **Duration:** 4-5 weeks
- **Features:** Hardware GPS, fuel sensors, temperature sensors, diagnostics

**Phase 2F: Arabic Localization**
- **Price:** +20,000 MAD
- **Duration:** 1-2 weeks
- **Features:** Arabic translations, RTL UI, localized formats

### Total Phase 2 Potential

**Revenue:** +250,000 MAD  
**Total Project Value:** 450,000 MAD

---

## Project Timeline

### Week-by-Week Breakdown

**Week 1: Foundation**
- Days 1-2: Environment setup, repository configuration
- Days 3-4: Feature removal, code cleanup
- Day 5: Basic branding, testing
- **Milestone:** Development environment ready

**Week 2: Backend**
- Days 1-2: French localization
- Days 3-4: Workflow configuration, external services
- Day 5: API optimization, testing
- **Milestone:** Backend customization complete

**Week 3: Frontend & Mobile**
- Days 1-2: Console UI simplification
- Days 3-4: Mobile app branding, GPS tracking
- Day 5: End-to-end testing
- **Milestone:** UI/UX complete

**Week 4: Deployment**
- Days 1-2: Server setup, deployment
- Days 3-4: Domain, SSL, backups, monitoring
- Day 5: Final testing, documentation
- **Milestone:** Production ready

**Week 5-6: Pilot**
- Week 5: Training, onboarding, launch
- Week 6: Monitoring, feedback, optimization
- **Milestone:** Pilot success

**Week 7+: Full Rollout**
- Scale to full fleet
- Ongoing support
- Phase 2 planning

---

## Communication Plan

### Weekly Updates

**Every Friday:**
- Progress report
- Blockers and risks
- Next week's plan
- Demo of completed features

### Milestone Reviews

**End of Each Phase:**
- Demo to Marine Maroc
- Feedback collection
- Payment processing
- Sign-off for next phase

### Daily Standups (Optional)

**15-minute sync:**
- What was done yesterday
- What's planned today
- Any blockers

---

## Payment Schedule

| Milestone | Deliverable | Amount | Percentage |
|-----------|-------------|--------|------------|
| 1 | Phase 1 Complete | 40,000 MAD | 20% |
| 2 | Phase 2 Complete | 80,000 MAD | 40% |
| 3 | Phase 3 Complete | 40,000 MAD | 20% |
| 4 | Pilot Success | 40,000 MAD | 20% |
| **Total** | **MVP Complete** | **200,000 MAD** | **100%** |

**Monthly Recurring:** 2,000 MAD/month (infrastructure)

---

## Support & Maintenance

### Included Support (First 3 Months)

**Response Times:**
- Critical (system down): 1 hour
- High (major feature broken): 4 hours
- Medium (minor issue): 24 hours
- Low (enhancement): 1 week

**Included:**
- Bug fixes
- Performance optimization
- Security updates
- Documentation updates

### Ongoing Support (After 3 Months)

**Options:**
1. **Pay-per-incident:** 2,000 MAD per issue
2. **Monthly retainer:** 5,000 MAD/month (unlimited support)
3. **Annual contract:** 50,000 MAD/year (priority support)

---

## Appendices

### A. Document References

- [MVP Scope](docs/mvp-scope.md)
- [Architecture](docs/architecture.md)
- [Setup Guide](docs/setup.md)
- [Branding Guide](docs/branding.md)
- [Deployment Guide](docs/deployment.md)
- [Roadmap](docs/roadmap.md)

### B. Specification Documents

**Phase 1:**
- [Requirements](.kiro/specs/phase-1-foundation/requirements.md)
- [Design](.kiro/specs/phase-1-foundation/design.md)
- [Tasks](.kiro/specs/phase-1-foundation/tasks.md)

**Phase 2:**
- [Requirements](.kiro/specs/phase-2-backend/requirements.md)
- Design (to be created)
- Tasks (to be created)

**Phase 3:**
- [Requirements](.kiro/specs/phase-3-frontend-mobile/requirements.md)
- Design (to be created)
- Tasks (to be created)

**Phase 4:**
- [Requirements](.kiro/specs/phase-4-deployment/requirements.md)
- Design (to be created)
- Tasks (to be created)

### C. Glossary

- **MVP:** Minimum Viable Product
- **POD:** Proof of Delivery
- **GPS:** Global Positioning System
- **API:** Application Programming Interface
- **SSL:** Secure Sockets Layer
- **OSRM:** Open Source Routing Machine
- **SMTP:** Simple Mail Transfer Protocol
- **UAT:** User Acceptance Testing
- **SLA:** Service Level Agreement
- **RTO:** Recovery Time Objective
- **RPO:** Recovery Point Objective

---

## Approval

### Document Sign-Off

**Prepared By:** [Your Name]  
**Date:** November 5, 2025  
**Version:** 1.0

**Reviewed By:** ___________________  
**Date:** ___________________

**Approved By:** ___________________  
**Date:** ___________________

---

**This master specification serves as the single source of truth for the Marine Maroc Fleet Management System project. All development work should reference this document and its linked specifications.**

**Last Updated:** November 5, 2025  
**Status:** Ready for Review
