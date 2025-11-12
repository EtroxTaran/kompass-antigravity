# KOMPASS AI Data Requirements

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active  
**Owner:** Engineering & Data Science Team  

---

## Purpose

This document specifies the **exact data requirements** for each AI/ML feature in KOMPASS. These thresholds act as quality gates - features remain **disabled** until data requirements are met.

**Related:** [AI Strategy & Phasing](../product-vision/AI_STRATEGY_AND_PHASING.md)

---

## Data Quality Metrics

### Field Completion Rate

```sql
-- Calculate field completion rate for critical fields
SELECT 
  entity_type,
  field_name,
  COUNT(*) as total_records,
  SUM(CASE WHEN field_value IS NOT NULL AND field_value != '' THEN 1 ELSE 0 END) as complete_records,
  (SUM(CASE WHEN field_value IS NOT NULL AND field_value != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as completion_rate
FROM entity_fields
WHERE field_name IN ('companyName', 'status', 'estimatedValue', 'probability', 'closedAt', 'outcome')
GROUP BY entity_type, field_name
ORDER BY completion_rate ASC;
```

**Threshold:**
- Phase 2: ≥70% completion on critical fields
- Phase 3: ≥90% completion on all fields

### Data Accuracy Audit

**Method:** Random sample validation (10% of records).

**Process:**
1. Select random 10% sample from each entity type
2. Manual review by domain expert (GF or PLAN persona)
3. Flag errors: contradictions, impossibilities, obvious mistakes
4. Calculate error rate: (errors / sample size) * 100

**Threshold:**
- Phase 2: ≤10% error rate acceptable
- Phase 3: ≤5% error rate required

**Common Errors to Check:**
- Projects completed before they started
- Opportunity value exceeds customer annual revenue by 10x
- Invoice dates in future
- Negative margins on profitable projects
- Contact person at multiple companies simultaneously

---

## Phase 1 Features: Data Requirements

### 1. RAG-Based Search

**Purpose:** Semantic search across projects, materials, notes, documents.

**Minimum Data:**
- No minimum - works with any amount of data
- Quality improves with more content

**Optimal Data:**
- 10+ completed projects with notes
- 50+ customer records with complete profiles
- 100+ protocol entries
- 20+ project documents uploaded

**Data Quality:**
- Text content must be readable (no corrupted encoding)
- Documents must be extractable (PDFs not scanned images)

**Validation Query:**
```sql
-- Check searchable content volume
SELECT 
  'customers' as entity_type,
  COUNT(*) as total_records,
  SUM(LENGTH(companyName) + LENGTH(notes)) as total_chars
FROM customers
UNION ALL
SELECT 
  'projects',
  COUNT(*),
  SUM(LENGTH(projectName) + LENGTH(description) + LENGTH(notes))
FROM projects
UNION ALL
SELECT
  'protocols',
  COUNT(*),
  SUM(LENGTH(description) + LENGTH(actionItems))
FROM protocols;

-- Minimum: 10,000 total characters recommended for useful search
```

**Feature Gate Logic:**
```typescript
function canEnableRAGSearch(): boolean {
  const totalSearchableChars = calculateTotalSearchableContent();
  // No hard minimum, but warn if very low
  if (totalSearchableChars < 10000) {
    console.warn('RAG search will have limited results with low content volume');
  }
  return true; // Always enabled
}
```

### 2. Audio Transcription (German STT)

**Purpose:** Convert voice notes to text for mobile users.

**Data Requirements:** None - this is a standalone feature.

**Technical Requirements:**
- Whisper model (German) or equivalent
- Minimum 8s audio clip length
- Audio quality: >8kHz sample rate

**Feature Gate Logic:**
```typescript
function canEnableAudioTranscription(): boolean {
  return true; // Always enabled
}
```

---

## Phase 2 Features: Data Requirements

### 1. Smart Template Recommendations

**Purpose:** Suggest calculation templates based on customer type and project details.

**Minimum Data:**
- **50+ completed offers** with templates assigned
- **30+ distinct customers** across at least 3 customer types
- **Complete fields:** customer.businessType, opportunity.projectCategory, offer.template

**Optimal Data:**
- 100+ offers
- 5+ customer types represented
- 10+ offers per template

**Data Quality:**
- Customer business type filled: ≥80%
- Project category filled: ≥90%
- Template assignment filled: 100%

**Validation Query:**
```sql
-- Check template recommendation readiness
SELECT 
  customer_business_type,
  project_category,
  template_used,
  COUNT(*) as usage_count
FROM offers o
JOIN opportunities opp ON o.opportunity_id = opp.id
JOIN customers c ON opp.customer_id = c.id
WHERE o.status = 'Accepted'
  AND c.business_type IS NOT NULL
  AND opp.project_category IS NOT NULL
  AND o.template_used IS NOT NULL
GROUP BY customer_business_type, project_category, template_used
HAVING COUNT(*) >= 5
ORDER BY usage_count DESC;

-- Must have at least 10 distinct combinations with 5+ examples each
```

**Feature Gate Logic:**
```typescript
function canEnableTemplateRecommendations(): boolean {
  const completedOffers = countOffersWithCompleteData();
  const distinctCustomerTypes = countDistinctCustomerTypes();
  const templateCombinations = countTemplateCombinations();
  
  return (
    completedOffers >= 50 &&
    distinctCustomerTypes >= 3 &&
    templateCombinations >= 10
  );
}
```

### 2. Duplicate Detection

**Purpose:** Warn when creating similar customers/contacts.

**Minimum Data:**
- **30+ customer records** (duplicate detection is more useful with more data)
- **Complete fields:** companyName (100%), address (≥70%)

**Optimal Data:**
- 100+ customers
- VAT numbers filled: ≥60%
- Complete addresses: ≥80%

**Validation Query:**
```sql
-- Check duplicate detection readiness
SELECT 
  COUNT(*) as total_customers,
  SUM(CASE WHEN company_name IS NOT NULL AND LENGTH(company_name) >= 2 THEN 1 ELSE 0 END) as name_complete,
  SUM(CASE WHEN vat_number IS NOT NULL THEN 1 ELSE 0 END) as vat_complete,
  SUM(CASE WHEN address_street IS NOT NULL AND address_zipcode IS NOT NULL THEN 1 ELSE 0 END) as address_complete
FROM customers;

-- Requires: total_customers >= 30, name_complete = 100%
```

**Feature Gate Logic:**
```typescript
function canEnableDuplicateDetection(): boolean {
  const totalCustomers = countCustomers();
  const nameCompletionRate = calculateFieldCompletion('customers', 'companyName');
  
  return (
    totalCustomers >= 30 &&
    nameCompletionRate >= 0.99  // 99%+ names filled
  );
}
```

### 3. Material Price Trend Indicators

**Purpose:** Show price movement indicators (↑↓→) on materials.

**Minimum Data:**
- **3 months** of material price history
- **100+ price data points** (across all materials)
- **20+ distinct materials** tracked

**Optimal Data:**
- 6+ months history
- 500+ price points
- 50+ materials

**Data Quality:**
- Price update frequency: weekly minimum
- No gaps >30 days for actively used materials

**Validation Query:**
```sql
-- Check price trend readiness
WITH price_history AS (
  SELECT 
    material_id,
    COUNT(*) as price_points,
    MIN(recorded_date) as first_price,
    MAX(recorded_date) as last_price,
    DATEDIFF(MAX(recorded_date), MIN(recorded_date)) as days_tracked
  FROM material_prices
  GROUP BY material_id
)
SELECT 
  COUNT(*) as materials_tracked,
  SUM(price_points) as total_price_points,
  AVG(days_tracked) as avg_days_tracked,
  MIN(days_tracked) as min_days_tracked
FROM price_history;

-- Requires: materials_tracked >= 20, total_price_points >= 100, min_days_tracked >= 90
```

**Feature Gate Logic:**
```typescript
function canEnablePriceTrends(): boolean {
  const oldestPriceDate = getOldestMaterialPriceDate();
  const daysSinceOldest = daysBetween(oldestPriceDate, today());
  const totalPricePoints = countMaterialPricePoints();
  const distinctMaterials = countMaterialsWithPriceHistory();
  
  return (
    daysSinceOldest >= 90 &&  // 3 months
    totalPricePoints >= 100 &&
    distinctMaterials >= 20
  );
}
```

### 4. Similar Project Finder

**Purpose:** Find past projects similar to current opportunity.

**Minimum Data:**
- **30+ completed projects**
- **Complete fields:** customer type (80%), project category (90%), value range (90%), location (70%)

**Optimal Data:**
- 100+ completed projects
- Rich project descriptions (avg >200 chars)
- Complete project outcomes (margin, timeline, satisfaction)

**Validation Query:**
```sql
-- Check similar project finder readiness
SELECT 
  COUNT(*) as completed_projects,
  SUM(CASE WHEN customer_business_type IS NOT NULL THEN 1 ELSE 0 END) as has_customer_type,
  SUM(CASE WHEN project_category IS NOT NULL THEN 1 ELSE 0 END) as has_category,
  SUM(CASE WHEN contract_value IS NOT NULL THEN 1 ELSE 0 END) as has_value,
  SUM(CASE WHEN location_city IS NOT NULL THEN 1 ELSE 0 END) as has_location,
  AVG(LENGTH(description)) as avg_description_length
FROM projects
WHERE status = 'Completed';

-- Requires: completed_projects >= 30, has_category/has_value >= 27 (90%)
```

**Feature Gate Logic:**
```typescript
function canEnableSimilarProjectFinder(): boolean {
  const completedProjects = countProjectsByStatus('Completed');
  const categoryCompletion = calculateFieldCompletion('projects', 'projectCategory');
  const valueCompletion = calculateFieldCompletion('projects', 'contractValue');
  
  return (
    completedProjects >= 30 &&
    categoryCompletion >= 0.90 &&
    valueCompletion >= 0.90
  );
}
```

---

## Phase 3 Features: Data Requirements

### 1. Lead Scoring & Win Probability

**Purpose:** Predict opportunity close probability.

**Minimum Data:**
- **100+ completed opportunities** (50 won + 50 lost minimum)
- **Balanced dataset:** 30-70% win rate (avoid extreme imbalance)
- **Complete fields:** value, probability (user estimate), sales cycle length, customer type, proposal details, outcome

**Optimal Data:**
- 200+ opportunities (100 won + 100 lost)
- 40-60% win rate
- 10+ features per opportunity (interactions, proposal count, customer history, etc.)

**Data Quality:**
- Outcome labels (won/lost): 100% required
- Lost reason filled: ≥80%
- Sales cycle dates accurate: ≥90%

**Validation Query:**
```sql
-- Check lead scoring readiness
WITH opportunity_stats AS (
  SELECT 
    COUNT(*) as total_opportunities,
    SUM(CASE WHEN outcome = 'Won' THEN 1 ELSE 0 END) as won_count,
    SUM(CASE WHEN outcome = 'Lost' THEN 1 ELSE 0 END) as lost_count,
    SUM(CASE WHEN 
      estimated_value IS NOT NULL AND
      probability IS NOT NULL AND
      customer_id IS NOT NULL AND
      created_at IS NOT NULL AND
      closed_at IS NOT NULL
    THEN 1 ELSE 0 END) as complete_records
  FROM opportunities
  WHERE status IN ('Won', 'Lost')
)
SELECT 
  total_opportunities,
  won_count,
  lost_count,
  (won_count * 100.0 / total_opportunities) as win_rate,
  (complete_records * 100.0 / total_opportunities) as completion_rate
FROM opportunity_stats;

-- Requires: total_opportunities >= 100, won_count >= 50, lost_count >= 50,
--           win_rate BETWEEN 30 AND 70, completion_rate >= 90
```

**Feature Gate Logic:**
```typescript
function canEnableLeadScoring(): boolean {
  const closedOpps = countOpportunitiesByOutcome();
  const winRate = closedOpps.won / closedOpps.total;
  const completionRate = calculateFieldCompletion('opportunities', CRITICAL_FIELDS);
  
  return (
    closedOpps.total >= 100 &&
    closedOpps.won >= 50 &&
    closedOpps.lost >= 50 &&
    winRate >= 0.30 && winRate <= 0.70 &&  // Balanced
    completionRate >= 0.90
  );
}
```

**ML Model Validation:**
```python
# Backtesting on historical data
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score

# Split data: 70% train, 30% test
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.3)

# Train model
model.fit(X_train, y_train)

# Evaluate
y_pred_proba = model.predict_proba(X_test)[:, 1]
roc_auc = roc_auc_score(y_test, y_pred_proba)
accuracy = accuracy_score(y_test, y_pred > 0.5)

# Requirements for production deployment:
assert roc_auc >= 0.70, f"ROC-AUC too low: {roc_auc}"  # Minimum: 0.70
assert accuracy >= 0.65, f"Accuracy too low: {accuracy}"  # Minimum: 65%
```

### 2. Project Risk Assessment

**Purpose:** Predict budget/timeline overruns before they occur.

**Minimum Data:**
- **50+ completed projects** with full cost tracking
- **20+ projects** with budget overruns or delays (for failure pattern learning)
- **Complete fields:** budget, actual costs (weekly snapshots), planned dates, actual dates, final margin

**Optimal Data:**
- 100+ completed projects
- 40+ projects with issues
- Weekly project status snapshots throughout lifecycle

**Data Quality:**
- Cost tracking completeness: ≥95%
- Timeline data accuracy: ≥90%
- Weekly snapshots: ≥80% of project weeks

**Validation Query:**
```sql
-- Check risk assessment readiness
WITH project_stats AS (
  SELECT 
    COUNT(*) as completed_projects,
    SUM(CASE WHEN actual_cost > budget * 1.1 THEN 1 ELSE 0 END) as budget_overruns,
    SUM(CASE WHEN actual_end_date > planned_end_date + INTERVAL 7 DAY THEN 1 ELSE 0 END) as delayed_projects,
    SUM(CASE WHEN 
      budget IS NOT NULL AND
      actual_cost IS NOT NULL AND
      planned_start_date IS NOT NULL AND
      planned_end_date IS NOT NULL AND
      actual_end_date IS NOT NULL
    THEN 1 ELSE 0 END) as complete_records
  FROM projects
  WHERE status = 'Completed'
)
SELECT 
  completed_projects,
  budget_overruns,
  delayed_projects,
  (budget_overruns + delayed_projects) as total_issues,
  (complete_records * 100.0 / completed_projects) as completion_rate
FROM project_stats;

-- Requires: completed_projects >= 50, total_issues >= 20, completion_rate >= 95
```

**Feature Gate Logic:**
```typescript
function canEnableRiskAssessment(): boolean {
  const completedProjects = countProjectsByStatus('Completed');
  const projectsWithIssues = countProjectsWithBudgetOrTimelineIssues();
  const costTrackingCompletion = calculateCostTrackingCompleteness();
  
  return (
    completedProjects >= 50 &&
    projectsWithIssues >= 20 &&
    costTrackingCompletion >= 0.95
  );
}
```

**ML Model Validation:**
```python
# Early warning validation: Can we predict 2+ weeks in advance?
predictions = []
actuals = []

for project in test_projects:
    # Use data from 2 weeks before project end
    snapshot = get_project_snapshot(project, weeks_before_end=2)
    prediction = model.predict(snapshot)
    actual = project.had_budget_overrun or project.was_delayed
    
    predictions.append(prediction)
    actuals.append(actual)

recall = recall_score(actuals, predictions)  # Did we catch the problems?
precision = precision_score(actuals, predictions)  # Were our warnings accurate?

# Requirements:
assert recall >= 0.80, f"Recall too low: {recall}"  # Catch 80%+ of issues
assert precision >= 0.60, f"Precision too low: {precision}"  # 60%+ warnings correct
```

### 3. Cashflow Forecasting

**Purpose:** Predict 30/60/90-day cashflow.

**Minimum Data:**
- **12+ months** of invoice and payment data
- **100+ invoices** (paid)
- **Seasonal coverage:** Data spans at least 1 full business cycle (all quarters)

**Optimal Data:**
- 24+ months (2 full years)
- 300+ invoices
- Complete payment terms data (≥90%)

**Data Quality:**
- Invoice dates accurate: ≥98%
- Payment dates recorded: ≥95%
- Outstanding receivables tracked: 100%

**Validation Query:**
```sql
-- Check cashflow forecasting readiness
WITH payment_history AS (
  SELECT 
    MIN(invoice_date) as first_invoice,
    MAX(invoice_date) as last_invoice,
    COUNT(*) as total_invoices,
    SUM(CASE WHEN payment_date IS NOT NULL THEN 1 ELSE 0 END) as paid_invoices,
    SUM(CASE WHEN payment_terms IS NOT NULL THEN 1 ELSE 0 END) as has_terms
  FROM invoices
)
SELECT 
  DATEDIFF(last_invoice, first_invoice) as days_of_history,
  total_invoices,
  paid_invoices,
  (paid_invoices * 100.0 / total_invoices) as payment_tracking_rate,
  (has_terms * 100.0 / total_invoices) as terms_completion_rate,
  -- Check quarterly coverage
  (SELECT COUNT(DISTINCT QUARTER(invoice_date)) FROM invoices) as quarters_covered
FROM payment_history;

-- Requires: days_of_history >= 365, total_invoices >= 100, 
--           payment_tracking_rate >= 95, quarters_covered = 4
```

**Feature Gate Logic:**
```typescript
function canEnableCashflowForecasting(): boolean {
  const oldestInvoice = getOldestInvoiceDate();
  const monthsOfHistory = monthsBetween(oldestInvoice, today());
  const totalInvoices = countInvoices();
  const paymentTrackingRate = calculatePaymentTrackingCompleteness();
  const quartersCovered = countQuartersCovered();
  
  return (
    monthsOfHistory >= 12 &&
    totalInvoices >= 100 &&
    paymentTrackingRate >= 0.95 &&
    quartersCovered === 4  // All quarters represented
  );
}
```

**ML Model Validation:**
```python
# Time series forecasting validation
from sklearn.metrics import mean_absolute_percentage_error

predictions_30d = []
actuals_30d = []

# Use last 3 months as test set
for month in test_months:
    # Train on data up to this month
    train_data = get_data_until(month)
    model.fit(train_data)
    
    # Predict 30 days forward
    prediction = model.forecast(horizon=30)
    actual = get_actual_cashflow(month, days=30)
    
    predictions_30d.append(prediction)
    actuals_30d.append(actual)

mape = mean_absolute_percentage_error(actuals_30d, predictions_30d)

# Requirements:
assert mape <= 0.15, f"MAPE too high: {mape}"  # Within ±15%
```

### 4. Route Optimization

**Purpose:** Optimize sales routes for time/fuel savings.

**Minimum Data:**
- **3+ months** of GPS tracking data
- **50+ completed tours** (routes with 3+ stops)
- **Historical visit durations** for 30+ customers

**Optimal Data:**
- 6+ months GPS history
- 150+ tours
- Visit duration data for 100+ customers
- Traffic pattern integration

**Data Quality:**
- GPS accuracy: ≥95% (within 100m)
- Visit timestamps: ≥90% accuracy
- Complete tour logs: ≥80%

**Validation Query:**
```sql
-- Check route optimization readiness
WITH tour_stats AS (
  SELECT 
    COUNT(DISTINCT tour_id) as total_tours,
    COUNT(DISTINCT customer_id) as customers_visited,
    SUM(CASE WHEN gps_accuracy <= 100 THEN 1 ELSE 0 END) as accurate_gps,
    SUM(CASE WHEN check_in_time IS NOT NULL AND check_out_time IS NOT NULL THEN 1 ELSE 0 END) as complete_visits,
    MIN(tour_date) as first_tour,
    MAX(tour_date) as last_tour
  FROM tour_visits
)
SELECT 
  total_tours,
  customers_visited,
  (accurate_gps * 100.0 / (SELECT COUNT(*) FROM tour_visits)) as gps_accuracy_rate,
  (complete_visits * 100.0 / (SELECT COUNT(*) FROM tour_visits)) as visit_completeness,
  DATEDIFF(last_tour, first_tour) as days_of_tracking
FROM tour_stats;

-- Requires: total_tours >= 50, customers_visited >= 30, 
--           gps_accuracy_rate >= 95, days_of_tracking >= 90
```

**Feature Gate Logic:**
```typescript
function canEnableRouteOptimization(): boolean {
  const oldestTour = getOldestTourDate();
  const monthsOfTracking = monthsBetween(oldestTour, today());
  const completedTours = countToursWithMultipleStops();
  const customersWithDuration = countCustomersWithVisitDurationHistory();
  const gpsAccuracy = calculateGPSAccuracyRate();
  
  return (
    monthsOfTracking >= 3 &&
    completedTours >= 50 &&
    customersWithDuration >= 30 &&
    gpsAccuracy >= 0.95
  );
}
```

### 5. Anomaly Detection

**Purpose:** Flag unusual spending, time tracking, or margin patterns.

**Minimum Data:**
- **6+ months** of expense/time tracking data
- **200+ expense records** across categories
- **100+ timesheet entries** across projects
- **Sufficient volume per category** (20+ examples minimum)

**Optimal Data:**
- 12+ months history
- 500+ expenses
- 300+ timesheet entries
- 50+ examples per category

**Data Quality:**
- Categorization accuracy: ≥90%
- Project allocation filled: ≥95%
- Amount/duration accuracy: ≥98%

**Validation Query:**
```sql
-- Check anomaly detection readiness
WITH expense_stats AS (
  SELECT 
    category,
    COUNT(*) as expense_count,
    MIN(recorded_date) as first_expense,
    MAX(recorded_date) as last_expense
  FROM expenses
  GROUP BY category
),
time_stats AS (
  SELECT 
    COUNT(*) as timesheet_entries,
    MIN(date) as first_entry,
    MAX(date) as last_entry
  FROM timesheets
)
SELECT 
  (SELECT COUNT(*) FROM expenses) as total_expenses,
  (SELECT SUM(expense_count) FROM expense_stats WHERE expense_count >= 20) as well_represented_categories,
  (SELECT COUNT(*) FROM expense_stats) as total_categories,
  t.timesheet_entries,
  DATEDIFF((SELECT MAX(last_expense) FROM expense_stats), 
           (SELECT MIN(first_expense) FROM expense_stats)) as expense_history_days,
  DATEDIFF(t.last_entry, t.first_entry) as time_history_days
FROM time_stats t;

-- Requires: total_expenses >= 200, well_represented_categories >= 5,
--           timesheet_entries >= 100, expense_history_days >= 180
```

**Feature Gate Logic:**
```typescript
function canEnableAnomalyDetection(): boolean {
  const monthsOfExpenseData = calculateExpenseHistoryMonths();
  const totalExpenses = countExpenseRecords();
  const timesheetEntries = countTimesheetEntries();
  const categoriesWithSufficientData = countCategoriesWithMinExamples(20);
  
  return (
    monthsOfExpenseData >= 6 &&
    totalExpenses >= 200 &&
    timesheetEntries >= 100 &&
    categoriesWithSufficientData >= 5
  );
}
```

**ML Model Validation:**
```python
# Anomaly detection validation: False positive rate
from sklearn.ensemble import IsolationForest

model = IsolationForest(contamination=0.05)  # Expect 5% anomalies
model.fit(historical_data)

anomalies = model.predict(test_data)
anomaly_indices = np.where(anomalies == -1)[0]

# Manual review of flagged anomalies
true_anomalies = manual_review(test_data[anomaly_indices])
false_positives = len(anomaly_indices) - true_anomalies

false_positive_rate = false_positives / len(anomaly_indices)

# Requirements:
assert false_positive_rate <= 0.10, f"FPR too high: {false_positive_rate}"  # Max 10% FP
```

---

## Data Quality Dashboard

### Automated Monitoring

**Daily Check:** Run all validation queries and report status.

**Dashboard UI:**

```
╔══════════════════════════════════════════════════════════╗
║          KOMPASS AI Feature Readiness Status            ║
╠══════════════════════════════════════════════════════════╣
║ Phase 1 Features:                                        ║
║   ✅ RAG Search                        [Always Active]   ║
║   ✅ Audio Transcription               [Always Active]   ║
║                                                           ║
║ Phase 2 Features:                                        ║
║   ✅ Template Recommendations          [Ready: 67/50]    ║
║   ✅ Duplicate Detection               [Ready: 142/30]   ║
║   ⏳ Material Price Trends             [45/100 points]   ║
║   ⏳ Similar Project Finder            [23/30 projects]  ║
║                                                           ║
║ Phase 3 Features:                                        ║
║   ❌ Lead Scoring                      [72/100 opps]     ║
║   ❌ Risk Assessment                   [31/50 projects]  ║
║   ❌ Cashflow Forecasting              [8/12 months]     ║
║   ❌ Route Optimization                [15/50 tours]     ║
║   ❌ Anomaly Detection                 [3/6 months]      ║
╚══════════════════════════════════════════════════════════╝

Data Quality Summary:
  Field Completion Rate: 78% (Target: 90% for Phase 3)
  Data Accuracy (last audit): 94% (Target: 95%)
  Last Quality Audit: 2025-11-01 (30 days ago)

Next Action: Continue data collection for 4 more months.
Estimated Phase 3 Readiness: 2026-03-15
```

### Manual Review Triggers

**Monthly Review:** Product Owner checks data quality report.

**Quarterly Audit:** Deep dive into 10% sample by domain expert.

**Pre-Phase Transition:** Comprehensive audit before unlocking Phase 2 or Phase 3.

---

## Related Documents

- [AI Strategy & Phasing](../product-vision/AI_STRATEGY_AND_PHASING.md) - Strategic AI roadmap
- [Pre-Mortem Validation Checklist](../reviews/PRE_MORTEM_VALIDATION_CHECKLIST.md) - Testing strategy

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Engineering Team | Initial version with all feature thresholds |

