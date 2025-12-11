import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ActivityRepository,
  Activity,
  ActivityQueryOptions,
} from './activity.repository';
import { CreateActivityDto, UpdateActivityDto } from './dto/activity.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { CustomerRepository } from '../customer/customer.repository';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async findAll(options: ActivityQueryOptions = {}) {
    return this.activityRepository.findAll(options);
  }

  async findById(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Activity with ID '${id}' not found`,
        resourceType: 'Activity',
        resourceId: id,
      });
    }
    return activity;
  }

  async findByCustomer(customerId: string, options: ActivityQueryOptions = {}) {
    // Verify customer exists
    await this.verifyCustomerExists(customerId);
    return this.activityRepository.findByCustomer(customerId, options);
  }

  async findByContact(contactId: string, options: ActivityQueryOptions = {}) {
    return this.activityRepository.findByContact(contactId, options);
  }

  async getTimeline(customerId?: string, limit: number = 50) {
    if (customerId) {
      await this.verifyCustomerExists(customerId);
    }
    return this.activityRepository.getTimeline(customerId, limit);
  }

  async findPendingFollowUps(options: ActivityQueryOptions = {}) {
    return this.activityRepository.findPendingFollowUps(options);
  }

  async getEntityHistory(entityId: string, limit: number = 50) {
    return this.activityRepository.getEntityHistory(entityId, limit);
  }

  async create(
    dto: CreateActivityDto,
    user: AuthenticatedUser,
  ): Promise<Activity> {
    // Verify customer exists
    await this.verifyCustomerExists(dto.customerId);

    // Validate follow-up date is in the future
    if (dto.followUpDate) {
      const followUp = new Date(dto.followUpDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (followUp < today) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'Follow-up date cannot be in the past',
          errors: [
            {
              field: 'followUpDate',
              message: 'Follow-up date cannot be in the past',
              value: dto.followUpDate,
            },
          ],
        });
      }
    }

    // Set upload timestamp for attachments
    const attachments = dto.attachments?.map((att) => ({
      ...att,
      uploadedAt: att.uploadedAt || new Date().toISOString(),
    }));

    const activityData: Partial<Activity> = {
      ...dto,
      attachments,
    };

    return this.activityRepository.create(activityData, user.id, user.email);
  }

  async update(
    id: string,
    dto: UpdateActivityDto,
    user: AuthenticatedUser,
  ): Promise<Activity> {
    // Ensure activity exists
    await this.findById(id);

    // Verify customer if being updated
    if (dto.customerId) {
      await this.verifyCustomerExists(dto.customerId);
    }

    // Set upload timestamp for new attachments
    if (dto.attachments) {
      dto.attachments = dto.attachments.map((att) => ({
        ...att,
        uploadedAt: att.uploadedAt || new Date().toISOString(),
      }));
    }

    return this.activityRepository.update(
      id,
      dto as Partial<Activity>,
      user.id,
      user.email,
    );
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    // Ensure activity exists
    await this.findById(id);
    return this.activityRepository.delete(id, user.id, user.email);
  }

  private async verifyCustomerExists(customerId: string): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Customer with ID '${customerId}' not found`,
        resourceType: 'Customer',
        resourceId: customerId,
      });
    }
  }
}
