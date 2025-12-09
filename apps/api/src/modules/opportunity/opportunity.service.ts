import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OpportunityRepository, Opportunity } from './opportunity.repository';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
} from './dto/opportunity.dto';

@Injectable()
export class OpportunityService {
  constructor(private readonly opportunityRepository: OpportunityRepository) {}

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

    return this.opportunityRepository.create(
      opportunityData as Partial<Opportunity>,
      user.id,
      user.email,
    );
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

    return this.opportunityRepository.update(
      id,
      dto as Partial<Opportunity>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure opportunity exists
    await this.findById(id);

    return this.opportunityRepository.delete(id, user.id, user.email);
  }
}
