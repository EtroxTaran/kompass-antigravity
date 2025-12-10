import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectMaterialRepository } from './project-material.repository';
import { ProjectMaterialRequirement } from '@kompass/shared';
import { OfferService } from '../offer/offer.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ProjectMaterialService {
  constructor(
    private readonly projectMaterialRepository: ProjectMaterialRepository,
    private readonly offerService: OfferService,
    private readonly projectService: ProjectService,
  ) {}

  async copyFromOffer(
    offerId: string,
    projectId: string,
    user: { id: string; email?: string },
  ) {
    const offer = await this.offerService.findById(offerId);

    if (!offer.lineItems || offer.lineItems.length === 0) {
      return [];
    }

    const requirements = await Promise.all(
      offer.lineItems.map((item) => {
        const estimatedTotalCost = item.quantity * (item.unitPrice || 0);
        return this.projectMaterialRepository.create(
          {
            projectId,
            // materialId: item.materialId, // OfferLineItem might not have materialId if free text? Checking OfferLineItem... it doesn't have it in the shared type I saw.
            // If OfferLineItem doesn't have materialId, we just map description.
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || 'pc',
            status: 'planned',
            estimatedUnitPrice: item.unitPrice || 0,
            estimatedTotalCost,
            sourceOfferId: offer._id,
          },
          user.id,
          user.email,
        );
      }),
    );

    return requirements;
  }

  async create(
    dto: Partial<ProjectMaterialRequirement>,
    user: { id: string; email?: string },
  ): Promise<ProjectMaterialRequirement> {
    // Calculate total cost
    const estimatedTotalCost =
      (dto.quantity || 0) * (dto.estimatedUnitPrice || 0);

    return this.projectMaterialRepository.create(
      {
        ...dto,
        estimatedTotalCost,
        status: dto.status || 'planned',
      } as ProjectMaterialRequirement,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: Partial<ProjectMaterialRequirement>,
    user: { id: string; email?: string },
  ): Promise<ProjectMaterialRequirement> {
    const existing = await this.projectMaterialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Project Material with ID ${id} not found`);
    }

    // Recalculate if quantity or price changes
    let estimatedTotalCost = existing.estimatedTotalCost;
    if (dto.quantity !== undefined || dto.estimatedUnitPrice !== undefined) {
      const quantity =
        dto.quantity !== undefined ? dto.quantity : existing.quantity;
      const unitPrice =
        dto.estimatedUnitPrice !== undefined
          ? dto.estimatedUnitPrice
          : existing.estimatedUnitPrice;
      estimatedTotalCost = quantity * unitPrice;
    }

    const updated = await this.projectMaterialRepository.update(
      id,
      {
        ...dto,
        estimatedTotalCost,
      },
      user.id,
      user.email,
    );

    // Calculate Cost Impact if status changed to 'delivered' or cost changed while delivered
    const wasDelivered = existing.status === 'delivered';
    const isDelivered = updated.status === 'delivered';

    if (isDelivered && !wasDelivered) {
      // New delivery -> Add cost
      await this.projectService.updateActualCost(
        updated.projectId,
        'material',
        updated.estimatedTotalCost, // Using estimated as actual for now if actual not tracked separately
        user.id,
      );
    } else if (!isDelivered && wasDelivered) {
      // Reverted delivery -> Remove cost
      await this.projectService.updateActualCost(
        updated.projectId,
        'material',
        -existing.estimatedTotalCost,
        user.id,
      );
    } else if (isDelivered && wasDelivered) {
      // Updated delivery cost
      const diff = updated.estimatedTotalCost - existing.estimatedTotalCost;
      if (diff !== 0) {
        await this.projectService.updateActualCost(
          updated.projectId,
          'material',
          diff,
          user.id,
        );
      }
    }

    return updated;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    await this.projectMaterialRepository.delete(id, user.id, user.email);
  }

  async findByProject(projectId: string) {
    return this.projectMaterialRepository.findByProject(projectId);
  }

  /**
   * Calculate material costs summary for a project
   * Returns estimated vs actual costs with variance and percentage
   */
  async getMaterialCosts(projectId: string): Promise<{
    estimated: number;
    actual: number;
    variance: number;
    percentUsed: number;
    itemCount: number;
    deliveredCount: number;
  }> {
    const materials =
      await this.projectMaterialRepository.findByProject(projectId);

    let estimated = 0;
    let actual = 0;
    let deliveredCount = 0;

    for (const material of materials) {
      estimated += material.estimatedTotalCost || 0;

      // Actual costs = delivered items (using estimated cost as we don't have actual yet)
      if (material.status === 'delivered') {
        actual += material.estimatedTotalCost || 0;
        deliveredCount++;
      }
    }

    const variance = estimated - actual;
    const percentUsed = estimated > 0 ? (actual / estimated) * 100 : 0;

    return {
      estimated: Math.round(estimated * 100) / 100,
      actual: Math.round(actual * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      percentUsed: Math.round(percentUsed * 10) / 10,
      itemCount: materials.length,
      deliveredCount,
    };
  }
}
