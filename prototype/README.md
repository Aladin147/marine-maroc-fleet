# Fleet Management Engine - Prototype

## Overview

This is an experimental prototype for building our own fleet management engine from scratch. The goal is to create a lean, white-label-ready platform that we fully own and control.

**Status:** Experimental / Proof of Concept  
**Timeline:** 3 weeks prototype → 6 weeks MVP  
**Fallback:** If this becomes too complex, we can pivot back to the Fleetbase customization approach (see parent directory)

## Why Build Our Own?

1. **True IP Ownership** - No AGPL license complications
2. **White-Label Ready** - Built for multi-tenancy from day 1
3. **Simpler Codebase** - Only what we need, no legacy bloat
4. **Competitive Moat** - Unique engine vs open-source Fleetbase
5. **Better Margins** - Own the platform, scale infinitely

## Architecture

```
prototype/
├── backend/           # Laravel API
├── frontend/          # React Admin Dashboard
├── mobile/            # React Native App
├── docs/              # Prototype documentation
└── docker/            # Development environment
```

## Tech Stack

**Backend:**
- Laravel 11 (PHP 8.2+)
- PostgreSQL 16 (multi-tenant ready)
- Redis 7 (cache + queues)
- Laravel Reverb (WebSockets)

**Frontend:**
- React 18 + Vite
- shadcn/ui + Tailwind CSS
- React Query (data fetching)
- Google Maps API

**Mobile:**
- React Native 0.73+
- Arabic-first, icon-heavy UI
- Background GPS tracking
- Voice messages

## Quick Start

```bash
# Start backend
cd prototype/backend
composer install
php artisan serve

# Start frontend
cd prototype/frontend
npm install
npm run dev

# Start mobile
cd prototype/mobile
npm install
npm start
```

## Development Phases

### Phase 0: Prototype (Current - 3 weeks)
- [x] **Day 1 Complete!** Backend foundation + database ✅
- [ ] Week 1: Backend API + multi-tenant structure (in progress)
- [ ] Week 2: Admin dashboard (React)
- [ ] Week 3: Mobile app (Arabic-first UI)

### Phase 1: MVP Engine (6 weeks)
- [ ] Production-ready backend
- [ ] Complete admin dashboard
- [ ] Polished mobile app
- [ ] Docker deployment
- [ ] CI/CD pipeline

### Phase 2: First Client (Marine Maroc)
- [ ] White-label customization
- [ ] Branding application
- [ ] Pilot deployment

## Fallback Plan

If building from scratch becomes too complex or time-consuming:
1. Return to parent directory
2. Resume Fleetbase customization approach
3. All planning docs are preserved
4. No time wasted - we learned what we needed

## Next Steps

1. Set up Laravel backend with multi-tenant structure
2. Create core database schema
3. Build basic API endpoints
4. Test with Postman/Insomnia

---

**Let's build something we truly own! 🚀**
