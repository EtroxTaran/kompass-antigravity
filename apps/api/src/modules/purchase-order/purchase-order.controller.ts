import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  PurchaseOrderService,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './purchase-order.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

  @Post()
  @Permissions({ entity: 'purchase-order', action: 'CREATE' })
  create(@Body() createDto: CreatePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrderService.create(createDto, req.user.sub);
  }

  @Get()
  @Permissions({ entity: 'purchase-order', action: 'READ' })
  findAll(
    @Query('supplierId') supplierId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.purchaseOrderService.findAll(supplierId, projectId);
  }

  @Get(':id')
  @Permissions({ entity: 'purchase-order', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(id);
  }

  @Put(':id')
  @Permissions({ entity: 'purchase-order', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseOrderDto,
    @Request() req: any,
  ) {
    return this.purchaseOrderService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @Permissions({ entity: 'purchase-order', action: 'DELETE' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.purchaseOrderService.delete(id, req.user.sub);
  }

  /**
   * GET /purchase-orders/:id/pdf
   * Generate PDF for purchase order
   */
  @Get(':id/pdf')
  @Permissions({ entity: 'purchase-order', action: 'READ' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.purchaseOrderService.generatePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=purchase-order-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  /**
   * POST /purchase-orders/:id/send
   * Send purchase order via email
   */
  @Post(':id/send')
  @Permissions({ entity: 'purchase-order', action: 'UPDATE' })
  async sendOrder(@Param('id') id: string, @Request() req: any) {
    return this.purchaseOrderService.sendOrder(id, req.user.sub);
  }

  /**
   * POST /purchase-orders/:id/submit
   * Submit purchase order for approval
   */
  @Post(':id/submit')
  @Permissions({ entity: 'purchase-order', action: 'UPDATE' })
  async submitForApproval(@Param('id') id: string, @Request() req: any) {
    return this.purchaseOrderService.submitForApproval(id, req.user.sub);
  }

  /**
   * POST /purchase-orders/:id/approve
   * Approve purchase order
   */
  @Post(':id/approve')
  @Permissions({ entity: 'purchase-order', action: 'UPDATE' })
  async approve(@Param('id') id: string, @Request() req: any) {
    // Pass user roles to service for threshold check
    return this.purchaseOrderService.approve(id, req.user.sub, req.user.roles);
  }

  /**
   * POST /purchase-orders/:id/reject
   * Reject purchase order
   */
  @Post(':id/reject')
  @Permissions({ entity: 'purchase-order', action: 'UPDATE' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    if (!reason) {
      // Ideally use DTO validation, but manual check for simplicity here
      throw new Error('Rejection reason is required');
    }
    return this.purchaseOrderService.reject(id, req.user.sub, reason);
  }
}
