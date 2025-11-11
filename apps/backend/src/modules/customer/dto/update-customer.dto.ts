import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing Customer
 * 
 * All fields from CreateCustomerDto are optional
 * Adds CouchDB revision for optimistic locking
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: 'CouchDB revision (for optimistic locking)',
    example: '1-abc123def456',
    required: false,
  })
  @IsString()
  @IsOptional()
  _rev?: string;

  @ApiProperty({
    description: 'Reason for correction (GoBD compliance)',
    example: 'Correcting address per customer request',
    required: false,
  })
  @IsString()
  @IsOptional()
  _correctionReason?: string;
}

