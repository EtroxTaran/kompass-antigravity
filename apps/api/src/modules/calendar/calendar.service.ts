import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserTaskRepository } from '../user-task/user-task.repository';
import { ProjectTaskRepository } from '../project-task/project-task.repository';
import { ProjectRepository } from '../project/project.repository';
import { OpportunityRepository } from '../opportunity/opportunity.repository';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import {
  CalendarQueryDto,
  CalendarEventDto,
  CalendarEventsResponseDto,
  CalendarEventType,
  EventStatus,
  EventPriority,
  getEventColor,
} from './dto';

const MAX_DATE_RANGE_DAYS = 90;
const MAX_EVENTS = 1000;

@Injectable()
export class CalendarService {
  constructor(
    private readonly userTaskRepository: UserTaskRepository,
    private readonly projectTaskRepository: ProjectTaskRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  /**
   * Get aggregated calendar events from multiple sources.
   */
  async getEvents(
    query: CalendarQueryDto,
    user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    this.validateDateRange(query.startDate, query.endDate);

    const eventTypes = query.eventTypes || Object.values(CalendarEventType);
    const events: CalendarEventDto[] = [];

    // Fetch events in parallel
    const promises: Promise<CalendarEventDto[]>[] = [];

    if (eventTypes.includes(CalendarEventType.USER_TASK)) {
      promises.push(this.getUserTaskEvents(query, user));
    }
    if (eventTypes.includes(CalendarEventType.PROJECT_TASK)) {
      promises.push(this.getProjectTaskEvents(query, user));
    }
    if (eventTypes.includes(CalendarEventType.PROJECT_DEADLINE)) {
      promises.push(this.getProjectDeadlineEvents(query, user));
    }
    if (eventTypes.includes(CalendarEventType.OPPORTUNITY_CLOSE)) {
      promises.push(this.getOpportunityEvents(query, user));
    }

    const results = await Promise.all(promises);
    for (const result of results) {
      events.push(...result);
    }

    // Apply filters
    let filtered = this.filterEvents(events, query);

    // Sort by start date
    filtered.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Apply limit
    const total = filtered.length;
    if (filtered.length > (query.limit || MAX_EVENTS)) {
      filtered = filtered.slice(0, query.limit || MAX_EVENTS);
    }

    return {
      events: filtered,
      total,
      startDate: query.startDate,
      endDate: query.endDate,
    };
  }

  /**
   * Get personal calendar events (assigned to current user).
   */
  async getMyEvents(
    query: CalendarQueryDto,
    user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    return this.getEvents({ ...query, assignedTo: user.id }, user);
  }

  /**
   * Get team calendar events (GF/PLAN only).
   */
  async getTeamEvents(
    query: CalendarQueryDto,
    user: AuthenticatedUser,
  ): Promise<CalendarEventsResponseDto> {
    if (
      !user.roles.includes('GF') &&
      !user.roles.includes('PLAN') &&
      !user.roles.includes('ADMIN')
    ) {
      throw new ForbiddenException({
        type: 'https://api.kompass.de/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: 'Only GF and PLAN roles can access team calendar',
        requiredPermission: 'Calendar.VIEW_TEAM',
        userRoles: user.roles,
      });
    }
    return this.getEvents(query, user);
  }

  private validateDateRange(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Invalid date format',
        errors: [
          {
            field: 'startDate/endDate',
            message: 'Must be valid ISO date strings',
          },
        ],
      });
    }

    if (start > end) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'startDate must be before endDate',
      });
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > MAX_DATE_RANGE_DAYS) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: `Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days`,
        errors: [
          {
            field: 'dateRange',
            message: `Maximum allowed range is ${MAX_DATE_RANGE_DAYS} days`,
          },
        ],
      });
    }
  }

  private async getUserTaskEvents(
    query: CalendarQueryDto,
    user: AuthenticatedUser,
  ): Promise<CalendarEventDto[]> {
    try {
      // Cast to any since findByDateRange may not be implemented yet
      const repo = this.userTaskRepository as any;
      if (typeof repo.findByDateRange !== 'function') {
        return [];
      }
      const tasks = await repo.findByDateRange(
        query.startDate,
        query.endDate,
        query.assignedTo || (this.canViewAllTasks(user) ? undefined : user.id),
      );

      return tasks.map((task: any) => this.mapUserTaskToEvent(task));
    } catch {
      // Repository may not have findByDateRange method yet
      return [];
    }
  }

  private async getProjectTaskEvents(
    query: CalendarQueryDto,
    user: AuthenticatedUser,
  ): Promise<CalendarEventDto[]> {
    try {
      const repo = this.projectTaskRepository as any;
      if (typeof repo.findByDateRange !== 'function') {
        return [];
      }
      const tasks = await repo.findByDateRange(
        query.startDate,
        query.endDate,
        query.assignedTo || (this.canViewAllTasks(user) ? undefined : user.id),
      );

      return tasks.map((task: any) => this.mapProjectTaskToEvent(task));
    } catch {
      return [];
    }
  }

  private async getProjectDeadlineEvents(
    query: CalendarQueryDto,
    _user: AuthenticatedUser,
  ): Promise<CalendarEventDto[]> {
    try {
      const repo = this.projectRepository as any;
      if (typeof repo.findByDeadlineRange !== 'function') {
        return [];
      }
      const projects = await repo.findByDeadlineRange(
        query.startDate,
        query.endDate,
      );

      return projects.map((project: any) =>
        this.mapProjectDeadlineToEvent(project),
      );
    } catch {
      return [];
    }
  }

  private async getOpportunityEvents(
    query: CalendarQueryDto,
    _user: AuthenticatedUser,
  ): Promise<CalendarEventDto[]> {
    try {
      const repo = this.opportunityRepository as any;
      if (typeof repo.findByCloseDateRange !== 'function') {
        return [];
      }
      const opportunities = await repo.findByCloseDateRange(
        query.startDate,
        query.endDate,
      );

      return opportunities.map((opp: any) => this.mapOpportunityToEvent(opp));
    } catch {
      return [];
    }
  }

  private canViewAllTasks(user: AuthenticatedUser): boolean {
    return (
      user.roles.includes('GF') ||
      user.roles.includes('PLAN') ||
      user.roles.includes('ADMIN')
    );
  }

  private filterEvents(
    events: CalendarEventDto[],
    query: CalendarQueryDto,
  ): CalendarEventDto[] {
    let filtered = events;

    if (query.statuses && query.statuses.length > 0) {
      filtered = filtered.filter((e) => query.statuses!.includes(e.status));
    }

    if (query.priorities && query.priorities.length > 0) {
      filtered = filtered.filter(
        (e) => e.priority && query.priorities!.includes(e.priority),
      );
    }

    if (query.assignedTo) {
      filtered = filtered.filter((e) => e.assignedTo?.id === query.assignedTo);
    }

    return filtered;
  }

  private mapUserTaskToEvent(task: any): CalendarEventDto {
    const type = CalendarEventType.USER_TASK;
    const priority = this.mapPriority(task.priority);

    return {
      id: `ut-${task._id}`,
      title: task.title,
      description: task.description,
      type,
      status: this.mapStatus(task.status, task.dueDate),
      priority,
      startDate: task.dueDate || task.createdAt,
      endDate: task.dueDate || task.createdAt,
      allDay: true,
      assignedTo: task.assignedTo
        ? { id: task.assignedTo, name: task.assignedToName || 'Unbekannt' }
        : undefined,
      relatedEntity: task.relatedTo
        ? {
            type: task.relatedTo.type,
            id: task.relatedTo.id,
            name: task.relatedTo.name || 'Verknüpft',
          }
        : undefined,
      color: getEventColor(type, priority),
      sourceId: task._id,
      sourceType: 'UserTask',
    };
  }

  private mapProjectTaskToEvent(task: any): CalendarEventDto {
    const type = CalendarEventType.PROJECT_TASK;
    const priority = this.mapPriority(task.priority);

    return {
      id: `pt-${task._id}`,
      title: task.name || task.title,
      description: task.description,
      type,
      status: this.mapStatus(task.status, task.endDate),
      priority,
      startDate: task.startDate || task.createdAt,
      endDate: task.endDate || task.startDate || task.createdAt,
      allDay: !task.startTime,
      assignedTo: task.assignedTo
        ? { id: task.assignedTo, name: task.assignedToName || 'Unbekannt' }
        : undefined,
      relatedEntity: task.projectId
        ? {
            type: 'project',
            id: task.projectId,
            name: task.projectName || 'Projekt',
          }
        : undefined,
      color: getEventColor(type, priority),
      sourceId: task._id,
      sourceType: 'ProjectTask',
    };
  }

  private mapProjectDeadlineToEvent(project: any): CalendarEventDto {
    const type = CalendarEventType.PROJECT_DEADLINE;

    return {
      id: `pd-${project._id}`,
      title: `Deadline: ${project.name}`,
      description: project.description,
      type,
      status: this.mapStatus(project.status, project.endDate),
      startDate: project.endDate,
      endDate: project.endDate,
      allDay: true,
      relatedEntity: {
        type: 'project',
        id: project._id,
        name: project.name,
      },
      color: getEventColor(type),
      sourceId: project._id,
      sourceType: 'Project',
    };
  }

  private mapOpportunityToEvent(opportunity: any): CalendarEventDto {
    const type = CalendarEventType.OPPORTUNITY_CLOSE;

    return {
      id: `op-${opportunity._id}`,
      title: `Opportunity: ${opportunity.title}`,
      description: opportunity.description,
      type,
      status: this.mapStatus(opportunity.status, opportunity.expectedCloseDate),
      startDate: opportunity.expectedCloseDate,
      endDate: opportunity.expectedCloseDate,
      allDay: true,
      assignedTo: opportunity.ownerId
        ? {
            id: opportunity.ownerId,
            name: opportunity.ownerName || 'Unbekannt',
          }
        : undefined,
      relatedEntity: opportunity.customerId
        ? {
            type: 'customer',
            id: opportunity.customerId,
            name: opportunity.customerName || 'Kunde',
          }
        : undefined,
      color: getEventColor(type),
      sourceId: opportunity._id,
      sourceType: 'Opportunity',
    };
  }

  private mapStatus(status: string, dueDate?: string): EventStatus {
    if (status === 'completed') return EventStatus.COMPLETED;
    if (status === 'in_progress') return EventStatus.IN_PROGRESS;

    // Check if overdue
    if (dueDate) {
      const due = new Date(dueDate);
      const now = new Date();
      if (due < now && status !== 'completed') {
        return EventStatus.OVERDUE;
      }
    }

    return EventStatus.OPEN;
  }

  private mapPriority(priority?: string): EventPriority | undefined {
    if (!priority) return undefined;
    const map: Record<string, EventPriority> = {
      low: EventPriority.LOW,
      medium: EventPriority.MEDIUM,
      high: EventPriority.HIGH,
      urgent: EventPriority.URGENT,
      critical: EventPriority.URGENT,
    };
    return map[priority.toLowerCase()] || EventPriority.MEDIUM;
  }
}
