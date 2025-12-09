import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupplierContractService } from './supplier-contract.service';
import { CreateSupplierContractDto } from './dto/supplier-contract.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('api/v1')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SupplierContractController {
  constructor(private readonly service: SupplierContractService) {}

  @Get('suppliers/:supplierId/contracts')
  @Permissions({ entity: 'Supplier', action: 'READ' }) // Re-using Supplier permissions for now
  async findBySupplier(@Param('supplierId') supplierId: string) {
    return this.service.findBySupplier(supplierId);
  }

  @Get('supplier-contracts/:id')
  @Permissions({ entity: 'Supplier', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('suppliers/:supplierId/contracts')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' }) // Creating contract updates supplier context
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('supplierId') supplierId: string,
    @Body() dto: CreateSupplierContractDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Ensure supplierId in body matches param
    dto.supplierId = supplierId;
    return this.service.create(dto, user);
  }

  @Put('supplier-contracts/:id/approve')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' }) // Requires high privs ideally
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.approve(id, user);
  }

  @Get('supplier-contracts/:id/pdf')
  @Permissions({ entity: 'Supplier', action: 'READ' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.service.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="contract-${id}.pdf"`,
      'Content-Length': buffer.length.toString(),
    });
    res.end(buffer);
  }

  @Post('supplier-contracts/:id/send')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async send(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.sendContract(id, user);
  }

  @Put('supplier-contracts/:id/sign')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async sign(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.sign(id, user);
  }
}
