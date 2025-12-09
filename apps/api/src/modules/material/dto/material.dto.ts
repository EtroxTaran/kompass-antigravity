import {
    IsString,
    IsOptional,
    IsNumber,
    IsEnum,
    MinLength,
    MaxLength,
    Min,
    IsBoolean,
    ValidateNested,
    IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

const units = ['pc', 'm', 'm2', 'm3', 'kg', 'l'] as const;

/**
 * DTO for supplier-specific pricing information
 */
export class SupplierPriceDto {
    @IsString()
    @MinLength(1)
    supplierId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(200)
    supplierName: string;

    @IsNumber()
    @Min(0.01)
    unitPrice: number;

    @IsNumber()
    @Min(1)
    minimumOrderQuantity: number;

    @IsNumber()
    @Min(0)
    leadTimeDays: number;

    @IsBoolean()
    isPreferred: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    notes?: string;
}

/**
 * DTO for adding a supplier price to an existing material
 */
export class AddSupplierPriceDto {
    @IsString()
    @MinLength(1)
    supplierId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(200)
    supplierName: string;

    @IsNumber()
    @Min(0.01)
    unitPrice: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    minimumOrderQuantity?: number = 1;

    @IsNumber()
    @Min(0)
    @IsOptional()
    leadTimeDays?: number = 14;

    @IsBoolean()
    @IsOptional()
    isPreferred?: boolean = false;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    notes?: string;
}

export class CreateMaterialDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    itemNumber: string;

    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    category: string;

    @IsEnum(units, {
        message: `unit must be one of: ${units.join(', ')}`,
    })
    unit: typeof units[number];

    @IsNumber()
    @Min(0)
    purchasePrice: number;

    @IsString()
    @IsOptional()
    currency?: string = 'EUR';

    @IsString()
    @IsOptional()
    validFrom?: string;

    @IsString()
    @IsOptional()
    preferredSupplierId?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    supplierItemNumber?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    inStock?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SupplierPriceDto)
    @IsOptional()
    supplierPrices?: SupplierPriceDto[];
}

export class UpdateMaterialDto {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(50)
    itemNumber?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(200)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(100)
    category?: string;

    @IsEnum(units, {
        message: `unit must be one of: ${units.join(', ')}`,
    })
    @IsOptional()
    unit?: typeof units[number];

    @IsNumber()
    @Min(0)
    @IsOptional()
    purchasePrice?: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    validFrom?: string;

    @IsString()
    @IsOptional()
    preferredSupplierId?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    supplierItemNumber?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    inStock?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SupplierPriceDto)
    @IsOptional()
    supplierPrices?: SupplierPriceDto[];
}

