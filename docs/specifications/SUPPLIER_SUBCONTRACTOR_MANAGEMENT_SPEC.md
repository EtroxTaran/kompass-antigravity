# Supplier & Subcontractor Management Specification

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Planned for Phase 1 - MVP  
**Owner:** Product & Engineering Team  
**Priority:** CRITICAL - Addresses Pre-Mortem Danger #3

---

## Executive Summary

**Why This Module is Critical:**

The pre-mortem analysis identified the **complete absence of Supplier & Subcontractor Management** as a fatal gap. The INN (Internal Services) persona's primary role is coordinating external partners—craftsmen, suppliers, installers—yet KOMPASS provides no dedicated tools for this workflow.

**Without this module:**
- Claudia (INN) is forced to use Excel and email, creating data silos
- Project cost tracking is incomplete (missing supplier invoices)
- Supplier performance cannot be measured or improved
- KOMPASS becomes irrelevant for operational execution

**This module makes KOMPASS the single source of truth for Ladenbau project execution.**

---

## Domain Model

### Supplier Entity

```typescript
interface Supplier extends BaseEntity {
  _id: string;                    // "supplier-{uuid}"
  _rev: string;
  type: 'supplier';
  
  // Basic Information
  companyName: string;             // Required, 2-200 chars
  legalForm?: string;              // "GmbH", "e.K.", "GbR", etc.
  vatNumber?: string;              // Optional, format: DE123456789
  taxId?: string;                  // Steuernummer (German tax ID)
  
  // Contact Information
  email: string;                   // Required
  phone: string;                   // Required
  mobile?: string;
  fax?: string;                    // Legacy, optional
  website?: string;
  
  // Address
  billingAddress: Address;         // Required
  deliveryAddresses?: Address[];   // Optional multiple delivery addresses
  
  // Supplier Classification
  supplierType: SupplierType;      // Required
  serviceCategories: ServiceCategory[]; // Required, at least 1
  serviceDescription: string;      // Required, 50-1000 chars
  
  // Business Details
  paymentTerms: PaymentTerms;      // Required
  minimumOrderValue?: number;      // Optional, € minimum
  deliveryLeadTime?: number;       // Days, optional
  workingRadius?: number;          // km, for location-based services
  
  // Performance Tracking
  rating: SupplierRating;          // 1-5 stars, calculated
  qualityScore: number;            // 0-100, calculated from project feedback
  reliabilityScore: number;        // 0-100, on-time delivery rate
  priceCompetitiveness: number;    // 0-100, vs. market average
  totalProjectCount: number;       // Count of projects worked on
  activeProjectCount: number;      // Current active assignments
  
  // Financial
  totalContractValue: number;      // Sum of all contracts
  outstandingInvoices: number;     // Sum of unpaid invoices
  creditLimit?: number;            // Optional, € maximum
  
  // Documents
  insuranceCertificate?: Document; // Required for liability work
  tradeLicense?: Document;         // Gewerbeanmeldung
  qualifications?: Document[];     // Certifications, Meisterbrief
  references?: Document[];         // Reference letters
  
  // Status
  status: 'Active' | 'Inactive' | 'Blacklisted' | 'PendingApproval';
  blacklistReason?: string;        // Required if Blacklisted
  approvedBy?: string;             // User ID (GF approval for first contract)
  approvedAt?: Date;
  
  // Relationships
  primaryContactId?: string;       // Main contact person at supplier
  accountManagerId: string;        // INN user managing this supplier
  
  // Audit Trail (from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

enum SupplierType {
  MATERIAL_SUPPLIER = 'material_supplier',         // Sells materials
  SERVICE_PROVIDER = 'service_provider',           // Provides services
  SUBCONTRACTOR = 'subcontractor',                 // Full subcontracted work
  CRAFTSMAN = 'craftsman',                         // Individual tradesman
  LOGISTICS = 'logistics',                         // Transport/delivery
  MIXED = 'mixed'                                  // Materials + services
}

enum ServiceCategory {
  // Trades
  CARPENTRY = 'carpentry',                         // Tischlerei
  METALWORK = 'metalwork',                         // Metallbau
  ELECTRICAL = 'electrical',                       // Elektrik
  PLUMBING = 'plumbing',                           // Sanitär
  HVAC = 'hvac',                                   // Heizung/Klima
  PAINTING = 'painting',                           // Malerei
  FLOORING = 'flooring',                           // Bodenbeläge
  
  // Materials
  WOOD_MATERIALS = 'wood_materials',               // Holzmaterialien
  METAL_MATERIALS = 'metal_materials',             // Metallmaterialien
  LIGHTING = 'lighting',                           // Beleuchtung
  FURNITURE = 'furniture',                         // Möbel
  FIXTURES = 'fixtures',                           // Einrichtungsgegenstände
  
  // Services
  INSTALLATION = 'installation',                   // Montage
  TRANSPORT = 'transport',                         // Transport
  DISPOSAL = 'disposal',                           // Entsorgung
  CLEANING = 'cleaning',                           // Reinigung
  
  OTHER = 'other'
}

interface PaymentTerms {
  paymentMethod: 'Invoice' | 'DirectDebit' | 'CreditCard' | 'Cash' | 'BankTransfer';
  daysUntilDue: number;            // Standard: 30, can be 14, 21, 60, 90
  discountPercentage?: number;     // Optional, e.g., 2% for payment within 10 days
  discountDays?: number;           // Days for discount eligibility
  partialPaymentAllowed: boolean;  // Anzahlungen möglich
}

interface SupplierRating {
  overall: number;                 // 1-5 stars, weighted average
  quality: number;                 // 1-5
  reliability: number;             // 1-5
  communication: number;           // 1-5
  priceValue: number;              // 1-5
  reviewCount: number;             // How many projects rated
  lastUpdated: Date;
}
```

### SupplierContract Entity

```typescript
interface SupplierContract extends BaseEntity {
  _id: string;                     // "supplier-contract-{uuid}"
  _rev: string;
  type: 'supplier_contract';
  
  // Contract Basics
  contractNumber: string;          // Required, unique, "SC-2025-00123"
  supplierId: string;              // Required, reference to Supplier
  projectId?: string;              // Optional, null = framework contract
  
  // Contract Details
  contractType: ContractType;      // Required
  title: string;                   // Required, 10-200 chars
  description: string;             // Required, 50-2000 chars
  scope: string[];                 // Work packages, required
  
  // Financial
  contractValue: number;           // Required, € total
  valueType: 'Fixed' | 'TimeAndMaterial' | 'UnitPrice' | 'CostPlus';
  paymentSchedule: PaymentMilestone[]; // Required
  retentionPercentage?: number;    // Gewährleistungseinbehalt, typically 5-10%
  
  // Timeline
  startDate: Date;                 // Required
  endDate: Date;                   // Required
  noticePeriod?: number;           // Days for termination notice
  
  // Legal
  contractDocument?: Document;     // Signed PDF
  termsAccepted: boolean;          // Required
  insuranceRequired: boolean;      // Required
  minimumInsuranceAmount?: number; // € if insuranceRequired true
  
  // Status
  status: ContractStatus;          // Required
  signedBySupplier: boolean;
  signedByUs: boolean;
  signedDate?: Date;
  approvedBy?: string;             // GF approval for >€50k
  approvedAt?: Date;
  
  // Performance
  actualValue?: number;            // Final billed amount
  actualEndDate?: Date;
  performanceRating?: SupplierRating; // Post-completion
  
  // Audit Trail
  createdBy: string;               // INN or PLAN
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

enum ContractType {
  FRAMEWORK = 'framework',         // Rahmenvertrag (ongoing)
  PROJECT = 'project',             // Project-specific
  SERVICE_AGREEMENT = 'service_agreement', // Wartungsvertrag
  PURCHASE_ORDER = 'purchase_order' // Simple PO
}

enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',  // Awaiting GF approval
  SENT_TO_SUPPLIER = 'sent_to_supplier',  // Awaiting supplier signature
  SIGNED = 'signed',                       // Active
  IN_EXECUTION = 'in_execution',           // Work underway
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
  CANCELLED = 'cancelled'
}

interface PaymentMilestone {
  description: string;             // e.g., "50% Anzahlung"
  percentage: number;              // % of contract value
  amount: number;                  // Calculated: contractValue * percentage
  dueCondition: string;            // "Bei Auftragserteilung", "Nach Lieferung"
  dueDate?: Date;                  // Optional specific date
  invoiceId?: string;              // Link to invoice when billed
  paidDate?: Date;                 // When payment completed
  status: 'Pending' | 'Invoiced' | 'Paid';
}
```

### SupplierInvoice Entity

```typescript
interface SupplierInvoice extends BaseEntity {
  _id: string;                     // "supplier-invoice-{uuid}"
  _rev: string;
  type: 'supplier_invoice';
  
  // Invoice Basics
  invoiceNumber: string;           // Supplier's invoice number
  supplierId: string;              // Required
  contractId?: string;             // Optional, link to contract
  projectId: string;               // Required, which project is this for
  
  // Financial
  invoiceDate: Date;               // Required
  dueDate: Date;                   // Required
  netAmount: number;               // Required
  taxRate: number;                 // Usually 19% or 7%
  taxAmount: number;               // Calculated
  grossAmount: number;             // netAmount + taxAmount
  
  // Line Items
  lineItems: SupplierInvoiceLineItem[];
  
  // Payment
  paymentStatus: 'Pending' | 'Approved' | 'Paid' | 'Disputed';
  approvedBy?: string;             // BUCH or GF
  approvedAt?: Date;
  paidDate?: Date;
  paidAmount?: number;             // May differ if disputed
  
  // Documents
  invoiceDocument: Document;       // PDF of invoice
  deliveryNote?: Document;         // Lieferschein
  
  // Audit Trail
  createdBy: string;               // Usually INN who receives invoice
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

interface SupplierInvoiceLineItem {
  description: string;
  quantity: number;
  unit: string;                    // "Stück", "m²", "Stunden", "Pauschale"
  unitPrice: number;
  netAmount: number;               // quantity * unitPrice
  taxRate: number;
  materialId?: string;             // Link to material catalog if applicable
}
```

### ProjectSubcontractor Entity (Assignment)

```typescript
interface ProjectSubcontractor extends BaseEntity {
  _id: string;                     // "project-subcontractor-{uuid}"
  _rev: string;
  type: 'project_subcontractor';
  
  // Assignment
  projectId: string;               // Required
  supplierId: string;              // Required
  contractId?: string;             // Optional, link to contract
  
  // Work Details
  workPackage: string;             // Required, e.g., "Elektrik Installation"
  serviceCategory: ServiceCategory; // Required
  description: string;             // Required, scope of work
  
  // Schedule
  plannedStartDate: Date;          // Required
  plannedEndDate: Date;            // Required
  actualStartDate?: Date;
  actualEndDate?: Date;
  
  // Financial
  estimatedCost: number;           // Required, from KALK
  actualCost?: number;             // Updated as invoices arrive
  budgetStatus: 'OnTrack' | 'Warning' | 'Exceeded';
  
  // Status
  status: 'Planned' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  completionPercentage: number;    // 0-100
  
  // Performance
  qualityRating?: number;          // 1-5, after completion
  timelinessRating?: number;       // 1-5, on-time delivery
  communicationRating?: number;    // 1-5, responsiveness
  notes?: string;                  // Issues, feedback
  
  // Audit Trail
  assignedBy: string;              // INN or PLAN
  assignedAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### CommunicationLog Entity

```typescript
interface SupplierCommunication extends BaseEntity {
  _id: string;                     // "supplier-comm-{uuid}"
  _rev: string;
  type: 'supplier_communication';
  
  // Context
  supplierId: string;              // Required
  projectId?: string;              // Optional
  contractId?: string;             // Optional
  
  // Communication Details
  communicationType: 'Email' | 'Phone' | 'InPerson' | 'Video' | 'SMS';
  direction: 'Inbound' | 'Outbound';
  subject: string;                 // Required, 10-200 chars
  content: string;                 // Required, 20-5000 chars
  
  // Metadata
  communicationDate: Date;         // Required
  participants: string[];          // User IDs
  attachments?: Document[];
  
  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;
  
  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

---

## RBAC Permissions

### Permission Matrix

| Role | Supplier (CRUD) | Contract (CRUD) | Invoice (View/Approve) | Rating |
|------|----------------|----------------|------------------------|--------|
| **INN** | Full CRUD | Create, Update | View, Flag for approval | Rate |
| **PLAN** | Read, Create | Read | View | Rate (post-project) |
| **KALK** | Read | Read | View | - |
| **BUCH** | Read | Read | View, Approve, Mark paid | - |
| **ADM** | Read (limited) | - | - | - |
| **GF** | Full CRUD | Full CRUD, Approve >€50k | View, Approve >€10k | View all |

### Business Rules

**SU-001:** INN is primary owner of Supplier module
- INN can create, update, and manage all suppliers
- INN assigns suppliers to projects
- INN receives and logs supplier invoices

**SU-002:** Contract approval workflow
- Contracts <€50k: Auto-approved after INN creates
- Contracts ≥€50k: Require GF approval before sending to supplier
- Contracts >€200k: Require GF + BUCH pre-approval

**SU-003:** Invoice approval workflow
- Invoices <€1k: Auto-approved if matches PO
- Invoices €1k-€10k: Require BUCH approval
- Invoices >€10k: Require GF approval

**SU-004:** Blacklist protection
- Only GF can blacklist a supplier
- Blacklisted suppliers cannot be assigned to new projects
- Must provide reason for blacklist

**SU-005:** Rating requirements
- Suppliers cannot be rated until project completion
- Rating must include all 4 dimensions (quality, timeliness, communication, value)
- Rating visible to all users (transparency)

---

## Core Workflows

### Workflow 1: Supplier Onboarding

**Actors:** INN (primary), GF (approval)

**Steps:**

1. **Discovery**
   - INN discovers new supplier (referral, website, trade show)
   - INN evaluates: service fit, initial pricing, availability

2. **Create Supplier Record (INN)**
   - INN enters basic information (company, contact, services)
   - INN uploads documents: trade license, insurance, qualifications
   - INN sets payment terms (negotiated or default 30 days)
   - System: Validates VAT number format if provided
   - System: Sets status = 'PendingApproval'

3. **Initial Approval (GF)**
   - GF reviews supplier profile
   - GF checks: credentials, insurance, pricing competitiveness
   - GF approves or rejects with feedback
   - System: Sets status = 'Active' if approved

4. **Supplier Activated**
   - Supplier now available for project assignments
   - INN notified of approval
   - Supplier added to supplier directory

**Edge Cases:**
- **Rejection:** INN can re-submit after addressing GF feedback
- **Incomplete documents:** System warns but allows saving as draft
- **Duplicate detection:** System checks for similar company names (Phase 2 feature)

### Workflow 2: Request for Quote (RFQ)

**Actors:** INN (primary), PLAN (requester), KALK (evaluation)

**Steps:**

1. **RFQ Creation (INN or PLAN)**
   - For a project, identify needed service/material
   - Create RFQ: Scope of work, quantity, specifications, deadline
   - Select 3-5 suppliers to request quotes from (based on service category match)
   - System: Generates RFQ document (PDF)

2. **Send to Suppliers**
   - System: Emails RFQ to selected suppliers
   - Email includes: Project context, scope, required quote deadline
   - Supplier submits quote via email or portal (Phase 2)

3. **Quote Reception (INN)**
   - INN receives quotes (email attachments)
   - INN enters quote details into system:
     - Supplier, quoted price, delivery time, notes
     - Upload quote document
   - INN can request clarifications

4. **Quote Evaluation (INN + KALK)**
   - KALK reviews pricing vs. estimate
   - INN evaluates: quality, timeline, terms
   - System: Comparison table of all quotes
   - Decision: Select winning supplier

5. **Award Contract**
   - INN creates contract with winning supplier
   - Proceed to Contract Negotiation workflow

**Edge Cases:**
- **No quotes received:** System sends reminder after 7 days
- **All quotes too high:** INN can expand supplier search or adjust scope
- **Supplier declines:** Status marked, not counted as negative

### Workflow 3: Contract Negotiation & Signing

**Actors:** INN (negotiator), GF (approval for large), Supplier (signer)

**Steps:**

1. **Contract Draft (INN)**
   - INN creates contract: Scope, value, timeline, payment terms
   - INN attaches: Scope document, drawings, specifications
   - System: Validates contract value vs. project budget
   - System: Warns if supplier not yet approved

2. **Approval Routing**
   - If <€50k: Skip to step 3
   - If ≥€50k: Route to GF for approval
   - GF reviews and approves/rejects
   - If rejected: INN revises and resubmits

3. **Send to Supplier (INN)**
   - System: Generates contract PDF with terms
   - INN sends via email or portal
   - Status: 'SentToSupplier'

4. **Supplier Signature**
   - Supplier reviews and signs (wet signature or DocuSign)
   - Supplier returns signed PDF
   - INN uploads signed contract
   - INN marks: signedBySupplier = true, uploads document

5. **Internal Signature (INN or GF)**
   - INN or GF signs on behalf of company
   - Upload countersigned contract
   - System: Sets status = 'Signed'
   - System: Sets signedDate = today

6. **Contract Active**
   - System: Creates project assignment (ProjectSubcontractor)
   - INN notified: Contract ready for execution
   - PLAN notified: Supplier available for project scheduling

**Edge Cases:**
- **Supplier requests changes:** Status = 'UnderNegotiation', INN revises
- **Contract expires unsigned:** System alerts INN after 30 days
- **Insurance insufficient:** System blocks signing until updated

### Workflow 4: Work Assignment to Project

**Actors:** INN (primary), PLAN (coordination)

**Steps:**

1. **Assignment Creation (INN or PLAN)**
   - Select project needing work
   - Select supplier with matching service category
   - Define work package (subset of project scope)
   - Set timeline: Start date, end date
   - Set estimated cost (from contract or RFQ)

2. **Validation**
   - System: Check supplier has active contract (project or framework)
   - System: Check supplier availability (not overbooked)
   - System: Check budget: project has remaining budget for this cost
   - System: Warn if supplier rating <3 stars

3. **Confirmation**
   - INN confirms assignment
   - System: Sets status = 'Confirmed'
   - System: Updates supplier activeProjectCount += 1
   - Supplier notified via email (Phase 1: manual, Phase 2: automatic)

4. **Work In Progress**
   - INN or PLAN updates status to 'InProgress' when work starts
   - PLAN updates completionPercentage periodically
   - INN logs supplier communications
   - System: Shows on PLAN dashboard

5. **Work Completion**
   - PLAN or INN marks status = 'Completed'
   - System: Prompts for performance rating
   - System: Compares actual vs. estimated costs
   - System: Updates supplier activeProjectCount -= 1

**Edge Cases:**
- **Supplier cancels:** INN finds replacement, logs reason
- **Work delayed:** INN adjusts dates, logs delay reason
- **Quality issues:** INN logs communication, may affect rating

### Workflow 5: Invoice Processing

**Actors:** INN (receiver), BUCH (approver), GF (high-value approval)

**Steps:**

1. **Invoice Receipt (INN)**
   - Supplier sends invoice (email PDF)
   - INN creates SupplierInvoice record
   - INN enters: Invoice number, date, due date, amounts
   - INN uploads invoice PDF
   - INN links to: Project, Contract, Work assignment

2. **3-Way Match Validation**
   - System: Validates invoice against:
     - Purchase Order or Contract (amount match ±10%)
     - Delivery/completion confirmation (work actually done)
     - Previously paid amounts (no double-billing)
   - System: Flags discrepancies for INN review

3. **Approval Routing**
   - If <€1k AND 3-way match OK: Status = 'Approved' (auto)
   - If €1k-€10k: Route to BUCH for approval
   - If >€10k: Route to GF for approval
   - If discrepancies: Flag for manual review

4. **Approval Decision (BUCH or GF)**
   - Reviewer checks invoice details
   - Reviewer can: Approve, Reject, Request clarification
   - If approved: Status = 'Approved', ready for payment
   - If rejected: INN contacts supplier to resolve

5. **Payment (BUCH)**
   - BUCH marks invoice as paid in KOMPASS
   - BUCH enters: Paid date, paid amount
   - System: Updates supplier outstandingInvoices
   - System: Updates project actual costs (real-time)

6. **Lexware Export**
   - BUCH exports approved invoices to Lexware (CSV Phase 1, API Phase 2)
   - Lexware handles actual bank transfer
   - BUCH imports payment confirmation back to KOMPASS

**Edge Cases:**
- **Invoice disputed:** Status = 'Disputed', INN contacts supplier
- **Partial payment:** BUCH enters partial amount, invoice remains 'Approved' until fully paid
- **Early payment discount:** BUCH calculates discount, enters discounted amount

### Workflow 6: Supplier Performance Rating

**Actors:** INN (coordinator), PLAN (project executor)

**Steps:**

1. **Rating Trigger**
   - System: After ProjectSubcontractor status = 'Completed'
   - System: Prompts PLAN (project manager) and INN (supplier manager) to rate

2. **Rating Form**
   - User rates on 4 dimensions (1-5 stars each):
     - Quality: Work quality, attention to detail
     - Reliability: On-time delivery, adherence to schedule
     - Communication: Responsiveness, proactivity
     - Price/Value: Fair pricing, value for money
   - User provides: Written feedback (optional, 20-500 chars)

3. **Rating Submission**
   - System: Calculates overall rating (weighted average)
   - System: Updates SupplierRating on Supplier record
   - System: Recalculates supplier qualityScore, reliabilityScore

4. **Rating Visibility**
   - Rating shown on supplier profile (visible to INN, PLAN, GF)
   - Low ratings (<3 stars overall) trigger review by INN and GF
   - Multiple low ratings may lead to blacklist recommendation

**Edge Cases:**
- **Delayed rating:** System reminds weekly until completed
- **Disputed rating:** Supplier can request clarification (manual process)
- **Rating correction:** GF can edit ratings if clearly erroneous

---

## API Endpoints

### Supplier Management

```
POST   /api/v1/suppliers
  Body: CreateSupplierDto
  Auth: INN, PLAN, GF
  Returns: SupplierResponseDto
  Description: Create new supplier (status = PendingApproval)

GET    /api/v1/suppliers
  Query: ?status=Active&serviceCategory=electrical&search=müller
  Auth: All authenticated users
  Returns: SupplierResponseDto[]
  Description: List suppliers with filtering

GET    /api/v1/suppliers/:id
  Auth: All authenticated users
  Returns: SupplierResponseDto
  Description: Get supplier details

PUT    /api/v1/suppliers/:id
  Body: UpdateSupplierDto
  Auth: INN, GF
  Returns: SupplierResponseDto
  Description: Update supplier details

PUT    /api/v1/suppliers/:id/approve
  Auth: GF only
  Returns: SupplierResponseDto
  Description: Approve pending supplier (sets status = Active)

PUT    /api/v1/suppliers/:id/blacklist
  Body: { reason: string }
  Auth: GF only
  Returns: SupplierResponseDto
  Description: Blacklist supplier (requires reason)

DELETE /api/v1/suppliers/:id
  Auth: GF only
  Returns: 204 No Content
  Description: Soft delete (sets status = Inactive)
```

### Contract Management

```
POST   /api/v1/suppliers/:supplierId/contracts
  Body: CreateContractDto
  Auth: INN, PLAN
  Returns: ContractResponseDto
  Description: Create contract with supplier

GET    /api/v1/suppliers/:supplierId/contracts
  Auth: All authenticated users
  Returns: ContractResponseDto[]
  Description: List contracts for supplier

GET    /api/v1/contracts/:id
  Auth: All authenticated users
  Returns: ContractResponseDto
  Description: Get contract details

PUT    /api/v1/contracts/:id
  Body: UpdateContractDto
  Auth: INN, GF
  Returns: ContractResponseDto
  Description: Update contract (only if status = Draft)

PUT    /api/v1/contracts/:id/approve
  Auth: GF (for >€50k), BUCH (for cost review)
  Returns: ContractResponseDto
  Description: Approve contract for sending to supplier

PUT    /api/v1/contracts/:id/sign
  Body: { signedDocument: File, signedBy: 'Supplier' | 'Us' }
  Auth: INN, GF
  Returns: ContractResponseDto
  Description: Record signature

GET    /api/v1/contracts/:id/performance
  Auth: INN, PLAN, GF
  Returns: ContractPerformanceDto
  Description: Get contract performance metrics
```

### Project Assignments

```
POST   /api/v1/projects/:projectId/subcontractors
  Body: AssignSubcontractorDto
  Auth: INN, PLAN
  Returns: ProjectSubcontractorDto
  Description: Assign supplier to project

GET    /api/v1/projects/:projectId/subcontractors
  Auth: INN, PLAN, GF
  Returns: ProjectSubcontractorDto[]
  Description: List subcontractors for project

PUT    /api/v1/projects/:projectId/subcontractors/:id
  Body: UpdateAssignmentDto
  Auth: INN, PLAN
  Returns: ProjectSubcontractorDto
  Description: Update work status, completion %

PUT    /api/v1/projects/:projectId/subcontractors/:id/rate
  Body: RateSubcontractorDto
  Auth: INN, PLAN
  Returns: ProjectSubcontractorDto
  Description: Rate supplier performance post-completion
```

### Invoice Processing

```
POST   /api/v1/supplier-invoices
  Body: CreateSupplierInvoiceDto
  Auth: INN, BUCH
  Returns: SupplierInvoiceDto
  Description: Create supplier invoice record

GET    /api/v1/supplier-invoices
  Query: ?status=Pending&projectId=xxx&supplierId=yyy
  Auth: INN, BUCH, GF
  Returns: SupplierInvoiceDto[]
  Description: List supplier invoices with filtering

PUT    /api/v1/supplier-invoices/:id/approve
  Auth: BUCH (for ≤€10k), GF (for >€10k)
  Returns: SupplierInvoiceDto
  Description: Approve invoice for payment

PUT    /api/v1/supplier-invoices/:id/pay
  Body: { paidDate: Date, paidAmount: number }
  Auth: BUCH
  Returns: SupplierInvoiceDto
  Description: Mark invoice as paid (after Lexware payment)

PUT    /api/v1/supplier-invoices/:id/dispute
  Body: { reason: string }
  Auth: INN, BUCH
  Returns: SupplierInvoiceDto
  Description: Flag invoice as disputed
```

### Communication Logging

```
POST   /api/v1/suppliers/:supplierId/communications
  Body: CreateCommunicationDto
  Auth: INN, PLAN
  Returns: CommunicationDto
  Description: Log communication with supplier

GET    /api/v1/suppliers/:supplierId/communications
  Auth: INN, PLAN, GF
  Returns: CommunicationDto[]
  Description: Get communication history
```

---

## Validation Rules

### Supplier Validation

```typescript
// companyName validation
- Required: true
- Min length: 2
- Max length: 200
- Pattern: /^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/
- Error: "Company name must be 2-200 characters, letters, numbers, and basic punctuation only"

// vatNumber validation (German VAT)
- Required: false
- Pattern: /^DE\d{9}$/
- Error: "German VAT number must be format: DE123456789"

// email validation
- Required: true
- Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Error: "Invalid email format"

// phone validation
- Required: true
- Pattern: /^[\+]?[0-9\s\-()]+$/
- Min length: 7
- Max length: 20
- Error: "Invalid phone number format"

// supplierType validation
- Required: true
- Enum: SupplierType
- Error: "Supplier type is required"

// serviceCategories validation
- Required: true
- Array length: Min 1, Max 10
- Each value: Must be valid ServiceCategory enum
- Error: "At least one service category is required"

// paymentTerms.daysUntilDue validation
- Required: true
- Min: 0 (immediate)
- Max: 120 (4 months)
- Common values: 14, 21, 30, 60, 90
- Error: "Payment terms must be 0-120 days"
```

### Contract Validation

```typescript
// contractValue validation
- Required: true
- Min: 0
- Max: 10000000 (€10M)
- Error: "Contract value must be between €0 and €10M"

// startDate / endDate validation
- Required: true
- startDate: Min: today - 30 days, Max: +365 days
- endDate: Must be > startDate
- Error: "Contract end date must be after start date"

// paymentSchedule validation
- Required: true (at least 1 milestone)
- Sum of percentages must equal 100%
- Each amount must equal: contractValue * (percentage / 100)
- Error: "Payment milestones must total 100% of contract value"

// Approval validation (SU-002)
- If contractValue >= 50000 AND approvedBy == null:
  - Error: "Contracts ≥€50k require GF approval"
- If contractValue > 200000 AND (approvedBy != GF OR !buchReviewed):
  - Error: "Contracts >€200k require GF + BUCH approval"
```

### Invoice Validation

```typescript
// grossAmount validation
- Required: true
- Must equal: netAmount + taxAmount
- Tolerance: ±0.01 (1 cent rounding)
- Error: "Gross amount must equal net + tax"

// dueDate validation
- Required: true
- Must be >= invoiceDate
- Warning if > invoiceDate + 120 days (unusual payment terms)

// 3-way match validation (SU-INV-001)
- If linked to contract:
  - Check: Invoice amount ≤ contract remaining value + 10% tolerance
  - Warning: "Invoice exceeds contract value by €X"
  
- If work not marked completed:
  - Warning: "Work assignment not yet marked complete. Confirm delivery before approving."
  
- If duplicate invoice number detected:
  - Error: "Invoice number already exists for this supplier"
```

---

## Business Logic

### Supplier Rating Calculation

```typescript
function calculateOverallRating(ratings: ProjectRating[]): SupplierRating {
  if (ratings.length === 0) {
    return null; // Not yet rated
  }
  
  // Weighted average of all project ratings
  const weights = {
    quality: 0.35,
    reliability: 0.30,
    communication: 0.20,
    priceValue: 0.15
  };
  
  const avgQuality = average(ratings.map(r => r.quality));
  const avgReliability = average(ratings.map(r => r.reliability));
  const avgCommunication = average(ratings.map(r => r.communication));
  const avgPriceValue = average(ratings.map(r => r.priceValue));
  
  const overall = (
    avgQuality * weights.quality +
    avgReliability * weights.reliability +
    avgCommunication * weights.communication +
    avgPriceValue * weights.priceValue
  );
  
  return {
    overall: round(overall, 1),
    quality: round(avgQuality, 1),
    reliability: round(avgReliability, 1),
    communication: round(avgCommunication, 1),
    priceValue: round(avgPriceValue, 1),
    reviewCount: ratings.length,
    lastUpdated: new Date()
  };
}
```

### Contract Status Transitions

```typescript
const VALID_CONTRACT_TRANSITIONS = {
  'Draft': ['PendingApproval', 'Cancelled'],
  'PendingApproval': ['Draft', 'SentToSupplier', 'Cancelled'],
  'SentToSupplier': ['UnderNegotiation', 'Signed', 'Cancelled'],
  'UnderNegotiation': ['SentToSupplier', 'Cancelled'],
  'Signed': ['InExecution', 'Terminated'],
  'InExecution': ['Completed', 'Terminated'],
  'Completed': [],  // Terminal state
  'Terminated': [],  // Terminal state
  'Cancelled': []   // Terminal state
};
```

### Real-Time Cost Updates

```typescript
async function updateProjectCostsFromSupplierInvoice(
  invoice: SupplierInvoice
): Promise<void> {
  // When supplier invoice is marked paid, update project actual costs
  const project = await projectRepository.findById(invoice.projectId);
  
  // Add invoice amount to project's actual supplier costs
  project.actualSupplierCosts += invoice.grossAmount;
  project.actualCost = project.actualLaborCosts + project.actualMaterialCosts + project.actualSupplierCosts;
  project.currentMargin = ((project.contractValue - project.actualCost) / project.contractValue) * 100;
  
  // Update budget status
  if (project.actualCost > project.budget) {
    project.budgetStatus = 'Exceeded';
  } else if (project.actualCost > project.budget * 0.90) {
    project.budgetStatus = 'Warning';
  } else {
    project.budgetStatus = 'OnTrack';
  }
  
  await projectRepository.update(project);
  
  // Notify PLAN and BUCH if budget warning
  if (project.budgetStatus === 'Warning' || project.budgetStatus === 'Exceeded') {
    await notificationService.send({
      recipients: [project.projectManager, 'BUCH'],
      type: 'BudgetAlert',
      message: `Project ${project.projectNumber}: Budget at ${percentage}%`,
      link: `/projects/${project.id}`
    });
  }
}
```

---

## Integration Points

### With Project Module

- **Project → Suppliers:** Many-to-many via ProjectSubcontractor
- **Budget tracking:** Supplier invoices update project actualCosts in real-time
- **Timeline:** Supplier work packages appear on project Gantt chart
- **Documents:** Supplier documents linked to project document library

### With Material Module

- **Supplier → Materials:** Suppliers can supply specific materials
- **Pricing:** Supplier pricing for materials tracked per supplier
- **Purchase Orders:** Material purchase orders create supplier contracts

### With Financial Module (Lexware)

- **Invoice Export:** Supplier invoices exported to Lexware for payment
- **Payment Import:** Payment confirmations imported back to KOMPASS
- **Reconciliation:** Monthly reconciliation ensures KOMPASS ↔ Lexware sync

---

## UI/UX Considerations

See dedicated UI/UX documentation:
- [Supplier Form](../../ui-ux/03-entity-forms/supplier-form.md)
- [Supplier List](../../ui-ux/04-list-views/supplier-list.md)
- [Supplier Detail](../../ui-ux/05-detail-pages/supplier-detail.md)
- [INN Dashboard](../../ui-ux/06-dashboards/inn-dashboard.md)

---

## Testing Requirements

### Unit Tests

- Supplier validation rules
- Rating calculation logic
- Contract status transitions
- 3-way invoice matching
- Real-time cost updates

### Integration Tests

- Supplier CRUD with RBAC enforcement
- Contract approval workflow (< and >€50k)
- Invoice approval workflow (various amounts)
- Project cost updates from supplier invoices
- Communication logging

### E2E Tests

1. **Supplier Onboarding:** INN creates supplier → GF approves → Supplier active
2. **RFQ Process:** INN sends RFQ → Receives quotes → Selects winner → Creates contract
3. **Work Execution:** INN assigns supplier to project → PLAN tracks progress → Work completed → Supplier rated
4. **Invoice Processing:** Supplier invoice received → 3-way match → Approved → Paid → Costs updated

---

## Migration & Data Import

### Importing Existing Suppliers

**Source:** Likely Excel spreadsheets, email contacts, business cards

**Import Fields:**
- Company name (required)
- Contact person (name, email, phone)
- Service category (map from free text to enum)
- Past project associations (if traceable)

**Data Cleaning:**
- Deduplicate suppliers (fuzzy name matching)
- Standardize phone numbers
- Validate VAT numbers where present
- Default status: 'PendingApproval' (GF must review)

---

## Related Documents

- [Pre-Mortem Analysis](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification (Danger #3)
- [Material Management Specification](MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) - Related module
- [Financial Data Flow](FINANCIAL_DATA_FLOW.md) - Invoice integration with Lexware
- [INN Persona](../../docs/personas/Persona_INN.md) - Primary user of this module

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Product Team | Initial specification addressing pre-mortem gap |

