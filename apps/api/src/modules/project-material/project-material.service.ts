import { Injectable } from '@nestjs/common';
import { ProjectMaterialRepository, ProjectMaterialRequirement } from './project-material.repository';
import { OfferService } from '../offer/offer.service';

@Injectable()
export class ProjectMaterialService {
    constructor(
        private readonly projectMaterialRepository: ProjectMaterialRepository,
        private readonly offerService: OfferService,
    ) { }

    async copyFromOffer(offerId: string, projectId: string, user: { id: string; email?: string }) {
        const offer = await this.offerService.findById(offerId);

        if (!offer.materials || offer.materials.length === 0) {
            return [];
        }

        const requirements = await Promise.all(
            offer.materials.map((material) =>
                this.projectMaterialRepository.create({
                    projectId,
                    materialId: material.materialId,
                    description: material.description,
                    quantity: material.quantity,
                    unit: material.unit,
                    status: 'planned',
                    sourceOfferId: offer._id,
                }, user.id, user.email)
            )
        );

        return requirements;
    }

    async findByProject(projectId: string) {
        return this.projectMaterialRepository.findByProject(projectId);
    }
}
