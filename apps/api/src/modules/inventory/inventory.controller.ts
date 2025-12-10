import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryMovementDto } from './inventory.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/v1/inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('movements')
  async recordMovement(
    @Body() dto: CreateInventoryMovementDto,
    @Request() req: any,
  ) {
    return this.inventoryService.recordMovement(dto, req.user.userId);
  }

  @Get('movements/:materialId')
  async getHistory(@Param('materialId') materialId: string) {
    return this.inventoryService.getHistory(materialId);
  }
}
