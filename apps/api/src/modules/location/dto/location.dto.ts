import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

const locationTypes = [
  'headquarter',
  'branch',
  'warehouse',
  'project_site',
  'other',
] as const;

class AddressDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  street: string;

  @IsString()
  @IsOptional()
  streetNumber?: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @Matches(/^\d{5}$/, { message: 'German postal code must be 5 digits' })
  zipCode: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string = 'Deutschland';

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreateLocationDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  locationName: string;

  @IsEnum(locationTypes, {
    message: `locationType must be one of: ${locationTypes.join(', ')}`,
  })
  locationType: (typeof locationTypes)[number];

  @IsBoolean()
  isActive: boolean;

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
  @MaxLength(500)
  deliveryNotes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  openingHours?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  parkingInstructions?: string;
}

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  locationName?: string;

  @IsEnum(locationTypes, {
    message: `locationType must be one of: ${locationTypes.join(', ')}`,
  })
  @IsOptional()
  locationType?: (typeof locationTypes)[number];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  deliveryAddress?: AddressDto;

  @IsString()
  @IsOptional()
  primaryContactPersonId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contactPersons?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  deliveryNotes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  openingHours?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  parkingInstructions?: string;
}
