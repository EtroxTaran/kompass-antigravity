# KOMPASS AI Strategy & Phasing

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active  
**Owner:** Product & Engineering Leadership  

---

## Executive Summary

This document defines KOMPASS's phased approach to AI/ML features, directly addressing the **"Fatal Overreach"** risk identified in the pre-mortem analysis. Instead of launching as an "AI-first" platform, KOMPASS will deliver a rock-solid, offline-first CRM/PM foundation **first**, and introduce AI capabilities progressively as data quality and volume support them.

**Key Principle:** AI features are **enhancements**, not requirements. The system must deliver full value without any AI.

---

## Strategic Context

### Pre-Mortem Findings

The pre-mortem analysis identified critical risks:

1. **Fatal Overreach**: Shifting from focused CRM to "Autonomous Business Partner" dilutes core value
2. **Data Desert**: AI predictions require clean historical data that doesn't yet exist
3. **Black Box Trust Deficit**: Users will reject unreliable or unexplainable AI recommendations
4. **Misunderstanding User vs Buyer**: Daily users need simple tools, not complex AI dashboards

### Our Response

We embrace AI as a **long-term vision** while prioritizing **immediate user value**:

- **Year 1**: Become the most reliable offline-first CRM for Ladenbau
- **Year 2**: Add intelligent assistance that amplifies user expertise
- **Year 3**: Introduce predictive analytics when data quality supports confidence

---

## Phase 1: Foundation (Months 0-6) - MVP

### Philosophy

**"Simple, Reliable, Fast"** - Build user trust through flawless core functionality.

### Included AI Features

**Only 2 AI capabilities** that work without historical data:

#### 1. RAG-Based Search (Retrieval-Augmented Generation)

**What:** Semantic search across projects, materials, notes, and documents.

**Why Safe:**
- Works with any amount of data (even 1 document)
- Results are explainable (shows source documents)
- Fails gracefully (falls back to keyword search)
- Builds trust through transparency

**Implementation:**
- Vector embeddings of all text content
- Simple semantic similarity matching
- Source attribution on all results
- "Search previous projects for similar kitchen installation" → Returns 3 past projects with context

#### 2. Audio Transcription (German Speech-to-Text)

**What:** Convert voice notes to text for ADM persona while driving.

**Why Safe:**
- No prediction required - direct transcription
- Immediate user value (hands-free note taking)
- Errors are obvious and easily corrected
- Works offline (local STT models)

**Implementation:**
- German-optimized speech recognition (Whisper or similar)
- Offline capability critical for mobile use
- User reviews/edits transcription before saving
- "Kunde möchte LED-Beleuchtung ändern" → Transcribed and attached to customer record

### Explicitly EXCLUDED from Phase 1

All predictive, scoring, and optimization features:

- ❌ Lead scoring / probability adjustments
- ❌ Risk assessment / project warnings
- ❌ Cashflow forecasting
- ❌ Route optimization
- ❌ Anomaly detection
- ❌ Predictive timeline extensions
- ❌ AI-powered recommendations
- ❌ Performance scoring
- ❌ Cost predictions

**Rationale:** Insufficient training data = unreliable predictions = destroyed user trust.

### Data Requirements: Phase 1

**Minimum:** Zero historical data  
**Optimal:** Any amount of real KOMPASS data (improves search quality)

### Success Criteria: Phase 1

1. ✅ 90%+ of daily user tasks completable without AI
2. ✅ Offline sync works reliably (95%+ sync success rate)
3. ✅ Core workflows complete (Customer → Opportunity → Project → Invoice)
4. ✅ Users trust the system enough to abandon Excel/spreadsheets
5. ✅ RAG search returns relevant results in <500ms
6. ✅ Audio transcription accuracy >85% (German)

---

## Phase 2: Simple Intelligence (Months 6-12)

### Philosophy

**"Augment, Don't Replace"** - AI suggests, user decides.

### Included AI Features

**Pattern matching and rules-based intelligence** (not ML):

#### 1. Smart Template Recommendations

**What:** Suggest calculation templates based on customer type and project category.

**How:** Rule-based matching on customer industry, project size, location.

**Data Requirement:** 50+ completed offers with templates assigned.

**Example:**
- Customer type: "Lebensmittelhandel" + Project type: "Ladeneinrichtung" → Suggest "Hofladen Standard" template
- Confidence shown: "Basiert auf 12 ähnlichen Projekten"

#### 2. Duplicate Detection

**What:** Warn users when creating similar customers/contacts using fuzzy matching.

**How:** Levenshtein distance on company name, exact VAT match, address similarity.

**Data Requirement:** Existing customer database (any size).

**Example:**
- New customer: "Hofladen Mueller GmbH"
- Alert: "Ähnlich: Hofladen Müller GmbH (VAT: DE123456789) - Gleicher Kunde?"

#### 3. Material Price Trend Indicators

**What:** Show price movement indicators on materials (↑↓→).

**How:** Compare current price to rolling 30/90-day average.

**Data Requirement:** 3+ months of material price history.

**Example:**
- "Stahlregal (€145 ↑5% vs. letzten Monat)"

#### 4. Similar Project Finder

**What:** Find past projects similar to current opportunity for reference.

**How:** Vector similarity on: customer type, project scope, value range, location.

**Data Requirement:** 30+ completed projects.

**Example:**
- "3 ähnliche Projekte: REWE Hamburg (92% ähnlich), EDEKA Berlin (88%), Bio-Markt München (85%)"

### Data Requirements: Phase 2

**Minimum:**
- 3-6 months of KOMPASS operational data
- 30+ completed projects
- 50+ customer records
- 100+ material price data points

**Quality Gate:**
- ≥70% field completion rate (critical fields: customer type, project category, values, outcomes)

### Success Criteria: Phase 2

1. ✅ Template recommendations accepted >60% of the time
2. ✅ Duplicate detection prevents >80% of actual duplicates
3. ✅ Similar project finder deemed "helpful" by 70%+ of KALK users
4. ✅ Zero complaints about "creepy" or intrusive AI
5. ✅ AI features can be toggled OFF by user preference

---

## Phase 3: Predictive Analytics (Months 12-24)

### Philosophy

**"Intelligent Foresight with Transparency"** - Predict confidently, explain thoroughly.

### Included AI Features

**Machine learning models** with confidence thresholds:

#### 1. Lead Scoring & Win Probability

**What:** Predict opportunity close probability and suggest next actions.

**Model:** Logistic regression or gradient boosting on historical opportunity outcomes.

**Data Requirement:**
- 100+ opportunities (minimum: 50 won, 50 lost)
- Complete fields: customer type, value, sales cycle length, interactions, proposal details
- Outcome labels: won/lost with reason

**Confidence Threshold:** Don't show predictions <70% confidence.

**Example:**
- "Opportunity REWE München: 85% Abschlusswahrscheinlichkeit (↑ 10% vs. Ihre Schätzung)"
- Explanation: "Ähnliche Projekte (12) mit gleicher Kunde-Größe haben 82% Erfolgsrate. Empfehlung: Nachfassen in 3 Tagen."

#### 2. Project Risk Assessment

**What:** Predict project budget/timeline risks before they become critical.

**Model:** Random forest on project progress patterns, resource allocation, cost trends.

**Data Requirement:**
- 50+ completed projects with full cost tracking
- 20+ projects with delays or budget overruns (for failure pattern learning)
- Weekly snapshots of project status

**Confidence Threshold:** Only flag high-risk (>75% confidence).

**Example:**
- "Projekt P-2025-M003: 🔴 85% Risiko für Kostenüberschreitung"
- Explanation: "Material-Kosten +15% über Plan. Bei ähnlichen Projekten führte dies in 9 von 10 Fällen zu Budget-Überschreitung. Empfehlung: Budget-Review mit KALK."

#### 3. Cashflow Forecasting

**What:** Predict 30/60/90-day cashflow with confidence bands.

**Model:** Time series forecasting (Prophet or ARIMA) on historical invoicing/payment patterns.

**Data Requirement:**
- 12+ months of invoice and payment data
- Seasonal pattern data (2+ full business cycles preferred)
- Outstanding receivables tracking

**Confidence Threshold:** Show forecast with ±confidence interval. Don't show if interval >30% of prediction.

**Example:**
- "30-Tage Cashflow-Prognose: €285.000 (±€25k, 92% Konfidenz)"
- Chart shows confidence band shaded

#### 4. Route Optimization

**What:** Optimize sales routes to minimize drive time and fuel costs.

**Model:** Traveling salesman problem (TSP) solver with traffic data integration.

**Data Requirement:**
- 3+ months of GPS tracking data
- Historical visit durations
- Traffic pattern data (Google Maps API)

**Confidence Threshold:** Show time/fuel savings. Require user approval before applying.

**Example:**
- "Route optimiert: 12 km gespart, 18 Min. schneller"
- "Neue Reihenfolge: Hofladen Müller → REWE → EDEKA (statt REWE → EDEKA → Müller)"
- Action: [Anwenden] [Ablehnen]

#### 5. Anomaly Detection

**What:** Flag unusual patterns in expenses, time tracking, margins.

**Model:** Isolation forest or statistical outlier detection.

**Data Requirement:**
- 6+ months of expense/time tracking data
- Sufficient volume for baseline (100+ expense records per category)

**Confidence Threshold:** Only flag anomalies >2.5 standard deviations from norm.

**Example:**
- "⚠️ Ungewöhnliche Ausgaben: Reisekosten +250% vs. Durchschnitt (Projekt P-2025-M005)"
- Explanation: "Ihre üblichen Reisekosten: €450/Monat. Dieser Monat: €1.575. Bitte prüfen: Korrektur oder Sonderfall?"

### Data Requirements: Phase 3

**Minimum (HARD REQUIREMENT):**
- 12+ months of clean KOMPASS data
- 100+ completed opportunities (balanced win/loss)
- 50+ completed projects
- 1,000+ material price points
- 200+ expense tracking entries
- 100+ timesheet entries

**Quality Gate (MANDATORY BEFORE ENABLING):**

Must pass automated data quality audit:

1. **Completeness:** ≥90% of critical fields populated
2. **Accuracy:** Spot-check validation on 10% sample shows ≤5% error rate
3. **Consistency:** No contradictory data (e.g., project completed before it started)
4. **Volume:** Sufficient training examples per category (minimum thresholds listed above)
5. **Recency:** Data not older than 18 months

**If quality gate fails:** Phase 3 remains LOCKED. Display message to GF:

> "KI-Features (Phase 3) sind noch nicht verfügbar. Datenqualität: 78% (Ziel: 90%). Fehlende Daten: 45 Opportunities ohne Outcome-Labels, 12 Projekte ohne vollständige Kostenerfassung. Geschätzte Zeit bis Aktivierung: 3 Monate bei aktueller Dateneingabe-Rate."

### Success Criteria: Phase 3

1. ✅ Lead scoring accuracy: ≥75% (predicted wins actually close)
2. ✅ Risk assessment: Identifies 80%+ of budget overruns 2+ weeks in advance
3. ✅ Cashflow forecast: Within ±15% of actual for 30-day predictions
4. ✅ Route optimization: Accepted by ADM users ≥70% of the time
5. ✅ Anomaly detection: <10% false positive rate
6. ✅ Zero user reports of "nonsensical" or "obviously wrong" predictions
7. ✅ Users can explain why AI made a recommendation (transparency test)

---

## Data Quality Gates: Transition Criteria

### Phase 1 → Phase 2 Transition

**Timing:** After 6 months of operation OR when criteria met (whichever first).

**Criteria:**

| Metric | Requirement | Current | Status |
|--------|-------------|---------|--------|
| Operational time | 3+ months | TBD | ⏳ |
| Completed projects | 30+ | TBD | ⏳ |
| Customer records | 50+ | TBD | ⏳ |
| Material price data | 100+ entries | TBD | ⏳ |
| Field completion rate | ≥70% (critical fields) | TBD | ⏳ |

**Validation:**
- Automated monthly data quality report
- Manual review by Product Owner
- User feedback survey: "Are you ready for smart suggestions?"

**Decision:** If criteria NOT met at 6 months, Phase 2 features remain disabled. No exceptions.

### Phase 2 → Phase 3 Transition

**Timing:** After 12 months of operation OR when criteria met (whichever first).

**Criteria:**

| Metric | Requirement | Current | Status |
|--------|-------------|---------|--------|
| Operational time | 12+ months | TBD | ⏳ |
| Completed opportunities | 100+ (50+ won, 50+ lost) | TBD | ⏳ |
| Completed projects | 50+ with full cost tracking | TBD | ⏳ |
| Material price history | 12+ months | TBD | ⏳ |
| Expense tracking data | 200+ entries | TBD | ⏳ |
| GPS tracking data | 3+ months | TBD | ⏳ |
| Field completion rate | ≥90% (all fields) | TBD | ⏳ |
| Data accuracy audit | ≤5% error rate | TBD | ⏳ |

**Validation:**
- Comprehensive data quality audit (automated + manual)
- ML model training & backtesting on historical data
- Prediction accuracy validation on held-out test set
- User acceptance testing with sample predictions
- GF approval required

**Decision:** Phase 3 features unlock **ONLY** when ALL criteria met. Predictions below confidence thresholds remain hidden even if feature is enabled.

---

## Implementation Guidelines

### Feature Toggle Architecture

**Every AI feature MUST be individually controllable:**

```typescript
interface AIFeatureFlags {
  // Phase 1
  ragSearch: boolean;              // Default: true (Phase 1)
  audioTranscription: boolean;     // Default: true (Phase 1)
  
  // Phase 2
  templateRecommendations: boolean; // Default: false (until Phase 2 gates)
  duplicateDetection: boolean;      // Default: false
  materialPriceTrends: boolean;     // Default: false
  similarProjectFinder: boolean;    // Default: false
  
  // Phase 3
  leadScoring: boolean;             // Default: false (until Phase 3 gates)
  projectRiskAssessment: boolean;   // Default: false
  cashflowForecasting: boolean;     // Default: false
  routeOptimization: boolean;       // Default: false
  anomalyDetection: boolean;        // Default: false
}
```

**User-Level Toggle:**
- Any user can disable AI features for themselves (stored in user preferences)
- GF can disable features globally (overrides user preferences)

### Confidence Display Standards

**All Phase 3 predictions MUST show:**

1. **Confidence score** (percentage or visual indicator)
2. **Explanation** (why this prediction was made)
3. **Source data** (how many similar examples)
4. **Action recommendation** (what user should do)
5. **Escape hatch** ("Disagree? Tell us why" feedback link)

**Example UI:**

```
🎯 Opportunity REWE München: 85% Abschlusswahrscheinlichkeit

Warum? Basiert auf 12 ähnlichen Projekten:
  - Gleiche Kunden-Größe (€1-5M Jahresumsatz)
  - Gleiche Region (Bayern)
  - Ähnlicher Projektumfang (Ladeneinrichtung)

Diese 12 Projekte hatten 82% Erfolgsrate.

Empfehlung: Nachfassen in 3 Tagen optimal (basierend auf Verkaufszyklus-Analyse).

[Nicht hilfreich?] [Warum ist die Prognose falsch?]
```

### Graceful Degradation

**If AI service fails:**

1. **Never block core functionality** - User can proceed without AI
2. **Show clear status** - "KI-Features vorübergehend nicht verfügbar"
3. **Fallback to manual** - Allow user to enter their own estimate/rating
4. **Log and alert** - Notify ops team, but don't spam user

### Error Budget

**AI features have stricter SLAs than core features:**

| Feature Category | Availability | Error Rate | Latency P95 |
|-----------------|--------------|------------|-------------|
| Core (Phase 1 non-AI) | 99.9% | <0.1% | <500ms |
| Phase 1 AI (Search/STT) | 99.5% | <1% | <1s |
| Phase 2 AI (Suggestions) | 99% | <5% | <2s |
| Phase 3 AI (Predictions) | 98% | <10% | <3s |

**Rationale:** Users tolerate AI flakiness better than core feature failures.

---

## Training & Documentation

### User Education per Phase

**Phase 1:**
- Onboarding: "Search past projects and customers with natural language"
- Tutorial: "Use voice notes while driving - hands-free documentation"
- Emphasis: AI is optional helper, not required

**Phase 2:**
- Announcement: "New: Smart suggestions based on your historical data"
- Training video: "How we recommend templates using pattern matching"
- FAQ: "Why did you suggest this?" explanations

**Phase 3:**
- Workshop: "Understanding AI predictions and confidence scores"
- Guide: "When to trust vs. override AI recommendations"
- Feedback loop: "Help us improve predictions"

### Internal Training

**For all team members handling data:**

- Data quality impacts AI accuracy (garbage in = garbage out)
- Complete all critical fields (especially project outcomes)
- Accurate data entry is investment in future intelligence
- Monthly data quality report shared with team

---

## Risk Mitigation

### Avoiding the "AI Magic" Fallacy

**Pre-Mortem Concern:** "AI features will fail because historical data doesn't exist or is poor quality."

**Mitigation:**

1. ✅ **Phase-locked features** - No predictions without data
2. ✅ **Data quality gates** - Automated validation before enabling
3. ✅ **Confidence thresholds** - Hide low-confidence predictions
4. ✅ **Transparent failures** - Clearly state when AI can't help
5. ✅ **User expectations** - Communicate data requirements upfront

### Avoiding the "Black Box" Problem

**Pre-Mortem Concern:** "Users won't trust unexplainable AI recommendations."

**Mitigation:**

1. ✅ **Explainability required** - Every prediction has explanation
2. ✅ **Source attribution** - Show which data informed prediction
3. ✅ **Confidence display** - Make uncertainty visible
4. ✅ **User feedback** - "Was this helpful?" on all AI outputs
5. ✅ **Override capability** - User always has final say

### Avoiding "Feature Creep"

**Pre-Mortem Concern:** "AI feature expansion will distract from core functionality."

**Mitigation:**

1. ✅ **Strict phase discipline** - No Phase 3 work until Phase 1 perfect
2. ✅ **User value priority** - Core workflows > AI features always
3. ✅ **Resource allocation** - 80% core, 20% AI (maximum)
4. ✅ **Success criteria** - Must prove Phase N value before Phase N+1
5. ✅ **Kill switch** - Any feature with <50% usage gets removed

---

## Success Metrics

### Phase 1 Success (Foundation)

- [ ] 100+ active users
- [ ] 95%+ offline sync success rate
- [ ] <3s average dashboard load time
- [ ] 80%+ users complete workflows without support
- [ ] ≥4/5 average user satisfaction score
- [ ] RAG search used weekly by 70%+ of users
- [ ] Audio transcription used daily by 50%+ of ADM users

### Phase 2 Success (Simple Intelligence)

- [ ] 200+ active users
- [ ] Template recommendations accepted 60%+ of time
- [ ] Duplicate detection prevents 80%+ of duplicates
- [ ] Similar project finder used 5+ times/week
- [ ] <5% of users disable AI features
- [ ] ≥4/5 average rating on AI suggestions

### Phase 3 Success (Predictive Analytics)

- [ ] Lead scoring accuracy ≥75%
- [ ] Risk assessment catches 80%+ of overruns early
- [ ] Cashflow forecast accuracy ±15%
- [ ] Route optimization adopted by 70%+ of ADM users
- [ ] Anomaly detection false positive rate <10%
- [ ] AI predictions influence decisions 60%+ of time
- [ ] Zero "AI nonsense" complaints

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Product Team | Initial version addressing pre-mortem findings |

---

## Related Documents

- [AI Data Requirements](../specifications/AI_DATA_REQUIREMENTS.md) - Detailed data thresholds
- [Pre-Mortem Analysis](../../docs/reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification
- [Revised Implementation Roadmap](../implementation/REVISED_IMPLEMENTATION_ROADMAP.md) - Sprint planning
- [User Adoption Strategy](USER_ADOPTION_STRATEGY.md) - Addressing user concerns

