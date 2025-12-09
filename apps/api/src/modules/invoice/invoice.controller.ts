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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/invoices')
@UseGuards(JwtAuthGuard, RbacGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

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
