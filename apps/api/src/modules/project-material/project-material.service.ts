import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectMaterialRepository } from './project-material.repository';
import { ProjectMaterialRequirement } from '@kompass/shared';
import { OfferService } from '../offer/offer.service';

@Injectable()
export class ProjectMaterialService {
    constructor(
        private readonly projectMaterialRepository: ProjectMaterialRepository,
        private readonly offerService: OfferService,
    ) { }

    async copyFromOffer(offerId: string, projectId: string, user: { id: string; email?: string }) {
        const offer = await this.offerService.findById(offerId);

        if (!offer.lineItems || offer.lineItems.length === 0) {
            return [];
        }

        const requirements = await Promise.all(
            offer.lineItems.map((item) => {
                const estimatedTotalCost = item.quantity * (item.unitPrice || 0);
                return this.projectMaterialRepository.create({
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
                }, user.id, user.email);
            })
        );

        return requirements;
    }

    async create(
        dto: Partial<ProjectMaterialRequirement>,
        user: { id: string; email?: string }
    ): Promise<ProjectMaterialRequirement> {
        // Calculate total cost
        const estimatedTotalCost = (dto.quantity || 0) * (dto.estimatedUnitPrice || 0);

        return this.projectMaterialRepository.create({
            ...dto,
            estimatedTotalCost,
            status: dto.status || 'planned',
        } as ProjectMaterialRequirement, user.id, user.email);
    }

    async update(
        id: string,
        dto: Partial<ProjectMaterialRequirement>,
        user: { id: string; email?: string }
    ): Promise<ProjectMaterialRequirement> {
        const existing = await this.projectMaterialRepository.findById(id);
        if (!existing) {
            throw new NotFoundException(`Project Material with ID ${id} not found`);
        }

        // Recalculate if quantity or price changes
        let estimatedTotalCost = existing.estimatedTotalCost;
        if (dto.quantity !== undefined || dto.estimatedUnitPrice !== undefined) {
            const quantity = dto.quantity !== undefined ? dto.quantity : existing.quantity;
            const unitPrice = dto.estimatedUnitPrice !== undefined ? dto.estimatedUnitPrice : existing.estimatedUnitPrice;
            estimatedTotalCost = quantity * unitPrice;
        }

        return this.projectMaterialRepository.update(id, {
            ...dto,
            estimatedTotalCost
        }, user.id, user.email);
    }

    async delete(id: string, user: { id: string; email?: string }): Promise<void> {
        await this.projectMaterialRepository.delete(id, user.id, user.email);
    }

    async findByProject(projectId: string) {
        return this.projectMaterialRepository.findByProject(projectId);
    }
}
