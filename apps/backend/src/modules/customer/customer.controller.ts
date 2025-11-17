/**
 * Customer Controller
 *
 * Handles HTTP requests for Customer management
 *
 * All endpoints require:
 * - JwtAuthGuard: User must be authenticated
 * - RbacGuard: User must have required permissions
 *
 * Permissions:
 * - Customer.CREATE: ADM (own customers), PLAN, GF
 * - Customer.READ: ADM (own customers), PLAN, GF, BUCH (financial data)
 * - Customer.UPDATE: ADM (own customers), PLAN, GF, BUCH (financial fields only)
 * - Customer.DELETE: GF only
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

import { type PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import { User } from '@kompass/shared/types/entities/user';
import { CustomerRating } from '@kompass/shared/types/enums';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import type { CustomerFilters } from './customer.repository.interface';
import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer Controller
 */
@Controller('api/v1/customers')
@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Create a new customer
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new customer',
    description:
      'Creates a new customer. ADM users will automatically own the customer. ' +
      'Duplicate detection is performed on company name (fuzzy) and VAT number (exact).',
  })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Company name must be 2-200 characters',
        errors: [
          {
            field: 'companyName',
            message: 'Company name must be 2-200 characters',
            value: 'A',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate customer detected',
    schema: {
      example: {
        type: 'https://api.kompass.de/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail:
          'Potential duplicate customer detected: Test GmbH (vat, 100% match). Please review before creating.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @RequirePermission('Customer', 'CREATE')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() user: User
  ): Promise<CustomerResponseDto> {
    return this.customerService.create(createCustomerDto, user);
  }

  /**
   * List all customers (with pagination and filters)
   */
  @Get()
  @ApiOperation({
    summary: 'List customers',
    description:
      'Retrieves a list of customers. ADM users see only their own customers. ' +
      'PLAN and GF users see all customers. Results can be filtered and paginated.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by company name (partial match)',
    example: 'Müller',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    enum: ['A', 'B', 'C'],
    description: 'Filter by customer rating',
  })
  @ApiQuery({
    name: 'customerType',
    required: false,
    enum: ['prospect', 'active', 'inactive', 'archived'],
    description: 'Filter by customer type',
  })
  @ApiQuery({
    name: 'vatNumber',
    required: false,
    description: 'Filter by VAT number (exact match)',
    example: 'DE123456789',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 20, max: 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['companyName', 'createdAt', 'modifiedAt', 'rating', 'customerType'],
    description: 'Field to sort by (default: companyName)',
    example: 'companyName',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction (default: asc)',
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CustomerResponseDto' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 20 },
            total: { type: 'number', example: 150 },
            totalPages: { type: 'number', example: 8 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @RequirePermission('Customer', 'READ')
  async findAll(
    @Query('search') search?: string,
    @Query('rating') rating?: CustomerRating,
    @Query('customerType') customerType?: string,
    @Query('vatNumber') vatNumber?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @CurrentUser() user?: User
  ): Promise<PaginatedResponse<CustomerResponseDto>> {
    // Build filters from query parameters
    const filters: CustomerFilters = {
      ...(search && { search }),
      ...(rating && { rating }),
      ...(customerType && {
        customerType: customerType as Customer['customerType'],
      }),
      ...(vatNumber && { vatNumber }),
    };

    // Parse and validate pagination parameters
    const pageNumber = page ? Math.max(1, Number(page)) : undefined;
    const pageSizeNumber = pageSize
      ? Math.min(100, Math.max(1, Number(pageSize)))
      : undefined;

    // Call service with pagination and sorting
    return this.customerService.findAll(
      user!,
      filters,
      pageNumber,
      pageSizeNumber,
      sortBy,
      sortOrder
    );
  }

  /**
   * Get a single customer by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by ID',
    description:
      'Retrieves a single customer by ID. ADM users can only access their own customers. ' +
      'PLAN and GF users can access any customer.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: 'customer-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or not owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @RequirePermission('Customer', 'READ')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<CustomerResponseDto> {
    return this.customerService.findById(id, user);
  }

  /**
   * Update a customer
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update customer',
    description:
      'Updates an existing customer. ADM users can only update their own customers. ' +
      'PLAN and GF users can update any customer. Duplicate detection is performed if company name or VAT number changes.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: 'customer-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate customer detected or document conflict',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or not owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @RequirePermission('Customer', 'UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: User
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, updateCustomerDto, user);
  }

  /**
   * Delete a customer
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete customer',
    description:
      'Deletes a customer. Only GF users can delete customers. ' +
      'This operation is logged in the audit trail.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: 'customer-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 204,
    description: 'Customer deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only GF can delete customers',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @RequirePermission('Customer', 'DELETE')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.customerService.delete(id, user);
  }
}
