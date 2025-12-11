import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';

const projectStatuses = [
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled',
] as const;

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsString()
  customerId: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsEnum(projectStatuses, {
    message: `status must be one of: ${projectStatuses.join(', ')}`,
  })
  @IsOptional()
  status?: (typeof projectStatuses)[number] = 'planning';

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  projectManagerId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamMemberIds?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  offerId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsEnum(projectStatuses, {
    message: `status must be one of: ${projectStatuses.join(', ')}`,
  })
  @IsOptional()
  status?: (typeof projectStatuses)[number];

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  actualEndDate?: string;

  @IsString()
  @IsOptional()
  projectManagerId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamMemberIds?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
