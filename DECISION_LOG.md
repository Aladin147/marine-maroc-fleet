# Decision Log

## Decision 1: Dual-Track Approach (November 6, 2025)

### Context
After comprehensive planning for Marine Maroc fleet management system using Fleetbase as the foundation, we identified a strategic risk: dependency on open-source platform we don't control.

### Decision
**Implement a dual-track approach:**

**Track 1: Prototype (Primary Focus)**
- Build our own fleet management engine from scratch
- Full IP ownership, no AGPL complications
- White-label ready from day 1
- Simpler, leaner codebase
- Located in: `prototype/`

**Track 2: Fleetbase Customization (Fallback)**
- Keep all existing planning and documentation
- Can pivot back if prototype becomes too complex
- All specs and docs preserved in root directory
- Zero time wasted - learning informs both approaches

### Rationale

**Why Build Our Own:**
1. **True IP Ownership** - No license complications, can sell/license freely
2. **Competitive Moat** - Unique engine vs commodity open-source
3. **White-Label Ready** - Built for multi-tenancy from start
4. **Simpler Codebase** - Only what we need, no legacy bloat
5. **Better Margins** - Own the platform, scale infinitely
6. **Prototype First** - Validate concept before committing to Marine Maroc

**Why Keep Fleetbase Option:**
1. **Risk Mitigation** - Fallback if custom build too complex
2. **Time Pressure** - Can pivot quickly if needed
3. **Learning Value** - Study Fleetbase patterns to accelerate our build
4. **No Waste** - All planning work remains valuable

### Implementation Plan

**Phase 0: Prototype (3 weeks)**
- Week 1: Laravel backend + multi-tenant structure
- Week 2: React admin dashboard
- Week 3: React Native mobile app (Arabic-first)
- Deliverable: Working prototype to validate concept

**Decision Point (End of Week 3):**
- ✅ Prototype works well → Continue with custom engine
- ❌ Too complex/slow → Pivot to Fleetbase customization

**Phase 1: MVP Engine (6 weeks) - If prototype succeeds**
- Production-ready backend
- Complete admin dashboard
- Polished mobile app
- Docker deployment

**Phase 2: Marine Maroc (2 weeks)**
- White-label customization
- Branding application
- Pilot deployment

### Tech Stack (Prototype)

**Backend:**
- Laravel 11 (PHP 8.2+)
- PostgreSQL 16 (better for multi-tenant)
- Redis 7 (cache + queues)
- Laravel Reverb (WebSockets)

**Frontend:**
- React 18 + Vite
- shadcn/ui + Tailwind CSS
- React Query
- Google Maps API

**Mobile:**
- React Native 0.73+
- Arabic-first, icon-heavy UI
- Background GPS tracking
- Voice messages

### Success Criteria

**Prototype Success:**
- Working API with multi-tenant structure
- Basic admin dashboard (orders, drivers, vehicles)
- Mobile app with Arabic UI
- GPS tracking functional
- Completed in 3 weeks

**Pivot to Fleetbase If:**
- Prototype takes >4 weeks
- Technical blockers we can't solve
- Complexity exceeds expected effort
- Time pressure from Marine Maroc

### Directory Structure

```
marine-maroc-fleet/
├── prototype/              # NEW: Custom engine (primary focus)
│   ├── backend/           # Laravel API
│   ├── frontend/          # React dashboard
│   ├── mobile/            # React Native app
│   └── docs/              # Prototype documentation
├── fleetbase/             # Fleetbase repos (fallback)
├── fleetops/
├── navigator-app/
├── docs/                  # Original planning docs
├── .kiro/specs/           # Phase specifications
├── PROJECT_SUMMARY.md     # Original plan
├── SPEC_MASTER.md         # Master spec
└── DECISION_LOG.md        # This file
```

### Risks and Mitigations

**Risk 1: Prototype Takes Too Long**
- Mitigation: 3-week hard deadline, pivot if exceeded
- Fallback: Fleetbase customization ready to go

**Risk 2: Missing Critical Features**
- Mitigation: Study Fleetbase patterns first
- Fallback: Extract code/patterns from Fleetbase

**Risk 3: Marine Maroc Timeline Pressure**
- Mitigation: Don't commit to timeline until prototype done
- Fallback: Fleetbase can deliver in 4 weeks as planned

**Risk 4: Technical Complexity Underestimated**
- Mitigation: Start with absolute minimum (MVP of MVP)
- Fallback: Pivot to Fleetbase at any point

### Benefits of This Approach

**Strategic:**
- Test business model before committing
- Validate Arabic-first UX with prototype
- Own the IP if it works
- Keep options open if it doesn't

**Technical:**
- Learn from Fleetbase without being bound to it
- Build exactly what we need, nothing more
- Modern tech stack (React vs Ember)
- Simpler architecture

**Business:**
- Better margins long-term (own the platform)
- Easier to white-label for multiple clients
- No license complications
- Competitive differentiation

### Next Steps

1. **This Week:**
   - Set up Laravel backend structure
   - Create multi-tenant database schema
   - Build core API endpoints
   - Test with Postman

2. **Next Week:**
   - Build React admin dashboard
   - Implement orders/drivers/vehicles CRUD
   - Add map integration
   - Test end-to-end

3. **Week 3:**
   - Create React Native mobile app
   - Implement Arabic-first UI
   - Add GPS tracking
   - Test with potential users

4. **Decision Point:**
   - Evaluate prototype success
   - Decide: continue custom or pivot to Fleetbase
   - Update Marine Maroc timeline accordingly

### Approval

**Proposed By:** Development Team  
**Date:** November 6, 2025  
**Status:** Approved - Proceeding with dual-track approach  

---

## Future Decisions

(To be added as we make them)
