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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MileageService } from './mileage.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CreateMileageDto, UpdateMileageDto } from './dto/mileage.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/mileage')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MileageController {
  constructor(private readonly mileageService: MileageService) {}

  @Post()
  @Permissions({ entity: 'Mileage', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMileageDto: CreateMileageDto, @CurrentUser() user: any) {
    return this.mileageService.create(createMileageDto, user.userId);
  }

  @Get()
  @Permissions({ entity: 'Mileage', action: 'READ' })
  findAll() {
    return this.mileageService.findAll();
  }

  @Get(':id')
  @Permissions({ entity: 'Mileage', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.mileageService.findOne(id);
  }

  @Put(':id')
  @Permissions({ entity: 'Mileage', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateMileageDto: UpdateMileageDto,
    @CurrentUser() user: any,
  ) {
    return this.mileageService.update(id, updateMileageDto, user.userId);
  }

  @Delete(':id')
  @Permissions({ entity: 'Mileage', action: 'DELETE' })
  remove(@Param('id') id: string) {
    return this.mileageService.remove(id);
  }
}
