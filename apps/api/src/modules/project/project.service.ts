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
      customerId?: string;
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
    if (options.customerId) {
      return this.projectRepository.findByCustomer(options.customerId, options);
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
      limit,
      totalPages: Math.ceil(allProjects.length / limit),
    };
  }

  async findSimilar(id: string): Promise<Project[]> {
    const sourceProject = await this.findById(id);

    return this.findBySimilarity({
      tags: sourceProject.tags,
      budget: sourceProject.budget,
      customerId: sourceProject.customerId,
      excludeId: id,
    });
  }

  async findBySimilarity(criteria: {
    tags?: string[];
    budget?: number;
    customerId?: string;
    excludeId?: string;
  }): Promise<Project[]> {
    // Ideally use repository for filtering, but for now we fetch all and filter in memory
    // to match the existing logic pattern.
    const allProjectsResult = await this.projectRepository.findAll({
      limit: 1000,
    });

    // Initial filter by excludeId if provided
    const candidates = criteria.excludeId
      ? allProjectsResult.data.filter((p) => p._id !== criteria.excludeId)
      : allProjectsResult.data;

    const scoredVariables = candidates.map((p) => {
      let score = 0;

      // 1. Tags Match (High weight)
      if (criteria.tags && p.tags) {
        const commonTags = criteria.tags.filter((tag) =>
          p.tags?.includes(tag),
        );
        score += commonTags.length * 5;
      }

      // 2. Budget Match (Medium weight)
      if (criteria.budget && p.budget) {
        const diff = Math.abs(criteria.budget - p.budget);
        const percentDiff = diff / criteria.budget;
        if (percentDiff <= 0.1) score += 3; // within 10%
        else if (percentDiff <= 0.2) score += 1; // within 20%
      }

      // 3. Customer Match (Low weight - implied industry match)
      if (criteria.customerId && criteria.customerId === p.customerId) {
        score += 2;
      }

      return { project: p, score };
    });

    return scoredVariables
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.project)
      .slice(0, 5); // Return top 5
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
  async updateActualCost(
    projectId: string,
    costType: 'material' | 'labor' | 'subcontractor' | 'expenses',
    amountDelta: number,
    userId: string,
  ): Promise<Project> {
    const project = await this.findById(projectId);

    // Update specific cost component
    switch (costType) {
      case 'material':
        project.actualMaterialCost =
          (project.actualMaterialCost || 0) + amountDelta;
        break;
      case 'labor':
        project.actualLaborCost = (project.actualLaborCost || 0) + amountDelta;
        break;
      case 'subcontractor':
        project.actualSubcontractorCost =
          (project.actualSubcontractorCost || 0) + amountDelta;
        break;
      case 'expenses':
        project.actualExpenses = (project.actualExpenses || 0) + amountDelta;
        break;
    }

    // Recalculate Total
    project.actualTotalCost =
      (project.actualMaterialCost || 0) +
      (project.actualLaborCost || 0) +
      (project.actualSubcontractorCost || 0) +
      (project.actualExpenses || 0);

    // Update Status
    if (project.budget && project.budget > 0) {
      const percentage = (project.actualTotalCost / project.budget) * 100;
      if (percentage >= 100) {
        project.budgetStatus = 'Exceeded';
      } else if (percentage >= 80) {
        project.budgetStatus = 'Warning';
      } else {
        project.budgetStatus = 'OnTrack';
      }
    } else {
      project.budgetStatus = 'OnTrack'; // formatted as no budget = on track or maybe 'Unknown'? Defaulting to OnTrack for MVP
    }

    // Save
    return this.projectRepository.update(project._id, project, userId);
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
          budgetStatus: project.budgetStatus,
        },
      ]);
    } catch (e) {
      console.error('Failed to index project', e);
    }
  }
}
