import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto, UpdateActivityDto } from './dto/activity.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type { ActivityType } from './activity.repository';

@Controller('api/v1/activities')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  /**
   * GET /api/v1/activities
   * List all activities (paginated)
   */
  @Get()
  @Permissions({ entity: 'Activity', action: 'READ' })
  async findAll(
    @Query('activityType') activityType?: ActivityType,
    @Query('customerId') customerId?: string,
    @Query('contactId') contactId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.activityService.findAll({
      activityType,
      customerId,
      contactId,
      dateFrom,
      dateTo,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sort: sort || 'date',
      order: order || 'desc',
    });
  }

  /**
   * GET /api/v1/activities/timeline
   * Get activity timeline (chronological list)
   */
  @Get('timeline')
  @Permissions({ entity: 'Activity', action: 'READ' })
  async getTimeline(
    @Query('customerId') customerId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.getTimeline(
      customerId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * GET /api/v1/activities/follow-ups
   * Get activities with pending follow-ups
   */
  @Get('follow-ups')
  @Permissions({ entity: 'Activity', action: 'READ' })
  async findPendingFollowUps(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.findPendingFollowUps({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/activities/feed/:entityId
   * Get audit log feed for any entity
   */
  @Get('feed/:entityId')
  @Permissions({ entity: 'Activity', action: 'READ' })
  async getEntityFeed(
    @Param('entityId') entityId: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.getEntityHistory(
      entityId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * GET /api/v1/activities/customer/:customerId
   * Get activities for a specific customer
   */
  @Get('customer/:customerId')
  @Permissions({ entity: 'Activity', action: 'READ' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('activityType') activityType?: ActivityType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.findByCustomer(customerId, {
      activityType,
      dateFrom,
      dateTo,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/activities/:id
   * Get a specific activity by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Activity', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.activityService.findById(id);
  }

  /**
   * POST /api/v1/activities
   * Create a new activity
   */
  @Post()
  @Permissions({ entity: 'Activity', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateActivityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.activityService.create(dto, user);
  }

  /**
   * PUT /api/v1/activities/:id
   * Update an activity
   */
  @Put(':id')
  @Permissions({ entity: 'Activity', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.activityService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/activities/:id
   * Delete an activity
   */
  @Delete(':id')
  @Permissions({ entity: 'Activity', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.activityService.delete(id, user);
  }
}
