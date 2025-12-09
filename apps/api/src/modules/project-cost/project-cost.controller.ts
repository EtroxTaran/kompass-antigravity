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
} from '@nestjs/common';
import {
  ProjectCostService,
  CreateProjectCostDto,
  UpdateProjectCostDto,
} from './project-cost.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('project-costs')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectCostController {
  constructor(private readonly projectCostService: ProjectCostService) {}

  @Post()
  @Permissions({ entity: 'project-cost', action: 'CREATE' })
  create(@Body() createDto: CreateProjectCostDto, @Request() req: any) {
    return this.projectCostService.create(createDto, req.user.sub);
  }

  @Get()
  @Permissions({ entity: 'project-cost', action: 'READ' })
  findAll(@Query('projectId') projectId?: string) {
    return this.projectCostService.findAll(projectId);
  }

  @Get(':id')
  @Permissions({ entity: 'project-cost', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.projectCostService.findOne(id);
  }

  @Put(':id')
  @Permissions({ entity: 'project-cost', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectCostDto,
    @Request() req: any,
  ) {
    return this.projectCostService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @Permissions({ entity: 'project-cost', action: 'DELETE' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.projectCostService.delete(id, req.user.sub);
  }
}
