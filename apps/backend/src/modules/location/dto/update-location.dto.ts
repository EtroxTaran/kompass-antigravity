/**
 * DTO for updating an existing Location
 *
 * All fields are optional (partial update)
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Length,
  Matches,
  ValidateNested,
  IsArray,
} from 'class-validator';

import { LocationType } from '@kompass/shared/types/enums';

import { AddressDto } from './create-location.dto';

/**
 * Update Location DTO
 */
export class UpdateLocationDto {
  @ApiProperty({
    description: 'Descriptive name for the location',
    example: 'Filiale München Süd (Hauptfiliale)',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message:
      'Location name can only contain letters, numbers, and basic punctuation',
  })
  locationName?: string;

  @ApiProperty({
    description: 'Type of location',
    enum: LocationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @ApiProperty({
    description: 'Delivery address for this location',
    type: () => AddressDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress?: AddressDto;

  @ApiProperty({
    description: 'Whether the location is currently operational',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Primary contact person ID for this location',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryContactPersonId?: string;

  @ApiProperty({
    description: 'Array of contact person IDs assigned to this location',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contactPersons?: string[];

  @ApiProperty({
    description: 'Special delivery instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  deliveryNotes?: string;

  @ApiProperty({
    description: 'Operating hours',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  openingHours?: string;

  @ApiProperty({
    description: 'Parking and access instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  parkingInstructions?: string;
}
