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
import { OpportunityService } from './opportunity.service';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
} from './dto/opportunity.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/opportunities')
@UseGuards(JwtAuthGuard, RbacGuard)
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  /**
   * GET /api/v1/opportunities
   * List all opportunities (paginated)
   */
  @Get()
  @Permissions({ entity: 'Opportunity', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('stage') stage?: string,
  ) {
    return this.opportunityService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      stage,
    });
  }

  /**
   * GET /api/v1/opportunities/my
   * List opportunities owned by current user
   */
  @Get('my')
  @Permissions({ entity: 'Opportunity', action: 'READ' })
  async findMy(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.opportunityService.findByOwner(user.id, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/opportunities/:id
   * Get a specific opportunity by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Opportunity', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.opportunityService.findById(id);
  }

  /**
   * POST /api/v1/opportunities
   * Create a new opportunity
   */
  @Post()
  @Permissions({ entity: 'Opportunity', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOpportunityDto, @CurrentUser() user: any) {
    return this.opportunityService.create(dto, user);
  }

  /**
   * PUT /api/v1/opportunities/:id
   * Update an existing opportunity
   */
  @Put(':id')
  @Permissions({ entity: 'Opportunity', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
    @CurrentUser() user: any,
  ) {
    return this.opportunityService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/opportunities/:id
   * Delete an opportunity
   */
  @Delete(':id')
  @Permissions({ entity: 'Opportunity', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.opportunityService.delete(id, user);
  }
}
