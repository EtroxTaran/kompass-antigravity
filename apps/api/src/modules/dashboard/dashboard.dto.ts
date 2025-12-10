import { IsOptional, IsString } from 'class-validator';

// Pipeline stage metrics
export class PipelineStageDto {
  stage: string;
  label: string;
  value: number;
  count: number;
  color: string;
}

// Monthly revenue data point
export class MonthlyRevenueDto {
  month: string;
  revenue: number;
  invoiceCount: number;
}

// Project status count
export class ProjectStatusDto {
  status: string;
  label: string;
  count: number;
  color: string;
}

// Top opportunity
export class TopOpportunityDto {
  _id: string;
  title: string;
  customerId: string;
  customerName?: string;
  expectedValue: number;
  probability: number;
  stage: string;
}

// Overdue invoice summary
export class OverdueInvoiceSummaryDto {
  count: number;
  totalValue: number;
  invoices: {
    _id: string;
    invoiceNumber: string;
    customerId: string;
    customerName?: string;
    totalGross: number;
    dueDate: string;
    daysOverdue: number;
  }[];
}

// Team utilization entry
export class TeamUtilizationDto {
  userId: string;
  userName: string;
  totalHours: number;
  targetHours: number;
  utilizationPercent: number;
}

// Main GF Metrics response
export class GFMetricsDto {
  // Summary KPIs
  totalRevenue: number;
  outstandingRevenue: number;
  pipelineValue: number;
  weightedPipeline: number;
  activeProjectCount: number;
  onTimeProjectCount: number;
  delayedProjectCount: number;

  // Pipeline by stage
  pipelineStages: PipelineStageDto[];

  // Monthly revenue trend (last 12 months)
  monthlyRevenue: MonthlyRevenueDto[];

  // Projects by status
  projectsByStatus: ProjectStatusDto[];

  // Top 5 opportunities
  topOpportunities: TopOpportunityDto[];

  // Overdue invoices
  overdueInvoices: OverdueInvoiceSummaryDto;

  // Team utilization
  teamUtilization: TeamUtilizationDto[];
}

// Query params for metrics
export class GFMetricsQueryDto {
  @IsOptional()
  @IsString()
  period?: 'month' | 'quarter' | 'year';

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
