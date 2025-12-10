import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import * as Nano from 'nano';
import {
  GFMetricsDto,
  PipelineStageDto,
  MonthlyRevenueDto,
  ProjectStatusDto,
  TopOpportunityDto,
  OverdueInvoiceSummaryDto,
  TeamUtilizationDto,
} from './dashboard.dto';

// Internal document types for type safety
interface InvoiceDoc {
  _id: string;
  type: 'invoice';
  invoiceNumber: string;
  customerId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  totalGross: number;
  date: string;
  dueDate: string;
}

interface OpportunityDoc {
  _id: string;
  type: 'opportunity';
  title: string;
  customerId: string;
  stage: string;
  expectedValue: number;
  probability: number;
}

interface ProjectDoc {
  _id: string;
  type: 'project';
  name: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  endDate?: string;
}

interface TimeEntryDoc {
  _id: string;
  type: 'time_entry';
  userId?: string;
  createdBy?: string;
  userName?: string;
  durationMinutes: number;
  startTime: string;
}

// Stage configuration
const PIPELINE_STAGES = [
  { stage: 'lead', label: 'Neu', color: '#3b82f6' },
  { stage: 'qualified', label: 'Qualifiziert', color: '#60a5fa' },
  { stage: 'analysis', label: 'Analyse', color: '#93c5fd' },
  { stage: 'proposal', label: 'Angebot', color: '#fbbf24' },
  { stage: 'negotiation', label: 'Verhandlung', color: '#34d399' },
];

const PROJECT_STATUS_CONFIG = [
  { status: 'planning', label: 'Planung', color: '#3b82f6' },
  { status: 'active', label: 'In Arbeit', color: '#f59e0b' },
  { status: 'on_hold', label: 'Pausiert', color: '#94a3b8' },
  { status: 'completed', label: 'Abgeschlossen', color: '#10b981' },
  { status: 'cancelled', label: 'Abgebrochen', color: '#ef4444' },
];

@Injectable()
export class DashboardService {
  constructor(
    @Inject(OPERATIONAL_DB) private readonly db: Nano.DocumentScope<unknown>,
  ) {}

  async getGFMetrics(): Promise<GFMetricsDto> {
    const [
      invoiceMetrics,
      opportunityMetrics,
      projectMetrics,
      timeEntryMetrics,
    ] = await Promise.all([
      this.getInvoiceMetrics(),
      this.getOpportunityMetrics(),
      this.getProjectMetrics(),
      this.getTimeEntryMetrics(),
    ]);

    return {
      // Summary KPIs
      totalRevenue: invoiceMetrics.totalRevenue,
      outstandingRevenue: invoiceMetrics.outstandingRevenue,
      pipelineValue: opportunityMetrics.pipelineValue,
      weightedPipeline: opportunityMetrics.weightedPipeline,
      activeProjectCount: projectMetrics.activeCount,
      onTimeProjectCount: projectMetrics.onTimeCount,
      delayedProjectCount: projectMetrics.delayedCount,

      // Detail data
      pipelineStages: opportunityMetrics.pipelineStages,
      monthlyRevenue: invoiceMetrics.monthlyRevenue,
      projectsByStatus: projectMetrics.projectsByStatus,
      topOpportunities: opportunityMetrics.topOpportunities,
      overdueInvoices: invoiceMetrics.overdueInvoices,
      teamUtilization: timeEntryMetrics.teamUtilization,
    };
  }

  private async getInvoiceMetrics(): Promise<{
    totalRevenue: number;
    outstandingRevenue: number;
    monthlyRevenue: MonthlyRevenueDto[];
    overdueInvoices: OverdueInvoiceSummaryDto;
  }> {
    // Fetch all invoices
    const result = await this.db.find({
      selector: { type: 'invoice' },
      limit: 10000,
    });

    const invoices = result.docs as unknown as InvoiceDoc[];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Total revenue (paid invoices)
    const totalRevenue = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.totalGross || 0), 0);

    // Outstanding revenue (sent + overdue)
    const outstandingRevenue = invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.totalGross || 0), 0);

    // Monthly revenue (last 12 months)
    const monthlyRevenue = this.calculateMonthlyRevenue(invoices);

    // Overdue invoices
    const overdueList = invoices
      .filter((inv) => {
        if (inv.status === 'overdue') return true;
        if (inv.status === 'sent' && inv.dueDate < todayStr) return true;
        return false;
      })
      .map((inv) => {
        const dueDate = new Date(inv.dueDate);
        const daysOverdue = Math.floor(
          (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          _id: inv._id,
          invoiceNumber: inv.invoiceNumber,
          customerId: inv.customerId,
          totalGross: inv.totalGross,
          dueDate: inv.dueDate,
          daysOverdue: Math.max(0, daysOverdue),
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue)
      .slice(0, 10);

    const overdueInvoices: OverdueInvoiceSummaryDto = {
      count: overdueList.length,
      totalValue: overdueList.reduce((sum, inv) => sum + inv.totalGross, 0),
      invoices: overdueList,
    };

    return {
      totalRevenue,
      outstandingRevenue,
      monthlyRevenue,
      overdueInvoices,
    };
  }

  private calculateMonthlyRevenue(invoices: InvoiceDoc[]): MonthlyRevenueDto[] {
    const now = new Date();
    const months: MonthlyRevenueDto[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = monthDate.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = monthDate.toLocaleDateString('de-DE', {
        month: 'short',
        year: '2-digit',
      });

      const monthInvoices = invoices.filter((inv) => {
        if (inv.status !== 'paid') return false;
        return inv.date?.startsWith(monthStr);
      });

      months.push({
        month: monthLabel,
        revenue: monthInvoices.reduce(
          (sum, inv) => sum + (inv.totalGross || 0),
          0,
        ),
        invoiceCount: monthInvoices.length,
      });
    }

    return months;
  }

  private async getOpportunityMetrics(): Promise<{
    pipelineValue: number;
    weightedPipeline: number;
    pipelineStages: PipelineStageDto[];
    topOpportunities: TopOpportunityDto[];
  }> {
    const result = await this.db.find({
      selector: {
        type: 'opportunity',
        stage: { $nin: ['closed_won', 'closed_lost'] },
      },
      limit: 10000,
    });

    const opportunities = result.docs as unknown as OpportunityDoc[];

    // Total pipeline value
    const pipelineValue = opportunities.reduce(
      (sum, opp) => sum + (opp.expectedValue || 0),
      0,
    );

    // Weighted pipeline
    const weightedPipeline = opportunities.reduce(
      (sum, opp) =>
        sum + ((opp.expectedValue || 0) * (opp.probability || 0)) / 100,
      0,
    );

    // Pipeline by stage
    const pipelineStages: PipelineStageDto[] = PIPELINE_STAGES.map((config) => {
      const stageOpps = opportunities.filter(
        (opp) => opp.stage === config.stage,
      );
      return {
        stage: config.stage,
        label: config.label,
        value: stageOpps.reduce(
          (sum, opp) => sum + (opp.expectedValue || 0),
          0,
        ),
        count: stageOpps.length,
        color: config.color,
      };
    });

    // Top 5 opportunities by value
    const topOpportunities: TopOpportunityDto[] = opportunities
      .sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0))
      .slice(0, 5)
      .map((opp) => ({
        _id: opp._id,
        title: opp.title,
        customerId: opp.customerId,
        expectedValue: opp.expectedValue || 0,
        probability: opp.probability || 0,
        stage: opp.stage,
      }));

    return {
      pipelineValue,
      weightedPipeline,
      pipelineStages,
      topOpportunities,
    };
  }

  private async getProjectMetrics(): Promise<{
    activeCount: number;
    onTimeCount: number;
    delayedCount: number;
    projectsByStatus: ProjectStatusDto[];
  }> {
    const result = await this.db.find({
      selector: { type: 'project' },
      limit: 10000,
    });

    const projects = result.docs as unknown as ProjectDoc[];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Active projects (planning + active)
    const activeProjects = projects.filter(
      (p) => p.status === 'active' || p.status === 'planning',
    );
    const activeCount = activeProjects.length;

    // On-time vs delayed (check endDate)
    let onTimeCount = 0;
    let delayedCount = 0;

    activeProjects.forEach((p) => {
      if (p.endDate && p.endDate < todayStr && p.status === 'active') {
        delayedCount++;
      } else {
        onTimeCount++;
      }
    });

    // Projects by status
    const projectsByStatus: ProjectStatusDto[] = PROJECT_STATUS_CONFIG.map(
      (config) => ({
        status: config.status,
        label: config.label,
        count: projects.filter((p) => p.status === config.status).length,
        color: config.color,
      }),
    );

    return { activeCount, onTimeCount, delayedCount, projectsByStatus };
  }

  private async getTimeEntryMetrics(): Promise<{
    teamUtilization: TeamUtilizationDto[];
  }> {
    // Get time entries for the current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const result = await this.db.find({
      selector: {
        type: 'time_entry',
        startTime: { $gte: monthStart, $lte: monthEnd + 'T23:59:59' },
      },
      limit: 10000,
    });

    const timeEntries = result.docs as unknown as TimeEntryDoc[];

    // Group by userId
    const userHours: Record<string, { hours: number; userName: string }> = {};

    timeEntries.forEach((entry) => {
      const userId = entry.userId || entry.createdBy;
      if (!userId) return;

      if (!userHours[userId]) {
        userHours[userId] = {
          hours: 0,
          userName: entry.userName || userId,
        };
      }
      userHours[userId].hours += (entry.durationMinutes || 0) / 60;
    });

    // Calculate working days in month (assume 22 days * 8 hours = 176 target hours)
    const targetHours = 176;

    const teamUtilization: TeamUtilizationDto[] = Object.entries(userHours)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        totalHours: Math.round(data.hours * 10) / 10,
        targetHours,
        utilizationPercent: Math.round((data.hours / targetHours) * 100),
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    return { teamUtilization };
  }
}
