import { IsString, IsEnum, IsBoolean, IsOptional, ValidateNested, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationType, Address } from '@kompass/shared';

// Duplicate Address DTO here or import common?
// Ideally import common Address DTO if exists. If not, define inline validation or use shared type?
// Shared type is interface. Need class for validation.
// For now, I'll define AddressDto here or rely on IsObject if not strict.
// Better: strictly validate address.

class AddressDto implements Address {
    @IsString()
    street: string;

    @IsString()
    @IsOptional()
    streetNumber?: string;

    @IsString()
    @IsOptional()
    addressLine2?: string;

    @IsString()
    zipCode: string;

    @IsString()
    city: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    country: string;

    @IsOptional()
    latitude?: number;

    @IsOptional()
    longitude?: number;
}

export class CreateLocationDto {
    @IsString()
    customerId: string;

    @IsString()
    locationName: string;

    @IsEnum(['headquarter', 'branch', 'warehouse', 'project_site', 'other']) // String enum validation
    locationType: string;

    @IsBoolean()
    isActive: boolean;

    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    deliveryAddress: AddressDto;

    @IsString()
    @IsOptional()
    primaryContactPersonId?: string;

    @IsArray()
    @IsString({ each: true })
    contactPersons: string[];

    @IsString()
    @IsOptional()
    deliveryNotes?: string;

    @IsString()
    @IsOptional()
    openingHours?: string;

    @IsString()
    @IsOptional()
    parkingInstructions?: string;
}
