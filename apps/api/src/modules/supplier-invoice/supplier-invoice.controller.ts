import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    Request
} from '@nestjs/common';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { CreateSupplierInvoiceDto, UpdateSupplierInvoiceDto } from './dto/supplier-invoice.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('supplier-invoices')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SupplierInvoiceController {
    constructor(private readonly supplierInvoiceService: SupplierInvoiceService) { }

    @Post()
    @Permissions({ entity: 'SupplierInvoice', action: 'CREATE' })
    async create(@Body() createDto: CreateSupplierInvoiceDto, @Request() req: any) {
        return this.supplierInvoiceService.create(createDto, req.user.userId);
    }

    @Get()
    @Permissions({ entity: 'SupplierInvoice', action: 'READ' })
    async findAll(@Query('supplierId') supplierId?: string) {
        return this.supplierInvoiceService.findAll(supplierId);
    }

    @Get(':id')
    @Permissions({ entity: 'SupplierInvoice', action: 'READ' })
    async findOne(@Param('id') id: string) {
        return this.supplierInvoiceService.findOne(id);
    }

    @Put(':id')
    @Permissions({ entity: 'SupplierInvoice', action: 'UPDATE' })
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateSupplierInvoiceDto,
        @Request() req: any
    ) {
        return this.supplierInvoiceService.update(id, updateDto, req.user.userId);
    }

    @Put(':id/approve')
    @Permissions({ entity: 'SupplierInvoice', action: 'UPDATE' })
    async approve(@Param('id') id: string, @Request() req: any) {
        return this.supplierInvoiceService.approve(id, req.user.userId);
    }
}
