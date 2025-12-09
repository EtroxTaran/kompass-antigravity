import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';

const decisionMakingRoles = [
  'decision_maker',
  'key_influencer',
  'recommender',
  'gatekeeper',
  'operational_contact',
  'informational',
] as const;

const authorityLevels = ['low', 'medium', 'high', 'final_authority'] as const;
const contactMethods = ['email', 'phone', 'mobile'] as const;

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

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
  @MinLength(7)
  @MaxLength(20)
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid mobile number format' })
  mobile?: string;

  @IsString()
  customerId: string;

  @IsEnum(decisionMakingRoles, {
    message: `decisionMakingRole must be one of: ${decisionMakingRoles.join(', ')}`,
  })
  decisionMakingRole: (typeof decisionMakingRoles)[number];

  @IsEnum(authorityLevels, {
    message: `authorityLevel must be one of: ${authorityLevels.join(', ')}`,
  })
  authorityLevel: (typeof authorityLevels)[number];

  @IsBoolean()
  canApproveOrders: boolean;

  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.canApproveOrders === true)
  approvalLimitEur?: number;

  @IsArray()
  @IsString({ each: true })
  assignedLocationIds: string[];

  @IsArray()
  @IsString({ each: true })
  isPrimaryContactForLocations: string[];

  @IsEnum(contactMethods, {
    message: `preferredContactMethod must be one of: ${contactMethods.join(', ')}`,
  })
  @IsOptional()
  preferredContactMethod?: (typeof contactMethods)[number];

  @IsString()
  @IsOptional()
  @MaxLength(10)
  language?: string;
}

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

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
  @MinLength(7)
  @MaxLength(20)
  @Matches(/^[+]?[0-9\s\-()]+$/, { message: 'Invalid mobile number format' })
  mobile?: string;

  @IsEnum(decisionMakingRoles, {
    message: `decisionMakingRole must be one of: ${decisionMakingRoles.join(', ')}`,
  })
  @IsOptional()
  decisionMakingRole?: (typeof decisionMakingRoles)[number];

  @IsEnum(authorityLevels, {
    message: `authorityLevel must be one of: ${authorityLevels.join(', ')}`,
  })
  @IsOptional()
  authorityLevel?: (typeof authorityLevels)[number];

  @IsBoolean()
  @IsOptional()
  canApproveOrders?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  approvalLimitEur?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assignedLocationIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  isPrimaryContactForLocations?: string[];

  @IsEnum(contactMethods, {
    message: `preferredContactMethod must be one of: ${contactMethods.join(', ')}`,
  })
  @IsOptional()
  preferredContactMethod?: (typeof contactMethods)[number];

  @IsString()
  @IsOptional()
  @MaxLength(10)
  language?: string;
}
