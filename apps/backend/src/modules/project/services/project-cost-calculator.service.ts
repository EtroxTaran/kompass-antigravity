import { Injectable, Inject } from '@nestjs/common';

import {
  CostTrackingStatus,
  calculateCostTrackingStatus,
  calculateProfitMargin,
} from '@kompass/shared/types/entities/project';

import type {
  Project,
  ProfitabilityReport,
} from '@kompass/shared/types/entities/project';
import type { MaterialCostSummary } from '@kompass/shared/types/entities/project-cost';
import type { LaborCostSummary } from '@kompass/shared/types/entities/time-entry';

/**
 * Type guard to check if value is a Project
 */
function isProject(value: unknown): value is Project {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    'type' in value &&
    (value as { type: unknown }).type === 'project' &&
    'projectName' in value &&
    'contractValueEur' in value &&
    'budgetedTotalCostEur' in value &&
    'budgetedLaborCostEur' in value &&
    'budgetedMaterialCostEur' in value
  );
}

/**
 * Project Cost Calculator Service
 *
 * Calculates project costs, profitability, and budget status.
 * Triggers automatic recalculations when time entries or costs change.
 *
 * @see Phase 3 of Time Tracking Implementation Plan
 */
@Injectable()
export class ProjectCostCalculatorService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: {
      findById: (id: string) => Promise<unknown>;
    }, // TODO: Replace with actual IProjectRepository interface
    @Inject('ITimeEntryRepository')
    private readonly timeEntryRepository: {
      calculateLaborCosts: (projectId: string) => Promise<LaborCostSummary>;
    }, // TODO: Replace with actual ITimeEntryRepository interface
    @Inject('IProjectCostRepository')
    private readonly projectCostRepository: {
      calculateMaterialCosts: (
        projectId: string
      ) => Promise<MaterialCostSummary>;
    }, // TODO: Replace with actual IProjectCostRepository interface
    private readonly budgetAlertService: {
      checkBudgetAlerts: (projectId: string) => Promise<void>;
    } // TODO: Import BudgetAlertService interface
  ) {}

  /**
   * Calculate labor costs for a project
   *
   * Aggregates approved time entries and calculates total labor cost.
   */
  async calculateLaborCosts(projectId: string): Promise<LaborCostSummary> {
    // Delegate to time entry repository
    return this.timeEntryRepository.calculateLaborCosts(projectId);
  }

  /**
   * Calculate material costs for a project
   *
   * Aggregates all project costs (materials, contractors, services).
   */
  async calculateMaterialCosts(
    projectId: string
  ): Promise<MaterialCostSummary> {
    // Delegate to project cost repository
    return this.projectCostRepository.calculateMaterialCosts(projectId);
  }

  /**
   * Calculate profitability for a project
   *
   * Returns comprehensive profitability report with budget variance analysis.
   */
  async calculateProfitability(
    projectId: string
  ): Promise<ProfitabilityReport> {
    // Get project
    const projectData = await this.projectRepository.findById(projectId);
    if (!projectData || !isProject(projectData)) {
      throw new Error(`Project ${projectId} not found`);
    }
    const project = projectData;

    // Get labor costs
    const laborCosts = await this.calculateLaborCosts(projectId);

    // Get material costs
    const materialCosts = await this.calculateMaterialCosts(projectId);

    // Calculate totals
    const actualLaborCostEur = laborCosts.totalCostEur;
    const actualMaterialCostEur = materialCosts.totalCostEur;
    const actualTotalCostEur = actualLaborCostEur + actualMaterialCostEur;

    // Calculate variances
    const costVarianceEur = project.budgetedTotalCostEur - actualTotalCostEur;
    const costVariancePercent =
      project.budgetedTotalCostEur > 0
        ? (costVarianceEur / project.budgetedTotalCostEur) * 100
        : 0;

    const laborVarianceEur = project.budgetedLaborCostEur - actualLaborCostEur;
    const materialVarianceEur =
      project.budgetedMaterialCostEur - actualMaterialCostEur;

    // Calculate profitability
    const { profitEur, marginPercent } = calculateProfitMargin(
      project.contractValueEur,
      actualTotalCostEur
    );

    // Determine cost tracking status
    const costTrackingStatus = calculateCostTrackingStatus(
      actualTotalCostEur,
      project.budgetedTotalCostEur
    );

    // Determine if alerts needed
    const isOverBudget = costTrackingStatus === CostTrackingStatus.OVER_BUDGET;
    const isAtRisk = costTrackingStatus === CostTrackingStatus.AT_RISK;

    // Generate warning message
    let warningMessage: string | undefined;
    if (isOverBudget) {
      warningMessage = `Project is OVER BUDGET by €${Math.abs(costVarianceEur).toFixed(2)} (${Math.abs(costVariancePercent).toFixed(1)}%)`;
    } else if (isAtRisk) {
      warningMessage = `Project is AT RISK: ${((actualTotalCostEur / project.budgetedTotalCostEur) * 100).toFixed(1)}% of budget used`;
    }

    return {
      projectId,
      projectName: project.projectName,
      contractValueEur: project.contractValueEur,
      budgetedTotalCostEur: project.budgetedTotalCostEur,
      actualTotalCostEur: Math.round(actualTotalCostEur * 100) / 100,
      costVarianceEur: Math.round(costVarianceEur * 100) / 100,
      costVariancePercent: Math.round(costVariancePercent * 100) / 100,
      budgetedLaborCostEur: project.budgetedLaborCostEur,
      actualLaborCostEur: Math.round(actualLaborCostEur * 100) / 100,
      laborVarianceEur: Math.round(laborVarianceEur * 100) / 100,
      budgetedMaterialCostEur: project.budgetedMaterialCostEur,
      actualMaterialCostEur: Math.round(actualMaterialCostEur * 100) / 100,
      materialVarianceEur: Math.round(materialVarianceEur * 100) / 100,
      estimatedProfitEur: profitEur,
      profitMarginPercent: marginPercent,
      costTrackingStatus,
      isOverBudget,
      isAtRisk,
      warningMessage,
    };
  }

  /**
   * Update project costs
   *
   * Recalculates all cost fields and updates project entity.
   * Should be called when time entries are approved or costs are added/updated.
   */
  async updateProjectCosts(projectId: string): Promise<Project> {
    // Get project
    const projectData = await this.projectRepository.findById(projectId);
    if (!projectData || !isProject(projectData)) {
      throw new Error(`Project ${projectId} not found`);
    }
    const project = projectData;

    // Calculate profitability
    const profitability = await this.calculateProfitability(projectId);

    // Get labor hours
    const laborCosts = await this.calculateLaborCosts(projectId);

    // Update project with calculated values
    const updated: Project = {
      ...project,
      actualLaborHours: laborCosts.totalHours,
      actualLaborCostEur: profitability.actualLaborCostEur,
      actualMaterialCostEur: profitability.actualMaterialCostEur,
      actualTotalCostEur: profitability.actualTotalCostEur,
      estimatedProfitEur: profitability.estimatedProfitEur,
      profitMarginPercent: profitability.profitMarginPercent,
      costTrackingStatus: profitability.costTrackingStatus,
      costVarianceEur: profitability.costVarianceEur,
      costVariancePercent: profitability.costVariancePercent,
      lastCostUpdateAt: new Date(),
      modifiedAt: new Date(),
    };

    // Save updated project
    // TODO: Add update method to IProjectRepository interface
    // const result = await this.projectRepository.update(updated);

    // Trigger budget alerts if needed
    if (profitability.isOverBudget || profitability.isAtRisk) {
      await this.triggerBudgetAlert(project, profitability);
    }

    return updated;
  }

  /**
   * Trigger budget alert
   *
   * Sends notifications when project budget thresholds are exceeded.
   * Delegates to BudgetAlertService for actual alert handling.
   */
  private async triggerBudgetAlert(
    project: Project,
    _profitability: ProfitabilityReport
  ): Promise<void> {
    // Delegate to budget alert service
    await this.budgetAlertService.checkBudgetAlerts(project._id);
  }

  /**
   * Get budget status percentage
   *
   * Returns what percentage of budget has been used.
   */
  async getBudgetUsagePercent(projectId: string): Promise<number> {
    const projectData = await this.projectRepository.findById(projectId);
    if (!projectData || !isProject(projectData)) {
      return 0;
    }
    const project = projectData;
    if (project.budgetedTotalCostEur === 0) {
      return 0;
    }

    const profitability = await this.calculateProfitability(projectId);
    return (
      (profitability.actualTotalCostEur / project.budgetedTotalCostEur) * 100
    );
  }

  /**
   * Calculate project ROI
   *
   * Return on Investment calculation.
   */
  calculateROI(
    contractValueEur: number,
    actualCostEur: number
  ): { roi: number; roiPercent: number } {
    const profit = contractValueEur - actualCostEur;
    const roiPercent = actualCostEur > 0 ? (profit / actualCostEur) * 100 : 0;

    return {
      roi: Math.round(profit * 100) / 100,
      roiPercent: Math.round(roiPercent * 100) / 100,
    };
  }

  /**
   * Batch update costs for all active projects
   *
   * Can be run as nightly batch job to ensure all projects are up-to-date.
   */
  batchUpdateAllProjects(): Promise<{
    updated: number;
    errors: string[];
  }> {
    // TODO: Implement batch update
    // Get all active projects
    // const activeProjects = await this.projectRepository.findByStatus('active');

    const updated = 0;
    const errors: string[] = [];

    // for (const project of activeProjects) {
    //   try {
    //     await this.updateProjectCosts(project._id);
    //     updated++;
    //   } catch (error) {
    //     errors.push(`Failed to update project ${project._id}: ${error.message}`);
    //   }
    // }

    return { updated, errors };
  }
}
