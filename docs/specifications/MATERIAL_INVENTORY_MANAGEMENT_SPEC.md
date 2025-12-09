# Material & Inventory Management Specification

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Status:** Planned for Phase 1 - MVP  
**Owner:** Product & Engineering Team  
**Priority:** CRITICAL - Addresses Pre-Mortem Danger #3

---

## Executive Summary

**Why This Module is Critical:**

The pre-mortem analysis identified the **complete absence of Material & Inventory Management** as a fatal gap alongside supplier management. The Ladenbau business revolves around procuring and installing physical goods—shelving, lighting, furniture, fixtures.

**Without this module:**

- KALK cannot accurately estimate project costs (missing material price database)
- PLAN cannot track what materials are needed or ordered for projects
- Real-time project cost tracking is impossible (material costs are 40-50% of project value)
- INN cannot manage procurement efficiently
- Budget overruns go undetected until too late

**This module enables:**

- Accurate cost estimation using live material pricing
- Real-time project budget tracking (estimated vs. actual material costs)
- Efficient procurement workflow (material requirements → purchase orders → delivery tracking)
- Supplier price comparison for cost optimization
- Inventory visibility for commonly used items

---

## Domain Model

### Material Entity

```typescript
interface Material extends BaseEntity {
  _id: string; // "material-{uuid}"
  _rev: string;
  type: "material";

  // Basic Information
  materialCode: string; // Required, unique, e.g., "MAT-LED-001"
  materialName: string; // Required, 5-200 chars
  description: string; // Required, 20-1000 chars
  category: MaterialCategory; // Required
  subcategory?: string; // Optional, free text

  // Specifications
  unit: UnitOfMeasure; // Required: "Stück", "m²", "lfm", "kg", "Paket"
  dimensions?: MaterialDimensions; // Optional
  color?: string; // Optional
  finish?: string; // Optional: "Matt", "Glänzend", "Gebürstet"
  material?: string; // Optional: "Holz", "Metall", "Glas", "Kunststoff"
  weight?: number; // kg, optional

  // Catalog Information
  manufacturerSKU?: string; // Manufacturer's product code
  manufacturerName?: string;
  productLine?: string; // e.g., "IKEA BESTÅ Serie"
  eanCode?: string; // Barcode (EAN-13)

  // Pricing (Multi-Supplier)
  supplierPrices: SupplierPrice[]; // Pricing from multiple suppliers
  averagePrice: number; // Calculated: average of active supplier prices
  lowestPrice: number; // Calculated: min of active supplier prices
  lastPriceUpdate: Date; // Last time any price was updated

  // Inventory (Phase 2 - optional for Phase 1)
  trackInventory: boolean; // Whether to track stock levels
  currentStock?: number; // Current quantity in stock
  minimumStock?: number; // Reorder threshold
  maximumStock?: number; // Storage capacity limit
  stockLocation?: string; // Warehouse location

  // Usage Statistics
  timesUsed: number; // Count of project material requirements
  lastUsedDate?: Date; // Most recent project usage
  averageQuantityPerProject: number; // Calculated

  // Status
  status: "Active" | "Discontinued" | "OutOfStock";
  discontinuedReason?: string; // Why discontinued
  alternativeMaterialId?: string; // Replacement material

  // Documents
  datasheet?: Document; // Technical specifications PDF
  installationGuide?: Document;
  images?: Document[]; // Product photos (max 5)

  // Metadata
  tags: string[]; // Searchable tags
  internalNotes?: string; // Notes for internal team

  // Audit Trail
  createdBy: string; // Usually KALK or INN
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

enum MaterialCategory {
  // Shelving & Display
  SHELVING = "shelving", // Regale
  DISPLAY_UNITS = "display_units", // Präsentationsvitrinen
  COUNTERS = "counters", // Theken

  // Furniture
  SEATING = "seating", // Sitzmöbel
  TABLES = "tables", // Tische
  STORAGE = "storage", // Lagermöbel

  // Lighting
  CEILING_LIGHTS = "ceiling_lights", // Deckenleuchten
  SPOT_LIGHTS = "spot_lights", // Strahler
  LED_STRIPS = "led_strips", // LED-Bänder
  SIGNAGE_LIGHTS = "signage_lights", // Leuchtschriften

  // Fixtures & Fittings
  DOOR_HANDLES = "door_handles", // Türgriffe
  HOOKS_RAILS = "hooks_rails", // Haken & Leisten
  SIGNAGE = "signage", // Beschilderung
  MIRRORS = "mirrors", // Spiegel

  // Raw Materials
  WOOD = "wood", // Holzmaterialien
  METAL = "metal", // Metallmaterialien
  GLASS = "glass", // Glas
  PLASTIC = "plastic", // Kunststoff

  // Electrical & Plumbing
  ELECTRICAL_COMPONENTS = "electrical_components", // Elektrik
  PLUMBING_FIXTURES = "plumbing_fixtures", // Sanitär
  HVAC_COMPONENTS = "hvac_components", // Heizung/Klima

  // Flooring & Walls
  FLOORING = "flooring", // Bodenbeläge
  WALL_PANELS = "wall_panels", // Wandverkleidungen
  TILES = "tiles", // Fliesen

  // Other
  TOOLS = "tools", // Werkzeuge
  CONSUMABLES = "consumables", // Verbrauchsmaterialien
  OTHER = "other",
}

enum UnitOfMeasure {
  PIECE = "piece", // Stück
  SQUARE_METER = "square_meter", // m²
  LINEAR_METER = "linear_meter", // lfm (laufende Meter)
  CUBIC_METER = "cubic_meter", // m³
  KILOGRAM = "kilogram", // kg
  LITER = "liter", // l
  PACKAGE = "package", // Paket/Karton
  SET = "set", // Set
  HOUR = "hour", // Stunde (for labor-like materials)
}

interface MaterialDimensions {
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  diameter?: number; // cm
  unit: "cm" | "mm" | "m";
}

interface SupplierPrice {
  supplierId: string; // Reference to Supplier
  supplierName: string; // Denormalized for quick display
  unitPrice: number; // € per unit
  currency: "EUR"; // Future: support other currencies
  minimumOrderQuantity: number; // MOQ
  bulkDiscounts?: BulkDiscount[]; // Optional volume discounts
  leadTimeDays: number; // Delivery time in days
  lastUpdated: Date; // When price was last updated
  isPreferred: boolean; // Preferred supplier for this material
  notes?: string; // Price conditions, terms
}

interface BulkDiscount {
  quantityFrom: number; // e.g., 10
  discountPercentage: number; // e.g., 5% off
  unitPrice: number; // Calculated: base price * (1 - discount%)
}
```

### ProjectMaterialRequirement Entity

```typescript
interface ProjectMaterialRequirement extends BaseEntity {
  _id: string; // "project-material-{uuid}"
  _rev: string;
  type: "project_material_requirement";

  // Assignment
  projectId: string; // Required
  materialId: string; // Required

  // Requirement Details
  phase: ProjectPhase; // When material is needed
  workPackage?: string; // Which work package uses this
  description?: string; // Usage notes

  // Quantity
  estimatedQuantity: number; // Required, from KALK estimate
  actualQuantity?: number; // Updated after procurement
  unit: UnitOfMeasure; // From Material

  // Pricing
  estimatedUnitPrice: number; // From KALK estimate (from material.averagePrice)
  actualUnitPrice?: number; // Updated after purchase
  estimatedTotalCost: number; // estimatedQuantity * estimatedUnitPrice
  actualTotalCost?: number; // actualQuantity * actualUnitPrice

  // Procurement
  supplierId?: string; // Which supplier provides this
  purchaseOrderId?: string; // Link to PO when ordered
  orderedDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryStatus: DeliveryStatus;

  // Inventory (Phase 2)
  allocatedFromStock?: boolean; // True if taken from inventory vs. ordered
  stockLocationId?: string; // If from stock, which location

  // Status
  requirementStatus: RequirementStatus;

  // Audit Trail
  createdBy: string; // KALK (estimate) or PLAN (requirement)
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

enum ProjectPhase {
  PLANNING = "planning", // Pre-construction
  PREPARATION = "preparation", // Site prep
  CONSTRUCTION = "construction", // Main build
  INSTALLATION = "installation", // Fixture installation
  FINISHING = "finishing", // Final touches
  HANDOVER = "handover", // Client delivery
}

enum DeliveryStatus {
  NOT_ORDERED = "not_ordered",
  ORDERED = "ordered",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  DELAYED = "delayed",
  CANCELLED = "cancelled",
}

enum RequirementStatus {
  ESTIMATED = "estimated", // From KALK estimate
  CONFIRMED = "confirmed", // PLAN confirmed need
  ORDERED = "ordered", // PO placed
  DELIVERED = "delivered", // Received on-site
  INSTALLED = "installed", // Used in project
  RETURNED = "returned", // Excess returned to supplier
}
```

### PurchaseOrder Entity

```typescript
interface PurchaseOrder extends BaseEntity {
  _id: string; // "purchase-order-{uuid}"
  _rev: string;
  type: "purchase_order";

  // PO Basics
  poNumber: string; // Required, unique, "PO-2025-00234"
  projectId: string; // Required
  supplierId: string; // Required

  // Requester
  requestedBy: string; // User ID (PLAN or INN)
  requestedDate: Date;
  requiredByDate: Date; // When materials needed on-site

  // Line Items
  lineItems: PurchaseOrderLineItem[]; // Required, min 1

  // Financial
  subtotal: number; // Calculated from line items
  taxRate: number; // Usually 19%
  taxAmount: number; // Calculated
  shippingCost?: number; // Optional
  totalAmount: number; // subtotal + tax + shipping

  // Approval (based on amount)
  approvalRequired: boolean; // True if >€10k
  approvedBy?: string; // BUCH or GF
  approvedAt?: Date;
  rejectionReason?: string;

  // Order Execution
  orderDate?: Date; // When sent to supplier
  orderMethod: "Email" | "Phone" | "Portal" | "Fax";
  orderConfirmationNumber?: string; // Supplier's confirmation ref

  // Delivery
  expectedDeliveryDate?: Date; // From supplier
  actualDeliveryDate?: Date;
  deliveryAddress: Address; // Project site or warehouse
  deliveryNotes?: string;
  partialDeliveriesAllowed: boolean;

  // Status
  poStatus: POStatus;

  // Documents
  poDocument?: Document; // Generated PO PDF
  supplierConfirmation?: Document; // Supplier order confirmation
  deliveryNote?: Document; // Lieferschein

  // Payment
  invoiceReceived: boolean;
  supplierInvoiceId?: string; // Link to SupplierInvoice entity

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}

enum POStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval", // >€10k
  APPROVED = "approved",
  SENT_TO_SUPPLIER = "sent_to_supplier",
  CONFIRMED_BY_SUPPLIER = "confirmed_by_supplier",
  PARTIALLY_DELIVERED = "partially_delivered",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

interface PurchaseOrderLineItem {
  materialId: string; // Link to Material
  materialName: string; // Denormalized
  materialCode: string; // Denormalized
  description: string; // From material or custom

  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number; // € per unit (from supplier quote or material price)
  netAmount: number; // quantity * unitPrice
  taxRate: number; // Usually 19%

  projectMaterialReqId?: string; // Link back to ProjectMaterialRequirement

  // Delivery tracking per line item
  deliveredQuantity?: number;
  deliveryDate?: Date;
  deliveryStatus: DeliveryStatus;
}
```

### InventoryMovement Entity (Phase 2)

```typescript
interface InventoryMovement extends BaseEntity {
  _id: string; // "inventory-movement-{uuid}"
  _rev: string;
  type: "inventory_movement";

  materialId: string; // Required
  movementType: MovementType; // Required
  quantity: number; // Required (positive = in, negative = out)
  unit: UnitOfMeasure;

  // Context
  projectId?: string; // If allocated to project
  purchaseOrderId?: string; // If from PO receipt
  supplierId?: string; // If incoming from supplier

  // Tracking
  movementDate: Date; // Required
  locationFrom?: string; // Warehouse location
  locationTo?: string; // Project site or different warehouse

  // Financial
  unitCost?: number; // € for valuation
  totalCost?: number; // quantity * unitCost

  // Details
  reason: string; // Required, e.g., "Lieferung PO-2025-234"
  notes?: string;
  documentReference?: string; // Delivery note, usage report

  // Audit Trail
  recordedBy: string; // User who recorded movement
  recordedAt: Date;
}

enum MovementType {
  PURCHASE_RECEIPT = "purchase_receipt", // Incoming from supplier
  PROJECT_ALLOCATION = "project_allocation", // Allocated to project
  RETURN_TO_SUPPLIER = "return_to_supplier", // Returned
  INVENTORY_ADJUSTMENT = "inventory_adjustment", // Correction
  WRITE_OFF = "write_off", // Damaged/lost
  TRANSFER = "transfer", // Between locations
}
```

---

## RBAC Permissions

### Permission Matrix

| Role     | Material (CRUD)           | PurchaseOrder (Create/Approve) | Inventory (Manage)        | Price (Update) |
| -------- | ------------------------- | ------------------------------ | ------------------------- | -------------- |
| **INN**  | Full CRUD                 | Create, View                   | Full management (Phase 2) | Update prices  |
| **PLAN** | Read, Create requirements | Create (≤€10k)                 | View                      | View           |
| **KALK** | Read, Create catalog      | View                           | View                      | Update prices  |
| **BUCH** | Read                      | Approve (>€10k)                | View                      | View           |
| **ADM**  | Read (limited)            | -                              | -                         | -              |
| **GF**   | Full CRUD                 | Approve (>€10k)                | View all                  | View           |

### Business Rules

**MAT-001:** Material catalog is shared resource

- Any authenticated user can read materials
- KALK and INN can add new materials
- Only INN/GF can discontinue materials

**MAT-002:** Purchase Order approval workflow

- POs ≤€1k: Auto-approved
- POs €1k-€10k: Require BUCH approval
- POs >€10k: Require GF approval
- POs >€50k: Require GF + BUCH pre-approval

**MAT-003:** Project material requirements

- KALK creates initial requirements during estimate
- PLAN confirms/adjusts requirements during planning
- INN procures based on confirmed requirements
- Actual quantities/costs update project budget real-time

**MAT-004:** Price update frequency

- INN or KALK update prices when quotes received
- System flags materials with price updates >6 months old
- Automatic price trend indicators (Phase 2: ↑↓→)

**MAT-005:** Multi-supplier pricing

- Materials can have prices from multiple suppliers
- System shows: lowest, average, preferred supplier
- KALK uses preferred supplier price for estimates
- INN selects supplier based on price, lead time, relationship

---

## Core Workflows

### Workflow 1: Material Catalog Creation

**Actors:** KALK (primary), INN (procurement)

**Steps:**

1. **Material Discovery (KALK)**
   - During estimate preparation, KALK identifies needed material
   - KALK searches catalog: Not found
   - KALK clicks: "+ Neues Material erfassen"

2. **Create Material Record (KALK)**
   - Enter: Name, description, category, unit
   - Enter: Specifications (dimensions, color, finish, material type)
   - Enter: Manufacturer info (SKU, name, product line)
   - Upload: Datasheet, images
   - Enter: Initial pricing (from supplier quote or online research)
   - Create supplier price entry: Supplier, unit price, MOQ, lead time
   - Save: Status = 'Active'

3. **Material Available**
   - Material now in searchable catalog
   - Available for use in estimates
   - Available for project requirements

**Edge Cases:**

- **Duplicate detection (Phase 2):** System checks for similar materials by name
- **Multiple suppliers:** KALK can add pricing from 2-3 suppliers for comparison
- **Missing info:** KALK can save with minimal info, INN enriches later

### Workflow 2: Project Material Planning (BOM Creation)

**Actors:** KALK (estimate), PLAN (confirmation), INN (procurement)

**Steps:**

1. **Initial BOM (KALK during Estimate)**
   - KALK creating offer for opportunity
   - KALK searches material catalog for needed items
   - KALK adds material to BOM:
     - Select material, enter quantity
     - System: Auto-fills unit price (from preferred supplier or average)
     - System: Calculates total cost
   - KALK reviews total material cost
   - Material cost included in offer total

2. **Offer Accepted → Project Created**
   - System: Copies BOM from offer to project
   - System: Creates ProjectMaterialRequirement for each material
   - Status: 'Estimated'

3. **Material Requirement Confirmation (PLAN)**
   - PLAN reviews project materials
   - PLAN adjusts quantities based on final site measurements
   - PLAN adds missing materials discovered during planning
   - PLAN assigns materials to project phases (Planning, Preparation, Construction, etc.)
   - PLAN marks requirements: Status = 'Confirmed'

4. **Procurement Triggered (INN)**
   - INN views confirmed material requirements
   - INN groups materials by: Supplier, delivery date
   - INN creates purchase orders (next workflow)

**Edge Cases:**

- **Material not in catalog:** KALK creates on-the-fly during estimate
- **Quantity changes:** PLAN updates, system recalculates project budget
- **Material substitution:** PLAN selects alternative material, system tracks variance

### Workflow 3: Purchase Order Creation & Approval

**Actors:** INN (creator), PLAN (requester), BUCH (approver for mid-range), GF (approver for high-value)

**Steps:**

1. **PO Initiation (INN)**
   - INN views project material requirements with status = 'Confirmed'
   - INN filters by: Not yet ordered, needed by date
   - INN selects materials for single PO (same supplier recommended)
   - System: Pre-fills supplier info, project info

2. **PO Line Items (INN)**
   - For each material:
     - Material: Auto-filled from requirement
     - Quantity: Auto-filled from requirement
     - Unit price: Auto-filled from supplier price (or INN enters current quote)
     - System: Calculates net amount
   - INN can adjust quantities (if ordering extra for stock)
   - INN adds: Shipping cost (if applicable)
   - System: Calculates total

3. **Delivery Details (INN)**
   - Delivery address: Project site (default) or warehouse
   - Required by date: From PLAN's phase schedule
   - Delivery notes: Special instructions
   - Contact on-site: PLAN user or site contact

4. **Approval Routing**
   - System: Checks total amount
   - If ≤€1k: Status = 'Approved' (auto), skip to step 6
   - If €1k-€10k: Route to BUCH for approval
   - If >€10k: Route to GF for approval

5. **Approval Decision (BUCH or GF)**
   - Reviewer checks: Budget available, pricing reasonable, materials needed
   - Reviewer can: Approve, Reject (with reason), Request changes
   - If approved: Status = 'Approved'
   - If rejected: INN notified, revises PO

6. **Send to Supplier (INN)**
   - System: Generates PO PDF (company letterhead, line items, terms)
   - INN sends PO via: Email (default), phone order, supplier portal
   - INN marks: orderDate, orderMethod
   - Status: 'SentToSupplier'

7. **Supplier Confirmation**
   - Supplier replies with: Order confirmation, expected delivery date
   - INN logs: Confirmation number, expected delivery date
   - INN uploads: Supplier confirmation PDF
   - Status: 'ConfirmedBySupplier'

**Edge Cases:**

- **Urgent PO:** INN can request expedited approval (GF notification)
- **Price change:** If supplier quotes higher, INN revises PO, re-approval may be needed
- **Supplier unavailable:** INN selects alternative supplier, revises PO
- **Partial order:** Supplier can only fulfill partial quantity, INN decides: split or cancel

### Workflow 4: Material Delivery & Project Cost Update

**Actors:** INN (receiver), PLAN (site contact)

**Steps:**

1. **Delivery Arrival**
   - Materials arrive at project site or warehouse
   - INN or PLAN receives delivery note (Lieferschein)
   - INN opens PO in system

2. **Delivery Verification (INN)**
   - For each line item:
     - Check delivered quantity vs. ordered quantity
     - Check condition: damaged, correct item, correct specs
     - Enter: Delivered quantity, delivery date
   - Upload: Delivery note PDF, photos if damaged

3. **Delivery Confirmation**
   - If full delivery: PO status = 'Delivered'
   - If partial: PO status = 'PartiallyDelivered', remaining items = 'InTransit' or 'Delayed'
   - System: Updates ProjectMaterialRequirement.actualQuantity
   - System: Updates deliveryStatus per material

4. **Project Cost Update (Real-Time)**
   - System: Calculates actual material cost from delivered quantities \* actual unit prices
   - System: Updates Project.actualMaterialCosts
   - System: Updates Project.actualCost = labor + materials + suppliers
   - System: Recalculates Project.currentMargin
   - System: Updates Project.budgetStatus (OnTrack / Warning / Exceeded)

5. **Budget Alert (if applicable)**
   - If actualCost > budget \* 0.90: Notify PLAN, BUCH (Warning)
   - If actualCost > budget: Notify PLAN, BUCH, GF (Exceeded)
   - Alert shows: Project, budget %, variance amount

**Edge Cases:**

- **Damaged goods:** INN marks items damaged, initiates return/replacement
- **Wrong item:** INN disputes delivery, contacts supplier
- **Quantity mismatch:** INN adjusts, may trigger additional PO
- **Delivery delayed:** INN updates expected date, alerts PLAN if impacts schedule

### Workflow 5: Material Price Comparison & Optimization

**Actors:** KALK (estimator), INN (procurement)

**Steps:**

1. **Multi-Supplier Pricing Entry (INN or KALK)**
   - For a material, INN has quotes from 3 suppliers
   - INN enters price for each supplier:
     - Supplier, unit price, MOQ, lead time, bulk discounts
   - System: Calculates average price
   - System: Identifies lowest price supplier

2. **Price Comparison View (KALK)**
   - KALK preparing estimate, needs material
   - KALK searches material catalog
   - Material card shows:
     - "€ 145 (Durchschnitt)"
     - "€ 138-€ 152 (3 Lieferanten)"
     - "Günstigster: Holzgroßhandel Weber (€ 138)"
     - "Bevorzugt: Schreinerei Müller (€ 145)" - based on relationship
   - KALK clicks: "Preise vergleichen"

3. **Price Comparison Table**
   - Table shows all supplier prices:
     | Lieferant | Preis/Einheit | MOQ | Lieferzeit | Bewertung | |
     |-----------|---------------|-----|------------|-----------|---|
     | Weber KG | € 138 | 10 Stk | 7 Tage | ⭐⭐⭐⭐☆ 4.0 | [Wählen] |
     | Müller GmbH | € 145 | 5 Stk | 14 Tage | ⭐⭐⭐⭐⭐ 4.8 | [Wählen] ⭐ |
     | Schmidt | € 152 | 1 Stk | 3 Tage | ⭐⭐⭐☆☆ 3.5 | [Wählen] |
   - Star icon: Preferred supplier
   - KALK selects supplier for estimate
   - INN selects supplier for actual procurement

4. **Price Selection**
   - KALK: Uses preferred or lowest price for estimate
   - INN: Balances price, quality (rating), and lead time
   - System: Records which supplier selected for procurement

**Edge Cases:**

- **Price outdated:** System flags prices >6 months old (amber warning)
- **Supplier no longer stocks:** INN marks price inactive, contact supplier
- **Bulk discount threshold:** System shows savings if ordering larger quantity

### Workflow 6: Inventory Management (Phase 2)

**Actors:** INN (stock manager)

**Steps:**

1. **Stock Receipt**
   - Materials delivered to warehouse (not project site)
   - INN records receipt: Material, quantity, supplier, PO reference
   - System: Creates InventoryMovement (type = PurchaseReceipt)
   - System: Updates Material.currentStock

2. **Stock Allocation to Project**
   - PLAN requests material from stock for project
   - INN allocates stock: Select material, quantity, project
   - System: Creates InventoryMovement (type = ProjectAllocation)
   - System: Updates Material.currentStock
   - System: Updates ProjectMaterialRequirement (allocated from stock)

3. **Stock Level Monitoring**
   - System: Checks currentStock vs. minimumStock daily
   - If currentStock < minimumStock: Alert INN "Nachbestellung erforderlich"
   - INN creates PO to restock

4. **Stock Valuation**
   - System: Calculates total inventory value (sum of currentStock \* averagePrice)
   - Shown on INN dashboard
   - Monthly inventory report for BUCH

**Edge Cases:**

- **Stock discrepancy:** INN performs physical count, adjusts with InventoryMovement (type = Adjustment)
- **Damaged stock:** INN writes off with InventoryMovement (type = WriteOff)
- **Return to supplier:** INN records return, credits project

---

## API Endpoints

### Material Catalog

```
POST   /api/v1/materials
  Body: CreateMaterialDto
  Auth: KALK, INN, PLAN
  Returns: MaterialResponseDto
  Description: Create new material in catalog

GET    /api/v1/materials
  Query: ?category=shelving&search=regal&status=Active
  Auth: All authenticated users
  Returns: MaterialResponseDto[]
  Description: Search material catalog

GET    /api/v1/materials/:id
  Auth: All authenticated users
  Returns: MaterialResponseDto
  Description: Get material details with all supplier prices

PUT    /api/v1/materials/:id
  Body: UpdateMaterialDto
  Auth: INN, KALK, GF
  Returns: MaterialResponseDto
  Description: Update material details

POST   /api/v1/materials/:id/supplier-prices
  Body: AddSupplierPriceDto { supplierId, unitPrice, moq, leadTime }
  Auth: INN, KALK
  Returns: MaterialResponseDto
  Description: Add or update supplier pricing

DELETE /api/v1/materials/:id
  Auth: GF only
  Returns: 204 No Content
  Description: Soft delete (sets status = Discontinued)
```

### Project Material Requirements

```
POST   /api/v1/projects/:projectId/material-requirements
  Body: CreateMaterialRequirementDto
  Auth: KALK (estimate), PLAN (planning)
  Returns: ProjectMaterialRequirementDto
  Description: Add material to project BOM

GET    /api/v1/projects/:projectId/material-requirements
  Query: ?phase=construction&status=confirmed
  Auth: PLAN, INN, KALK, BUCH
  Returns: ProjectMaterialRequirementDto[]
  Description: Get project BOM

PUT    /api/v1/projects/:projectId/material-requirements/:id
  Body: UpdateMaterialRequirementDto
  Auth: PLAN, INN
  Returns: ProjectMaterialRequirementDto
  Description: Update quantities, prices, status

PUT    /api/v1/projects/:projectId/material-requirements/:id/confirm
  Auth: PLAN
  Returns: ProjectMaterialRequirementDto
  Description: Confirm requirement (estimated → confirmed)

GET    /api/v1/projects/:projectId/material-costs
  Auth: PLAN, KALK, BUCH, GF
  Returns: ProjectMaterialCostSummaryDto
  Description: Get material cost summary (estimated vs. actual)
```

### Purchase Orders

```
POST   /api/v1/purchase-orders
  Body: CreatePurchaseOrderDto
  Auth: INN, PLAN
  Returns: PurchaseOrderDto
  Description: Create PO (status = Draft or PendingApproval based on amount)

GET    /api/v1/purchase-orders
  Query: ?projectId=xxx&status=PendingApproval&supplierId=yyy
  Auth: INN, PLAN, BUCH, GF
  Returns: PurchaseOrderDto[]
  Description: List purchase orders

GET    /api/v1/purchase-orders/:id
  Auth: INN, PLAN, BUCH, GF
  Returns: PurchaseOrderDto
  Description: Get PO details

PUT    /api/v1/purchase-orders/:id/approve
  Auth: BUCH (for ≤€10k), GF (for >€10k)
  Returns: PurchaseOrderDto
  Description: Approve PO

PUT    /api/v1/purchase-orders/:id/send
  Body: { orderMethod: string, orderDate: Date }
  Auth: INN
  Returns: PurchaseOrderDto
  Description: Mark PO as sent to supplier

PUT    /api/v1/purchase-orders/:id/receive-delivery
  Body: { lineItems: [{ materialId, deliveredQuantity, deliveryDate }] }
  Auth: INN
  Returns: PurchaseOrderDto
  Description: Record delivery, updates project costs real-time
```

### Inventory Management (Phase 2)

```
GET    /api/v1/inventory/stock-levels
  Query: ?materialId=xxx&location=warehouse
  Auth: INN, PLAN, KALK
  Returns: InventoryStockDto[]
  Description: Get current stock levels

POST   /api/v1/inventory/movements
  Body: CreateInventoryMovementDto
  Auth: INN
  Returns: InventoryMovementDto
  Description: Record stock movement

GET    /api/v1/inventory/low-stock-alerts
  Auth: INN
  Returns: LowStockAlertDto[]
  Description: Get materials below minimum stock level
```

---

## Validation Rules

### Material Validation

```typescript
// materialName validation
- Required: true
- Min length: 5
- Max length: 200
- Pattern: /^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()\/]+$/
- Error: "Materialname ist erforderlich (5-200 Zeichen)"

// description validation
- Required: true
- Min length: 20
- Max length: 1000
- Error: "Materialbeschreibung erforderlich (20-1000 Zeichen)"

// category validation
- Required: true
- Enum: MaterialCategory
- Error: "Materialkategorie ist erforderlich"

// unit validation
- Required: true
- Enum: UnitOfMeasure
- Error: "Mengeneinheit ist erforderlich"

// supplierPrices validation
- Required: At least 1 supplier price
- Each price:
  - unitPrice: Min 0.01, Max 1000000
  - minimumOrderQuantity: Min 1
  - leadTimeDays: Min 0, Max 365
- Error: "Mindestens ein Lieferant mit Preis erforderlich"
```

### Purchase Order Validation

```typescript
// lineItems validation
- Required: true
- Array length: Min 1, Max 50
- Error: "PO muss mindestens 1 Position enthalten"

// totalAmount validation
- Must equal: subtotal + taxAmount + (shippingCost || 0)
- Tolerance: ±0.01
- Error: "PO-Gesamtbetrag stimmt nicht überein"

// requiredByDate validation
- Required: true
- Min: today
- Max: project.plannedEndDate
- Error: "Lieferdatum muss zwischen heute und Projektende liegen"

// Approval validation (MAT-002)
- If totalAmount > 10000 AND approvedBy == null:
  - Error: "POs über €10k erfordern GF-Freigabe"

- If totalAmount > 50000 AND (!gfApproved OR !buchReviewed):
  - Error: "POs über €50k erfordern GF + BUCH Freigabe"
```

---

## Business Logic

### Real-Time Project Cost Calculation

```typescript
async function updateProjectMaterialCosts(
  projectId: string,
  deliveredMaterial: PurchaseOrderLineItem,
): Promise<void> {
  // When PO delivery is recorded, update project costs immediately

  const project = await projectRepository.findById(projectId);
  const requirement = await materialReqRepository.findById(
    deliveredMaterial.projectMaterialReqId,
  );

  // Update requirement with actual quantities/costs
  requirement.actualQuantity = deliveredMaterial.deliveredQuantity;
  requirement.actualUnitPrice = deliveredMaterial.unitPrice;
  requirement.actualTotalCost =
    requirement.actualQuantity * requirement.actualUnitPrice;
  requirement.requirementStatus = "Delivered";
  await materialReqRepository.update(requirement);

  // Recalculate project material costs (sum all actuals)
  const allRequirements = await materialReqRepository.findByProject(projectId);
  const actualMaterialCosts = allRequirements
    .filter((r) => r.actualTotalCost != null)
    .reduce((sum, r) => sum + r.actualTotalCost, 0);

  // Update project
  project.actualMaterialCosts = actualMaterialCosts;
  project.actualCost =
    project.actualLaborCosts +
    project.actualMaterialCosts +
    project.actualSupplierCosts;
  project.currentMargin =
    ((project.contractValue - project.actualCost) / project.contractValue) *
    100;

  // Update budget status
  if (project.actualCost > project.budget) {
    project.budgetStatus = "Exceeded";
  } else if (project.actualCost > project.budget * 0.9) {
    project.budgetStatus = "Warning";
  }

  await projectRepository.update(project);

  // Trigger alerts if needed
  if (project.budgetStatus !== "OnTrack") {
    await notificationService.send({
      recipients: [project.projectManager, "BUCH"],
      type: "BudgetAlert",
      message: `Projekt ${project.projectNumber}: Material-Budget bei ${percentage}%`,
      link: `/projects/${project.id}/materials`,
    });
  }
}
```

### Estimated vs. Actual Cost Variance

```typescript
interface MaterialCostVariance {
  projectId: string;
  materialId: string;
  materialName: string;
  estimatedQuantity: number;
  actualQuantity: number;
  quantityVariance: number; // actualQuantity - estimatedQuantity
  quantityVariancePercentage: number;

  estimatedUnitPrice: number;
  actualUnitPrice: number;
  priceVariance: number; // actualUnitPrice - estimatedUnitPrice
  priceVariancePercentage: number;

  estimatedTotalCost: number;
  actualTotalCost: number;
  totalVariance: number; // actualTotalCost - estimatedTotalCost
  totalVariancePercentage: number;

  varianceReason?: string; // Why different (user-entered)
}

// Generate variance report for project
function calculateMaterialVariances(projectId: string): MaterialCostVariance[] {
  // Compare all material requirements: estimated vs. actual
  // Flag significant variances (>10%) for KALK review
  // Use for continuous improvement of estimates
}
```

---

## Integration Points

### With Supplier Module

- **Materials ↔ Suppliers:** Many-to-many via SupplierPrice
- **Purchase Orders:** Reference both Material and Supplier
- **Supplier invoices:** Link to material POs for 3-way match

### With Project Module

- **Project ↔ Materials:** Many-to-many via ProjectMaterialRequirement
- **Budget tracking:** Material costs update project budget real-time
- **Phase scheduling:** Materials assigned to project phases appear on Gantt chart

### With Cost Estimation (KALK)

- **Offer line items:** Reference materials from catalog
- **Pricing:** Use material.averagePrice or supplier-specific pricing
- **BOM copy:** Offer acceptance copies BOM to project

### With Financial Module (Lexware)

- **Supplier invoices:** Material-related invoices exported to Lexware
- **Cost allocation:** Material costs by project exported for accounting
- **Inventory valuation (Phase 2):** Monthly inventory report for balance sheet

---

## UI/UX Considerations

See dedicated UI/UX documentation:

- [Material Catalog Form](../../ui-ux/03-entity-forms/material-catalog-form.md)
- [Purchase Order Form](../../ui-ux/03-entity-forms/purchase-order-form.md)
- [Material Catalog List](../../ui-ux/04-list-views/material-catalog.md)
- [Project Materials View](../../ui-ux/05-detail-pages/project-materials.md)
- [INN Dashboard](../../ui-ux/06-dashboards/inn-dashboard.md)

---

## Testing Requirements

### Unit Tests

- Material validation rules
- Price calculation logic (average, lowest, bulk discounts)
- PO line item calculations (net + tax = gross)
- Real-time cost updates
- Budget status determination

### Integration Tests

- Material CRUD with RBAC enforcement
- PO approval workflow (various amounts)
- Delivery recording → project cost update flow
- Supplier price comparison
- Inventory movement tracking (Phase 2)

### E2E Tests

1. **Material Catalog:** KALK creates material → Adds supplier prices → Available in catalog
2. **BOM Creation:** KALK adds materials to offer → Offer accepted → Materials copied to project
3. **Procurement:** INN creates PO from project requirements → BUCH approves → Sent to supplier
4. **Delivery & Cost Update:** INN records delivery → Project costs update real-time → Budget alert if exceeds
5. **Price Comparison:** INN compares 3 supplier prices → Selects lowest → Creates PO

---

## Migration & Data Import

### Importing Existing Material Catalog

**Source:** Likely Excel spreadsheets, supplier catalogs, past estimates

**Import Fields:**

- Material name (required)
- Category (map from free text to enum)
- Unit of measure (standardize)
- Basic pricing (if available)
- Supplier associations (if traceable)

**Data Cleaning:**

- Deduplicate materials (fuzzy name matching)
- Standardize units (m² vs. qm → square_meter)
- Standardize categories
- Default status: 'Active'

---

## Performance Considerations

### Material Search Optimization

**Challenge:** Material catalog may grow to 1000+ items.

**Solution:**

- **Phase 1:** CouchDB Mango queries with indexes on: materialName, category, materialCode
- **Phase 1 Enhancement:** RAG semantic search for material descriptions
- **Phase 2:** MeiliSearch integration for instant autocomplete

### Real-Time Cost Updates

**Challenge:** Delivery recording must update project costs instantly without delay.

**Solution:**

- Optimistic UI: Show updated costs immediately in frontend
- Background sync: Queue cost recalculation, process within 1s
- Notification: Alert PLAN/BUCH after recalculation complete
- Conflict handling: If multiple deliveries recorded simultaneously, last-write-wins with merge

---

## Related Documents

- [Pre-Mortem Analysis](../reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) - Risk identification (Danger #3)
- [Supplier Management Specification](SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Related module
- [Financial Data Flow](FINANCIAL_DATA_FLOW.md) - Invoice integration
- [PLAN Persona](../personas/Persona_PLAN.md) - User of material tracking
- [KALK Persona](../personas/Persona_KALK.md) - User of material pricing

---

## Revision History

| Version | Date       | Author       | Changes                                         |
| ------- | ---------- | ------------ | ----------------------------------------------- |
| 1.0     | 2025-11-12 | Product Team | Initial specification addressing pre-mortem gap |
