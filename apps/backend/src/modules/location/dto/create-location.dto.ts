/**
 * DTO for creating a new Location
 * 
 * Based on API_SPECIFICATION.md and DATA_MODEL_SPECIFICATION.md
 */

import { IsString, IsEnum, IsBoolean, IsOptional, Length, Matches, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationType } from '@kompass/shared/types/enums';

/**
 * Address DTO (nested)
 */
export class AddressDto {
  @ApiProperty({
    description: 'Street name',
    example: 'Lindwurmstraße',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  street: string;

  @ApiProperty({
    description: 'House/building number',
    example: '85',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  streetNumber?: string;

  @ApiProperty({
    description: 'Additional address information',
    example: 'Hintereingang, 2. Stock',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  addressLine2?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '80337',
  })
  @IsString()
  @Matches(/^\d{5}$/, { message: 'German postal code must be 5 digits' })
  zipCode: string;

  @ApiProperty({
    description: 'City name',
    example: 'München',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  city: string;

  @ApiProperty({
    description: 'State/Bundesland',
    example: 'Bayern',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  state?: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Deutschland',
    default: 'Deutschland',
  })
  @IsString()
  @Length(2, 100)
  country: string;

  @ApiProperty({
    description: 'GPS latitude',
    example: 48.1351,
    required: false,
  })
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'GPS longitude',
    example: 11.5820,
    required: false,
  })
  @IsOptional()
  longitude?: number;
}

/**
 * Create Location DTO
 */
export class CreateLocationDto {
  @ApiProperty({
    description: 'Descriptive name for the location',
    example: 'Filiale München Süd',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message: 'Location name can only contain letters, numbers, and basic punctuation',
  })
  locationName: string;

  @ApiProperty({
    description: 'Type of location',
    enum: LocationType,
    example: LocationType.BRANCH,
  })
  @IsEnum(LocationType)
  locationType: LocationType;

  @ApiProperty({
    description: 'Delivery address for this location',
    type: () => AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty({
    description: 'Whether the location is currently operational',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Primary contact person ID for this location',
    example: 'contact-111',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryContactPersonId?: string;

  @ApiProperty({
    description: 'Array of contact person IDs assigned to this location',
    type: [String],
    example: ['contact-111', 'contact-112'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contactPersons?: string[];

  @ApiProperty({
    description: 'Special delivery instructions',
    example: 'Hintereingang nutzen, Parkplatz vorhanden',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  deliveryNotes?: string;

  @ApiProperty({
    description: 'Operating hours',
    example: 'Mo-Fr 8:00-18:00, Sa 9:00-14:00',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  openingHours?: string;

  @ApiProperty({
    description: 'Parking and access instructions',
    example: 'Parkplätze vor dem Gebäude',
    required: false,
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  parkingInstructions?: string;
}

