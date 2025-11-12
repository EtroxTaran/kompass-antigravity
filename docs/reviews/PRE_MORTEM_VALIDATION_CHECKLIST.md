# Pre-Mortem Validation Checklist

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active Testing Requirements  
**Owner:** QA & Product Team  

---

## Purpose

This checklist defines **specific, testable criteria** to validate that KOMPASS has successfully mitigated all 4 critical dangers identified in the pre-mortem analysis. These tests serve as acceptance criteria for each phase launch.

**Related Documents:**
- [Pre-Mortem Analysis](PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification
- [AI Strategy & Phasing](../product-vision/AI_STRATEGY_AND_PHASING.md) - AI mitigation plan
- [Supplier Management Spec](../specifications/SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Workflow gap mitigation
- [Lexware Integration Strategy](../specifications/LEXWARE_INTEGRATION_STRATEGY.md) - Integration mitigation

---

## Danger #1: Fatal Overreach & Identity Crisis

### Problem Statement (from Pre-Mortem)

> "The project is dangerously shifting from a focused, niche CRM/PM tool into an all-encompassing, unproven 'Autonomous Business Partner.' This rapid expansion of scope creates a confusing product identity, dilutes the core value proposition, and guarantees feature bloat."

### Mitigation Strategy

- AI features phase-locked behind data quality gates
- Phase 1 delivers full value without predictive AI
- Users can toggle AI features OFF

### Validation Tests

#### Test 1.1: Phase 1 Core Workflows Complete Without AI

**Requirement:** All daily user tasks completable with AI features disabled.

**Test Scenarios:**

✅ **ADM Persona (Markus):**
- [ ] Can view his customer list
- [ ] Can create new customer
- [ ] Can log customer visit (protocol)
- [ ] Can record voice note and get transcription (Phase 1 AI - allowed)
- [ ] Can view opportunities
- [ ] Can update opportunity probability (manual input)
- [ ] Can search past projects using RAG search (Phase 1 AI - allowed)
- [ ] Can navigate daily route without AI optimization
- [ ] Can capture expenses and mileage

✅ **PLAN Persona (Thomas):**
- [ ] Can view assigned projects
- [ ] Can update project status
- [ ] Can assign team members to tasks
- [ ] Can view Gantt chart (without AI overlays)
- [ ] Can track project costs (real-time from deliveries)
- [ ] Can view material requirements
- [ ] Can confirm material deliveries

✅ **INN Persona (Claudia):**
- [ ] Can manage suppliers (full CRUD)
- [ ] Can create purchase orders
- [ ] Can track deliveries
- [ ] Can process supplier invoices
- [ ] Can log supplier communications

✅ **KALK Persona (Stefan):**
- [ ] Can create cost estimates
- [ ] Can search material catalog
- [ ] Can compare supplier prices (manual comparison)
- [ ] Can use calculation templates (non-AI)
- [ ] Can track project margins

✅ **BUCH Persona (Anna):**
- [ ] Can view contracts
- [ ] Can view project costs
- [ ] Can approve purchase orders
- [ ] Can approve supplier invoices
- [ ] Can export financial reports

**Acceptance:** 100% of scenarios pass with AI toggle = OFF

---

#### Test 1.2: AI Features Are Clearly Marked as Phase 3

**Requirement:** Users understand what's Phase 1 (available now) vs. Phase 3 (future).

**Test Scenarios:**

- [ ] All AI predictions have **[Phase 3]** label in UI
- [ ] AI toggle switch visible in top-right of each dashboard
- [ ] AI toggle default state: OFF
- [ ] Clicking AI info icon shows link to AI Strategy document
- [ ] When AI toggle ON but data requirements NOT met, show message: "KI-Features noch nicht verfügbar. Datenqualität: X% (Ziel: 90%). Geschätzte Zeit: Y Monate."
- [ ] Phase 1 AI features (RAG search, audio transcription) have NO phase label (always available)

**Acceptance:** 100% of AI features correctly labeled

---

#### Test 1.3: Data Quality Gates Enforced

**Requirement:** Phase 3 AI features remain locked until data requirements met.

**Test Scenarios:**

- [ ] System starts with 0 historical data
- [ ] Lead scoring feature: DISABLED (requires 100+ opportunities)
- [ ] Risk assessment feature: DISABLED (requires 50+ projects)
- [ ] Cashflow forecasting: DISABLED (requires 12+ months data)
- [ ] Route optimization: DISABLED (requires 3+ months GPS data)
- [ ] Anomaly detection: DISABLED (requires 6+ months data)
- [ ] System shows data readiness dashboard: "Lead Scoring: 0/100 opportunities (0%)"
- [ ] After importing 100+ opportunities: Lead scoring becomes available
- [ ] GF can enable feature after data gate passed

**Acceptance:** All Phase 3 features locked until data thresholds met

---

#### Test 1.4: Users Can Disable AI Permanently

**Requirement:** Users uncomfortable with AI can turn it off forever.

**Test Scenarios:**

- [ ] User opens settings
- [ ] User finds "AI Features" section
- [ ] User disables "AI Features" toggle
- [ ] User saves preferences
- [ ] User navigates to all dashboards: No AI features visible
- [ ] User opens settings again: Toggle still OFF (persisted)
- [ ] GF can disable AI globally (overrides user preferences)

**Acceptance:** AI can be permanently disabled per user or globally

---

## Danger #2: The "AI Magic" Fallacy

### Problem Statement

> "The new vision is critically dependent on vast arrays of complex AI/ML features that assume large, high-quality, structured historical datasets that almost certainly do not exist. This will lead to inaccurate predictions, unreliable features, and catastrophic loss of user trust."

### Mitigation Strategy

- Phase 1 works with zero historical data
- AI predictions show confidence scores
- Low-confidence predictions (<70%) hidden
- Explainability provided for all predictions

### Validation Tests

#### Test 2.1: System Functions with Zero Data

**Requirement:** Brand new KOMPASS installation delivers value immediately.

**Test Scenarios:**

- [ ] Fresh install with 0 customers, 0 projects, 0 historical data
- [ ] User can create first customer
- [ ] User can create first opportunity
- [ ] User can create first project
- [ ] User can add materials to catalog
- [ ] User can create first supplier
- [ ] RAG search works (returns "no results" gracefully)
- [ ] Audio transcription works (no historical data needed)
- [ ] No AI predictions shown (data gates not met)
- [ ] No errors, no crashes, no confusing UI

**Acceptance:** All core workflows function with zero data

---

#### Test 2.2: AI Features Degrade Gracefully

**Requirement:** When AI data is insufficient, features degrade gracefully with clear messaging.

**Test Scenarios:**

**Insufficient Data for Lead Scoring (50 opportunities, need 100):**
- [ ] Lead scoring feature: Disabled
- [ ] Message shown: "Lead Scoring erfordert 100+ abgeschlossene Opportunities. Aktuell: 50 (50%). Weiter Daten sammeln."
- [ ] No predictions shown
- [ ] Users can enter manual probability estimates
- [ ] System suggests: "Opportunity manually bewerten"

**Insufficient Data for Cashflow Forecasting (6 months data, need 12):**
- [ ] Cashflow chart: Shows historical data only (no forecast line)
- [ ] Message: "Cashflow-Prognose erfordert 12+ Monate Daten. Aktuell: 6 Monate."
- [ ] Chart label: "Historisch (keine Prognose verfügbar)"

**Acceptance:** All degraded states have clear user messaging

---

#### Test 2.3: Low-Confidence Predictions Hidden

**Requirement:** Predictions below 70% confidence are not shown to avoid misleading users.

**Test Scenarios:**

- [ ] ML model generates prediction with 65% confidence
- [ ] System checks: confidence < 70%
- [ ] Prediction NOT displayed in UI
- [ ] Log warning: "Prediction below confidence threshold (65% < 70%)"
- [ ] User sees: "Keine AI-Prognose verfügbar (unzureichende Daten)"

**Acceptance:** Zero predictions with confidence <70% shown to users

---

#### Test 2.4: Explainability Required for All Predictions

**Requirement:** Every AI prediction has explanation and confidence score.

**Test Scenarios:**

**Lead Scoring Prediction:**
- [ ] Opportunity shows: "85% Abschlusswahrscheinlichkeit"
- [ ] Confidence badge: "85% Konfidenz" visible
- [ ] "Warum?" link present
- [ ] Click "Warum?": Opens modal with explanation:
  - "Basiert auf 12 ähnlichen Projekten"
  - "Gleiche Kunden-Größe, Region, Projektumfang"
  - "Diese 12 Projekte hatten 82% Erfolgsrate"
- [ ] "Nicht hilfreich?" feedback link present

**Risk Assessment Prediction:**
- [ ] Project shows: "🔴 85% Risiko für Kostenüberschreitung"
- [ ] Confidence: "85%" displayed
- [ ] Explanation link: Opens detailed reasoning
  - "Material-Kosten +15% über Plan"
  - "Bei ähnlichen Projekten führte dies in 9 von 10 Fällen zu Überschreitung"
  - "Empfehlung: Budget-Review mit KALK"

**Acceptance:** 100% of predictions have confidence + explanation

---

## Danger #3: Critical Workflow Gaps

### Problem Statement

> "The complete absence of dedicated modules for Supplier/Subcontractor Management and Material/Inventory Management makes KOMPASS an incomplete and ultimately frustrating tool for the PLAN and INN personas."

### Mitigation Strategy

- Complete Supplier Management module (Phase 1)
- Complete Material Management module (Phase 1)
- INN dashboard with procurement workflows
- Real-time project cost tracking from material deliveries

### Validation Tests

#### Test 3.1: INN Persona Can Manage Full Supplier Lifecycle

**Requirement:** Claudia (INN) can execute all supplier workflows without external tools.

**Test Scenarios:**

✅ **Supplier Onboarding:**
- [ ] INN creates new supplier (company, contact, services, documents)
- [ ] System validates: Required fields, insurance certificate
- [ ] System sets status: 'PendingApproval'
- [ ] GF receives notification: Supplier awaiting approval
- [ ] GF reviews supplier profile
- [ ] GF approves supplier
- [ ] System sets status: 'Active'
- [ ] INN notified: Supplier ready for use

✅ **Contract Creation:**
- [ ] INN creates supplier contract (scope, value, timeline, payment terms)
- [ ] System validates: Contract value, dates, payment schedule totals 100%
- [ ] If <€50k: Auto-approved
- [ ] If ≥€50k: Routed to GF for approval
- [ ] GF approves
- [ ] INN sends contract to supplier
- [ ] INN uploads signed contract
- [ ] Contract status: 'Signed'

✅ **Supplier Assignment to Project:**
- [ ] INN or PLAN assigns supplier to project
- [ ] System creates ProjectSubcontractor record
- [ ] Work package defined: Elektrik Installation
- [ ] Estimated cost: € 35.000
- [ ] Timeline set: Start/end dates
- [ ] PLAN sees assignment on Gantt chart
- [ ] PLAN tracks progress: Updates completion %

✅ **Supplier Invoice Processing:**
- [ ] Supplier sends invoice (email PDF)
- [ ] INN creates SupplierInvoice record
- [ ] INN uploads invoice PDF
- [ ] INN links to: Project, Contract, PO
- [ ] System performs 3-way match: Invoice vs. PO vs. Delivery
- [ ] If match OK and <€1k: Auto-approved
- [ ] If >€1k: Routed to BUCH for approval
- [ ] BUCH reviews and approves
- [ ] BUCH marks as paid after Lexware payment
- [ ] System updates project.actualSupplierCosts immediately
- [ ] PLAN sees updated project budget

✅ **Supplier Communication Logging:**
- [ ] INN logs phone call with supplier
- [ ] INN enters: Subject, content, date, participants
- [ ] INN marks: "Requires follow-up" + date
- [ ] System shows follow-up reminder on INN dashboard
- [ ] INN completes follow-up, marks done

✅ **Supplier Performance Rating:**
- [ ] After project completion, system prompts: "Rate supplier performance"
- [ ] INN rates 4 dimensions: Quality, Reliability, Communication, Price/Value
- [ ] INN provides written feedback
- [ ] System calculates overall rating: 4.8/5.0
- [ ] Rating visible on supplier profile
- [ ] Rating influences future supplier selection

**Acceptance:** 100% of INN workflows completable in KOMPASS (no Excel/email needed)

---

#### Test 3.2: PLAN Persona Can Track Material Costs Real-Time

**Requirement:** Thomas (PLAN) sees accurate, real-time project costs from material deliveries.

**Test Scenarios:**

✅ **Material Requirements Planning:**
- [ ] KALK creates offer with 12 materials (BOM)
- [ ] Estimated material cost: € 125.000
- [ ] Customer accepts offer
- [ ] System creates contract, then project
- [ ] System copies BOM to project (12 ProjectMaterialRequirement records)
- [ ] PLAN views project materials tab
- [ ] PLAN sees 12 materials with estimated costs

✅ **Material Confirmation:**
- [ ] PLAN reviews material requirements
- [ ] PLAN adjusts 2 quantities (final measurements different)
- [ ] System recalculates estimated costs
- [ ] PLAN confirms all requirements: Status = 'Confirmed'

✅ **Procurement:**
- [ ] INN creates purchase order for 5 materials (supplier: Schreinerei Müller)
- [ ] PO value: € 52.000
- [ ] System validates: Budget available
- [ ] System routes to GF (>€10k)
- [ ] GF approves PO
- [ ] INN sends PO to supplier

✅ **Delivery & Real-Time Cost Update:**
- [ ] Materials delivered to project site
- [ ] INN records delivery: 5 materials, quantities, actual unit prices
- [ ] System updates ProjectMaterialRequirement.actualQuantity and actualTotalCost
- [ ] **Real-time update:** System recalculates project.actualMaterialCosts
- [ ] **Real-time update:** System recalculates project.currentMargin
- [ ] **Latency test:** Cost update completes in <2 seconds
- [ ] PLAN refreshes project dashboard: Sees updated costs immediately
- [ ] Budget status updates: "OnTrack" (green) or "Warning" (amber) or "Exceeded" (red)
- [ ] If budget exceeded: PLAN and BUCH receive alert notification

✅ **Cost Variance Analysis:**
- [ ] After all deliveries, PLAN views material cost variance report
- [ ] Report shows: Estimated vs. Actual per material
- [ ] Variance: "- € 6.550 (-5,2%)" under budget (green)
- [ ] Largest variance: "Elektrik: + € 3.400 (+13,6%)" over (red)
- [ ] PLAN enters variance reason: "Zusätzliche Steckdosen benötigt"
- [ ] KALK reviews variances for future estimate improvement

**Acceptance:** Material costs update project budget within 2 seconds of delivery recording

---

#### Test 3.3: Material Catalog Enables Accurate Estimation

**Requirement:** KALK can create accurate estimates using material price database.

**Test Scenarios:**

- [ ] KALK preparing estimate for new opportunity
- [ ] KALK searches material catalog: "LED Panel 60x60"
- [ ] System returns: 3 matching materials
- [ ] KALK selects: "LED-Panel 60x60cm warmweiß (MAT-LED-001)"
- [ ] Material card shows:
  - "€ 145 (Durchschnitt)"
  - "€ 138-€ 152 (3 Lieferanten)"
  - "Bevorzugt: Schreinerei Müller (€ 145) ⭐"
- [ ] KALK clicks "Preise vergleichen"
- [ ] Comparison table shows all 3 suppliers with: Price, MOQ, Lead time, Rating
- [ ] KALK selects preferred supplier
- [ ] KALK adds material to estimate: Quantity 24, system auto-fills price € 145
- [ ] Estimate line item: "LED-Panels: 24 Stk × € 145 = € 3.480"
- [ ] Estimate total includes material costs accurately

**Acceptance:** KALK can complete full estimate using material catalog

---

## Danger #4: The Brittle Integration Strategy

### Problem Statement

> "The planned 'solution' of manual CSV import/export is a notorious failure point for data integrity and operational efficiency. This directly contradicts the core vision of a 'Single Source of Truth.'"

### Mitigation Strategy

- Phase 1: Manual CSV with reconciliation tools
- Phase 2: Semi-automated sync (90% automated)
- Phase 3: Real-time bidirectional sync (99% automated)
- Transparent communication about limitations

### Validation Tests

#### Test 4.1: CSV Export/Import Works Without Data Loss

**Requirement:** Phase 1 CSV process is reliable and complete.

**Test Scenarios:**

✅ **Contract Export (KOMPASS → Lexware):**
- [ ] BUCH creates 5 signed contracts in KOMPASS (Week 1)
- [ ] BUCH exports contracts to CSV (weekly process)
- [ ] CSV file generated: "kompass_contracts_2025-11-12.csv"
- [ ] CSV contains: All 5 contracts with complete data
- [ ] CSV format valid: Correct columns, no truncation, proper encoding (UTF-8)
- [ ] BUCH imports CSV into Lexware
- [ ] Lexware accepts: 5 contracts imported successfully
- [ ] BUCH verifies: All 5 contracts appear in Lexware correctly
- [ ] Contract values match: ±€0.01 tolerance
- [ ] Customer references match: KOMPASS customer ID → Lexware customer number

✅ **Payment Import (Lexware → KOMPASS):**
- [ ] Customer pays 3 invoices in Lexware (Week 1)
- [ ] BUCH exports payment report from Lexware (CSV)
- [ ] CSV file: "lexware_payments_2025-11-12.csv"
- [ ] BUCH imports CSV into KOMPASS
- [ ] System matches: 3 invoices by invoice number
- [ ] System updates invoice status: 'Pending' → 'Paid'
- [ ] System updates payment dates: Correct dates from Lexware
- [ ] No unmatched invoices (100% match rate)

**Acceptance:** Zero data loss, zero mismatches in round-trip test

---

#### Test 4.2: Reconciliation UI Shows All Discrepancies

**Requirement:** BUCH can see and resolve any sync issues.

**Test Scenarios:**

✅ **Scenario: Invoice Number Mismatch:**
- [ ] KOMPASS has invoice "R-2025-00456"
- [ ] Lexware CSV has invoice "R-2025-00457" (typo)
- [ ] Import process: System cannot match
- [ ] Reconciliation dashboard shows:
  - "⚠️ 1 nicht zugeordnete Rechnung"
  - Invoice details displayed
  - Suggested matches from KOMPASS (fuzzy match by customer, amount, date)
- [ ] BUCH manually matches: "R-2025-00456" ↔ "R-2025-00457"
- [ ] System updates, marks as resolved
- [ ] Reconciliation dashboard: "✓ Alle Rechnungen zugeordnet"

✅ **Scenario: Amount Mismatch:**
- [ ] Contract value in KOMPASS: € 146.370
- [ ] Invoice value in Lexware: € 73.185 (50% Anzahlung)
- [ ] Import: Amounts don't match (not an error - partial invoice)
- [ ] Reconciliation shows: "ℹ️ Teilrechnung: 50% des Vertragswerts"
- [ ] BUCH verifies: Correct, marks as expected

**Acceptance:** All discrepancies visible and resolvable

---

#### Test 4.3: BUCH Reconciliation Time Acceptable

**Requirement:** Weekly reconciliation takes ≤60 minutes (Phase 1), ≤15 minutes (Phase 2), ≤5 minutes (Phase 3).

**Test Scenarios:**

**Phase 1 Timing Test:**
- [ ] Week with 10 new contracts, 15 invoices, 20 payments
- [ ] BUCH performs full reconciliation:
  1. Export contracts from KOMPASS → Lexware (5 minutes)
  2. Import contracts into Lexware (5 minutes)
  3. Export payments from Lexware → KOMPASS (5 minutes)
  4. Import payments into KOMPASS (5 minutes)
  5. Review reconciliation dashboard (10 minutes)
  6. Resolve 2 unmatched items (10 minutes)
- [ ] **Total time:** <60 minutes
- [ ] BUCH feedback: "Tedious but manageable"

**Phase 2 Timing Test:**
- [ ] Same volume: 10 contracts, 15 invoices, 20 payments
- [ ] Automated sync runs nightly (contracts) and hourly (payments)
- [ ] BUCH reviews sync report: 10 minutes
- [ ] BUCH resolves 1 error: 5 minutes
- [ ] **Total time:** <15 minutes
- [ ] BUCH feedback: "Much better, mostly hands-off"

**Phase 3 Timing Test:**
- [ ] Same volume
- [ ] Real-time webhooks sync automatically
- [ ] BUCH reviews daily sync health dashboard: 5 minutes
- [ ] No errors to resolve
- [ ] **Total time:** <5 minutes
- [ ] BUCH feedback: "Seamless, I barely notice it"

**Acceptance:** Phase-specific time targets met

---

#### Test 4.4: Phase 2 Roadmap Funded and Scheduled

**Requirement:** Phase 2 (semi-automated sync) is not vaporware.

**Validation:**

- [ ] Phase 2 development roadmap exists: [Revised Implementation Roadmap](../implementation/REVISED_IMPLEMENTATION_ROADMAP.md)
- [ ] Phase 2 scheduled: Month 3-6 (specific sprints assigned)
- [ ] Phase 2 resources allocated: 1 backend developer, 50% time for 3 months
- [ ] Phase 2 budget approved: Line item in project budget
- [ ] Phase 2 success criteria defined: <5% error rate, <4h latency, <15min weekly reconciliation
- [ ] BUCH persona informed: "Phase 2 launching: March 2026"

**Acceptance:** Phase 2 is concrete plan with funding and timeline

---

## Danger #5: User Adoption Failure (Additional Validation)

### Test 5.1: Mobile-First Design for ADM

**Requirement:** ADM persona (Markus) can complete daily tasks on mobile in <3 taps.

**Test Scenarios:**

✅ **Log Customer Visit:**
- [ ] Tap 1: Open app (PWA)
- [ ] Tap 2: Tap customer card (from "Kürzlich besuchte")
- [ ] Tap 3: Tap "Notiz hinzufügen" FAB
- [ ] Voice input: "Kunde interessiert an LED-Beleuchtung"
- [ ] Transcription appears: Review and save
- [ ] **Total: 3 taps + voice input**

✅ **Create Activity:**
- [ ] Tap 1: FAB "+"
- [ ] Tap 2: Select "Besuchsprotokoll"
- [ ] Tap 3: Select customer from recent list
- [ ] Auto-filled: Date (today), time (now), GPS location
- [ ] Voice input: Notes
- [ ] Tap 4: Save
- [ ] **Total: 4 taps (acceptable)**

**Acceptance:** Key tasks completable in ≤3 taps

---

### Test 5.2: GPS Tracking is Optional with Clear Value Prop

**Requirement:** GPS tracking respects user privacy, provides clear benefit.

**Test Scenarios:**

- [ ] First-time user opens app
- [ ] System shows GPS permission request:
  - "GPS-Tracking aktivieren?"
  - "Vorteile: Automatische Kilometererfassung, Routenoptimierung"
  - "Sie können jederzeit pausieren oder deaktivieren"
  - [Aktivieren] [Später] [Niemals]
- [ ] User can select "Niemals": App works fully without GPS
- [ ] If user enables: Settings show toggle "GPS-Tracking" (can disable anytime)
- [ ] If disabled: Mileage manual entry required (fallback)
- [ ] Monthly report shows: "Zeitersparnis durch GPS: 2,5 Std" (quantified value)

**Acceptance:** GPS is optional, value proposition clear

---

### Test 5.3: Offline Mode Guarantees No Data Loss

**Requirement:** ADM (field user) can work offline for days without issues.

**Test Scenarios:**

✅ **Offline Operations:**
- [ ] User goes offline (airplane mode)
- [ ] User creates 5 customers
- [ ] User logs 10 activities
- [ ] User captures 3 expenses with photos
- [ ] User records 5 voice notes
- [ ] All saved to local DB
- [ ] Queue shows: "15 Änderungen wartend"
- [ ] **Total offline data:** <3 MB (well within limits)

✅ **Return Online:**
- [ ] User returns online after 3 days
- [ ] App detects online status
- [ ] Background sync starts automatically
- [ ] Progress indicator: "Synchronisiere 15 Änderungen... (3 von 15)"
- [ ] All 15 changes sync successfully
- [ ] Zero data loss
- [ ] Zero conflicts (different entities modified)
- [ ] Sync completes in <30 seconds
- [ ] Success message: "✓ Alle Änderungen synchronisiert"

**Acceptance:** 100% offline data syncs successfully without loss

---

## Test Execution Schedule

### Phase 1 MVP Launch (Month 6)

**Pre-Launch Validation:**
- Run all Danger #1 tests: AI de-scoping
- Run all Danger #2 tests: Zero data functionality
- Run all Danger #3 tests: Supplier/Material workflows
- Run all Danger #4 tests (Phase 1): CSV reliability

**Launch Criteria:**
- [ ] 100% of Phase 1 tests pass
- [ ] Zero critical bugs
- [ ] Performance: Dashboard loads in <3s on 3G
- [ ] Offline: 95%+ sync success rate in beta testing
- [ ] User acceptance: ≥4/5 stars from beta testers

**If any test fails:** Block launch, fix issues, retest

### Phase 2 Launch (Month 9)

**Pre-Launch Validation:**
- Run all Danger #4 tests (Phase 2): Semi-automated sync
- Regression: Run all Phase 1 tests again

**Launch Criteria:**
- [ ] 100% of Phase 2 tests pass
- [ ] Sync automation: 90%+ auto-resolved
- [ ] BUCH weekly reconciliation: <15 minutes
- [ ] Zero data loss incidents in Phase 2 beta

### Phase 3 Launch (Month 18+)

**Pre-Launch Validation:**
- Run all Danger #2 tests: AI data quality gates
- Run all Phase 3 AI tests: Explainability, confidence thresholds
- Run all Danger #4 tests (Phase 3): Real-time sync

**Launch Criteria:**
- [ ] Data quality audit passed: 90%+ field completion, <5% error rate
- [ ] AI backtesting: ≥70% accuracy on test set
- [ ] Real-time sync: <10 minute latency
- [ ] User trust: Zero "nonsensical prediction" complaints in beta

---

## Continuous Monitoring

### Post-Launch Health Checks

**Daily:**
- [ ] Sync success rate: Monitor, alert if <95%
- [ ] Offline queue: Monitor size, alert if >100 per user
- [ ] API errors: Monitor, alert if >1% error rate

**Weekly:**
- [ ] User satisfaction survey: NPS score
- [ ] Feature usage: Track AI toggle state (how many ON vs. OFF)
- [ ] Support tickets: Track integration/sync issues

**Monthly:**
- [ ] Data quality audit: Field completion rate, accuracy
- [ ] AI readiness check: Progress toward Phase 3 data gates
- [ ] BUCH reconciliation time: Measure actual time spent

**Quarterly:**
- [ ] Pre-mortem review: Are we still on track to avoid failures?
- [ ] User adoption: Are users abandoning Excel? (key metric)
- [ ] Feature bloat check: Are we adding non-essential features?

---

## Failure Threshold Criteria

### Red Flags (Immediate Action Required)

**If any of these occur, HALT and investigate:**

1. **Data Loss:** Any instance of offline data not syncing → Emergency fix
2. **Financial Inconsistency:** KOMPASS ≠ Lexware by >€100 → Immediate reconciliation
3. **AI Nonsense:** User reports "obviously wrong" prediction → Disable feature, investigate
4. **User Abandonment:** User reverts to Excel/spreadsheet → Interview user, fix root cause
5. **Performance Degradation:** Dashboard load >5s → Optimize immediately

### Success Indicators

**Green Lights (we're on track):**

1. ✅ Zero data loss incidents
2. ✅ User satisfaction ≥4/5 stars
3. ✅ Users completing workflows without support
4. ✅ Excel usage declining (measured via user survey)
5. ✅ BUCH satisfied with Lexware integration (≥3/5 Phase 1, ≥4/5 Phase 2)

---

## Related Documents

- [Pre-Mortem Analysis](PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Original risk identification
- [Test Strategy Document](TEST_STRATEGY_DOCUMENT.md) - Overall testing approach
- [User Adoption Strategy](../product-vision/USER_ADOPTION_STRATEGY.md) - Adoption mitigation plans

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Product & QA Team | Initial checklist for all 4 pre-mortem dangers |

