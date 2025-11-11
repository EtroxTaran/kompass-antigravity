import { ApiProperty } from '@nestjs/swagger';
import { CustomerType, CustomerBusinessType, type CustomerRating } from '@kompass/shared/types/enums';
import type { Address } from '@kompass/shared/types/common/address';
import { Expose, Type } from 'class-transformer';

/**
 * Address response DTO
 */
class AddressResponseDto {
  @ApiProperty({ example: 'Hauptstraße 15' })
  @Expose()
  street: string;

  @ApiProperty({ example: '85', required: false })
  @Expose()
  streetNumber?: string;

  @ApiProperty({ example: '2. Stock', required: false })
  @Expose()
  addressLine2?: string;

  @ApiProperty({ example: '80331' })
  @Expose()
  zipCode: string;

  @ApiProperty({ example: 'München' })
  @Expose()
  city: string;

  @ApiProperty({ example: 'Bayern' })
  @Expose()
  state?: string;

  @ApiProperty({ example: 'Deutschland' })
  @Expose()
  country: string;

  @ApiProperty({ example: 48.1351, required: false })
  @Expose()
  latitude?: number;

  @ApiProperty({ example: 11.5820, required: false })
  @Expose()
  longitude?: number;
}

/**
 * Response DTO for Customer
 * 
 * Filters fields based on user role (RBAC)
 * Hides internal CouchDB fields (_rev, _conflicts)
 * 
 * UPDATED: billingAddress replaces address, added locations array
 */
export class CustomerResponseDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 'customer-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Hofladen Müller GmbH',
  })
  @Expose()
  companyName: string;

  @ApiProperty({
    description: 'German VAT number',
    example: 'DE123456789',
    required: false,
  })
  @Expose()
  vatNumber?: string;

  @ApiProperty({
    description: 'Primary billing address (UPDATED: renamed from "address")',
    type: AddressResponseDto,
  })
  @Expose()
  @Type(() => AddressResponseDto)
  billingAddress: Address;

  @ApiProperty({
    description: 'Array of location IDs (NEW)',
    type: [String],
    example: ['location-111', 'location-222'],
  })
  @Expose()
  locations: string[];

  @ApiProperty({
    description: 'Default delivery location ID (NEW)',
    example: 'location-111',
    required: false,
  })
  @Expose()
  defaultDeliveryLocationId?: string;

  @ApiProperty({ example: '+49-89-1234567', required: false })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'info@hofladen-mueller.de', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ example: 'https://hofladen-mueller.de', required: false })
  @Expose()
  website?: string;

  @ApiProperty({
    description: 'Credit limit in EUR (BUCH/GF only)',
    example: 50000,
    required: false,
  })
  @Expose()
  creditLimit?: number;

  @ApiProperty({ example: 30, required: false })
  @Expose()
  paymentTerms?: number;

  @ApiProperty({
    description: 'Array of contact person IDs',
    type: [String],
    example: ['contact-111', 'contact-112'],
  })
  @Expose()
  contactPersons: string[];

  @ApiProperty({
    description: 'Customer rating tier',
    enum: ['A', 'B', 'C'],
    example: 'B',
    required: false,
  })
  @Expose()
  rating?: CustomerRating;

  @ApiProperty({
    description: 'Customer lifecycle status',
    enum: CustomerType,
    example: CustomerType.ACTIVE,
  })
  @Expose()
  customerType: CustomerType;

  @ApiProperty({
    description: 'Customer business type (NEW)',
    enum: CustomerBusinessType,
    required: false,
  })
  @Expose()
  customerBusinessType?: CustomerBusinessType;

  @ApiProperty({ example: 'Einzelhandel', required: false })
  @Expose()
  industry?: string;

  @ApiProperty({ type: [String], example: ['VIP'], required: false })
  @Expose()
  tags?: string[];

  @ApiProperty({ example: 'Important customer notes', required: false })
  @Expose()
  notes?: string;

  @ApiProperty({
    description: 'Owner user ID',
    example: 'user-uuid',
  })
  @Expose()
  owner: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-16T14:20:00.000Z' })
  @Expose()
  modifiedAt: Date;

  @ApiProperty({ example: 'user-uuid' })
  @Expose()
  createdBy: string;

  @ApiProperty({ example: 'user-uuid' })
  @Expose()
  modifiedBy: string;

  @ApiProperty({
    description: 'Whether there are pending offline changes',
    example: false,
    required: false,
  })
  @Expose()
  hasPendingSync?: boolean;

  @ApiProperty({
    description: 'Whether there are unresolved conflicts',
    example: false,
    required: false,
  })
  @Expose()
  hasConflicts?: boolean;
}
