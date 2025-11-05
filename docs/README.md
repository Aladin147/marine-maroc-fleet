# Marine Maroc Fleet Management - Documentation

## Quick Links

- [MVP Scope](mvp-scope.md) - Feature breakdown and requirements
- [Architecture](architecture.md) - System architecture and technical design
- [Development Setup](setup.md) - Local development environment
- [Branding Guide](branding.md) - Marine Maroc customization
- [Deployment Guide](deployment.md) - Production deployment

---

## Project Overview

Custom fleet management platform for Marine Maroc, built on Fleetbase open-source infrastructure.

**Timeline:** 4 weeks MVP + 2 weeks pilot  
**Budget:** 200,000 MAD build + 2,000 MAD/month infrastructure

---

## Documentation Structure

### 1. MVP Scope (`mvp-scope.md`)
Defines what's included in the Minimum Viable Product:
- Core features (MUST HAVE)
- Excluded features (Phase 2)
- UI simplification
- Success criteria
- Acceptance criteria

**Read this first** to understand project scope.

### 2. Architecture (`architecture.md`)
Technical architecture and design:
- High-level architecture
- Component breakdown
- Data flow diagrams
- Technology stack
- Security architecture
- Scalability considerations

**Read this** to understand how the system works.

### 3. Development Setup (`setup.md`)
Step-by-step guide to set up local development:
- Prerequisites
- Backend setup (Docker)
- Console setup (Ember.js)
- Mobile app setup (React Native)
- Common tasks
- Troubleshooting

**Follow this** to start developing.

### 4. Branding Guide (`branding.md`)
Marine Maroc customization:
- Brand identity
- Logo assets
- Console branding
- Mobile app branding
- Translations
- Domain & SSL

**Use this** to apply Marine Maroc branding.

### 5. Deployment Guide (`deployment.md`)
Production deployment:
- Server requirements
- Server setup
- Application deployment
- SSL configuration
- Backup setup
- Monitoring
- Maintenance

**Follow this** to deploy to production.

---

## Quick Start

### For Developers

```bash
# 1. Clone repositories
git clone https://github.com/fleetbase/fleetbase.git
git clone https://github.com/fleetbase/fleetops.git
git clone https://github.com/fleetbase/navigator-app.git

# 2. Start backend
cd fleetbase
./scripts/docker-install.sh

# 3. Access console
# http://localhost:4200

# 4. Read setup guide
# docs/setup.md
```

### For Project Managers

1. Read [MVP Scope](mvp-scope.md) - Understand what we're building
2. Review [Architecture](architecture.md) - Understand technical approach
3. Check [Branding Guide](branding.md) - Prepare brand assets
4. Plan deployment with [Deployment Guide](deployment.md)

---

## Development Phases

### Week 1: Foundation
- Repository setup
- Docker environment
- Database initialization
- Remove unused features
- Basic branding

### Week 2: Backend Customization
- French localization
- Simplified workflows
- API configuration
- Feature cleanup

### Week 3: Frontend & Mobile
- Console UI simplification
- Mobile app branding
- French translations
- Testing

### Week 4: Deployment
- Production server setup
- Domain & SSL
- Backup automation
- Performance optimization

### Week 5-6: Pilot
- 5 driver onboarding
- Training
- Bug fixes
- Feedback collection

---

## Key Features

### MVP (Included)
✅ Load/shipment management  
✅ Real-time GPS tracking  
✅ Driver management  
✅ Vehicle management  
✅ Proof of delivery  
✅ Chat with dispatch  
✅ French language  

### Phase 2 (Future)
⏳ Advanced alerts & geofencing (+40K MAD)  
⏳ Fuel & maintenance (+35K MAD)  
⏳ Analytics & reporting (+45K MAD)  
⏳ Route optimization (+50K MAD)  
⏳ Telematics integration (+60K MAD)  
⏳ Arabic language (+20K MAD)  

---

## Technology Stack

**Backend:**
- PHP 8.0+ (Laravel 10)
- MySQL 8.0
- Redis 4.0
- SocketCluster

**Frontend:**
- Ember.js 5.4
- Tailwind CSS
- MapLibre

**Mobile:**
- React Native 0.77
- iOS & Android

**Infrastructure:**
- Docker Compose
- NGINX
- Let's Encrypt SSL

---

## Support

**Technical Questions:**
- Check documentation first
- Review troubleshooting sections
- Create GitHub issue

**Business Questions:**
- Contact project manager
- Review MVP scope
- Discuss Phase 2 features

---

## Contributing

### Code Style
- Follow existing conventions
- Write clear commit messages
- Test before committing
- Document new features

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/description

# Make changes
git add .
git commit -m "Clear description"

# Push to remote
git push origin feature/description
```

---

## Useful Resources

### Fleetbase Documentation
- [Official Docs](https://docs.fleetbase.io)
- [GitHub](https://github.com/fleetbase)
- [Discord](https://discord.gg/V7RVWRQ2Wm)

### Technology Documentation
- [Laravel](https://laravel.com/docs)
- [Ember.js](https://emberjs.com)
- [React Native](https://reactnative.dev)
- [Docker](https://docs.docker.com)

### Tools
- [Postman](https://www.postman.com) - API testing
- [TablePlus](https://tableplus.com) - Database client
- [VS Code](https://code.visualstudio.com) - Code editor

---

## Changelog

### v1.0.0 - Initial Documentation (November 2025)
- Created MVP scope document
- Created architecture document
- Created setup guide
- Created branding guide
- Created deployment guide

---

## License

**Fleetbase Core:** AGPL-3.0  
**FleetOps Extension:** MIT  
**Navigator App:** AGPL-3.0  
**Marine Maroc Customizations:** Proprietary

---

**Last Updated:** November 2025  
**Status:** Active Development
