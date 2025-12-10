import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProjectSubcontractorRepository } from './project-subcontractor.repository';
import {
  AssignSubcontractorDto,
  UpdateAssignmentDto,
  RateSubcontractorDto,
  ProjectSubcontractor,
  SubcontractorStatus,
  BudgetStatus,
} from '@kompass/shared';
// We should use ModuleRef or forwardRef if circular deps, but typically we inject other services.
// We need ProjectService to check budget and SupplierService to check status.
import { ProjectService } from '../project/project.service';
import { SupplierService } from '../supplier/supplier.service';

@Injectable()
export class ProjectSubcontractorService {
  constructor(
    private readonly repository: ProjectSubcontractorRepository,
    private readonly projectService: ProjectService,
    private readonly supplierService: SupplierService,
  ) {}

  async assign(
    dto: AssignSubcontractorDto,
    user: { id: string; email?: string },
  ): Promise<ProjectSubcontractor> {
    // 1. Validate Supplier
    const supplier = await this.supplierService.findById(dto.supplierId);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    if (supplier.status !== 'Active') {
      throw new BadRequestException(
        `Supplier is not Active (Current status: ${supplier.status})`,
      );
    }

    // 2. Check Project Budget
    const project = await this.projectService.findById(dto.projectId);
    if (!project) throw new NotFoundException('Project not found');

    // Simple check: Warn if budget exceeded but allow assignment (as per requirements "Warning flag but don't block")
    // Note: We'll calculate initial budget status for the assignment
    let budgetStatus = BudgetStatus.OnTrack;
    const remainingBudget =
      (project.budget || 0) - (project.actualTotalCost || 0);

    if (dto.estimatedCost > remainingBudget) {
      budgetStatus = BudgetStatus.Warning;
      // In a real app we might throw if strict, but spec says "Warning flag"
    }

    // 3. Create Assignment
    const assignment: Partial<ProjectSubcontractor> = {
      ...dto,
      status: SubcontractorStatus.Planned,
      completionPercentage: 0,
      budgetStatus,
      // dates are strings in shared type, so passing dto directly is fine if they are ISO strings
    };

    const created = await this.repository.create(
      assignment,
      user.id,
      user.email,
    );

    // 4. Update Supplier activeProjectCount
    // Need a method in SupplierService to increment/active count.
    // Assuming it doesn't exist yet based on spec plan, I might need to add it or do manual update.
    // For now, I will try to call a method I'll implement or use Generic update for now if allowed.
    // Ideally SupplierService should have incrementActiveProjects.
    // I'll assume I can just update the supplier for now.
    const activeCount = (supplier.activeProjectCount || 0) + 1;
    await this.supplierService.update(
      supplier._id,
      { activeProjectCount: activeCount },
      user,
    );

    return created;
  }

  async findAll(options: { page?: number; limit?: number } = {}) {
    return this.repository.findAll(options);
  }

  async findByProject(projectId: string) {
    return this.repository.findByProject(projectId, { limit: 100 });
  }

  async findById(id: string): Promise<ProjectSubcontractor> {
    const found = await this.repository.findById(id);
    if (!found) throw new NotFoundException('Assignment not found');
    return found;
  }

  async update(
    id: string,
    dto: UpdateAssignmentDto,
    user: { id: string; email?: string },
  ): Promise<ProjectSubcontractor> {
    const existing = await this.findById(id);

    // Auto-transition logic
    let status = dto.status || existing.status;
    const completionPercentage =
      dto.completionPercentage ?? existing.completionPercentage;

    if (
      dto.completionPercentage !== undefined &&
      dto.completionPercentage > 0 &&
      dto.completionPercentage < 100 &&
      status === SubcontractorStatus.Planned
    ) {
      status = SubcontractorStatus.InProgress;
    }

    if (
      dto.completionPercentage === 100 &&
      status !== SubcontractorStatus.Completed
    ) {
      status = SubcontractorStatus.Completed;
      // Could decrease active count here or wait for explicit close?
      // Spec says: "Updates supplier activeProjectCount -= 1" on completion.
      if (existing.status !== SubcontractorStatus.Completed) {
        const supplier = await this.supplierService.findById(
          existing.supplierId,
        );
        if (supplier) {
          const activeCount = Math.max(
            0,
            (supplier.activeProjectCount || 1) - 1,
          );
          await this.supplierService.update(
            supplier._id,
            { activeProjectCount: activeCount },
            user,
          );
        }
      }
    }

    const updated = await this.repository.update(
      id,
      { ...dto, status, completionPercentage },
      user.id,
      user.email,
    );
    return updated;
  }

  async rate(
    id: string,
    dto: RateSubcontractorDto,
    user: { id: string; email?: string },
  ): Promise<ProjectSubcontractor> {
    const assignment = await this.findById(id);
    if (assignment.status !== SubcontractorStatus.Completed) {
      throw new BadRequestException('Cannot rate incomplete assignment');
    }

    const updated = await this.repository.update(
      id,
      {
        qualityRating: dto.qualityRating,
        timelinessRating: dto.timelinessRating,
        communicationRating: dto.communicationRating,
      },
      user.id,
      user.email,
    );

    // Propagate to Supplier Rating
    // Calculate PriceValue based on budget adherence
    // 5 stars if on budget (<= estimated), 4 stars if <= 110%, 3 stars otherwise
    let priceRating = 3;
    if (assignment.actualCost && assignment.estimatedCost) {
      const ratio = assignment.actualCost / assignment.estimatedCost;
      if (ratio <= 1.0) priceRating = 5;
      else if (ratio <= 1.1) priceRating = 4;
    }

    await this.supplierService.submitRating(
      assignment.supplierId,
      {
        quality: dto.qualityRating,
        reliability: dto.timelinessRating,
        communication: dto.communicationRating,
        priceValue: priceRating,
      } as any,
      user,
    );

    return updated;
  }
}
