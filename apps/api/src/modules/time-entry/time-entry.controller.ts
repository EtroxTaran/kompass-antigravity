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
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/time-entries')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Get()
  @Permissions({ entity: 'TimeEntry', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.timeEntryService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      projectId,
      userId,
    });
  }

  @Get('my')
  @Permissions({ entity: 'TimeEntry', action: 'READ' })
  async findMy(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.timeEntryService.findMyEntries(user.id, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  @Permissions({ entity: 'TimeEntry', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.timeEntryService.findById(id);
  }

  @Post()
  @Permissions({ entity: 'TimeEntry', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTimeEntryDto, @CurrentUser() user: any) {
    return this.timeEntryService.create(dto, user);
  }

  @Put(':id')
  @Permissions({ entity: 'TimeEntry', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTimeEntryDto,
    @CurrentUser() user: any,
  ) {
    return this.timeEntryService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions({ entity: 'TimeEntry', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.timeEntryService.delete(id, user);
  }
}
