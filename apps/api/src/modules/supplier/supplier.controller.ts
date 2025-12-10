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
  BadRequestException,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { RateSupplierDto } from './dto/supplier-rating.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/suppliers')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @Permissions({ entity: 'Supplier', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('rating') rating?: string,
  ) {
    return this.supplierService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      rating,
    });
  }

  @Get(':id')
  @Permissions({ entity: 'Supplier', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.supplierService.findById(id);
  }

  @Post()
  @Permissions({ entity: 'Supplier', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSupplierDto, @CurrentUser() user: any) {
    return this.supplierService.create(dto, user);
  }

  @Put(':id')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() user: any,
  ) {
    return this.supplierService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions({ entity: 'Supplier', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.supplierService.delete(id, user);
  }
  @Put(':id/blacklist')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' }) // Ideally stricter permission, but 'UPDATE' + logic check or separate permission
  async blacklist(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    if (!user.roles.includes('GF')) {
      // Double check RBAC if plain guard isn't enough, though @Permissions is usually for fine grained.
      // Requirement says "GF only". If there is no specific 'BLACKLIST' permission, checking role manually is safe.
      // Or if we trust Permissions... The prompt implies strict RBAC.
      // Let's rely on standard practice: The user must have GF role.
      // Since we don't have a 'BLACKLIST' permission constant yet, explicit check is good.
    }
    // Actually, I should use the Permissions decorator if possible or just check roles inside.
    // Given the previous code uses @Permissions, I'll stick to that, but maybe I should add a check inside if 'BLACKLIST' action isn't defined.
    // But since I can't easily change the Permission enum/type right now without seeing it, I will assume UPDATE is the base, and I'll add a manual role check for extra safety if needed, OR just trust RBAC configuration.
    // BUT the requirement Says "GF only".
    // I will add a manual check for now to be safe as I don't know if 'BLACKLIST' action exists in the system.

    // UPDATE: better to just check roles manually here as it's a specific business rule "GF Only".
    if (!user.roles?.includes('GF')) {
      throw new BadRequestException('Only GF can blacklist suppliers');
    }

    return this.supplierService.blacklist(id, user, reason);
  }

  @Put(':id/reinstate')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async reinstate(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user.roles?.includes('GF')) {
      throw new BadRequestException('Only GF can reinstate suppliers');
    }
    return this.supplierService.reinstate(id, user);
  }
  @Put(':id/approve')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user.roles?.includes('GF')) {
      throw new BadRequestException('Only GF can approve suppliers');
    }
    return this.supplierService.approve(id, user);
  }

  @Put(':id/reject')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    if (!user.roles?.includes('GF')) {
      throw new BadRequestException('Only GF can reject suppliers');
    }
    if (!reason) {
      throw new BadRequestException('Reason is required for rejection');
    }
    return this.supplierService.reject(id, user, reason);
  }

  @Put(':id/rate')
  @Permissions({ entity: 'Supplier', action: 'UPDATE' })
  async rate(
    @Param('id') id: string,
    @Body() dto: RateSupplierDto,
    @CurrentUser() user: any,
  ) {
    return this.supplierService.submitRating(id, dto, user);
  }
}
