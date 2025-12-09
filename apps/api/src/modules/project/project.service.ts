import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, Project } from './project.repository';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { SearchService } from '../search/search.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly searchService: SearchService,
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {},
  ) {
    if (options.search) {
      try {
        const searchResults = await this.searchService.search(
          'projects',
          options.search,
          {
            limit: options.limit || 20,
            offset: options.page
              ? (options.page - 1) * (options.limit || 20)
              : 0,
          },
        );
        const ids = searchResults.hits.map((h: any) => h.id);
        if (ids.length === 0) return { data: [], total: 0 };

        const projects = await Promise.all(
          ids.map((id) => this.projectRepository.findById(id)),
        );
        return {
          data: projects.filter((p) => p !== null),
          total: searchResults.estimatedTotalHits,
        };
      } catch (error) {
        return this.projectRepository.searchByName(options.search, options);
      }
    }
    if (options.status) {
      return this.projectRepository.findByStatus(options.status, options);
    }
    return this.projectRepository.findAll(options);
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Project with ID '${id}' not found`,
        resourceType: 'Project',
        resourceId: id,
      });
    }
    return project;
  }

  async findByProjectManager(
    managerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.projectRepository.findByProjectManager(managerId, options);
  }

  async findByTeamMember(
    memberId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.projectRepository.findByTeamMember(memberId, options);
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.projectRepository.findByCustomer(customerId, options);
  }

  async findMyProjects(
    userId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    // Find projects where user is manager or team member
    const [asManager, asTeamMember] = await Promise.all([
      this.projectRepository.findByProjectManager(userId, {
        ...options,
        limit: 1000,
      }),
      this.projectRepository.findByTeamMember(userId, {
        ...options,
        limit: 1000,
      }),
    ]);

    // Combine and deduplicate
    const projectsMap = new Map<string, Project>();
    [...asManager.data, ...asTeamMember.data].forEach((project) => {
      projectsMap.set(project._id, project);
    });

    const allProjects = Array.from(projectsMap.values());
    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;
    const paginatedData = allProjects.slice(start, start + limit);

    return {
      data: paginatedData,
      total: allProjects.length,
      page,
      limit,
      totalPages: Math.ceil(allProjects.length / limit),
    };
  }

  async create(
    dto: CreateProjectDto,
    user: { id: string; email?: string },
  ): Promise<Project> {
    // Auto-generate project number
    const projectNumber = await this.projectRepository.getNextProjectNumber();

    const projectData = {
      ...dto,
      projectNumber,
      status: dto.status || 'planning',
      teamMemberIds: dto.teamMemberIds || [],
      description: dto.description,
      offerId: dto.offerId,
    };

    const newProject = await this.projectRepository.create(
      projectData as Partial<Project>,
      user.id,
      user.email,
    );
    this.indexProject(newProject);
    return newProject;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    user: { id: string; email?: string },
  ): Promise<Project> {
    // Ensure project exists
    await this.findById(id);

    const updated = await this.projectRepository.update(
      id,
      dto as Partial<Project>,
      user.id,
      user.email,
    );
    this.indexProject(updated);
    return updated;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure project exists
    await this.findById(id);

    return this.projectRepository.delete(id, user.id, user.email);
  }
  private async indexProject(project: Project) {
    try {
      await this.searchService.addDocuments('projects', [
        {
          id: project._id,
          projectNumber: project.projectNumber,
          name: project.name,
          status: project.status,
          projectManagerId: project.projectManagerId,
          customerId: project.customerId,
        },
      ]);
    } catch (e) {
      console.error('Failed to index project', e);
    }
  }
}
