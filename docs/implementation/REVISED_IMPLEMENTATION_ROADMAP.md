# KOMPASS Revised Implementation Roadmap

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active Roadmap (Post-Pre-Mortem)  
**Owner:** Product & Engineering Leadership  

---

## Executive Summary

This roadmap reflects a **radical course correction** based on the pre-mortem analysis findings. Instead of an AI-first platform launch, we're building a **rock-solid, offline-first CRM/PM foundation** with complete workflows for Ladenbau, then adding intelligence progressively.

**Key Changes from Original Plan:**
1. ✅ **De-scope AI:** Move all predictive AI to Phase 3 (Month 12+)
2. ✅ **Fill workflow gaps:** Prioritize Supplier + Material modules (Months 1-3)
3. ✅ **Fix Lexware integration:** Commit to automation roadmap (Phase 2 by Month 6)
4. ✅ **Prove offline works:** Tiered storage, robust sync, conflict resolution (Months 1-6)

**Pre-Mortem Recommendation:**
> "IMMEDIATE & DRASTIC DE-SCOPING: Halt all new AI feature development. Re-focus all resources on the original, much more valuable 'Nordstern-Direktive' MVP."

**Our Response:** Implemented. This roadmap prioritizes foundational value over speculative AI.

---

## Sprint Overview

### Phase 1: Foundation (Months 1-6) - MVP Launch

**Sprint 1-3:** Critical Gap Closure (Danger #3)  
**Sprint 4-6:** Phase 1 AI (Simple Intelligence)  

### Phase 2: Simple Intelligence (Months 6-12)

**Sprint 7-9:** Lexware Integration Phase 2 (Danger #4)  
**Sprint 10-12:** Data Quality & Preparation

### Phase 3: Predictive Analytics (Months 12-24+)

**Year 2:** Only if data quality gates passed

---

## Sprint-Level Breakdown

## Sprint 1 (Month 1): Supplier Management Foundation

**Goal:** Enable INN persona to manage suppliers without Excel.

**Priority:** CRITICAL - Addresses Pre-Mortem Danger #3

### Week 1-2: Backend (Supplier Module)

**Tasks:**
- [ ] `Supplier` entity implementation (CouchDB schema, validation)
- [ ] `SupplierContract` entity implementation
- [ ] `SupplierInvoice` entity implementation
- [ ] `SupplierCommunication` entity implementation
- [ ] Supplier repository (CRUD operations)
- [ ] Supplier service (business logic, rating calculation)
- [ ] Supplier controller (REST endpoints)
- [ ] Supplier approval workflow (GF approval for new suppliers)
- [ ] Supplier rating system (4-dimension calculation)

**Deliverables:**
- Working API: POST/GET/PUT/DELETE `/api/v1/suppliers`
- Working API: Supplier contracts, invoices, communications
- Unit tests: 90%+ coverage
- Integration tests: Full supplier lifecycle

### Week 3-4: Frontend (Supplier UI)

**Tasks:**
- [ ] Supplier form (create/edit supplier)
- [ ] Supplier list view (searchable, filterable directory)
- [ ] Supplier detail page (profile, contracts, projects, performance)
- [ ] INN dashboard (supplier overview section)
- [ ] Supplier approval queue (for GF)
- [ ] Communication logging UI
- [ ] Rating UI (post-project completion)

**Deliverables:**
- Complete supplier management UI
- Mobile-responsive forms and lists
- Offline-capable (Tier 1 data: 50 suppliers)

### Success Criteria

- [ ] INN can create supplier end-to-end
- [ ] GF can approve supplier
- [ ] INN can log supplier communication
- [ ] INN can rate supplier after project
- [ ] E2E test passing: Full supplier lifecycle

---

## Sprint 2 (Month 2): Material Management Foundation

**Goal:** Enable KALK/INN to manage material catalog and project costs.

**Priority:** CRITICAL - Addresses Pre-Mortem Danger #3

### Week 1-2: Backend (Material Module)

**Tasks:**
- [ ] `Material` entity implementation (catalog, multi-supplier pricing)
- [ ] `ProjectMaterialRequirement` entity implementation (BOM)
- [ ] `PurchaseOrder` entity implementation
- [ ] Material repository (CRUD, search with indexes)
- [ ] Material service (price calculations, supplier comparison)
- [ ] PO service (creation, approval workflow, delivery tracking)
- [ ] Material controller (REST endpoints)
- [ ] PO controller (REST endpoints, approval routing)
- [ ] Real-time cost update logic (delivery → project.actualCost)

**Deliverables:**
- Working API: Material catalog management
- Working API: Project BOM management
- Working API: Purchase order lifecycle
- Unit tests: 90%+ coverage
- Integration tests: Material delivery → project cost update

### Week 3-4: Frontend (Material UI)

**Tasks:**
- [ ] Material catalog form (create/edit material, multi-supplier pricing)
- [ ] Material catalog list (searchable, price comparison)
- [ ] Project materials view (BOM with cost tracking)
- [ ] Purchase order form (line items, approval routing)
- [ ] PO list/detail (delivery tracking)
- [ ] INN dashboard (procurement section)
- [ ] Real-time cost update indicators (toast notifications, budget alerts)

**Deliverables:**
- Complete material management UI
- Project BOM view with real-time costs
- PO workflow from creation → approval → delivery
- Mobile-optimized material search

### Success Criteria

- [ ] KALK can create material catalog
- [ ] KALK can add materials to estimate
- [ ] PLAN can view project BOM
- [ ] INN can create PO from material requirements
- [ ] INN records delivery → Project costs update in <2 seconds
- [ ] E2E test: Material procurement updates budget real-time

---

## Sprint 3 (Month 3): Lexware Integration Phase 1 + INN Dashboard Complete

**Goal:** BUCH can sync financial data between KOMPASS and Lexware.

**Priority:** CRITICAL - Addresses Pre-Mortem Danger #4

### Week 1: Lexware CSV Integration

**Tasks:**
- [ ] CSV export service (contracts → Lexware format)
- [ ] CSV import service (payments → KOMPASS)
- [ ] CSV validation (format, required fields, referential integrity)
- [ ] CSV export UI (date range, entity type selection)
- [ ] CSV import UI (upload, field mapping, validation preview)
- [ ] Reconciliation dashboard (matched/unmatched items)
- [ ] Error handling and logging
- [ ] Documentation: Step-by-step CSV process guide

**Deliverables:**
- Working CSV export/import
- Reconciliation dashboard for BUCH
- BUCH training materials

### Week 2: INN Dashboard Complete

**Tasks:**
- [ ] Finish INN dashboard (all sections)
- [ ] Today's deliveries section
- [ ] Open purchase orders section
- [ ] Pending supplier invoices section
- [ ] Supplier performance cards
- [ ] Material stock alerts (Phase 2 prep)
- [ ] Mobile-optimized INN dashboard

**Deliverables:**
- Complete INN dashboard
- All supplier/material workflows accessible

### Week 3-4: Integration Testing & Polish

**Tasks:**
- [ ] End-to-end supplier workflow testing
- [ ] End-to-end material workflow testing
- [ ] Lexware CSV round-trip testing
- [ ] Performance optimization (dashboard load times)
- [ ] Mobile UX refinement
- [ ] Beta user testing (1 user per role)
- [ ] Bug fixes from beta feedback

**Deliverables:**
- All critical bugs fixed
- Performance: Dashboards load in <3s on 3G
- Beta user satisfaction: ≥4/5

### Success Criteria

- [ ] BUCH completes weekly CSV reconciliation in <60 minutes
- [ ] Zero data loss in CSV round-trip
- [ ] INN rates supplier workflows: ≥4/5
- [ ] All Danger #3 validation tests pass

---

## Sprint 4 (Month 4): Phase 1 AI - RAG Search

**Goal:** Add intelligent search without requiring historical data.

**Priority:** HIGH - Phase 1 AI (safe)

### Week 1-2: RAG Implementation

**Tasks:**
- [ ] Vector embedding service (OpenAI or local model)
- [ ] Index customer descriptions, notes, protocols
- [ ] Index project summaries and descriptions
- [ ] Index material descriptions
- [ ] Semantic search API endpoint
- [ ] Search UI integration (replace simple keyword search)
- [ ] Result ranking and relevance scoring

**Deliverables:**
- Working RAG search across customers, projects, materials
- Query: "Ladeneinrichtung für Bio-Laden in München" → Returns relevant past projects
- Performance: <500ms response time

### Week 3-4: Audio Transcription

**Tasks:**
- [ ] Whisper API integration (or local German STT model)
- [ ] Audio recording UI (mobile PWA)
- [ ] Audio upload and processing
- [ ] Transcription service
- [ ] Transcription review/edit UI
- [ ] Auto-save as protocol/note
- [ ] Offline queue for audio (compress before storing)

**Deliverables:**
- ADM can record voice note
- System transcribes (≥85% accuracy for German)
- Transcription saved as protocol
- Works offline (audio queued, transcribed when online)

### Success Criteria

- [ ] RAG search accuracy: ≥80% relevant results
- [ ] Audio transcription accuracy: ≥85%
- [ ] ADM reports: "Voice notes save me 30 minutes/day"

---

## Sprint 5 (Month 5): Offline PWA Optimization

**Goal:** Prove offline-first works reliably within iOS 50MB limit.

**Priority:** CRITICAL - Addresses Pre-Mortem Danger #2

### Week 1-2: Tiered Storage Implementation

**Tasks:**
- [ ] Implement Tier 1 (Essential, 5 MB) caching
- [ ] Implement Tier 2 (Recent, 10 MB) LRU eviction
- [ ] Implement Tier 3 (Pinned, 35 MB) user-controlled
- [ ] Quota monitoring and alerts (80%, 95% thresholds)
- [ ] Storage management UI (pin/unpin, view usage)
- [ ] Image compression service (1.5MB → 200KB)
- [ ] Audio transcription & deletion (5MB audio → 5KB text)

**Deliverables:**
- Tiered storage fully functional
- Quota never exceeds 50MB
- Users can pin/unpin content
- Storage management page

### Week 3-4: Conflict Resolution

**Tasks:**
- [ ] Field-level conflict detection
- [ ] Auto-merge rules (non-conflicting fields, last-write-wins)
- [ ] Conflict resolution UI (manual resolution for semantic conflicts)
- [ ] Conflict resolution testing (100+ test scenarios)
- [ ] Sync queue with retry logic (exponential backoff)
- [ ] Manual intervention dashboard (for stuck syncs)

**Deliverables:**
- Conflict detection: 100% of conflicts caught
- Auto-merge: 70% of conflicts resolved automatically
- Manual resolution UI: Clear, user-friendly
- Zero data loss in conflict scenarios

### Success Criteria

- [ ] 100 offline changes sync in <30 seconds
- [ ] 95%+ sync success rate
- [ ] iOS 50MB limit never exceeded
- [ ] Zero data loss after 7 days offline

---

## Sprint 6 (Month 6): MVP Launch Preparation

**Goal:** Final testing, documentation, training materials.

**Priority:** CRITICAL - MVP Launch

### Week 1: Testing & Bug Fixes

**Tasks:**
- [ ] Run complete pre-mortem validation checklist
- [ ] All Danger #1 tests (AI de-scoping)
- [ ] All Danger #2 tests (zero data functionality)
- [ ] All Danger #3 tests (supplier/material workflows)
- [ ] All Danger #4 tests (CSV reliability)
- [ ] Performance testing (load times, sync times)
- [ ] Security testing (RBAC, data protection)
- [ ] Fix all critical and high-priority bugs

### Week 2: Documentation & Training

**Tasks:**
- [ ] User documentation (per role)
- [ ] Video tutorials (5-10 minutes each)
- [ ] Quick reference cards (laminated, printed)
- [ ] Admin documentation (deployment, maintenance)
- [ ] Training workshop materials
- [ ] FAQ and troubleshooting guide

### Week 3: Beta Launch (5 Users)

**Tasks:**
- [ ] Deploy to beta environment
- [ ] Onboard 1 user per role (Markus, Claudia, Thomas, Stefan, Anna)
- [ ] Daily check-ins: Issues, feedback
- [ ] Bug fixes: Hot fixes deployed within 24 hours
- [ ] Feedback collection: What works? What doesn't?

### Week 4: Production Launch

**Tasks:**
- [ ] Deploy to production
- [ ] Team workshop (2 hours): Product vision, core workflows
- [ ] Role-specific training (30 minutes each)
- [ ] Launch announcement
- [ ] Support availability: Daily for Month 1

**Deliverables:**
- Fully tested MVP
- All users trained
- Production environment stable
- Support plan active

### Success Criteria (Month 6)

- [ ] All pre-mortem validation tests pass
- [ ] Zero critical bugs
- [ ] 80%+ daily active users (Week 4)
- [ ] User satisfaction: ≥4/5
- [ ] Core workflows completable without support

---

## Sprint 7-9 (Months 7-9): Lexware Integration Phase 2

**Goal:** Semi-automated sync (90% automation, 10% human review).

**Priority:** HIGH - Addresses Pre-Mortem Danger #4

### Sprint 7: Automated File Sync Service

**Tasks:**
- [ ] Scheduled export job (nightly: contracts → shared folder)
- [ ] Scheduled import job (hourly: payments → KOMPASS)
- [ ] File monitoring service (watch for new Lexware exports)
- [ ] Validation before sync (customer exists, amounts match, no duplicates)
- [ ] Error queue with retry logic
- [ ] Sync health dashboard (for BUCH)
- [ ] Email notifications (sync success/failure)

### Sprint 8: Automated Validation & Matching

**Tasks:**
- [ ] 3-way match automation (Invoice vs. PO vs. Delivery)
- [ ] Fuzzy matching for unmatched items (by customer, amount, date)
- [ ] Automated discrepancy resolution (where safe)
- [ ] Manual review queue (for complex cases)
- [ ] Reconciliation dashboard v2 (enhanced)

### Sprint 9: Testing & Rollout

**Tasks:**
- [ ] Phase 2 integration testing (1000+ transaction test set)
- [ ] Parallel run (Phase 1 and Phase 2 simultaneously for 2 weeks)
- [ ] Compare results: Data consistency, time savings, error rate
- [ ] BUCH training on Phase 2 (30 minutes)
- [ ] Cutover to Phase 2 (deprecate manual CSV)

**Deliverables:**
- 90%+ sync auto-resolved
- Payment status latency: <4 hours
- BUCH weekly reconciliation: <15 minutes

### Success Criteria

- [ ] Sync error rate: <5%
- [ ] BUCH satisfaction: ≥4/5 ("Much better, mostly automated")
- [ ] Zero financial data inconsistencies reported

---

## Sprint 10-12 (Months 10-12): Data Quality & Phase 3 Prep

**Goal:** Prepare data foundation for Phase 3 AI.

**Priority:** MEDIUM - Enables future phases

### Sprint 10: Data Quality Audit Tools

**Tasks:**
- [ ] Data quality dashboard (field completion rates, accuracy audit)
- [ ] Automated data validation queries (run daily)
- [ ] Data cleanup tools (deduplicate, fix formats, complete missing fields)
- [ ] Field completion tracking per entity type
- [ ] Data quality reports for GF (monthly)

### Sprint 11: Historical Data Collection

**Tasks:**
- [ ] Import tool for past projects (if available)
- [ ] Import tool for past opportunities with outcomes
- [ ] Data enrichment: Add outcome labels (won/lost), reasons, final costs
- [ ] Baseline ML training set preparation
- [ ] Data warehouse setup (for ML training - separate from production)

### Sprint 12: Phase 3 Readiness Assessment

**Tasks:**
- [ ] Run all data quality validations (see AI Data Requirements)
- [ ] Check: 100+ opportunities (50 won, 50 lost)? ✓ or ✗
- [ ] Check: 50+ completed projects with full cost tracking? ✓ or ✗
- [ ] Check: 12+ months invoice/payment data? ✓ or ✗
- [ ] Check: Field completion ≥90%? ✓ or ✗
- [ ] Decision: GREEN-LIGHT Phase 3 or WAIT longer

**Deliverables:**
- Data quality report card
- Phase 3 readiness assessment
- Go/No-Go decision for AI features

**Decision Point:** If data quality insufficient, Phase 3 delayed. No exceptions.

---

## Year 2: Phase 3 AI & Advanced Features (Months 12-24+)

**Prerequisite:** Phase 3 data quality gates PASSED.

### Sprint 13-15: ML Model Development

**Tasks:**
- [ ] Lead scoring model (train, validate, deploy)
- [ ] Risk assessment model (budget/timeline predictions)
- [ ] Backtesting on historical data (validate ≥75% accuracy)
- [ ] Explainability implementation (SHAP/LIME)
- [ ] Confidence threshold enforcement (hide <70%)
- [ ] A/B testing framework (compare AI-assisted vs. manual)

### Sprint 16-18: Predictive Features UI

**Tasks:**
- [ ] AI insights sections on dashboards (with toggle)
- [ ] Confidence scores and explanation links
- [ ] Feedback mechanism ("Was this helpful?")
- [ ] AI-powered recommendations (with user approval required)
- [ ] Performance monitoring (track prediction accuracy in production)

### Sprint 19-21: Lexware Integration Phase 3

**Tasks:**
- [ ] Real-time webhook integration
- [ ] Bidirectional sync service
- [ ] Conflict resolution automation
- [ ] <10 minute latency target
- [ ] 99% automation target

### Sprint 22-24: Polish & Optimization

**Tasks:**
- [ ] Performance optimization across all modules
- [ ] UX refinements based on 12 months of user feedback
- [ ] Feature pruning (remove unused features)
- [ ] Advanced reporting and analytics

---

## Resource Allocation

### Team Composition (Phase 1: Months 1-6)

**Backend:** 2 FTE
- Sprint 1: Supplier module
- Sprint 2: Material module
- Sprint 3: Lexware integration
- Sprint 4-6: AI features (RAG, STT)

**Frontend:** 2 FTE
- Sprint 1: Supplier UI
- Sprint 2: Material UI
- Sprint 3: INN dashboard
- Sprint 4-6: Offline optimization, conflict resolution

**QA:** 1 FTE (full-time)
- All sprints: Testing, validation, pre-mortem checklist

**Product Owner:** 0.5 FTE
- User research, feedback collection, roadmap prioritization

**DevOps:** 0.5 FTE
- Deployment, monitoring, performance optimization

**Total:** 6 FTE for Phase 1

### Budget (Phase 1)

| Category | Cost | Notes |
|----------|------|-------|
| Development | €180k | 6 FTE × €30k/month × 1 month (Sprint 1) × 6 sprints = €180k |
| Infrastructure | €5k | CouchDB, hosting, monitoring |
| Tools & Services | €3k | OpenAI API (STT, RAG), development tools |
| Training & Docs | €2k | Video production, documentation |
| **Total Phase 1** | **€190k** | 6-month MVP development |

---

## Risk Management

### Risk 1: Scope Creep (AI Feature Requests)

**Risk:** Stakeholders request Phase 3 AI features during Phase 1.

**Mitigation:**
- **Firm "No":** Reference this roadmap and pre-mortem analysis
- **Explain Why:** "Data requirements not met. Would deliver inaccurate predictions."
- **Promise Future:** "In Phase 3 (Month 12+), when data supports it."
- **Redirect:** "What core workflow improvement would help you now?"

### Risk 2: Supplier/Material Modules Take Longer Than Expected

**Risk:** Complex modules delay MVP launch.

**Mitigation:**
- **MVP Within MVP:** Start with 80% of features, defer edge cases
- **Parallel Development:** Backend and frontend teams work simultaneously
- **Frequent Integration:** Daily builds, weekly demos
- **Cut Low-Priority:** If behind, cut: Inventory management (Phase 2), RFQ workflow (Phase 2), Bulk actions (Phase 2)

### Risk 3: Lexware Integration Fails in Production

**Risk:** CSV process doesn't work reliably with real Lexware instance.

**Mitigation:**
- **Early Testing:** Test with real Lexware by Week 2 of Sprint 3
- **Lexware Expert:** Consult with Lexware support engineer
- **Fallback Plan:** If Phase 1 CSV unworkable, jump directly to Phase 2 (file-based automation)
- **Communication:** Transparent with BUCH about issues and solutions

### Risk 4: User Adoption Slower Than Expected

**Risk:** Users resist change, continue using Excel.

**Mitigation:**
- **User Research:** Interview resisters, understand root causes
- **Quick Wins:** Identify one easy task that's much faster in KOMPASS
- **Champions:** Recruit early adopters to evangelize
- **Incentives:** Recognize users with high data quality (gamification)
- **Patience:** Allow 3-month adoption period before declaring failure

---

## Success Metrics

### Sprint-Level Metrics

| Sprint | Key Metric | Target |
|--------|------------|--------|
| Sprint 1 | Supplier endpoints functional | 100% API tests pass |
| Sprint 2 | Material cost updates real-time | <2s latency |
| Sprint 3 | CSV reconciliation time | <60 minutes |
| Sprint 4 | RAG search relevance | >80% useful results |
| Sprint 5 | Offline sync success rate | >95% |
| Sprint 6 | MVP launch readiness | All pre-mortem tests pass |

### Phase-Level Metrics

| Phase | Key Metric | Target |
|-------|------------|--------|
| **Phase 1 (Month 6)** | Daily active users | >80% |
| | User satisfaction | ≥4/5 |
| | Core workflows completable | 100% without support |
| | Excel usage declining | <50% (down from 100%) |
| | INN supplier workflow complete | 100% in KOMPASS |
| | Material cost tracking real-time | <2s latency |
| **Phase 2 (Month 9)** | Lexware sync automation | >90% |
| | BUCH reconciliation time | <15 minutes |
| | Sync error rate | <5% |
| **Phase 3 (Month 18)** | AI prediction accuracy | ≥75% |
| | Phase 3 data gates passed | ✓ |
| | Real-time sync latency | <10 minutes |

---

## Roadmap Visualization

```
Month 1-3: Critical Gap Closure (Supplier + Material + Lexware Phase 1)
└─ Sprint 1: Supplier Management ██████████
└─ Sprint 2: Material Management ██████████
└─ Sprint 3: Lexware CSV + INN  ██████████
   └─> Milestone: INN workflows complete ✓

Month 4-6: Phase 1 AI + Offline Optimization
└─ Sprint 4: RAG + Audio STT    ██████████
└─ Sprint 5: Offline PWA        ██████████
└─ Sprint 6: MVP Launch Prep    ██████████
   └─> Milestone: MVP Launch ✓

Month 7-9: Lexware Integration Phase 2
└─ Sprint 7-9: Semi-Automated Sync ██████████
   └─> Milestone: 90% Sync Automation ✓

Month 10-12: Data Quality & Phase 3 Prep
└─ Sprint 10-12: Data Audit & ML Prep ██████████
   └─> Decision Point: Phase 3 GO/NO-GO

Year 2 (Month 12-24): Phase 3 AI (IF data gates passed)
└─ Sprint 13-24: ML Models + Real-Time Sync ████████████████████████
   └─> Milestone: Predictive Analytics Launch ✓
```

---

## Go/No-Go Criteria

### MVP Launch (Month 6) - Go/No-Go

**GO if:**
- ✅ All Danger #1-4 validation tests pass
- ✅ Zero critical bugs
- ✅ Beta users: ≥4/5 satisfaction
- ✅ Performance: <3s dashboard load on 3G
- ✅ Offline: 95%+ sync success in beta
- ✅ INN + PLAN + KALK workflows 100% complete

**NO-GO if:**
- ❌ Any critical bug (data loss, security vulnerability, compliance violation)
- ❌ Performance: >5s dashboard load
- ❌ Offline: <85% sync success
- ❌ Beta satisfaction: <3/5
- ❌ Supplier or Material workflows incomplete

**If NO-GO:** Delay launch by 1 sprint, fix issues, retest.

### Phase 3 AI (Month 12+) - Go/No-Go

**GO if:**
- ✅ All data quality gates passed (90%+ completion, <5% error rate, 100+ opportunities, 50+ projects, 12+ months data)
- ✅ ML models validated: ≥75% accuracy on test set
- ✅ User adoption solid: 90%+ daily active users, ≥4/5 satisfaction
- ✅ Phase 1 and 2 success metrics met

**NO-GO if:**
- ❌ Data quality insufficient (<90% completion or >5% error rate)
- ❌ Insufficient training data (<100 opportunities or <50 projects)
- ❌ ML model accuracy <70%
- ❌ User adoption weak (<80% active users)
- ❌ Users haven't requested AI features (no demand)

**If NO-GO:** Delay Phase 3 by 3-6 months, continue data collection, improve data quality.

---

## Related Documents

- [Pre-Mortem Analysis](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification
- [AI Strategy & Phasing](../product-vision/AI_STRATEGY_AND_PHASING.md) - AI roadmap
- [Supplier Management Spec](../specifications/SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Sprint 1 scope
- [Material Management Spec](../specifications/MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) - Sprint 2 scope
- [Lexware Integration Strategy](../specifications/LEXWARE_INTEGRATION_STRATEGY.md) - Sprint 3, 7-9 scope
- [User Adoption Strategy](../product-vision/USER_ADOPTION_STRATEGY.md) - Adoption tactics

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Product Team | Initial post-pre-mortem roadmap with sprint-level priorities |

