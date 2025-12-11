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
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/projects')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * GET /api/v1/projects
   * List all projects (paginated)
   */
  @Get()
  @Permissions({ entity: 'Project', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.projectService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      status,
    });
  }

  /**
   * GET /api/v1/projects/my
   * List projects where current user is manager or team member
   */
  @Get('my')
  @Permissions({ entity: 'Project', action: 'READ' })
  async findMy(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.projectService.findMyProjects(user.id, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/projects/:id
   * Get a specific project by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Project', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  /**
   * GET /api/v1/projects/:id/similar
   * Get similar projects based on industry, budget, and tags
   */
  @Get(':id/similar')
  @Permissions({ entity: 'Project', action: 'READ' })
  async findSimilar(@Param('id') id: string) {
    return this.projectService.findSimilar(id);
  }

  /**
   * POST /api/v1/projects
   * Create a new project
   */
  @Post()
  @Permissions({ entity: 'Project', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectService.create(dto, user);
  }

  /**
   * PUT /api/v1/projects/:id
   * Update an existing project
   */
  @Put(':id')
  @Permissions({ entity: 'Project', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/projects/:id
   * Delete a project
   */
  @Delete(':id')
  @Permissions({ entity: 'Project', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.projectService.delete(id, user);
  }
}
