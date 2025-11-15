# Financial Data Flow Documentation

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Active  
**Owner:** Product & Engineering Team  
**Related:** Lexware Integration Strategy

---

## Purpose

This document maps the **complete financial data flow** through KOMPASS and Lexware, documenting every step from opportunity to payment. This ensures all stakeholders understand where financial data lives, how it flows, and where integration points exist.

**Related:** [Lexware Integration Strategy](LEXWARE_INTEGRATION_STRATEGY.md)

---

## Financial Data Flow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     REVENUE FLOW                                 │
└──────────────────────────────────────────────────────────────────┘

1. Opportunity        (KOMPASS)  ADM creates, KALK estimates
      ↓
2. Offer             (KOMPASS)  KALK creates pricing, GF approves
      ↓
3. Contract          (KOMPASS)  Customer accepts, contract signed
      ↓                         [CSV Export to Lexware - Phase 1/2]
4. Project Execution (KOMPASS)  PLAN executes, costs tracked real-time
      ↓
5. Invoice           (Lexware)  BUCH generates GoBD-compliant invoice
      ↓                         [Invoice reference synced to KOMPASS]
6. Payment           (Lexware)  Customer pays, BUCH records
      ↓                         [Payment status synced to KOMPASS]
7. Accounting        (Lexware)  Financial statements, tax reports

┌──────────────────────────────────────────────────────────────────┐
│                     EXPENSE FLOW                                 │
└──────────────────────────────────────────────────────────────────┘

1. Expense Capture   (KOMPASS)  ADM/Team captures receipts, mileage
      ↓
2. Categorization    (KOMPASS)  Allocate to project, category
      ↓
3. Approval          (KOMPASS)  BUCH approves expenses
      ↓                         [CSV Export to Lexware - Phase 1/2]
4. Booking           (Lexware)  BUCH books as business expenses
      ↓
5. Reimbursement     (Lexware)  BUCH processes employee reimbursement
      ↓
6. Accounting        (Lexware)  Expense reports, tax deductions
```

---

## Detailed Flow 1: Revenue Flow

### Step 1: Opportunity Creation (KOMPASS)

**Actor:** ADM (Sales Field Agent)

**Data Created:**

```typescript
Opportunity {
  customer: "Hofladen Müller GmbH"
  title: "Ladeneinrichtung REWE München"
  estimatedValue: € 125.000
  probability: 75%
  status: 'New'
  expectedCloseDate: "2025-01-15"
}
```

**Financial Impact:** None yet (pipeline value only)

**Next Step:** ADM qualifies opportunity → KALK prepares estimate

---

### Step 2: Offer Creation (KOMPASS)

**Actor:** KALK (Cost Estimator)

**Data Created:**

```typescript
Offer {
  opportunityId: "opp-123"
  offerNumber: "A-2025-00089"

  // Line items
  lineItems: [
    { description: "Ladenregale Eiche", quantity: 8, unitPrice: 850, total: 6800 },
    { description: "LED-Beleuchtung", quantity: 24, unitPrice: 145, total: 3480 },
    // ... more items
  ],

  // Costs
  materialCosts: € 85.000,
  laborCosts: € 30.000,
  supplierCosts: € 8.000,
  subtotal: € 123.000,
  taxAmount: € 23.370 (19%),
  totalPrice: € 146.370,

  // Terms
  paymentTerms: "30 Tage netto",
  validUntil: "2025-02-15"
}
```

**Financial Impact:** None yet (offer/proposal only)

**Approval:** GF approves if >€200k or margin <10%

**Next Step:** Customer accepts offer → Contract created

---

### Step 3: Contract Creation (KOMPASS)

**Actor:** BUCH (Accountant) or GF (CEO)

**Data Created:**

```typescript
Contract {
  offerId: "offer-123"
  contractNumber: "V-2025-00123"
  customer: "Hofladen Müller GmbH"
  projectNumber: "P-2025-M003"  // Project created simultaneously

  contractValue: € 146.370,  // Gross (from offer)
  startDate: "2025-02-01",
  endDate: "2025-02-28",

  paymentSchedule: [
    { description: "50% Anzahlung", percentage: 50, amount: € 73.185, dueCondition: "Bei Auftragserteilung" },
    { description: "50% Restzahlung", percentage: 50, amount: € 73.185, dueCondition: "Nach Abnahme" }
  ],

  status: 'Signed',
  signedDate: "2025-01-18",

  immutableHash: "sha256(contract data)",  // GoBD compliance
  finalized: true  // Cannot be modified
}
```

**Financial Impact:** Contractual obligation created, revenue forecasted

**GoBD Compliance:**

- Contract is immutable after signing
- Changes require audit trail (changeLog)
- Hash ensures tampering detection

**Integration Point 1: Contract → Lexware**

**Phase 1 (Manual CSV):**

1. BUCH exports contract to CSV (weekly)
2. BUCH imports CSV into Lexware as "Auftrag"
3. Lexware creates customer if not exists
4. Manual reconciliation: Check contract appears correctly

**Phase 2 (Semi-Automated):**

1. System exports contract to shared folder (nightly)
2. Lexware imports automatically
3. BUCH reviews error log (if any)

**Phase 3 (Real-Time):**

1. Contract signed in KOMPASS
2. Webhook fires immediately
3. KOMPASS POST /lexware/api/contracts
4. Lexware creates "Auftrag", returns ID
5. KOMPASS stores Lexware ID, logs sync timestamp

**Next Step:** Project execution, cost tracking → Invoice trigger

---

### Step 4: Project Execution & Cost Tracking (KOMPASS)

**Actor:** PLAN (Project Manager), INN (Procurement), Team (Time/Expense)

**Data Tracked in Real-Time:**

```typescript
Project {
  projectNumber: "P-2025-M003"
  contractId: "contract-123"
  contractValue: € 146.370,
  budget: € 123.000,

  // Real-time actual costs
  actualLaborCosts: € 28.500,      // From time tracking
  actualMaterialCosts: € 82.300,   // From material deliveries
  actualSupplierCosts: € 7.800,    // From supplier invoices
  actualCost: € 118.600,           // Sum of above

  currentMargin: € 27.770 (23,1%),  // contractValue - actualCost
  budgetStatus: 'OnTrack',          // actualCost < budget

  // Cost breakdown
  costTracking: [
    { date: "2025-02-01", category: 'Materials', amount: € 3.480, description: "LED-Panels geliefert" },
    { date: "2025-02-03", category: 'Labor', amount: € 1.200, description: "Montage 15h @ €80/h" },
    { date: "2025-02-05", category: 'Materials', amount: € 6.800, description: "Ladenregale geliefert" },
    // ... daily cost updates
  ]
}
```

**Financial Impact:**

- Real-time visibility into project profitability
- Early warning if budget exceeded
- Accurate margin calculation for management

**Cost Sources:**

1. **Labor Costs:** Time tracking entries
   - Team members log hours per project
   - System: hours \* hourly rate = labor cost
   - Updates project.actualLaborCosts daily

2. **Material Costs:** Purchase order deliveries
   - INN records material delivery
   - System: delivered quantity \* actual unit price = material cost
   - Updates project.actualMaterialCosts immediately

3. **Supplier Costs:** Supplier invoice payments
   - BUCH marks supplier invoice as paid
   - System: invoice amount → project.actualSupplierCosts
   - Updates immediately

**Dashboard Visibility:**

- PLAN sees real-time budget status
- BUCH sees real-time margin
- GF sees project profitability in real-time

**Next Step:** Project completion → Invoice generation trigger

---

### Step 5: Invoice Generation (Lexware)

**Actor:** BUCH (Accountant)

**Trigger:**

- Payment milestone reached (e.g., "50% Anzahlung bei Auftragserteilung")
- OR: Project phase completed (e.g., "Montage abgeschlossen")
- OR: Project fully completed (final invoice)

**Process:**

1. **Invoice Preparation (KOMPASS)**
   - BUCH reviews contract payment schedule
   - BUCH checks: Milestone condition met (work completed)
   - BUCH marks milestone: Ready for invoicing
   - BUCH notes: Invoice details in KOMPASS (amount, description)

2. **Invoice Generation (Lexware)**
   - BUCH opens Lexware
   - BUCH selects customer (Hofladen Müller)
   - BUCH selects "Auftrag" (linked contract V-2025-00123)
   - BUCH generates invoice:
     - Invoice number: R-2025-00456 (Lexware assigns)
     - Line items: From contract (can adjust)
     - Net amount: € 60.000 (50% of contract for Anzahlung)
     - Tax: € 11.400 (19%)
     - Gross: € 71.400
   - Lexware generates PDF (GoBD-compliant)
   - Lexware creates immutable invoice record

3. **Invoice Reference in KOMPASS (Manual Phase 1/2, Auto Phase 3)**
   - BUCH enters invoice reference in KOMPASS:
     - Invoice number: R-2025-00456
     - Invoice date, due date, amount
     - Link to contract
     - Lexware invoice ID (for lookup)
   - Status: 'Issued', payment status: 'Pending'

**Why in Lexware, not KOMPASS?**

- **GoBD Compliance:** Lexware is certified for immutable, auditable invoicing
- **Tax Reporting:** Lexware handles complex German tax rules (UStVA, etc.)
- **Audit Safety:** Using established, certified tool reduces compliance risk

**Integration Point 2: Invoice Reference → KOMPASS**

**Phase 1 (Manual):**

- BUCH manually enters invoice reference in KOMPASS

**Phase 2 (Semi-Auto):**

- BUCH exports invoice list from Lexware (CSV)
- KOMPASS imports, matches by contract number

**Phase 3 (Real-Time):**

- Lexware webhook fires on invoice.created
- KOMPASS receives webhook, creates invoice reference automatically
- BUCH sees invoice appear in KOMPASS within minutes

**Next Step:** Customer pays invoice → Payment recorded

---

### Step 6: Payment Processing (Lexware → KOMPASS)

**Actor:** BUCH (Accountant)

**Process:**

1. **Payment Received (Bank)**
   - Customer transfers payment to company bank account
   - Payment reference: Invoice number R-2025-00456

2. **Payment Recording (Lexware)**
   - BUCH imports bank statement into Lexware
   - Lexware matches payment to invoice (by reference or amount)
   - BUCH confirms match, marks invoice as paid
   - Lexware records:
     - Payment date: "2025-02-10"
     - Payment amount: € 71.400
     - Payment method: "Überweisung"
     - Invoice status: 'Paid'

3. **Payment Sync to KOMPASS**
   - **Phase 1 (Manual):**
     - BUCH exports payment report from Lexware (CSV)
     - BUCH imports into KOMPASS
     - KOMPASS updates invoice reference:
       - Payment status: 'Paid'
       - Payment date: "2025-02-10"
   - **Phase 2 (Semi-Auto):**
     - System imports payment CSV nightly or hourly
     - Auto-matches by invoice number
     - BUCH reviews unmatched items
   - **Phase 3 (Real-Time):**
     - Lexware webhook fires on payment.recorded
     - KOMPASS receives webhook, updates invoice immediately
     - BUCH sees status change in KOMPASS within minutes

4. **Financial Impact (KOMPASS)**
   - Contract payment milestone marked as 'Paid'
   - Project cashflow updated
   - Customer outstanding balance reduced
   - Reports reflect payment immediately (Phase 3) or next sync (Phase 1/2)

**Next Step:** Contract fully paid → Project closed financially

---

### Step 7: Financial Reporting & Tax (Lexware)

**Actor:** BUCH (Accountant), Tax Advisor

**Process:**

1. **Monthly/Quarterly Closing**
   - BUCH runs reports in Lexware:
     - Gewinn & Verlust (P&L)
     - Bilanz (Balance Sheet)
     - UStVA (VAT Return)
   - All based on Lexware data (invoices, payments, expenses)

2. **Tax Filing**
   - BUCH exports DATEV format from Lexware
   - Tax advisor files with Finanzamt
   - Based on Lexware as source of truth for invoices

**KOMPASS Role:**

- Provides context: Which invoices belong to which projects
- Provides reports: Project profitability, customer revenue
- NOT used for tax filing (Lexware is authoritative)

---

## Detailed Flow 2: Expense Flow

### Step 1: Expense Capture (KOMPASS Mobile)

**Actor:** ADM (Field Agent), PLAN (Project Team), INN (Procurement)

**Scenarios:**

**A) Mileage Tracking:**

```typescript
MileageLog {
  userId: "user-adm-123" (Michael Schmidt)
  date: "2025-02-05"
  startLocation: "Office München"
  endLocation: "Kunde: Hofladen Müller"
  distance: 67  // km (GPS tracked)
  purpose: "Kundenbesuch"
  projectId?: "project-123"  // Optional allocation
  rate: 0.30  // €/km (German standard)
  amount: 67 * 0.30 = € 20.10

  status: 'Pending'
  receiptPhoto?: null  // No receipt for mileage
}
```

**B) Expense Receipt:**

```typescript
Expense {
  userId: "user-adm-123"
  expenseDate: "2025-02-05"
  category: 'Travel'  // Reisekosten
  subcategory: 'Fuel'  // Kraftstoff
  amount: € 45.80
  taxAmount: € 7.32 (19%)
  netAmount: € 38.48

  merchantName: "Shell Tankstelle München"
  paymentMethod: 'CreditCard'

  projectId: "project-123"  // Project allocation
  customerId?: "customer-456"  // Customer context

  receiptPhoto: "receipt-20250205-123.jpg"  // Camera capture
  ocrData: { merchant, amount, date }  // [Phase 2] AI extraction

  status: 'PendingApproval'
}
```

**C) Time Tracking:**

```typescript
TimesheetEntry {
  userId: "user-plan-456" (Thomas Fischer)
  date: "2025-02-05"
  projectId: "project-123"
  hours: 8.5
  activityType: 'Installation'  // Montage
  description: "LED-Panel Installation und Verkabelung"
  billable: true
  hourlyRate: € 80
  amount: 8.5 * 80 = € 680

  approvedBy?: null
  status: 'Submitted'
}
```

**Storage:** CouchDB (offline-first, synced when online)

---

### Step 2: Categorization & Project Allocation (KOMPASS)

**Actor:** User (self-categorizes) or BUCH (reviews)

**Process:**

1. **Auto-Categorization [Phase 2]:**
   - System suggests category based on:
     - Merchant name (known patterns)
     - Amount patterns
     - Historical user behavior
   - User confirms or changes

2. **Project Allocation:**
   - User selects project (if expense is project-related)
   - System: Links expense to project
   - Project.actualCost updates immediately

3. **Cost Center Allocation (Phase 2):**
   - BUCH can allocate to cost centers: Sales, Admin, Project X, etc.
   - For Lexware export and accounting

**Validation:**

- Amount >€250: Requires BUCH approval (German travel expense rule)
- Missing receipt for >€150: System warns, blocks approval
- Project-allocated: Project budget checked (warn if exceeds)

---

### Step 3: Approval Workflow (KOMPASS)

**Actor:** BUCH (Approver)

**Process:**

1. **Approval Queue (BUCH Dashboard)**
   - Shows all expenses with status = 'PendingApproval'
   - Grouped by user, date, project
   - Total pending: "€ 3.450 (23 Belege)"

2. **Approval Decision:**
   - BUCH reviews: Receipt photo, amount, category, project
   - BUCH checks: Within policy, reasonable, properly allocated
   - BUCH can: Approve, Reject (with reason), Request clarification

3. **Approval Actions:**
   - **Approve:** Status = 'Approved', ready for reimbursement
   - **Reject:** Status = 'Rejected', user notified
   - **Clarify:** Status = 'PendingClarification', user notified

**Batch Approval:**

- BUCH can select multiple similar expenses
- Example: All ADM mileage logs for a month
- Approve all: "45 Kilometer-Erfassungen genehmigen (€ 1.350)"

---

### Step 4: Export to Lexware (Expense Booking)

**Actor:** BUCH

**Integration Point 3: Expenses → Lexware**

**Phase 1 (Manual CSV):**

1. BUCH exports approved expenses (monthly)
2. CSV format:
   ```csv
   ExpenseDate,Category,Amount,TaxAmount,NetAmount,Employee,Project,Description,ReceiptNumber
   2025-02-05,Reisekosten,45.80,7.32,38.48,Michael Schmidt,P-2025-M003,Kraftstoff Shell,EXP-2025-123
   ```
3. BUCH imports into Lexware as "Ausgaben"
4. Lexware books to expense accounts

**Phase 2 (Semi-Automated):**

- System exports approved expenses to shared folder (nightly)
- Lexware imports automatically
- BUCH reviews import log

**Phase 3 (Real-Time):**

- Expense approved in KOMPASS
- Webhook fires to Lexware
- Lexware books expense immediately
- KOMPASS stores Lexware booking reference

**Next Step:** BUCH processes reimbursement in Lexware

---

### Step 5: Employee Reimbursement (Lexware)

**Actor:** BUCH (Payroll)

**Process (Entirely in Lexware):**

1. BUCH generates reimbursement report (monthly)
2. Groups by employee: "Michael Schmidt: € 1.450 (45 Belege)"
3. BUCH initiates bank transfer or includes in payroll
4. Lexware records reimbursement payment

**KOMPASS Role:**

- Shows expense status: "Ausstehend" / "Genehmigt" / "Ausgezahlt"
- Expense status synced from Lexware (Phase 2/3) or BUCH marks manually (Phase 1)

---

### Step 6: Accounting & Tax Reporting (Lexware)

**Actor:** BUCH + Tax Advisor

**Process (Entirely in Lexware):**

1. **Monthly Closing:**
   - BUCH reconciles all accounts
   - Books expenses to appropriate accounts (SKR03/SKR04)
   - Generates reports

2. **Quarterly Tax:**
   - BUCH runs UStVA (VAT return) in Lexware
   - Files with Finanzamt via ELSTER
   - Based on invoices (revenue) and expenses

3. **Annual Accounting:**
   - BUCH generates Bilanz (balance sheet)
   - Tax advisor reviews
   - Jahresabschluss filed

**KOMPASS Role:**

- Provides context: Project-level profitability
- NOT used for tax filing (Lexware is GoBD-certified source)

---

## Data Consistency Rules

### Golden Rules

1. **Invoice Data → Lexware is Source of Truth**
   - KOMPASS stores reference only (invoice number, amount, status)
   - Lexware stores full invoice (line items, PDF, tax calculations)
   - If discrepancy: Lexware data is authoritative

2. **Contract Data → KOMPASS is Source of Truth**
   - KOMPASS creates and manages contracts
   - Lexware receives contract copy for context
   - If discrepancy: KOMPASS data is authoritative, re-sync to Lexware

3. **Customer Data → KOMPASS is Source of Truth**
   - KOMPASS manages customer relationships
   - Lexware receives customer data for invoicing
   - If discrepancy: Update in KOMPASS, re-sync to Lexware

4. **Payment Data → Lexware is Source of Truth**
   - Lexware records actual bank transactions
   - KOMPASS receives payment status updates
   - If discrepancy: Lexware data is authoritative

### Conflict Resolution Matrix

| Data Type        | KOMPASS   | Lexware | Resolution                    |
| ---------------- | --------- | ------- | ----------------------------- |
| Customer info    | Master    | Replica | KOMPASS wins, sync to Lexware |
| Contract value   | Master    | Replica | KOMPASS wins (immutable)      |
| Invoice content  | Reference | Master  | Lexware wins always           |
| Payment status   | Derived   | Master  | Lexware wins always           |
| Project costs    | Master    | N/A     | KOMPASS only                  |
| Tax calculations | N/A       | Master  | Lexware only                  |

---

## Reconciliation Procedures

### Daily Reconciliation (Auto-Check Phase 2/3)

**System-Automated Checks:**

1. **Contract Count Match:**
   - Count contracts in KOMPASS (signed, last 30 days)
   - Count "Aufträge" in Lexware (same date range)
   - Alert if: Count differs by >5

2. **Invoice Amount Match:**
   - Sum invoice amounts in KOMPASS (issued, last 30 days)
   - Sum invoice amounts in Lexware (same date range)
   - Alert if: Difference >€100

3. **Payment Status Match:**
   - Count invoices marked 'Paid' in KOMPASS (last 7 days)
   - Count invoices marked 'Bezahlt' in Lexware (same date range)
   - Alert if: Count differs

**Alert Handling:**

- Discrepancy detected: Email BUCH + create dashboard alert
- BUCH investigates: Missing sync, data entry error, legitimate difference
- BUCH resolves: Fix source data, trigger re-sync, or mark as expected difference

### Monthly Reconciliation (BUCH Manual Review)

**BUCH Checklist:**

1. ☐ **All signed contracts in Lexware**
   - Query KOMPASS: Contracts signed this month
   - Check: Each contract appears in Lexware as "Auftrag"
   - Fix: Missing contracts → Re-export

2. ☐ **All invoices in KOMPASS**
   - Query Lexware: Invoices created this month with KOMPASS contract reference
   - Check: Each invoice has reference in KOMPASS
   - Fix: Missing references → Create manually (Phase 1) or investigate (Phase 2/3)

3. ☐ **Payment status consistent**
   - Query KOMPASS: Invoices with status = 'Paid'
   - Check: Lexware shows same invoices as 'Bezahlt'
   - Fix: Status mismatch → Re-import payments

4. ☐ **Financial totals match**
   - KOMPASS: Month total invoiced (sum of issued invoices)
   - Lexware: Month total invoiced (Umsatz report)
   - Tolerance: ±€10 (rounding)
   - Fix: Discrepancy >€10 → Investigate root cause

**Estimated Time:**

- **Phase 1:** 60 minutes (manual checks)
- **Phase 2:** 15 minutes (review auto-check report)
- **Phase 3:** 5 minutes (verification only)

---

## Reporting & Analytics

### Financial Reports (KOMPASS)

**Project-Level Reports (PLAN, BUCH, GF):**

1. **Project Profitability Report:**
   - Contract value vs. actual costs
   - Margin % and € margin
   - Cost breakdown: Labor, materials, suppliers
   - Invoiced vs. outstanding
   - Source: KOMPASS only (real-time data)

2. **Project Cashflow Report:**
   - Invoices issued
   - Payments received (from Lexware sync)
   - Outstanding receivables
   - Payment schedule forecast
   - Source: KOMPASS + Lexware (synced)

**Company-Level Reports (GF, BUCH):**

1. **Revenue Report:**
   - Total invoiced (month, quarter, year)
   - By customer, by project type, by region
   - Source: Lexware (authoritative for invoices)

2. **Expense Report:**
   - Total expenses by category
   - By project, by employee
   - Source: KOMPASS → exported to Lexware

3. **Margin Analysis:**
   - Revenue (Lexware) vs. Costs (KOMPASS)
   - Merged report: Requires both systems
   - Generated in KOMPASS with Lexware data imported

### Data Warehouse (Phase 3+)

**Long-Term Solution:**

- ETL pipeline: Extract from KOMPASS + Lexware → Data warehouse
- BI Tool: Power BI or Metabase for advanced analytics
- Single pane of glass: Financial + operational data combined
- Historical analysis: Multi-year trends, forecasting

---

## Failure Modes & Recovery

### Scenario 1: Sync Failure (Phase 2/3)

**Failure:** Network outage, Lexware API down, file corruption

**Detection:**

- Scheduled job fails
- Error logged
- Alert sent to BUCH + Ops team

**Recovery:**

- **Immediate:** System retries with exponential backoff (1s, 2s, 4s, 8s, max 5 attempts)
- **If all retries fail:** Manual intervention required
- **Fallback:** BUCH can trigger manual sync or use Phase 1 CSV method
- **Data Safety:** All transactions queued, no data loss

**Prevention:**

- Health checks every 15 minutes
- Redundant sync paths (API + CSV fallback)
- Monitoring: Alert if no successful sync in 12 hours

### Scenario 2: Data Inconsistency Discovered

**Failure:** Contract in KOMPASS not found in Lexware (or vice versa)

**Detection:**

- Monthly reconciliation check
- User report ("Invoice missing in KOMPASS")

**Investigation:**

1. Check sync logs: Was contract exported?
2. Check Lexware import log: Was contract imported successfully?
3. Check contract status: Was it cancelled after export?

**Resolution:**

- If sync failed: Re-trigger sync for that contract
- If data changed post-sync: Re-sync with current data
- If Lexware rejected: Fix validation error, re-sync

**Post-Mortem:**

- Document: What caused inconsistency
- Fix: Root cause (validation, timing, logic error)
- Improve: Add safeguards to prevent recurrence

### Scenario 3: GoBD Audit

**Scenario:** Tax auditor requests all financial records for 2025

**Process:**

1. **Invoice Records (from Lexware):**
   - BUCH exports all invoices from Lexware (DATEV format)
   - Includes: Immutable invoice PDFs, audit trail
   - Lexware is GoBD-certified source

2. **Contract Records (from KOMPASS):**
   - BUCH exports all contracts from KOMPASS (PDF)
   - Includes: Immutable contracts, change logs, signatures
   - KOMPASS maintains GoBD compliance for contracts

3. **Sync Audit Trail (from KOMPASS):**
   - BUCH exports integration logs
   - Shows: Every sync operation, timestamp, success/failure
   - Proves: Data consistency maintained

**Auditor Requirement:** Show integration is trustworthy

- **Evidence:** Reconciliation reports (all months)
- **Evidence:** Error rate <1%
- **Evidence:** Discrepancies resolved and documented
- **Evidence:** Immutability preserved (contracts, invoices)

---

## User Experience Design

### BUCH Dashboard Integration Status Section

**Design:**

```
┌────────────────────────────────────────────────────────┐
│ Lexware-Integration                                    │
├────────────────────────────────────────────────────────┤
│ Phase: 2 (Semi-Automatisch)                            │
│ Status: ✓ Aktiv • Letzte Synchronisation: Vor 15 Min  │
│                                                        │
│ Heute synchronisiert:                                  │
│ ✓ 5 Verträge exportiert                                │
│ ✓ 12 Zahlungen importiert                              │
│ ⚠️ 1 Fehler (manuell behoben)                          │
│                                                        │
│ [Synchronisations-Protokoll] [Fehler anzeigen]        │
│ [Manuelle Synchronisation jetzt starten]              │
└────────────────────────────────────────────────────────┘
```

**Link:** See BUCH dashboard (already updated in earlier todo)

### Reconciliation Dashboard (BUCH Only)

**Design:**

```
┌────────────────────────────────────────────────────────┐
│ Lexware-Reconciliation                       [Export]  │
├────────────────────────────────────────────────────────┤
│ Zeitraum: [01.02.2025 - 28.02.2025]                   │
│                                                        │
│ ✓ Abgeglichen: 45 Transaktionen (98%)                 │
│ ⚠️ Nicht zugeordnet: 1 Transaktion (2%)                │
│                                                        │
│ ┌─ Nicht zugeordnete Transaktionen ────────────────┐  │
│ │ Lexware-Rechnung: R-2025-00789                    │  │
│ │ Kunde: Hofladen Müller • Betrag: € 12.500        │  │
│ │ Datum: 15.02.2025                                 │  │
│ │ Problem: Keine Vertragsreferenz in Lexware        │  │
│ │                                                   │  │
│ │ KOMPASS-Verträge (Vorschläge):                    │  │
│ │ • V-2025-00123 (Müller, € 146.370) [Zuordnen]    │  │
│ │ • V-2024-00456 (Müller, € 85.000) [Zuordnen]     │  │
│ │                                                   │  │
│ │ [Manuell zuordnen] [Als unzugeordnet markieren]  │  │
│ └───────────────────────────────────────────────────┘  │
│                                                        │
│ [Reconciliation abschließen]                           │
└────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [Lexware Integration Strategy](LEXWARE_INTEGRATION_STRATEGY.md) - 4-phase roadmap
- [Pre-Mortem Analysis](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification
- [Supplier Management](SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Supplier invoice flow
- [Material Management](MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) - Material cost flow

---

## Revision History

| Version | Date       | Author       | Changes                                        |
| ------- | ---------- | ------------ | ---------------------------------------------- |
| 1.0     | 2025-11-12 | Product Team | Initial revenue and expense flow documentation |
