import { InventoryUnitOfMeasure, MovementType } from "@kompass/shared";
import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, IsUUID } from "class-validator";

export class CreateInventoryMovementDto {
    @IsUUID()
    materialId: string;

    @IsEnum(MovementType)
    movementType: MovementType;

    @IsNumber()
    quantity: number;

    @IsEnum(InventoryUnitOfMeasure)
    unit: InventoryUnitOfMeasure;

    @IsOptional()
    @IsUUID()
    projectId?: string;

    @IsOptional()
    @IsUUID()
    purchaseOrderId?: string;

    @IsOptional()
    @IsUUID()
    supplierId?: string;

    @IsDateString()
    movementDate: string;

    @IsOptional()
    @IsString()
    locationFrom?: string;

    @IsOptional()
    @IsString()
    locationTo?: string;

    @IsString()
    reason: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    documentReference?: string;
}

export class InventoryStockDto {
    materialId: string;
    materialName: string;
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    stockLocation: string;
    status: string;
}
