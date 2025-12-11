import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('locations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post()
  @Permissions({ entity: 'Location', action: 'CREATE' })
  create(@Body() createLocationDto: CreateLocationDto, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.locationService.create(createLocationDto, user.id, user.email);
  }

  @Get()
  @Permissions({ entity: 'Location', action: 'READ' })
  findAll(@Query('customerId') customerId?: string) {
    return this.locationService.findAll(customerId);
  }

  @Get(':id')
  @Permissions({ entity: 'Location', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @Permissions({ entity: 'Location', action: 'UPDATE' })
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.locationService.update(id, updateLocationDto, user.id, user.email);
  }

  @Delete(':id')
  @Permissions({ entity: 'Location', action: 'DELETE' })
  remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.locationService.remove(id, user.id, user.email);
  }
}
