import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

const ratings = ['A', 'B', 'C'] as const;

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

export class CreateSupplierDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  companyName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  supplierNumber?: string;

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
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  deliveryTerms?: string;

  @IsEnum(ratings)
  @IsOptional()
  rating?: (typeof ratings)[number];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];
}

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  companyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  supplierNumber?: string;

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
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billingAddress?: AddressDto;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  deliveryTerms?: string;

  @IsEnum(ratings)
  @IsOptional()
  rating?: (typeof ratings)[number];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];
}
