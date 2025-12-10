import { BaseEntity } from "./base";
// Actually UnitOfMeasure is not in rfq-dtos usually, it was in the spec. Let's define it here to be safe and independent or check later.
// Spec says UnitOfMeasure enum. Let's define it to match spec.

export enum InventoryUnitOfMeasure {
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

export enum MovementType {
    PURCHASE_RECEIPT = "purchase_receipt", // Incoming from supplier
    PROJECT_ALLOCATION = "project_allocation", // Allocated to project
    RETURN_TO_SUPPLIER = "return_to_supplier", // Returned
    INVENTORY_ADJUSTMENT = "inventory_adjustment", // Correction
    WRITE_OFF = "write_off", // Damaged/lost
    TRANSFER = "transfer", // Between locations
}

export interface InventoryMovement extends BaseEntity {
    type: "inventory_movement";

    materialId: string; // Required
    movementType: MovementType; // Required
    quantity: number; // Required (positive = in, negative = out)
    unit: InventoryUnitOfMeasure;

    // Context
    projectId?: string; // If allocated to project
    purchaseOrderId?: string; // If from PO receipt
    supplierId?: string; // If incoming from supplier

    // Tracking
    movementDate: string; // Required (ISO date)
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
}

export interface CreateInventoryMovementDto {
    materialId: string;
    movementType: MovementType;
    quantity: number;
    unit: InventoryUnitOfMeasure;
    projectId?: string;
    purchaseOrderId?: string;
    supplierId?: string;
    movementDate: string;
    locationFrom?: string;
    locationTo?: string;
    reason: string;
    notes?: string;
    documentReference?: string;
}
