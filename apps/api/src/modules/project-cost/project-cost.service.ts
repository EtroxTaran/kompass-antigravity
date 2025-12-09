import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectCostRepository } from './project-cost.repository';
import { ProjectCost } from '@kompass/shared';

export class CreateProjectCostDto {
  projectId: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  costType: 'material' | 'labor' | 'external' | 'misc';
  status: 'planned' | 'incurred' | 'paid';
  invoiceId?: string;
}

export class UpdateProjectCostDto {
  description?: string;
  amount?: number;
  currency?: string;
  date?: string;
  costType?: 'material' | 'labor' | 'external' | 'misc';
  status?: 'planned' | 'incurred' | 'paid';
  invoiceId?: string;
}

@Injectable()
export class ProjectCostService {
  constructor(private readonly projectCostRepository: ProjectCostRepository) {}

  async create(
    createDto: CreateProjectCostDto,
    userId: string,
  ): Promise<ProjectCost> {
    const cost: ProjectCost = {
      _id: `project-cost-${Date.now()}`,
      type: 'project-cost',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: userId,
      modifiedBy: userId,
      version: 1,
      ...createDto,
    };
    return this.projectCostRepository.create(cost, userId);
  }

  async findAll(projectId?: string): Promise<ProjectCost[]> {
    if (projectId) {
      return (await this.projectCostRepository.findBySelector({ projectId }))
        .data;
    }
    return (await this.projectCostRepository.findAll()).data;
  }

  async findOne(id: string): Promise<ProjectCost> {
    const cost = await this.projectCostRepository.findById(id);
    if (!cost) {
      throw new NotFoundException(`Project Cost with ID ${id} not found`);
    }
    return cost;
  }

  async update(
    id: string,
    updateDto: UpdateProjectCostDto,
    userId: string,
  ): Promise<ProjectCost> {
    return this.projectCostRepository.update(id, updateDto, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.projectCostRepository.delete(id, userId);
  }
}
