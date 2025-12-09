import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTimeEntryDto {
  @IsString()
  projectId: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsString()
  userId: string;

  @IsString()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  description: string;

  @IsBoolean()
  isBillable: boolean;
}

export class UpdateTimeEntryDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isBillable?: boolean;
}
