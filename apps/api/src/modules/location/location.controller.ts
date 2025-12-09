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
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1')
@UseGuards(JwtAuthGuard, RbacGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * GET /api/v1/locations
   * List all locations (paginated)
   */
  @Get('locations')
  @Permissions({ entity: 'Location', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('locationType') locationType?: string,
  ) {
    return this.locationService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      locationType,
    });
  }

  /**
   * GET /api/v1/customers/:customerId/locations
   * List locations for a specific customer
   */
  @Get('customers/:customerId/locations')
  @Permissions({ entity: 'Location', action: 'READ' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.locationService.findByCustomer(customerId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/locations/:id
   * Get a specific location by ID
   */
  @Get('locations/:id')
  @Permissions({ entity: 'Location', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.locationService.findById(id);
  }

  /**
   * POST /api/v1/locations
   * Create a new location
   */
  @Post('locations')
  @Permissions({ entity: 'Location', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateLocationDto, @CurrentUser() user: any) {
    return this.locationService.create(dto, user);
  }

  /**
   * PUT /api/v1/locations/:id
   * Update an existing location
   */
  @Put('locations/:id')
  @Permissions({ entity: 'Location', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
    @CurrentUser() user: any,
  ) {
    return this.locationService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/locations/:id
   * Delete a location
   */
  @Delete('locations/:id')
  @Permissions({ entity: 'Location', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.locationService.delete(id, user);
  }
}
