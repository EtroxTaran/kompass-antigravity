import type {
  ProjectCost,
  ProjectCostStatus,
  ProjectCostType,
  MaterialCostSummary,
} from '@kompass/shared/types/entities/project-cost';

/**
 * Project Cost Repository Interface
 *
 * Defines data access operations for project costs.
 * Follows repository pattern for clean architecture.
 */
export interface IProjectCostRepository {
  /**
   * Create a new project cost
   */
  create(projectCost: ProjectCost): Promise<ProjectCost>;

  /**
   * Find project cost by ID
   */
  findById(id: string): Promise<ProjectCost | null>;

  /**
   * Update project cost
   */
  update(projectCost: ProjectCost): Promise<ProjectCost>;

  /**
   * Delete project cost
   */
  delete(id: string): Promise<void>;

  /**
   * Find all project costs with optional filtering
   */
  findAll(filters?: ProjectCostFilters): Promise<ProjectCost[]>;

  /**
   * Find project costs by project ID
   */
  findByProject(projectId: string): Promise<ProjectCost[]>;

  /**
   * Find project costs by status
   */
  findByStatus(status: ProjectCostStatus): Promise<ProjectCost[]>;

  /**
   * Find project costs by type
   */
  findByType(costType: ProjectCostType): Promise<ProjectCost[]>;

  /**
   * Calculate material cost summary for a project
   */
  calculateMaterialCosts(projectId: string): Promise<MaterialCostSummary>;

  /**
   * Get costs pending payment
   */
  findPendingPayment(): Promise<ProjectCost[]>;

  /**
   * Get costs by supplier
   */
  findBySupplier(supplierName: string): Promise<ProjectCost[]>;
}

/**
 * Project Cost Filters
 *
 * Optional filters for querying project costs.
 */
export interface ProjectCostFilters {
  projectId?: string;
  costType?: ProjectCostType;
  status?: ProjectCostStatus;
  supplierName?: string;
  startDate?: Date;
  endDate?: Date;
}
