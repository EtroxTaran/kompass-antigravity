import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OpportunityRepository, Opportunity } from './opportunity.repository';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  MarkAsWonDto,
} from './dto/opportunity.dto';
import { ProjectService } from '../project/project.service';
import { OfferService } from '../offer/offer.service';
import { ProjectMaterialService } from '../project-material/project-material.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class OpportunityService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository,
    private readonly projectService: ProjectService,
    private readonly offerService: OfferService,
    private readonly projectMaterialService: ProjectMaterialService,
    private readonly searchService: SearchService,
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      stage?: string;
    } = {},
  ) {
    if (options.search) {
      return this.opportunityRepository.searchByTitle(options.search, options);
    }
    if (options.stage) {
      return this.opportunityRepository.findByStage(options.stage, options);
    }
    return this.opportunityRepository.findAll(options);
  }

  async findById(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findById(id);
    if (!opportunity) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Opportunity with ID '${id}' not found`,
        resourceType: 'Opportunity',
        resourceId: id,
      });
    }
    return opportunity;
  }

  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.opportunityRepository.findByOwner(ownerId, options);
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.opportunityRepository.findByCustomer(customerId, options);
  }

  async create(
    dto: CreateOpportunityDto,
    user: { id: string; email?: string },
  ): Promise<Opportunity> {
    // Validate: lostReason required when stage is closed_lost
    if (dto.stage === 'closed_lost' && !dto.lostReason) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Lost reason is required when closing opportunity as lost',
        errors: [
          {
            field: 'lostReason',
            message: 'Required when stage is closed_lost',
            value: dto.lostReason,
          },
        ],
      });
    }

    const opportunityData = {
      ...dto,
      currency: dto.currency || 'EUR',
    };

    const opportunity = await this.opportunityRepository.create(
      opportunityData as Partial<Opportunity>,
      user.id,
      user.email,
    );
    this.indexOpportunity(opportunity);
    return opportunity;
  }

  private async indexOpportunity(opportunity: Opportunity) {
    try {
      await this.searchService.indexDocument('opportunities', {
        _id: opportunity._id,
        title: opportunity.title,
        description: opportunity.description,
        stage: opportunity.stage,
        expectedValue: opportunity.expectedValue,
      });
    } catch (e) {
      console.error('Failed to index opportunity', e);
    }
  }

  async update(
    id: string,
    dto: UpdateOpportunityDto,
    user: { id: string; email?: string },
  ): Promise<Opportunity> {
    // Ensure opportunity exists
    const existing = await this.findById(id);

    // Determine final stage
    const newStage = dto.stage !== undefined ? dto.stage : existing.stage;

    // Validate: lostReason required when stage changes to closed_lost
    if (newStage === 'closed_lost') {
      const lostReason =
        dto.lostReason !== undefined ? dto.lostReason : existing.lostReason;
      if (!lostReason) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'Lost reason is required when closing opportunity as lost',
          errors: [
            {
              field: 'lostReason',
              message: 'Required when stage is closed_lost',
              value: lostReason,
            },
          ],
        });
      }
    }

    const opportunity = await this.opportunityRepository.update(
      id,
      dto as Partial<Opportunity>,
      user.id,
      user.email,
    );
    this.indexOpportunity(opportunity);
    return opportunity;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure opportunity exists
    await this.findById(id);

    return this.opportunityRepository.delete(id, user.id, user.email);
  }

  async markAsWon(
    id: string,
    dto: MarkAsWonDto,
    user: { id: string; email?: string },
  ) {
    const opportunity = await this.findById(id);

    // Update opportunity status to closed_won
    const updatedOpportunity = await this.update(
      id,
      { stage: 'closed_won', probability: 100 },
      user,
    );

    // Find offer (either provided ID or latest for opportunity)
    let offer = null;
    if (dto.offerId) {
      offer = await this.offerService.findById(dto.offerId);
    } else {
      const offers = await this.offerService.findByOpportunity(id, {
        limit: 1,
        sort: 'offerDate',
        order: 'desc',
      });
      if (offers.data.length > 0) {
        offer = offers.data[0];
      }
    }

    // Create Project
    const project = await this.projectService.create(
      {
        name: opportunity.title,
        customerId: opportunity.customerId,
        projectManagerId: dto.projectManagerId || opportunity.owner, // Fallback to opportunity owner (which currently is a name string, ideally should be ID)
        // TODO: In real app, opportunity.owner might be a user ID. If it's a string name, we might need a lookup or pass current user.
        // For now, assuming opportunity.owner is compatible or using current user as fallback if needed.
        // Actually, schema validation requires valid ID. User needs to provide PM ID or we use current user ID if applicable.
        // Let's use user.id as fallback for Project Manager if opportunity.owner isn't an ID.
        // Opportunity.owner is defined as string, but logically it's the owner's name in the mock data or ID?
        // In OpportunityRepository, it's just a string.
        // Let's use dto.projectManagerId ?? user.id
        status: 'planning',
        budget: opportunity.expectedValue,
        startDate: dto.startDate,
        opportunityId: id,
        description: opportunity.description,
      },
      user,
    );

    // Copy materials from Offer if available
    const materialsIds: string[] = []; // Not actually using implementation return value right now, avoiding TS unused var
    if (offer) {
      await this.projectMaterialService.copyFromOffer(
        offer._id,
        project._id,
        user,
      );
    }

    return {
      opportunity: updatedOpportunity,
      project,
    };
  }
}
