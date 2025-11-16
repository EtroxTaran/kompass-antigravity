import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsArray,
  Length,
  ValidateNested,
} from 'class-validator';

import { TourStatus } from '@kompass/shared/types/entities/tour';

import type { RouteWaypoint } from '@kompass/shared/types/entities/tour';

/**
 * Update Tour DTO
 *
 * Used for updating existing tours
 * All fields are optional
 */
export class UpdateTourDto {
  @ApiPropertyOptional({
    description: 'Tour title/name',
    example: 'Bayern Süd, 15.-17. Juni',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Purpose/description of tour',
    example: 'Kundenbesuche in der Region Bayern Süd',
    maxLength: 500,
  })
  @IsString()
  @Length(0, 500)
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({
    description: 'Region/area covered',
    example: 'Bayern Süd',
  })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({
    description: 'Tour start date and time',
    example: '2025-06-15T08:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Tour end date and time',
    example: '2025-06-17T18:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Tour status',
    enum: TourStatus,
    example: TourStatus.ACTIVE,
  })
  @IsEnum(TourStatus)
  @IsOptional()
  status?: TourStatus;

  @ApiPropertyOptional({
    description: 'Planned route with waypoints',
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  plannedRoute?: RouteWaypoint[];

  @ApiPropertyOptional({
    description: 'Estimated total distance in kilometers',
    example: 450,
    minimum: 0,
  })
  @IsOptional()
  estimatedDistance?: number;

  @ApiPropertyOptional({
    description: 'Actual distance driven in kilometers',
    example: 465,
    minimum: 0,
  })
  @IsOptional()
  actualDistance?: number;

  @ApiPropertyOptional({
    description: 'Estimated total costs in EUR',
    example: 850,
    minimum: 0,
  })
  @IsOptional()
  estimatedCosts?: number;

  @ApiPropertyOptional({
    description: 'Actual total costs in EUR',
    example: 920,
    minimum: 0,
  })
  @IsOptional()
  actualCosts?: number;

  @ApiPropertyOptional({
    description: 'Completion notes',
    example: 'Alle Termine erfolgreich abgeschlossen',
    maxLength: 1000,
  })
  @IsString()
  @Length(0, 1000)
  @IsOptional()
  completionNotes?: string;
}
