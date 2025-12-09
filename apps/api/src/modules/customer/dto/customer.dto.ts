import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  Max,
  Matches,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
  Length,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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

class DsgvoConsentDto {
  @IsOptional()
  marketing?: boolean;

  @IsOptional()
  aiProcessing?: boolean;

  @IsOptional()
  dataSharing?: boolean;

  @IsString()
  @IsOptional()
  grantedAt?: string;

  @IsString()
  @IsOptional()
  grantedBy?: string;
}

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s.\-&()]+$/, {
    message:
      'Company name can only contain letters, numbers, and basic punctuation',
  })
  companyName: string;

  @IsString()
  @IsOptional()
  @Matches(/^DE\d{9}$/, {
    message: 'German VAT number must be format: DE123456789',
  })
  vatNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(7)
  @MaxLength(20)
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1000000)
  creditLimit?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsEnum(['direct_marketer', 'retail', 'franchise', 'cooperative', 'other'])
  @IsOptional()
  customerType?: string;

  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  rating?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locations?: string[];

  @IsString()
  @IsOptional()
  defaultDeliveryLocationId?: string;

  @IsString()
  owner: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contactPersons?: string[];

  @ValidateNested()
  @Type(() => DsgvoConsentDto)
  @IsOptional()
  dsgvoConsent?: DsgvoConsentDto;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s.\-&()]+$/, {
    message:
      'Company name can only contain letters, numbers, and basic punctuation',
  })
  companyName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^DE\d{9}$/, {
    message: 'German VAT number must be format: DE123456789',
  })
  vatNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(7)
  @MaxLength(20)
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1000000)
  creditLimit?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsEnum(['direct_marketer', 'retail', 'franchise', 'cooperative', 'other'])
  @IsOptional()
  customerType?: string;

  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  rating?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billingAddress?: AddressDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locations?: string[];

  @IsString()
  @IsOptional()
  defaultDeliveryLocationId?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contactPersons?: string[];

  @ValidateNested()
  @Type(() => DsgvoConsentDto)
  @IsOptional()
  dsgvoConsent?: DsgvoConsentDto;
}
