import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  ProjectCostStatus,
  calculateProjectCostTotals,
} from '@kompass/shared/types/entities/project-cost';

import { IProjectCostRepository } from '../repositories/project-cost.repository.interface';

import type { ProjectCostFilters } from '../repositories/project-cost.repository.interface';
import type {
  ProjectCost,
  CreateProjectCostDto,
  UpdateProjectCostDto,
  ProjectCostResponseDto,
  MaterialCostSummary,
} from '@kompass/shared/types/entities/project-cost';

/**
 * Project Cost Service
 *
 * Business logic for project cost management including:
 * - Material and contractor cost tracking
 * - Invoice management
 * - Payment tracking
 * - Cost aggregations
 */
@Injectable()
export class ProjectCostService {
  constructor(
    @Inject('IProjectCostRepository')
    private readonly repository: IProjectCostRepository
  ) {}

  /**
   * Create a new project cost
   */
  async create(
    dto: CreateProjectCostDto,
    currentUserId: string
  ): Promise<ProjectCostResponseDto> {
    // Calculate totals
    const taxRate = dto.taxRate || 0.19; // Default 19% VAT
    const { totalCostEur, taxAmountEur, totalWithTaxEur } =
      calculateProjectCostTotals(dto.quantity, dto.unitPriceEur, taxRate);

    const projectCost: ProjectCost = {
      _id: `project-cost-${uuidv4()}`,
      _rev: '',
      type: 'project_cost',
      projectId: dto.projectId,
      costType: dto.costType,
      description: dto.description,
      supplierName: dto.supplierName,
      quantity: dto.quantity,
      unitPriceEur: dto.unitPriceEur,
      totalCostEur,
      taxRate,
      taxAmountEur,
      totalWithTaxEur,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate,
      orderNumber: dto.orderNumber,
      status: dto.status,
      createdBy: currentUserId,
      createdAt: new Date(),
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
      version: 1,
    };

    const created = await this.repository.create(projectCost);
    return this.mapToResponseDto(created);
  }

  /**
   * Update a project cost
   */
  async update(
    costId: string,
    dto: UpdateProjectCostDto,
    currentUserId: string
  ): Promise<ProjectCostResponseDto> {
    const cost = await this.repository.findById(costId);

    if (!cost) {
      throw new NotFoundException(`Project cost ${costId} not found`);
    }

    // TODO: Check RBAC permissions

    // Cannot update paid costs without approval
    if (
      cost.status === ProjectCostStatus.PAID &&
      dto.status !== ProjectCostStatus.PAID
    ) {
      throw new ForbiddenException('Cannot update paid costs');
    }

    // Recalculate totals if quantity or unit price changed
    let totalCostEur = cost.totalCostEur;
    let taxAmountEur = cost.taxAmountEur;
    let totalWithTaxEur = cost.totalWithTaxEur;

    if (dto.quantity !== undefined || dto.unitPriceEur !== undefined) {
      const quantity = dto.quantity || cost.quantity;
      const unitPrice = dto.unitPriceEur || cost.unitPriceEur;
      const taxRate = dto.taxRate || cost.taxRate;

      const calculated = calculateProjectCostTotals(
        quantity,
        unitPrice,
        taxRate
      );
      totalCostEur = calculated.totalCostEur;
      taxAmountEur = calculated.taxAmountEur;
      totalWithTaxEur = calculated.totalWithTaxEur;
    }

    const updated: ProjectCost = {
      ...cost,
      ...dto,
      totalCostEur,
      taxAmountEur,
      totalWithTaxEur,
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);
    return this.mapToResponseDto(result);
  }

  /**
   * Delete a project cost
   */
  async delete(costId: string, _currentUserId: string): Promise<void> {
    const cost = await this.repository.findById(costId);

    if (!cost) {
      throw new NotFoundException(`Project cost ${costId} not found`);
    }

    // TODO: Check RBAC permissions

    // Cannot delete paid costs
    if (cost.status === ProjectCostStatus.PAID) {
      throw new ForbiddenException('Cannot delete paid costs');
    }

    await this.repository.delete(costId);
  }

  /**
   * Find project cost by ID
   */
  async findById(
    costId: string,
    _currentUserId: string
  ): Promise<ProjectCostResponseDto> {
    const cost = await this.repository.findById(costId);

    if (!cost) {
      throw new NotFoundException(`Project cost ${costId} not found`);
    }

    // TODO: Check RBAC permissions

    return this.mapToResponseDto(cost);
  }

  /**
   * Find all project costs with filters
   */
  async findAll(
    filters: ProjectCostFilters,
    _currentUserId: string
  ): Promise<ProjectCostResponseDto[]> {
    // TODO: Apply RBAC filters based on user role

    const costs = await this.repository.findAll(filters);
    return costs.map((cost) => this.mapToResponseDto(cost));
  }

  /**
   * Find project costs by project ID
   */
  async findByProject(
    projectId: string,
    _currentUserId: string
  ): Promise<ProjectCostResponseDto[]> {
    // TODO: Check if user has access to project

    const costs = await this.repository.findByProject(projectId);
    return costs.map((cost) => this.mapToResponseDto(cost));
  }

  /**
   * Approve a project cost
   */
  async approve(
    costId: string,
    currentUserId: string
  ): Promise<ProjectCostResponseDto> {
    const cost = await this.repository.findById(costId);

    if (!cost) {
      throw new NotFoundException(`Project cost ${costId} not found`);
    }

    // TODO: Check if user has approval permission (BUCH or GF role)

    const updated: ProjectCost = {
      ...cost,
      approvedBy: currentUserId,
      approvedAt: new Date(),
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);

    // TODO: Trigger project cost recalculation

    return this.mapToResponseDto(result);
  }

  /**
   * Mark a project cost as paid
   */
  async markAsPaid(
    costId: string,
    currentUserId: string
  ): Promise<ProjectCostResponseDto> {
    const cost = await this.repository.findById(costId);

    if (!cost) {
      throw new NotFoundException(`Project cost ${costId} not found`);
    }

    // TODO: Check if user has permission (BUCH role)

    // Must be invoiced before paid
    if (cost.status !== ProjectCostStatus.INVOICED) {
      throw new BadRequestException(
        'Cost must be invoiced before marking as paid'
      );
    }

    const updated: ProjectCost = {
      ...cost,
      status: ProjectCostStatus.PAID,
      paidAt: new Date(),
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);

    // TODO: Trigger project cost recalculation

    return this.mapToResponseDto(result);
  }

  /**
   * Calculate material costs for a project
   */
  async calculateProjectMaterialCosts(
    projectId: string
  ): Promise<MaterialCostSummary> {
    return this.repository.calculateMaterialCosts(projectId);
  }

  /**
   * Get costs pending payment
   */
  async getPendingPayments(
    _currentUserId: string
  ): Promise<ProjectCostResponseDto[]> {
    // TODO: Check RBAC permissions (BUCH role)

    const costs = await this.repository.findPendingPayment();
    return costs.map((cost) => this.mapToResponseDto(cost));
  }

  /**
   * Get costs by supplier
   */
  async getBySupplier(
    supplierName: string,
    _currentUserId: string
  ): Promise<ProjectCostResponseDto[]> {
    // TODO: Check RBAC permissions

    const costs = await this.repository.findBySupplier(supplierName);
    return costs.map((cost) => this.mapToResponseDto(cost));
  }

  /**
   * Helper: Map ProjectCost to ResponseDTO
   */
  private mapToResponseDto(cost: ProjectCost): ProjectCostResponseDto {
    // TODO: Populate projectName, approvedByName from respective services
    return {
      ...cost,
      projectName: '', // TODO: Populate
      approvedByName: cost.approvedBy ? '' : undefined, // TODO: Populate
    };
  }
}
