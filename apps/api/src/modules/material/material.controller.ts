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
import { MaterialService } from './material.service';
import { CreateMaterialDto, UpdateMaterialDto, AddSupplierPriceDto } from './dto/material.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/materials')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Get()
    @Permissions({ entity: 'Material', action: 'READ' })
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('category') category?: string,
    ) {
        return this.materialService.findAll({
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
            search,
            category,
        });
    }

    @Get(':id')
    @Permissions({ entity: 'Material', action: 'READ' })
    async findById(@Param('id') id: string) {
        return this.materialService.findById(id);
    }

    @Post()
    @Permissions({ entity: 'Material', action: 'CREATE' })
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() dto: CreateMaterialDto,
        @CurrentUser() user: any,
    ) {
        return this.materialService.create(dto, user);
    }

    @Put(':id')
    @Permissions({ entity: 'Material', action: 'UPDATE' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateMaterialDto,
        @CurrentUser() user: any,
    ) {
        return this.materialService.update(id, dto, user);
    }

    @Delete(':id')
    @Permissions({ entity: 'Material', action: 'DELETE' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: any,
    ) {
        await this.materialService.delete(id, user);
    }

    /**
     * Add or update a supplier price for a material
     * POST /api/v1/materials/:id/supplier-prices
     */
    @Post(':id/supplier-prices')
    @Permissions({ entity: 'Material', action: 'UPDATE' })
    async addSupplierPrice(
        @Param('id') id: string,
        @Body() dto: AddSupplierPriceDto,
        @CurrentUser() user: any,
    ) {
        return this.materialService.addSupplierPrice(id, dto, user);
    }

    /**
     * Remove a supplier price from a material
     * DELETE /api/v1/materials/:id/supplier-prices/:supplierId
     */
    @Delete(':id/supplier-prices/:supplierId')
    @Permissions({ entity: 'Material', action: 'UPDATE' })
    async removeSupplierPrice(
        @Param('id') id: string,
        @Param('supplierId') supplierId: string,
        @CurrentUser() user: any,
    ) {
        return this.materialService.removeSupplierPrice(id, supplierId, user);
    }
}

