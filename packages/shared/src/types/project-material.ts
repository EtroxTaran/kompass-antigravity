import { BaseEntity } from "./base";

export interface ProjectMaterialRequirement extends BaseEntity {
    type: "project-material-requirement";
    projectId: string;

    // Material Details
    materialId?: string; // Optional link to catalog
    description: string; // Copied from material name or custom
    quantity: number;
    unit: string;

    // Status
    status: 'planned' | 'ordered' | 'delivered';

    // Cost Tracking
    estimatedUnitPrice: number;
    estimatedTotalCost: number; // quantity * estimatedUnitPrice

    // Procurement Links
    supplierId?: string;
    sourceOfferId?: string;
    purchaseOrderId?: string;
}
