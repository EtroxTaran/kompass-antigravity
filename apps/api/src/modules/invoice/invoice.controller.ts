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
} from '@nestjs/common';
import type { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ExportService } from '../import-export/export.service';
import { ExportFormat } from '../import-export/dto/export.dto';
import { InvoiceRepository } from './invoice.repository';

@Controller('api/v1/invoices')
@UseGuards(JwtAuthGuard, RbacGuard)
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly exportService: ExportService,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @Get('export')
  @Get('export')
  @Permissions({ entity: 'Invoice', action: 'READ' }) // Should also allow BUCH technically, but READ covers it if role has read permissions.
  async exportInvoices(@Query('format') format: string, @Res() res: Response) {
    // Fetch all invoices for export
    const result = await this.invoiceRepository.findAll({ limit: 10000 });
    const invoices = result.data;

    // Determine format (default to lexware)
    let exportFormat = ExportFormat.CSV;
    if (format === 'lexware') {
      exportFormat = ExportFormat.LEXWARE;
    } else if (format === 'datev') {
      exportFormat = ExportFormat.DATEV;
    }

    // Generate export buffer
    const buffer = this.exportService.exportData(invoices, {
      format: exportFormat,
    });

    // Set response headers for file download
    const filename = this.exportService.generateFilename(
      'rechnungen_lexware',
      exportFormat,
    );
    const contentType = this.exportService.getContentType(exportFormat);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  @Get()
  @Permissions({ entity: 'Invoice', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.invoiceService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
      customerId,
    });
  }

  @Post(':id/send')
  @Permissions({ entity: 'Invoice', action: 'UPDATE' })
  async send(@Param('id') id: string, @CurrentUser() user: any) {
    return this.invoiceService.sendInvoice(id, user);
  }

  @Get(':id')
  @Permissions({ entity: 'Invoice', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.invoiceService.findById(id);
  }

  @Post()
  @Permissions({ entity: 'Invoice', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: any) {
    return this.invoiceService.create(dto, user);
  }

  @Put(':id')
  @Permissions({ entity: 'Invoice', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @CurrentUser() user: any,
  ) {
    return this.invoiceService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions({ entity: 'Invoice', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.invoiceService.delete(id, user);
  }
}
