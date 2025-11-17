/**
 * Location Controller
 *
 * Handles HTTP requests for Location management
 * Implements nested REST API pattern: /customers/{customerId}/locations
 *
 * All endpoints require:
 * - JwtAuthGuard: User must be authenticated
 * - RbacGuard: User must have required permissions
 *
 * Permissions:
 * - Location.CREATE: GF, PLAN, ADM (own customers)
 * - Location.READ: All roles
 * - Location.UPDATE: GF, PLAN, ADM (own customers)
 * - Location.DELETE: GF, PLAN
 */

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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { LocationType } from '@kompass/shared/types/enums';

import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import type { User } from '@kompass/shared/types/entities/user';

const SORTABLE_LOCATION_FIELDS = [
  'locationName',
  'locationType',
  'customerId',
] as const;
type SortableLocationField = (typeof SORTABLE_LOCATION_FIELDS)[number];
const isSortableLocationField = (
  value?: string
): value is SortableLocationField =>
  !!value && (SORTABLE_LOCATION_FIELDS as readonly string[]).includes(value);

/**
 * Location Controller
 */
@Controller('api/v1/customers/:customerId/locations')
@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * Create new location for customer
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new location for customer',
    description:
      'Creates a new delivery location with address and operational details. Location names must be unique within a customer. ' +
      'Requires Location.CREATE permission. ADM users can only create locations for their own customers.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    example: 'customer-12345',
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: 201,
    description: 'Location created successfully',
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or not customer owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - location name already exists for this customer',
  })
  @RequirePermission('Location', 'CREATE')
  async createLocation(
    @Param('customerId') customerId: string,
    @Body() createLocationDto: CreateLocationDto,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto> {
    return this.locationService.create(customerId, createLocationDto, user);
  }

  /**
   * List all locations for a customer
   */
  @Get()
  @ApiOperation({
    summary: 'List all locations for customer',
    description:
      'Retrieves all delivery locations for a specific customer with optional filtering by type and active status.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    example: 'customer-12345',
  })
  @ApiQuery({
    name: 'locationType',
    required: false,
    enum: LocationType,
    description: 'Filter by location type',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort field (default: locationName)',
    example: 'locationName',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: asc)',
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Locations retrieved successfully',
    type: [LocationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @RequirePermission('Location', 'READ')
  async listLocations(
    @Param('customerId') customerId: string,
    @Query('locationType') locationType: LocationType | undefined,
    @Query('isActive') isActive: boolean | undefined,
    @Query('sort') sort: string | undefined,
    @Query('order') order: 'asc' | 'desc' | undefined,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto[]> {
    let locations = await this.locationService.findByCustomer(customerId, user);

    // Apply filters
    if (locationType) {
      locations = locations.filter((loc) => loc.locationType === locationType);
    }

    if (isActive !== undefined) {
      locations = locations.filter((loc) => loc.isActive === isActive);
    }

    // Apply sorting
    const sortField: SortableLocationField = isSortableLocationField(sort)
      ? sort
      : 'locationName';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    locations.sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    return locations;
  }

  /**
   * Get a single location
   */
  @Get(':locationId')
  @ApiOperation({
    summary: 'Get location by ID',
    description: 'Retrieves a specific location with full details.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    example: 'customer-12345',
  })
  @ApiParam({
    name: 'locationId',
    description: 'Location ID',
    example: 'location-67890',
  })
  @ApiResponse({
    status: 200,
    description: 'Location found',
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Location or Customer not found',
  })
  @RequirePermission('Location', 'READ')
  async getLocation(
    @Param('customerId') customerId: string,
    @Param('locationId') locationId: string,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto> {
    return this.locationService.findOne(customerId, locationId, user);
  }

  /**
   * Update a location
   */
  @Put(':locationId')
  @ApiOperation({
    summary: 'Update location',
    description:
      'Updates an existing location. Location names must remain unique within the customer. ' +
      'Requires Location.UPDATE permission. ADM users can only update locations for their own customers.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
  })
  @ApiParam({
    name: 'locationId',
    description: 'Location ID',
  })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({
    status: 200,
    description: 'Location updated successfully',
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or not customer owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Location or Customer not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - location name already exists',
  })
  @RequirePermission('Location', 'UPDATE')
  async updateLocation(
    @Param('customerId') customerId: string,
    @Param('locationId') locationId: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto> {
    return this.locationService.update(
      customerId,
      locationId,
      updateLocationDto,
      user
    );
  }

  /**
   * Delete a location
   */
  @Delete(':locationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete location',
    description:
      'Deletes a location. Cannot delete if location is referenced in active projects or quotes. ' +
      'Requires Location.DELETE permission (PLAN, GF only).',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
  })
  @ApiParam({
    name: 'locationId',
    description: 'Location ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Location deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only PLAN and GF can delete locations',
  })
  @ApiResponse({
    status: 404,
    description: 'Location or Customer not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - location is referenced in active projects or quotes',
  })
  @RequirePermission('Location', 'DELETE')
  async deleteLocation(
    @Param('customerId') customerId: string,
    @Param('locationId') locationId: string,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.locationService.delete(customerId, locationId, user);
  }
}
