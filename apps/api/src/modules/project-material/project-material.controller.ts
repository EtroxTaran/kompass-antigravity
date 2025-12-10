import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRequirement } from '@kompass/shared';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/v1/projects/:projectId/materials')
@UseGuards(JwtAuthGuard)
export class ProjectMaterialController {
  constructor(
    private readonly projectMaterialService: ProjectMaterialService,
  ) {}

  @Get()
  async findByProject(@Param('projectId') projectId: string) {
    return this.projectMaterialService.findByProject(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: Partial<ProjectMaterialRequirement>,
    @Req() req: any,
  ) {
    return this.projectMaterialService.create(
      {
        ...dto,
        projectId,
      },
      req.user,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<ProjectMaterialRequirement>,
    @Req() req: any,
  ) {
    return this.projectMaterialService.update(id, dto, req.user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.projectMaterialService.delete(id, req.user);
  }
}
