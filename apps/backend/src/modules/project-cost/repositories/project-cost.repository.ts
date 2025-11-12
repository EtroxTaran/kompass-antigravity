import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  ProjectCost,
  ProjectCostStatus,
  ProjectCostType,
  MaterialCostSummary,
  CostTypeSummary,
  CostStatusSummary,
} from '@kompass/shared/types/entities/project-cost';
import {
  IProjectCostRepository,
  ProjectCostFilters,
} from './project-cost.repository.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Project Cost Repository Implementation
 * 
 * Implements data access operations for project costs using CouchDB.
 * Handles CRUD operations, filtering, and cost aggregations.
 */
@Injectable()
export class ProjectCostRepository implements IProjectCostRepository {
  private readonly collectionName = 'project_costs';

  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Get CouchDB database instance
   * 
   * Note: This is a placeholder. Actual implementation will use CouchDB/Nano client
   */
  private getDb() {
    // TODO: Replace with actual CouchDB/Nano client
    // return this.nano.db.use('kompass');
    throw new Error('CouchDB client not yet implemented');
  }

  async create(projectCost: ProjectCost): Promise<ProjectCost> {
    const newCost: ProjectCost = {
      ...projectCost,
      _id: projectCost._id || `project-cost-${uuidv4()}`,
      type: 'project_cost',
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: 1,
    };

    // TODO: Implement CouchDB insert
    // const db = this.getDb();
    // const result = await db.insert(newCost);
    // return { ...newCost, _rev: result.rev };

    return newCost;
  }

  async findById(id: string): Promise<ProjectCost | null> {
    try {
      // TODO: Implement CouchDB get
      // const db = this.getDb();
      // const doc = await db.get(id);
      // return doc as ProjectCost;
      return null;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async update(projectCost: ProjectCost): Promise<ProjectCost> {
    const updated: ProjectCost = {
      ...projectCost,
      modifiedAt: new Date(),
      version: projectCost.version + 1,
    };

    // TODO: Implement CouchDB update
    // const db = this.getDb();
    // const result = await db.insert(updated);
    // return { ...updated, _rev: result.rev };

    return updated;
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement CouchDB delete
    // const db = this.getDb();
    // const doc = await db.get(id);
    // await db.destroy(id, doc._rev);
  }

  async findAll(filters?: ProjectCostFilters): Promise<ProjectCost[]> {
    // TODO: Implement CouchDB query with filters
    // const db = this.getDb();
    // const selector: any = { type: 'project_cost' };
    
    // if (filters) {
    //   if (filters.projectId) selector.projectId = filters.projectId;
    //   if (filters.costType) selector.costType = filters.costType;
    //   if (filters.status) selector.status = filters.status;
    //   if (filters.supplierName) selector.supplierName = filters.supplierName;
    //   if (filters.startDate) {
    //     selector.invoiceDate = { $gte: filters.startDate.toISOString() };
    //   }
    //   if (filters.endDate) {
    //     selector.invoiceDate = {
    //       ...selector.invoiceDate,
    //       $lte: filters.endDate.toISOString(),
    //     };
    //   }
    // }

    // const result = await db.find({ selector, limit: 1000 });
    // return result.docs as ProjectCost[];

    return [];
  }

  async findByProject(projectId: string): Promise<ProjectCost[]> {
    return this.findAll({ projectId });
  }

  async findByStatus(status: ProjectCostStatus): Promise<ProjectCost[]> {
    return this.findAll({ status });
  }

  async findByType(costType: ProjectCostType): Promise<ProjectCost[]> {
    return this.findAll({ costType });
  }

  async calculateMaterialCosts(projectId: string): Promise<MaterialCostSummary> {
    // Get all project costs for project
    const costs = await this.findByProject(projectId);

    // Calculate totals
    const totalCostEur = costs.reduce(
      (sum, cost) => sum + cost.totalCostEur,
      0,
    );
    const totalWithTaxEur = costs.reduce(
      (sum, cost) => sum + cost.totalWithTaxEur,
      0,
    );

    // Group by cost type
    const costTypeMap = new Map<ProjectCostType, CostTypeSummary>();
    costs.forEach((cost) => {
      const existing = costTypeMap.get(cost.costType) || {
        costType: cost.costType,
        totalCostEur: 0,
        totalWithTaxEur: 0,
        itemCount: 0,
      };

      existing.totalCostEur += cost.totalCostEur;
      existing.totalWithTaxEur += cost.totalWithTaxEur;
      existing.itemCount += 1;

      costTypeMap.set(cost.costType, existing);
    });

    // Group by status
    const statusMap = new Map<ProjectCostStatus, CostStatusSummary>();
    costs.forEach((cost) => {
      const existing = statusMap.get(cost.status) || {
        status: cost.status,
        totalCostEur: 0,
        totalWithTaxEur: 0,
        itemCount: 0,
      };

      existing.totalCostEur += cost.totalCostEur;
      existing.totalWithTaxEur += cost.totalWithTaxEur;
      existing.itemCount += 1;

      statusMap.set(cost.status, existing);
    });

    // Calculate pending payment
    const pendingPaymentEur = costs
      .filter((cost) => cost.status !== ProjectCostStatus.PAID)
      .reduce((sum, cost) => sum + cost.totalWithTaxEur, 0);

    return {
      projectId,
      totalCostEur: Math.round(totalCostEur * 100) / 100,
      totalWithTaxEur: Math.round(totalWithTaxEur * 100) / 100,
      byCostType: Array.from(costTypeMap.values()),
      byStatus: Array.from(statusMap.values()),
      pendingPaymentEur: Math.round(pendingPaymentEur * 100) / 100,
    };
  }

  async findPendingPayment(): Promise<ProjectCost[]> {
    // Get all costs not yet paid
    const allCosts = await this.findAll();
    return allCosts.filter((cost) => cost.status !== ProjectCostStatus.PAID);
  }

  async findBySupplier(supplierName: string): Promise<ProjectCost[]> {
    return this.findAll({ supplierName });
  }
}

