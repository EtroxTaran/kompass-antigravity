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
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ExportService, ExportFormat, ExportOptions } from '../import-export';
import { ImportService, ValidationError } from '../import-export';

@Controller('api/v1/customers')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly exportService: ExportService,
    private readonly importService: ImportService,
  ) {}

  /**
   * GET /api/v1/customers
   * List all customers (paginated)
   */
  @Get()
  @Permissions({ entity: 'Customer', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.customerService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
    });
  }

  /**
   * GET /api/v1/customers/export
   * Export customers to CSV/Excel/JSON
   */
  @Get('export')
  @Permissions({ entity: 'Customer', action: 'READ' })
  async exportCustomers(
    @Res() res: Response,
    @Query('format') format: string = 'csv',
    @Query('fields') fields?: string,
  ) {
    const exportFormat = (format?.toLowerCase() || 'csv') as ExportFormat;
    const validFormats = Object.values(ExportFormat);
    if (!validFormats.includes(exportFormat)) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Invalid Format',
        status: 400,
        detail: `Format must be one of: ${validFormats.join(', ')}`,
      });
    }

    const options: ExportOptions = {
      format: exportFormat,
      fields: fields ? fields.split(',').map((f) => f.trim()) : undefined,
      sheetName: 'Customers',
    };

    // Get all customers (no pagination for export)
    const result = await this.customerService.findAll({ limit: 10000 });
    const customers = result.data;

    const buffer = this.exportService.exportData(customers, options);
    const filename = this.exportService.generateFilename(
      'customers',
      exportFormat,
    );
    const contentType = this.exportService.getContentType(exportFormat);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  /**
   * GET /api/v1/customers/my
   * List customers owned by current user (for ADM role)
   */
  @Get('my')
  @Permissions({ entity: 'Customer', action: 'READ' })
  async findMy(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customerService.findByOwner(user.id, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/customers/search/query
   * Search customers
   */
  @Get('search/query')
  @UseGuards(RbacGuard)
  @Permissions({ entity: 'Customer', action: 'READ' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.customerService.findAll({ search: query, page, limit });
  }

  /**
   * POST /api/v1/customers/import/upload
   * Upload file for customer import
   */
  @Post('import/upload')
  @Permissions({ entity: 'Customer', action: 'CREATE' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImport(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'File Required',
        status: 400,
        detail: 'No file uploaded',
      });
    }

    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Invalid File Type',
        status: 400,
        detail: 'File must be CSV or Excel format (.csv, .xls, .xlsx)',
      });
    }

    const session = this.importService.parseFile(
      file.buffer,
      file.originalname,
    );
    const autoMappings = this.importService.autoDetectMappings(session.headers);

    return {
      importId: session.importId,
      filename: session.filename,
      rowCount: session.rowCount,
      headers: session.headers,
      suggestedMappings: autoMappings,
      status: session.status,
    };
  }

  /**
   * POST /api/v1/customers/import/:importId/map
   * Set field mappings for import
   */
  @Post('import/:importId/map')
  @Permissions({ entity: 'Customer', action: 'CREATE' })
  async mapImportFields(
    @Param('importId') importId: string,
    @Body() body: { mappings: Record<string, string> },
  ) {
    const session = this.importService.setMappings(importId, body.mappings);
    return {
      importId: session.importId,
      mappings: session.mappings,
      status: session.status,
    };
  }

  /**
   * POST /api/v1/customers/import/:importId/validate
   * Validate import data
   */
  @Post('import/:importId/validate')
  @Permissions({ entity: 'Customer', action: 'CREATE' })
  async validateImport(@Param('importId') importId: string) {
    const validator = (row: Record<string, any>): ValidationError[] => {
      const errors: ValidationError[] = [];

      // Required field: companyName
      if (!row.companyName || String(row.companyName).trim().length < 2) {
        errors.push({
          row: 0,
          field: 'companyName',
          message: 'Company name is required (min 2 characters)',
          value: row.companyName,
          status: 'error',
        });
      }

      // Required fields: billingAddress
      if (!row.billingAddress?.street) {
        errors.push({
          row: 0,
          field: 'billingAddress.street',
          message: 'Street is required',
          value: row.billingAddress?.street,
          status: 'error',
        });
      }

      if (!row.billingAddress?.zipCode) {
        errors.push({
          row: 0,
          field: 'billingAddress.zipCode',
          message: 'ZIP code is required',
          value: row.billingAddress?.zipCode,
          status: 'error',
        });
      }

      if (!row.billingAddress?.city) {
        errors.push({
          row: 0,
          field: 'billingAddress.city',
          message: 'City is required',
          value: row.billingAddress?.city,
          status: 'error',
        });
      }

      // Optional validation: VAT number format
      if (row.vatNumber && !/^DE\d{9}$/.test(row.vatNumber)) {
        errors.push({
          row: 0,
          field: 'vatNumber',
          message: 'VAT number must be in format DE123456789',
          value: row.vatNumber,
          status: 'warning',
        });
      }

      // Optional validation: email format
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push({
          row: 0,
          field: 'email',
          message: 'Invalid email format',
          value: row.email,
          status: 'warning',
        });
      }

      return errors;
    };

    const session = this.importService.getSession(importId);
    if (!session) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Import Session Not Found',
        status: 400,
        detail: `Import session ${importId} not found`,
      });
    }

    const result = this.importService.validateData(importId, validator);

    return {
      importId,
      totalRows: session.rowCount,
      validRows: result.validRows,
      invalidRows: result.invalidRows,
      validationResults: result.errors.slice(0, 100), // Limit to first 100 errors
      status: 'validated',
    };
  }

  /**
   * POST /api/v1/customers/import/:importId/execute
   * Execute the import
   */
  @Post('import/:importId/execute')
  @Permissions({ entity: 'Customer', action: 'CREATE' })
  async executeImport(
    @Param('importId') importId: string,
    @Body() body: { skipErrors?: boolean },
    @CurrentUser() user: any,
  ) {
    const session = this.importService.getSession(importId);
    if (!session) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Import Session Not Found',
        status: 400,
        detail: `Import session ${importId} not found`,
      });
    }

    const mappedRows = this.importService.getMappedRows(importId);
    let importedCount = 0;
    let errorCount = 0;
    const errors: ValidationError[] = [];

    for (let i = 0; i < mappedRows.length; i++) {
      const row = mappedRows[i];
      try {
        // Ensure required fields exist
        if (!row.companyName || !row.billingAddress?.street) {
          if (!body.skipErrors) {
            throw new Error('Missing required fields');
          }
          errorCount++;
          continue;
        }

        await this.customerService.create(row as CreateCustomerDto, user);
        importedCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          row: i + 2,
          field: 'general',
          message: error.message,
          value: null,
          status: 'error',
        });

        if (!body.skipErrors) {
          break;
        }
      }
    }

    // Cleanup session
    this.importService.cleanupSession(importId);

    return {
      importId,
      importedCount,
      skippedCount: session.rowCount - importedCount - errorCount,
      errorCount,
      duplicateCount: 0,
      status: 'completed',
      errors: errors.slice(0, 50),
    };
  }

  /**
   * GET /api/v1/customers/:id
   * Get a specific customer by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Customer', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  /**
   * POST /api/v1/customers
   * Create a new customer
   */
  @Post()
  @Permissions({ entity: 'Customer', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerDto, @CurrentUser() user: any) {
    return this.customerService.create(dto, user);
  }

  /**
   * PUT /api/v1/customers/:id
   * Update an existing customer
   */
  @Put(':id')
  @Permissions({ entity: 'Customer', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: any,
  ) {
    return this.customerService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/customers/:id
   * Delete a customer
   */
  @Delete(':id')
  @Permissions({ entity: 'Customer', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.customerService.delete(id, user);
  }

  /**
   * POST /api/v1/customers/check-duplicates
   * Check for duplicate customers
   */
  @Post('check-duplicates')
  @Permissions({ entity: 'Customer', action: 'READ' })
  async checkDuplicates(
    @Body()
    criteria: {
      name?: string;
      email?: string;
      phone?: string;
      excludeId?: string;
    },
  ) {
    return this.customerService.checkDuplicates(criteria, criteria.excludeId);
  }
}
