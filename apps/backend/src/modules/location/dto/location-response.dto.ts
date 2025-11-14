/**
 * Response DTO for Location entity
 *
 * Returns full Location data to API consumers
 */

import { ApiProperty } from '@nestjs/swagger';

import { Address } from '@kompass/shared/types/common/address';
import { LocationType } from '@kompass/shared/types/enums';

/**
 * Address response DTO
 */
export class AddressResponseDto {
  @ApiProperty()
  street!: string;

  @ApiProperty({ required: false })
  streetNumber?: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty()
  zipCode!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty()
  country!: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;
}

/**
 * Location Response DTO
 */
export class LocationResponseDto {
  @ApiProperty({
    description: 'Location ID',
    example: 'location-67890',
  })
  _id!: string;

  @ApiProperty({
    description: 'CouchDB revision',
    example: '1-abc123',
  })
  _rev!: string;

  @ApiProperty({
    description: 'Document type',
    example: 'location',
  })
  type!: 'location';

  @ApiProperty({
    description: 'Parent customer ID',
    example: 'customer-12345',
  })
  customerId!: string;

  @ApiProperty({
    description: 'Location name',
    example: 'Filiale München Süd',
  })
  locationName!: string;

  @ApiProperty({
    description: 'Location type',
    enum: LocationType,
    example: LocationType.BRANCH,
  })
  locationType!: LocationType;

  @ApiProperty({
    description: 'Operational status',
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Delivery address',
    type: AddressResponseDto,
  })
  deliveryAddress!: Address;

  @ApiProperty({
    description: 'Primary contact person ID',
    required: false,
  })
  primaryContactPersonId?: string;

  @ApiProperty({
    description: 'Array of contact person IDs',
    type: [String],
  })
  contactPersons!: string[];

  @ApiProperty({
    description: 'Delivery notes',
    required: false,
  })
  deliveryNotes?: string;

  @ApiProperty({
    description: 'Opening hours',
    required: false,
  })
  openingHours?: string;

  @ApiProperty({
    description: 'Parking instructions',
    required: false,
  })
  parkingInstructions?: string;

  @ApiProperty({
    description: 'Created by user ID',
  })
  createdBy!: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last modified by user ID',
  })
  modifiedBy!: string;

  @ApiProperty({
    description: 'Last modification timestamp',
  })
  modifiedAt!: Date;

  @ApiProperty({
    description: 'Version number',
  })
  version!: number;
}

/**
 * Paginated location list response
 */
export class LocationListResponseDto {
  @ApiProperty({
    description: 'Location data',
    type: [LocationResponseDto],
  })
  data!: LocationResponseDto[];

  @ApiProperty({
    description: 'Total count',
  })
  total!: number;

  @ApiProperty({
    description: 'Current page',
  })
  page!: number;

  @ApiProperty({
    description: 'Items per page',
  })
  limit!: number;
}
