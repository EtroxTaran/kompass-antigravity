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
import { TourService } from './tour.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CreateTourDto, UpdateTourDto } from './dto/tour.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/tours')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @Permissions({ entity: 'Tour', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTourDto: CreateTourDto, @CurrentUser() user: any) {
    return this.tourService.create(createTourDto, user.userId);
  }

  @Get()
  @Permissions({ entity: 'Tour', action: 'READ' })
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  @Permissions({ entity: 'Tour', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Put(':id')
  @Permissions({ entity: 'Tour', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
    @CurrentUser() user: any,
  ) {
    return this.tourService.update(id, updateTourDto, user.userId);
  }

  @Delete(':id')
  @Permissions({ entity: 'Tour', action: 'DELETE' })
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
