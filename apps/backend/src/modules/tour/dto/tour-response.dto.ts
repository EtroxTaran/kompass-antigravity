import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourStatus } from '@kompass/shared/types/entities/tour';
import { RouteWaypoint } from '@kompass/shared/types/entities/tour';

/**
 * Tour Response DTO
 * 
 * Used for API responses
 */
export class TourResponseDto {
  @ApiProperty({
    description: 'Tour ID',
    example: 'tour-550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Tour title/name',
    example: 'Bayern Süd, 15.-17. Juni',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Purpose/description of tour',
    example: 'Kundenbesuche in der Region Bayern Süd',
  })
  purpose?: string;

  @ApiPropertyOptional({
    description: 'Region/area covered',
    example: 'Bayern Süd',
  })
  region?: string;

  @ApiProperty({
    description: 'Tour start date and time',
    example: '2025-06-15T08:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Tour end date and time',
    example: '2025-06-17T18:00:00Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Tour status',
    enum: TourStatus,
    example: TourStatus.PLANNED,
  })
  status: TourStatus;

  @ApiProperty({
    description: 'User ID of tour owner',
    example: 'user-123',
  })
  ownerId: string;

  @ApiPropertyOptional({
    description: 'Planned route with waypoints',
    type: [Object],
  })
  plannedRoute?: RouteWaypoint[];

  @ApiPropertyOptional({
    description: 'Estimated total distance in kilometers',
    example: 450,
  })
  estimatedDistance?: number;

  @ApiPropertyOptional({
    description: 'Actual distance driven in kilometers',
    example: 465,
  })
  actualDistance?: number;

  @ApiPropertyOptional({
    description: 'Estimated total costs in EUR',
    example: 850,
  })
  estimatedCosts?: number;

  @ApiPropertyOptional({
    description: 'Actual total costs in EUR',
    example: 920,
  })
  actualCosts?: number;

  @ApiPropertyOptional({
    description: 'Mileage cost in EUR',
    example: 139.5,
  })
  mileageCost?: number;

  @ApiProperty({
    description: 'Meeting IDs associated with this tour',
    type: [String],
    example: ['meeting-111', 'meeting-222'],
  })
  meetingIds: string[];

  @ApiProperty({
    description: 'Hotel stay IDs for this tour',
    type: [String],
    example: ['hotelstay-111'],
  })
  hotelStayIds: string[];

  @ApiProperty({
    description: 'Expense IDs for this tour',
    type: [String],
    example: ['expense-111', 'expense-222'],
  })
  expenseIds: string[];

  @ApiProperty({
    description: 'Mileage log IDs for this tour',
    type: [String],
    example: ['mileagelog-111'],
  })
  mileageLogIds: string[];

  @ApiPropertyOptional({
    description: 'When tour was completed',
    example: '2025-06-17T18:00:00Z',
  })
  completedAt?: Date;

  @ApiPropertyOptional({
    description: 'Notes about tour completion',
    example: 'Alle Termine erfolgreich abgeschlossen',
  })
  completionNotes?: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-06-10T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last modified timestamp',
    example: '2025-06-17T18:00:00Z',
  })
  modifiedAt: Date;
}

/**
 * Tour Cost Summary Response DTO
 */
export class TourCostSummaryDto {
  @ApiProperty({
    description: 'Tour ID',
    example: 'tour-550e8400-e29b-41d4-a716-446655440000',
  })
  tourId: string;

  @ApiProperty({
    description: 'Estimated costs in EUR',
    example: 850,
  })
  estimatedCosts: number;

  @ApiProperty({
    description: 'Actual costs in EUR',
    example: 920,
  })
  actualCosts: number;

  @ApiProperty({
    description: 'Mileage cost in EUR',
    example: 139.5,
  })
  mileageCost: number;

  @ApiProperty({
    description: 'Hotel costs in EUR',
    example: 240,
  })
  hotelCosts: number;

  @ApiProperty({
    description: 'Other expenses in EUR',
    example: 540.5,
  })
  otherExpenses: number;

  @ApiProperty({
    description: 'Cost breakdown by category',
    type: Object,
    example: {
      mileage: 139.5,
      hotel: 240,
      meal: 180,
      fuel: 120,
      parking: 40.5,
      other: 200,
    },
  })
  breakdown: Record<string, number>;
}

