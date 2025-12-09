import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';

const opportunityStages = [
  'lead',
  'qualified',
  'analysis',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
] as const;

export class CreateOpportunityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  customerId: string;

  @IsString()
  @IsOptional()
  contactPersonId?: string;

  @IsEnum(opportunityStages, {
    message: `stage must be one of: ${opportunityStages.join(', ')}`,
  })
  stage: (typeof opportunityStages)[number];

  @IsNumber()
  @Min(0)
  @Max(100)
  probability: number;

  @IsNumber()
  @Min(0)
  expectedValue: number;

  @IsString()
  @IsOptional()
  currency?: string = 'EUR';

  @IsString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  nextStep?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lostReason?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  lostReasonDetails?: string;

  @IsString()
  owner: string;
}

export class UpdateOpportunityDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  contactPersonId?: string;

  @IsEnum(opportunityStages, {
    message: `stage must be one of: ${opportunityStages.join(', ')}`,
  })
  @IsOptional()
  stage?: (typeof opportunityStages)[number];

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  probability?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedValue?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  nextStep?: string;

  @IsString()
  @ValidateIf((o) => o.stage === 'closed_lost')
  @MinLength(2)
  @MaxLength(100)
  lostReason?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  lostReasonDetails?: string;

  @IsString()
  @IsOptional()
  owner?: string;
}
